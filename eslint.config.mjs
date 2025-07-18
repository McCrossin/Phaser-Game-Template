import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
    {
        ignores: [
            'dist/',
            'node_modules/',
            '**/*.d.ts',
            'coverage/',
            'docs/',
            'tests/e2e/**/*',
            'playwright.config.ts',
            'vite.config.ts'
        ]
    },
    prettierRecommended,
    eslint.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        extends: [tseslint.configs.recommended],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json'
            }
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
            '@typescript-eslint/explicit-function-return-type': 'off'
        }
    },
    {
        files: ['src/ecs/**/*.ts'],
        extends: [tseslint.configs.recommended],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json'
            }
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
        extends: [tseslint.configs.recommended],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: './tsconfig.json'
            }
        },
        rules: {
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off'
        }
    },
    {
        files: ['**/*.js', '**/*.mjs'],
        extends: [tseslint.configs.disableTypeChecked]
    },
    {
        files: ['scripts/**/*.js'],
        extends: [tseslint.configs.disableTypeChecked],
        languageOptions: {
            globals: {
                console: 'readonly',
                process: 'readonly'
            },
            ecmaVersion: 2022,
            sourceType: 'module'
        },
        rules: {
            'prettier/prettier': ['error', { endOfLine: 'auto' }]
        }
    }
);
