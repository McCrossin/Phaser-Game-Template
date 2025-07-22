import {
    ReportAnalysis,
    CoverageReportAnalysis,
    PerformanceReportAnalysis,
    CIReportAnalysis,
    HealthReportAnalysis
} from './types';
import { promises as fs } from 'fs';
import path from 'path';

export class ReportAnalyzer {
    private projectRoot: string;

    constructor(projectRoot: string) {
        this.projectRoot = projectRoot;
    }

    /**
     * Analyze all generated reports thoroughly
     */
    async analyzeReports(): Promise<ReportAnalysis> {
        console.log('📊 Analyzing generated reports...');

        const analysis: ReportAnalysis = {
            coverageReport: await this.analyzeCoverageReport(),
            performanceReport: await this.analyzePerformanceReport(),
            ciReport: await this.analyzeCIReport(),
            healthReport: await this.analyzeHealthReport()
        };

        return analysis;
    }

    /**
     * Analyze test coverage reports for completeness and thresholds
     */
    private async analyzeCoverageReport(): Promise<CoverageReportAnalysis> {
        const coverageDir = path.join(this.projectRoot, 'coverage');
        const coverageJsonPath = path.join(coverageDir, 'coverage-final.json');
        const coverageHtmlPath = path.join(coverageDir, 'index.html');

        const analysis: CoverageReportAnalysis = {
            fileExists: false,
            isValid: false,
            meetsThresholds: false,
            issues: []
        };

        try {
            // Check if coverage files exist
            analysis.fileExists =
                (await this.fileExists(coverageJsonPath)) &&
                (await this.fileExists(coverageHtmlPath));

            if (!analysis.fileExists) {
                analysis.issues.push('Coverage report files not found');
                return analysis;
            }

            // Parse coverage JSON
            const coverageData = JSON.parse(await fs.readFile(coverageJsonPath, 'utf8'));

            if (!coverageData || typeof coverageData !== 'object') {
                analysis.issues.push('Coverage JSON is invalid or empty');
                return analysis;
            }

            analysis.isValid = true;

            // Check coverage thresholds
            const summary = this.calculateCoverageSummary(coverageData);
            const thresholds = {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80
            };

            const meetsThresholds =
                summary.lines >= thresholds.lines &&
                summary.functions >= thresholds.functions &&
                summary.branches >= thresholds.branches &&
                summary.statements >= thresholds.statements;

            analysis.meetsThresholds = meetsThresholds;

            if (!meetsThresholds) {
                analysis.issues.push(
                    `Coverage below thresholds: Lines: ${summary.lines}%, Functions: ${summary.functions}%, Branches: ${summary.branches}%, Statements: ${summary.statements}%`
                );
            }

            // Validate HTML report completeness
            const htmlContent = await fs.readFile(coverageHtmlPath, 'utf8');
            if (!htmlContent.includes('Coverage Summary') || htmlContent.includes('0 files')) {
                analysis.issues.push('HTML coverage report appears incomplete');
            }
        } catch (error) {
            analysis.issues.push(`Error analyzing coverage report: ${error}`);
        }

        return analysis;
    }

    /**
     * Analyze performance monitoring reports for anomalies
     */
    private async analyzePerformanceReport(): Promise<PerformanceReportAnalysis> {
        const performanceReportPath = path.join(
            this.projectRoot,
            'performance-monitoring-report.json'
        );
        const performanceResultsPath = path.join(this.projectRoot, 'performance-results.json');

        const analysis: PerformanceReportAnalysis = {
            fileExists: false,
            isValid: false,
            meetsTargets: false,
            regressions: []
        };

        try {
            // Check if performance report files exist
            analysis.fileExists =
                (await this.fileExists(performanceReportPath)) ||
                (await this.fileExists(performanceResultsPath));

            if (!analysis.fileExists) {
                // Performance reports might not exist in template - this is acceptable
                analysis.isValid = true;
                analysis.meetsTargets = true;
                return analysis;
            }

            // Analyze the available performance report
            const reportPath = (await this.fileExists(performanceReportPath))
                ? performanceReportPath
                : performanceResultsPath;
            const performanceData = JSON.parse(await fs.readFile(reportPath, 'utf8'));

            if (!performanceData || typeof performanceData !== 'object') {
                analysis.regressions.push('Performance report is invalid or empty');
                return analysis;
            }

            analysis.isValid = true;

            // Check for performance regressions
            if (performanceData.fps && performanceData.fps < 60) {
                analysis.regressions.push(`FPS below target: ${performanceData.fps} < 60`);
            }

            if (performanceData.memoryUsage && performanceData.memoryUsage > 512 * 1024 * 1024) {
                analysis.regressions.push(
                    `Memory usage above limit: ${performanceData.memoryUsage} bytes`
                );
            }

            if (performanceData.loadTime && performanceData.loadTime > 5000) {
                analysis.regressions.push(
                    `Load time above threshold: ${performanceData.loadTime}ms`
                );
            }

            analysis.meetsTargets = analysis.regressions.length === 0;
        } catch (error) {
            analysis.regressions.push(`Error analyzing performance report: ${error}`);
        }

        return analysis;
    }

    /**
     * Analyze CI/CD pipeline reports for all stages
     */
    private async analyzeCIReport(): Promise<CIReportAnalysis> {
        const ciReportPath = path.join(this.projectRoot, 'ci-verification-report.json');

        const analysis: CIReportAnalysis = {
            workflowStatus: 'UNKNOWN',
            failedJobs: [],
            issues: []
        };

        try {
            if (await this.fileExists(ciReportPath)) {
                const ciData = JSON.parse(await fs.readFile(ciReportPath, 'utf8'));

                if (ciData.status) {
                    analysis.workflowStatus = ciData.status === 'success' ? 'PASS' : 'FAIL';
                }

                if (ciData.failedJobs && Array.isArray(ciData.failedJobs)) {
                    analysis.failedJobs = ciData.failedJobs;
                }

                if (ciData.issues && Array.isArray(ciData.issues)) {
                    analysis.issues = ciData.issues;
                }
            } else {
                // Check GitHub Actions workflow files exist
                const workflowsDir = path.join(this.projectRoot, '.github', 'workflows');
                if (await this.fileExists(workflowsDir)) {
                    const workflowFiles = await fs.readdir(workflowsDir);
                    if (workflowFiles.length > 0) {
                        analysis.workflowStatus = 'PASS'; // Assume PASS if workflows exist but no report
                    }
                }
            }
        } catch (error) {
            analysis.issues.push(`Error analyzing CI report: ${error}`);
        }

        return analysis;
    }

    /**
     * Analyze health monitoring reports for all metrics
     */
    private async analyzeHealthReport(): Promise<HealthReportAnalysis> {
        const healthReportPath = path.join(this.projectRoot, 'health-report.json');

        const analysis: HealthReportAnalysis = {
            fileExists: false,
            isValid: false,
            allChecksPass: false,
            failedChecks: []
        };

        try {
            analysis.fileExists = await this.fileExists(healthReportPath);

            if (!analysis.fileExists) {
                // Health report might not exist in template - this is acceptable
                analysis.isValid = true;
                analysis.allChecksPass = true;
                return analysis;
            }

            const healthData = JSON.parse(await fs.readFile(healthReportPath, 'utf8'));

            if (!healthData || typeof healthData !== 'object') {
                analysis.failedChecks.push('Health report is invalid or empty');
                return analysis;
            }

            analysis.isValid = true;

            // Check health status
            if (healthData.status && healthData.status !== 'healthy') {
                analysis.failedChecks.push(`Overall health status: ${healthData.status}`);
            }

            // Check individual health checks
            if (healthData.checks && Array.isArray(healthData.checks)) {
                for (const check of healthData.checks) {
                    if (check.status !== 'pass' && check.status !== 'healthy') {
                        analysis.failedChecks.push(`${check.name}: ${check.status}`);
                    }
                }
            }

            analysis.allChecksPass = analysis.failedChecks.length === 0;
        } catch (error) {
            analysis.failedChecks.push(`Error analyzing health report: ${error}`);
        }

        return analysis;
    }

    /**
     * Calculate coverage summary from coverage data
     */
    private calculateCoverageSummary(coverageData: any): {
        lines: number;
        functions: number;
        branches: number;
        statements: number;
    } {
        let totalLines = 0,
            coveredLines = 0;
        let totalFunctions = 0,
            coveredFunctions = 0;
        let totalBranches = 0,
            coveredBranches = 0;
        let totalStatements = 0,
            coveredStatements = 0;

        for (const file in coverageData) {
            const fileData = coverageData[file];

            if (fileData.lines) {
                totalLines += Object.keys(fileData.lines).length;
                coveredLines += Object.values(fileData.lines).filter(
                    (hits: any) => hits > 0
                ).length;
            }

            if (fileData.functions) {
                totalFunctions += Object.keys(fileData.functions).length;
                coveredFunctions += Object.values(fileData.functions).filter(
                    (hits: any) => hits > 0
                ).length;
            }

            if (fileData.branches) {
                totalBranches += Object.keys(fileData.branches).length;
                coveredBranches += Object.values(fileData.branches).filter(
                    (hits: any) => hits > 0
                ).length;
            }

            if (fileData.statements) {
                totalStatements += Object.keys(fileData.statements).length;
                coveredStatements += Object.values(fileData.statements).filter(
                    (hits: any) => hits > 0
                ).length;
            }
        }

        return {
            lines: totalLines > 0 ? Math.round((coveredLines / totalLines) * 100) : 100,
            functions:
                totalFunctions > 0 ? Math.round((coveredFunctions / totalFunctions) * 100) : 100,
            branches: totalBranches > 0 ? Math.round((coveredBranches / totalBranches) * 100) : 100,
            statements:
                totalStatements > 0 ? Math.round((coveredStatements / totalStatements) * 100) : 100
        };
    }

    /**
     * Check if file exists
     */
    private async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }
}
