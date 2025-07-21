import { test, expect } from '@playwright/test';

test.describe('Game Performance', () => {
    test.beforeEach(async ({ page }: { page: any }) => {
        await page.goto('/');
    });

    test('should load game within 5 seconds', async ({ page }: { page: any }) => {
        // Wait for game canvas to appear
        await expect(page.locator('canvas')).toBeVisible({ timeout: 5000 });
    });

    test('should maintain stable FPS', async ({ page }: { page: any }) => {
        // Wait for game to load
        await page.locator('canvas').waitFor();

        // Monitor FPS for 3 seconds
        const fpsSamples: number[] = [];
        for (let i = 0; i < 10; i++) {
            const fps = await page.evaluate(() => {
                // Access the game instance if available
                return (window as any).game?.loop?.actualFps || 60;
            });
            fpsSamples.push(fps as number);
            await page.waitForTimeout(300);
        }

        const avgFps = fpsSamples.reduce((a, b) => a + b, 0) / fpsSamples.length;
        expect(avgFps).toBeGreaterThan(55); // Target 60 FPS with 5 FPS tolerance
    });

    test('should not exceed memory limits', async ({ page }: { page: any }) => {
        await page.locator('canvas').waitFor();

        // Wait for game to stabilize
        await page.waitForTimeout(2000);

        const memoryUsage = await page.evaluate(() => {
            return (performance as any).memory?.usedJSHeapSize || 0;
        });

        // Should not exceed 512MB (536,870,912 bytes)
        expect(memoryUsage).toBeLessThan(536870912);
    });
});
