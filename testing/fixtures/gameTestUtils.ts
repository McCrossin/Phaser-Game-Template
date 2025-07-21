import { vi } from 'vitest';

export class GameTestHarness {
    private scene: any;

    constructor() {
        this.scene = this.createTestScene();
    }

    createTestScene(): any {
        // Creates a minimal Phaser scene for testing
        return {
            key: 'TestScene',
            add: {
                text: vi.fn(),
                sprite: vi.fn(),
                group: vi.fn()
            },
            physics: {
                add: {
                    sprite: vi.fn(),
                    group: vi.fn()
                }
            },
            input: {
                emit: vi.fn()
            }
        };
    }

    async waitForFrame(frames: number = 1): Promise<void> {
        // Waits for specified number of game frames
        for (let i = 0; i < frames; i++) {
            await new Promise(resolve => setTimeout(resolve, 16));
        }
    }

    simulateInput(type: string, data: any): void {
        // Simulates player input for testing
        this.scene.input.emit(type, data);
    }

    getScene(): any {
        return this.scene;
    }
}
