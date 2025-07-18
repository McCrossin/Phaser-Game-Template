import { describe, it, expect, beforeEach, vi } from 'vitest';
import { AssetLoader, type LoadingProgress } from '../../../src/systems/AssetLoader.js';

// Mock Phaser scene
const mockScene = {
    load: {
        image: vi.fn(),
        atlas: vi.fn(),
        audio: vi.fn(),
        json: vi.fn(),
        start: vi.fn(),
        isLoading: vi.fn().mockReturnValue(false),
        on: vi.fn(),
        off: vi.fn()
    },
    cache: {
        json: {
            entries: {
                entries: {}
            }
        },
        audio: {
            entries: {
                entries: {}
            }
        }
    },
    textures: {
        list: {}
    }
} as unknown as Phaser.Scene;

// Mock fetch
global.fetch = vi.fn();

describe('AssetLoader', () => {
    let assetLoader: AssetLoader;
    let progressCallback: (progress: LoadingProgress) => void;

    beforeEach(() => {
        vi.clearAllMocks();
        assetLoader = new AssetLoader(mockScene);
        progressCallback = vi.fn();
        assetLoader.setProgressCallback(progressCallback);

        // Mock canvas for format detection
        const mockCanvas = {
            width: 1,
            height: 1,
            toDataURL: vi
                .fn()
                .mockReturnValue(
                    'data:image/webp;base64,UklGRiQAAABXRUJQVlA4TBgAAAAvAAAAEAcQERGIiP4HAA=='
                )
        };

        // Mock audio for format detection
        const mockAudio = {
            canPlayType: vi.fn((type: string) => {
                if (type.includes('webm')) return 'probably';
                if (type.includes('mpeg')) return 'maybe';
                if (type.includes('ogg')) return '';
                return '';
            })
        };

        vi.stubGlobal('document', {
            createElement: vi.fn((tag: string) => {
                if (tag === 'canvas') return mockCanvas;
                if (tag === 'audio') return mockAudio;
                return {};
            })
        });
    });

    describe('Format Detection', () => {
        it('should detect WebP support', () => {
            new AssetLoader(mockScene);
            // Format detection happens in constructor
            expect(document.createElement).toHaveBeenCalledWith('canvas');
        });

        it('should detect audio format support', () => {
            new AssetLoader(mockScene);
            expect(document.createElement).toHaveBeenCalledWith('audio');
        });
    });

    describe('Manifest Loading', () => {
        it('should load asset manifest successfully', async () => {
            const mockManifest = {
                version: '1.0.0',
                timestamp: Date.now(),
                entries: {
                    testSprite: {
                        path: './assets/processed/sprites/test.png',
                        hash: 'abc123',
                        size: 1024,
                        type: 'image' as const,
                        category: 'essential' as const
                    }
                },
                categories: {
                    essential: ['testSprite'],
                    level: {},
                    optional: []
                },
                totalSize: 1024
            };

            (global.fetch as any).mockResolvedValueOnce({
                ok: true,
                json: vi.fn().mockResolvedValueOnce(mockManifest)
            });

            // Mock Phaser load events to resolve immediately
            const mockOn = mockScene.load.on as any;
            mockOn.mockImplementation((event: string, callback: () => void) => {
                if (event === 'filecomplete') {
                    // Resolve the load promise immediately
                    setTimeout(callback, 0);
                }
            });

            await assetLoader.preloadEssential();

            expect(global.fetch).toHaveBeenCalledWith('./assets/processed/asset-manifest.json');
        });

        it('should handle manifest loading failure gracefully', async () => {
            (global.fetch as any).mockRejectedValueOnce(new Error('Network error'));

            await assetLoader.preloadEssential();

            expect(global.fetch).toHaveBeenCalled();
            // Should not throw error
        });
    });

    describe('Asset Loading', () => {
        beforeEach(() => {
            const mockManifest = {
                version: '1.0.0',
                timestamp: Date.now(),
                entries: {
                    testImage: {
                        path: './assets/processed/images/test.png',
                        hash: 'abc123',
                        size: 1024,
                        type: 'image' as const,
                        category: 'essential' as const
                    },
                    testAtlas: {
                        path: './assets/processed/atlases/sprites.png',
                        hash: 'def456',
                        size: 2048,
                        type: 'atlas' as const,
                        category: 'essential' as const
                    },
                    testAudio: {
                        path: './assets/processed/audio/sound.mp3',
                        hash: 'ghi789',
                        size: 512,
                        type: 'audio' as const,
                        category: 'optional' as const
                    }
                },
                categories: {
                    essential: ['testImage', 'testAtlas'],
                    level: { default: [] },
                    optional: ['testAudio']
                },
                totalSize: 3584
            };

            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockManifest)
            });
        });

        it('should load image assets correctly', async () => {
            // Mock the load complete event
            const mockOn = mockScene.load.on as any;
            mockOn.mockImplementation((event: string, callback: () => void) => {
                if (event === 'filecomplete') {
                    setTimeout(callback, 0);
                }
            });

            await assetLoader.preloadEssential();

            expect(mockScene.load.image).toHaveBeenCalledWith(
                'testImage',
                './assets/processed/images/test.png'
            );
        });

        it('should load atlas assets correctly', async () => {
            const mockOn = mockScene.load.on as any;
            mockOn.mockImplementation((event: string, callback: () => void) => {
                if (event === 'filecomplete') {
                    setTimeout(callback, 0);
                }
            });

            await assetLoader.preloadEssential();

            expect(mockScene.load.atlas).toHaveBeenCalledWith(
                'testAtlas',
                './assets/processed/atlases/sprites.png',
                './assets/processed/atlases/sprites.json'
            );
        });

        it('should call progress callback during loading', async () => {
            const mockOn = mockScene.load.on as any;
            mockOn.mockImplementation((event: string, callback: () => void) => {
                if (event === 'filecomplete') {
                    setTimeout(callback, 0);
                }
            });

            await assetLoader.preloadEssential();

            expect(progressCallback).toHaveBeenCalledWith({
                category: 'essential',
                loaded: 0,
                total: 2,
                percentage: 0
            });
        });
    });

    describe('Asset Information', () => {
        it('should return total size from manifest', async () => {
            const mockManifest = {
                version: '1.0.0',
                timestamp: Date.now(),
                entries: {},
                categories: { essential: [], level: {}, optional: [] },
                totalSize: 5000
            };

            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockManifest)
            });

            await assetLoader.preloadEssential();

            expect(assetLoader.getTotalSize()).toBe(5000);
        });

        it('should return asset info for loaded assets', async () => {
            const mockManifest = {
                version: '1.0.0',
                timestamp: Date.now(),
                entries: {
                    test: {
                        path: './test.png',
                        hash: 'abc',
                        size: 100,
                        type: 'image' as const,
                        category: 'essential' as const
                    }
                },
                categories: { essential: ['test'], level: {}, optional: [] },
                totalSize: 100
            };

            (global.fetch as any).mockResolvedValue({
                ok: true,
                json: vi.fn().mockResolvedValue(mockManifest)
            });

            await assetLoader.preloadEssential();

            const assetInfo = assetLoader.getAssetInfo('test');
            expect(assetInfo).toEqual({
                path: './test.png',
                hash: 'abc',
                size: 100,
                type: 'image',
                category: 'essential'
            });
        });
    });
});
