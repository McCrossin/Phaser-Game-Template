import { Plugin } from 'vite';
import { promises as fs } from 'fs';
import { join, basename, extname, relative } from 'path';
import { createHash } from 'crypto';
import type { AssetEntry, AssetManifest } from '../src/types/AssetTypes';

export interface AssetManifestOptions {
    outputDir: string;
    publicPath: string;
    isDev: boolean;
}

// Re-export types for compatibility
export type { AssetEntry, AssetManifest };

export function assetManifestPlugin(options: AssetManifestOptions): Plugin {
    const { outputDir, publicPath, isDev } = options;
    const assetEntries = new Map<string, AssetEntry>();

    return {
        name: 'asset-manifest',
        async generateBundle(_opts, _bundle) {
            if (isDev) {
                console.log('📋 Asset manifest: Development mode - generating basic manifest');
            } else {
                console.log('📋 Generating asset manifest...');
            }

            await collectAssetInfo();
            await generateManifest();
        }
    };

    async function collectAssetInfo(): Promise<void> {
        try {
            // Collect processed images
            await collectAssetsFromDir(join(outputDir, 'images'), 'image');

            // Collect processed audio
            await collectAssetsFromDir(join(outputDir, 'audio'), 'audio');

            // Collect texture atlases
            await collectAssetsFromDir(join(outputDir, 'atlases'), 'atlas');

            // Collect any data files
            await collectAssetsFromDir(join(outputDir, 'data'), 'data');
        } catch (error) {
            console.warn('⚠️  Some asset directories not found, continuing...');
        }
    }

    async function collectAssetsFromDir(dir: string, type: AssetEntry['type']): Promise<void> {
        try {
            const files = await findFiles(dir);

            for (const filePath of files) {
                await addAssetEntry(filePath, type);
            }
        } catch (error) {
            // Directory might not exist
            console.warn(`⚠️  Asset directory not found: ${dir}`);
        }
    }

    async function findFiles(dir: string): Promise<string[]> {
        const files: string[] = [];

        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = join(dir, entry.name);

                if (entry.isDirectory()) {
                    const subFiles = await findFiles(fullPath);
                    files.push(...subFiles);
                } else {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            // Directory doesn't exist
        }

        return files;
    }

    async function addAssetEntry(filePath: string, type: AssetEntry['type']): Promise<void> {
        try {
            const stats = await fs.stat(filePath);
            const content = await fs.readFile(filePath);
            const hash = createHash('md5').update(content).digest('hex');

            const relativePath = relative(outputDir, filePath);
            const normalizedPath = relativePath.replace(/\\/g, '/');
            const publicUrl = join(publicPath, normalizedPath).replace(/\\/g, '/');

            const category = determineAssetCategory(normalizedPath);

            const entry: AssetEntry = {
                path: publicUrl,
                hash: hash.substring(0, 8), // Short hash for URLs
                size: stats.size,
                type,
                category
            };

            // Add metadata for specific types
            if (type === 'atlas') {
                const atlasMetadata = await loadAtlasMetadata(filePath);
                if (atlasMetadata) {
                    entry.metadata = atlasMetadata;
                }
            } else if (type === 'image') {
                const imageMetadata = await getImageMetadata(filePath);
                if (imageMetadata) {
                    entry.metadata = imageMetadata;
                }
            }

            const key = basename(filePath, extname(filePath));
            assetEntries.set(key, entry);
        } catch (error) {
            console.error(`❌ Failed to process asset: ${filePath}`, error);
        }
    }

    function determineAssetCategory(path: string): AssetEntry['category'] {
        const lowerPath = path.toLowerCase();

        // Essential assets (UI, core game elements)
        if (
            lowerPath.includes('ui/') ||
            lowerPath.includes('interface/') ||
            lowerPath.includes('essential/') ||
            lowerPath.includes('loading/')
        ) {
            return 'essential';
        }

        // Level-specific assets
        if (
            lowerPath.includes('level/') ||
            lowerPath.includes('stage/') ||
            lowerPath.includes('world/')
        ) {
            return 'level';
        }

        // Everything else is optional
        return 'optional';
    }

    async function loadAtlasMetadata(
        atlasImagePath: string
    ): Promise<Record<string, unknown> | undefined> {
        try {
            const jsonPath = atlasImagePath.replace('.png', '.json');
            const jsonContent = await fs.readFile(jsonPath, 'utf-8');
            const atlasData = JSON.parse(jsonContent);

            return {
                frameCount: Object.keys(atlasData.frames || {}).length,
                size: atlasData.meta?.size,
                format: atlasData.meta?.format
            };
        } catch (error) {
            return undefined;
        }
    }

    async function getImageMetadata(
        imagePath: string
    ): Promise<Record<string, unknown> | undefined> {
        try {
            // For now, just return file extension info
            // Could use sharp here to get actual dimensions if needed
            const ext = extname(imagePath).toLowerCase();
            return {
                format: ext.substring(1)
            };
        } catch (error) {
            return undefined;
        }
    }

    async function generateManifest(): Promise<void> {
        const manifest: AssetManifest = {
            version: '1.0.0',
            timestamp: Date.now(),
            entries: Object.fromEntries(assetEntries),
            categories: {
                essential: [],
                level: {},
                optional: []
            },
            totalSize: 0
        };

        // Categorize assets
        for (const [key, entry] of Array.from(assetEntries.entries())) {
            manifest.totalSize += entry.size;

            switch (entry.category) {
                case 'essential':
                    manifest.categories.essential.push(key);
                    break;
                case 'level':
                    // For now, put all level assets in a generic 'default' level
                    // This could be enhanced to parse level names from paths
                    if (!manifest.categories.level['default']) {
                        manifest.categories.level['default'] = [];
                    }
                    manifest.categories.level['default'].push(key);
                    break;
                case 'optional':
                    manifest.categories.optional.push(key);
                    break;
            }
        }

        // Write manifest file
        const manifestPath = join(outputDir, 'asset-manifest.json');
        await fs.writeFile(manifestPath, JSON.stringify(manifest, null, isDev ? 2 : 0));

        console.log(`
📋 Asset Manifest Generated:
   📁 Total assets: ${assetEntries.size}
   🔑 Essential assets: ${manifest.categories.essential.length}
   🎮 Level assets: ${Object.values(manifest.categories.level).flat().length}
   📦 Total size: ${formatBytes(manifest.totalSize)}
   💾 Manifest saved to: asset-manifest.json
        `);
    }

    function formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}
