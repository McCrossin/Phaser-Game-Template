/**
 * Artifact Cleaner Tests
 * Tests for development artifact detection and cleanup functionality
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { existsSync, writeFileSync, mkdirSync, rmSync } from 'fs';
import { join } from 'path';
import { ArtifactCleaner } from '../../../tools/quality-assurance/artifact-cleaner.js';

describe('ArtifactCleaner', () => {
    let cleaner: ArtifactCleaner;
    let tempDir: string;

    beforeEach(() => {
        tempDir = join(process.cwd(), 'test-temp-cleaner');
        if (!existsSync(tempDir)) {
            mkdirSync(tempDir, { recursive: true });
        }

        cleaner = new ArtifactCleaner({
            dryRun: true, // Safe mode for tests
            backupBeforeDelete: false
        });
    });

    afterEach(() => {
        if (existsSync(tempDir)) {
            rmSync(tempDir, { recursive: true });
        }
    });

    describe('Artifact Scanning', () => {
        it('should detect backup files', async () => {
            // Create test backup files
            writeFileSync(join(tempDir, 'test.bak'), 'backup content');
            writeFileSync(join(tempDir, 'config.orig'), 'original content');
            writeFileSync(join(tempDir, 'temp.tmp'), 'temporary content');

            // Change working directory temporarily
            const originalCwd = process.cwd();
            process.chdir(tempDir);

            try {
                const artifacts = await cleaner.scanForArtifacts();

                expect(artifacts['Backup Files']).toBeDefined();
                expect(artifacts['Backup Files']?.length).toBeGreaterThan(0);
            } finally {
                process.chdir(originalCwd);
            }
        });

        it('should detect system files', async () => {
            // Create test system files
            writeFileSync(join(tempDir, '.DS_Store'), 'mac system file');
            writeFileSync(join(tempDir, 'Thumbs.db'), 'windows system file');

            const originalCwd = process.cwd();
            process.chdir(tempDir);

            try {
                const artifacts = await cleaner.scanForArtifacts();

                expect(artifacts['System Files']).toBeDefined();
                expect(artifacts['System Files']?.length).toBeGreaterThan(0);
            } finally {
                process.chdir(originalCwd);
            }
        });

        it('should detect log files', async () => {
            // Create test log files
            writeFileSync(join(tempDir, 'error.log'), 'error messages');
            writeFileSync(join(tempDir, 'npm-debug.log'), 'npm debug info');

            const originalCwd = process.cwd();
            process.chdir(tempDir);

            try {
                const artifacts = await cleaner.scanForArtifacts();

                expect(artifacts['Log Files']).toBeDefined();
                expect(artifacts['Log Files']?.length).toBeGreaterThan(0);
            } finally {
                process.chdir(originalCwd);
            }
        });

        it('should respect preserve patterns', async () => {
            // Create files that should be preserved
            writeFileSync(join(tempDir, '.gitignore'), 'git ignore file');
            writeFileSync(join(tempDir, 'package.json'), '{}');

            const originalCwd = process.cwd();
            process.chdir(tempDir);

            try {
                const artifacts = await cleaner.scanForArtifacts();

                // These files should not appear in any artifact category
                const allArtifacts = Object.values(artifacts).flat();
                expect(allArtifacts).not.toContain('.gitignore');
                expect(allArtifacts).not.toContain('package.json');
            } finally {
                process.chdir(originalCwd);
            }
        });
    });

    describe('Cleanup Operations', () => {
        it('should perform dry run without deleting files', async () => {
            // Create test files
            const testFile = join(tempDir, 'test.bak');
            writeFileSync(testFile, 'test content');

            const originalCwd = process.cwd();
            process.chdir(tempDir);

            try {
                const result = await cleaner.cleanupDevelopmentFiles();

                // File should still exist after dry run
                expect(existsSync(testFile)).toBe(true);
                expect(result.filesRemoved.length).toBeGreaterThan(0);
                expect(result.errors.length).toBe(0);
            } finally {
                process.chdir(originalCwd);
            }
        });

        it('should calculate size reduction correctly', async () => {
            // Create test files with known sizes
            const testContent = 'a'.repeat(1000); // 1000 bytes
            writeFileSync(join(tempDir, 'test.bak'), testContent);

            const originalCwd = process.cwd();
            process.chdir(tempDir);

            try {
                const result = await cleaner.cleanupDevelopmentFiles();

                expect(result.sizeReduced).toBeGreaterThan(0);
            } finally {
                process.chdir(originalCwd);
            }
        });

        it('should handle cleanup errors gracefully', async () => {
            // Test error handling by trying to clean non-existent directory
            const result = await cleaner.cleanupDevelopmentFiles();

            // Should not throw, but may have some errors
            expect(result).toBeDefined();
            expect(Array.isArray(result.errors)).toBe(true);
        });
    });

    describe('Dependency Analysis', () => {
        it('should analyze package.json dependencies', async () => {
            // Create test package.json
            const packageJson = {
                dependencies: {
                    'used-package': '^1.0.0',
                    'unused-package': '^2.0.0'
                },
                devDependencies: {
                    'used-dev-package': '^1.0.0',
                    'unused-dev-package': '^2.0.0'
                }
            };

            writeFileSync(join(tempDir, 'package.json'), JSON.stringify(packageJson));

            // Create a source file that uses some packages
            writeFileSync(
                join(tempDir, 'src', 'main.ts'),
                `
                import { something } from 'used-package';
                import { devTool } from 'used-dev-package';
            `
            );

            const originalCwd = process.cwd();
            process.chdir(tempDir);

            try {
                const result = await cleaner.removeUnusedDependencies();

                expect(result).toBeDefined();
                expect(result.packagesScanned).toBe(4);
                expect(result.sizeBefore).toBeGreaterThan(0);
            } finally {
                process.chdir(originalCwd);
            }
        });

        it('should handle missing package.json gracefully', async () => {
            const originalCwd = process.cwd();
            process.chdir(tempDir);

            try {
                await expect(cleaner.removeUnusedDependencies()).rejects.toThrow(
                    'package.json not found'
                );
            } finally {
                process.chdir(originalCwd);
            }
        });
    });

    describe('Structure Optimization', () => {
        it('should optimize template structure', async () => {
            const originalCwd = process.cwd();
            process.chdir(tempDir);

            try {
                const result = await cleaner.optimizeTemplateStructure();

                expect(result).toBeDefined();
                expect(Array.isArray(result.optimizations)).toBe(true);
                expect(Array.isArray(result.filesReorganized)).toBe(true);
                expect(Array.isArray(result.foldersCreated)).toBe(true);
                expect(Array.isArray(result.foldersRemoved)).toBe(true);
            } finally {
                process.chdir(originalCwd);
            }
        });

        it('should handle optimization errors gracefully', async () => {
            // Test error handling
            const result = await cleaner.optimizeTemplateStructure();

            expect(result).toBeDefined();
            // Should not throw even if some optimizations fail
        });
    });

    describe('Configuration', () => {
        it('should accept custom configuration', () => {
            const customCleaner = new ArtifactCleaner({
                artifactPatterns: ['**/*.custom'],
                preservePatterns: ['preserve-me.*'],
                dryRun: false,
                backupBeforeDelete: true
            });

            expect(customCleaner).toBeDefined();
        });

        it('should merge custom config with defaults', () => {
            const customCleaner = new ArtifactCleaner({
                dryRun: false // Only override dryRun
            });

            expect(customCleaner).toBeDefined();
        });
    });

    describe('Integration Tests', () => {
        it('should work with real project structure', async () => {
            // Test with actual project (carefully in dry run mode)
            const safeCleaner = new ArtifactCleaner({
                dryRun: true,
                backupBeforeDelete: false
            });

            const artifacts = await safeCleaner.scanForArtifacts();
            expect(artifacts).toBeDefined();

            // Should find some categories, even if empty
            expect(Object.keys(artifacts).length).toBeGreaterThan(0);
        });

        it('should not identify essential files as artifacts', async () => {
            const artifacts = await cleaner.scanForArtifacts();

            const allArtifacts = Object.values(artifacts).flat();

            // Essential files should never be marked for cleanup
            const essentialFiles = ['package.json', 'README.md', '.gitignore', 'LICENSE'];

            for (const file of essentialFiles) {
                expect(allArtifacts).not.toContain(file);
            }
        });
    });

    describe('Performance', () => {
        it('should complete scanning within reasonable time', async () => {
            const startTime = Date.now();
            await cleaner.scanForArtifacts();
            const duration = Date.now() - startTime;

            // Should complete scan within 10 seconds
            expect(duration).toBeLessThan(10000);
        });

        it('should handle large numbers of files efficiently', async () => {
            // Create many test files
            for (let i = 0; i < 100; i++) {
                writeFileSync(join(tempDir, `test${i}.bak`), 'content');
            }

            const originalCwd = process.cwd();
            process.chdir(tempDir);

            try {
                const startTime = Date.now();
                const artifacts = await cleaner.scanForArtifacts();
                const duration = Date.now() - startTime;

                expect(artifacts['Backup Files']?.length).toBe(100);
                expect(duration).toBeLessThan(5000); // Should handle 100 files quickly
            } finally {
                process.chdir(originalCwd);
            }
        });
    });
});
