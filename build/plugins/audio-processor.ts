import { Plugin } from 'vite';
import { promises as fs } from 'fs';
import { join, dirname, basename, extname } from 'path';
import { spawn } from 'child_process';
import { ASSET_PIPELINE_CONFIG } from '../../src/config/AssetConfig';

export interface AudioProcessorOptions {
    sourceDir: string;
    outputDir: string;
    isDev: boolean;
}

interface ProcessedAudio {
    original: string;
    webm?: string;
    mp3?: string;
    size: {
        original: number;
        optimized: number;
    };
}

export function audioProcessorPlugin(options: AudioProcessorOptions): Plugin {
    const { sourceDir, outputDir, isDev } = options;
    const processedAudio = new Map<string, ProcessedAudio>();

    return {
        name: 'audio-processor',
        async buildStart() {
            if (isDev) {
                console.log('🔊 Audio processor: Development mode - skipping optimization');
                return;
            }

            console.log('🔊 Starting audio optimization...');
            await processAudioFiles();
        },
        generateBundle() {
            if (!isDev) {
                logOptimizationResults();
            }
        }
    };

    async function processAudioFiles(): Promise<void> {
        try {
            await ensureDirectoryExists(outputDir);
            const audioFiles = await findAudioFiles(sourceDir);

            for (const audioPath of audioFiles) {
                await processAudioFile(audioPath);
            }
        } catch (error) {
            console.error('❌ Audio optimization failed:', error);
            throw error;
        }
    }

    async function findAudioFiles(dir: string): Promise<string[]> {
        const files: string[] = [];

        try {
            const entries = await fs.readdir(dir, { withFileTypes: true });

            for (const entry of entries) {
                const fullPath = join(dir, entry.name);

                if (entry.isDirectory()) {
                    const subFiles = await findAudioFiles(fullPath);
                    files.push(...subFiles);
                } else if (isAudioFile(entry.name)) {
                    files.push(fullPath);
                }
            }
        } catch (error) {
            console.warn(`⚠️  Could not read directory: ${dir}`);
        }

        return files;
    }

    function isAudioFile(filename: string): boolean {
        const ext = extname(filename).toLowerCase();
        return ['.wav', '.mp3', '.ogg', '.flac', '.m4a', '.aac'].includes(ext);
    }

    async function processAudioFile(audioPath: string): Promise<void> {
        const relativePath = audioPath.replace(sourceDir, '').replace(/^[/\\]/, '');
        const category = determineAudioCategory(relativePath);
        const bitrate = getBitrateForCategory(category);

        const originalStats = await fs.stat(audioPath);
        const originalSize = originalStats.size;

        const outputBasePath = join(outputDir, relativePath);
        const outputDirPath = dirname(outputBasePath);
        const baseName = basename(outputBasePath, extname(outputBasePath));

        await ensureDirectoryExists(outputDirPath);

        const processed: ProcessedAudio = {
            original: audioPath,
            size: {
                original: originalSize,
                optimized: 0
            }
        };

        try {
            // Check if FFmpeg is available
            const hasFFmpeg = await checkFFmpeg();

            if (hasFFmpeg) {
                // Generate WebM version (Opus codec)
                const webmPath = join(outputDirPath, `${baseName}.webm`);
                await convertWithFFmpeg(audioPath, webmPath, 'webm', bitrate);
                processed.webm = webmPath;

                const webmStats = await fs.stat(webmPath);
                processed.size.optimized += webmStats.size;

                // Generate MP3 fallback
                const mp3Path = join(outputDirPath, `${baseName}.mp3`);
                if (extname(audioPath).toLowerCase() !== '.mp3') {
                    await convertWithFFmpeg(audioPath, mp3Path, 'mp3', bitrate);
                } else {
                    // Copy existing MP3 if it's the source format
                    await fs.copyFile(audioPath, mp3Path);
                }
                processed.mp3 = mp3Path;

                const mp3Stats = await fs.stat(mp3Path);
                processed.size.optimized += mp3Stats.size;
            } else {
                console.warn('⚠️  FFmpeg not found - copying audio files without optimization');
                // Just copy the original file if FFmpeg is not available
                const copyPath = join(outputDirPath, basename(audioPath));
                await fs.copyFile(audioPath, copyPath);
                processed.size.optimized = originalSize;
            }

            processedAudio.set(relativePath, processed);
        } catch (error) {
            console.error(`❌ Failed to process audio ${audioPath}:`, error);
            throw error;
        }
    }

    function determineAudioCategory(
        relativePath: string
    ): keyof typeof ASSET_PIPELINE_CONFIG.audio.bitrates {
        const lowerPath = relativePath.toLowerCase();

        if (lowerPath.includes('music/') || lowerPath.includes('bgm/')) {
            return 'music';
        } else if (lowerPath.includes('voice/') || lowerPath.includes('dialog/')) {
            return 'voice';
        } else {
            return 'sfx'; // Default for sound effects
        }
    }

    function getBitrateForCategory(
        category: keyof typeof ASSET_PIPELINE_CONFIG.audio.bitrates
    ): number {
        return ASSET_PIPELINE_CONFIG.audio.bitrates[category];
    }

    async function checkFFmpeg(): Promise<boolean> {
        return new Promise(resolve => {
            const ffmpeg = spawn('ffmpeg', ['-version']);
            ffmpeg.on('error', () => resolve(false));
            ffmpeg.on('close', code => resolve(code === 0));
        });
    }

    async function convertWithFFmpeg(
        inputPath: string,
        outputPath: string,
        format: 'webm' | 'mp3',
        bitrate: number
    ): Promise<void> {
        return new Promise((resolve, reject) => {
            const args = ['-i', inputPath, '-y']; // -y to overwrite output files

            if (format === 'webm') {
                args.push('-c:a', 'libopus', '-b:a', `${bitrate}k`);
            } else if (format === 'mp3') {
                args.push('-c:a', 'libmp3lame', '-b:a', `${bitrate}k`);
            }

            args.push(outputPath);

            const ffmpeg = spawn('ffmpeg', args);

            ffmpeg.stderr.on('data', data => {
                // FFmpeg outputs progress info to stderr, which is normal
                // Only log actual errors, not progress
                const message = data.toString();
                if (message.includes('Error') || message.includes('Invalid')) {
                    console.error('FFmpeg error:', message);
                }
            });

            ffmpeg.on('error', error => {
                reject(new Error(`FFmpeg process error: ${error.message}`));
            });

            ffmpeg.on('close', code => {
                if (code === 0) {
                    resolve();
                } else {
                    reject(new Error(`FFmpeg exited with code ${code}`));
                }
            });
        });
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

        for (const processed of processedAudio.values()) {
            totalOriginal += processed.size.original;
            totalOptimized += processed.size.optimized;
            fileCount++;
        }

        const savingsPercent =
            totalOriginal > 0 ? ((totalOriginal - totalOptimized) / totalOriginal) * 100 : 0;

        console.log(`
🔊 Audio Optimization Complete:
   📁 Files processed: ${fileCount}
   📦 Original size: ${formatBytes(totalOriginal)}
   🗜️  Optimized size: ${formatBytes(totalOptimized)}
   💾 Space saved: ${savingsPercent.toFixed(1)}% (${formatBytes(totalOriginal - totalOptimized)})
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
