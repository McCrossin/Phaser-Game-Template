/**
 * Framework Health Checker - Comprehensive project health monitoring
 * Part of SETUP-006 Project Health & Documentation Enhancement
 */

import { promises as fs } from 'fs';
import { execSync } from 'child_process';
import path from 'path';

interface HealthThresholds {
    build: {
        max_time_ms: number;
        max_bundle_size_mb: number;
    };
    test: {
        max_time_ms: number;
        min_coverage_percent: number;
    };
    performance: {
        min_fps: number;
        max_memory_mb: number;
    };
    security: {
        max_vulnerabilities: number;
        allowed_severity: string[];
    };
    dependencies: {
        max_outdated: number;
        critical_severity_allowed: number;
    };
}

interface HealthCheckResult {
    category: string;
    score: number;
    maxScore: number;
    status: 'pass' | 'warn' | 'fail';
    details: string[];
    metrics?: Record<string, number | string>;
}

interface HealthReport {
    timestamp: string;
    overallScore: number;
    maxScore: number;
    status: 'healthy' | 'warning' | 'critical';
    categories: HealthCheckResult[];
    environment: {
        nodeVersion: string;
        npmVersion: string;
        platform: string;
        arch: string;
    };
}

class FrameworkHealthChecker {
    private thresholds: HealthThresholds;
    private projectRoot: string;

    constructor(projectRoot: string = process.cwd()) {
        this.projectRoot = projectRoot;
        this.thresholds = {
            build: {
                max_time_ms: 30000,
                max_bundle_size_mb: 5
            },
            test: {
                max_time_ms: 60000,
                min_coverage_percent: 70
            },
            performance: {
                min_fps: 30,
                max_memory_mb: 512
            },
            security: {
                max_vulnerabilities: 0,
                allowed_severity: ['low']
            },
            dependencies: {
                max_outdated: 5,
                critical_severity_allowed: 0
            }
        };
    }

    async loadThresholds(): Promise<void> {
        try {
            const thresholdsPath = path.join(
                this.projectRoot,
                'config/monitoring/health-thresholds.json'
            );
            const thresholdsData = await fs.readFile(thresholdsPath, 'utf-8');
            const loadedThresholds = JSON.parse(thresholdsData);
            this.thresholds = { ...this.thresholds, ...loadedThresholds };
        } catch {
            console.warn('Could not load health thresholds, using defaults');
        }
    }

    private execCommand(command: string): { stdout: string; success: boolean; time: number } {
        const startTime = Date.now();
        try {
            const stdout = execSync(command, {
                cwd: this.projectRoot,
                encoding: 'utf-8',
                timeout: 120000 // 2 minute timeout
            });
            return {
                stdout: stdout.toString(),
                success: true,
                time: Date.now() - startTime
            };
        } catch (error) {
            return {
                stdout: error instanceof Error ? error.message : 'Unknown error',
                success: false,
                time: Date.now() - startTime
            };
        }
    }

    async checkBuildHealth(): Promise<HealthCheckResult> {
        console.log('🔨 Checking build health...');
        const result: HealthCheckResult = {
            category: 'Build System',
            score: 0,
            maxScore: 30,
            status: 'fail',
            details: [],
            metrics: {}
        };

        // Check TypeScript compilation
        const tscCheck = this.execCommand('npx tsc --noEmit --project config/build/tsconfig.json');
        if (tscCheck.success) {
            result.score += 10;
            result.details.push('✅ TypeScript compilation successful');
        } else {
            result.details.push('❌ TypeScript compilation failed');
            result.details.push(`   Error: ${tscCheck.stdout.slice(0, 200)}...`);
        }

        // Check build process
        const buildCheck = this.execCommand('npm run build');
        if (buildCheck.success) {
            result.score += 15;
            result.details.push('✅ Build process successful');
            result.metrics!['buildTime'] = buildCheck.time;

            if (buildCheck.time <= this.thresholds.build.max_time_ms) {
                result.score += 5;
                result.details.push(
                    `✅ Build time within threshold (${buildCheck.time}ms <= ${this.thresholds.build.max_time_ms}ms)`
                );
            } else {
                result.details.push(
                    `⚠️ Build time exceeds threshold (${buildCheck.time}ms > ${this.thresholds.build.max_time_ms}ms)`
                );
            }
        } else {
            result.details.push('❌ Build process failed');
            result.details.push(`   Error: ${buildCheck.stdout.slice(0, 200)}...`);
        }

        // Check bundle size if dist exists
        try {
            const distStats = await fs.stat(path.join(this.projectRoot, 'dist'));
            if (distStats.isDirectory()) {
                const sizeCheck = this.execCommand('du -sh dist');
                if (sizeCheck.success) {
                    const sizeMatch = sizeCheck.stdout.match(/(\d+(?:\.\d+)?)[KMG]?/);
                    if (sizeMatch && sizeMatch[1]) {
                        result.details.push(`📦 Bundle size: ${sizeCheck.stdout.trim()}`);
                        result.metrics!['bundleSize'] = sizeMatch[1];
                    }
                }
            }
        } catch {
            result.details.push('⚠️ No dist directory found (build may not generate output)');
        }

        result.status = result.score >= 20 ? 'pass' : result.score >= 10 ? 'warn' : 'fail';
        return result;
    }

    async checkTestHealth(): Promise<HealthCheckResult> {
        console.log('🧪 Checking test health...');
        const result: HealthCheckResult = {
            category: 'Test Suite',
            score: 0,
            maxScore: 25,
            status: 'fail',
            details: [],
            metrics: {}
        };

        // Check test execution
        const testCheck = this.execCommand('npm run test:run');
        if (testCheck.success) {
            result.score += 15;
            result.details.push('✅ All tests passing');
            result.metrics!['testTime'] = testCheck.time;

            if (testCheck.time <= this.thresholds.test.max_time_ms) {
                result.score += 5;
                result.details.push(
                    `✅ Test execution within threshold (${testCheck.time}ms <= ${this.thresholds.test.max_time_ms}ms)`
                );
            } else {
                result.details.push(
                    `⚠️ Test execution exceeds threshold (${testCheck.time}ms > ${this.thresholds.test.max_time_ms}ms)`
                );
            }
        } else {
            result.details.push('❌ Tests failing');
            result.details.push(`   Output: ${testCheck.stdout.slice(0, 300)}...`);
        }

        // Check test coverage (if available)
        const coverageCheck = this.execCommand('npm run test:coverage');
        if (coverageCheck.success) {
            // Extract coverage percentage from output
            const coverageMatch = coverageCheck.stdout.match(
                /All files[^|]*\|[^|]*\|[^|]*\|[^|]*\|[^|]*(\d+(?:\.\d+)?)/
            );
            if (coverageMatch && coverageMatch[1]) {
                const coverage = parseFloat(coverageMatch[1]);
                result.metrics!['coverage'] = coverage;
                if (coverage >= this.thresholds.test.min_coverage_percent) {
                    result.score += 5;
                    result.details.push(
                        `✅ Test coverage acceptable (${coverage}% >= ${this.thresholds.test.min_coverage_percent}%)`
                    );
                } else {
                    result.details.push(
                        `⚠️ Test coverage below threshold (${coverage}% < ${this.thresholds.test.min_coverage_percent}%)`
                    );
                }
            } else {
                result.details.push('⚠️ Could not parse coverage information');
            }
        } else {
            result.details.push('ℹ️ Coverage information not available');
        }

        result.status = result.score >= 15 ? 'pass' : result.score >= 10 ? 'warn' : 'fail';
        return result;
    }

    async checkPerformanceHealth(): Promise<HealthCheckResult> {
        console.log('⚡ Checking performance health...');
        const result: HealthCheckResult = {
            category: 'Performance',
            score: 0,
            maxScore: 20,
            status: 'fail',
            details: [],
            metrics: {}
        };

        // Check if performance tests exist and run them
        try {
            await fs.access(path.join(this.projectRoot, 'scripts/test-performance.sh'));
            const perfCheck = this.execCommand('npm run test:performance');

            if (perfCheck.success) {
                result.score += 15;
                result.details.push('✅ Performance tests executed successfully');

                // Try to extract FPS information
                const fpsMatch = perfCheck.stdout.match(/FPS[:\s]*(\d+(?:\.\d+)?)/i);
                if (fpsMatch && fpsMatch[1]) {
                    const fps = parseFloat(fpsMatch[1]);
                    result.metrics!['fps'] = fps;
                    if (fps >= this.thresholds.performance.min_fps) {
                        result.score += 5;
                        result.details.push(
                            `✅ FPS meets minimum requirement (${fps} >= ${this.thresholds.performance.min_fps})`
                        );
                    } else {
                        result.details.push(
                            `⚠️ FPS below minimum requirement (${fps} < ${this.thresholds.performance.min_fps})`
                        );
                    }
                }
            } else {
                result.details.push('❌ Performance tests failed');
                result.details.push(`   Output: ${perfCheck.stdout.slice(0, 200)}...`);
            }
        } catch {
            result.score += 10; // Partial credit if no performance tests exist yet
            result.details.push(
                'ℹ️ No performance test script found - this is acceptable for early development'
            );
        }

        result.status = result.score >= 15 ? 'pass' : result.score >= 8 ? 'warn' : 'fail';
        return result;
    }

    async checkSecurityHealth(): Promise<HealthCheckResult> {
        console.log('🔒 Checking security health...');
        const result: HealthCheckResult = {
            category: 'Security',
            score: 0,
            maxScore: 15,
            status: 'fail',
            details: [],
            metrics: {}
        };

        // Check for security vulnerabilities
        const auditCheck = this.execCommand('npm audit --audit-level=moderate');
        if (auditCheck.success) {
            result.score += 10;
            result.details.push('✅ No moderate or high security vulnerabilities found');
        } else {
            // Parse audit output for vulnerability count
            const vulnMatch = auditCheck.stdout.match(/(\d+) vulnerabilities/);
            if (vulnMatch && vulnMatch[1]) {
                const vulnCount = parseInt(vulnMatch[1]);
                result.metrics!['vulnerabilities'] = vulnCount;
                if (vulnCount <= this.thresholds.security.max_vulnerabilities) {
                    result.score += 5;
                    result.details.push(
                        `⚠️ ${vulnCount} vulnerabilities found but within threshold`
                    );
                } else {
                    result.details.push(
                        `❌ ${vulnCount} vulnerabilities found (exceeds threshold of ${this.thresholds.security.max_vulnerabilities})`
                    );
                }
            } else {
                result.details.push('❌ Security audit failed or returned unexpected format');
            }
        }

        // Check for common security files
        const securityFiles = [
            'SECURITY.md',
            '.github/SECURITY.md',
            'security.txt',
            '.well-known/security.txt'
        ];
        let securityFileFound = false;
        for (const file of securityFiles) {
            try {
                await fs.access(path.join(this.projectRoot, file));
                securityFileFound = true;
                result.details.push(`✅ Security policy found: ${file}`);
                break;
            } catch {
                // File doesn't exist, continue checking
            }
        }

        if (securityFileFound) {
            result.score += 5;
        } else {
            result.details.push('ℹ️ No security policy file found (recommended but not required)');
        }

        result.status = result.score >= 10 ? 'pass' : result.score >= 5 ? 'warn' : 'fail';
        return result;
    }

    async checkDependencyHealth(): Promise<HealthCheckResult> {
        console.log('📦 Checking dependency health...');
        const result: HealthCheckResult = {
            category: 'Dependencies',
            score: 0,
            maxScore: 10,
            status: 'fail',
            details: [],
            metrics: {}
        };

        // Check for outdated dependencies
        const outdatedCheck = this.execCommand('npm outdated --json');
        try {
            if (outdatedCheck.stdout.trim()) {
                const outdatedData = JSON.parse(outdatedCheck.stdout);
                const outdatedCount = Object.keys(outdatedData).length;
                result.metrics!['outdatedDependencies'] = outdatedCount;

                if (outdatedCount <= this.thresholds.dependencies.max_outdated) {
                    result.score += 5;
                    result.details.push(
                        `✅ Outdated dependencies within threshold (${outdatedCount} <= ${this.thresholds.dependencies.max_outdated})`
                    );
                } else {
                    result.details.push(
                        `⚠️ Too many outdated dependencies (${outdatedCount} > ${this.thresholds.dependencies.max_outdated})`
                    );
                }
            } else {
                result.score += 5;
                result.details.push('✅ All dependencies are up to date');
            }
        } catch {
            if (outdatedCheck.stdout.includes('No package.json found')) {
                result.details.push('❌ No package.json found');
            } else {
                result.score += 3; // Partial credit for having dependencies but outdated check failed
                result.details.push('⚠️ Could not check outdated dependencies status');
            }
        }

        // Check package.json exists and is valid
        try {
            const packageJsonPath = path.join(this.projectRoot, 'package.json');
            const packageData = await fs.readFile(packageJsonPath, 'utf-8');
            JSON.parse(packageData); // Validate JSON
            result.score += 5;
            result.details.push('✅ package.json is valid');
        } catch {
            result.details.push('❌ package.json is missing or invalid');
        }

        result.status = result.score >= 8 ? 'pass' : result.score >= 5 ? 'warn' : 'fail';
        return result;
    }

    async generateReport(): Promise<HealthReport> {
        await this.loadThresholds();

        console.log('🏥 Starting comprehensive health check...\n');

        const categories = await Promise.all([
            this.checkBuildHealth(),
            this.checkTestHealth(),
            this.checkPerformanceHealth(),
            this.checkSecurityHealth(),
            this.checkDependencyHealth()
        ]);

        const totalScore = categories.reduce((sum, cat) => sum + cat.score, 0);
        const maxTotalScore = categories.reduce((sum, cat) => sum + cat.maxScore, 0);

        const overallStatus =
            totalScore >= maxTotalScore * 0.8
                ? 'healthy'
                : totalScore >= maxTotalScore * 0.6
                  ? 'warning'
                  : 'critical';

        const report: HealthReport = {
            timestamp: new Date().toISOString(),
            overallScore: totalScore,
            maxScore: maxTotalScore,
            status: overallStatus,
            categories,
            environment: {
                nodeVersion: process.version,
                npmVersion: this.execCommand('npm --version').stdout.trim(),
                platform: process.platform,
                arch: process.arch
            }
        };

        return report;
    }

    async run(): Promise<void> {
        try {
            const report = await this.generateReport();

            console.log('\n' + '='.repeat(60));
            console.log('🏥 FRAMEWORK HEALTH REPORT');
            console.log('='.repeat(60));
            console.log(`📅 Generated: ${new Date(report.timestamp).toLocaleString()}`);
            console.log(`🎯 Overall Health Score: ${report.overallScore}/${report.maxScore}`);
            console.log(`📊 Health Status: ${report.status.toUpperCase()}`);
            console.log(
                `💻 Environment: ${report.environment.platform} (${report.environment.arch})`
            );
            console.log(`🟢 Node.js: ${report.environment.nodeVersion}`);
            console.log(`📦 npm: ${report.environment.npmVersion}`);
            console.log('');

            // Display category results
            for (const category of report.categories) {
                const statusIcon =
                    category.status === 'pass' ? '✅' : category.status === 'warn' ? '⚠️' : '❌';
                console.log(
                    `${statusIcon} ${category.category}: ${category.score}/${category.maxScore}`
                );

                for (const detail of category.details) {
                    console.log(`   ${detail}`);
                }

                if (category.metrics && Object.keys(category.metrics).length > 0) {
                    console.log(`   📈 Metrics: ${JSON.stringify(category.metrics)}`);
                }
                console.log('');
            }

            // Summary and recommendations
            console.log('='.repeat(60));
            if (report.status === 'healthy') {
                console.log('🎉 Project health is EXCELLENT! Keep up the great work.');
            } else if (report.status === 'warning') {
                console.log('⚠️ Project health needs ATTENTION. Review warnings above.');
            } else {
                console.log('🚨 Project health is CRITICAL. Immediate action required.');
            }
            console.log('='.repeat(60));

            // Write JSON report for CI/automation
            const reportPath = path.join(this.projectRoot, 'health-report.json');
            await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
            console.log(`📄 Detailed report saved to: ${reportPath}`);

            // Exit with appropriate code
            process.exit(report.status === 'critical' ? 1 : 0);
        } catch (error) {
            console.error('❌ Health check failed with error:', error);
            process.exit(1);
        }
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const checker = new FrameworkHealthChecker();
    checker.run();
}

export { FrameworkHealthChecker, type HealthReport, type HealthCheckResult };
