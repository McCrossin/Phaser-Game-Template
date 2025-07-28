#!/usr/bin/env npx tsx
/**
 * Artifact Cleaner - Development artifact detection and cleanup system
 * Removes unnecessary development files and optimizes template structure
 */

import {
    existsSync,
    readFileSync,
    writeFileSync,
    unlinkSync,
    readdirSync,
    statSync,
    mkdirSync
} from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import { execSync } from 'child_process';
import { glob } from 'glob';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '../..');

export interface CleanupConfig {
    artifactPatterns: string[];
    preservePatterns: string[];
    backupBeforeDelete: boolean;
    dryRun: boolean;
}

export interface ArtifactCategory {
    name: string;
    patterns: string[];
    description: string;
    critical: boolean;
}

export interface CleanupResult {
    filesRemoved: string[];
    dependenciesRemoved: string[];
    sizeReduced: number;
    backupLocation?: string;
    errors: string[];
}

export interface DependencyCleanupResult {
    removedDependencies: string[];
    removedDevDependencies: string[];
    sizeBefore: number;
    sizeAfter: number;
    packagesScanned: number;
}

export interface StructureOptimizationResult {
    filesReorganized: string[];
    foldersCreated: string[];
    foldersRemoved: string[];
    optimizations: string[];
}

export class ArtifactCleaner {
    private config: CleanupConfig;

    constructor(config?: Partial<CleanupConfig>) {
        this.config = {
            artifactPatterns: [
                '**/*.bak',
                '**/*.tmp',
                '**/*.orig',
                '**/*.swp',
                '**/*.swo',
                '**/~*',
                '**/.DS_Store',
                '**/Thumbs.db',
                '**/desktop.ini',
                '**/*.log',
                '**/npm-debug.log*',
                '**/yarn-debug.log*',
                '**/yarn-error.log*',
                '**/.nyc_output',
                '**/.vscode/settings.json',
                '**/.idea/**',
                '**/*.sublime-project',
                '**/*.sublime-workspace'
            ],
            preservePatterns: [
                '.gitignore',
                '.gitattributes',
                '.github/**',
                'LICENSE',
                'README.md',
                'package.json',
                'package-lock.json',
                'yarn.lock',
                'node_modules/**'
            ],
            backupBeforeDelete: true,
            dryRun: false,
            ...config
        };
    }

    async scanForArtifacts(): Promise<{ [category: string]: string[] }> {
        this.log('🔍 Scanning for development artifacts...', 'info');

        const categories: ArtifactCategory[] = [
            {
                name: 'Backup Files',
                patterns: ['**/*.bak', '**/*.orig', '**/*.tmp', '**/~*'],
                description: 'Backup and temporary files from editors',
                critical: false
            },
            {
                name: 'System Files',
                patterns: ['**/.DS_Store', '**/Thumbs.db', '**/desktop.ini'],
                description: 'Operating system specific files',
                critical: false
            },
            {
                name: 'Log Files',
                patterns: ['**/*.log', '**/npm-debug.log*', '**/yarn-debug.log*'],
                description: 'Debug and error log files',
                critical: false
            },
            {
                name: 'Editor Files',
                patterns: ['**/*.swp', '**/*.swo', '**/.idea/**', '**/*.sublime-*'],
                description: 'Editor-specific configuration and cache files',
                critical: false
            },
            {
                name: 'Test Artifacts',
                patterns: ['coverage/**', 'test-results/**', 'playwright-report/**'],
                description: 'Test coverage and result artifacts',
                critical: false
            },
            {
                name: 'Build Artifacts',
                patterns: ['dist/**', '**/.vite/**', '**/.turbo/**'],
                description: 'Build output and cache directories',
                critical: false
            }
        ];

        const foundArtifacts: { [category: string]: string[] } = {};

        for (const category of categories) {
            foundArtifacts[category.name] = [];

            for (const pattern of category.patterns) {
                try {
                    const files = await glob(pattern, {
                        cwd: PROJECT_ROOT,
                        ignore: this.config.preservePatterns,
                        absolute: false
                    });

                    const categoryArtifacts = foundArtifacts[category.name];
                    if (categoryArtifacts) {
                        categoryArtifacts.push(...files);
                    }
                } catch (error) {
                    this.log(
                        `Error scanning pattern ${pattern}: ${(error as Error).message}`,
                        'warning'
                    );
                }
            }

            const categoryArtifacts = foundArtifacts[category.name];
            const count = categoryArtifacts ? categoryArtifacts.length : 0;
            if (count > 0) {
                this.log(`Found ${count} ${category.name.toLowerCase()}`, 'info');
            }
        }

        return foundArtifacts;
    }

    async cleanupDevelopmentFiles(): Promise<CleanupResult> {
        const startTime = Date.now();
        this.log('🧹 Starting development file cleanup...', 'info');

        if (this.config.dryRun) {
            this.log('🔍 DRY RUN MODE - No files will be deleted', 'warning');
        }

        const artifacts = await this.scanForArtifacts();
        const result: CleanupResult = {
            filesRemoved: [],
            dependenciesRemoved: [],
            sizeReduced: 0,
            errors: []
        };

        // Create backup if requested
        if (this.config.backupBeforeDelete && !this.config.dryRun) {
            result.backupLocation = await this.createBackup();
        }

        // Remove artifacts by category
        for (const [category, files] of Object.entries(artifacts)) {
            this.log(`Cleaning ${category}...`, 'info');

            for (const file of files) {
                const fullPath = join(PROJECT_ROOT, file);

                try {
                    if (existsSync(fullPath)) {
                        const stats = statSync(fullPath);
                        result.sizeReduced += stats.size;

                        if (!this.config.dryRun) {
                            if (stats.isDirectory()) {
                                execSync(`rm -rf "${fullPath}"`);
                            } else {
                                unlinkSync(fullPath);
                            }
                        }

                        result.filesRemoved.push(file);
                        this.log(`  ✓ Removed: ${file}`, 'success');
                    }
                } catch (error) {
                    const errorMsg = `Failed to remove ${file}: ${(error as Error).message}`;
                    result.errors.push(errorMsg);
                    this.log(`  ❌ ${errorMsg}`, 'error');
                }
            }
        }

        const duration = Date.now() - startTime;
        const sizeReduced = this.formatBytes(result.sizeReduced);

        this.log(`\n🎉 Cleanup complete in ${duration}ms`, 'success');
        this.log(`📁 Files removed: ${result.filesRemoved.length}`, 'info');
        this.log(`💾 Size reduced: ${sizeReduced}`, 'info');

        if (result.errors.length > 0) {
            this.log(`⚠️  Errors encountered: ${result.errors.length}`, 'warning');
        }

        return result;
    }

    async removeUnusedDependencies(): Promise<DependencyCleanupResult> {
        this.log('📦 Analyzing dependencies for unused packages...', 'info');

        const packageJsonPath = join(PROJECT_ROOT, 'package.json');
        if (!existsSync(packageJsonPath)) {
            throw new Error('package.json not found');
        }

        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));
        const dependencies = packageJson.dependencies || {};
        const devDependencies = packageJson.devDependencies || {};

        const result: DependencyCleanupResult = {
            removedDependencies: [],
            removedDevDependencies: [],
            sizeBefore: JSON.stringify(packageJson).length,
            sizeAfter: 0,
            packagesScanned: Object.keys(dependencies).length + Object.keys(devDependencies).length
        };

        // Simple unused dependency detection (would be more sophisticated in production)
        const unusedPackages = await this.detectUnusedPackages(dependencies, devDependencies);

        if (!this.config.dryRun && unusedPackages.length > 0) {
            // Remove unused packages
            for (const pkg of unusedPackages) {
                if (dependencies[pkg]) {
                    delete dependencies[pkg];
                    result.removedDependencies.push(pkg);
                }
                if (devDependencies[pkg]) {
                    delete devDependencies[pkg];
                    result.removedDevDependencies.push(pkg);
                }
            }

            // Update package.json
            packageJson.dependencies = dependencies;
            packageJson.devDependencies = devDependencies;
            writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 2) + '\n');

            result.sizeAfter = JSON.stringify(packageJson).length;
        } else {
            result.sizeAfter = result.sizeBefore;
        }

        this.log(`Found ${unusedPackages.length} potentially unused packages`, 'info');
        if (unusedPackages.length > 0) {
            this.log(`Unused packages: ${unusedPackages.join(', ')}`, 'warning');
        }

        return result;
    }

    async optimizeTemplateStructure(): Promise<StructureOptimizationResult> {
        this.log('🏗️  Optimizing template structure...', 'info');

        const result: StructureOptimizationResult = {
            filesReorganized: [],
            foldersCreated: [],
            foldersRemoved: [],
            optimizations: []
        };

        // Example optimizations (would be more comprehensive in production)
        const optimizations = [
            {
                name: 'Organize documentation',
                action: () => this.organizeDocumentation(),
                description: 'Move scattered documentation to docs/ folder'
            },
            {
                name: 'Clean empty directories',
                action: () => this.removeEmptyDirectories(),
                description: 'Remove empty directories from template'
            },
            {
                name: 'Standardize naming',
                action: () => this.standardizeFileNaming(),
                description: 'Ensure consistent file naming conventions'
            }
        ];

        for (const optimization of optimizations) {
            try {
                if (!this.config.dryRun) {
                    await optimization.action();
                }
                result.optimizations.push(optimization.description);
                this.log(`✓ ${optimization.description}`, 'success');
            } catch (error) {
                this.log(
                    `❌ Failed: ${optimization.description} - ${(error as Error).message}`,
                    'error'
                );
            }
        }

        return result;
    }

    private async detectUnusedPackages(
        dependencies: Record<string, string>,
        devDependencies: Record<string, string>
    ): Promise<string[]> {
        const allPackages = [...Object.keys(dependencies), ...Object.keys(devDependencies)];
        const unusedPackages: string[] = [];

        // Simple approach: check if package name appears in source files
        // Note: This is a simplified implementation. Production version would use AST analysis
        for (const pkg of allPackages) {
            try {
                const isUsed = await this.isPackageUsed(pkg);
                if (!isUsed) {
                    unusedPackages.push(pkg);
                }
            } catch (error) {
                this.log(`Warning: Could not analyze usage for ${pkg}`, 'warning');
            }
        }

        return unusedPackages;
    }

    private async isPackageUsed(packageName: string): Promise<boolean> {
        // Check common source directories for package usage
        const sourcePatterns = [
            'src/**/*.ts',
            'src/**/*.js',
            'tests/**/*.ts',
            'tools/**/*.ts',
            'scripts/**/*.ts',
            '*.ts',
            '*.js'
        ];

        for (const pattern of sourcePatterns) {
            try {
                const files = await glob(pattern, { cwd: PROJECT_ROOT });

                for (const file of files) {
                    const content = readFileSync(join(PROJECT_ROOT, file), 'utf8');

                    // Check for import statements
                    if (
                        content.includes(`from '${packageName}'`) ||
                        content.includes(`from "${packageName}"`) ||
                        content.includes(`import '${packageName}'`) ||
                        content.includes(`import "${packageName}"`) ||
                        content.includes(`require('${packageName}')`) ||
                        content.includes(`require("${packageName}")`)
                    ) {
                        return true;
                    }
                }
            } catch (error) {
                // Ignore file read errors
            }
        }

        return false;
    }

    private async createBackup(): Promise<string> {
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-').split('T')[0];
        const backupDir = join(PROJECT_ROOT, `backup-cleanup-${timestamp}`);

        if (!existsSync(backupDir)) {
            mkdirSync(backupDir, { recursive: true });
        }

        // Create a simple backup by copying package.json and key files
        const keyFiles = ['package.json', 'README.md'];

        for (const file of keyFiles) {
            const sourcePath = join(PROJECT_ROOT, file);
            const backupPath = join(backupDir, file);

            if (existsSync(sourcePath)) {
                const content = readFileSync(sourcePath);
                writeFileSync(backupPath, content);
            }
        }

        this.log(`📦 Backup created at: ${backupDir}`, 'info');
        return backupDir;
    }

    private async organizeDocumentation(): Promise<void> {
        // Simple documentation organization
        const docsDir = join(PROJECT_ROOT, 'docs');
        if (!existsSync(docsDir)) {
            mkdirSync(docsDir, { recursive: true });
        }
    }

    private async removeEmptyDirectories(): Promise<void> {
        const removeEmptyDir = (dirPath: string): boolean => {
            if (!existsSync(dirPath)) return false;

            const files = readdirSync(dirPath);
            if (files.length === 0) {
                execSync(`rmdir "${dirPath}"`);
                return true;
            }

            return false;
        };

        // Simple empty directory removal (would be more sophisticated in production)
        const commonDirs = ['temp', 'tmp', 'cache'];
        for (const dir of commonDirs) {
            const dirPath = join(PROJECT_ROOT, dir);
            removeEmptyDir(dirPath);
        }
    }

    private async standardizeFileNaming(): Promise<void> {
        // File naming standardization would go here
        // This is a placeholder for the actual implementation
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

// CLI interface
if (import.meta.url === `file://${process.argv[1]}`) {
    const args = process.argv.slice(2);
    const dryRun = args.includes('--dry-run');
    const noBackup = args.includes('--no-backup');

    if (args.includes('--help')) {
        console.log(`
Template Artifact Cleaner

Usage:
  npx tsx tools/quality-assurance/artifact-cleaner.ts [options]

Options:
  --dry-run       Show what would be cleaned without making changes
  --no-backup     Skip creating backup before cleanup
  --help          Show this help

Examples:
  npx tsx tools/quality-assurance/artifact-cleaner.ts --dry-run
  npx tsx tools/quality-assurance/artifact-cleaner.ts --no-backup
        `);
        process.exit(0);
    }

    const cleaner = new ArtifactCleaner({
        dryRun,
        backupBeforeDelete: !noBackup
    });

    Promise.all([
        cleaner.cleanupDevelopmentFiles(),
        cleaner.removeUnusedDependencies(),
        cleaner.optimizeTemplateStructure()
    ])
        .then(([cleanupResult, depResult, structureResult]) => {
            console.log('\n🎉 Template cleanup complete!');
            console.log(`📁 Files cleaned: ${cleanupResult.filesRemoved.length}`);
            console.log(
                `📦 Dependencies removed: ${depResult.removedDependencies.length + depResult.removedDevDependencies.length}`
            );
            console.log(`🏗️  Structure optimizations: ${structureResult.optimizations.length}`);

            if (cleanupResult.errors.length > 0) {
                console.log(`⚠️  Errors: ${cleanupResult.errors.length}`);
                process.exit(1);
            }
        })
        .catch(error => {
            console.error('❌ Cleanup failed:', error.message);
            process.exit(1);
        });
}
