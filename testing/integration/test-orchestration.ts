/**
 * Test execution orchestration for improved performance and reliability
 * Manages test execution order and dependencies to prevent hanging tests
 */

import { describe, test, beforeAll, afterAll } from 'vitest';
import { timeoutManager, getTestTimeout } from '../config/timeout-configuration';
import { withPerformanceIsolation } from '../helpers/test-isolation';

interface TestGroup {
    name: string;
    tests: TestDefinition[];
    parallel: boolean;
    dependencies?: string[];
    timeout?: number;
}

interface TestDefinition {
    name: string;
    fn: () => Promise<void> | void;
    timeout?: number;
    skip?: boolean;
    only?: boolean;
}

interface OrchestrationConfig {
    maxParallelGroups: number;
    defaultTimeout: number;
    failFast: boolean;
    retryFailedTests: boolean;
    maxRetries: number;
}

class TestOrchestrator {
    private readonly config: OrchestrationConfig;
    private readonly testGroups: Map<string, TestGroup> = new Map();
    private executionOrder: string[] = [];

    constructor(config: Partial<OrchestrationConfig> = {}) {
        this.config = {
            maxParallelGroups: process.env['CI'] === 'true' ? 1 : 2, // Reduced to prevent hanging
            defaultTimeout: getTestTimeout('unitTest'),
            failFast: process.env['CI'] === 'true',
            retryFailedTests: true,
            maxRetries: process.env['CI'] === 'true' ? 2 : 1, // Reduced retries
            ...config
        };
    }

    /**
     * Define a test group with specific execution requirements
     */
    defineGroup(group: TestGroup): void {
        this.testGroups.set(group.name, group);
        this.calculateExecutionOrder();
    }

    /**
     * Calculate optimal execution order based on dependencies
     */
    private calculateExecutionOrder(): void {
        const visited = new Set<string>();
        const visiting = new Set<string>();
        const order: string[] = [];

        const visit = (groupName: string) => {
            if (visited.has(groupName)) return;
            if (visiting.has(groupName)) {
                throw new Error(`Circular dependency detected involving ${groupName}`);
            }

            visiting.add(groupName);
            const group = this.testGroups.get(groupName);

            if (group?.dependencies) {
                for (const dep of group.dependencies) {
                    visit(dep);
                }
            }

            visiting.delete(groupName);
            visited.add(groupName);
            order.push(groupName);
        };

        for (const groupName of this.testGroups.keys()) {
            visit(groupName);
        }

        this.executionOrder = order;
    }

    /**
     * Execute all test groups in optimal order
     */
    async executeAll(): Promise<void> {
        const parallelGroups: string[] = [];
        const sequentialGroups: string[] = [];

        // Separate parallel and sequential groups
        for (const groupName of this.executionOrder) {
            const group = this.testGroups.get(groupName)!;
            if (group.parallel && parallelGroups.length < this.config.maxParallelGroups) {
                parallelGroups.push(groupName);
            } else {
                sequentialGroups.push(groupName);
            }
        }

        // Execute parallel groups first
        if (parallelGroups.length > 0) {
            await Promise.all(parallelGroups.map(groupName => this.executeGroup(groupName)));
        }

        // Execute sequential groups
        for (const groupName of sequentialGroups) {
            await this.executeGroup(groupName);
        }
    }

    /**
     * Execute a single test group
     */
    private async executeGroup(groupName: string): Promise<void> {
        const group = this.testGroups.get(groupName);
        if (!group) {
            throw new Error(`Test group '${groupName}' not found`);
        }

        await timeoutManager.withTimeout(
            'integrationTest',
            async () => {
                if (group.parallel) {
                    await this.executeTestsParallel(group);
                } else {
                    await this.executeTestsSequential(group);
                }
            },
            `Test group: ${groupName}`
        );
    }

    /**
     * Execute tests in parallel within a group
     */
    private async executeTestsParallel(group: TestGroup): Promise<void> {
        const testPromises = group.tests
            .filter(test => !test.skip)
            .map(testDef => this.executeTest(testDef, group.name));

        await Promise.all(testPromises);
    }

    /**
     * Execute tests sequentially within a group
     */
    private async executeTestsSequential(group: TestGroup): Promise<void> {
        for (const testDef of group.tests) {
            if (!testDef.skip) {
                await this.executeTest(testDef, group.name);
            }
        }
    }

    /**
     * Execute a single test with proper isolation and timeout
     */
    private async executeTest(testDef: TestDefinition, groupName: string): Promise<void> {
        let attempt = 0;
        let lastError: Error | null = null;

        while (attempt <= this.config.maxRetries) {
            try {
                await timeoutManager.withTimeout(
                    'unitTest',
                    () => withPerformanceIsolation(testDef.fn),
                    `${groupName}:${testDef.name}`
                );
                return; // Success
            } catch (error) {
                lastError = error as Error;
                attempt++;

                if (attempt <= this.config.maxRetries && this.config.retryFailedTests) {
                    console.warn(
                        `Test '${testDef.name}' failed (attempt ${attempt}/${this.config.maxRetries + 1}): ${lastError.message}`
                    );
                    // Wait before retry
                    await new Promise(resolve => setTimeout(resolve, 1000 * attempt));
                } else {
                    break;
                }
            }
        }

        // All retries failed
        throw new Error(
            `Test '${testDef.name}' failed after ${attempt} attempts. Last error: ${lastError?.message}`
        );
    }

    /**
     * Get execution statistics
     */
    getStats(): {
        totalGroups: number;
        parallelGroups: number;
        sequentialGroups: number;
        totalTests: number;
        executionOrder: string[];
    } {
        const parallelCount = Array.from(this.testGroups.values()).filter(
            group => group.parallel
        ).length;

        const totalTests = Array.from(this.testGroups.values()).reduce(
            (sum, group) => sum + group.tests.length,
            0
        );

        return {
            totalGroups: this.testGroups.size,
            parallelGroups: parallelCount,
            sequentialGroups: this.testGroups.size - parallelCount,
            totalTests,
            executionOrder: this.executionOrder
        };
    }
}

/**
 * Pre-configured test groups for common test patterns
 */
export const TEST_GROUPS = {
    FAST_UNIT: 'fast-unit',
    SLOW_UNIT: 'slow-unit',
    INTEGRATION: 'integration',
    BUILD_TESTS: 'build-tests',
    PERFORMANCE: 'performance'
} as const;

/**
 * Quick test group definitions for common scenarios
 */
export function createFastUnitGroup(tests: TestDefinition[]): TestGroup {
    return {
        name: TEST_GROUPS.FAST_UNIT,
        tests,
        parallel: true,
        timeout: getTestTimeout('unitTest')
    };
}

export function createSlowUnitGroup(tests: TestDefinition[]): TestGroup {
    return {
        name: TEST_GROUPS.SLOW_UNIT,
        tests,
        parallel: false, // Sequential for resource-intensive tests
        timeout: getTestTimeout('unitTest') * 2
    };
}

export function createIntegrationGroup(tests: TestDefinition[]): TestGroup {
    return {
        name: TEST_GROUPS.INTEGRATION,
        tests,
        parallel: false,
        dependencies: [TEST_GROUPS.FAST_UNIT],
        timeout: getTestTimeout('integrationTest')
    };
}

export function createBuildGroup(tests: TestDefinition[]): TestGroup {
    return {
        name: TEST_GROUPS.BUILD_TESTS,
        tests,
        parallel: false,
        timeout: getTestTimeout('buildProcess')
    };
}

/**
 * Utility to convert vitest tests to orchestrator format
 */
export function orchestratedDescribe(
    groupName: string,
    testGroup: TestGroup,
    setupFn?: () => Promise<void> | void
): void {
    describe(groupName, () => {
        const orchestrator = new TestOrchestrator();

        beforeAll(async () => {
            if (setupFn) {
                await setupFn();
            }
            orchestrator.defineGroup(testGroup);
        }, getTestTimeout('setupTeardown'));

        afterAll(async () => {
            // Cleanup after orchestrated tests
        }, getTestTimeout('setupTeardown'));

        // Convert orchestrated tests to vitest tests
        for (const testDef of testGroup.tests) {
            const testFn = testDef.skip ? test.skip : testDef.only ? test.only : test;

            testFn(
                testDef.name,
                async () => {
                    await timeoutManager.withTimeout(
                        'unitTest',
                        () => withPerformanceIsolation(testDef.fn),
                        testDef.name
                    );
                },
                testDef.timeout || getTestTimeout('unitTest')
            );
        }
    });
}

export { TestOrchestrator };
export type { TestGroup, TestDefinition, OrchestrationConfig };
