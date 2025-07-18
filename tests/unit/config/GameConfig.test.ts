import { describe, it, expect, beforeEach } from 'vitest';
import { GameTestHarness } from '../../helpers/gameTestUtils';

describe('Game Configuration', () => {
    let testHarness: GameTestHarness;

    beforeEach(() => {
        testHarness = new GameTestHarness();
    });

    it('should create a test scene', () => {
        const scene = testHarness.createTestScene();
        expect(scene).toBeDefined();
        expect(scene.key).toBe('TestScene');
    });

    it('should simulate input correctly', () => {
        const scene = testHarness.getScene();
        testHarness.simulateInput('pointerdown', { x: 100, y: 100 });
        expect(scene.input.emit).toHaveBeenCalledWith('pointerdown', { x: 100, y: 100 });
    });

    it('should wait for frames', async () => {
        const startTime = Date.now();
        await testHarness.waitForFrame(2);
        const endTime = Date.now();

        // Should take at least 32ms for 2 frames (16ms each)
        expect(endTime - startTime).toBeGreaterThanOrEqual(30);
    });
});
