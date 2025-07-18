import { Plugin } from 'vite';
import { promises as fs } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { ASSET_PIPELINE_CONFIG } from '../src/config/AssetConfig';

export interface ImageOptimizerOptions {
    sourceDir: string;
    outputDir: string;
    isDev: boolean;
}

interface ProcessedImage {
    original: string;
    webp?: string;
    png?: string;
    size: {
        original: number;
        optimized: number;
    };
}

export function imageOptimizerPlugin(options: ImageOptimizerOptions): Plugin {
    const { sourceDir, outputDir, isDev } = options;
    const processedImages = new Map<string, ProcessedImage>();

    return {
        name: 'image-optimizer',
        async buildStart() {
            if (isDev) {
                console.log('🖼️  Image optimizer: Development mode - skipping optimization');
                return;
            }

            console.log('🖼️  Starting image optimization...');
            await processImages();
        },
        generateBundle() {
            if (!isDev) {
                logOptimizationResults();
            }
        }
    };

    async function processImages(): Promise<void> {
        try {
            await ensureDirectoryExists(outputDir);
            const imageFiles = await findImageFiles(sourceDir);

            for (const imagePath of imageFiles) {
                await processImage(imagePath);
            }
        } catch (error) {
            console.error('❌ Image optimization failed:', error);
            throw error;
        }
    }

    async function findImageFiles(dir: string): Promise<string[]> {
        const files: string[] = [];

        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = join(dir, entry.name);

                if (entry.isDirectory()) {
                    const subFiles = await findImageFiles(fullPath);
                    files.push(...subFiles);
                } else if (isImageFile(entry.name)) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            // Directory might not exist, that's ok
            console.warn(`⚠️  Could not read directory: ${dir}`);
        }

        return files;
    }

    function isImageFile(filename: string): boolean {
        const ext = extname(filename).toLowerCase();
        return ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.tiff', '.webp'].includes(ext);
    }

    async function processImage(imagePath: string): Promise<void> {
        const relativePath = imagePath.replace(sourceDir, '').replace(/^[/\\]/, '');
        const category = determineImageCategory(relativePath);
        const quality = getQualityForCategory(category);

        const originalStats = await fs.stat(imagePath);
        const originalSize = originalStats.size;

        const outputBasePath = join(outputDir, relativePath);
        const outputDirPath = dirname(outputBasePath);
        const baseName = basename(outputBasePath, extname(outputBasePath));

        await ensureDirectoryExists(outputDirPath);

        const processed: ProcessedImage = {
            original: imagePath,
            size: {
                original: originalSize,
                optimized: 0
            }
        };

        try {
            // Dynamic import of sharp for ES module compatibility
            const { default: sharp } = await import('sharp');
            const image = sharp(imagePath);
            const metadata = await image.metadata();

            // Resize if too large
            if (metadata.width && metadata.height) {
                const maxSize = ASSET_PIPELINE_CONFIG.image.maxSize;
                if (metadata.width > maxSize.width || metadata.height > maxSize.height) {
                    image.resize(maxSize.width, maxSize.height, {
                        fit: 'inside',
                        withoutEnlargement: true
                    });
                }
            }

            // Generate WebP version
            const webpPath = join(outputDirPath, `${baseName}.webp`);
            await image.clone().webp({ quality }).toFile(webpPath);

            processed.webp = webpPath;
            const webpStats = await fs.stat(webpPath);
            processed.size.optimized += webpStats.size;

            // Generate PNG fallback (unless original is already optimized PNG)
            if (extname(imagePath).toLowerCase() !== '.png' || quality < 100) {
                const pngPath = join(outputDirPath, `${baseName}.png`);
                await image.clone().png({ quality }).toFile(pngPath);

                processed.png = pngPath;
                const pngStats = await fs.stat(pngPath);
                processed.size.optimized += pngStats.size;
            } else {
                // Copy original PNG if it's already optimized
                const pngPath = join(outputDirPath, `${baseName}.png`);
                await fs.copyFile(imagePath, pngPath);
                processed.png = pngPath;
                processed.size.optimized += originalSize;
            }

            processedImages.set(relativePath, processed);
        } catch (error) {
            console.error(`❌ Failed to process image ${imagePath}:`, error);
            throw error;
        }
    }

    function determineImageCategory(
        relativePath: string
    ): keyof typeof ASSET_PIPELINE_CONFIG.image.quality {
        const lowerPath = relativePath.toLowerCase();

        if (lowerPath.includes('ui/') || lowerPath.includes('interface/')) {
            return 'ui';
        } else if (lowerPath.includes('background/') || lowerPath.includes('scene/')) {
            return 'backgrounds';
        } else {
            return 'sprites'; // Default for game sprites
        }
    }

    function getQualityForCategory(
        category: keyof typeof ASSET_PIPELINE_CONFIG.image.quality
    ): number {
        return ASSET_PIPELINE_CONFIG.image.quality[category];
    }

    async function ensureDirectoryExists(dir: string): Promise<void> {
        try {
            await fs.mkdir(dir, { recursive: true });
        } catch (error) {
            // Directory might already exist
        }
    }

    function logOptimizationResults(): void {
        let totalOriginal = 0;
        let totalOptimized = 0;
        let fileCount = 0;

        for (const processed of Array.from(processedImages.values())) {
            totalOriginal += processed.size.original;
            totalOptimized += processed.size.optimized;
            fileCount++;
        }

        const savingsPercent =
            totalOriginal > 0
                ? (((totalOriginal - totalOptimized) / totalOriginal) * 100).toFixed(1)
                : '0';

        console.log(`
🖼️  Image Optimization Complete:
   📁 Files processed: ${fileCount}
   📦 Original size: ${formatBytes(totalOriginal)}
   🗜️  Optimized size: ${formatBytes(totalOptimized)}
   💾 Space saved: ${savingsPercent}% (${formatBytes(totalOriginal - totalOptimized)})
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
