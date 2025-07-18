import { vi } from 'vitest';
import 'jest-canvas-mock';

// Mock Phaser for unit tests
vi.mock('phaser', () => ({
    Scene: class MockScene {
        constructor() {}
        preload() {}
        create() {}
        update() {}
    },
    Game: class MockGame {
        constructor() {}
    },
    AUTO: 0,
    Scale: {
        FIT: 'FIT',
        CENTER_BOTH: 'CENTER_BOTH'
    }
}));

// Global test utilities
(global as any).createMockScene = () => {
    return {
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
        load: {
            image: vi.fn(),
            atlas: vi.fn()
        }
    };
};
