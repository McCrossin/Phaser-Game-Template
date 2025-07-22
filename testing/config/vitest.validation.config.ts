import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'node',
        setupFiles: [resolve(__dirname, '../template-validation/setup.ts')],
        retry: 1,
        watch: false,
        include: ['**/testing/template-validation/**/*.test.ts'],
        exclude: ['**/node_modules/**', '**/dist/**'],
        reporters: ['verbose'],
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json'],
            include: ['testing/template-validation/**/*.ts'],
            exclude: ['**/*.test.ts', '**/*.d.ts']
        }
    },
    resolve: {
        alias: {
            '@': resolve(__dirname, '../../src'),
            '@testing': resolve(__dirname, '../')
        }
    }
});
