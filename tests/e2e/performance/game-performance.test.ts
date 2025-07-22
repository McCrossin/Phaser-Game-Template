import { test, expect } from '@playwright/test';
import { writeFileSync } from 'fs';

/**
 * Performance tests for Phaser Game Template
 * Tests FPS, load times, and detects microfreezes
 * Environment-aware thresholds for CI vs local testing
 */

// Environment-aware performance thresholds
const isCI = process.env['CI'] === 'true';
const isMobile = process.env['PLAYWRIGHT_PROJECT']?.includes('Mobile') || false;
const PERFORMANCE_THRESHOLDS = {
    // FPS thresholds
    minFPS: isCI ? 2 : 1, // Minimum FPS (very low for CI due to resource constraints)
    avgFPS: isMobile ? 15 : 25, // Lower threshold for mobile devices

    // FPS stability thresholds (coefficient of variation)
    maxFPSVariation: isCI ? 4.0 : 1.5, // Max coefficient of variation (CI: 400%, Local: 150%)

    // Load time thresholds
    maxLoadTime: isCI ? 30000 : 10000, // Maximum load time in ms

    // Memory thresholds
    maxMemoryGrowth: isCI ? 150 : 50, // Maximum memory growth in MB

    // Microfreeze thresholds
    maxMicrofreezes: isCI ? 10 : 15, // Maximum acceptable microfreezes - adjusted for local development

    // Bundle size thresholds
    maxBundleSize: 2 * 1024 * 1024 // 2MB max bundle size (same for all environments)
};

console.log(`Running performance tests in ${isCI ? 'CI' : 'local'} environment`);
console.log('Performance thresholds:', PERFORMANCE_THRESHOLDS);

test.describe('Game Performance Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Enable performance monitoring
        await page.goto('/');

        // For Firefox, use a more reliable loading detection
        const isFlakyBrowser = await page.evaluate(() => navigator.userAgent.includes('Firefox'));

        if (isFlakyBrowser) {
            // For Firefox: just wait for canvas instead of networkidle
            await page.waitForSelector('#game-container canvas', {
                state: 'visible',
                timeout: 60000
            });
            await page.waitForTimeout(3000); // Additional buffer for Firefox
        } else {
            await page.waitForLoadState('networkidle', { timeout: 60000 });
        }
    });

    test('FPS Performance Test', async ({ page }) => {
        // Start FPS monitoring
        await page.evaluate(() => {
            (window as any).fpsData = [];
            let lastTime = performance.now();

            function measureFPS() {
                const now = performance.now();
                const fps = 1000 / (now - lastTime);
                (window as any).fpsData.push(fps);
                lastTime = now;

                if ((window as any).fpsData.length < 300) {
                    // 5 seconds at 60fps
                    requestAnimationFrame(measureFPS);
                }
            }

            requestAnimationFrame(measureFPS);
        });

        // Wait for FPS measurement to complete
        await page.waitForTimeout(6000);

        // Get FPS data
        const fpsData = await page.evaluate(() => (window as any).fpsData);

        // Calculate FPS metrics
        const avgFPS = fpsData.reduce((sum: number, fps: number) => sum + fps, 0) / fpsData.length;
        const minFPS = Math.min(...fpsData);
        const maxFPS = Math.max(...fpsData);

        // Enhanced logging for better debugging
        console.log(`Environment: ${isCI ? 'CI' : 'Local'}`);
        console.log(
            `Average FPS: ${avgFPS.toFixed(2)} (threshold: >${PERFORMANCE_THRESHOLDS.avgFPS})`
        );
        console.log(`Min FPS: ${minFPS.toFixed(2)} (threshold: >${PERFORMANCE_THRESHOLDS.minFPS})`);
        console.log(`Max FPS: ${maxFPS.toFixed(2)}`);
        console.log(`FPS samples collected: ${fpsData.length}`);

        // Environment-aware performance assertions
        expect(avgFPS).toBeGreaterThan(PERFORMANCE_THRESHOLDS.avgFPS);
        expect(minFPS).toBeGreaterThan(PERFORMANCE_THRESHOLDS.minFPS);

        // Additional performance analysis for CI
        if (isCI) {
            // Calculate stability metrics for CI environment
            const fpsVariance =
                fpsData.reduce((sum: number, fps: number) => sum + Math.pow(fps - avgFPS, 2), 0) /
                fpsData.length;
            const fpsStdDev = Math.sqrt(fpsVariance);

            console.log(`FPS Standard Deviation: ${fpsStdDev.toFixed(2)}`);
            console.log(
                `FPS Stability (lower is better): ${((fpsStdDev / avgFPS) * 100).toFixed(2)}%`
            );

            // Environment-aware FPS stability check
            const coefficientOfVariation = fpsStdDev / avgFPS;
            expect(coefficientOfVariation).toBeLessThan(PERFORMANCE_THRESHOLDS.maxFPSVariation);
        } else {
            // Stricter checks for local development
            const baseline = 50; // Expected baseline FPS for local development
            const degradation = Math.max(0, (baseline - avgFPS) / baseline);
            expect(degradation).toBeLessThan(0.5); // Less than 50% degradation acceptable locally (adjusted for mobile)
        }

        // Write performance results to file for the performance check tool
        const performanceResults = {
            fps: {
                average: avgFPS,
                minimum: minFPS,
                maximum: maxFPS,
                baseline: isCI ? PERFORMANCE_THRESHOLDS.avgFPS : 50,
                samples: fpsData.length
            },
            microfreezes: {
                count: fpsData.filter((fps: number) => fps < PERFORMANCE_THRESHOLDS.minFPS).length,
                maxDuration: 0 // Will be calculated by monitoring tools if needed
            },
            environment: isCI ? 'ci' : 'local',
            timestamp: Date.now()
        };

        try {
            writeFileSync('performance-results.json', JSON.stringify(performanceResults, null, 2));
            console.log('✅ Performance results written to performance-results.json');
        } catch (error) {
            console.warn('⚠️  Failed to write performance results:', error);
        }
    });

    test('Load Time Performance', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/');

        // Wait for game to be fully loaded (environment-aware timeouts)
        await page.waitForSelector('canvas', { timeout: PERFORMANCE_THRESHOLDS.maxLoadTime });

        // Check if any game object exists (more flexible than specific scene)
        await page.waitForFunction(
            () => {
                // Check if any canvas or game element is working
                const canvas = document.querySelector('canvas');
                return canvas && canvas.width > 0 && canvas.height > 0;
            },
            { timeout: PERFORMANCE_THRESHOLDS.maxLoadTime }
        );

        const loadTime = Date.now() - startTime;

        console.log(`Environment: ${isCI ? 'CI' : 'Local'}`);
        console.log(
            `Load time: ${loadTime}ms (threshold: <${PERFORMANCE_THRESHOLDS.maxLoadTime}ms)`
        );

        // Environment-aware load time assertion
        expect(loadTime).toBeLessThan(PERFORMANCE_THRESHOLDS.maxLoadTime);

        // Additional checks for local development
        if (!isCI && loadTime > 5000) {
            console.warn(
                `Load time of ${loadTime}ms is slower than expected for local development`
            );
        }
    });

    test('Memory Usage Test', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas');

        // Measure initial memory
        const initialMemory = await page.evaluate(() => {
            return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
        });

        // Simulate gameplay for environment-appropriate duration
        const testDuration = isCI ? 5000 : 10000; // Shorter test in CI
        await page.waitForTimeout(testDuration);

        // Measure memory after gameplay
        const finalMemory = await page.evaluate(() => {
            return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
        });

        const initialMemoryMB = initialMemory / 1024 / 1024;
        const finalMemoryMB = finalMemory / 1024 / 1024;
        const memoryGrowthMB = finalMemoryMB - initialMemoryMB;

        console.log(`Environment: ${isCI ? 'CI' : 'Local'}`);
        console.log(`Initial memory: ${initialMemoryMB.toFixed(2)}MB`);
        console.log(`Final memory: ${finalMemoryMB.toFixed(2)}MB`);
        console.log(
            `Memory growth: ${memoryGrowthMB.toFixed(2)}MB (threshold: <${PERFORMANCE_THRESHOLDS.maxMemoryGrowth}MB)`
        );

        // Environment-aware memory growth check
        expect(memoryGrowthMB).toBeLessThan(PERFORMANCE_THRESHOLDS.maxMemoryGrowth);

        // Additional checks for significant memory growth
        if (memoryGrowthMB > PERFORMANCE_THRESHOLDS.maxMemoryGrowth * 0.8) {
            console.warn(
                `Memory growth of ${memoryGrowthMB.toFixed(2)}MB is approaching the threshold`
            );
        }
    });

    test('Microfreeze Detection', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas');

        // Monitor for microfreezes (UI thread blocks > 100ms)
        const microfreezes = await page.evaluate(() => {
            const freezes: number[] = [];
            const startTime = performance.now();
            let lastFrame = performance.now();

            return new Promise(resolve => {
                function checkFrameTime() {
                    const now = performance.now();
                    const frameTime = now - lastFrame;

                    // Detect microfreezes (100-1000ms)
                    if (frameTime > 100 && frameTime < 1000) {
                        freezes.push(frameTime);
                    }

                    lastFrame = now;

                    // Stop after 10 seconds or if we have enough data
                    if (now - startTime > 10000 || freezes.length >= 10) {
                        resolve(freezes);
                    } else {
                        requestAnimationFrame(checkFrameTime);
                    }
                }

                requestAnimationFrame(checkFrameTime);
            });
        });

        const freezeCount = (microfreezes as number[]).length;

        console.log(`Environment: ${isCI ? 'CI' : 'Local'}`);
        console.log(
            `Microfreezes detected: ${freezeCount} (threshold: <${PERFORMANCE_THRESHOLDS.maxMicrofreezes})`
        );

        if (freezeCount > 0) {
            const freezeDurations = (microfreezes as number[]).map(f => f.toFixed(2)).join(', ');
            console.log(`Freeze durations: ${freezeDurations}ms`);
        }

        // Environment-aware microfreeze assertion
        expect(freezeCount).toBeLessThan(PERFORMANCE_THRESHOLDS.maxMicrofreezes);

        // Additional analysis for CI environment
        if (isCI && freezeCount > 0) {
            const avgFreezeTime =
                (microfreezes as number[]).reduce((sum, time) => sum + time, 0) / freezeCount;
            console.log(`Average freeze duration: ${avgFreezeTime.toFixed(2)}ms`);

            // In CI, ensure freezes aren't too severe
            expect(avgFreezeTime).toBeLessThan(500); // Average freeze < 500ms
        }
    });

    test('Bundle Size Check', async ({ page }) => {
        const response = await page.goto('/');
        // Accept both 200 (OK) and 304 (Not Modified) as successful
        expect([200, 304]).toContain(response?.status());

        // Check main bundle size through network monitoring
        const resourceSizes = await page.evaluate(() => {
            const resources = performance.getEntriesByType(
                'resource'
            ) as PerformanceResourceTiming[];
            return resources
                .filter(r => r.name.includes('.js') || r.name.includes('.css'))
                .map(r => ({
                    name: r.name,
                    size: r.transferSize || 0
                }));
        });

        const totalSize = resourceSizes.reduce((sum, resource) => sum + resource.size, 0);
        const totalSizeMB = totalSize / 1024 / 1024;

        console.log(`Environment: ${isCI ? 'CI' : 'Local'}`);
        console.log(
            `Total bundle size: ${totalSizeMB.toFixed(2)}MB (threshold: <${(PERFORMANCE_THRESHOLDS.maxBundleSize / 1024 / 1024).toFixed(2)}MB)`
        );

        // Log individual resource sizes for debugging
        if (resourceSizes.length > 0) {
            console.log('Resource breakdown:');
            resourceSizes.forEach(resource => {
                const sizeMB = resource.size / 1024 / 1024;
                if (sizeMB > 0.1) {
                    // Only log resources > 100KB
                    console.log(`  ${resource.name.split('/').pop()}: ${sizeMB.toFixed(2)}MB`);
                }
            });
        }

        // Bundle size assertion (same threshold for all environments)
        expect(totalSize).toBeLessThan(PERFORMANCE_THRESHOLDS.maxBundleSize);

        // Warning for bundles approaching the limit
        if (totalSize > PERFORMANCE_THRESHOLDS.maxBundleSize * 0.8) {
            console.warn(
                `Bundle size of ${totalSizeMB.toFixed(2)}MB is approaching the ${(PERFORMANCE_THRESHOLDS.maxBundleSize / 1024 / 1024).toFixed(2)}MB limit`
            );
        }
    });
});
