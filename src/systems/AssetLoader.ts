import type { AssetManifest, AssetEntry } from '../types/AssetTypes';

export interface SupportedFormats {
    image: string[];
    audio: string[];
}

export interface LoadingProgress {
    category: string;
    loaded: number;
    total: number;
    percentage: number;
}

export type LoadingProgressCallback = (progress: LoadingProgress) => void;

export class AssetLoader {
    private scene: Phaser.Scene;
    private manifest: AssetManifest | null = null;
    private supportedFormats: SupportedFormats;
    private progressCallback?: LoadingProgressCallback;

    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        this.supportedFormats = this.detectSupportedFormats();
    }

    public setProgressCallback(callback: LoadingProgressCallback): void {
        this.progressCallback = callback;
    }

    public async preloadEssential(): Promise<void> {
        if (!this.manifest) {
            await this.loadManifest();
        }

        if (!this.manifest) {
            console.warn('⚠️  No asset manifest found, falling back to basic loading');
            return;
        }

        console.log('🔄 Loading essential assets...');
        const essential = this.manifest.categories.essential;
        await this.loadAssets(essential, 'essential');
        console.log('✅ Essential assets loaded');
    }

    public async preloadLevel(levelId: string = 'default'): Promise<void> {
        if (!this.manifest) {
            await this.loadManifest();
        }

        if (
            !this.manifest ||
            !Object.prototype.hasOwnProperty.call(this.manifest.categories.level, levelId)
        ) {
            console.warn(`⚠️  No assets found for level: ${levelId}`);
            return;
        }

        console.log(`🔄 Loading level assets: ${levelId}...`);
        const levelAssets = Object.prototype.hasOwnProperty.call(
            this.manifest.categories.level,
            levelId
        )
            ? this.manifest.categories.level[levelId] || []
            : [];
        await this.loadAssets(levelAssets, 'level');
        console.log(`✅ Level assets loaded: ${levelId}`);
    }

    public async preloadOptional(): Promise<void> {
        if (!this.manifest) {
            await this.loadManifest();
        }

        if (!this.manifest) {
            return;
        }

        console.log('🔄 Loading optional assets...');
        const optional = this.manifest.categories.optional;
        await this.loadAssets(optional, 'optional');
        console.log('✅ Optional assets loaded');
    }

    private async loadManifest(): Promise<void> {
        try {
            const response = await fetch('./assets/processed/asset-manifest.json');
            if (!response.ok) {
                throw new Error(`Failed to load manifest: ${response.status}`);
            }
            this.manifest = await response.json();
            if (this.manifest) {
                console.log(
                    '📋 Asset manifest loaded:',
                    Object.keys(this.manifest.entries).length,
                    'assets'
                );
            }
        } catch (error) {
            console.error('❌ Failed to load asset manifest:', error);
            this.manifest = null;
        }
    }

    private async loadAssets(assetKeys: string[], category: string): Promise<void> {
        if (!this.manifest) return;

        const total = assetKeys.length;
        let loaded = 0;

        // Update progress
        const updateProgress = () => {
            if (this.progressCallback) {
                this.progressCallback({
                    category,
                    loaded,
                    total,
                    percentage: (loaded / total) * 100
                });
            }
        };

        updateProgress();

        for (const key of assetKeys) {
            if (!Object.prototype.hasOwnProperty.call(this.manifest.entries, key)) {
                console.warn(`⚠️  Asset not found in manifest: ${key}`);
                loaded++;
                updateProgress();
                continue;
            }

            const entry = this.manifest.entries[key];
            if (!entry) {
                console.warn(`⚠️  Asset entry is null: ${key}`);
                loaded++;
                updateProgress();
                continue;
            }

            try {
                await this.loadAsset(key, entry);
                loaded++;
                updateProgress();
            } catch (error) {
                console.error(`❌ Failed to load asset: ${key}`, error);
                loaded++;
                updateProgress();
            }
        }
    }

    private async loadAsset(key: string, entry: AssetEntry): Promise<void> {
        const url = this.selectBestUrl(entry);

        switch (entry.type) {
            case 'image':
                this.scene.load.image(key, url);
                break;

            case 'atlas': {
                // Load both the image and JSON for atlas
                const atlasJsonUrl = url.replace('.png', '.json');
                this.scene.load.atlas(key, url, atlasJsonUrl);
                break;
            }

            case 'audio': {
                // Load audio with format fallbacks
                const audioUrls = this.getAudioUrls(entry);
                this.scene.load.audio(key, audioUrls);
                break;
            }

            case 'data':
                this.scene.load.json(key, url);
                break;

            default:
                console.warn(`⚠️  Unknown asset type: ${entry.type} for ${key}`);
        }

        // Start the load if not already running
        if (!this.scene.load.isLoading()) {
            this.scene.load.start();
        }

        // Wait for this specific asset to load
        return new Promise((resolve, reject) => {
            const onComplete = () => {
                cleanup();
                resolve();
            };

            const onError = (fileObj: { key: string }) => {
                if (fileObj.key === key) {
                    cleanup();
                    reject(new Error(`Failed to load asset: ${key}`));
                }
            };

            const cleanup = () => {
                this.scene.load.off('filecomplete', onComplete);
                this.scene.load.off('loaderror', onError);
            };

            this.scene.load.on('filecomplete', onComplete);
            this.scene.load.on('loaderror', onError);
        });
    }

    private selectBestUrl(entry: AssetEntry): string {
        // For now, just return the path as-is
        // Could be enhanced to select best format based on supported formats
        return entry.path;
    }

    private getAudioUrls(entry: AssetEntry): string[] {
        const basePath = entry.path.replace(/\.[^/.]+$/, '');
        const urls: string[] = [];

        // Add WebM if supported
        if (this.supportedFormats.audio.includes('webm')) {
            urls.push(`${basePath}.webm`);
        }

        // Add MP3 fallback
        if (this.supportedFormats.audio.includes('mp3')) {
            urls.push(`${basePath}.mp3`);
        }

        return urls.length > 0 ? urls : [entry.path];
    }

    private detectSupportedFormats(): SupportedFormats {
        return {
            image: this.detectImageSupport(),
            audio: this.detectAudioSupport()
        };
    }

    private detectImageSupport(): string[] {
        const formats: string[] = ['png', 'jpg']; // Always supported

        // Test WebP support
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 1;
            canvas.height = 1;
            const dataUrl = canvas.toDataURL('image/webp');
            const webpSupported = dataUrl && dataUrl.indexOf('data:image/webp') === 0;
            if (webpSupported) {
                formats.unshift('webp'); // Prefer WebP if supported
            }
        } catch {
            // WebP detection failed, continue with fallbacks
        }

        // Test AVIF support (future enhancement)
        // Could add similar test for AVIF

        return formats;
    }

    private detectAudioSupport(): string[] {
        const formats: string[] = [];

        try {
            const audio = document.createElement('audio');

            // Test WebM support (Opus codec)
            if (audio.canPlayType && audio.canPlayType('audio/webm; codecs="opus"')) {
                formats.push('webm');
            }

            // Test MP3 support
            if (audio.canPlayType && audio.canPlayType('audio/mpeg')) {
                formats.push('mp3');
            }

            // Test OGG support
            if (audio.canPlayType && audio.canPlayType('audio/ogg')) {
                formats.push('ogg');
            }
        } catch {
            // Audio detection failed, fallback to MP3
            formats.push('mp3');
        }

        return formats;
    }

    public getLoadedAssets(): string[] {
        // Return list of loaded asset keys
        return Object.keys(this.scene.cache.json.entries.entries).concat(
            Object.keys(this.scene.textures.list),
            Object.keys(this.scene.cache.audio.entries.entries)
        );
    }

    public getTotalSize(): number {
        return this.manifest?.totalSize || 0;
    }

    private getManifestProperty<T>(obj: Record<string, T>, key: string): T | undefined {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            return obj[key];
        }
        return undefined;
    }

    public getAssetInfo(key: string): AssetEntry | null {
        if (!this.manifest) {
            return null;
        }
        return this.getManifestProperty(this.manifest.entries, key) || null;
    }
}
