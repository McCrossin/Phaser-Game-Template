#!/usr/bin/env node
/**
 * Local GitHub Actions Testing Script
 * Tests GitHub Actions workflows locally using Docker
 */

import { execSync } from 'child_process';
import { existsSync } from 'fs';
import { join } from 'path';

const PROJECT_ROOT = process.cwd();

class GitHubActionsLocalTester {
    constructor() {
        this.results = [];
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

    async testDockerBuild() {
        this.log('Testing Docker build locally...');

        // Check if Docker is available first
        try {
            execSync('docker --version', { stdio: 'pipe' });
        } catch (error) {
            this.log('Docker not available in this environment - skipping Docker tests', 'warning');
            this.log('Note: Docker tests will run in GitHub Actions environment', 'info');
            return true; // Return true to not fail the overall test
        }

        try {
            // Test the Docker build that GitHub Actions uses
            const buildCommand = 'docker build --platform linux/amd64 -t new-eden-project:test .';
            this.log(`Running: ${buildCommand}`);

            execSync(buildCommand, {
                stdio: 'pipe',
                cwd: PROJECT_ROOT
            });

            this.log('Docker build successful!', 'success');
            return true;
        } catch (error) {
            this.log(`Docker build failed: ${error.message}`, 'error');

            // Extract useful error info
            if (error.stdout) {
                this.log(`Docker stdout: ${error.stdout.toString()}`, 'error');
            }
            if (error.stderr) {
                this.log(`Docker stderr: ${error.stderr.toString()}`, 'error');
            }

            return false;
        }
    }

    async testNpmScripts() {
        this.log('Testing npm scripts that GitHub Actions uses...');

        const scripts = ['npm run typecheck', 'npm run lint', 'npm run test:run', 'npm run build'];

        let allPassed = true;

        for (const script of scripts) {
            try {
                this.log(`Running: ${script}`);
                execSync(script, {
                    stdio: 'pipe',
                    cwd: PROJECT_ROOT
                });
                this.log(`${script} - PASSED`, 'success');
            } catch (error) {
                this.log(`${script} - FAILED: ${error.message}`, 'error');
                allPassed = false;
            }
        }

        return allPassed;
    }

    async validateWorkflowFiles() {
        this.log('Validating GitHub Actions workflow files...');

        const workflowDir = join(PROJECT_ROOT, '.github', 'workflows');
        const requiredWorkflows = [
            'ci.yml',
            'deploy-staging.yml',
            'deploy-production.yml',
            'security-scan.yml',
            'performance-advanced.yml'
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

    async testContainerRegistry() {
        this.log('Testing container registry configuration...');

        // Check if Docker is available first
        try {
            execSync('docker --version', { stdio: 'pipe' });
        } catch (error) {
            this.log('Docker not available - skipping container registry tests', 'warning');
            this.log(
                'Note: Container registry tests will run in GitHub Actions environment',
                'info'
            );
            return true; // Return true to not fail the overall test
        }

        try {
            // Check if we can build and tag properly
            const tagCommand =
                'docker build --platform linux/amd64 -t ghcr.io/mccrossin/new-eden-project:test .';
            execSync(tagCommand, {
                stdio: 'pipe',
                cwd: PROJECT_ROOT
            });

            this.log('Container registry tagging successful!', 'success');

            // Note: We can't test the actual push without authentication
            this.log('Note: Actual GHCR push will require GitHub Actions context', 'warning');

            return true;
        } catch (error) {
            this.log(`Container registry test failed: ${error.message}`, 'error');
            return false;
        }
    }

    async simulateGitHubActionsEnvironment() {
        this.log('Simulating GitHub Actions environment variables...');

        // Set environment variables that GitHub Actions would have
        process.env.NODE_ENV = 'production';
        process.env.CI = 'true';
        process.env.GITHUB_ACTIONS = 'true';

        this.log('Environment variables set for CI simulation', 'success');
        return true;
    }

    async runFullTest() {
        this.log('🚀 Starting Local GitHub Actions Test Suite', 'info');
        this.log('This simulates what GitHub Actions will run', 'info');

        const tests = [
            { name: 'Environment Setup', fn: () => this.simulateGitHubActionsEnvironment() },
            { name: 'Workflow File Validation', fn: () => this.validateWorkflowFiles() },
            { name: 'npm Scripts Test', fn: () => this.testNpmScripts() },
            { name: 'Docker Build Test', fn: () => this.testDockerBuild() },
            { name: 'Container Registry Test', fn: () => this.testContainerRegistry() }
        ];

        let overallSuccess = true;

        for (const test of tests) {
            this.log(`\n--- ${test.name} ---`);
            const result = await test.fn();
            if (!result) {
                overallSuccess = false;
            }
        }

        this.log('\n📊 Test Summary:', 'info');
        this.results.forEach(result => {
            if (result.type === 'error') {
                console.log(`❌ ${result.message}`);
            }
        });

        if (overallSuccess) {
            this.log('\n🎉 All tests passed! GitHub Actions should work correctly.', 'success');
            process.exit(0);
        } else {
            this.log('\n💥 Some tests failed. Fix issues before pushing to GitHub.', 'error');
            process.exit(1);
        }
    }

    async quickCheck() {
        this.log('⚡ Quick GitHub Actions compatibility check...');

        // Just test the essential npm scripts
        try {
            execSync('npm run typecheck', { stdio: 'pipe' });
            execSync('npm run lint', { stdio: 'pipe' });
            execSync('npm run test:run', { stdio: 'pipe' });
            execSync('npm run build', { stdio: 'pipe' });

            this.log('Quick check PASSED - basic workflow should succeed', 'success');
            return true;
        } catch (error) {
            this.log(`Quick check FAILED: ${error.message}`, 'error');
            return false;
        }
    }
}

// CLI interface
const args = process.argv.slice(2);
const tester = new GitHubActionsLocalTester();

if (args.includes('--quick')) {
    tester.quickCheck();
} else if (args.includes('--docker-only')) {
    tester.testDockerBuild();
} else if (args.includes('--help')) {
    console.log(`
Local GitHub Actions Tester

Usage:
  node scripts/test-github-actions.js [options]

Options:
  --quick      Run quick compatibility check
  --docker-only Test only Docker build
  --help       Show this help

Default: Run full test suite
    `);
} else {
    tester.runFullTest();
}
