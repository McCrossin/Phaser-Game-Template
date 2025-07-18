import { defineConfig } from 'vite';
import { resolve } from 'path';
import { imageOptimizerPlugin } from './build/plugins/image-optimizer';
import { texturePackerPlugin } from './build/plugins/texture-packer';
import { audioProcessorPlugin } from './build/plugins/audio-processor';
import { assetManifestPlugin } from './build/plugins/asset-manifest';

export default defineConfig({
    root: '.',
    base: './',
    build: {
        outDir: 'dist',
        assetsDir: 'assets',
        sourcemap: process.env.NODE_ENV !== 'production',
        minify: 'esbuild',
        target: 'es2020',
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html')
            }
        }
    },
    server: {
        host: true,
        port: 5173,
        open: true
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, 'src'),
            '@/scenes': resolve(__dirname, 'src/scenes'),
            '@/systems': resolve(__dirname, 'src/systems'),
            '@/components': resolve(__dirname, 'src/components'),
            '@/entities': resolve(__dirname, 'src/entities'),
            '@/utils': resolve(__dirname, 'src/utils'),
            '@/types': resolve(__dirname, 'src/types')
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
            sourceDir: resolve(__dirname, 'assets/raw'),
            outputDir: resolve(__dirname, 'assets/processed'),
            isDev: process.env.NODE_ENV === 'development'
        }),
        texturePackerPlugin([
            {
                name: 'sprites',
                source: resolve(__dirname, 'assets/raw/sprites'),
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
                source: resolve(__dirname, 'assets/raw/ui'),
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
            sourceDir: resolve(__dirname, 'assets/raw'),
            outputDir: resolve(__dirname, 'assets/processed'),
            isDev: process.env.NODE_ENV === 'development'
        }),
        assetManifestPlugin({
            outputDir: resolve(__dirname, 'assets/processed'),
            publicPath: './assets/processed/',
            isDev: process.env.NODE_ENV === 'development'
        })
    ]
});
