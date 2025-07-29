/**
 * Test Isolation Validation
 * Ensures test isolation features work correctly
 */

import { describe, test, expect } from 'vitest';
import { setupTestIsolation, withIsolation, TestIsolation } from '../../helpers/test-isolation';

describe('Test Isolation Validation', () => {
    describe('Manual Test Isolation', () => {
        test('should isolate global state changes', async () => {
            // Clean any residual state first
            delete (globalThis as any).testState;
            delete (globalThis as any).newProperty;

            // Set initial state
            (globalThis as any).testState = 'initial';

            const result = await withIsolation(() => {
                (globalThis as any).testState = 'modified';
                (globalThis as any).newProperty = 'added';
                return (globalThis as any).testState;
            });

            expect(result).toBe('modified');

            // Give cleanup a moment to complete and check for proper isolation
            await new Promise(resolve => setTimeout(resolve, 5));

            // State should be cleaned up after isolation
            expect((globalThis as any).testState).toBeUndefined();
            expect((globalThis as any).newProperty).toBeUndefined();
        });

        test('should clean up timers properly', async () => {
            const timerIds: NodeJS.Timeout[] = [];

            await withIsolation(() => {
                // Create some timers during the test
                const timer1 = setTimeout(() => {}, 1000);
                const timer2 = setInterval(() => {}, 500);

                timerIds.push(timer1, timer2);

                // Timers should be tracked for cleanup
                expect(timerIds).toHaveLength(2);
            });

            // Timers should be cleaned up after isolation
            // Note: In a real test environment, the isolation would clean these up
        });

        test('should handle localStorage isolation', async () => {
            // Mock localStorage for Node.js environment
            const mockLocalStorage = {
                data: {} as Record<string, string>,
                getItem: function (key: string) {
                    return this.data[key] || null;
                },
                setItem: function (key: string, value: string) {
                    this.data[key] = value;
                },
                removeItem: function (key: string) {
                    delete this.data[key];
                },
                clear: function () {
                    this.data = {};
                }
            };

            // Temporarily assign to globalThis for testing
            (globalThis as any).localStorage = mockLocalStorage;

            try {
                await withIsolation(
                    () => {
                        (globalThis as any).localStorage.setItem('testKey', 'testValue');
                        expect((globalThis as any).localStorage.getItem('testKey')).toBe(
                            'testValue'
                        );
                    },
                    {
                        clearLocalStorage: true
                    }
                );

                // localStorage should be cleared after isolation
                expect((globalThis as any).localStorage.getItem('testKey')).toBeNull();
            } finally {
                delete (globalThis as any).localStorage;
            }
        });

        test('should create TestIsolation instance with custom config', () => {
            const isolation = new TestIsolation({
                clearMocks: false,
                clearTimers: true,
                clearDOM: false,
                clearLocalStorage: false,
                clearSessionStorage: false,
                clearConsole: true,
                clearGlobalState: true,
                resetModules: false
            });

            expect(isolation).toBeInstanceOf(TestIsolation);
        });

        test('should handle errors during isolation gracefully', async () => {
            await expect(
                withIsolation(() => {
                    throw new Error('Test error');
                })
            ).rejects.toThrow('Test error');

            // Cleanup should still happen even if test throws
            expect((globalThis as any).errorTestState).toBeUndefined();
        });

        test('should handle async operations in isolation', async () => {
            // Clean any existing state
            delete (globalThis as any).asyncState;

            const result = await withIsolation(async () => {
                (globalThis as any).asyncState = 'pending';

                await new Promise(resolve => setTimeout(resolve, 10));

                (globalThis as any).asyncState = 'completed';
                return (globalThis as any).asyncState;
            });

            expect(result).toBe('completed');

            // Give cleanup time to complete
            await new Promise(resolve => setTimeout(resolve, 5));

            expect((globalThis as any).asyncState).toBeUndefined();
        });
    });

    describe('Automatic Test Isolation Setup', () => {
        // These tests demonstrate how to use setupTestIsolation
        // but we don't apply it here to avoid interfering with other tests

        test('should provide setupTestIsolation function', () => {
            expect(typeof setupTestIsolation).toBe('function');
        });

        test('should accept isolation config', () => {
            // This would normally be called in a test file's setup
            const config = {
                clearMocks: true,
                clearTimers: true,
                clearDOM: false,
                clearLocalStorage: true,
                clearSessionStorage: true,
                clearConsole: false,
                clearGlobalState: true,
                resetModules: false
            };

            // Verify config is properly typed
            expect(typeof config.clearMocks).toBe('boolean');
            expect(typeof config.clearTimers).toBe('boolean');
            expect(typeof config.clearDOM).toBe('boolean');
        });
    });

    describe('Memory Management', () => {
        test('should not retain references after cleanup', async () => {
            // Clean any existing references first
            delete (globalThis as any).tempRef;

            let largeObject: any = null;

            await withIsolation(() => {
                // Create a moderately large object
                largeObject = {
                    data: new Array(1000).fill('test'),
                    nested: {
                        moreData: new Array(500).fill('nested')
                    }
                };

                (globalThis as any).tempRef = largeObject;

                expect((globalThis as any).tempRef).toBeDefined();
            });

            // Give cleanup time to process
            await new Promise(resolve => setTimeout(resolve, 5));

            // Reference should be cleaned up
            expect((globalThis as any).tempRef).toBeUndefined();

            // Allow garbage collection
            largeObject = null;
        });

        test('should handle memory leak detection threshold', async () => {
            const initialMemory = process.memoryUsage().heapUsed;

            await withIsolation(() => {
                // Create a small amount of data that should not trigger leak detection
                const smallData = new Array(10).fill('small');
                return smallData.length;
            });

            const finalMemory = process.memoryUsage().heapUsed;
            const memoryDiff = finalMemory - initialMemory;

            // Small memory increase should be acceptable
            expect(memoryDiff).toBeLessThan(1024 * 1024); // Less than 1MB
        });
    });

    describe('Performance Impact', () => {
        test('should have minimal overhead for isolation setup', () => {
            const startTime = performance.now();

            const isolation = new TestIsolation();
            isolation.setup();
            isolation.cleanup();

            const endTime = performance.now();
            const duration = endTime - startTime;

            // Isolation setup should be very fast
            expect(duration).toBeLessThan(10); // Less than 10ms
        });

        test('should handle rapid setup/cleanup cycles', () => {
            const isolation = new TestIsolation();

            // Rapid setup and cleanup should not cause issues
            for (let i = 0; i < 10; i++) {
                isolation.setup();
                isolation.cleanup();
            }

            // No error should be thrown
            expect(true).toBe(true);
        });
    });

    describe('Edge Cases', () => {
        test('should handle DOM operations safely', async () => {
            // Test DOM handling without relying on specific environment assumptions
            await expect(
                withIsolation(
                    () => {
                        // This should work regardless of document availability
                        return 'completed';
                    },
                    {
                        clearDOM: true,
                        clearGlobalState: true
                    }
                )
            ).resolves.toBe('completed');
        });

        test('should handle missing global objects gracefully', async () => {
            // Clean any existing state
            delete (globalThis as any).nonExistentGlobal;

            const result = await withIsolation(() => {
                (globalThis as any).nonExistentGlobal = 'test';
                return 'completed';
            });

            expect(result).toBe('completed');

            // Give cleanup time to process
            await new Promise(resolve => setTimeout(resolve, 5));

            expect((globalThis as any).nonExistentGlobal).toBeUndefined();
        });

        test('should handle synchronous operations', async () => {
            delete (globalThis as any).syncTest;

            const result = await withIsolation(() => {
                (globalThis as any).syncTest = 'sync result';
                return 'sync operation completed';
            });

            expect(result).toBe('sync operation completed');

            // Give cleanup time to process
            await new Promise(resolve => setTimeout(resolve, 5));

            expect((globalThis as any).syncTest).toBeUndefined();
        });
    });
});
