# Phaser Game Template Architecture Document

## Introduction

This document captures the CURRENT STATE of the Phaser Game Template, including technical architecture, implementation patterns, and guidance for developers using this template. It serves as a reference for developers and AI agents working on game projects based on this template.

### Document Scope

**Template Status (August 15, 2025)**: Release-ready game development template with comprehensive tooling and testing infrastructure.

**Current State**: **Release Ready** - Complete TypeScript/Phaser 3 foundation with modern build tools, testing frameworks, and development workflow optimization.

### Change Log

| Date | Version | Description | Author |
|------|---------|-------------|--------|
| August 15, 2025 | 2.1 | **RELEASE PREP**: Align docs with repository, paths, and versions; removed non-template content | Mary (Business Analyst) |
| July 22, 2025 | 2.0 | **TEMPLATE VERSION**: Updated for generic template use with customization guidance | Maya (Game Developer) |
| July 21, 2025 | 1.6 | **DEVELOPMENT UPDATE**: Major implementation progress - TypeScript/ECS foundation, performance monitoring, testing infrastructure complete | Mary (Business Analyst) |
| July 18, 2025 | 1.5 | **MAJOR**: Completed brownfield full-stack workflow with implementation PRD and technical architecture | BMad Orchestrator |

### Documentation Change Tracking

**IMPORTANT**: This template includes comprehensive documentation change tracking through the centralized changelog system. When customizing for your game, maintain documentation changes in `docs/development/DOCUMENTATION_CHANGELOG.md` using standardized commit conventions.

**Changelog Location**: `docs/development/DOCUMENTATION_CHANGELOG.md`
**Template Baseline**: July 22, 2025 (Production template ready for distribution)

**Template Customization Pattern**: When adapting this template, update all documentation to reflect your specific game requirements while maintaining the established structure and conventions.

## Quick Reference - Key Files and Entry Points

### Template Core Files

**Main Entry Points**:
- **Main Game**: `src/main.ts` — Primary game initialization and Phaser configuration
- **Game Configuration**: `src/config/GameConfig.ts` — Game settings and configuration (plus `src/config/game.config.ts` helper)
- **Scene Management**: `src/scenes/` — Scene implementations and management
- **HTML Container**: `index.html` — Game container and asset loading configuration

**Configuration Files**:
- **Project Config**: `project.config`
- **TypeScript Configs**: `config/build/tsconfig.json` (dev/typecheck), `config/build/tsconfig.build.json` (build)
- **Vite Config**: `config/build/vite.config.ts`
- **Typedoc Config**: `config/build/typedoc.json`
- **ESLint Config**: `config/development/eslint.config.mjs`
- **Performance Thresholds**: `config/ci-performance-thresholds.json`
- **Monitoring Config**: `config/monitoring/game-performance.json`
- **Package Config**: `package.json`

**Template Documentation**:
- **README**: `README.md` — Quick start guide and template overview
- **Architecture**: `docs/development/brownfield-architecture.md` — This document
- **Project Structure**: `docs/development/project-structure.md`
- **Developers**: `docs/developers/` — Getting started, coding standards, architecture overview
- **Features**: `docs/features/` — Build system, CI/CD, performance tools
- **Setup**: `docs/setup/` — Requirements, quick start, troubleshooting

**Development Tools**:
- **Testing Config**: `testing/core/setup.ts` — Test environment configuration
- **Vitest/Playwright Configs**: `testing/core/config/`
- **Performance Targets**: `config/ci-performance-thresholds.json`
- **Performance Monitoring**: `config/monitoring/game-performance.json`
- **CI/CD Pipeline**: `.github/workflows/`
- **Docker Setup**: `Dockerfile`, `docker-compose.yml`, `nginx.conf`

**Asset and Build System**:
- **Asset Pipeline**: `vite-plugins/` — Custom asset processing and optimization
- **Assets**: `assets/processed/` and `assets/source/` — Example sprites, atlases, and UI textures
- **Build Configuration**: `config/build/` — Build, tsconfig, typedoc, and processed example atlases

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
- **Phaser 3.88.2**: Modern 2D game framework with WebGL and Canvas rendering
- **TypeScript 5.6**: Type-safe JavaScript with modern ES features
- **Vite 7.x**: Fast development server and optimized production builds
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
| Framework | Phaser 3 | 3.88.2 | Fully integrated |
| Language | TypeScript | 5.6 | Strict mode enabled |
| Build System | Vite | 7.x | Hot reload + optimization |
| Testing | Vitest + Playwright | 3.x + 1.45 | Complete test suite |
| Asset Pipeline | Custom Vite Plugins | Custom | Texture packing + optimization |
| Assets | Optimized Pipeline | Production | Implemented - texture packing + image optimization |
| Persistence | Planned | - | localStorage + JSON (lz-string compression) |
| Linting | ESLint + TypeScript | Latest | Implemented - code quality enforcement |
| Performance Monitoring | Custom + Automated | Production | Implemented - FPS counter + automated testing |

**Development Infrastructure (Completed)**:
- **Package Manager**: npm with comprehensive script automation
- **Hot Reload**: Vite development server with instant updates
- **Type Safety**: TypeScript strict mode with comprehensive type definitions
- **CI/CD Ready**: Environment-aware testing with GitHub Actions compatibility
- **Asset Pipeline**: Automated texture packing and image optimization
- **Performance Validation**: Automated FPS and memory testing across environments

### Repository Structure Summary

- **Type**: Single repository
- **Package Manager**: npm (`package.json` present)
- **CI/CD**: `.github/workflows` (not shown above)
- **Docs**: `docs/` with developer, features, setup, and templates sections

## Source Tree and Module Organization

### Project Structure (Release - August 15, 2025)

```text
Phaser-Game-Template/
├── src/                         # TypeScript source code
│   ├── main.ts                  # Game initialization with Phaser
│   ├── ecs/                     # ECS architecture
│   │   ├── Component.ts
│   │   ├── Entity.ts
│   │   ├── EntityManager.ts
│   │   ├── System.ts
│   │   └── World.ts
│   ├── scenes/                  # Scenes
│   │   ├── StartScene.ts
│   │   └── GameScene.ts
│   ├── systems/                 # Game systems
│   │   ├── AssetLoader.ts
│   │   ├── CoreSystems.ts
│   │   └── SaveGameManager.ts   # Persistence scaffold
│   ├── gameObjects/             # Core components (template)
│   │   └── CoreComponents.ts
│   ├── config/                  # Game configuration
│   │   ├── GameConfig.ts
│   │   ├── AssetConfig.ts
│   │   ├── DebugConfig.ts
│   │   └── game.config.ts
│   ├── types/                   # Types and globals
│   │   ├── AssetTypes.ts
│   │   ├── BuildTypes.ts
│   │   ├── GameTypes.ts
│   │   ├── global.d.ts
│   │   └── template-structure.ts
│   ├── utils/                   # Utilities
│   │   ├── AsyncGameLoader.ts
│   │   ├── Constants.ts
│   │   ├── SimpleFPSCounter.ts
│   │   └── Utils.ts
│   └── scripts/                 # Dev/perf tooling (TS)
│       ├── performance-check.ts
│       ├── performance-check-js-backup.js
│       ├── deploy-simple.sh
│       ├── ci-environment-setup.sh
│       └── test-performance-analyzer.ts
├── testing/                     # Test infrastructure
│   ├── core/
│   │   ├── config/              # Vitest/Playwright configs
│   │   ├── fixtures/
│   │   ├── helpers/
│   │   ├── integration/
│   │   └── unit/
│   └── advanced/
│       └── e2e/                 # Advanced E2E & performance
├── vite-plugins/                # Custom Vite plugins
│   ├── asset-manifest.ts
│   ├── audio-processor.ts
│   ├── image-optimizer.ts
│   └── texture-packer.ts
├── assets/
│   ├── processed/               # Optimized assets (atlas/sprites/ui)
│   │   ├── asset-manifest.json
│   │   ├── atlases/
│   │   ├── sprites/
│   │   └── ui/
│   └── source/                  # Source assets
│       ├── sprites/
│       └── ui/
├── config/
│   ├── build/                   # Build & TS config
│   │   ├── assets/processed/atlases/ (examples)
│   │   ├── optimization.config.ts
│   │   ├── tsconfig.json
│   │   ├── tsconfig.build.json
│   │   ├── typedoc.json
│   │   └── vite.config.ts
│   ├── deployment/
│   │   ├── config.ts
│   │   └── simple/
│   ├── development/
│   │   └── eslint.config.mjs
│   ├── monitoring/
│   │   └── game-performance.json
│   └── ci-performance-thresholds.json
├── tools/
│   ├── build/
│   ├── development/
│   ├── maintenance/
│   └── monitoring/
├── testing (see above)          # Detailed in Testing section
├── docs/                        # Documentation (developers, features, setup, templates)
├── .github/                     # CI workflows
├── Dockerfile, docker-compose.yml, nginx.conf
├── index.html
├── package.json, package-lock.json
├── project.config
├── dist/ (build output)
└── vite-plugins/ (see above)
```

### Key Modules and Their Purpose

**Current Template Implementation (August 15, 2025)**:
- **Game Bootstrap**: `src/main.ts` - TypeScript Phaser 3 initialization with ECS world setup and configuration management
- **ECS Architecture**: `src/ecs/World.ts` - Complete Entity Component System coordinating game state
- **Core Systems**: `src/systems/CoreSystems.ts` - Template systems including:
  - Movement System (probe physics and collision)
  - Input System (WASD controls, mouse interaction)
  - Rendering System (sprite management and visual updates)
  - Energy System (power generation and consumption)
  - Debug System (development tools and performance monitoring)
- **Game Components**: `src/gameObjects/CoreComponents.ts` - Fundamental ECS components:
  - Position Component (spatial coordinates)
  - Velocity Component (movement physics)
  - Sprite Component (visual representation)
  - Input Component (control state)
  - Probe Component (probe-specific data)
  - Inventory Component (resource management)
- **Scene Management**: `src/scenes/` - TypeScript scenes with ECS integration:
  - StartScene.ts (main menu with animated background)
  - GameScene.ts (core gameplay with ECS systems)
- **Performance Monitoring**: `src/utils/SimpleFPSCounter.ts` - Development FPS monitoring with F3 toggle
- **Asset Management**: Vite-based asset pipeline with texture packing and optimization
- **Persistence Scaffold**: `src/systems/SaveGameManager.ts` — save/load manager scaffold
- **Asset Loading**: `src/systems/AssetLoader.ts` and `src/utils/AsyncGameLoader.ts`

**Planned Production Modules** (from design docs):
- **Equipment System**: 4-slot modular equipment with drag-and-drop UI
- **Resource Management**: 118-element periodic table with discovery mechanics
- **Energy System**: Solar panel placement, power consumption/generation balance
- **World Generation**: Procedural planet generation with environmental challenges
- **Save/Load System**: Comprehensive game state persistence
- **Manufacturing**: 3D printer fabrication with material requirements
- **Tutorial System**: Progressive complexity introduction (45-60 minute flow)

## Data Models and APIs

### Current Data Models

**Template Implementation State (August 15, 2025)**:
- **ECS Entity System**: Complete entity management with component composition
- **TypeScript Type System**: Comprehensive type definitions in `src/types/GameTypes.ts`:
  - GameConfig interface with world dimensions and performance settings
  - Component interfaces for Position, Velocity, Sprite, Input, Probe data
  - System base classes and entity management types
- **Phaser 3 Game Configuration**: Production game setup with:
  - Physics system configuration (Arcade physics, zero gravity)
  - Rendering configuration (WebGL, scaling, resolution)
  - Input system setup (keyboard, mouse, touch support)
  - Asset loading and management
- **Performance Configuration**: FPS monitoring, update intervals, and optimization settings

### Planned Data Architecture (from design docs)

**Core Game Entities**:
- **Probe**: Player-controlled unit with 4 equipment slots
- **Equipment**: Modular tools (scanners, mining lasers, solar panels, etc.)
- **Resources**: 118 chemical elements with discovery states and properties
- **World**: Procedurally generated planets with biomes and challenges
- **Manufacturing**: Recipes, materials, and fabrication queues

**API Notes (Template)**:
- Save/Load: `src/systems/SaveGameManager.ts` scaffold for localStorage JSON saves
- Assets: Manifest generated via `vite-plugins/asset-manifest.ts`

**Data Persistence**:
- **Format**: JSON serialization to localStorage
- **Compression**: lz-string
- **Validation**: Add schema validation as needed in your project

## Technical Debt and Known Issues

### Current Implementation Debt

**Resolved Technical Items**:
- ✅ **Production TypeScript Architecture**: Complete rewrite from prototype to production TypeScript
- ✅ **Build System Implementation**: Vite build system with hot reload and optimization implemented
- ✅ **Type Safety**: TypeScript strict mode with comprehensive type definitions implemented
- ✅ **Performance Monitoring**: FPS counter and automated performance testing implemented
- ✅ **Testing Infrastructure**: Unit testing (Vitest) and E2E testing (Playwright) implemented

**Current Technical Considerations**:

**1. Development vs Production Configuration**:
   - **Status**: Well-managed with environment-aware configurations
   - **Implementation**: Separate configurations for development, testing, and production environments
   - **Strengths**: Environment-specific performance thresholds, CI/CD compatibility, local development optimization

**2. Asset Pipeline Maturity**:
   - **Status**: Production-ready with automated optimization
   - **Implementation**: Texture packing, image optimization, asset manifest generation
   - **Future Enhancement**: Audio processing pipeline (planned for audio implementation phase)

**3. Game State Persistence**:
   - **Status**: Planned but not yet implemented (by design)
   - **Approach**: localStorage + JSON with LZ4 compression (documented in save system design)
   - **Priority**: Medium - will be implemented during core game loop development

**4. Performance Optimization Opportunities**:
   - **Current State**: 60 FPS maintained in current implementation
   - **Monitoring**: Automated testing validates performance across environments
   - **Future**: Object pooling and advanced optimization patterns ready for implementation

### Template Documentation Status

- ✅ Architecture, build, testing, and monitoring docs included in `docs/`
- ✅ Clear developer onboarding in `docs/developers/`
- ✅ Project structure documented in `docs/development/project-structure.md`

## Next Steps and Development Priorities

### Using This Template Next

- Start from `src/main.ts`, add or replace scenes in `src/scenes/`
- Extend ECS via `src/ecs/` and systems in `src/systems/`
- Manage assets via `assets/source/` (processed into `assets/processed/`)
- Customize build via `config/build/vite.config.ts`

### Technical Infrastructure Status (Updated: July 21, 2025)

**COMPLETED INFRASTRUCTURE** ✅:
- ✅ Production TypeScript development environment with strict mode
- ✅ Vite build system with hot reload and asset optimization  
- ✅ Comprehensive testing infrastructure (Vitest + Playwright)
- ✅ Performance monitoring system with environment-aware thresholds
- ✅ Code quality automation (ESLint + Prettier + Husky hooks)
- ✅ CI/CD pipeline with automated testing and deployment
- ✅ ECS architecture foundation with core system implementations
- ✅ Phaser 3 integration with TypeScript and modern development patterns

**ACTIVE DEVELOPMENT PRIORITIES** 🔄:
- **Core Game Loop**: Implementing probe movement, energy consumption, and resource gathering
- **System Integration**: Connecting ECS components for complete gameplay experiences  
- **Performance Optimization**: Object pooling and memory management for entity systems
- **Error Handling**: Comprehensive error boundaries and graceful failure recovery

**OPTIONAL ENHANCEMENTS** 📋:
- Advanced asset pipeline (audio processing, dynamic loading)
- Mobile optimization (touch controls, responsive design)
- Accessibility features (keyboard navigation, captions)

### Risk Assessment and Mitigation (Updated: July 21, 2025)

**RESOLVED RISKS** ✅:
- ✅ **Technical Foundation**: Production-ready development environment eliminates technology risks
- ✅ **Performance Concerns**: 60+ FPS performance validated across development and CI environments  
- ✅ **Code Quality**: Automated linting, testing, and type checking prevent regression issues
- ✅ **Development Velocity**: Hot reload and TypeScript tooling maximize development efficiency

**CURRENT RISK PROFILE: LOW** ✅
- **Architecture Foundation**: Solid ECS patterns provide scalable foundation for game complexity
- **Testing Coverage**: Comprehensive test infrastructure ensures stable feature development
- **Performance Baseline**: Established monitoring provides early warning for performance regressions
- **Documentation Alignment**: Implementation closely follows detailed design specifications

**MONITORED CONSIDERATIONS** 🔍:
- **Feature Scope Management**: Rich game design requires disciplined prioritization to maintain MVP focus
- **Asset Loading Performance**: Monitor asset bundle sizes as content library grows
- **Cross-Browser Compatibility**: Validate game performance across different browser engines
- **Mobile Device Performance**: Ensure acceptable performance on lower-powered mobile devices

### Development Readiness Summary

**CURRENT STATE: PRODUCTION-READY ACTIVE DEVELOPMENT** ✅
- Foundation infrastructure complete with production-quality tooling
- Core ECS architecture implemented and validated through testing
- Development velocity optimized with modern TypeScript tooling and hot reload
- Performance targets achieved and continuously monitored
- Clear development roadmap with realistic timeline estimation

**NEXT MILESTONE**: Customize scenes/systems and integrate your assets; run tests and performance checks.

## Integration Points and External Dependencies

### Current Dependencies

| Service | Purpose | Integration Type | Current Status |
|---------|---------|------------------|----------------|
| Phaser 3 | Game Framework | NPM Package | **v3.88.2 - Integrated** |
| TypeScript | Type Safety | Build Pipeline | **v5.6 - Strict mode** |
| Vite | Build System | Development/Production | **v7.x - Dev server + build** |
| Vitest | Unit Testing | Testing Pipeline | **Implemented - Unit test framework** |
| Playwright | E2E Testing | Testing Pipeline | **Implemented - Browser automation** |
| Node.js | Runtime | Development | **v18+ - Required for build system** |
| ESLint | Code Quality | Development | **Implemented - TypeScript linting** |
| Browser APIs | Local Storage | Direct API | **Ready for save system implementation** |
| Canvas/WebGL | Rendering | Phaser abstraction | **Hardware acceleration active** |

### Optional Integrations

| Service | Purpose | Integration Type | Notes |
|---------|---------|------------------|------|
| Web Audio API | Sound | Phaser wrapper | Music and sound effects |
| Touch APIs | Mobile Support | Phaser input | Cross-platform compatibility |

### Development Tool Dependencies

| Tool | Purpose | Status | Notes |
|------|---------|--------|-------|
| BMad Framework | AI Development | Active | Agent-based development workflow |
| VS Code | IDE | Active | Primary development environment |
| Git | Version Control | Active | Repository hosted on GitHub |

## Development and Deployment

### Current Development Setup

**Development Environment (Release - August 2025)**:
```bash
# Install dependencies
npm install

# Start development server (Vite + TypeScript + HMR)
npm run dev

# Build for production
npm run build

# Preview production build locally
npm run preview
```

**Development Features**:
- ✅ **Hot Reload**: Instant updates with state preservation
- ✅ **Type Safety**: TypeScript compilation with strict mode
- ✅ **Performance Monitoring**: Built-in FPS counter (F3 toggle)
- ✅ **Code Quality**: ESLint integration with TypeScript rules
- ✅ **Asset Pipeline**: Automatic texture packing and optimization
- ✅ **Testing**: Unit tests (Vitest) and E2E tests (Playwright) ready to run

### Production Development Setup (Implemented)

**Current Development Workflow**:
```bash
npm run dev                 # Vite dev server (config/build/vite.config.ts)
npm run build               # tsc + vite build
npm run preview             # Serve dist on port 4173

# Code quality
npm run typecheck           # tsc --noEmit (config/build/tsconfig.json)
npm run lint                # ESLint (config/development/eslint.config.mjs)
npm run lint:fix
npm run format              # Prettier write
npm run format:check        # Prettier check

# Testing
npm run test                # Vitest (CI mode)
npm run test:ui             # Vitest UI
npm run test:e2e            # Playwright
npm run test:performance    # Performance validation

# Docs and validation
npm run docs                # TypeDoc
npm run validate            # Typecheck + lint + unit tests
```

**Deployment Pipeline**:
```bash
npm run build:info          # Generate build information
npm run deploy:staging      # Deploy to staging environment
npm run deploy:production   # Deploy to production
npm run rollback            # Rollback functionality
npm run performance:check   # Performance validation (src/scripts)
```

## Testing Strategy

### Current Testing State

**Comprehensive Testing Infrastructure (Implemented)**:

**Unit Testing (Vitest)**:
- ✅ **Framework**: Vitest with TypeScript support
- ✅ **Coverage**: Code coverage reporting implemented
- ✅ **Integration**: Hot reload testing during development
- ✅ **Configuration**: `vitest.config.ts` with path aliases and TypeScript integration

**End-to-End Testing (Playwright)**:
- ✅ **Multi-Browser**: Chromium, Firefox, WebKit
- ✅ **Performance Testing**: Dedicated performance test suite with environment awareness
- ✅ **CI/CD Ready**: Environment-specific configurations for GitHub Actions
- ✅ **Test Coverage**: FPS monitoring, load times, memory usage, microfreeze detection

**Performance Testing (Production Quality)**:
- ✅ **Automated FPS Testing**: Environment-aware thresholds (CI vs Local)
- ✅ **Memory Leak Detection**: Automated memory growth monitoring
- ✅ **Load Time Validation**: Startup performance measurement
- ✅ **Microfreeze Detection**: UI thread blocking detection
- ✅ **Bundle Size Monitoring**: Asset size validation

**Test Execution**:
```bash
npm run test              # Unit tests with Vitest
npm run test:e2e          # End-to-end tests with Playwright  
npm run test:performance  # Performance validation
npm run test:coverage     # Code coverage reporting
npm run validate          # Full testing pipeline
```

### Planned Testing Architecture

**Unit Testing**:
- Jest or Vitest for TypeScript unit tests
- Equipment system logic validation
- Resource calculation accuracy
- Save/load data integrity

**Integration Testing**:
- Scene transition testing
- Equipment swapping workflow validation
- Performance benchmarking (60 FPS target)

**User Experience Testing**:
- Tutorial completion rate validation
- Player progression flow testing
- Cross-platform compatibility verification

## Development Roadmap Integration

### MVP Timeline (from implementation priority matrix)

**UPDATED - Active Development Status (July 21, 2025)**:

**✅ Phase 0: Foundation Systems (Weeks 1-4) - COMPLETE**
- ✅ Production build system (TypeScript + Vite)
- ✅ ECS architecture implementation
- ✅ Performance monitoring infrastructure
- ✅ Testing framework (unit + E2E + performance)
- ✅ Development tooling and asset pipeline

**🚧 Phase 1: Core Game Loop (Weeks 5-8) - IN PROGRESS**
- 🔄 Basic probe movement and input handling (ECS foundation complete)
- 📋 Solar panel placement and energy system (planned)
- 📋 Simple mining and resource collection (planned)
- 📋 3D printer fabrication basics (planned)
- 📋 Core save/load functionality (planned)

**📋 Phase 2: Equipment & Progression (Weeks 9-12) - PLANNED**
- 📋 4-slot equipment bay system
- 📋 Equipment swapping with drag-and-drop UI
- 📋 Scanner operations and resource detection
- 📋 Tutorial flow implementation

**📋 Phase 3: Core Loop Completion (Weeks 13-16) - PLANNED**
- 📋 Advanced manufacturing chains
- 📋 World generation and biome system
- 📋 Equipment specialization and progression
- 📋 Performance optimization and polish

**Current Development Status**: Foundation phase complete, transitioning to core game loop implementation. ECS architecture provides solid foundation for rapid feature development.

### Success Metrics

**Technical Metrics (Validated Through Implementation)**:
- ✅ **60 FPS performance**: Automated testing validates performance across environments
- ✅ **Development Efficiency**: Hot reload, TypeScript safety, comprehensive tooling implemented
- ✅ **Code Quality**: ESLint + TypeScript strict mode enforcing quality standards
- ✅ **CI/CD Readiness**: Environment-aware testing pipeline for GitHub Actions
- 📋 **Save/load operations under 2 seconds**: Planned for implementation (Week 5-8)
- 📋 **Tutorial completion rate >85%**: Planned for user testing phase
- 📋 **Cross-platform compatibility**: Desktop validated, mobile testing planned

**Development Metrics (Current Achievements)**:
- ✅ **Foundation Phase**: 100% complete (Stories 1.1-1.5)
- ✅ **Architecture Quality**: ECS patterns implemented with TypeScript safety
- ✅ **Performance Monitoring**: Automated performance validation across environments
- ✅ **Documentation Quality**: Comprehensive technical documentation maintained
- 📊 **Development Velocity**: Foundation phase accelerated development readiness

**Player Experience Metrics (Ready for Testing)**:
- 📋 First replication achieved within 4 hours of gameplay (pending core game loop)
- 📋 Equipment swapping feels intuitive and strategic (UI implementation pending)
- 📋 Resource discovery provides satisfying progression (game systems pending)

## AI Development Agent Guidelines (for this template)

### Documentation Change Management

**CRITICAL**: All AI agents working on this project MUST maintain documentation change tracking:

1. **Update Documentation Changelog**: Every documentation modification must be recorded in `DOCUMENTATION_CHANGELOG.md`
2. **Use Standardized Commit Messages**: Follow the established format: `[CATEGORY] ACTION: Brief description`
3. **Maintain Line Counts**: Include accurate line counts for modified documents
4. **Cross-Reference Validation**: Ensure changes are consistent across related documents

**Example Commit Message Format**:
```
[DESIGN] UPDATE: Equipment swapping mechanics - added specialization requirements
[TECH] NEW: Performance optimization guidelines for 60 FPS target
[RESEARCH] ADD: Additional user research findings on progression flow
```

**Categories**: [DESIGN], [TECH], [RESEARCH], [PLANNING], [INTERFACE], [REPORTS], [STORIES]  
**Actions**: NEW, ADD, UPDATE, FIX, REMOVE, RESTRUCTURE

### Documentation-First Development

**UPDATED: Implementation-Ready Development (July 21, 2025)**

**Primary Sources**:
- `docs/developers/*` — Getting started, coding standards, architecture overview
- `docs/features/*` — Build system, CI/CD, monitoring
- `docs/development/*` — Architecture and project structure

**Implementation Approach (Current Practice)**:
1. ✅ **Foundation Architecture**: TypeScript/ECS foundation implemented following documented patterns
2. 🔄 **Core Systems Development**: Following priority matrix for core game loop implementation  
3. ✅ **Performance-First**: 60 FPS target maintained through automated testing
4. ✅ **Type Safety**: TypeScript strict mode preventing runtime errors
5. ✅ **Development Quality**: ESLint + automated testing maintaining code standards

This is a general-purpose template. Customize scenes, systems, and assets to your project’s needs.

### Code Quality Standards

**TypeScript Requirements (Implemented)**:
- ✅ **Strict mode enabled**: `tsconfig.json` configured with strict TypeScript settings
- ✅ **Explicit type annotations**: All functions have proper TypeScript typing
- ✅ **Interface definitions**: Game entities defined with comprehensive interfaces
- ✅ **No `any` types in production**: ESLint rules prevent `any` usage

**Performance Requirements (Validated)**:
- ✅ **60 FPS maintenance**: Automated performance testing validates frame rate
- ✅ **Environment-aware optimization**: Testing accommodates CI vs local performance differences
- ✅ **Memory management**: Automated memory leak detection in testing pipeline
- ✅ **Bundle size monitoring**: Asset size validation prevents bloat

**Architecture Patterns (Implemented)**:
- ✅ **ECS (Entity Component System)**: Complete implementation for modular game architecture
- ✅ **Component-based design**: Equipment system designed for ECS implementation
- ✅ **Event-driven communication**: Systems communicate through ECS world coordination
- ✅ **Modular scene management**: TypeScript scenes with clean ECS integration
- ✅ **Separation of concerns**: Game logic, presentation, and data cleanly separated

**Development Standards (Enforced)**:
- ✅ **ESLint + TypeScript**: Code quality enforcement with real-time validation
- ✅ **Automated testing**: Unit, E2E, and performance testing prevent regressions
- ✅ **Hot reload development**: Instant feedback during development with state preservation
- ✅ **Asset pipeline automation**: Texture packing and optimization handled automatically

## Appendix - Useful Commands and Quick Reference

### Current Development Commands

**Active Development Workflow (July 21, 2025)**:
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

# Build and deployment (Implemented)
npm run build:info       # Generate build information
npm run deploy:staging   # Deploy to staging environment
npm run deploy:production # Deploy to production
npm run rollback         # Rollback functionality
npm run performance:check # Performance validation
```

**Development Features Available**:
- ✅ **In-Game Performance Monitoring**: Press F3 to toggle FPS counter
- ✅ **Real-time Type Checking**: TypeScript errors shown immediately
- ✅ **Hot Module Replacement**: Code changes reflected instantly
- ✅ **Asset Pipeline**: Automatic texture packing and optimization
- ✅ **Multi-Environment Testing**: CI/local environment awareness


### Key Reference Files

**Documentation Change Tracking**:
- `DOCUMENTATION_CHANGELOG.md` - Comprehensive change history and commit conventions
- **Purpose**: Track all documentation modifications, maintain consistency, guide future development

**Implementation Planning**:
- `docs/developers/architecture-overview.md`
- `docs/development/implementation-architecture.md`

**Quick Lookup Tables**:
- `docs/technical/developer-quick-reference.md` - Equipment stats, power consumption, progression gates
- `docs/technical/numerical-balance-spreadsheet.md` - Game balance parameters

**Implementation Guides**:
- `docs/examples/basic-game.md` — Minimal example

**System Documentation**:
- `docs/systems/` - Individual system specifications (manufacturing, resources, energy)
- `docs/gameplay/mechanics/` - Detailed mechanic implementations
- `docs/interface/` - UI/UX requirements and specifications

### Debugging and Troubleshooting

**Current State**:
- **Browser Console**: Primary debugging tool
- **Developer Tools**: Network tab for asset loading issues
- **Common Issues**: Asset loading failures, Phaser initialization errors

**Production Debugging**:
- **Performance Monitor**: Built-in FPS counter and performance tests

---

**Note**: This document reflects the current release state of Phaser Game Template as of August 15, 2025.

---
