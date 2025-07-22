#!/usr/bin/env npx tsx

import { TemplateValidator } from '../testing/template-validation/comprehensive-test-suite';
import { promises as fs } from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get the directory of this script
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const PROJECT_ROOT = path.resolve(__dirname, '..');

interface ValidationOptions {
    skipE2E?: boolean;
    verbose?: boolean;
    outputFile?: string;
    jsonOutput?: boolean;
    failFast?: boolean;
    timeout?: number;
}

/**
 * Parse command line arguments
 */
function parseArgs(): ValidationOptions {
    const args = process.argv.slice(2);
    const options: ValidationOptions = {};

    for (let i = 0; i < args.length; i++) {
        switch (args[i]) {
            case '--skip-e2e':
                options.skipE2E = true;
                break;
            case '--verbose':
                options.verbose = true;
                break;
            case '--output': {
                const outputArg = args[++i];
                if (outputArg) {
                    options.outputFile = outputArg;
                }
                break;
            }
            case '--json':
                options.jsonOutput = true;
                break;
            case '--fail-fast':
                options.failFast = true;
                break;
            case '--timeout': {
                const timeoutArg = args[++i];
                options.timeout = timeoutArg ? parseInt(timeoutArg) || 600000 : 600000; // 10 minutes default
                break;
            }
            case '--help':
                printHelp();
                process.exit(0);
                break;
        }
    }

    return options;
}

/**
 * Print help message
 */
function printHelp(): void {
    console.log(`
Template Quality Validation Script

Usage: npm run validate:template [options]

Options:
  --skip-e2e        Skip end-to-end tests
  --verbose         Enable verbose output
  --output <file>   Save detailed report to file
  --json            Output results as JSON
  --fail-fast       Stop on first failure
  --timeout <ms>    Set timeout in milliseconds (default: 600000)
  --help            Show this help message

Examples:
  npm run validate:template
  npm run validate:template -- --skip-e2e --verbose
  npm run validate:template -- --output validation-report.json --json
    `);
}

/**
 * Main validation function
 */
async function main(): Promise<void> {
    const options = parseArgs();

    console.log('🎮 Phaser Game Template Quality Validation');
    console.log('==========================================');
    console.log(`📁 Project Root: ${PROJECT_ROOT}`);
    console.log(`⏱️  Timeout: ${(options.timeout || 600000) / 1000}s`);
    console.log('');

    const startTime = Date.now();

    try {
        // Initialize validator
        const validator = new TemplateValidator(PROJECT_ROOT);

        // Set timeout if specified
        let timeoutHandle: NodeJS.Timeout | undefined;
        if (options.timeout) {
            timeoutHandle = setTimeout(() => {
                console.error('❌ Validation timed out');
                process.exit(1);
            }, options.timeout);
        }

        // Run validation
        const report = await validator.validateTemplate({
            skipE2E: options.skipE2E || false,
            verbose: options.verbose || false
        });

        // Clear timeout
        if (timeoutHandle) {
            clearTimeout(timeoutHandle);
        }

        const endTime = Date.now();
        const duration = endTime - startTime;

        // Print results
        console.log('\n📊 Validation Results');
        console.log('===================');
        console.log(`⏱️  Duration: ${(duration / 1000).toFixed(2)}s`);
        console.log(
            `📋 Overall Status: ${report.overallStatus === 'PASS' ? '✅ PASS' : '❌ FAIL'}`
        );

        if (report.summary) {
            console.log(
                `🧪 Tests: ${report.summary.passedTests}/${report.summary.totalTests} passed`
            );
            console.log(`⚠️  Warnings: ${report.summary.warnings}`);
            console.log(`❌ Errors: ${report.summary.errors}`);
            console.log(
                `🚪 Quality Gates: ${report.summary.qualityGatesPassed}/${report.summary.qualityGatesPassed + report.summary.qualityGatesFailed} passed`
            );
        }

        // Show warnings and errors
        if (report.warnings.length > 0) {
            console.log('\n⚠️  Warnings:');
            for (const warning of report.warnings) {
                console.log(`  • [${warning.source}] ${warning.message}`);
            }
        }

        if (report.errors.length > 0) {
            console.log('\n❌ Errors:');
            for (const error of report.errors) {
                console.log(`  • [${error.source}] ${error.message}`);
            }
        }

        // Show quality gate details
        if (report.qualityGates) {
            console.log('\n🚪 Quality Gates:');
            for (const gate of report.qualityGates) {
                const status = gate.status === 'PASS' ? '✅' : '❌';
                console.log(
                    `  ${status} ${gate.name}: ${gate.actualValue} (threshold: ${gate.threshold})`
                );
            }
        }

        // Save report if requested
        if (options.outputFile) {
            await saveReport(report, options.outputFile, options.jsonOutput);
            console.log(`\n💾 Report saved to: ${options.outputFile}`);
        }

        // Exit with appropriate code
        if (report.overallStatus === 'PASS') {
            console.log('\n🎉 Template validation completed successfully!');
            console.log('✨ The template is ready for production use.');
            process.exit(0);
        } else {
            console.log('\n💥 Template validation failed!');
            console.log('🔧 Please fix the issues above before using the template.');

            if (options.failFast) {
                process.exit(1);
            }

            // Show troubleshooting tips
            console.log('\n🔍 Troubleshooting Tips:');
            console.log('  • Run individual test suites to isolate issues');
            console.log('  • Check build logs for detailed error information');
            console.log('  • Ensure all dependencies are properly installed');
            console.log('  • Verify TypeScript configuration is correct');

            process.exit(1);
        }
    } catch (error) {
        console.error('\n💥 Validation failed with error:', error);
        console.error('\n🔧 Debug Information:');
        if (error instanceof Error) {
            console.error(`  • Error Type: ${error.constructor.name}`);
            console.error(`  • Error Message: ${error.message}`);
            if (error.stack) {
                console.error(
                    `  • Stack Trace: ${error.stack.split('\n').slice(0, 5).join('\n    ')}`
                );
            }
        } else {
            console.error(`  • Error: ${String(error)}`);
        }

        process.exit(1);
    }
}

/**
 * Save validation report to file
 */
async function saveReport(report: any, outputFile: string, asJson: boolean = false): Promise<void> {
    const outputPath = path.resolve(PROJECT_ROOT, outputFile);

    if (asJson) {
        await fs.writeFile(outputPath, JSON.stringify(report, null, 2), 'utf8');
    } else {
        const textReport = generateTextReport(report);
        await fs.writeFile(outputPath, textReport, 'utf8');
    }
}

/**
 * Generate human-readable text report
 */
function generateTextReport(report: any): string {
    const lines: string[] = [];

    lines.push('Phaser Game Template Quality Validation Report');
    lines.push('============================================');
    lines.push('');
    lines.push(`Generated: ${new Date().toISOString()}`);
    lines.push(`Overall Status: ${report.overallStatus}`);
    lines.push(`Duration: ${report.duration}ms`);
    lines.push('');

    if (report.summary) {
        lines.push('Summary:');
        lines.push(`  Tests: ${report.summary.passedTests}/${report.summary.totalTests} passed`);
        lines.push(`  Warnings: ${report.summary.warnings}`);
        lines.push(`  Errors: ${report.summary.errors}`);
        lines.push(
            `  Quality Gates: ${report.summary.qualityGatesPassed}/${report.summary.qualityGatesPassed + report.summary.qualityGatesFailed} passed`
        );
        lines.push('');
    }

    if (report.testResults) {
        lines.push('Test Results:');
        lines.push(`  Unit Tests: ${report.testResults.unitTests?.status || 'UNKNOWN'}`);
        lines.push(
            `  Integration Tests: ${report.testResults.integrationTests?.status || 'UNKNOWN'}`
        );
        lines.push(`  E2E Tests: ${report.testResults.e2eTests?.status || 'UNKNOWN'}`);
        lines.push('');
    }

    if (report.buildResults) {
        lines.push('Build Results:');
        lines.push(`  TypeScript: ${report.buildResults.typescript?.status || 'UNKNOWN'}`);
        lines.push(`  Vite: ${report.buildResults.vite?.status || 'UNKNOWN'}`);
        lines.push(`  Docker: ${report.buildResults.docker?.status || 'UNKNOWN'}`);
        lines.push('');
    }

    if (report.qualityGates && report.qualityGates.length > 0) {
        lines.push('Quality Gates:');
        for (const gate of report.qualityGates) {
            lines.push(
                `  ${gate.status === 'PASS' ? '✓' : '✗'} ${gate.name}: ${gate.actualValue} (threshold: ${gate.threshold})`
            );
        }
        lines.push('');
    }

    if (report.warnings && report.warnings.length > 0) {
        lines.push('Warnings:');
        for (const warning of report.warnings) {
            lines.push(`  • [${warning.source}] ${warning.message}`);
        }
        lines.push('');
    }

    if (report.errors && report.errors.length > 0) {
        lines.push('Errors:');
        for (const error of report.errors) {
            lines.push(`  • [${error.source}] ${error.message}`);
        }
        lines.push('');
    }

    return lines.join('\n');
}

// Handle unhandled promise rejections
process.on('unhandledRejection', (reason, _promise) => {
    console.error('Unhandled Promise Rejection:', reason);
    process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', error => {
    console.error('Uncaught Exception:', error);
    process.exit(1);
});

// Run the script
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        console.error('Script execution failed:', error);
        process.exit(1);
    });
}
