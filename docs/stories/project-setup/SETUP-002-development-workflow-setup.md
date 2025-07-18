# Story: Development Workflow Setup
**ID**: SETUP-002  
**Epic**: Project Setup and Configuration  
**Priority**: High  
**Estimated Points**: 5  
**Dependencies**: SETUP-001 (Initial Project Configuration)

## Description

Establish consistent development workflows and automation tools that ensure code quality, enforce standards, and streamline repetitive tasks. This story implements Git hooks, automated testing frameworks, code formatting, linting rules, and documentation generation to create a professional development environment that scales with team growth.

### Player Experience Goal
While players won't directly see these tools, they benefit from fewer bugs, more consistent performance, and faster feature delivery. The automated quality checks prevent game-breaking issues from reaching production, ensuring a stable and polished gaming experience.

### Technical Overview
Integrate Husky v10 for Git hooks, Vitest v3 for unit testing, Playwright for integration testing, ESLint v10 with flat config and Prettier v5 for code quality, and TypeDoc for automated documentation. All tools will work seamlessly with the TypeScript 5.8+ and Vite 7.0+ setup from SETUP-001.

## Acceptance Criteria

### Functional Requirements
- [ ] Git hooks prevent commits with failing tests or linting errors
- [ ] Unit tests run automatically before commits
- [ ] Code formatting is applied automatically on file save
- [ ] TypeScript errors block commits
- [ ] Documentation generates from code comments
- [ ] All workflows function in VS Code and command line

### Technical Requirements
- [ ] Husky v10+ configured with modern Git hooks
- [ ] Vitest v3 configured for TypeScript and Phaser testing
- [ ] Playwright set up for browser-based integration tests
- [ ] ESLint v10 with flat config and TypeScript support
- [ ] Prettier v5 integrated with ESLint flat config
- [ ] TypeDoc generating API documentation

### Game Design Requirements
- [ ] Testing covers game mechanics validation
- [ ] Performance benchmarks included in tests
- [ ] Visual regression testing for UI elements
- [ ] Save/load state testing automated
- [ ] Game balance parameters validated

## Technical Specifications

### Architecture Context
The development workflow sits at the foundation of the project, ensuring all code meets quality standards before it enters the codebase. It integrates with the CI/CD pipeline (SETUP-003) and supports the coding standards defined in the architecture document.

### Files to Create/Modify
- `.husky/pre-commit`: Git pre-commit hook
- `.husky/pre-push`: Git pre-push hook
- `.husky/commit-msg`: Commit message validation
- `eslint.config.mjs`: ESLint v10 flat configuration
- `.prettierrc`: Prettier configuration
- `.prettierignore`: Prettier ignore patterns
- `vitest.config.ts`: Vitest test configuration
- `playwright.config.ts`: Playwright configuration
- `typedoc.json`: Documentation configuration
- `package.json`: Script updates
- `tests/setup.ts`: Test environment setup
- `tests/helpers/`: Test helper utilities
- `.vscode/settings.json`: VS Code workspace settings
- `.vscode/extensions.json`: Recommended extensions

### Key Classes and Interfaces
```typescript
// vitest.config.ts
import { defineConfig } from 'vitest/config';
import { resolve } from 'path';

export default defineConfig({
    test: {
        globals: true,
        environment: 'jsdom',
        setupFiles: ['./tests/setup.ts'],
        // Vitest v3 features
        shuffle: {
            files: true, // Better concurrent execution
            suites: true
        },
        retry: 2, // Automatic retry for flaky tests
        coverage: {
            provider: 'v8',
            reporter: ['text', 'json', 'html'],
            exclude: [
                'node_modules/',
                'tests/',
                '**/*.d.ts',
                '**/*.config.*',
                '**/mockData/*',
                '**/*.test.ts' // Auto-exclude test files
            ],
            thresholds: {
                lines: 80,
                functions: 80,
                branches: 80,
                statements: 80
            }
        },
        alias: {
            '@': resolve(__dirname, './src'),
            '@assets': resolve(__dirname, './assets'),
            '@tests': resolve(__dirname, './tests')
        }
    },
    resolve: {
        alias: {
            'phaser': resolve(__dirname, './node_modules/phaser/dist/phaser.js')
        }
    }
});

// tests/setup.ts
import { vi } from 'vitest';
import 'jest-canvas-mock';

// Mock Phaser for unit tests
vi.mock('phaser', () => ({
    Scene: class MockScene {
        constructor() {}
        preload() {}
        create() {}
        update() {}
    },
    Game: class MockGame {
        constructor() {}
    },
    AUTO: 0,
    Scale: {
        FIT: 'FIT',
        CENTER_BOTH: 'CENTER_BOTH'
    }
}));

// Global test utilities
global.createMockScene = () => {
    return {
        add: {
            text: vi.fn(),
            sprite: vi.fn(),
            group: vi.fn()
        },
        physics: {
            add: {
                sprite: vi.fn(),
                group: vi.fn()
            }
        },
        load: {
            image: vi.fn(),
            atlas: vi.fn()
        }
    };
};

// tests/helpers/gameTestUtils.ts
export class GameTestHarness {
    private scene: Phaser.Scene;
    
    constructor() {
        this.scene = this.createTestScene();
    }
    
    createTestScene(): Phaser.Scene {
        // Creates a minimal Phaser scene for testing
        return new Phaser.Scene({ key: 'TestScene' });
    }
    
    async waitForFrame(frames: number = 1): Promise<void> {
        // Waits for specified number of game frames
        for (let i = 0; i < frames; i++) {
            await new Promise(resolve => setTimeout(resolve, 16));
        }
    }
    
    simulateInput(type: string, data: any): void {
        // Simulates player input for testing
        this.scene.input.emit(type, data);
    }
}

// eslint.config.mjs - ESLint v10 flat config
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';
import prettierRecommended from 'eslint-plugin-prettier/recommended';

export default tseslint.config(
    {
        ignores: ['dist/', 'node_modules/', '**/*.d.ts', 'coverage/', 'docs/']
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
            '@typescript-eslint/no-unused-vars': ['error', { 
                argsIgnorePattern: '^_',
                varsIgnorePattern: '^_'
            }],
            '@typescript-eslint/explicit-function-return-type': 'off'
        }
    },
    {
        files: ['**/*.js', '**/*.mjs'],
        extends: [tseslint.configs.disableTypeChecked]
    }
);
```

### Integration Points
- **Git Workflow**: Hooks integrate with Git operations
- **IDE Integration**: VS Code settings for consistent experience
- **Build Pipeline**: Testing and linting in build process
- **Documentation**: Auto-generated docs from code
- **CI/CD**: Local checks mirror CI pipeline

### Performance Requirements
- Pre-commit hooks complete in <10 seconds
- Unit test suite runs in <30 seconds
- Linting full codebase in <5 seconds
- Documentation generation in <20 seconds
- No noticeable IDE performance impact

## Implementation Tasks

### 1. Configure Git Hooks with Husky
Set up modern Git hooks for automated quality checks.

**Estimated Time**: 3 hours
**Technical Details**:
- Install Husky v10: `npm install --save-dev husky`
- Initialize Husky: `npx husky init`
- Create pre-commit hook with lint-staged in package.json
- Add commit-msg hook for conventional commits
- Configure pre-push for full test suite
- Note: lint-staged config now goes in package.json, not separate file

### 2. Set Up Testing Framework
Configure Vitest for unit testing and Playwright for integration testing.

**Estimated Time**: 5 hours
**Technical Details**:
- Install Vitest and dependencies
- Configure Vitest for TypeScript and Phaser
- Set up coverage thresholds (80% minimum)
- Create test helpers for Phaser components
- Install Playwright for browser testing
- Create example tests for each layer

### 3. Configure Code Quality Tools
Set up ESLint and Prettier for consistent code style.

**Estimated Time**: 3 hours
**Technical Details**:
- Install ESLint with TypeScript plugin
- Configure Phaser-specific ESLint rules
- Set up Prettier with ESLint integration
- Create ignore patterns for generated files
- Configure import sorting rules
- Add scripts for fixing issues

### 4. Implement Documentation Generation
Set up TypeDoc for automated API documentation.

**Estimated Time**: 2 hours
**Technical Details**:
- Install TypeDoc with plugins
- Configure for TypeScript strict mode
- Set up custom theme if needed
- Create documentation templates
- Add JSDoc examples
- Configure GitHub Pages deployment

### 5. Create Developer Scripts
Add npm scripts for common developer tasks.

**Estimated Time**: 2 hours
**Technical Details**:
```json
{
    "scripts": {
        "dev": "vite",
        "build": "tsc && vite build",
        "preview": "vite preview",
        "test": "vitest",
        "test:ui": "vitest --ui",
        "test:coverage": "vitest --coverage",
        "test:e2e": "playwright test",
        "lint": "eslint src --ext .ts,.tsx",
        "lint:fix": "eslint src --ext .ts,.tsx --fix",
        "format": "prettier --write \"src/**/*.{ts,tsx,json,css}\"",
        "format:check": "prettier --check \"src/**/*.{ts,tsx,json,css}\"",
        "typecheck": "tsc --noEmit",
        "docs": "typedoc src/main.ts",
        "prepare": "husky",
        "validate": "npm run typecheck && npm run lint && npm run test"
    }
}
```

### 6. Configure VS Code Workspace
Set up VS Code for optimal development experience.

**Estimated Time**: 1 hour
**Technical Details**:
- Create workspace settings for formatting
- Add recommended extensions list
- Configure debugging launch configs
- Set up task runners
- Add code snippets for common patterns

## Game Design Context

### GDD References
- Development Standards: Maintain code quality for long-term maintainability
- Performance: Automated performance testing ensures 60 FPS target
- Cross-Platform: Testing on multiple browsers automated

### Quality Standards
```typescript
const QUALITY_METRICS = {
    coverage: {
        minimum: 80,
        target: 90
    },
    performance: {
        maxBundleSize: 2048, // KB
        maxMemoryUsage: 512, // MB
        minFPS: 55
    },
    codeQuality: {
        maxComplexity: 10,
        maxLineLength: 100,
        maxFileLength: 300
    }
};
```

### Testing Requirements
- Game mechanics behavior validation
- Performance regression detection
- Save system integrity checks
- Asset loading verification
- Memory leak detection

## Testing Requirements

### Unit Tests
- `tests/unit/config/GameConfig.test.ts`: Configuration validation
- `tests/unit/systems/SaveSystem.test.ts`: Save/load functionality
- `tests/unit/mechanics/Energy.test.ts`: Game mechanic calculations

### Integration Tests
- `tests/e2e/gameplay.test.ts`: Full gameplay loop testing
- `tests/e2e/performance.test.ts`: FPS and memory monitoring
- `tests/e2e/crossbrowser.test.ts`: Multi-browser compatibility

### Manual Testing
- [ ] Git hooks prevent bad commits
- [ ] VS Code formatting works on save
- [ ] Tests run quickly and reliably
- [ ] Documentation generates correctly
- [ ] All scripts function as expected

## Dependencies

### Prerequisite Stories
- SETUP-001: Initial Project Configuration (must be completed)

### NPM Dependencies
- husky: ^10.0.0 - Git hooks management
- vitest: ^3.0.0 - Unit testing framework with v3 features
- @vitest/ui: ^3.0.0 - Test UI dashboard
- @vitest/coverage-v8: ^3.0.0 - Coverage reporting
- playwright: ^1.45.0 - Browser testing (latest 2025)
- eslint: ^10.0.0 - Code linting with flat config
- typescript-eslint: ^8.0.0 - TypeScript ESLint support
- prettier: ^5.0.0 - Code formatting
- eslint-plugin-prettier: ^5.1.0 - Prettier ESLint integration
- eslint-config-prettier: ^9.1.0 - Disable conflicting rules
- typedoc: ^0.26.0 - Documentation generation
- lint-staged: ^15.2.0 - Stage file linting

### Development Dependencies
- VS Code (recommended IDE)
- Node.js 22 LTS
- Git 2.40+

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Git hooks prevent commits with errors
- [ ] Testing framework catches regressions
- [ ] Code formatting is automatic and consistent
- [ ] Documentation generates from source
- [ ] Coverage thresholds enforced (80%+)
- [ ] All developer scripts documented
- [ ] VS Code properly configured
- [ ] Team onboarding guide updated
- [ ] No impact on development speed