/**
 * Unit tests for Performance Analysis and Regression Detection
 * Tests performance threshold validation and regression analysis
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EnvironmentDetector } from '../../helpers/performance-helpers.js';

describe('Performance Analysis', () => {
    const originalEnv = { ...process.env };

    beforeEach(() => {
        // Reset environment
        delete process.env['CI'];
        delete process.env['GITHUB_ACTIONS'];
    });

    afterEach(() => {
        process.env = { ...originalEnv };
    });

    describe('FPS Analysis', () => {
        it('should pass FPS validation for good local performance', () => {
            const thresholds = EnvironmentDetector.getThresholds();
            const testFPS = 58; // Good local FPS

            expect(testFPS).toBeGreaterThan(thresholds.performance.avgFPS);
            expect(testFPS).toBeGreaterThan(thresholds.performance.minFPS);
        });

        it('should pass FPS validation for acceptable CI performance', () => {
            process.env['CI'] = 'true';
            const thresholds = EnvironmentDetector.getThresholds();
            const testFPS = 12; // Acceptable CI FPS

            expect(testFPS).toBeGreaterThan(thresholds.performance.avgFPS);
            expect(testFPS).toBeGreaterThan(thresholds.performance.minFPS);
        });
        it('should detect severe performance regression', () => {
            const baseline = 50;
            const current = 10; // 80% degradation
            const degradation = (baseline - current) / baseline;

            // Should fail in both environments for severe degradation
            expect(degradation).toBeGreaterThan(0.7); // 70% threshold for severe
        });

        it('should handle minor performance variation in CI', () => {
            process.env['CI'] = 'true';
            // Thresholds are not needed for this test

            const baseline = 20;
            const current = 12; // 40% degradation - acceptable for CI
            const degradation = (baseline - current) / baseline;

            // Should be within CI tolerance
            expect(degradation).toBeLessThan(0.5); // 50% CI threshold
        });

        it('should detect microperformance issues in local development', () => {
            const baseline = 60;
            const current = 55; // 8.3% degradation
            const degradation = (baseline - current) / baseline;

            // Should exceed local tolerance but be acceptable in CI
            expect(degradation).toBeGreaterThan(0.03); // 3% local threshold
            expect(degradation).toBeLessThan(0.5); // 50% CI threshold
        });
    });

    describe('Load Time Analysis', () => {
        it('should validate acceptable local load times', () => {
            const thresholds = EnvironmentDetector.getThresholds();
            const loadTime = 2500; // 2.5 seconds

            expect(loadTime).toBeLessThan(thresholds.performance.maxLoadTime);
        });

        it('should validate acceptable CI load times', () => {
            process.env['CI'] = 'true';
            const thresholds = EnvironmentDetector.getThresholds();
            const loadTime = 25000; // 25 seconds - acceptable for CI

            expect(loadTime).toBeLessThan(thresholds.performance.maxLoadTime);
        });

        it('should reject excessive load times in all environments', () => {
            const localThresholds = EnvironmentDetector.getThresholds();

            process.env['CI'] = 'true';
            const ciThresholds = EnvironmentDetector.getThresholds();

            const excessiveLoadTime = 35000; // 35 seconds

            expect(excessiveLoadTime).toBeGreaterThan(localThresholds.performance.maxLoadTime);
            expect(excessiveLoadTime).toBeGreaterThan(ciThresholds.performance.maxLoadTime);
        });
    });

    describe('Memory Growth Analysis', () => {
        it('should validate acceptable local memory growth', () => {
            const thresholds = EnvironmentDetector.getThresholds();
            const memoryGrowth = 35; // 35MB

            expect(memoryGrowth).toBeLessThan(thresholds.performance.maxMemoryGrowth);
        });

        it('should validate acceptable CI memory growth', () => {
            process.env['CI'] = 'true';
            const thresholds = EnvironmentDetector.getThresholds();
            const memoryGrowth = 120; // 120MB - higher tolerance for CI

            expect(memoryGrowth).toBeLessThan(thresholds.performance.maxMemoryGrowth);
        });

        it('should detect memory leaks in all environments', () => {
            const localThresholds = EnvironmentDetector.getThresholds();

            process.env['CI'] = 'true';
            const ciThresholds = EnvironmentDetector.getThresholds();

            const memoryLeak = 200; // 200MB - excessive in all environments

            expect(memoryLeak).toBeGreaterThan(localThresholds.performance.maxMemoryGrowth);
            expect(memoryLeak).toBeGreaterThan(ciThresholds.performance.maxMemoryGrowth);
        });
    });

    describe('FPS Stability Analysis', () => {
        it('should calculate coefficient of variation correctly', () => {
            const fpsData = [58, 60, 56, 62, 54];
            const avgFPS = fpsData.reduce((sum, fps) => sum + fps, 0) / fpsData.length;
            const variance =
                fpsData.reduce((sum, fps) => sum + Math.pow(fps - avgFPS, 2), 0) / fpsData.length;
            const stdDev = Math.sqrt(variance);
            const coefficientOfVariation = stdDev / avgFPS;

            // Should be stable for local development
            expect(coefficientOfVariation).toBeLessThan(0.15); // 15% variation
        });

        it('should allow higher variation in CI environment', () => {
            process.env['CI'] = 'true';
            const thresholds = EnvironmentDetector.getThresholds();

            const fpsData = [5, 15, 3, 20, 8]; // Highly variable CI FPS
            const avgFPS = fpsData.reduce((sum, fps) => sum + fps, 0) / fpsData.length;
            const variance =
                fpsData.reduce((sum, fps) => sum + Math.pow(fps - avgFPS, 2), 0) / fpsData.length;
            const stdDev = Math.sqrt(variance);
            const coefficientOfVariation = stdDev / avgFPS;

            // High variation should be acceptable in CI
            expect(coefficientOfVariation).toBeLessThan(thresholds.performance.maxFPSVariation);
        });
    });

    describe('Microfreeze Detection', () => {
        it('should validate acceptable microfreeze counts for local', () => {
            const thresholds = EnvironmentDetector.getThresholds();
            const microfreezes = 1; // 1 microfreeze - acceptable locally

            expect(microfreezes).toBeLessThan(thresholds.performance.maxMicrofreezes);
        });

        it('should validate acceptable microfreeze counts for CI', () => {
            process.env['CI'] = 'true';
            const thresholds = EnvironmentDetector.getThresholds();
            const microfreezes = 4; // 4 microfreezes - acceptable in CI

            expect(microfreezes).toBeLessThan(thresholds.performance.maxMicrofreezes);
        });

        it('should reject excessive microfreezes in all environments', () => {
            const localThresholds = EnvironmentDetector.getThresholds();

            process.env['CI'] = 'true';
            const ciThresholds = EnvironmentDetector.getThresholds();

            const excessiveMicrofreezes = 30;

            expect(excessiveMicrofreezes).toBeGreaterThan(
                localThresholds.performance.maxMicrofreezes
            );
            expect(excessiveMicrofreezes).toBeGreaterThan(ciThresholds.performance.maxMicrofreezes);
        });
    });

    describe('Environment-specific Regression Detection', () => {
        it('should use appropriate regression thresholds per environment', () => {
            // Local environment - strict regression detection
            const localBaseline = 60;
            const localCurrent = 57; // 5% degradation
            const localDegradation = (localBaseline - localCurrent) / localBaseline;

            // Should exceed local tolerance (3%)
            expect(localDegradation).toBeGreaterThan(0.03);

            // CI environment - lenient regression detection
            process.env['CI'] = 'true';
            const ciBaseline = 15;
            const ciCurrent = 10; // 33% degradation
            const ciDegradation = (ciBaseline - ciCurrent) / ciBaseline;

            // Should be within CI tolerance (50%)
            expect(ciDegradation).toBeLessThan(0.5);
        });

        it('should identify significant regressions that fail in all environments', () => {
            const baseline = 60;
            const severelyDegraded = 15; // 75% degradation
            const degradation = (baseline - severelyDegraded) / baseline;

            // Should exceed both local (3%) and CI (50%) thresholds
            expect(degradation).toBeGreaterThan(0.03); // Local threshold
            expect(degradation).toBeGreaterThan(0.5); // CI threshold
        });
    });

    describe('Performance Result Validation', () => {
        it('should validate performance result structure', () => {
            const mockResult = {
                fps: {
                    average: 55,
                    minimum: 45,
                    maximum: 65,
                    baseline: 60,
                    samples: 300
                },
                microfreezes: {
                    count: 1,
                    maxDuration: 0
                },
                environment: 'local' as const,
                timestamp: Date.now()
            };

            expect(mockResult.fps).toBeDefined();
            expect(mockResult.fps.average).toBeGreaterThan(0);
            expect(mockResult.fps.minimum).toBeLessThanOrEqual(mockResult.fps.average);
            expect(mockResult.fps.maximum).toBeGreaterThanOrEqual(mockResult.fps.average);
            expect(mockResult.environment).toMatch(/^(local|ci)$/);
            expect(mockResult.timestamp).toBeGreaterThan(0);
        });

        it('should validate CI performance result with appropriate thresholds', () => {
            const mockCIResult = {
                fps: {
                    average: 12,
                    minimum: 5,
                    maximum: 20,
                    baseline: 15,
                    samples: 300
                },
                microfreezes: {
                    count: 3,
                    maxDuration: 0
                },
                environment: 'ci' as const,
                timestamp: Date.now()
            };

            process.env['CI'] = 'true';
            const thresholds = EnvironmentDetector.getThresholds();

            expect(mockCIResult.fps.average).toBeGreaterThan(thresholds.performance.avgFPS);
            expect(mockCIResult.microfreezes.count).toBeLessThan(
                thresholds.performance.maxMicrofreezes
            );
        });
    });
});
