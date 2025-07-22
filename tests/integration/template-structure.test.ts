import { describe, it, expect } from 'vitest';
import { exec } from 'child_process';
import { promisify } from 'node:util';
import { existsSync, readdirSync, statSync, readFileSync } from 'fs';
import path from 'path';

const execAsync = promisify(exec);

describe('Template Structure Integration Tests', () => {
    const projectRoot = path.resolve(__dirname, '../..');

    describe('Build Process', () => {
        it('should build successfully with new directory structure', async () => {
            try {
                const { stderr } = await execAsync('npm run build', {
                    cwd: projectRoot,
                    timeout: 60000 // 60 second timeout
                });

                // Build should complete without errors
                expect(stderr).not.toContain('error');
                expect(stderr).not.toContain('Error');

                // Dist directory should be created
                expect(existsSync(path.join(projectRoot, 'dist'))).toBe(true);

                // Main files should be present in dist
                expect(existsSync(path.join(projectRoot, 'dist', 'index.html'))).toBe(true);
            } catch (error) {
                throw new Error(`Build failed: ${error as string}`);
            }
        }, 90000); // 90 second timeout for the test

        it('should run linting without path errors', async () => {
            try {
                const { stderr } = await execAsync('npm run lint', {
                    cwd: projectRoot,
                    timeout: 30000
                });

                // Lint should not report path-related errors
                expect(stderr).not.toContain('Cannot resolve');
                expect(stderr).not.toContain('Module not found');
            } catch (error) {
                // Linting errors are acceptable, path resolution errors are not
                const errorMessage = (error as Error).toString();
                expect(errorMessage).not.toContain('Cannot resolve');
                expect(errorMessage).not.toContain('Module not found');
            }
        }, 30000); // 30 second timeout for the test

        it('should run type checking without path errors', async () => {
            try {
                const { stderr } = await execAsync('npm run typecheck', {
                    cwd: projectRoot,
                    timeout: 30000
                });

                // TypeScript should not report path resolution errors
                expect(stderr).not.toContain('Cannot find module');
                expect(stderr).not.toContain('Module not found');
            } catch (error) {
                // Type errors are acceptable, module resolution errors are not
                const errorMessage = (error as Error).toString();
                expect(errorMessage).not.toContain('Cannot find module');
                expect(errorMessage).not.toContain('Module not found');
            }
        });
    });

    describe('Development Workflow', () => {
        it('should have all required directories present', () => {
            const requiredDirs = ['src', 'assets', 'docs', 'config'];

            requiredDirs.forEach(dir => {
                expect(existsSync(path.join(projectRoot, dir))).toBe(true);
            });
        });

        it('should have clean root directory structure', () => {
            const rootFiles = readdirSync(projectRoot);
            const fileCount = rootFiles.filter(
                item => !item.startsWith('.') && statSync(path.join(projectRoot, item)).isFile()
            ).length;

            // Should have reasonable number of root files (less than 20)
            expect(fileCount).toBeLessThan(20);
        });

        it('should have organized documentation structure', () => {
            const docsPath = path.join(projectRoot, 'docs');
            expect(existsSync(docsPath)).toBe(true);

            // Essential docs should be present
            expect(existsSync(path.join(docsPath, 'setup'))).toBe(true);
            expect(existsSync(path.join(docsPath, 'examples'))).toBe(true);
        });
    });

    describe('Configuration Files', () => {
        it('should have valid package.json scripts', async () => {
            const packageJsonPath = path.join(projectRoot, 'package.json');
            expect(existsSync(packageJsonPath)).toBe(true);

            const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

            // Key scripts should be present
            expect(packageJson.scripts.build).toBeDefined();
            expect(packageJson.scripts.dev).toBeDefined();
            expect(packageJson.scripts.test).toBeDefined();
            expect(packageJson.scripts.lint).toBeDefined();
        });

        it('should have valid vite configuration', () => {
            const viteConfigPath = path.join(projectRoot, 'config', 'build', 'vite.config.ts');
            expect(existsSync(viteConfigPath)).toBe(true);
        });

        it('should have valid TypeScript configuration', () => {
            const tsConfigPath = path.join(projectRoot, 'config', 'build', 'tsconfig.json');
            expect(existsSync(tsConfigPath)).toBe(true);
        });
    });
});
