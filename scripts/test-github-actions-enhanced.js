#!/usr/bin/env node
/**
 * Enhanced Local GitHub Actions Testing Script
 * Tests GitHub Actions workflows locally with comprehensive verification
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '..');

class EnhancedGitHubActionsLocalTester {
    constructor() {
        this.results = [];
        this.startTime = Date.now();
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString();
        const prefix = {
            info: '🔍',
            success: '✅',
            error: '❌',
            warning: '⚠️'
        }[type];

        console.log(`${prefix} [${timestamp}] ${message}`);
        this.results.push({ message, type, timestamp });
    }

    async checkPrerequisites() {
        this.log('Checking prerequisites...');

        try {
            // Check Node.js
            const nodeVersion = execSync('node --version', { encoding: 'utf-8' }).trim();
            this.log(`Node.js version: ${nodeVersion}`, 'success');

            // Check npm
            const npmVersion = execSync('npm --version', { encoding: 'utf-8' }).trim();
            this.log(`npm version: ${npmVersion}`, 'success');

            // Check Docker (optional)
            try {
                const dockerVersion = execSync('docker --version', {
                    encoding: 'utf-8',
                    stdio: 'pipe'
                }).trim();
                this.log(`Docker version: ${dockerVersion}`, 'success');
                return { node: true, npm: true, docker: true };
            } catch {
                this.log('Docker not found. Docker tests will be skipped.', 'warning');
                return { node: true, npm: true, docker: false };
            }
        } catch (error) {
            this.log(`Prerequisites check failed: ${error.message}`, 'error');
            return { node: false, npm: false, docker: false };
        }
    }

    async testNpmScripts(verbose = false) {
        this.log('Testing npm scripts that GitHub Actions uses...');

        const scripts = ['npm run typecheck', 'npm run lint', 'npm run test:run', 'npm run build'];

        let allPassed = true;

        for (const script of scripts) {
            try {
                this.log(`Running: ${script}`);
                const startTime = Date.now();

                const output = execSync(script, {
                    cwd: PROJECT_ROOT,
                    encoding: 'utf-8',
                    stdio: verbose ? 'inherit' : 'pipe'
                });

                const duration = Date.now() - startTime;
                this.log(`${script} - PASSED (${duration}ms)`, 'success');

                if (verbose && output) {
                    console.log(output);
                }
            } catch (error) {
                this.log(`${script} - FAILED: ${error.message}`, 'error');
                if (verbose && error.stdout) {
                    console.log('STDOUT:', error.stdout.toString());
                }
                if (verbose && error.stderr) {
                    console.log('STDERR:', error.stderr.toString());
                }
                allPassed = false;
            }
        }

        return allPassed;
    }

    async testDockerBuild(verbose = false) {
        this.log('Testing Docker build locally...');

        try {
            execSync('docker --version', { stdio: 'pipe' });
        } catch {
            this.log('Docker not available - skipping Docker tests', 'warning');
            this.log('Note: Docker tests will run in GitHub Actions environment');
            return true;
        }

        try {
            const buildCommand =
                'docker build --platform linux/amd64 -t phaser-game-template:test .';
            this.log(`Running: ${buildCommand}`);

            const startTime = Date.now();
            execSync(buildCommand, {
                cwd: PROJECT_ROOT,
                stdio: verbose ? 'inherit' : 'pipe'
            });

            const duration = Date.now() - startTime;
            this.log(`Docker build successful! (${duration}ms)`, 'success');
            return true;
        } catch (error) {
            this.log(`Docker build failed: ${error.message}`, 'error');

            if (verbose) {
                if (error.stdout) {
                    console.log('Docker STDOUT:', error.stdout.toString());
                }
                if (error.stderr) {
                    console.log('Docker STDERR:', error.stderr.toString());
                }
            }
            return false;
        }
    }

    async validateWorkflowFiles() {
        this.log('Validating GitHub Actions workflow files...');

        const workflowDir = join(PROJECT_ROOT, '.github', 'workflows');
        const requiredWorkflows = [
            'ci.yml',
            'deploy-staging.yml',
            'deploy-production.yml',
            'security-scan.yml',
            'performance-advanced.yml',
            'health-monitoring.yml'
        ];

        let valid = true;

        for (const workflow of requiredWorkflows) {
            const workflowPath = join(workflowDir, workflow);
            if (existsSync(workflowPath)) {
                this.log(`${workflow} - EXISTS`, 'success');
            } else {
                this.log(`${workflow} - MISSING`, 'error');
                valid = false;
            }
        }

        return valid;
    }

    async testContainerRegistry(verbose = false) {
        this.log('Testing container registry configuration...');

        try {
            execSync('docker --version', { stdio: 'pipe' });
        } catch {
            this.log('Docker not available - skipping container registry tests', 'warning');
            this.log('Note: Container registry tests will run in GitHub Actions environment');
            return true;
        }

        try {
            const tagCommand =
                'docker build --platform linux/amd64 -t ghcr.io/template-author/phaser-game-template:test .';

            execSync(tagCommand, {
                cwd: PROJECT_ROOT,
                stdio: verbose ? 'inherit' : 'pipe'
            });

            this.log('Container registry tagging successful!', 'success');
            this.log('Note: Actual GHCR push will require GitHub Actions context', 'warning');
            return true;
        } catch (error) {
            this.log(`Container registry test failed: ${error.message}`, 'error');
            return false;
        }
    }

    setGitHubActionsEnvironment() {
        this.log('Simulating GitHub Actions environment variables...');

        process.env.NODE_ENV = 'production';
        process.env.CI = 'true';
        process.env.GITHUB_ACTIONS = 'true';

        this.log('Environment variables set for CI simulation', 'success');
        return true;
    }

    async runQuickCheck(verbose = false) {
        this.log('⚡ Quick GitHub Actions compatibility check...');

        const prerequisites = await this.checkPrerequisites();
        if (!prerequisites.node || !prerequisites.npm) {
            this.log('Prerequisites not met', 'error');
            return false;
        }

        this.setGitHubActionsEnvironment();
        const result = await this.testNpmScripts(verbose);

        if (result) {
            this.log('Quick check PASSED - basic workflow should succeed', 'success');
            return true;
        } else {
            this.log('Quick check FAILED', 'error');
            return false;
        }
    }

    async runDockerOnlyTest(verbose = false) {
        this.log('🐳 Docker-only test...');

        const prerequisites = await this.checkPrerequisites();
        if (!prerequisites.docker) {
            this.log('Docker not available', 'error');
            return false;
        }

        return await this.testDockerBuild(verbose);
    }

    async runFullTestSuite(verbose = false) {
        this.log('🚀 Running full GitHub Actions test suite...');

        const prerequisites = await this.checkPrerequisites();
        if (!prerequisites.node || !prerequisites.npm) {
            this.log('Prerequisites not met', 'error');
            return false;
        }

        this.setGitHubActionsEnvironment();

        const tests = [
            { name: 'Workflow File Validation', fn: () => this.validateWorkflowFiles() },
            { name: 'npm Scripts Test', fn: () => this.testNpmScripts(verbose) },
            { name: 'Docker Build Test', fn: () => this.testDockerBuild(verbose) },
            { name: 'Container Registry Test', fn: () => this.testContainerRegistry(verbose) }
        ];

        let overallSuccess = true;
        const testResults = [];

        for (const test of tests) {
            this.log(`\n--- ${test.name} ---`);
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
                this.log(`${test.name} threw error: ${error.message}`, 'error');
                testResults.push({
                    name: test.name,
                    success: false,
                    duration,
                    error: error.message
                });
                overallSuccess = false;
            }
        }

        // Summary
        this.log('\n📊 Test Summary:');
        testResults.forEach(result => {
            const status = result.success ? 'PASSED' : 'FAILED';
            const statusIcon = result.success ? '✅' : '❌';
            this.log(`${statusIcon} ${result.name}: ${status} (${result.duration}ms)`);
            if (result.error) {
                this.log(`   Error: ${result.error}`, 'error');
            }
        });

        const totalDuration = Date.now() - this.startTime;
        this.log(`\nTotal execution time: ${totalDuration}ms`);

        if (overallSuccess) {
            this.log('\n🎉 All tests passed! GitHub Actions should work correctly.', 'success');
            return true;
        } else {
            this.log('\n💥 Some tests failed. Fix issues before pushing to GitHub.', 'error');
            return false;
        }
    }

    showHelp() {
        console.log(`
🚀 Enhanced Local GitHub Actions Tester

Usage:
  node scripts/test-github-actions-enhanced.js [options]

Options:
  --quick              Run quick compatibility check (fastest)
  --docker-only        Test only Docker build components
  --verbose, -v        Enable verbose output (show command outputs)
  --help, -h           Show this help message

Examples:
  node scripts/test-github-actions-enhanced.js
  node scripts/test-github-actions-enhanced.js --quick
  node scripts/test-github-actions-enhanced.js --docker-only --verbose
  npm run test:github-actions:enhanced          # via package.json script
  npm run test:github-actions:enhanced -- --quick

Default: Run full test suite

This script simulates the exact same environment and commands that GitHub Actions uses,
helping you catch issues before pushing to the repository.
        `);
    }
}

// CLI interface
async function main() {
    const args = process.argv.slice(2);
    const tester = new EnhancedGitHubActionsLocalTester();

    const verbose = args.includes('--verbose') || args.includes('-v');

    try {
        if (args.includes('--help') || args.includes('-h')) {
            tester.showHelp();
            process.exit(0);
        } else if (args.includes('--quick')) {
            const success = await tester.runQuickCheck(verbose);
            process.exit(success ? 0 : 1);
        } else if (args.includes('--docker-only')) {
            const success = await tester.runDockerOnlyTest(verbose);
            process.exit(success ? 0 : 1);
        } else {
            const success = await tester.runFullTestSuite(verbose);
            process.exit(success ? 0 : 1);
        }
    } catch (error) {
        tester.log(`Script execution failed: ${error.message}`, 'error');
        process.exit(1);
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    main();
}
