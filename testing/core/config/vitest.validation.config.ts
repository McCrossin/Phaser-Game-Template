import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: [resolve(__dirname, '../setup.ts')],
        retry: 1,
        watch: false,
        include: ['**/testing/core/**/*.test.ts'],
        exclude: ['**/node_modules/**', '**/dist/**', '**/testing/advanced/**'],
        reporters: ['verbose'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json'],
            include: ['testing/core/**/*.ts'],
            exclude: ['**/*.test.ts', '**/*.d.ts']
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '../../../src'),
            '@testing': resolve(__dirname, '../../')
        }
    }
});
