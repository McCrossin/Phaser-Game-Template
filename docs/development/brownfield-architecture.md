# Phaser Game Template Architecture Document

## Introduction

This document captures the CURRENT STATE of the Phaser Game Template, including technical architecture, implementation patterns, and guidance for developers using this template. It serves as a reference for developers and AI agents working on game projects based on this template.

### Document Scope

**Template Status (August 15, 2025)**: Production-ready game development template with comprehensive tooling and testing infrastructure.

**Current State**: **Template Ready** - Complete TypeScript/Phaser 3 foundation with modern build tools, testing frameworks, and development workflow optimization.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| August 15, 2025 | 3.0 | **TEMPLATE RELEASE**: Finalized for public release. Documentation and project structure updated. | Mary (Business Analyst) |
| July 22, 2025 | 2.0 | **TEMPLATE VERSION**: Updated for generic template use with customization guidance | Maya (Game Developer) |
| July 21, 2025 | 1.6 | **DEVELOPMENT UPDATE**: Major implementation progress - TypeScript/ECS foundation, performance monitoring, testing infrastructure complete | Mary (Business Analyst) |
| July 18, 2025 | 1.5 | **MAJOR**: Completed brownfield full-stack workflow with implementation PRD and technical architecture | BMad Orchestrator |

### Documentation Change Tracking

**IMPORTANT**: This template includes comprehensive documentation change tracking through the centralized changelog system. When customizing for your game, maintain documentation changes in `docs/development/DOCUMENTATION_CHANGELOG.md` using standardized commit conventions.

**Changelog Location**: `docs/development/DOCUMENTATION_CHANGELOG.md`  
**Template Baseline**: August 15, 2025 (Production template ready for distribution)

**Template Customization Pattern**: When adapting this template, update all documentation to reflect your specific game requirements while maintaining the established structure and conventions.

## Quick Reference - Key Files and Entry Points

### Template Core Files

**Main Entry Points**:
- **Main Game**: `src/main.ts` - Primary game initialization and Phaser configuration
- **Game Configuration**: `src/config/` - Game settings and configuration
- **Scene Management**: `src/scenes/` - Scene implementations and management
- **HTML Container**: `index.html` - Game container and asset loading configuration

**Configuration Files**:
- **Project Config**: `project.config` - Template metadata and game settings
- **TypeScript Config**: `tsconfig.json` - TypeScript compilation settings
- **Vite Config**: `vite.config.ts` - Build system and development server configuration
- **Package Config**: `package.json` - Dependencies, scripts, and project metadata

**Template Documentation**:
- **README**: `README.md` - Quick start guide and template overview
- **Architecture**: `docs/development/brownfield-architecture.md` - This document

**Development Tools**:
- **Testing Config**: `testing/setup.ts` - Test environment configuration
- **Performance Config**: `config/ci-performance-thresholds.json` - Performance targets
- **CI/CD Pipeline**: `.github/workflows/` - Automated testing and deployment
- **Docker Setup**: `Dockerfile`, `docker-compose.yml` - Containerized development

**Asset and Build System**:
- **Asset Pipeline**: `vite-plugins/` - Custom asset processing and optimization
- **Demo Assets**: `assets/` - Example sprites and textures for template demonstration
- **Build Configuration**: Environment-specific build settings and deployment configs

## High Level Architecture

### Technical Summary

**Template Architecture**: Professional 2D game development template with Phaser 3, TypeScript, and modern tooling
**Target Performance**: 60 FPS on mid-range hardware with optimized asset pipeline and performance monitoring
**Deployment Ready**: CI/CD pipeline, automated testing, and production build optimization

**Template Features**:
- ✅ **TypeScript Strict Mode**: Complete type safety for robust game development
- ✅ **Modern Build System**: Vite with hot reload and optimized production builds
- ✅ **Testing Infrastructure**: Unit tests (Vitest), E2E tests (Playwright), performance monitoring
- ✅ **Asset Pipeline**: Automated texture packing, image optimization, and asset management
- ✅ **Development Tools**: ESLint, Prettier, Git hooks, and development workflow optimization
- ✅ **CI/CD Pipeline**: GitHub Actions with automated testing, linting, and deployment
- ✅ **Cross-Platform**: Desktop and mobile browser support with responsive design patterns

### Template Technology Stack

**Core Technologies**:
- **Phaser 3.70+**: Modern 2D game framework with WebGL and Canvas rendering
- **TypeScript 5.0+**: Type-safe JavaScript with modern ES features
- **Vite**: Fast development server and optimized production builds
- **Node.js 18+**: Modern JavaScript runtime and package management

**Development Tools**:
- **Vitest**: Modern testing framework with TypeScript support
- **Playwright**: End-to-end testing for cross-browser compatibility
- **ESLint**: Code quality and consistency enforcement
- **Prettier**: Code formatting and style consistency
- **Husky**: Git hooks for automated quality checks

**Build and Deployment**:
- **GitHub Actions**: Automated CI/CD pipeline
- **Docker**: Containerized deployment option
- **Nginx**: Production web server configuration
- **Performance Monitoring**: Built-in FPS tracking and performance analysis

### Implementation Stack Details

| Category | Technology | Version | Template Status |
|----------|------------|---------|-----------------|
| Runtime | Node.js + Browser | 18+ | Production ready |
| Framework | Phaser 3 | 3.88.2+ | Fully integrated |
| Language | TypeScript | 5.0+ | Strict mode enabled |
| Build System | Vite | 4.4+ | Hot reload + optimization |
| Testing | Vitest + Playwright | Latest | Complete test suite |
| Asset Pipeline | Custom Vite Plugins | Custom | Texture packing + optimization |
| Assets | **Optimized Pipeline** | **Production** | **IMPLEMENTED - Texture packing + image optimization** |
| Persistence | localStorage + JSON | - | Ready for implementation |
| Linting | **ESLint + TypeScript** | **Latest** | **IMPLEMENTED - Code quality enforcement** |
| Performance Monitoring | **Custom + Automated** | **Production** | **IMPLEMENTED - FPS counter + automated testing** |

**Development Infrastructure (Completed)**:
- **Package Manager**: npm with comprehensive script automation
- **Hot Reload**: Vite development server with instant updates
- **Type Safety**: TypeScript strict mode with comprehensive type definitions
- **CI/CD Ready**: Environment-aware testing with GitHub Actions compatibility
- **Asset Pipeline**: Automated texture packing and image optimization
- **Performance Validation**: Automated FPS and memory testing across environments

## Source Tree and Module Organization

### Project Structure

```text
Phaser-Game-Template/
├── src/                     # Template source code
│   ├── main.ts             # Primary game initialization and Phaser configuration
│   ├── scenes/             # Example scenes (e.g., BootScene, GameScene)
│   ├── ecs/                # Entity Component System core files
│   ├── systems/            # Example ECS systems
│   ├── gameObjects/        # Custom game object classes
│   ├── config/             # Game configuration files
│   ├── types/              # TypeScript type definitions
│   └── utils/              # Utility functions
├── assets/                  # Game assets (images, audio, etc.)
│   ├── source/             # Raw assets for processing
│   └── processed/          # Optimized assets for production
├── docs/                    # Project documentation
├── testing/                 # Test setup and configuration
├── tests/                   # Test files (unit, e-2-e, performance)
│   ├── unit/               # Unit tests (Vitest)
│   └── e2e/                # End-to-end tests (Playwright)
├── vite-plugins/            # Custom Vite plugins for asset processing
├── package.json             # Project dependencies and scripts
├── tsconfig.json            # TypeScript configuration
├── vite.config.ts           # Vite build system configuration
├── vitest.config.ts         # Vitest unit testing configuration
├── playwright.config.ts     # Playwright E2E testing configuration
└── index.html               # HTML container for the game
```

### Key Modules and Their Purpose

- **Game Bootstrap**: `src/main.ts` - Initializes the Phaser game instance, configures global settings, and registers scenes. This is the primary entry point of the application.
- **ECS Architecture**: `src/ecs/` - Provides a clean and scalable Entity Component System implementation for managing game state and logic.
- **Core Systems**: `src/systems/` - Contains example systems that operate on entities and their components (e.g., movement, rendering, input).
- **Game Components**: `src/components/` - Includes a set of reusable components that can be attached to entities to define their properties and behavior.
- **Scene Management**: `src/scenes/` - Organizes the game into different states or screens (e.g., Main Menu, Game Scene, Game Over) with clear separation of concerns.
- **Performance Monitoring**: `src/utils/SimpleFPSCounter.ts` - A utility for displaying an FPS counter in development builds, toggled by a key press.
- **Asset Management**: The `vite-plugins/` directory and Vite configuration provide a robust asset pipeline with texture packing, image optimization, and manifest generation.

## Data Models and APIs

### Data Models

- **ECS Entity System**: The core of the template's architecture, allowing for flexible and composable game objects built from entities and components.
- **TypeScript Type System**: Comprehensive type definitions in `src/types/` ensure code quality and provide excellent autocompletion and error checking during development.
- **Phaser 3 Game Configuration**: The main game configuration in `src/main.ts` sets up rendering (WebGL/Canvas), physics, input, and other core Phaser systems.

## Technical Considerations and Best Practices

### 1. Development vs Production Configuration
- **Status**: Well-managed with environment-aware configurations.
- **Implementation**: The template uses separate configurations and environment variables for development, testing, and production builds.
- **Guidance**: Leverage these configurations to enable/disable debugging tools, set performance thresholds, and manage environment-specific features.

### 2. Asset Pipeline
- **Status**: Production-ready with automated optimization.
- **Implementation**: The asset pipeline uses custom Vite plugins for texture packing, image optimization, and asset manifest generation.
- **Guidance**: Place raw assets in `assets/source/` and the build process will automatically optimize them and place them in `assets/processed/`.

### 3. Game State Persistence
- **Status**: Ready for implementation by the developer.
- **Guidance**: The template is designed to easily integrate a save/load system. A common approach is to serialize the state of the ECS world to JSON and store it in `localStorage`.

### 4. Performance Optimization
- **Current State**: The template is optimized for 60 FPS on mid-range hardware.
- **Monitoring**: Use the built-in FPS counter and automated performance tests to monitor performance.
- **Guidance**: For complex games, consider implementing advanced optimization patterns like object pooling for frequently created/destroyed entities.

## Integration Points and External Dependencies

### Current Dependencies

| Service | Purpose | Integration Type | Current Status |
|---------|---------|------------------|----------------|
| Phaser 3 | Game Framework | NPM Package | **v3.88.2+ - Production integrated** |
| TypeScript | Type Safety | Build Pipeline | **v5.0+ - Implemented with strict mode** |
| Vite | Build System | Development/Production | **v4.4+ - Active development server** |
| Vitest | Unit Testing | Testing Pipeline | **Implemented - Unit test framework** |
| Playwright | E2E Testing | Testing Pipeline | **Implemented - Browser automation** |
| Node.js | Runtime | Development | **v18+ - Required for build system** |
| ESLint | Code Quality | Development | **Implemented - TypeScript linting** |
| Browser APIs | Local Storage | Direct API | **Ready for save system implementation** |
| Canvas/WebGL | Rendering | Phaser abstraction | **Hardware acceleration active** |

### Development Tool Dependencies

| Tool | Purpose | Status | Notes |
|------|---------|--------|-------|
| BMad Framework | AI Development | Active | Agent-based development workflow |
| VS Code | IDE | Active | Primary development environment |
| Git | Version Control | Active | Repository hosted on GitHub |

## Development and Deployment

### Development Setup

```bash
# 1. Clone repository
git clone <repository-url>
cd "Phaser-Game-Template"

# 2. Install dependencies
npm install

# 3. Start development server (Vite + TypeScript + Hot reload)
npm run dev

# 4. Open browser (auto-opens to http://localhost:3000)
# Game loads with TypeScript compilation and ECS architecture

# 5. Development tools available:
# - Press F3 in-game for FPS monitoring
# - TypeScript errors shown in real-time
# - Hot reload for instant code updates
# - ESLint for code quality checking
```

**Development Features**:
- ✅ **Hot Reload**: Instant updates with state preservation
- ✅ **Type Safety**: TypeScript compilation with strict mode
- ✅ **Performance Monitoring**: Built-in FPS counter (F3 toggle)
- ✅ **Code Quality**: ESLint integration with TypeScript rules
- ✅ **Asset Pipeline**: Automatic texture packing and optimization
- ✅ **Testing**: Unit tests (Vitest) and E2E tests (Playwright) ready to run

### Development Workflow Scripts

```bash
# Development commands
npm run dev         # Start development server with hot reload
npm run build       # Production build with TypeScript compilation
npm run preview     # Preview production build locally

# Code quality and validation
npm run typecheck   # TypeScript type checking
npm run lint        # ESLint code linting  
npm run lint:fix    # Auto-fix linting issues
npm run format      # Prettier code formatting

# Testing infrastructure
npm run test        # Run unit test suite (Vitest)
npm run test:e2e    # Run end-to-end tests (Playwright)
npm run test:performance # Run performance validation tests

# Development tools
npm run docs        # Generate TypeScript documentation
npm run validate    # Full validation pipeline (type + lint + test)
```

## Testing Strategy

### Included Testing Infrastructure

**Unit Testing (Vitest)**:
- ✅ **Framework**: Vitest with TypeScript support.
- ✅ **Coverage**: Code coverage reporting implemented.
- ✅ **Integration**: Hot reload testing during development.
- ✅ **Configuration**: `vitest.config.ts` with path aliases and TypeScript integration.

**End-to-End Testing (Playwright)**:
- ✅ **Multi-Browser**: Chrome, Firefox, Safari, Mobile Chrome, Mobile Safari.
- ✅ **Performance Testing**: Dedicated performance test suite with environment awareness.
- ✅ **CI/CD Ready**: Environment-specific configurations for GitHub Actions.
- ✅ **Test Coverage**: FPS monitoring, load times, memory usage, microfreeze detection.

**Performance Testing (Production Quality)**:
- ✅ **Automated FPS Testing**: Environment-aware thresholds (CI vs Local).
- ✅ **Memory Leak Detection**: Automated memory growth monitoring.
- ✅ **Load Time Validation**: Startup performance measurement.
- ✅ **Microfreeze Detection**: UI thread blocking detection.
- ✅ **Bundle Size Monitoring**: Asset size validation.

**Test Execution**:
```bash
npm run test              # Unit tests with Vitest
npm run test:e2e         # End-to-end tests with Playwright  
npm run test:performance # Performance validation
npm run test:coverage    # Code coverage reporting
npm run validate         # Full testing pipeline
```

### Recommended Testing Strategy

As you build your game, expand the testing suite to cover your custom logic:

**Unit Testing**:
- Write unit tests for complex systems and utility functions.
- Validate game logic, calculations, and state transitions.
- Ensure the integrity of data models, such as save/load formats.

**Integration Testing**:
- Test the interaction between different systems (e.g., input, physics, rendering).
- Validate scene transitions and the flow of the game.
- Benchmark performance to ensure you maintain your FPS targets.

**User Experience Testing**:
- Write E2E tests for critical user flows (e.g., completing the tutorial, crafting an item).
- Verify cross-platform compatibility and responsive design.

## AI Development Agent Guidelines

### Documentation Change Management

**CRITICAL**: All AI agents working on this project MUST maintain documentation change tracking:

1. **Update Documentation Changelog**: Every documentation modification must be recorded in `DOCUMENTATION_CHANGELOG.md`
2. **Use Standardized Commit Messages**: Follow the established format: `[CATEGORY] ACTION: Brief description`
3. **Maintain Line Counts**: Include accurate line counts for modified documents
4. **Cross-Reference Validation**: Ensure changes are consistent across related documents

**Example Commit Message Format**:
```
[DOCS] UPDATE: Added new section for audio system architecture.
[TECH] NEW: Performance optimization guidelines for 60 FPS target.
```

**Categories**: [DESIGN], [TECH], [DOCS], [PLANNING], [TESTING], [CI]
**Actions**: NEW, ADD, UPDATE, FIX, REMOVE, RESTRUCTURE

### Documentation-First Development

**Primary Sources**: The `docs` folder is the source of truth for the template's architecture and intended usage patterns.
- ✅ `docs/development/brownfield-architecture.md` - This document.
- ✅ `README.md` - High-level overview and setup instructions.

**Implementation Approach**:
1. ✅ **Foundation Architecture**: The TypeScript/ECS foundation provides a robust starting point.
2. ✅ **Performance-First**: Maintain the 60 FPS target by leveraging the automated testing infrastructure.
3. ✅ **Type Safety**: Adhere to TypeScript strict mode to prevent runtime errors.
4. ✅ **Development Quality**: Use the provided ESLint and Prettier configurations to maintain code standards.

### Code Quality Standards

**TypeScript Requirements (Enforced)**:
- ✅ **Strict mode enabled**: `tsconfig.json` is configured with strict TypeScript settings.
- ✅ **Explicit type annotations**: All functions should have proper TypeScript typing.
- ✅ **Interface definitions**: Define game entities and data structures with comprehensive interfaces.
- ✅ **No `any` types**: ESLint rules prevent `any` usage.

**Performance Requirements (Validated)**:
- ✅ **60 FPS maintenance**: Automated performance testing validates frame rate.
- ✅ **Environment-aware optimization**: Testing accommodates CI vs local performance differences.
- ✅ **Memory management**: Automated memory leak detection is included in the testing pipeline.
- ✅ **Bundle size monitoring**: Asset size validation prevents bloat.

**Architecture Patterns (Implemented)**:
- ✅ **ECS (Entity Component System)**: A complete implementation for a modular game architecture.
- ✅ **Component-based design**: Build complex game objects by composing simple components.
- ✅ **Event-driven communication**: Systems can communicate through an event bus or by observing component changes.
- ✅ **Modular scene management**: TypeScript scenes provide clean separation for different parts of the game.
- ✅ **Separation of concerns**: Game logic, presentation, and data are cleanly separated.

**Development Standards (Enforced)**:
- ✅ **ESLint + TypeScript**: Code quality enforcement with real-time validation.
- ✅ **Automated testing**: Unit, E2E, and performance testing prevent regressions.
- ✅ **Hot reload development**: Instant feedback during development with state preservation.
- ✅ **Asset pipeline automation**: Texture packing and optimization are handled automatically.

## Appendix - Useful Commands and Quick Reference

### Development Commands

**Active Development Workflow (August 15, 2025)**:
```bash
# Development server (Implemented - Vite + TypeScript + Hot Reload)
npm run dev               # Start development server (http://localhost:3000)
npm run build            # Production build with optimization
npm run preview          # Preview production build locally

# Code quality and validation (Implemented)
npm run typecheck        # TypeScript type validation
npm run lint             # ESLint code quality checks
npm run lint:fix         # Auto-fix linting issues
npm run format           # Prettier code formatting
npm run format:check     # Check code formatting

# Testing infrastructure (Implemented)
npm run test             # Unit tests (Vitest)
npm run test:run         # Run tests once (CI mode)
npm run test:ui          # Visual test runner UI
npm run test:coverage    # Code coverage reporting
npm run test:e2e         # End-to-end tests (Playwright)
npm run test:performance # Performance validation tests

# Development tools (Implemented)
npm run docs             # Generate TypeScript documentation
npm run validate         # Full validation pipeline (type + lint + test)
npm run prepare          # Git hooks setup (Husky)
```

**Development Features Available**:
- ✅ **In-Game Performance Monitoring**: Press F3 to toggle FPS counter
- ✅ **Real-time Type Checking**: TypeScript errors shown immediately
- ✅ **Hot Module Replacement**: Code changes reflected instantly
- ✅ **Asset Pipeline**: Automatic texture packing and optimization
- ✅ **Multi-Environment Testing**: CI/local environment awareness
