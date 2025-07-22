#!/usr/bin/env tsx

/**
 * CI Workflow Validation Tool
 * Validates GitHub Actions workflows for modernization compliance
 */

import { readFileSync, readdirSync } from 'fs';
import { join } from 'path';
import * as yaml from 'js-yaml';

// import { fileURLToPath } from 'node:url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);

interface WorkflowValidationResult {
    file: string;
    valid: boolean;
    issues: string[];
    warnings: string[];
}

interface ActionVersion {
    name: string;
    expectedVersion: string;
    currentVersion?: string;
    isValid: boolean;
}

class WorkflowValidator {
    private readonly targetNodeVersion = '22.17.1';
    private readonly requiredActionVersions = {
        'actions/checkout': 'v4',
        'actions/setup-node': 'v4',
        'actions/upload-artifact': 'v4',
        'actions/download-artifact': 'v4',
        'docker/setup-buildx-action': 'v3',
        'docker/build-push-action': 'v5'
    };

    async validateWorkflows(): Promise<WorkflowValidationResult[]> {
        const workflowsDir = '.github/workflows';
        const results: WorkflowValidationResult[] = [];

        try {
            const files = readdirSync(workflowsDir).filter(
                file => file.endsWith('.yml') || file.endsWith('.yaml')
            );

            for (const file of files) {
                const result = await this.validateWorkflow(join(workflowsDir, file));
                results.push(result);
            }
        } catch (error) {
            console.error('Error reading workflows directory:', error);
        }

        return results;
    }

    private async validateWorkflow(filePath: string): Promise<WorkflowValidationResult> {
        const result: WorkflowValidationResult = {
            file: filePath,
            valid: true,
            issues: [],
            warnings: []
        };

        try {
            const content = readFileSync(filePath, 'utf8');
            const workflow = yaml.load(content) as any;

            // Validate action versions
            this.validateActionVersions(workflow, result);

            // Validate Node.js versions
            this.validateNodeVersions(workflow, result);

            // Validate timeout configurations
            this.validateTimeouts(workflow, result);

            // Check for deprecation warnings potential
            this.checkDeprecationWarnings(workflow, result);

            result.valid = result.issues.length === 0;
        } catch (error) {
            result.valid = false;
            result.issues.push(`Failed to parse workflow: ${error}`);
        }

        return result;
    }

    private validateActionVersions(workflow: any, result: WorkflowValidationResult): void {
        const actions = this.extractActions(workflow);

        for (const action of actions) {
            const expectedVersion =
                this.requiredActionVersions[
                    action.name as keyof typeof this.requiredActionVersions
                ];
            if (expectedVersion && !action.isValid) {
                result.issues.push(
                    `Action ${action.name} uses version ${action.currentVersion}, expected ${expectedVersion}`
                );
            }
        }
    }

    private validateNodeVersions(workflow: any, result: WorkflowValidationResult): void {
        const nodeVersions = this.extractNodeVersions(workflow);

        for (const version of nodeVersions) {
            if (version !== this.targetNodeVersion && !version.startsWith('${{')) {
                // Allow matrix variables but flag non-standard versions
                if (version !== '22' && version !== '22.17.1') {
                    result.issues.push(
                        `Node.js version ${version} should be ${this.targetNodeVersion}`
                    );
                } else if (version === '22') {
                    result.warnings.push(
                        `Node.js version ${version} should be more specific: ${this.targetNodeVersion}`
                    );
                }
            }
        }
    }

    private validateTimeouts(workflow: any, result: WorkflowValidationResult): void {
        if (workflow.jobs) {
            for (const [jobName, job] of Object.entries(workflow.jobs as Record<string, any>)) {
                if (!job['timeout-minutes']) {
                    result.warnings.push(`Job ${jobName} should have timeout-minutes configured`);
                }
            }
        }
    }

    private checkDeprecationWarnings(workflow: any, result: WorkflowValidationResult): void {
        const content = JSON.stringify(workflow);

        // Check for deprecated syntax patterns
        if (content.includes('actions/checkout@v3')) {
            result.issues.push('Using deprecated actions/checkout@v3');
        }
        if (content.includes('actions/setup-node@v3')) {
            result.issues.push('Using deprecated actions/setup-node@v3');
        }
        if (content.includes('actions/upload-artifact@v3')) {
            result.issues.push('Using deprecated actions/upload-artifact@v3');
        }
    }

    private extractActions(workflow: any): ActionVersion[] {
        const actions: ActionVersion[] = [];
        const content = JSON.stringify(workflow);

        for (const [actionName, expectedVersion] of Object.entries(this.requiredActionVersions)) {
            const regex = new RegExp(`"uses":\\s*"${actionName.replace('/', '\\/')}@([^"]+)"`, 'g');
            let match;

            while ((match = regex.exec(content)) !== null) {
                const currentVersion = match[1];
                actions.push({
                    name: actionName,
                    expectedVersion,
                    currentVersion: currentVersion || '',
                    isValid: currentVersion === expectedVersion
                });
            }
        }

        return actions;
    }

    private extractNodeVersions(workflow: any): string[] {
        const versions: string[] = [];
        const content = JSON.stringify(workflow);

        // Extract node-version values
        const nodeVersionRegex = /"node-version":\s*"([^"]+)"|"node-version":\s*(\d+(?:\.\d+)*)/g;
        let match;

        while ((match = nodeVersionRegex.exec(content)) !== null) {
            const version = match[1] || match[2];
            if (version) {
                versions.push(version);
            }
        }

        // Extract matrix node versions
        const matrixRegex = /"node-version":\s*\[([^\]]+)\]/g;
        while ((match = matrixRegex.exec(content)) !== null) {
            const matrixVersions =
                match?.[1]?.split(',').map(v => v.trim().replace(/["']/g, '')) || [];
            versions.push(...matrixVersions);
        }

        return [...new Set(versions)]; // Remove duplicates
    }

    async generateReport(): Promise<void> {
        console.log('🔍 GitHub Actions Workflow Validation Report\n');

        const results = await this.validateWorkflows();
        let totalIssues = 0;
        let totalWarnings = 0;

        for (const result of results) {
            const status = result.valid ? '✅' : '❌';
            console.log(`${status} ${result.file}`);

            if (result.issues.length > 0) {
                console.log('  Issues:');
                result.issues.forEach(issue => console.log(`    - ${issue}`));
                totalIssues += result.issues.length;
            }

            if (result.warnings.length > 0) {
                console.log('  Warnings:');
                result.warnings.forEach(warning => console.log(`    - ${warning}`));
                totalWarnings += result.warnings.length;
            }

            console.log();
        }

        console.log(`📊 Summary:`);
        console.log(`  Total workflows: ${results.length}`);
        console.log(`  Valid workflows: ${results.filter(r => r.valid).length}`);
        console.log(`  Total issues: ${totalIssues}`);
        console.log(`  Total warnings: ${totalWarnings}`);

        if (totalIssues === 0) {
            console.log('\n🎉 All workflows are compliant with modernization requirements!');
        } else {
            console.log('\n⚠️  Some workflows need updates to meet modernization requirements.');
            process.exit(1);
        }
    }
}

// Run validation if called directly
// import { fileURLToPath } from 'url';
// import { dirname } from 'path';

// const __filename = fileURLToPath(import.meta.url);
// const __dirname = dirname(__filename);

// async function main(): Promise<void> {
//     // Main execution logic would go here
// }

// Check if this file is being executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const validator = new WorkflowValidator();
    validator.generateReport().catch(error => {
        console.error('Validation failed:', error);
        process.exit(1);
    });
}

export { WorkflowValidator };
export type { WorkflowValidationResult };
