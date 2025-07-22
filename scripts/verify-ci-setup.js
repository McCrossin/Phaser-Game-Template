#!/usr/bin/env node
/**
 * CI/CD Setup Verification Script
 * Comprehensive verification of CI/CD configuration and dependencies
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

class CISetupVerifier {
    constructor() {
        this.results = [];
        this.startTime = Date.now();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toLocaleTimeString();
        const prefix = {
            info: '🔍',
            success: '✅',
            error: '❌',
            warning: '⚠️'
        }[type];

        console.log(`${prefix} [${timestamp}] ${message}`);
        this.results.push({ message, type, timestamp });
    }

    async verifyProjectStructure() {
        this.log('Verifying project structure...');

        const requiredPaths = [
            '.github/workflows',
            'src',
            'config/build',
            'testing/config',
            'tools/maintenance',
            'scripts',
            'package.json',
            'Dockerfile'
        ];

        let valid = true;

        for (const path of requiredPaths) {
            const fullPath = join(PROJECT_ROOT, path);
            if (existsSync(fullPath)) {
                this.log(`${path} - EXISTS`, 'success');
            } else {
                this.log(`${path} - MISSING`, 'error');
                valid = false;
            }
        }

        return valid;
    }

    async validateWorkflowSyntax() {
        this.log('Validating GitHub Actions workflow syntax...');

        const workflowDir = join(PROJECT_ROOT, '.github', 'workflows');

        if (!existsSync(workflowDir)) {
            this.log('Workflow directory not found', 'error');
            return false;
        }

        const workflowFiles = readdirSync(workflowDir).filter(f => f.endsWith('.yml'));

        let valid = true;

        for (const file of workflowFiles) {
            try {
                const filePath = join(workflowDir, file);
                const content = readFileSync(filePath, 'utf-8');

                // Basic YAML structure validation
                if (!content.includes('name:')) {
                    this.log(`${file} - Missing 'name' field`, 'error');
                    valid = false;
                    continue;
                }

                if (!content.includes('on:')) {
                    this.log(`${file} - Missing 'on' field`, 'error');
                    valid = false;
                    continue;
                }

                if (!content.includes('jobs:')) {
                    this.log(`${file} - Missing 'jobs' field`, 'error');
                    valid = false;
                    continue;
                }

                // Check for common issues
                if (content.includes('packages: write') || content.includes('contents: write')) {
                    if (!content.includes('permissions:')) {
                        this.log(
                            `${file} - Using write permissions without explicit declaration`,
                            'warning'
                        );
                    }
                }

                if (!content.includes('timeout-minutes:')) {
                    this.log(
                        `${file} - Consider adding timeout-minutes to prevent hung jobs`,
                        'warning'
                    );
                }

                this.log(`${file} - Syntax validation passed`, 'success');
            } catch (error) {
                this.log(`${file} - Syntax validation failed: ${error.message}`, 'error');
                valid = false;
            }
        }

        return valid;
    }

    async verifyPackageJsonConfiguration() {
        this.log('Verifying package.json configuration...');

        const packageJsonPath = join(PROJECT_ROOT, 'package.json');

        try {
            const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf-8'));

            // Check required scripts
            const requiredScripts = [
                'build',
                'test:run',
                'lint',
                'typecheck',
                'test:github-actions'
            ];

            let valid = true;

            for (const script of requiredScripts) {
                if (packageJson.scripts && script in packageJson.scripts) {
                    this.log(`Script '${script}' - EXISTS`, 'success');
                } else {
                    this.log(`Script '${script}' - MISSING`, 'error');
                    valid = false;
                }
            }

            // Check Node.js version constraint
            if (packageJson.engines && packageJson.engines.node) {
                this.log(`Node.js version constraint: ${packageJson.engines.node}`, 'info');
            } else {
                this.log('No Node.js version constraint specified', 'warning');
            }

            // Check for CI-friendly settings
            if (packageJson.type === 'module') {
                this.log('ES modules enabled - good for modern CI', 'success');
            }

            return valid;
        } catch (error) {
            this.log(`Failed to parse package.json: ${error.message}`, 'error');
            return false;
        }
    }

    async verifyTypeScriptConfiguration() {
        this.log('Verifying TypeScript configuration...');

        const tsconfigPaths = ['config/build/tsconfig.json', 'config/build/tsconfig.build.json'];

        let valid = true;

        for (const configPath of tsconfigPaths) {
            const fullPath = join(PROJECT_ROOT, configPath);

            if (existsSync(fullPath)) {
                try {
                    const content = JSON.parse(readFileSync(fullPath, 'utf-8'));
                    this.log(`${configPath} - Valid JSON`, 'success');

                    // Check for strict mode
                    if (content.compilerOptions && content.compilerOptions.strict) {
                        this.log(`${configPath} - Strict mode enabled`, 'success');
                    } else {
                        this.log(`${configPath} - Strict mode not enabled`, 'warning');
                    }
                } catch (error) {
                    this.log(`${configPath} - Invalid JSON: ${error.message}`, 'error');
                    valid = false;
                }
            } else {
                this.log(`${configPath} - MISSING`, 'error');
                valid = false;
            }
        }

        return valid;
    }

    async verifyTestConfiguration() {
        this.log('Verifying test configuration...');

        const testConfigPaths = [
            'testing/config/vitest.config.ts',
            'testing/config/playwright.config.ts'
        ];

        let valid = true;

        for (const configPath of testConfigPaths) {
            const fullPath = join(PROJECT_ROOT, configPath);

            if (existsSync(fullPath)) {
                this.log(`${configPath} - EXISTS`, 'success');
            } else {
                this.log(`${configPath} - MISSING`, 'error');
                valid = false;
            }
        }

        return valid;
    }

    async checkRequiredSecrets() {
        this.log('Checking required secrets documentation...');

        const secretsToDocument = [
            'GITHUB_TOKEN',
            'DEPLOYMENT_KEY',
            'STAGING_URL',
            'PRODUCTION_URL'
        ];

        // Check if there's documentation about secrets
        const docsPath = join(PROJECT_ROOT, 'docs');
        const ciDocsPath = join(docsPath, 'ci-cd-setup.md');

        if (existsSync(ciDocsPath)) {
            const content = readFileSync(ciDocsPath, 'utf-8');

            for (const secret of secretsToDocument) {
                if (content.includes(secret)) {
                    this.log(`Secret '${secret}' - Documented`, 'success');
                } else {
                    this.log(`Secret '${secret}' - Not documented`, 'warning');
                }
            }
        } else {
            this.log('CI/CD documentation not found - create docs/ci-cd-setup.md', 'warning');
        }

        return true;
    }

    async checkDependencyCompatibility() {
        this.log('Checking dependency compatibility...');

        try {
            // Check if all dependencies are installed
            this.log('Running npm list to check dependencies...');
            execSync('npm list --depth=0', {
                cwd: PROJECT_ROOT,
                stdio: 'pipe'
            });
            this.log('All dependencies installed successfully', 'success');

            // Check for security vulnerabilities
            this.log('Running security audit...');
            try {
                execSync('npm audit --audit-level moderate', {
                    cwd: PROJECT_ROOT,
                    stdio: 'pipe'
                });
                this.log('No security vulnerabilities found', 'success');
            } catch (auditError) {
                this.log('Security vulnerabilities detected - run: npm audit', 'warning');
            }

            return true;
        } catch (error) {
            this.log(`Dependency check failed: ${error.message}`, 'error');
            this.log('Run: npm install', 'info');
            return false;
        }
    }

    async testBuildArtifacts() {
        this.log('Testing build artifact generation...');

        try {
            // Clean any existing build
            const distPath = join(PROJECT_ROOT, 'dist');
            if (existsSync(distPath)) {
                execSync('rm -rf dist', { cwd: PROJECT_ROOT });
            }

            // Run build
            this.log('Building project...');
            execSync('npm run build', {
                cwd: PROJECT_ROOT,
                stdio: 'pipe'
            });

            // Check if build artifacts exist
            if (existsSync(distPath)) {
                const files = execSync('find dist -type f', {
                    cwd: PROJECT_ROOT,
                    encoding: 'utf-8'
                })
                    .trim()
                    .split('\n')
                    .filter(f => f);

                this.log(`Build artifacts generated: ${files.length} files`, 'success');

                // Check for essential files
                const essentialFiles = ['index.html'];
                const essentialPatterns = [
                    { pattern: /index-.*\.js$/, description: 'main JavaScript bundle' },
                    { pattern: /phaser-.*\.js$/, description: 'Phaser library bundle' }
                ];

                for (const file of essentialFiles) {
                    if (files.some(f => f.includes(file))) {
                        this.log(`Essential file '${file}' - EXISTS`, 'success');
                    } else {
                        this.log(`Essential file '${file}' - MISSING`, 'error');
                        return false;
                    }
                }

                for (const { pattern, description } of essentialPatterns) {
                    if (files.some(f => pattern.test(f))) {
                        this.log(`Essential artifact '${description}' - EXISTS`, 'success');
                    } else {
                        this.log(`Essential artifact '${description}' - MISSING`, 'error');
                        return false;
                    }
                }
            } else {
                this.log('Build artifacts not generated', 'error');
                return false;
            }

            return true;
        } catch (error) {
            this.log(`Build test failed: ${error.message}`, 'error');
            return false;
        }
    }

    async runFullVerification(options = {}) {
        this.log('🔧 Starting CI/CD setup verification...', 'info');

        const tests = [
            { name: 'Project Structure', fn: () => this.verifyProjectStructure() },
            { name: 'Workflow Syntax', fn: () => this.validateWorkflowSyntax() },
            { name: 'package.json Configuration', fn: () => this.verifyPackageJsonConfiguration() },
            { name: 'TypeScript Configuration', fn: () => this.verifyTypeScriptConfiguration() },
            { name: 'Test Configuration', fn: () => this.verifyTestConfiguration() },
            { name: 'Build Artifacts', fn: () => this.testBuildArtifacts() }
        ];

        if (options.checkSecrets) {
            tests.push({ name: 'Required Secrets', fn: () => this.checkRequiredSecrets() });
        }

        if (options.checkDependencies) {
            tests.push({
                name: 'Dependency Compatibility',
                fn: () => this.checkDependencyCompatibility()
            });
        }

        let overallSuccess = true;
        const testResults = [];

        for (const test of tests) {
            this.log(`\n--- ${test.name} ---`, 'info');
            const startTime = Date.now();

            try {
                const result = await test.fn();
                const duration = Date.now() - startTime;

                testResults.push({
                    name: test.name,
                    success: result,
                    duration
                });

                if (!result) {
                    overallSuccess = false;
                }
            } catch (error) {
                const duration = Date.now() - startTime;
                testResults.push({
                    name: test.name,
                    success: false,
                    duration,
                    error: error.message
                });
                overallSuccess = false;
            }
        }

        this.log('\n📊 Verification Summary:', 'info');

        for (const result of testResults) {
            if (result.success) {
                this.log(`${result.name} - PASSED (${result.duration}ms)`, 'success');
            } else {
                this.log(`${result.name} - FAILED (${result.duration}ms)`, 'error');
                if (result.error) {
                    this.log(`   Error: ${result.error}`, 'error');
                }
            }
        }

        const totalDuration = Date.now() - this.startTime;
        this.log(`\nTotal verification time: ${totalDuration}ms`);

        if (overallSuccess) {
            this.log('\n🎉 CI/CD setup verification completed successfully!', 'success');
            this.log('Your project is ready for GitHub Actions deployment.', 'success');
            return true;
        } else {
            this.log('\n💥 Some verification checks failed.', 'error');
            this.log('Fix the issues above before proceeding with CI/CD setup.', 'error');
            return false;
        }
    }

    showHelp() {
        console.log(`
🔧 CI/CD Setup Verification Script

Usage:
  node scripts/verify-ci-setup.js [options]

Options:
  --check-secrets      Verify required secrets are documented
  --check-dependencies Verify all npm dependencies are compatible
  --verbose, -v        Enable verbose output
  --help, -h           Show this help message

Examples:
  node scripts/verify-ci-setup.js
  node scripts/verify-ci-setup.js --check-secrets --check-dependencies
  npm run verify:ci-setup                    # via package.json script
  npm run verify:ci-setup -- --check-secrets

This script verifies that all CI/CD components are properly configured,
including GitHub Actions workflows, dependencies, secrets, and environment setup.
        `);
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const verifier = new CISetupVerifier();

    try {
        if (args.includes('--help') || args.includes('-h')) {
            verifier.showHelp();
            process.exit(0);
        }

        const options = {
            checkSecrets: args.includes('--check-secrets'),
            checkDependencies: args.includes('--check-dependencies'),
            verbose: args.includes('--verbose') || args.includes('-v')
        };

        const success = await verifier.runFullVerification(options);
        process.exit(success ? 0 : 1);
    } catch (error) {
        verifier.log(`Verification script failed: ${error.message}`, 'error');
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
