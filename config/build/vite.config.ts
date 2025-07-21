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
        sourcemap: process.env.NODE_ENV !== 'production',
        minify: 'esbuild',
        target: 'es2020',
        emptyOutDir: true,
        chunkSizeWarningLimit: 1000, // Increase threshold to 1MB
        rollupOptions: {
            input: resolve(__dirname, '../../index.html'),
            output: {
                manualChunks: {
                    phaser: ['phaser']
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
            isDev: process.env.NODE_ENV === 'development'
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
                    maxSize: 1024,
                    padding: 1,
                    trim: false,
                    extrude: 0
                }
            }
        ]),
        audioProcessorPlugin({
            sourceDir: resolve(__dirname, '../../assets/source'),
            outputDir: resolve(__dirname, '../../assets/processed'),
            isDev: process.env.NODE_ENV === 'development'
        }),
        assetManifestPlugin({
            outputDir: resolve(__dirname, '../../assets/processed'),
            publicPath: './assets/processed/',
            isDev: process.env.NODE_ENV === 'development'
        })
    ]
});
