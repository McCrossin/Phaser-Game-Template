#!/usr/bin/env npx tsx
/**
 * Template Audit CLI - Complete template quality audit execution script
 * Orchestrates comprehensive template validation and cleanup
 */

import { TemplateAuditor } from './template-auditor.js';
import { ArtifactCleaner } from './artifact-cleaner.js';
import { ReportGenerator } from './report-generator.js';

interface AuditOptions {
    includeCleanup: boolean;
    dryRun: boolean;
    outputFormat: ('html' | 'json' | 'markdown' | 'console')[];
    configPath?: string;
    verbose: boolean;
}

class TemplateAuditCLI {
    private options: AuditOptions;

    constructor(options: AuditOptions) {
        this.options = options;
    }

    async runCompleteAudit(): Promise<void> {
        const startTime = Date.now();

        this.log('🚀 Starting comprehensive template audit...', 'info');
        this.printBanner();

        try {
            // Step 1: Run core audit
            this.log('\n📋 Phase 1: Quality Assessment', 'info');
            // Force mock mode for WSL safety
            const auditor = new TemplateAuditor(this.options.configPath, true);
            const auditReport = await auditor.runComprehensiveAudit();

            // Step 2: Cleanup (if requested)
            let cleanupResults: any = null;
            if (this.options.includeCleanup) {
                this.log('\n🧹 Phase 2: Template Cleanup', 'info');
                const cleaner = new ArtifactCleaner({
                    dryRun: this.options.dryRun,
                    backupBeforeDelete: !this.options.dryRun
                });

                cleanupResults = await Promise.all([
                    cleaner.cleanupDevelopmentFiles(),
                    cleaner.removeUnusedDependencies(),
                    cleaner.optimizeTemplateStructure()
                ]);
            }

            // Step 3: Generate Reports
            this.log('\n📊 Phase 3: Report Generation', 'info');
            const reportGenerator = new ReportGenerator({
                formats: this.options.outputFormat,
                includeDetails: this.options.verbose,
                includeRecommendations: true
            });

            const reportFiles = await reportGenerator.generateReport(auditReport);

            // Step 4: Summary
            this.printSummary(auditReport, cleanupResults, reportFiles, startTime);

            // Exit with appropriate code
            process.exit(auditReport.passed ? 0 : 1);
        } catch (error) {
            this.log(`❌ Audit failed: ${(error as Error).message}`, 'error');
            if (this.options.verbose) {
                console.error(error);
            }
            process.exit(1);
        }
    }

    private printBanner(): void {
        console.log(`
╔══════════════════════════════════════════════════════════════════════════════╗
║                    🎮 PHASER GAME TEMPLATE AUDITOR                          ║
║                     Professional Quality Assurance                          ║
╚══════════════════════════════════════════════════════════════════════════════╝
        `);
    }

    private printSummary(
        auditReport: any,
        cleanupResults: any,
        reportFiles: string[],
        startTime: number
    ): void {
        const duration = Date.now() - startTime;

        console.log('\n' + '='.repeat(80));
        console.log('📊 AUDIT SUMMARY');
        console.log('='.repeat(80));

        // Quality Results
        const qualityIcon = auditReport.passed ? '✅' : '❌';
        const qualityLevel = this.getQualityLevel(auditReport.percentage);

        console.log(`\n🎯 QUALITY ASSESSMENT:`);
        console.log(
            `${qualityIcon} Overall Score: ${auditReport.percentage.toFixed(1)}% (${qualityLevel})`
        );
        console.log(
            `📋 Categories: ${auditReport.summary.categoriesPassed}/${auditReport.summary.totalCategories} passed`
        );
        console.log(`🚨 Critical Issues: ${auditReport.summary.criticalIssues}`);
        console.log(`⚠️  Warnings: ${auditReport.summary.warnings}`);

        // Cleanup Results
        if (cleanupResults) {
            const [cleanupResult, depResult, structureResult] = cleanupResults;
            console.log(`\n🧹 CLEANUP RESULTS:`);
            console.log(`📁 Files cleaned: ${cleanupResult.filesRemoved.length}`);
            console.log(
                `📦 Dependencies removed: ${depResult.removedDependencies.length + depResult.removedDevDependencies.length}`
            );
            console.log(`🏗️  Structure optimizations: ${structureResult.optimizations.length}`);
            console.log(`💾 Space saved: ${this.formatBytes(cleanupResult.sizeReduced)}`);

            if (cleanupResult.errors.length > 0) {
                console.log(`❌ Cleanup errors: ${cleanupResult.errors.length}`);
            }
        }

        // Report Files
        console.log(`\n📊 GENERATED REPORTS:`);
        for (const file of reportFiles) {
            if (file !== 'console-output') {
                console.log(`📄 ${file}`);
            }
        }

        // Recommendations Preview
        if (auditReport.recommendations.length > 0) {
            console.log(`\n🔧 TOP RECOMMENDATIONS:`);
            auditReport.recommendations.slice(0, 3).forEach((rec: any, i: number) => {
                console.log(`${i + 1}. ${rec.description} (${rec.priority} priority)`);
            });

            if (auditReport.recommendations.length > 3) {
                console.log(
                    `   ... and ${auditReport.recommendations.length - 3} more recommendations in detailed reports`
                );
            }
        }

        // Performance
        console.log(`\n⏱️  PERFORMANCE:`);
        console.log(`🕐 Total execution time: ${(duration / 1000).toFixed(1)}s`);
        console.log(
            `📊 Audit execution time: ${(auditReport.summary.executionTime / 1000).toFixed(1)}s`
        );

        // Final Status
        console.log('\n' + '='.repeat(80));
        if (auditReport.passed) {
            console.log('🎉 TEMPLATE QUALITY AUDIT: PASSED');
            console.log('✨ Your template meets professional quality standards!');
        } else {
            console.log('💥 TEMPLATE QUALITY AUDIT: FAILED');
            console.log('🔧 Please address the identified issues before using this template.');
        }
        console.log('='.repeat(80));
    }

    private getQualityLevel(percentage: number): string {
        if (percentage >= 96) return 'Excellent';
        if (percentage >= 92) return 'Professional';
        if (percentage >= 88) return 'Acceptable';
        return 'Needs Improvement';
    }

    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';

        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));

        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    private log(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
        const colors = {
            info: '\x1b[36m', // Cyan
            success: '\x1b[32m', // Green
            warning: '\x1b[33m', // Yellow
            error: '\x1b[31m', // Red
            reset: '\x1b[0m' // Reset
        };

        const prefix = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        const timestamp = new Date().toISOString().substr(11, 8);
        console.log(`${colors[type]}${prefix[type]} [${timestamp}] ${message}${colors.reset}`);
    }
}

// CLI argument parsing
function parseArguments(): AuditOptions {
    const args = process.argv.slice(2);

    const configPathArg = args.find(arg => arg.startsWith('--config='))?.split('=')[1];

    return {
        includeCleanup: args.includes('--cleanup') || args.includes('--with-cleanup'),
        dryRun: args.includes('--dry-run'),
        outputFormat: args.includes('--json-only')
            ? ['json']
            : args.includes('--html-only')
              ? ['html']
              : args.includes('--console-only')
                ? ['console']
                : ['console', 'html', 'json'],
        ...(configPathArg && { configPath: configPathArg }),
        verbose: args.includes('--verbose') || args.includes('-v')
    };
}

function printHelp(): void {
    console.log(`
🎮 Phaser Game Template Auditor

Usage:
  npx tsx tools/quality-assurance/run-template-audit.ts [options]

Options:
  --cleanup, --with-cleanup     Include template cleanup and optimization
  --dry-run                     Show what would be done without making changes
  --verbose, -v                 Enable verbose output and detailed reporting
  --config=<path>               Use custom audit configuration file
  --json-only                   Generate only JSON report
  --html-only                   Generate only HTML report  
  --console-only                Show only console output
  --help, -h                    Show this help message

Examples:
  # Basic audit
  npx tsx tools/quality-assurance/run-template-audit.ts

  # Full audit with cleanup
  npx tsx tools/quality-assurance/run-template-audit.ts --cleanup

  # Dry run to see what would be cleaned
  npx tsx tools/quality-assurance/run-template-audit.ts --cleanup --dry-run

  # Verbose audit with custom config
  npx tsx tools/quality-assurance/run-template-audit.ts --verbose --config=my-audit.json

Quality Thresholds:
  - Minimum passing score: 88%
  - Professional grade: 92%
  - Excellent quality: 96%

Report Outputs:
  - Console: Real-time feedback and summary
  - HTML: Professional web-based report
  - JSON: Machine-readable audit data
  - Markdown: Documentation-friendly format

For more information, see: docs/quality-assurance/
    `);
}

// Main execution
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);

    if (args.includes('--help') || args.includes('-h')) {
        printHelp();
        process.exit(0);
    }

    const options = parseArguments();
    const cli = new TemplateAuditCLI(options);

    cli.runCompleteAudit().catch(error => {
        console.error('❌ Fatal error:', error.message);
        process.exit(1);
    });
}
