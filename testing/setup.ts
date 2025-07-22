import { vi, beforeEach, afterEach } from 'vitest';

// Simplified global cleanup - no timer tracking overhead
beforeEach(() => {
    // Clear vi mocks to prevent memory leaks
    vi.clearAllMocks();

    // Clear common global test state
    delete (globalThis as any).testSpecificState;
    delete (globalThis as any).contaminatedState;
    delete (globalThis as any).testState;
    delete (globalThis as any).asyncState;
    delete (globalThis as any).tempRef;
    delete (globalThis as any).newProperty;
});

afterEach(() => {
    // Always use real timers after each test
    vi.useRealTimers();
    vi.clearAllTimers();

    // Clean up any leftover globals
    delete (globalThis as any).testSpecificState;
    delete (globalThis as any).contaminatedState;
    delete (globalThis as any).testState;
    delete (globalThis as any).asyncState;
    delete (globalThis as any).tempRef;
    delete (globalThis as any).newProperty;
});

// Optimized Node.js environment setup - minimal mock overhead
if (typeof globalThis.window === 'undefined') {
    // Lightweight HTMLCanvasElement mock
    class MockHTMLCanvasElement {
        width = 800;
        height = 600;
        style = {};

        getContext() {
            return {
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
                measureText: vi.fn(() => ({ width: 0 })),
                canvas: this
            };
        }

        toDataURL() {
            return 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNkYPhfDwAChwGA60e6kgAAAABJRU5ErkJggg==';
        }

        addEventListener = vi.fn();
        removeEventListener = vi.fn();
        dispatchEvent = vi.fn();
    }

    // Mock window and document objects for Node.js testing
    (globalThis as any).window = {
        HTMLCanvasElement: MockHTMLCanvasElement,
        requestAnimationFrame: vi.fn(cb => setTimeout(cb, 16)),
        cancelAnimationFrame: vi.fn(),
        location: { href: 'http://localhost/' },
        navigator: { userAgent: 'test' }
    };

    (globalThis as any).document = {
        createElement: vi.fn().mockImplementation((tagName: string) => {
            if (tagName.toLowerCase() === 'canvas') {
                return new MockHTMLCanvasElement();
            }
            return {
                addEventListener: vi.fn(),
                removeEventListener: vi.fn()
            };
        }),
        addEventListener: vi.fn(),
        removeEventListener: vi.fn()
    };
}

// Mock Phaser for unit tests - lightweight implementation
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
(globalThis as any).createMockScene = () => {
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
            atlas: vi.fn(),
            on: vi.fn()
        }
    };
};
