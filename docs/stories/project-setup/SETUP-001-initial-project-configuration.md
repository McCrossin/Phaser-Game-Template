# Story: Initial Project Configuration
**ID**: SETUP-001  
**Epic**: Project Setup and Configuration  
**Priority**: High  
**Estimated Points**: 3  
**Dependencies**: None

## Description

Set up the foundational development environment for New Eden Project using Phaser 3.70+, TypeScript 5.0+ with strict mode, and Vite as the build tool. This story establishes the core project structure, configuration files, and development tooling that all subsequent development will build upon.

### Player Experience Goal
While this is a technical setup story, it directly impacts the player experience by ensuring the game will run at a consistent 60 FPS, load quickly, and work reliably across different browsers and devices.

### Technical Overview
Create a modern web game development environment using Vite for fast builds and hot module replacement, TypeScript for type safety and better developer experience, and Phaser 3 as the game engine. The setup will include proper folder structure as defined in the architecture document, development tools configuration, and initial performance monitoring.

## Acceptance Criteria

### Functional Requirements
- [ ] Project builds and runs showing a basic Phaser scene
- [ ] Hot module replacement works during development
- [ ] TypeScript compilation succeeds with strict mode enabled
- [ ] Development server starts on http://localhost:5173
- [ ] Production build generates optimized bundles

### Technical Requirements
- [ ] TypeScript 5.0+ configured with strict mode settings
- [ ] Phaser 3.70+ properly integrated with TypeScript types
- [ ] Vite configured for optimal Phaser development
- [ ] ESLint and Prettier configured for code quality
- [ ] Git hooks set up for pre-commit checks
- [ ] Folder structure matches architecture document exactly

### Game Design Requirements
- [ ] Base resolution set to 1920x1080 as per GDD
- [ ] Scale mode configured for responsive gameplay
- [ ] FPS target set to 60 with monitoring enabled
- [ ] WebGL renderer prioritized with Canvas fallback

## Technical Specifications

### Architecture Context
This story implements the foundation layer of the game architecture, establishing the project structure and build pipeline that all game systems will use. The configuration must support the component-based architecture, efficient asset loading, and performance requirements outlined in the architecture document.

### Files to Create/Modify
- `package.json`: Project dependencies and scripts
- `tsconfig.json`: TypeScript configuration with strict mode
- `vite.config.ts`: Vite build configuration optimized for Phaser
- `.eslintrc.json`: ESLint rules for code quality
- `.prettierrc`: Code formatting configuration
- `.gitignore`: Version control exclusions
- `src/main.ts`: Application entry point
- `src/config/GameConfig.ts`: Phaser game configuration
- `src/scenes/boot/BootScene.ts`: Initial loading scene
- `src/types/global.d.ts`: Global TypeScript declarations
- `index.html`: Game container HTML
- `public/favicon.ico`: Game favicon
- `.husky/pre-commit`: Git pre-commit hook

### Key Classes and Interfaces
```typescript
// src/config/GameConfig.ts
export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 640,
            height: 360
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    scene: [],
    backgroundColor: '#000000',
    render: {
        pixelArt: false,
        antialias: true,
        powerPreference: 'high-performance'
    },
    fps: {
        target: 60,
        forceSetTimeOut: false,
        min: 30
    },
    audio: {
        disableWebAudio: false
    }
};

// src/scenes/boot/BootScene.ts
export class BootScene extends Phaser.Scene {
    constructor() {
        super({ key: 'BootScene' });
    }

    preload(): void {
        // Initial asset loading
    }

    create(): void {
        // Scene initialization
    }
}

// src/types/global.d.ts
declare global {
    interface Window {
        game: Phaser.Game;
    }
}
```

### Integration Points
- **Build System**: Vite must handle Phaser's asset loading
- **TypeScript**: Phaser type definitions must be properly configured
- **Performance Monitoring**: FPS counter integrated into development builds
- **Hot Reload**: Scene state preservation during development

### Performance Requirements
- Development build starts in <3 seconds
- Hot module replacement updates in <500ms
- Production bundle size <2MB for initial load
- 60 FPS maintained in empty scene
- Memory usage baseline <50MB

## Implementation Tasks

### 1. Initialize Project Structure
Create the base project with required dependencies and folder structure.

**Estimated Time**: 2 hours
**Technical Details**:
- Run `npm create vite@latest new-eden-project -- --template vanilla-ts`
- Install core dependencies: `phaser@3.70.0`, `typescript@5.0.0`
- Create folder structure per architecture document
- Set up Git repository with .gitignore

### 2. Configure TypeScript
Set up TypeScript with strict mode and Phaser-specific settings.

**Estimated Time**: 1 hour
**Technical Details**:
- Enable all strict mode flags in tsconfig.json
- Configure path aliases for clean imports
- Add Phaser type definitions
- Set up source maps for debugging

### 3. Configure Vite for Phaser
Optimize Vite configuration for Phaser game development.

**Estimated Time**: 2 hours
**Technical Details**:
- Configure static asset handling for game assets
- Set up proper module resolution for Phaser
- Enable source maps in development
- Configure production optimizations

### 4. Set Up Development Tools
Configure code quality and development tools.

**Estimated Time**: 2 hours
**Technical Details**:
- Configure ESLint with TypeScript plugin
- Set up Prettier for consistent formatting
- Install and configure Husky for git hooks
- Add pre-commit checks for linting and formatting

### 5. Create Initial Game Structure
Implement basic Phaser game initialization.

**Estimated Time**: 3 hours
**Technical Details**:
- Create GameConfig with proper settings
- Implement BootScene with basic lifecycle
- Set up main.ts entry point
- Add performance monitoring in development

### 6. Configure Build Scripts
Set up NPM scripts for development workflow.

**Estimated Time**: 1 hour
**Technical Details**:
- Add development server script with HMR
- Configure production build with optimizations
- Add linting and formatting scripts
- Create preview script for testing builds

## Game Design Context

### GDD References
- Technical Overview: Platform requirements and performance targets
- UI/UX Design: Base resolution and scaling requirements
- Performance: 60 FPS target on mid-range hardware

### Balance Parameters
```typescript
const PERFORMANCE_CONFIG = {
    TARGET_FPS: 60,
    MIN_FPS: 30,
    MEMORY_WARNING_THRESHOLD: 500, // MB
    INITIAL_POOL_SIZES: {
        particles: 1000,
        projectiles: 100
    }
};
```

### Visual/Audio Requirements
- **Favicon**: 32x32 and 192x192 icons for New Eden Project
- **Loading Screen**: Basic loading bar for initial boot
- **Font**: System font fallbacks until custom fonts loaded

## Testing Requirements

### Unit Tests
- `tests/config/GameConfig.test.ts`: Validate configuration values
- `tests/scenes/BootScene.test.ts`: Test scene lifecycle methods

### Integration Tests
- `Browser Compatibility`: Game loads in Chrome, Firefox, Safari, Edge
- `Resolution Scaling`: Game scales properly from 640x360 to 1920x1080
- `Performance Baseline`: Empty scene maintains 60 FPS

### Performance Tests
- `Initial Load Time`: <3 seconds on average connection
- `Memory Usage`: <50MB for empty scene
- `Bundle Size`: <2MB for initial JavaScript bundle

### Gameplay Testing
- [ ] Game window resizes properly without breaking layout
- [ ] FPS counter displays in development mode
- [ ] No console errors on startup
- [ ] Phaser version correctly reports 3.70.0

## Dependencies

### Prerequisite Stories
- None (this is the first story)

### System Dependencies
- Node.js: Version 18+ required
- npm: Version 8+ required
- Git: For version control

### Asset Dependencies
- Favicon: Need to create or obtain game icon

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Code follows TypeScript strict mode standards
- [ ] Unit test coverage >80% for new code
- [ ] Integration tests passing
- [ ] Performance targets met (60 FPS maintained)
- [ ] Code review completed
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Feature works on all target platforms
- [ ] Save/load compatibility maintained