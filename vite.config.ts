import { defineConfig } from 'vite';
import { resolve } from 'path';

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
    }
});
