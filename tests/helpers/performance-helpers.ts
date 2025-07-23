/**
 * PerformanceTestHelper - Provides utilities for performance testing and benchmarking
 */

import { readFileSync, existsSync } from 'fs';
import { join } from 'path';

export interface PerformanceTestConfig {
    iterations?: number;
    warmupIterations?: number;
    timeout?: number;
}

export interface EnvironmentAwareThresholds {
    environment: 'local' | 'ci';
    performance: {
        minFPS: number;
        avgFPS: number;
        maxFPSVariation: number;
        maxLoadTime: number;
        maxMemoryGrowth: number;
        maxMicrofreezes: number;
    };
    timeouts: {
        browserLaunch: number;
        pageLoad: number;
        testExecution: number;
    };
    retry: {
        maxAttempts: number;
        backoffDelay: number;
    };
}

export interface PerformanceTestResult {
    environment: 'local' | 'ci';
    passed: boolean;
    metrics: {
        fps: { average: number; minimum: number; maximum: number };
        loadTime: number;
        memoryGrowth: number;
        microfreezes: number;
    };
    thresholds: EnvironmentAwareThresholds['performance'];
    regressionDetected: boolean;
}

export class EnvironmentDetector {
    static detect(): 'local' | 'ci' {
        // Check multiple CI indicators for robust detection
        // Only return 'ci' if CI is explicitly set to 'true' (not 'false' or empty)
        return process.env['CI'] === 'true' ||
            process.env['GITHUB_ACTIONS'] === 'true' ||
            process.env['GITLAB_CI'] === 'true' ||
            process.env['TRAVIS'] === 'true' ||
            process.env['CIRCLECI'] === 'true' ||
            (process.env['JENKINS_URL'] !== undefined && process.env['JENKINS_URL'] !== '') ||
            process.env['BUILDKITE'] === 'true'
            ? 'ci'
            : 'local';
    }

    static getThresholds(): EnvironmentAwareThresholds {
        const environment = this.detect();
        const configPath = join(process.cwd(), 'config', 'ci-performance-thresholds.json');

        try {
            if (existsSync(configPath)) {
                const config = JSON.parse(readFileSync(configPath, 'utf8'));
                const envConfig = config.environments[environment];

                if (envConfig) {
                    return {
                        environment,
                        ...envConfig
                    };
                }
            }
        } catch (error) {
            console.warn('Failed to load performance thresholds config, using defaults:', error);
        }

        // Fallback defaults
        return this.getDefaultThresholds(environment);
    }

    static isGitHubActions(): boolean {
        return process.env['GITHUB_ACTIONS'] === 'true';
    }

    private static getDefaultThresholds(environment: 'local' | 'ci'): EnvironmentAwareThresholds {
        if (environment === 'ci') {
            return {
                environment: 'ci',
                performance: {
                    minFPS: 2,
                    avgFPS: 10,
                    maxFPSVariation: 4.0,
                    maxLoadTime: 30000,
                    maxMemoryGrowth: 150,
                    maxMicrofreezes: 5
                },
                timeouts: {
                    browserLaunch: 30000,
                    pageLoad: 45000,
                    testExecution: 120000
                },
                retry: {
                    maxAttempts: 3,
                    backoffDelay: 2000
                }
            };
        }

        return {
            environment: 'local',
            performance: {
                minFPS: 30,
                avgFPS: 55,
                maxFPSVariation: 1.5,
                maxLoadTime: 3000,
                maxMemoryGrowth: 50,
                maxMicrofreezes: 2
            },
            timeouts: {
                browserLaunch: 10000,
                pageLoad: 15000,
                testExecution: 30000
            },
            retry: {
                maxAttempts: 2,
                backoffDelay: 1000
            }
        };
    }
}

export interface PerformanceResult {
    executionTime: number;
    iterations: number;
    averageTime: number;
    minTime: number;
    maxTime: number;
}

export class PerformanceTestHelper {
    private config: PerformanceTestConfig;

    constructor(config: PerformanceTestConfig = {}) {
        this.config = {
            iterations: 1,
            warmupIterations: 0,
            timeout: 5000,
            ...config
        };
    }

    async measurePerformance<T>(
        operation: () => Promise<T> | T,
        _description?: string
    ): Promise<PerformanceResult> {
        const times: number[] = [];

        // Warmup iterations
        for (let i = 0; i < this.config.warmupIterations!; i++) {
            await operation();
        }

        // Actual measurement iterations
        for (let i = 0; i < this.config.iterations!; i++) {
            const start = performance.now();
            await operation();
            const end = performance.now();
            times.push(end - start);
        }

        const executionTime = times.reduce((sum, time) => sum + time, 0);
        const averageTime = executionTime / times.length;
        const minTime = Math.min(...times);
        const maxTime = Math.max(...times);

        return {
            executionTime,
            iterations: this.config.iterations!,
            averageTime,
            minTime,
            maxTime
        };
    }

    createLightweightMock<T extends object>(target: T): T {
        // Simple mock implementation for testing
        return new Proxy(target, {
            get(target, prop) {
                if (typeof target[prop as keyof T] === 'function') {
                    return () => undefined; // Simple mock function
                }
                return target[prop as keyof T];
            }
        });
    }

    validateThreshold(actualTime: number, threshold: number): boolean {
        return actualTime < threshold;
    }

    generatePerformanceSummary(results: PerformanceResult[]): string {
        if (results.length === 0) {
            return 'No performance results to summarize';
        }

        const totalTime = results.reduce((sum, result) => sum + result.executionTime, 0);
        const avgTime = totalTime / results.length;

        return `Performance Summary: ${results.length} operations, avg: ${avgTime.toFixed(2)}ms`;
    }
}
