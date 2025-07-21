import { vi } from 'vitest';

// Mock Canvas for Phaser tests
Object.defineProperty(window, 'HTMLCanvasElement', {
    value: class HTMLCanvasElement {
        private mockContext = {
            fillRect: vi.fn(),
            clearRect: vi.fn(),
            getImageData: vi.fn(),
            putImageData: vi.fn(),
            createImageData: vi.fn(),
            setTransform: vi.fn(),
            drawImage: vi.fn(),
            save: vi.fn(),
            restore: vi.fn(),
            beginPath: vi.fn(),
            moveTo: vi.fn(),
            lineTo: vi.fn(),
            closePath: vi.fn(),
            stroke: vi.fn(),
            fill: vi.fn()
        };

        getContext(): any {
            return this.mockContext;
        }
        toDataURL(): string {
            return 'data:image/png;base64,';
        }
    }
});

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
