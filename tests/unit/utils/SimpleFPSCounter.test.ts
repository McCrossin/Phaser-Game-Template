/**
 * Unit tests for SimpleFPSCounter
 */

import { describe, it, expect, beforeEach, vi, MockedObject } from 'vitest';
import { SimpleFPSCounter } from '@/utils/SimpleFPSCounter';

// Mock Phaser types
interface MockGameObject {
    setScrollFactor: (x: number) => MockGameObject;
    setDepth: (depth: number) => MockGameObject;
    setVisible: (visible: boolean) => MockGameObject;
    setText: (text: string) => MockGameObject;
    setColor: (color: string) => MockGameObject;
    destroy: () => void;
}

interface MockScene {
    add: {
        text: (x: number, y: number, text: string, style: any) => MockGameObject;
    };
    input: {
        keyboard?: {
            on: (event: string, callback: () => void) => void;
        };
    };
    game: {
        loop: {
            actualFps: number;
        };
    };
}

describe('SimpleFPSCounter', () => {
    let mockScene: MockedObject<MockScene>;
    let mockText: MockedObject<MockGameObject>;
    let fpsCounter: SimpleFPSCounter;

    beforeEach(() => {
        // Set up environment for development
        vi.stubEnv('NODE_ENV', 'development');

        // Create mock objects
        mockText = {
            setScrollFactor: vi.fn().mockReturnThis(),
            setDepth: vi.fn().mockReturnThis(),
            setVisible: vi.fn().mockReturnThis(),
            setText: vi.fn().mockReturnThis(),
            setColor: vi.fn().mockReturnThis(),
            destroy: vi.fn()
        } as MockedObject<MockGameObject>;

        mockScene = {
            add: {
                text: vi.fn().mockReturnValue(mockText)
            },
            input: {
                keyboard: {
                    on: vi.fn()
                }
            },
            game: {
                loop: {
                    actualFps: 60
                }
            }
        } as MockedObject<MockScene>;

        fpsCounter = new SimpleFPSCounter(mockScene as any);
    });

    describe('Constructor', () => {
        it('should create FPS display in development mode', () => {
            expect(mockScene.add.text).toHaveBeenCalledWith(
                10,
                10,
                'FPS: 0',
                expect.objectContaining({
                    font: '16px monospace',
                    color: '#00ff00',
                    backgroundColor: '#000000'
                })
            );
        });

        it('should setup toggle key listener', () => {
            expect(mockScene.input.keyboard?.on).toHaveBeenCalledWith(
                'keydown-F3',
                expect.any(Function)
            );
        });

        it('should set initial text properties', () => {
            expect(mockText.setScrollFactor).toHaveBeenCalledWith(0);
            expect(mockText.setDepth).toHaveBeenCalledWith(999999);
            expect(mockText.setVisible).toHaveBeenCalledWith(false);
        });
    });

    describe('update', () => {
        it('should not update when not visible', () => {
            fpsCounter.update();
            expect(mockText.setText).not.toHaveBeenCalled();
        });

        it('should update FPS display when visible', () => {
            // Make counter visible
            fpsCounter.setVisible(true);

            // Update with 60 FPS
            mockScene.game.loop.actualFps = 60;
            fpsCounter.update();

            expect(mockText.setText).toHaveBeenCalledWith('FPS: 60');
            expect(mockText.setColor).toHaveBeenCalledWith('#00ff00'); // Green for good FPS
        });

        it('should use yellow color for medium FPS', () => {
            fpsCounter.setVisible(true);
            mockScene.game.loop.actualFps = 45;
            fpsCounter.update();

            expect(mockText.setColor).toHaveBeenCalledWith('#ffff00'); // Yellow
        });

        it('should use red color for low FPS', () => {
            fpsCounter.setVisible(true);
            mockScene.game.loop.actualFps = 25;

            const consoleSpy = vi.spyOn(console, 'warn');
            fpsCounter.update();

            expect(mockText.setColor).toHaveBeenCalledWith('#ff0000'); // Red
            expect(consoleSpy).toHaveBeenCalledWith('Low FPS detected: 25');
        });
    });

    describe('getCurrentFPS', () => {
        it('should return current FPS value', () => {
            mockScene.game.loop.actualFps = 42.7;
            expect(fpsCounter.getCurrentFPS()).toBe(43);
        });
    });

    describe('setVisible', () => {
        it('should toggle visibility in development mode', () => {
            fpsCounter.setVisible(true);
            expect(mockText.setVisible).toHaveBeenCalledWith(true);

            fpsCounter.setVisible(false);
            expect(mockText.setVisible).toHaveBeenCalledWith(false);
        });
    });

    describe('destroy', () => {
        it('should clean up text object', () => {
            fpsCounter.destroy();
            expect(mockText.destroy).toHaveBeenCalled();
        });
    });

    describe('Production Mode', () => {
        it('should not create FPS display in production', () => {
            // Set production environment
            const originalEnv = process.env['NODE_ENV'];
            process.env['NODE_ENV'] = 'production';

            // Reset mocks
            vi.resetAllMocks();

            try {
                // Create new counter in production mode
                const prodCounter = new SimpleFPSCounter(mockScene as any);

                expect(mockScene.add.text).not.toHaveBeenCalled();

                // Update should not fail
                prodCounter.update();
                prodCounter.setVisible(true);
                prodCounter.destroy();
            } finally {
                // Restore original environment
                process.env['NODE_ENV'] = originalEnv;
            }
        });
    });
});
