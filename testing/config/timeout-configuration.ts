/**
 * Optimized timeout configuration for test suite performance
 * Simple, fast, reliable timeout management without overhead
 */

interface TimeoutConfig {
    unitTest: number;
    integrationTest: number;
    performanceTest: number;
    e2eTest: number;
    setupTeardown: number;
    fileOperations: number;
    buildProcess: number;
    assetLoading: number;
}

// Simple environment detection - no class overhead
const isCI = process.env['CI'] === 'true';
const isCoverage = process.env['COVERAGE'] === 'true';

// Optimized timeout configuration - direct values, no calculations
const TIMEOUTS: TimeoutConfig = {
    unitTest: isCI ? 8000 : 3000, // Fast unit tests: 3s local, 8s CI
    integrationTest: isCI ? 45000 : 15000, // Quick integration: 15s local, 45s CI
    performanceTest: isCI ? 90000 : 30000, // Performance tests: 30s local, 90s CI
    e2eTest: isCI ? 180000 : 60000, // E2E tests: 1min local, 3min CI
    setupTeardown: isCI ? 15000 : 5000, // Setup/teardown: 5s local, 15s CI
    fileOperations: isCI ? 20000 : 8000, // File ops: 8s local, 20s CI
    buildProcess: isCI ? 300000 : 120000, // Build: 2min local, 5min CI
    assetLoading: isCI ? 30000 : 10000 // Assets: 10s local, 30s CI
};

class TimeoutManager {
    /**
     * Get timeout configuration - direct object access
     */
    getTimeouts(): TimeoutConfig {
        return TIMEOUTS;
    }

    /**
     * Get specific timeout for test type - direct lookup
     */
    getTimeout(testType: keyof TimeoutConfig): number {
        return TIMEOUTS[testType];
    }

    /**
     * Simple timeout wrapper - minimal overhead
     */
    async withTimeout<T>(
        testType: keyof TimeoutConfig,
        operation: () => Promise<T>,
        operationName?: string
    ): Promise<T> {
        const timeout = TIMEOUTS[testType];
        const operationPromise = operation();

        // Use AbortController for clean cancellation
        const controller = new AbortController();

        const timeoutPromise = new Promise<never>((_, reject) => {
            const timer = setTimeout(() => {
                controller.abort();
                const name = operationName || 'operation';
                reject(new Error(`Timeout: ${name} exceeded ${timeout}ms`));
            }, timeout);

            // Clean up timer if operation completes first
            operationPromise.finally(() => clearTimeout(timer));
        });

        return Promise.race([operationPromise, timeoutPromise]);
    }

    /**
     * Simple logging for debugging
     */
    logConfiguration(): void {
        const env = isCI ? 'CI' : isCoverage ? 'Coverage' : 'Local';
        console.log(`[TimeoutManager] Environment: ${env}`, TIMEOUTS);
    }
}

// Simple exports - minimal object creation
export { TimeoutManager };

// Direct constant exports - no function calls
export const TIMEOUT_CONFIG = TIMEOUTS;

// Lightweight function exports
export const getTestTimeout = (testType: keyof TimeoutConfig): number => TIMEOUTS[testType];

export const withTimeout = async <T>(
    testType: keyof TimeoutConfig,
    operation: () => Promise<T>,
    operationName?: string
): Promise<T> => {
    const timeout = TIMEOUTS[testType];
    const controller = new AbortController();

    const timeoutPromise = new Promise<never>((_, reject) => {
        const timer = setTimeout(() => {
            controller.abort();
            reject(new Error(`Timeout: ${operationName || 'operation'} exceeded ${timeout}ms`));
        }, timeout);

        operation().finally(() => clearTimeout(timer));
    });

    return Promise.race([operation(), timeoutPromise]);
};

// Singleton instance
export const timeoutManager = new TimeoutManager();

export type { TimeoutConfig };
