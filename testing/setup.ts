import { vi } from 'vitest';

// Setup canvas for JSDOM when testing canvas-related functionality
if (
    typeof window !== 'undefined' &&
    !window.HTMLCanvasElement.prototype.toDataURL.toString().includes('[native code]')
) {
    try {
        // Try to import canvas package if available - using dynamic import for optional dependency
        // @ts-expect-error - Canvas is an optional dependency for testing
        import('canvas')
            .then(({ createCanvas }) => {
                const originalCreateElement = document.createElement.bind(document);

                // Override createElement with a simpler approach

                (document as any).createElement = function (
                    tagName: string,
                    options?: ElementCreationOptions
                ) {
                    if (tagName.toLowerCase() === 'canvas') {
                        const canvas = createCanvas(800, 600);
                        // Add missing properties that Phaser might expect
                        Object.defineProperties(canvas, {
                            style: { value: {} },
                            addEventListener: { value: vi.fn() },
                            removeEventListener: { value: vi.fn() },
                            dispatchEvent: { value: vi.fn() }
                        });
                        return canvas;
                    }
                    return originalCreateElement(tagName, options);
                };
            })
            .catch(() => {
                // Canvas package not available, use mock implementation
                console.warn('Canvas package not available, using mock canvas for tests');
            });
    } catch (error) {
        console.warn('Canvas package not available, using basic mock');
        // Fallback to basic mock
    }
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
