import { describe, it, expect, beforeEach } from 'vitest';
import { execSync } from 'child_process';
import { existsSync, readFileSync } from 'fs';
import * as path from 'path';
import packageJson from '../../package.json';

/**
 * Test Suite: Script Migration Validation
 *
 * Validates that the npm script migration from TEMP-012 is working correctly
 * and that all cross-platform functionality is operational.
 */

const PROJECT_ROOT = path.join(__dirname, '../..');

describe('Script Migration Validation', () => {
    beforeEach(() => {
        // Ensure we're in the project root
        process.chdir(PROJECT_ROOT);
    });

    describe('npm script availability', () => {
        it('should have all required npm scripts defined', () => {
            const scripts = packageJson.scripts;

            // Essential development scripts
            expect(scripts).toHaveProperty('dev');
            expect(scripts).toHaveProperty('build');
            expect(scripts).toHaveProperty('preview'); // Testing scripts
            expect(scripts).toHaveProperty('test');
            expect(scripts).toHaveProperty('test:e2e');
            expect(scripts).toHaveProperty('test:performance');

            // Code quality scripts
            expect(scripts).toHaveProperty('lint');
            expect(scripts).toHaveProperty('lint:fix');
            expect(scripts).toHaveProperty('format');
            expect(scripts).toHaveProperty('typecheck');

            // Maintenance scripts
            expect(scripts).toHaveProperty('clean');
            expect(scripts).toHaveProperty('clean:dry-run');
            expect(scripts).toHaveProperty('health:report');
            expect(scripts).toHaveProperty('validate');
        });

        it('should use Node.js implementations for cross-platform scripts', () => {
            const scripts = packageJson.scripts;

            // These scripts should use TypeScript script runner with tsx
            expect(scripts.clean).toContain('npx tsx tools/development/script-runner.ts');
            expect(scripts['clean:dry-run']).toContain(
                'npx tsx tools/development/script-runner.ts'
            );
            expect(scripts['test:performance']).toContain(
                'npx tsx tools/development/script-runner.ts'
            );
            expect(scripts['health:report']).toContain(
                'npx tsx tools/development/script-runner.ts'
            );
        });
    });

    describe('cross-platform script runner', () => {
        it('should have script runner utility available', () => {
            const scriptRunner = path.join(PROJECT_ROOT, 'tools/development/script-runner.ts');
            expect(existsSync(scriptRunner)).toBe(true);
        });

        it('should execute cleanup dry-run successfully', () => {
            expect(() => {
                execSync('npm run clean:dry-run', {
                    stdio: 'pipe',
                    cwd: PROJECT_ROOT,
                    timeout: 30000
                });
            }).not.toThrow();
        });

        it('should show help for script runner commands', () => {
            let output: string;
            try {
                output = execSync('npx tsx tools/development/script-runner.ts', {
                    stdio: 'pipe',
                    cwd: PROJECT_ROOT,
                    encoding: 'utf8'
                });
            } catch (error: any) {
                // Script runner exits with code 1 when no command provided, but still shows help
                output = error.stdout || '';
            }

            expect(output).toContain('Usage:');
            expect(output).toContain('cleanup-cache');
            expect(output).toContain('test-performance');
            expect(output).toContain('generate-health-report');
        });
    });

    describe('template-specific scripts relocation', () => {
        it('should have moved template scripts to template-cleanup directory', () => {
            const templateCleanupDir = path.join(PROJECT_ROOT, 'scripts/template-cleanup');
            expect(existsSync(templateCleanupDir)).toBe(true);

            const setupScript = path.join(templateCleanupDir, 'setup-template.js');
            const verifyScript = path.join(templateCleanupDir, 'verify-template-setup.sh');

            expect(existsSync(setupScript)).toBe(true);
            expect(existsSync(verifyScript)).toBe(true);
        });

        it('should have removed old shell scripts from main scripts directory', () => {
            const oldScripts = [
                'scripts/cleanup-cache.sh',
                'scripts/cleanup-cache.ps1',
                'scripts/test-performance.sh',
                'scripts/generate-health-report.sh'
            ];

            oldScripts.forEach(script => {
                const scriptPath = path.join(PROJECT_ROOT, script);
                expect(existsSync(scriptPath)).toBe(false);
            });
        });

        it('should not have template setup scripts in project root', () => {
            const rootSetupScript = path.join(PROJECT_ROOT, 'setup-template.js');
            const rootVerifyScript = path.join(PROJECT_ROOT, 'verify-template-setup.sh');

            expect(existsSync(rootSetupScript)).toBe(false);
            expect(existsSync(rootVerifyScript)).toBe(false);
        });
    });

    describe('essential npm script functionality', () => {
        it('should run linting successfully', () => {
            expect(() => {
                execSync('npm run lint', {
                    stdio: 'pipe',
                    cwd: PROJECT_ROOT,
                    timeout: 30000
                });
            }).not.toThrow();
        }, 30000); // 30 second timeout for the test

        it('should run type checking successfully', () => {
            expect(() => {
                execSync('npm run typecheck', {
                    stdio: 'pipe',
                    cwd: PROJECT_ROOT,
                    timeout: 30000
                });
            }).not.toThrow();
        });

        it('should build successfully', () => {
            expect(() => {
                execSync('npm run build', {
                    stdio: 'pipe',
                    cwd: PROJECT_ROOT,
                    timeout: 60000
                });
            }).not.toThrow();
        }, 70000); // 70 second timeout for build
    });

    describe('documentation and guidance', () => {
        it('should have script usage guide documentation', () => {
            const scriptGuide = path.join(PROJECT_ROOT, 'docs/template-scripts-guide.md');
            expect(existsSync(scriptGuide)).toBe(true);
        });

        it('should have updated package.json template scripts to point to template-cleanup', () => {
            const scripts = packageJson.scripts;

            expect(scripts['template:setup']).toContain(
                'scripts/template-cleanup/setup-template.js'
            );
            expect(scripts['template:verify']).toContain(
                'scripts/template-cleanup/verify-template-setup.sh'
            );
        });
    });

    describe('performance requirements', () => {
        it('should execute npm scripts within reasonable time', () => {
            const startTime = Date.now();

            execSync('npm run clean:dry-run', {
                stdio: 'pipe',
                cwd: PROJECT_ROOT
            });

            const executionTime = Date.now() - startTime;

            // Should complete within 10 seconds for dry run
            expect(executionTime).toBeLessThan(10000);
        });
    });
});

describe('Script Migration Documentation', () => {
    it('should have migration mapping documented', () => {
        const scriptGuide = path.join(PROJECT_ROOT, 'docs/template-scripts-guide.md');
        const content = readFileSync(scriptGuide, 'utf8');

        // Should document the migration mapping
        expect(content).toContain('Migration from Shell Scripts');
        expect(content).toContain('cleanup-cache.sh');
        expect(content).toContain('npm run clean');
        expect(content).toContain('test-performance.sh');
        expect(content).toContain('npm run test:performance');
    });

    it('should provide cross-platform compatibility information', () => {
        const scriptGuide = path.join(PROJECT_ROOT, 'docs/template-scripts-guide.md');
        const content = readFileSync(scriptGuide, 'utf8');

        expect(content).toContain('Cross-Platform Compatibility');
        expect(content).toContain('Node.js scripts');
        expect(content).toContain('Windows, macOS, Linux');
    });
});
