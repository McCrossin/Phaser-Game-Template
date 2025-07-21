import { vi } from 'vitest';

// Setup canvas for JSDOM when testing canvas-related functionality
if (
    typeof window !== 'undefined' &&
    !window.HTMLCanvasElement.prototype.toDataURL.toString().includes('[native code]')
) {
    // Use a simple mock canvas implementation for testing
    const originalCreateElement = document.createElement.bind(document);

    (document as any).createElement = function (tagName: string, options?: ElementCreationOptions) {
        if (tagName.toLowerCase() === 'canvas') {
            // Create a basic mock canvas
            const canvas = {
                width: 800,
                height: 600,
                style: {},
                getContext: vi.fn().mockReturnValue({
                    fillRect: vi.fn(),
                    clearRect: vi.fn(),
                    getImageData: vi.fn(),
                    putImageData: vi.fn(),
                    createImageData: vi.fn(),
                    setTransform: vi.fn(),
                    drawImage: vi.fn(),
                    save: vi.fn(),
                    restore: vi.fn(),
                    scale: vi.fn(),
                    rotate: vi.fn(),
                    translate: vi.fn(),
                    transform: vi.fn(),
                    setLineDash: vi.fn(),
                    getLineDash: vi.fn(),
                    measureText: vi.fn().mockReturnValue({ width: 0 }),
                    canvas: null
                }),
                toDataURL: vi.fn().mockReturnValue('data:image/png;base64,mock'),
                addEventListener: vi.fn(),
                removeEventListener: vi.fn(),
                dispatchEvent: vi.fn()
            };

            // Make getContext return a reference to itself for canvas property
            if (canvas.getContext) {
                const ctx = canvas.getContext();
                if (ctx) {
                    ctx.canvas = canvas;
                }
            }

            return canvas as any;
        }
        return originalCreateElement(tagName, options);
    };
}

// Mock Canvas for Phaser tests (fallback)
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

        width = 800;
        height = 600;
        style = {};

        getContext(): any {
            return this.mockContext;
        }

        toDataURL(): string {
            // Return a valid base64 data URL
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        }

        addEventListener = vi.fn();
        removeEventListener = vi.fn();
        dispatchEvent = vi.fn();
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
