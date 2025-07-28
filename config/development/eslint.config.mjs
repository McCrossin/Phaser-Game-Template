import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import security from 'eslint-plugin-security';

export default tseslint.config(
    {
        ignores: [
            'dist/',
            'node_modules/',
            '**/*.d.ts',
            'coverage/',
            'docs/',
            'tests/e2e/**/*',
            'tests/config/playwright.config.ts',
            'tests/config/playwright-ci.config.ts',
            'config/build/vite.config.ts',
            'build/plugins/**/*',
            'tools/**/*.js'
        ]
    },
    eslint.configs.recommended,
    ...tseslint.configs.recommended,
    security.configs.recommended,
    prettierRecommended,
    {
        files: ['src/**/*.{ts,tsx}'],
        languageOptions: {
            parser: tseslint.parser
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'warn',
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/explicit-function-return-type': 'off',
            'security/detect-object-injection': 'off',
            'security/detect-non-literal-fs-filename': 'off'
        }
    },
    {
        files: ['src/ecs/**/*.ts'],
        languageOptions: {
            parser: tseslint.parser
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off', // ECS requires flexible typing
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/explicit-function-return-type': 'off'
        }
    },
    {
        files: ['tests/**/*.ts', '**/*.test.ts', '**/*.config.ts'],
        languageOptions: {
            parser: tseslint.parser
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off', // Tests need flexibility
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/explicit-function-return-type': 'off',
            'security/detect-object-injection': 'off',
            'security/detect-non-literal-fs-filename': 'off',
            'security/detect-child-process': 'off'
        }
    },
    {
        files: ['src/types/**/*.ts'],
        languageOptions: {
            parser: tseslint.parser
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off', // Type definitions need any
            '@typescript-eslint/no-unused-vars': 'off', // Type files may have unused exports
            '@typescript-eslint/explicit-function-return-type': 'off'
        }
    },
    {
        files: ['tools/**/*.ts'],
        languageOptions: {
            parser: tseslint.parser
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off', // Tools need flexibility
            '@typescript-eslint/no-unused-vars': [
                'error',
                {
                    argsIgnorePattern: '^_',
                    varsIgnorePattern: '^_'
                }
            ],
            '@typescript-eslint/explicit-function-return-type': 'off',
            'security/detect-object-injection': 'off',
            'security/detect-non-literal-fs-filename': 'off',
            'security/detect-child-process': 'off',
            'security/detect-non-literal-require': 'off'
        }
    }
);
