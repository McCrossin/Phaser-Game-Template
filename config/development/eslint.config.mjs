import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';
import security from 'eslint-plugin-security';
import { join } from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = join(__dirname, '../..');

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
    prettierRecommended,
    eslint.configs.recommended,
    security.configs.recommended,
    {
        files: ['**/*.ts', '**/*.tsx'],
        extends: [tseslint.configs.recommended],
        languageOptions: {
            parser: tseslint.parser,
            parserOptions: {
                project: join(projectRoot, 'config/build/tsconfig.json')
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
                project: join(projectRoot, 'config/build/tsconfig.json')
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
                project: join(projectRoot, 'config/build/tsconfig.json')
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
        files: ['tools/**/*.js'],
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
    },
    {
        files: [
            'scripts/**/*.ts',
            'scripts/**/*.js',
            'tests/template-validation/**/*.ts',
            'tests/unit/**/*.test.ts'
        ],
        languageOptions: {
            globals: {
                console: 'readonly',
                process: 'readonly'
            }
        },
        rules: {
            'security/detect-non-literal-fs-filename': 'off',
            'security/detect-object-injection': 'off',
            'security/detect-non-literal-regexp': 'off',
            'security/detect-unsafe-regex': 'off',
            '@typescript-eslint/no-explicit-any': 'off',
            '@typescript-eslint/no-unused-vars': 'off',
            'no-undef': 'off',
            'no-unused-vars': 'off'
        }
    }
);
