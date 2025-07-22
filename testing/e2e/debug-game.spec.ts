import { test, expect } from '@playwright/test';

test('Debug game initialization', async ({ page }) => {
    console.log('Starting debug test...');

    await page.goto('/');

    // Wait a bit for the page to load
    await page.waitForTimeout(3000);

    // Check if game container exists
    const gameContainer = await page.$('#game-container');
    console.log('Game container exists:', !!gameContainer);

    // Check if canvas exists
    const canvas = await page.$('#game-container canvas');
    console.log('Canvas exists:', !!canvas);

    // Check if game object exists
    const gameExists = await page.evaluate(() => {
        return !!(window as any).game;
    });
    console.log('Game object exists:', gameExists);

    if (gameExists) {
        // Check game state
        const gameState = await page.evaluate(() => {
            const game = (window as any).game;
            const sceneManager = game.scene;
            const activeScene = sceneManager ? sceneManager.scenes[0] : null;

            return {
                hasSceneManager: !!sceneManager,
                activeScenes: sceneManager ? Object.keys(sceneManager.scenes) : [],
                currentActiveScene: activeScene ? activeScene.scene.key : null,
                sceneKeys: sceneManager
                    ? Object.values(sceneManager.scenes).map((s: any) => s.scene.key)
                    : [],
                // Simple check - if the first scene is StartScene and it exists, it's "active"
                isStartSceneRunning: activeScene && activeScene.scene.key === 'StartScene'
            };
        });
        console.log('Game state:', gameState);
    }

    // Just pass the test - this is for debugging
    expect(true).toBe(true);
});
