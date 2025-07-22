/**
 * PerformanceTestHelper - Provides utilities for performance testing and benchmarking
 */

export interface PerformanceTestConfig {
    iterations?: number;
    warmupIterations?: number;
    timeout?: number;
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
