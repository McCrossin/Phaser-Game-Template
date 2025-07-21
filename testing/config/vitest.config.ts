import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: [resolve(__dirname, '../setup.ts')],
        retry: 2, // Automatic retry for flaky tests
        exclude: [
            '**/node_modules/**',
            '**/dist/**',
            '**/testing/e2e/**' // Exclude e2e tests from unit testing
        ],
        // CI-specific configuration
        reporters: process.env['CI'] ? [['default', { summary: false }]] : ['verbose'],
        silent: process.env['CI'] === 'true',
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: ['node_modules/', 'testing/', '**/*.d.ts', '**/*.config.*', '**/mockData/*'],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80
            }
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '../../src'),
            '@assets': resolve(__dirname, '../../assets'),
            '@testing': resolve(__dirname, '../'),
            phaser: resolve(__dirname, '../../node_modules/phaser/dist/phaser.js')
        }
    }
});
