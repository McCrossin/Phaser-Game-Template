import { defineConfig } from 'vite';
import { resolve } from 'path';
import { imageOptimizerPlugin } from '../../vite-plugins/image-optimizer';
import { texturePackerPlugin } from '../../vite-plugins/texture-packer';
import { audioProcessorPlugin } from '../../vite-plugins/audio-processor';
import { assetManifestPlugin } from '../../vite-plugins/asset-manifest';

export default defineConfig({
    root: resolve(__dirname, '../..'),
    base: './',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: process.env['NODE_ENV'] !== 'production',
        minify: 'esbuild',
        target: 'es2020',
        emptyOutDir: true,
        chunkSizeWarningLimit: 1500, // Temporarily increase to 1.5MB for Phaser
        rollupOptions: {
            input: resolve(__dirname, '../../index.html'),
            output: {
                manualChunks: (id: string) => {
                    // Keep Phaser as a single vendor chunk for now
                    if (id.includes('phaser')) {
                        return 'phaser';
                    }
                    // Split other vendor libraries
                    if (id.includes('node_modules')) {
                        return 'vendor';
                    }
                    // Default chunk
                    return undefined;
                }
            }
        }
    },
    server: {
        host: true,
        port: 5173,
        open: true
    },
    preview: {
        host: true,
        port: 4173,
        open: false
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '../../src'),
            '@/scenes': resolve(__dirname, '../../src/scenes'),
            '@/systems': resolve(__dirname, '../../src/systems'),
            '@/components': resolve(__dirname, '../../src/components'),
            '@/entities': resolve(__dirname, '../../src/entities'),
            '@/utils': resolve(__dirname, '../../src/utils'),
            '@/types': resolve(__dirname, '../../src/types')
        }
    },
    optimizeDeps: {
        include: ['phaser']
    },
    esbuild: {
        target: 'es2020'
    },
    plugins: [
        // Asset Pipeline Plugins
        imageOptimizerPlugin({
            sourceDir: resolve(__dirname, '../../assets/source'),
            outputDir: resolve(__dirname, '../../assets/processed'),
            isDev: process.env['NODE_ENV'] === 'development'
        }),
        texturePackerPlugin([
            {
                name: 'sprites',
                source: resolve(__dirname, '../../assets/source/sprites'),
                files: ['*.png', '*.jpg'],
                options: {
                    maxSize: 2048,
                    padding: 2,
                    trim: true,
                    extrude: 1
                }
            },
            {
                name: 'ui',
                source: resolve(__dirname, '../../assets/source/ui'),
                files: ['*.png'],
                options: {
                    maxSize: 2048, // Increased from 1024 to 2048
                    padding: 1,
                    trim: true, // Changed to true to save space
                    extrude: 0
                }
            }
        ]),
        audioProcessorPlugin({
            sourceDir: resolve(__dirname, '../../assets/source'),
            outputDir: resolve(__dirname, '../../assets/processed'),
            isDev: process.env['NODE_ENV'] === 'development'
        }),
        assetManifestPlugin({
            outputDir: resolve(__dirname, '../../assets/processed'),
            publicPath: './assets/processed/',
            isDev: process.env['NODE_ENV'] === 'development'
        })
    ]
});
