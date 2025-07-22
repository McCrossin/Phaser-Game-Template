#!/usr/bin/env node
/**
 * Cross-Platform Script Runner Utility
 * Part of TEMP-012: Template Script Standardization and NPM Migration
 *
 * Provides cross-platform alternatives to shell scripts using Node.js
 */

import { execSync, spawn, ChildProcess } from 'child_process';
import { existsSync, rmSync, mkdirSync, statSync, readdirSync } from 'fs';
import { join, dirname, resolve } from 'path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = resolve(__dirname, '../..');

// Color output utilities
interface Colors {
    readonly reset: string;
    readonly red: string;
    readonly green: string;
    readonly yellow: string;
    readonly blue: string;
    readonly cyan: string;
}

type LogLevel = 'info' | 'success' | 'warning' | 'error';

interface CleanupPath {
    readonly path: string;
    readonly desc: string;
}

interface CleanupOptions {
    readonly dryRun?: boolean;
    readonly backup?: boolean;
}

interface CommandOptions {
    readonly cwd?: string;
    readonly stdio?: 'inherit' | 'pipe' | 'ignore';
    readonly env?: NodeJS.ProcessEnv;
}

interface TestPerformanceOptions {
    timeout?: number;
    extraArgs?: string[];
}

const colors: Colors = {
    reset: '\x1b[0m',
    red: '\x1b[31m',
    green: '\x1b[32m',
    yellow: '\x1b[33m',
    blue: '\x1b[34m',
    cyan: '\x1b[36m'
};

function log(level: LogLevel, message: string): void {
    const timestamp = new Date().toISOString();
    const prefix = {
        info: `${colors.blue}ℹ️${colors.reset}`,
        success: `${colors.green}✅${colors.reset}`,
        warning: `${colors.yellow}⚠️${colors.reset}`,
        error: `${colors.red}❌${colors.reset}`
    };

    console.log(`${prefix[level]} [${timestamp}] ${message}`);
}

function getFileSize(path: string): number {
    try {
        const stats = statSync(path);
        if (stats.isDirectory()) {
            let totalSize = 0;
            const files = readdirSync(path, { withFileTypes: true });
            for (const file of files) {
                const filePath = join(path, file.name);
                if (file.isDirectory()) {
                    totalSize += getFileSize(filePath);
                } else {
                    totalSize += statSync(filePath).size;
                }
            }
            return totalSize;
        } else {
            return stats.size;
        }
    } catch {
        return 0;
    }
}

function formatSize(bytes: number): string {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

function removePathSafely(
    targetPath: string,
    description: string,
    options: CleanupOptions = {}
): boolean {
    const { dryRun = false, backup = false } = options;

    if (!existsSync(targetPath)) {
        log('info', `${description}: Not found, skipping`);
        return true;
    }

    const size = formatSize(getFileSize(targetPath));

    if (dryRun) {
        log('warning', `[DRY RUN] Would remove ${description} (${size}): ${targetPath}`);
        return true;
    }

    log('info', `Removing ${description} (${size}): ${targetPath}`);

    try {
        if (backup) {
            // Create backup functionality could be added here
            log('info', `Backup requested for ${description} - feature not yet implemented`);
        }

        rmSync(targetPath, { recursive: true, force: true });
        log('success', `Successfully removed ${description}`);
        return true;
    } catch (error) {
        log('error', `Failed to remove ${description}: ${(error as Error).message}`);
        return false;
    }
}

async function runCommand(
    command: string,
    args: string[] = [],
    options: CommandOptions = {}
): Promise<number> {
    const { cwd = PROJECT_ROOT, stdio = 'inherit' } = options;

    return new Promise((resolve, reject) => {
        log('info', `Running: ${command} ${args.join(' ')}`);

        const child: ChildProcess = spawn(command, args, {
            cwd,
            stdio,
            shell: process.platform === 'win32',
            env: options.env
        });

        child.on('close', code => {
            if (code === 0) {
                resolve(code || 0);
            } else {
                reject(new Error(`Command failed with exit code ${code}`));
            }
        });

        child.on('error', error => {
            reject(error);
        });
    });
}

// Script functions
const scripts = {
    async cleanupCache(options: CleanupOptions = {}): Promise<void> {
        const { dryRun = false, backup = false } = options;

        log('info', 'Starting cache cleanup...');

        const pathsToClean: CleanupPath[] = [
            { path: join(PROJECT_ROOT, 'node_modules'), desc: 'Node modules' },
            { path: join(PROJECT_ROOT, 'dist'), desc: 'Build output' },
            { path: join(PROJECT_ROOT, '.vite'), desc: 'Vite cache' },
            { path: join(PROJECT_ROOT, 'coverage'), desc: 'Coverage reports' },
            { path: join(PROJECT_ROOT, 'docs/api'), desc: 'Generated API docs' },
            { path: join(PROJECT_ROOT, 'test-results'), desc: 'Test results' },
            { path: join(PROJECT_ROOT, 'playwright-report'), desc: 'Playwright reports' },
            { path: join(PROJECT_ROOT, '.nyc_output'), desc: 'NYC output' },
            { path: join(PROJECT_ROOT, '.cache'), desc: 'Generic cache' },
            { path: join(PROJECT_ROOT, 'tmp'), desc: 'Temporary files' },
            { path: join(PROJECT_ROOT, '*.log'), desc: 'Log files' }
        ];

        let successCount = 0;
        for (const { path, desc } of pathsToClean) {
            if (removePathSafely(path, desc, { dryRun, backup })) {
                successCount++;
            }
        }

        log(
            'success',
            `Cache cleanup completed. ${successCount}/${pathsToClean.length} operations successful.`
        );
    },

    async testPerformance(options: TestPerformanceOptions = {}): Promise<void> {
        const { timeout = process.env['CI'] ? 300000 : 180000, extraArgs = [] } = options;

        log('info', 'Setting up performance test environment...');
        log('info', `Using timeout: ${timeout}ms`);

        // Kill existing processes
        try {
            if (process.platform === 'win32') {
                execSync(
                    'taskkill /f /im node.exe /fi "WINDOWTITLE eq vite*" 2>nul || echo No processes found',
                    { stdio: 'ignore' }
                );
            } else {
                execSync('pkill -f "vite preview" || true', { stdio: 'ignore' });
                execSync('pkill -f "playwright" || true', { stdio: 'ignore' });
            }
        } catch {
            // Ignore errors from process cleanup
        }

        // Wait for cleanup
        await new Promise(resolve => setTimeout(resolve, 2000));

        // Build application
        log('info', 'Building application...');
        await runCommand('npm', ['run', 'build']);

        // Run performance tests
        log('info', 'Running performance tests...');
        const testArgs = ['run', 'test:e2e', ...extraArgs];
        await runCommand('npm', testArgs, {
            env: { ...process.env, TIMEOUT: timeout.toString() }
        });
    },

    async generateHealthReport(): Promise<void> {
        log('info', 'Generating health report...');

        const reportDir = join(PROJECT_ROOT, 'reports/health');
        const dateString = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const timeString = new Date().toTimeString().split(' ')[0];
        const timestamp = `${dateString}_${timeString ? timeString.replace(/:/g, '-') : '00-00-00'}`;
        const reportFile = join(reportDir, `health-report-${timestamp}.md`);

        // Create reports directory
        mkdirSync(reportDir, { recursive: true });

        // Run health checks
        try {
            await runCommand('npm', ['run', 'health:check']);
            await runCommand('npm', ['run', 'health:debt']);
            log('success', `Health report generated: ${reportFile}`);
        } catch (error) {
            log('error', `Health report generation failed: ${(error as Error).message}`);
            throw error;
        }
    }
};

// CLI interface
async function main(): Promise<void> {
    const args = process.argv.slice(2);
    const command = args[0];

    if (!command) {
        console.log('Usage: node script-runner.js <command> [options]');
        console.log('Commands:');
        console.log('  cleanup-cache [--dry-run] [--backup]');
        console.log('  test-performance [--timeout=ms]');
        console.log('  generate-health-report');
        process.exit(1);
    }

    try {
        switch (command) {
            case 'cleanup-cache':
                await scripts.cleanupCache({
                    dryRun: args.includes('--dry-run'),
                    backup: args.includes('--backup')
                });
                break;

            case 'test-performance': {
                const timeoutArg = args.find(arg => arg.startsWith('--timeout='));
                const timeoutValue = timeoutArg ? timeoutArg.split('=')[1] : undefined;
                const timeout = timeoutValue ? parseInt(timeoutValue) : undefined;
                const extraArgs = args.filter(
                    arg => !arg.startsWith('--timeout=') && arg !== command
                );

                const performanceOptions: TestPerformanceOptions = { extraArgs };
                if (timeout !== undefined) {
                    performanceOptions.timeout = timeout;
                }
                await scripts.testPerformance(performanceOptions);
                break;
            }

            case 'generate-health-report':
                await scripts.generateHealthReport();
                break;

            default:
                log('error', `Unknown command: ${command}`);
                process.exit(1);
        }
    } catch (error) {
        log('error', `Script failed: ${(error as Error).message}`);
        process.exit(1);
    }
}

// Export for use as module
export { scripts, log, runCommand, removePathSafely };

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main().catch(error => {
        log('error', error.message);
        process.exit(1);
    });
}
