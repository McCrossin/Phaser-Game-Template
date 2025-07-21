#!/usr/bin/env node
/**
 * CI Verification Utility
 * Provides utilities for testing and verifying CI/CD setup
 */

import { execSync } from 'child_process';
import { existsSync, readFileSync, writeFileSync } from 'fs';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '../..');

/**
 * @typedef {Object} WorkflowTestResult
 * @property {string} workflowName
 * @property {'success'|'failure'|'skipped'} status
 * @property {number} duration
 * @property {string[]} [errors]
 * @property {string[]} [artifacts]
 */

/**
 * @typedef {Object} CIVerificationConfig
 * @property {string[]} workflows
 * @property {string[]} requiredSecrets
 * @property {string[]} requiredVariables
 * @property {Object} testMatrix
 */

class CIVerificationUtility {
    constructor() {
        this.results = [];
        this.config = {
            workflows: [
                'ci.yml',
                'deploy-staging.yml',
                'deploy-production.yml',
                'security-scan.yml',
                'performance-advanced.yml',
                'health-monitoring.yml'
            ],
            requiredSecrets: [
                'GITHUB_TOKEN',
                'DEPLOYMENT_KEY',
                'STAGING_DEPLOY_URL',
                'PRODUCTION_DEPLOY_URL'
            ],
            requiredVariables: [
                'NODE_ENV',
                'GAME_API_URL'
            ],
            testMatrix: {
                nodeVersions: ['22', '23'],
                platforms: ['ubuntu-latest']
            }
        };
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
    }

    async validateWorkflowSyntax() {
        this.log('Validating GitHub Actions workflow syntax...');

        const workflowDir = join(PROJECT_ROOT, '.github', 'workflows');
        let allValid = true;

        for (const workflow of this.config.workflows) {
            const workflowPath = join(workflowDir, workflow);
            
            if (!existsSync(workflowPath)) {
                this.log(`Workflow ${workflow} not found`, 'error');
                allValid = false;
                continue;
            }

            try {
                const content = readFileSync(workflowPath, 'utf-8');
                
                // Basic YAML structure validation
                if (!content.includes('name:')) {
                    this.log(`${workflow}: Missing 'name' field`, 'error');
                    allValid = false;
                }
                
                if (!content.includes('on:')) {
                    this.log(`${workflow}: Missing 'on' field`, 'error');
                    allValid = false;
                }
                
                if (!content.includes('jobs:')) {
                    this.log(`${workflow}: Missing 'jobs' field`, 'error');
                    allValid = false;
                }

                // Check for required permissions
                if (content.includes('packages: write') || content.includes('contents: write')) {
                    if (!content.includes('permissions:')) {
                        this.log(`${workflow}: Using write permissions without explicit declaration`, 'warning');
                    }
                }

                // Check for timeout settings
                if (!content.includes('timeout-minutes:')) {
                    this.log(`${workflow}: Consider adding timeout-minutes to prevent hung jobs`, 'warning');
                }

                this.log(`${workflow}: Syntax validation passed`, 'success');
                
            } catch (error) {
                this.log(`${workflow}: Syntax validation failed - ${error.message}`, 'error');
                allValid = false;
            }
        }

        return allValid;
    }

    async testWorkflowDependencies() {
        this.log('Testing workflow dependencies...');

        try {
            // Test npm scripts that workflows depend on
            const criticalScripts = [
                'npm run typecheck',
                'npm run lint',
                'npm run test:run',
                'npm run build'
            ];

            for (const script of criticalScripts) {
                try {
                    this.log(`Testing: ${script}`);
                    execSync(script, { 
                        stdio: 'pipe', 
                        cwd: PROJECT_ROOT,
                        timeout: 120000 // 2 minutes timeout
                    });
                    this.log(`${script}: PASSED`, 'success');
                } catch (error) {
                    this.log(`${script}: FAILED - ${error.message}`, 'error');
                    return false;
                }
            }

            return true;
        } catch (error) {
            this.log(`Dependency test failed: ${error.message}`, 'error');
            return false;
        }
    }

    async generateWorkflowReport() {
        this.log('Generating workflow status report...');

        const report = {
            timestamp: new Date().toISOString(),
            projectRoot: PROJECT_ROOT,
            workflows: this.config.workflows.map(workflow => {
                const workflowPath = join(PROJECT_ROOT, '.github', 'workflows', workflow);
                return {
                    name: workflow,
                    exists: existsSync(workflowPath),
                    lastModified: existsSync(workflowPath) 
                        ? readFileSync(workflowPath, 'utf-8').split('\n')[0] // First line as identifier
                        : null
                };
            }),
            requiredSecrets: this.config.requiredSecrets,
            testResults: this.results,
            recommendations: this.generateRecommendations()
        };

        const reportPath = join(PROJECT_ROOT, 'ci-verification-report.json');
        writeFileSync(reportPath, JSON.stringify(report, null, 2));
        this.log(`Report saved to: ${reportPath}`, 'success');
    }

    generateRecommendations() {
        const recommendations = [];

        // Check for common optimizations
        recommendations.push('Consider using dependency caching to speed up workflows');
        recommendations.push('Implement matrix builds for cross-platform testing');
        recommendations.push('Add workflow status badges to README.md');
        recommendations.push('Set up branch protection rules for main branch');
        recommendations.push('Configure automated dependency updates with Dependabot');

        return recommendations;
    }

    async testArtifactGeneration() {
        this.log('Testing artifact generation...');

        try {
            // Clean previous builds
            const distPath = join(PROJECT_ROOT, 'dist');
            if (existsSync(distPath)) {
                execSync('rm -rf dist', { cwd: PROJECT_ROOT });
            }

            // Run build
            execSync('npm run build', { 
                stdio: 'pipe', 
                cwd: PROJECT_ROOT,
                timeout: 300000 // 5 minutes timeout
            });

            // Verify artifacts
            if (!existsSync(distPath)) {
                this.log('Build artifacts not generated', 'error');
                return false;
            }

            const artifacts = execSync('find dist -type f', { 
                cwd: PROJECT_ROOT, 
                encoding: 'utf-8' 
            }).trim().split('\n');

            this.log(`Generated ${artifacts.length} build artifacts`, 'success');

            // Check for essential files
            const essentialFiles = ['index.html'];
            const essentialPatterns = [
                { pattern: /index-.*\.js$/, description: 'main JavaScript bundle' },
                { pattern: /phaser-.*\.js$/, description: 'Phaser library bundle' }
            ];
            
            for (const file of essentialFiles) {
                const hasFile = artifacts.some(artifact => artifact.includes(file));
                if (hasFile) {
                    this.log(`Essential file '${file}': Found`, 'success');
                } else {
                    this.log(`Essential file '${file}': Missing`, 'error');
                    return false;
                }
            }

            for (const { pattern, description } of essentialPatterns) {
                const hasPattern = artifacts.some(artifact => pattern.test(artifact));
                if (hasPattern) {
                    this.log(`Essential artifact '${description}': Found`, 'success');
                } else {
                    this.log(`Essential artifact '${description}': Missing`, 'error');
                    return false;
                }
            }

            return true;
        } catch (error) {
            this.log(`Artifact generation test failed: ${error.message}`, 'error');
            return false;
        }
    }

    async testPerformanceRequirements() {
        this.log('Testing performance requirements...');

        try {
            // Run performance check
            execSync('npm run performance:check', { 
                stdio: 'pipe', 
                cwd: PROJECT_ROOT 
            });

            this.log('Performance requirements test passed', 'success');
            return true;
        } catch (error) {
            this.log(`Performance test failed: ${error.message}`, 'error');
            return false;
        }
    }

    async runFullVerification() {
        this.log('🚀 Starting full CI/CD verification...');

        const tests = [
            { name: 'Workflow Syntax Validation', fn: () => this.validateWorkflowSyntax() },
            { name: 'Workflow Dependencies Test', fn: () => this.testWorkflowDependencies() },
            { name: 'Artifact Generation Test', fn: () => this.testArtifactGeneration() },
            { name: 'Performance Requirements Test', fn: () => this.testPerformanceRequirements() }
        ];

        let overallSuccess = true;

        for (const test of tests) {
            this.log(`\n--- ${test.name} ---`);
            const startTime = Date.now();
            
            try {
                const result = await test.fn();
                const duration = Date.now() - startTime;
                
                this.results.push({
                    workflowName: test.name,
                    status: result ? 'success' : 'failure',
                    duration,
                    errors: result ? undefined : ['Test failed']
                });

                if (!result) {
                    overallSuccess = false;
                }
            } catch (error) {
                this.results.push({
                    workflowName: test.name,
                    status: 'failure',
                    duration: Date.now() - startTime,
                    errors: [error.message]
                });
                overallSuccess = false;
            }
        }

        // Generate report
        await this.generateWorkflowReport();

        this.log('\n📊 Verification Summary:');
        this.results.forEach(result => {
            const statusIcon = result.status === 'success' ? '✅' : '❌';
            this.log(`${statusIcon} ${result.workflowName}: ${result.status.toUpperCase()} (${result.duration}ms)`);
        });

        if (overallSuccess) {
            this.log('\n🎉 All CI/CD verification tests passed!', 'success');
            this.log('Your GitHub Actions pipeline is ready for deployment.', 'success');
        } else {
            this.log('\n💥 Some verification tests failed.', 'error');
            this.log('Fix the issues above before deploying to production.', 'error');
        }

        return overallSuccess;
    }
}

// CLI interface
const args = process.argv.slice(2);
const verifier = new CIVerificationUtility();

if (args.includes('--help')) {
    console.log(`
CI Verification Utility

Usage:
  node tools/maintenance/ci-verification.js [options]

Options:
  --syntax-only    Test only workflow syntax
  --dependencies   Test only workflow dependencies
  --artifacts      Test only artifact generation
  --performance    Test only performance requirements
  --help          Show this help

Default: Run full verification suite
    `);
    process.exit(0);
}

if (args.includes('--syntax-only')) {
    verifier.validateWorkflowSyntax().then(result => {
        process.exit(result ? 0 : 1);
    });
} else if (args.includes('--dependencies')) {
    verifier.testWorkflowDependencies().then(result => {
        process.exit(result ? 0 : 1);
    });
} else if (args.includes('--artifacts')) {
    verifier.testArtifactGeneration().then(result => {
        process.exit(result ? 0 : 1);
    });
} else if (args.includes('--performance')) {
    verifier.testPerformanceRequirements().then(result => {
        process.exit(result ? 0 : 1);
    });
} else {
    verifier.runFullVerification().then(result => {
        process.exit(result ? 0 : 1);
    });
}
