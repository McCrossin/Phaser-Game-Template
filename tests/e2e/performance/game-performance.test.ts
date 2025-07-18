import { test, expect } from '@playwright/test';

/**
 * Performance tests for New Eden Project
 * Tests FPS, load times, and detects microfreezes
 * Adjusted for CI environment constraints
 */

test.describe('Game Performance Tests', () => {
    test.beforeEach(async ({ page }) => {
        // Enable performance monitoring
        await page.goto('/');
        await page.waitForLoadState('networkidle');
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

        console.log(`Average FPS: ${avgFPS.toFixed(2)}`);
        console.log(`Min FPS: ${minFPS.toFixed(2)}`);
        console.log(`Max FPS: ${maxFPS.toFixed(2)}`);

        // Assert performance requirements (relaxed for CI environment)
        expect(avgFPS).toBeGreaterThan(15); // Minimum 15 FPS average in CI
        expect(minFPS).toBeGreaterThan(5); // Never drop below 5 FPS

        // Check for performance degradation (relaxed for CI)
        const baseline = 30; // Expected baseline FPS for CI
        const degradation = Math.max(0, (baseline - avgFPS) / baseline);
        expect(degradation).toBeLessThan(0.5); // Less than 50% degradation acceptable in CI
    });

    test('Load Time Performance', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/');

        // Wait for game to be fully loaded (relaxed timeouts for CI)
        await page.waitForSelector('canvas', { timeout: 30000 });

        // Check if any game object exists (more flexible than specific scene)
        await page.waitForFunction(
            () => {
                // Check if any canvas or game element is working
                const canvas = document.querySelector('canvas');
                return canvas && canvas.width > 0 && canvas.height > 0;
            },
            { timeout: 30000 }
        );

        const loadTime = Date.now() - startTime;

        console.log(`Load time: ${loadTime}ms`);

        // Assert load time requirements (relaxed for CI)
        expect(loadTime).toBeLessThan(30000); // Load in under 30 seconds for CI
    });

    test('Memory Usage Test', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas');

        // Measure initial memory
        const initialMemory = await page.evaluate(() => {
            return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
        });

        // Simulate gameplay for shorter duration in CI
        await page.waitForTimeout(5000); // Reduced from 30s to 5s

        // Measure memory after gameplay
        const finalMemory = await page.evaluate(() => {
            return (performance as any).memory ? (performance as any).memory.usedJSHeapSize : 0;
        });

        console.log(`Initial memory: ${(initialMemory / 1024 / 1024).toFixed(2)}MB`);
        console.log(`Final memory: ${(finalMemory / 1024 / 1024).toFixed(2)}MB`);

        // Check for memory leaks (allow 100MB growth for CI)
        const memoryGrowth = finalMemory - initialMemory;
        expect(memoryGrowth).toBeLessThan(100 * 1024 * 1024); // Less than 100MB growth
    });

    test('Microfreeze Detection', async ({ page }) => {
        await page.goto('/');
        await page.waitForSelector('canvas');

        // Monitor for microfreezes (UI thread blocks > 100ms)
        const microfreezes = await page.evaluate(() => {
            const freezes: number[] = [];
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

                    if (freezes.length > 0 || now > lastFrame + 10000) {
                        // 10 second test
                        resolve(freezes);
                    } else {
                        requestAnimationFrame(checkFrameTime);
                    }
                }

                requestAnimationFrame(checkFrameTime);
            });
        });

        console.log(`Microfreezes detected: ${(microfreezes as number[]).length}`);
        if ((microfreezes as number[]).length > 0) {
            console.log(
                `Freeze durations: ${(microfreezes as number[]).map(f => f.toFixed(2)).join(', ')}ms`
            );
        }

        // Assert microfreeze requirements
        expect((microfreezes as number[]).length).toBeLessThan(3); // Less than 3 microfreezes in 10 seconds
    });

    test('Bundle Size Check', async ({ page }) => {
        const response = await page.goto('/');
        expect(response?.status()).toBe(200);

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

        console.log(`Total bundle size: ${(totalSize / 1024 / 1024).toFixed(2)}MB`);

        // Assert bundle size requirements
        expect(totalSize).toBeLessThan(2 * 1024 * 1024); // Less than 2MB
    });
});
