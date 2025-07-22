/**
 * TestIsolation - Provides test isolation utilities for cleaning up global state
 */

export interface TestIsolationConfig {
    clearMocks?: boolean;
    clearTimers?: boolean;
    clearGlobalState?: boolean;
    clearDOM?: boolean;
    clearLocalStorage?: boolean;
    clearSessionStorage?: boolean;
    clearConsole?: boolean;
    resetModules?: boolean;
}

export class TestIsolation {
    private config: TestIsolationConfig;
    private originalState: Map<string, any> = new Map();

    constructor(config: TestIsolationConfig = {}) {
        this.config = {
            clearMocks: true,
            clearTimers: true,
            clearGlobalState: true,
            ...config
        };
    }

    setup(): void {
        if (this.config.clearGlobalState) {
            // Save important global state that we want to preserve
            this.originalState.set('testData', (globalThis as any).testData);
        }
    }

    cleanup(): void {
        if (this.config.clearGlobalState) {
            // Clear test-specific global state
            delete (globalThis as any).testData;
        }

        if (this.config.clearTimers) {
            // Clear any remaining timers (in test environment)
            if (typeof globalThis.clearTimeout === 'function') {
                // Clear any test timers if needed
            }
        }

        if (this.config.clearMocks) {
            // Clear any test mocks if needed
        }
    }
}

// Additional utility functions for backwards compatibility
export function setupTestIsolation(config?: TestIsolationConfig): TestIsolation {
    return new TestIsolation(config);
}

export function withIsolation<T>(operation: () => T, config?: TestIsolationConfig): T {
    const isolation = new TestIsolation(config);
    isolation.setup();
    try {
        return operation();
    } finally {
        isolation.cleanup();
    }
}

export async function withPerformanceIsolation<T>(operation: () => T | Promise<T>): Promise<T> {
    const isolation = new TestIsolation({ clearGlobalState: true, clearTimers: true });
    isolation.setup();
    try {
        const result = await operation();
        return result;
    } finally {
        isolation.cleanup();
    }
}
