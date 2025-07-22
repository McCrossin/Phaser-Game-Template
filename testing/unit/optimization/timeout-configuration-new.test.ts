/**
 * Timeout Configuration Tests
 * Validates timeout management for test suite optimization
 */

import { describe, test, expect, beforeEach, afterEach } from 'vitest';
import {
    TimeoutManager,
    timeoutManager,
    getTestTimeout,
    withTimeout,
    TIMEOUT_CONFIG
} from '../../config/timeout-configuration';

describe('Timeout Configuration', () => {
    describe('Environment Detection', () => {
        beforeEach(() => {
            // Clear environment variables before each test
            delete process.env['CI'];
            delete process.env['COVERAGE'];
            delete process.env['DEBUG'];
            delete process.env['NODE_ENV'];
        });

        test('should detect CI environment', () => {
            process.env['CI'] = 'true';
            const manager = new TimeoutManager();
            const timeouts = manager.getTimeouts();

            // CI environment should have higher timeouts
            expect(timeouts.unitTest).toBeGreaterThan(5000);
            expect(timeouts.integrationTest).toBeGreaterThan(30000);
        });

        test('should detect coverage environment', () => {
            process.env['COVERAGE'] = 'true';
            const manager = new TimeoutManager();
            const timeouts = manager.getTimeouts();

            // Coverage mode should increase timeouts
            expect(timeouts.unitTest).toBeGreaterThan(5000);
        });

        test('should use default timeouts in local environment', () => {
            const manager = new TimeoutManager();
            const timeouts = manager.getTimeouts();

            // Default timeouts should be reasonable
            expect(timeouts.unitTest).toBe(5000);
            expect(timeouts.integrationTest).toBe(30000);
            expect(timeouts.performanceTest).toBe(60000);
        });

        test('should apply multiple environment factors', () => {
            process.env['CI'] = 'true';
            process.env['COVERAGE'] = 'true';

            const manager = new TimeoutManager();
            const timeouts = manager.getTimeouts();

            // Should apply both CI and coverage multipliers
            expect(timeouts.unitTest).toBeGreaterThan(10000); // Base 5000 * 2.5 * 1.5
        });
    });

    describe('Timeout Manager', () => {
        test('should provide environment-aware timeouts', () => {
            const timeouts = timeoutManager.getTimeouts();

            expect(timeouts).toHaveProperty('unitTest');
            expect(timeouts).toHaveProperty('integrationTest');
            expect(timeouts).toHaveProperty('performanceTest');
            expect(timeouts).toHaveProperty('e2eTest');
            expect(timeouts).toHaveProperty('setupTeardown');
            expect(timeouts).toHaveProperty('fileOperations');
            expect(timeouts).toHaveProperty('buildProcess');
            expect(timeouts).toHaveProperty('assetLoading');
        });

        test('should get specific timeout for test type', () => {
            const unitTimeout = timeoutManager.getTimeout('unitTest');
            const integrationTimeout = timeoutManager.getTimeout('integrationTest');

            expect(unitTimeout).toBeGreaterThan(0);
            expect(integrationTimeout).toBeGreaterThan(unitTimeout);
        });

        test('should handle timeout wrapper correctly', async () => {
            const result = await timeoutManager.withTimeout(
                'unitTest',
                async () => {
                    await new Promise(resolve => setTimeout(resolve, 100));
                    return 'success';
                },
                'test operation'
            );

            expect(result).toBe('success');
        });

        test('should timeout slow operations', async () => {
            await expect(
                timeoutManager.withTimeout(
                    'unitTest',
                    async () => {
                        await new Promise(resolve => setTimeout(resolve, 10000));
                        return 'should not reach here';
                    },
                    'slow operation'
                )
            ).rejects.toThrow(/timeout/i);
        });
    });

    describe('Timeout Wrapper', () => {
        test('should execute operation within timeout', async () => {
            const result = await withTimeout(
                'unitTest',
                async () => {
                    await new Promise(resolve => setTimeout(resolve, 50));
                    return 'completed';
                },
                'quick operation'
            );

            expect(result).toBe('completed');
        });

        test('should reject operations exceeding timeout', async () => {
            // Use a very short timeout for testing
            const originalTimeout = TIMEOUT_CONFIG.unitTest;

            await expect(
                withTimeout(
                    'unitTest',
                    async () => {
                        await new Promise(resolve => setTimeout(resolve, originalTimeout + 1000));
                        return 'should timeout';
                    },
                    'timeout test'
                )
            ).rejects.toThrow(/timeout/i);
        });

        test('should handle synchronous operations', async () => {
            const result = await withTimeout(
                'unitTest',
                () => {
                    return Promise.resolve('sync result');
                },
                'sync operation'
            );

            expect(result).toBe('sync result');
        });

        test('should preserve error messages from operations', async () => {
            await expect(
                withTimeout(
                    'unitTest',
                    async () => {
                        throw new Error('Operation failed');
                    },
                    'failing operation'
                )
            ).rejects.toThrow('Operation failed');
        });

        test('should handle promise rejections', async () => {
            await expect(
                withTimeout(
                    'unitTest',
                    () => Promise.reject(new Error('Promise rejected')),
                    'rejected promise'
                )
            ).rejects.toThrow('Promise rejected');
        });
    });

    describe('Convenience Functions', () => {
        test('should provide getTestTimeout function', () => {
            const timeout = getTestTimeout('unitTest');
            expect(timeout).toBeGreaterThan(0);
            expect(typeof timeout).toBe('number');
        });

        test('should return different timeouts for different test types', () => {
            const unitTimeout = getTestTimeout('unitTest');
            const integrationTimeout = getTestTimeout('integrationTest');
            const performanceTimeout = getTestTimeout('performanceTest');

            expect(integrationTimeout).toBeGreaterThan(unitTimeout);
            expect(performanceTimeout).toBeGreaterThan(integrationTimeout);
        });
    });

    describe('Timeout Multipliers', () => {
        afterEach(() => {
            // Clean up environment variables
            delete process.env['CI'];
            delete process.env['COVERAGE'];
            delete process.env['DEBUG'];
        });

        test('should apply CI multiplier correctly', () => {
            const localTimeout = getTestTimeout('unitTest');

            process.env['CI'] = 'true';
            const ciTimeout = getTestTimeout('unitTest');

            expect(ciTimeout).toBeGreaterThan(localTimeout);
            expect(ciTimeout / localTimeout).toBeCloseTo(2.5, 1);
        });

        test('should apply coverage multiplier correctly', () => {
            const baseTimeout = getTestTimeout('unitTest');

            process.env['COVERAGE'] = 'true';
            const coverageTimeout = getTestTimeout('unitTest');

            expect(coverageTimeout).toBeGreaterThan(baseTimeout);
        });

        test('should apply debug multiplier correctly', () => {
            const baseTimeout = getTestTimeout('unitTest');

            process.env['DEBUG'] = 'true';
            const debugTimeout = getTestTimeout('unitTest');

            expect(debugTimeout).toBeGreaterThan(baseTimeout);
        });

        test('should combine multiple multipliers', () => {
            process.env['CI'] = 'true';
            process.env['COVERAGE'] = 'true';
            process.env['DEBUG'] = 'true';

            const multiFactorTimeout = getTestTimeout('unitTest');

            // Clean up for next assertion
            delete process.env['CI'];
            delete process.env['COVERAGE'];
            delete process.env['DEBUG'];

            const cleanTimeout = getTestTimeout('unitTest');

            expect(multiFactorTimeout).toBeGreaterThan(cleanTimeout);
        });
    });

    describe('Performance Requirements', () => {
        test('should complete timeout operations quickly', () => {
            const start = performance.now();

            const timeout = getTestTimeout('unitTest');

            const end = performance.now();
            const duration = end - start;

            // Getting timeout should be very fast
            expect(duration).toBeLessThan(10); // Less than 10ms
            expect(timeout).toBeGreaterThan(0);
        });

        test('should handle rapid timeout requests efficiently', () => {
            const start = performance.now();

            // Make many timeout requests
            for (let i = 0; i < 100; i++) {
                getTestTimeout('unitTest');
                getTestTimeout('integrationTest');
                getTestTimeout('performanceTest');
            }

            const end = performance.now();
            const duration = end - start;

            // Should handle many requests quickly
            expect(duration).toBeLessThan(50); // Less than 50ms for 300 calls
        });
    });
});
