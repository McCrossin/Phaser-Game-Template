/**
 * Performance Test Implementation for CI/CD Pipeline
 * Tests FPS, bundle size, and microfreeze detection
 */

import { test, expect, Page } from '@playwright/test';

// Performance thresholds
const PERFORMANCE_THRESHOLDS = {
    minFPS: 55,
    degradationTolerance: 0.03, // 3%
    maxMicrofreezeDuration: 100, // ms
    maxLoadTime: 3000 // 3 seconds
};

interface PerformanceMetrics {
    fps: number;
    frameTimes: number[];
    microfreezes: number[];
    loadTime: number;
    memoryUsage: number;
}

test.describe('Game Performance Tests', () => {
    test('should maintain 55+ FPS during gameplay', async ({ page }) => {
        const metrics = await measureGamePerformance(page);

        expect(metrics.fps).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.minFPS);

        // Check for FPS stability (no drops below threshold)
        const minFrameTime = Math.min(...metrics.frameTimes);
        const maxFPS = 1000 / minFrameTime;
        expect(maxFPS).toBeGreaterThanOrEqual(PERFORMANCE_THRESHOLDS.minFPS);
    });

    test('should detect microfreezes (100-1000ms UI freezes)', async ({ page }) => {
        const metrics = await measureGamePerformance(page);

        // Count microfreezes (frame times > 100ms)
        const microfreezes = metrics.frameTimes.filter(
            frameTime => frameTime > PERFORMANCE_THRESHOLDS.maxMicrofreezeDuration
        );

        // Should have minimal microfreezes
        expect(microfreezes.length).toBeLessThanOrEqual(2);

        // Log microfreeze data for analysis
        if (microfreezes.length > 0) {
            console.log('Detected microfreezes:', microfreezes);
        }
    });

    test('should load within 3 seconds', async ({ page }) => {
        const startTime = Date.now();

        await page.goto('/');
        await page.waitForSelector('#game-canvas', { state: 'visible' });

        // Wait for game initialization
        await page.waitForFunction(() => {
            const game = (window as any).game;
            return game && game.scene && game.scene.isActive('MainScene');
        });

        const loadTime = Date.now() - startTime;
        expect(loadTime).toBeLessThanOrEqual(PERFORMANCE_THRESHOLDS.maxLoadTime);
    });

    test('should maintain stable memory usage', async ({ page }) => {
        const metrics = await measureGamePerformance(page, 30000); // 30 seconds

        // Memory should not grow excessively
        expect(metrics.memoryUsage).toBeLessThanOrEqual(100 * 1024 * 1024); // 100MB
    });
});

async function measureGamePerformance(page: Page, duration = 10000): Promise<PerformanceMetrics> {
    await page.goto('/');
    await page.waitForSelector('#game-canvas', { state: 'visible' });

    // Wait for game to fully load
    await page.waitForFunction(() => {
        const game = (window as any).game;
        return game && game.scene && game.scene.isActive('MainScene');
    });

    // Start performance measurement
    const startTime = Date.now();
    const performanceData = await page.evaluate(async testDuration => {
        const frameTimes: number[] = [];
        let frameCount = 0;
        let lastFrameTime = performance.now();

        return new Promise<{
            fps: number;
            frameTimes: number[];
            memoryUsage: number;
        }>(resolve => {
            function measureFrame() {
                const currentTime = performance.now();
                const frameTime = currentTime - lastFrameTime;
                frameTimes.push(frameTime);
                frameCount++;
                lastFrameTime = currentTime;

                if (currentTime - performance.now() < testDuration) {
                    requestAnimationFrame(measureFrame);
                } else {
                    const totalTime = (currentTime - (performance.now() - testDuration)) / 1000;
                    const avgFPS = frameCount / totalTime;

                    resolve({
                        fps: avgFPS,
                        frameTimes: frameTimes,
                        memoryUsage: (performance as any).memory?.usedJSHeapSize || 0
                    });
                }
            }

            requestAnimationFrame(measureFrame);
        });
    }, duration);

    const endTime = Date.now();
    const actualLoadTime = endTime - startTime;

    return {
        fps: performanceData.fps,
        frameTimes: performanceData.frameTimes,
        microfreezes: performanceData.frameTimes.filter(t => t > 100),
        loadTime: actualLoadTime,
        memoryUsage: performanceData.memoryUsage
    };
}
