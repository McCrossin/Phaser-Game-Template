/**
 * Test Performance Analyzer
 * Analyzes test execution to identify bottlenecks and optimization opportunities
 */

import { execSync } from 'child_process';
import { writeFileSync, readFileSync, existsSync } from 'fs';
import { resolve } from 'path';

interface TestResult {
    name: string;
    duration: number;
    status: 'passed' | 'failed' | 'skipped' | 'queued' | 'hanging';
    file: string;
    memory?: number;
    retries?: number;
    isHanging?: boolean; // New field to track hanging tests
}

interface BottleneckAnalysis {
    slowestTests: TestResult[];
    slowestFiles: { file: string; totalDuration: number; testCount: number }[];
    queuedTests: TestResult[];
    hangingTests: TestResult[]; // New field for hanging tests
    memoryIntensiveTests: TestResult[];
    flakyTests: TestResult[];
    recommendations: string[];
    performanceTargets: {
        unitTestTarget: number; // 30 seconds
        integrationTestTarget: number; // 2 minutes
        memoryTarget: number; // 512MB
        zeroHangingTests: boolean;
    };
}

interface PerformanceReport {
    timestamp: string;
    environment: 'local' | 'ci';
    totalDuration: number;
    totalTests: number;
    passedTests: number;
    failedTests: number;
    queuedTests: number;
    bottlenecks: BottleneckAnalysis;
    trends: {
        avgDurationTrend: number; // Percentage change from last run
        memoryTrend: number;
        flakinessRatio: number;
    };
}

class TestPerformanceAnalyzer {
    private readonly workspaceRoot: string;
    private readonly reportPath: string;
    private readonly historyPath: string;

    constructor(workspaceRoot: string = process.cwd()) {
        this.workspaceRoot = workspaceRoot;
        this.reportPath = resolve(workspaceRoot, 'test-performance-report.json');
        this.historyPath = resolve(workspaceRoot, 'test-performance-history.json');
    }

    /**
     * Analyze test performance and generate recommendations
     */
    async analyzePerformance(): Promise<PerformanceReport> {
        console.log('🔍 Analyzing test performance...');

        // Run tests with performance monitoring
        const testResults = await this.runTestsWithMonitoring();

        // Analyze bottlenecks
        const bottlenecks = this.analyzeBottlenecks(testResults);

        // Generate performance report
        const report = this.generateReport(testResults, bottlenecks);

        // Save report and update history
        this.saveReport(report);
        this.updateHistory(report);

        // Display recommendations
        this.displayRecommendations(report);

        return report;
    }

    /**
     * Run tests with performance monitoring enabled
     */
    private async runTestsWithMonitoring(): Promise<TestResult[]> {
        const startTime = Date.now();

        try {
            // Run tests with JSON reporter for detailed results
            const command = 'npm run test:run -- --reporter=json';
            const output = execSync(command, {
                encoding: 'utf8',
                cwd: this.workspaceRoot,
                maxBuffer: 1024 * 1024 * 10 // 10MB buffer
            });

            const results = this.parseTestResults(output);
            const endTime = Date.now();

            console.log(`✅ Test execution completed in ${endTime - startTime}ms`);
            return results;
        } catch (error) {
            console.error('❌ Test execution failed:', error);
            return [];
        }
    }

    /**
     * Parse test results from JSON output
     */
    private parseTestResults(output: string): TestResult[] {
        try {
            // Extract JSON from output (vitest JSON output)
            const lines = output.split('\n');
            const jsonLine = lines.find(
                line => line.startsWith('{') && line.includes('"numTotalTests"')
            );

            if (!jsonLine) {
                console.warn('⚠️ No JSON test results found');
                return [];
            }

            const data = JSON.parse(jsonLine);
            const results: TestResult[] = [];

            // Process test files
            if (data.testResults) {
                for (const fileResult of data.testResults) {
                    const fileName = fileResult.name || 'unknown';

                    if (fileResult.assertionResults) {
                        for (const test of fileResult.assertionResults) {
                            results.push({
                                name: test.title || test.name || 'unnamed test',
                                duration: test.duration || 0,
                                status: this.mapTestStatus(test.status),
                                file: fileName,
                                memory: test.memoryUsage,
                                retries: test.retryReasons?.length || 0
                            });
                        }
                    }
                }
            }

            return results;
        } catch (error) {
            console.error('❌ Failed to parse test results:', error);
            return [];
        }
    }

    /**
     * Map test status to standardized format
     */
    private mapTestStatus(status: string): TestResult['status'] {
        switch (status) {
            case 'passed':
                return 'passed';
            case 'failed':
                return 'failed';
            case 'skipped':
                return 'skipped';
            case 'pending':
                return 'queued';
            default:
                return 'queued';
        }
    }

    /**
     * Analyze performance bottlenecks
     */
    private analyzeBottlenecks(testResults: TestResult[]): BottleneckAnalysis {
        const slowestTests = testResults
            .filter(test => test.status === 'passed' || test.status === 'failed')
            .sort((a, b) => b.duration - a.duration)
            .slice(0, 10);

        const fileGroups = new Map<string, { totalDuration: number; testCount: number }>();
        for (const test of testResults) {
            const existing = fileGroups.get(test.file) || { totalDuration: 0, testCount: 0 };
            fileGroups.set(test.file, {
                totalDuration: existing.totalDuration + test.duration,
                testCount: existing.testCount + 1
            });
        }

        const slowestFiles = Array.from(fileGroups.entries())
            .map(([file, stats]) => ({ file, ...stats }))
            .sort((a, b) => b.totalDuration - a.totalDuration)
            .slice(0, 5);

        const queuedTests = testResults.filter(test => test.status === 'queued');

        // Identify hanging tests (tests that took too long or status is hanging)
        const hangingTests = testResults.filter(
            test =>
                test.status === 'hanging' ||
                test.duration > 15000 || // 15 seconds threshold
                test.isHanging
        );

        const memoryIntensiveTests = testResults
            .filter(test => test.memory && test.memory > 50 * 1024 * 1024) // 50MB+
            .sort((a, b) => (b.memory || 0) - (a.memory || 0));

        const flakyTests = testResults.filter(test => (test.retries || 0) > 0);

        const performanceTargets = {
            unitTestTarget: 30000, // 30 seconds
            integrationTestTarget: 120000, // 2 minutes
            memoryTarget: 512 * 1024 * 1024, // 512MB
            zeroHangingTests: hangingTests.length === 0
        };

        const recommendations = this.generateRecommendations({
            slowestTests,
            slowestFiles,
            queuedTests,
            hangingTests,
            memoryIntensiveTests,
            flakyTests,
            performanceTargets
        });

        return {
            slowestTests,
            slowestFiles,
            queuedTests,
            hangingTests,
            memoryIntensiveTests,
            flakyTests,
            performanceTargets,
            recommendations
        };
    }

    /**
     * Generate optimization recommendations
     */
    private generateRecommendations(
        analysis: Omit<BottleneckAnalysis, 'recommendations'>
    ): string[] {
        const recommendations: string[] = [];

        // Hanging test recommendations (CRITICAL)
        if (analysis.hangingTests.length > 0) {
            recommendations.push(
                `🚨 CRITICAL: ${analysis.hangingTests.length} hanging tests detected`,
                '   → Check for unresolved promises, missing awaits, or infinite loops',
                '   → Add explicit timeouts to async operations',
                '   → Use vi.useFakeTimers() for timer-based tests'
            );
        }

        // Performance target validation
        if (!analysis.performanceTargets.zeroHangingTests) {
            recommendations.push('❌ Zero hanging tests target: FAILED');
        }

        // Slow test recommendations
        if (analysis.slowestTests.length > 0) {
            const slowestTest = analysis.slowestTests[0];
            if (slowestTest && slowestTest.duration > 10000) {
                // 10 seconds
                recommendations.push(
                    `🐌 Consider optimizing "${slowestTest.name}" (${slowestTest.duration}ms) - use mocks for heavy operations`
                );
            }
        }

        // Queued test recommendations
        if (analysis.queuedTests.length > 0) {
            recommendations.push(
                `⏳ ${analysis.queuedTests.length} tests remained queued - check for hanging async operations or timeouts`
            );
        }

        // Memory recommendations
        if (analysis.memoryIntensiveTests.length > 0) {
            recommendations.push(
                `🧠 ${analysis.memoryIntensiveTests.length} memory-intensive tests found - implement proper cleanup and mocking`
            );
        }

        // Flaky test recommendations
        if (analysis.flakyTests.length > 0) {
            recommendations.push(
                `🎲 ${analysis.flakyTests.length} flaky tests detected - improve test isolation and remove timing dependencies`
            );
        }

        // File-level recommendations
        if (analysis.slowestFiles.length > 0) {
            const slowestFile = analysis.slowestFiles[0];
            if (slowestFile && slowestFile.totalDuration > 30000) {
                // 30 seconds
                recommendations.push(
                    `📁 Split "${slowestFile.file}" into smaller test files (${slowestFile.totalDuration}ms total)`
                );
            }
        }

        return recommendations;
    }

    /**
     * Generate performance report
     */
    private generateReport(
        testResults: TestResult[],
        bottlenecks: BottleneckAnalysis
    ): PerformanceReport {
        const environment = process.env['CI'] === 'true' ? 'ci' : 'local';
        const totalDuration = testResults.reduce((sum, test) => sum + test.duration, 0);
        const passedTests = testResults.filter(test => test.status === 'passed').length;
        const failedTests = testResults.filter(test => test.status === 'failed').length;
        const queuedTests = testResults.filter(test => test.status === 'queued').length;

        // Calculate trends from previous run
        const trends = this.calculateTrends(testResults);

        return {
            timestamp: new Date().toISOString(),
            environment,
            totalDuration,
            totalTests: testResults.length,
            passedTests,
            failedTests,
            queuedTests,
            bottlenecks,
            trends
        };
    }

    /**
     * Calculate performance trends
     */
    private calculateTrends(currentResults: TestResult[]): PerformanceReport['trends'] {
        const history = this.loadHistory();
        if (history.length < 2) {
            return { avgDurationTrend: 0, memoryTrend: 0, flakinessRatio: 0 };
        }

        const lastRun = history[history.length - 1];
        const currentAvgDuration =
            currentResults.reduce((sum, test) => sum + test.duration, 0) / currentResults.length;
        const lastAvgDuration = lastRun ? lastRun.totalDuration / lastRun.totalTests : 0;

        const avgDurationTrend = ((currentAvgDuration - lastAvgDuration) / lastAvgDuration) * 100;

        // Calculate flakiness ratio
        const flakyCount = currentResults.filter(test => (test.retries || 0) > 0).length;
        const flakinessRatio = (flakyCount / currentResults.length) * 100;

        return {
            avgDurationTrend,
            memoryTrend: 0, // Would need historical memory data
            flakinessRatio
        };
    }

    /**
     * Save performance report
     */
    private saveReport(report: PerformanceReport): void {
        try {
            writeFileSync(this.reportPath, JSON.stringify(report, null, 2));
            console.log(`📊 Performance report saved to ${this.reportPath}`);
        } catch (error) {
            console.error('❌ Failed to save performance report:', error);
        }
    }

    /**
     * Update performance history
     */
    private updateHistory(report: PerformanceReport): void {
        try {
            const history = this.loadHistory();
            history.push(report);

            // Keep only last 10 runs
            const recentHistory = history.slice(-10);

            writeFileSync(this.historyPath, JSON.stringify(recentHistory, null, 2));
        } catch (error) {
            console.error('❌ Failed to update performance history:', error);
        }
    }

    /**
     * Load performance history
     */
    private loadHistory(): PerformanceReport[] {
        try {
            if (existsSync(this.historyPath)) {
                const data = readFileSync(this.historyPath, 'utf8');
                return JSON.parse(data);
            }
        } catch (error) {
            console.warn('⚠️ Failed to load performance history:', error);
        }
        return [];
    }

    /**
     * Display performance recommendations
     */
    private displayRecommendations(report: PerformanceReport): void {
        console.log('\n📈 Test Performance Analysis');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log(`Environment: ${report.environment}`);
        console.log(`Total Duration: ${(report.totalDuration / 1000).toFixed(2)}s`);
        console.log(
            `Total Tests: ${report.totalTests} (${report.passedTests} passed, ${report.failedTests} failed, ${report.queuedTests} queued)`
        );

        if (report.trends.avgDurationTrend !== 0) {
            const trend = report.trends.avgDurationTrend > 0 ? '↗️' : '↘️';
            console.log(
                `Performance Trend: ${trend} ${Math.abs(report.trends.avgDurationTrend).toFixed(1)}%`
            );
        }

        if (report.bottlenecks.recommendations.length > 0) {
            console.log('\n🎯 Optimization Recommendations:');
            for (const recommendation of report.bottlenecks.recommendations) {
                console.log(`  ${recommendation}`);
            }
        } else {
            console.log('\n✅ No performance issues detected!');
        }

        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    }
}

// CLI execution
if (require.main === module) {
    const analyzer = new TestPerformanceAnalyzer();
    analyzer.analyzePerformance().catch(error => {
        console.error('❌ Performance analysis failed:', error);
        process.exit(1);
    });
}

export { TestPerformanceAnalyzer };
export type { TestResult, BottleneckAnalysis, PerformanceReport };
