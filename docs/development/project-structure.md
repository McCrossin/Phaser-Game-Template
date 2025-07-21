# Project Structure Guide

Understanding the organization and architecture of the Phaser Game Template.

## Overview

The template follows modern JavaScript project conventions with game-specific optimizations for scalability, maintainability, and performance.

## Root Directory Structure

```
Phaser-Game-Template/
├── 📁 assets/                    # Game assets (images, audio, data)
├── 📁 config/                    # Configuration files
├── 📁 docs/                      # Documentation
├── 📁 environments/              # Environment-specific configs
├── 📁 src/                       # Source code
├── 📁 testing/                   # Test files and configuration
├── 📁 tools/                     # Build and development tools
├── 📄 index.html                 # Main HTML entry point
├── 📄 package.json               # Project configuration
├── 📄 tsconfig.json              # TypeScript configuration
├── 📄 vite.config.ts             # Build system configuration
└── 📄 README.md                  # Project overview
```

## Source Code Organization (`src/`)

### Core Structure

```
src/
├── 📄 main.ts                    # Application entry point
├── 📁 components/                # Reusable game components
├── 📁 config/                    # Game configuration
├── 📁 ecs/                       # Entity-Component-System
├── 📁 scenes/                    # Phaser scenes
├── 📁 systems/                   # Game systems
├── 📁 types/                     # TypeScript type definitions
└── 📁 utils/                     # Utility functions
```

### Detailed Source Structure

```
src/
├── 📄 main.ts                    # Game initialization
├── components/                   # Game components
│   ├── common/                   # Shared components
│   │   ├── Transform.ts          # Position, rotation, scale
│   │   ├── Velocity.ts           # Movement components
│   │   └── Health.ts             # Health/damage system
│   ├── player/                   # Player-specific components
│   │   ├── PlayerInput.ts        # Input handling
│   │   └── PlayerController.ts   # Player behavior
│   └── enemies/                  # Enemy components
│       ├── AIController.ts       # AI behavior
│       └── PatrolBehavior.ts     # Movement patterns
├── config/                       # Configuration files
│   ├── GameConfig.ts            # Main game configuration
│   ├── PhysicsConfig.ts         # Physics settings
│   └── AssetConfig.ts           # Asset loading configuration
├── ecs/                         # Entity-Component-System
│   ├── Entity.ts                # Entity management
│   ├── Component.ts             # Base component class
│   ├── System.ts                # Base system class
│   └── World.ts                 # ECS world management
├── scenes/                      # Phaser scenes
│   ├── BootScene.ts            # Initial loading scene
│   ├── MenuScene.ts            # Main menu
│   ├── GameScene.ts            # Main gameplay
│   ├── GameOverScene.ts        # Game over screen
│   └── PauseScene.ts           # Pause overlay
├── systems/                     # Game systems
│   ├── InputSystem.ts          # Input processing
│   ├── MovementSystem.ts       # Movement updates
│   ├── CollisionSystem.ts      # Collision detection
│   ├── RenderSystem.ts         # Rendering updates
│   └── AudioSystem.ts          # Audio management
├── types/                       # Type definitions
│   ├── GameTypes.ts            # Game-specific types
│   ├── PhaseTypes.ts           # Phaser type extensions
│   └── ComponentTypes.ts       # Component interfaces
└── utils/                       # Utility functions
    ├── MathUtils.ts            # Mathematical operations
    ├── AssetUtils.ts           # Asset loading helpers
    ├── DebugUtils.ts           # Debug visualization
    └── PerformanceUtils.ts     # Performance monitoring
```

## Asset Organization (`assets/`)

### Asset Directory Structure

```
assets/
├── 📁 source/                    # Original source assets
│   ├── images/                   # Source images (PSD, AI files)
│   ├── audio/                    # Source audio (WAV, AIFF)
│   └── data/                     # Source data files
├── 📁 processed/                 # Build-optimized assets
│   ├── images/                   # Compressed images
│   ├── audio/                    # Compressed audio
│   └── spritesheets/             # Generated sprite sheets
├── 📁 textures/                  # Game textures
│   ├── characters/               # Character sprites
│   ├── environment/              # Background and tiles
│   ├── ui/                       # User interface graphics
│   └── effects/                  # Visual effects
├── 📁 audio/                     # Game audio
│   ├── music/                    # Background music
│   ├── sfx/                      # Sound effects
│   └── voice/                    # Voice recordings
├── 📁 data/                      # Game data files
│   ├── levels/                   # Level configurations
│   ├── configs/                  # Game configurations
│   └── translations/             # Localization files
└── 📁 fonts/                     # Game fonts
    ├── bitmap/                   # Bitmap fonts
    └── web/                      # Web fonts
```

### Asset Naming Conventions

```
# Images
player_idle_01.png              # Character animations
bg_forest_layer_01.png          # Background layers
ui_button_start_normal.png      # UI elements
fx_explosion_spritesheet.png    # Effect animations

# Audio
music_main_menu.ogg             # Background music
sfx_player_jump.wav             # Sound effects
voice_narrator_intro.mp3        # Voice lines

# Data
level_01_config.json            # Level data
enemy_stats.json                # Game balance data
ui_text_en.json                 # Localization
```

## Configuration Structure (`config/`)

### Configuration Organization

```
config/
├── 📁 build/                     # Build configuration
│   ├── vite.config.ts           # Vite build settings
│   ├── typescript.config.ts     # TypeScript settings
│   └── optimization.config.ts   # Build optimizations
├── 📁 deployment/               # Deployment configuration
│   ├── docker.config.ts        # Docker settings
│   ├── nginx.config.ts          # Web server config
│   └── cdn.config.ts            # CDN configuration
├── 📁 development/              # Development settings
│   ├── debug.config.ts          # Debug options
│   ├── hotreload.config.ts      # Hot reload settings
│   └── testing.config.ts        # Test configuration
└── 📁 monitoring/               # Monitoring setup
    ├── performance.config.ts    # Performance monitoring
    ├── analytics.config.ts      # Analytics setup
    └── logging.config.ts        # Logging configuration
```

## Documentation Structure (`docs/`)

### Documentation Organization

```
docs/
├── 📄 README.md                  # Documentation overview
├── 📁 setup/                     # Setup and installation
│   ├── quick-start.md           # 5-minute setup guide
│   ├── detailed-setup.md        # Complete setup instructions
│   ├── requirements.md          # System requirements
│   └── troubleshooting.md       # Common issues and solutions
├── 📁 features/                  # Template features
│   ├── overview.md              # Features overview
│   ├── build-system.md          # Vite + TypeScript setup
│   ├── testing-framework.md     # Testing capabilities
│   ├── ci-cd-pipeline.md        # GitHub Actions setup
│   ├── health-monitoring.md     # Health checks
│   └── performance-tools.md     # Performance optimization
├── 📁 development/               # Development guides
│   ├── project-structure.md     # This file
│   ├── component-architecture.md # ECS and component patterns
│   ├── scene-management.md      # Phaser scene patterns
│   ├── asset-pipeline.md        # Asset management
│   └── debugging.md             # Debugging techniques
├── 📁 customization/             # Customization guides
│   ├── new-project-setup.md     # Project customization
│   ├── configuration.md         # Config customization
│   ├── extending-systems.md     # Adding new systems
│   └── deployment.md            # Deployment options
└── 📁 examples/                  # Code examples
    ├── basic-game.md            # Simple game example
    ├── component-examples.md    # Component usage
    └── best-practices.md        # Development best practices
```

## Testing Structure (`testing/`)

### Test Organization

```
testing/
├── 📄 setup.ts                  # Test configuration
├── 📁 config/                   # Test configuration files
│   ├── vitest.config.ts         # Unit test configuration
│   ├── playwright.config.ts     # E2E test configuration
│   └── coverage.config.ts       # Coverage settings
├── 📁 unit/                     # Unit tests
│   ├── components/              # Component tests
│   ├── systems/                 # System tests
│   ├── utils/                   # Utility tests
│   └── scenes/                  # Scene tests
├── 📁 e2e/                      # End-to-end tests
│   ├── game-flow.spec.ts        # Game flow tests
│   ├── performance.spec.ts      # Performance tests
│   └── accessibility.spec.ts    # Accessibility tests
└── 📁 fixtures/                 # Test data and mocks
    ├── game-states/             # Saved game states
    ├── mock-data/               # Test data
    └── screenshots/             # Visual regression baselines
```

## Build Output Structure (`dist/`)

### Production Build Structure

```
dist/
├── 📄 index.html                # Main HTML file
├── 📁 assets/                   # Bundled assets
│   ├── images/                  # Optimized images
│   ├── audio/                   # Compressed audio
│   └── fonts/                   # Web fonts
├── 📁 js/                       # JavaScript bundles
│   ├── main.[hash].js           # Main application bundle
│   ├── phaser.[hash].js         # Phaser library bundle
│   └── vendor.[hash].js         # Third-party libraries
├── 📁 css/                      # Stylesheets
│   └── main.[hash].css          # Compiled styles
└── 📄 manifest.json             # PWA manifest
```

## File Naming Conventions

### TypeScript Files

```
# Classes (PascalCase)
GameScene.ts
PlayerComponent.ts
MovementSystem.ts

# Utilities and functions (camelCase)
mathUtils.ts
assetLoader.ts
debugHelper.ts

# Configuration files (camelCase + Config suffix)
gameConfig.ts
physicsConfig.ts
audioConfig.ts

# Type definitions (PascalCase + Types suffix)
GameTypes.ts
ComponentTypes.ts
SceneTypes.ts
```

### Component Organization

```
# Group related components
components/
├── player/                      # Player-related components
│   ├── PlayerInput.ts
│   ├── PlayerMovement.ts
│   └── PlayerHealth.ts
├── enemies/                     # Enemy components
│   ├── EnemyAI.ts
│   ├── EnemyPatrol.ts
│   └── EnemyAttack.ts
└── common/                      # Shared components
    ├── Transform.ts
    ├── Velocity.ts
    └── Collider.ts
```

## Code Organization Patterns

### Scene Organization

```typescript
// scenes/GameScene.ts
export class GameScene extends Phaser.Scene {
  // Constants at the top
  private static readonly SCENE_KEY = 'GameScene';
  
  // Properties grouped by type
  private player!: Phaser.GameObjects.Sprite;
  private enemies: Phaser.GameObjects.Group;
  private ui: Phaser.GameObjects.Container;
  
  // Lifecycle methods in order
  constructor() { /* ... */ }
  preload() { /* ... */ }
  create() { /* ... */ }
  update() { /* ... */ }
  
  // Private methods grouped by function
  private initializePlayer() { /* ... */ }
  private setupEnemies() { /* ... */ }
  private createUI() { /* ... */ }
  
  // Event handlers
  private onPlayerHit() { /* ... */ }
  private onEnemyDefeated() { /* ... */ }
}
```

### Component Organization

```typescript
// components/common/Transform.ts
export interface Transform {
  x: number;
  y: number;
  rotation: number;
  scaleX: number;
  scaleY: number;
}

export class TransformComponent implements Transform {
  constructor(
    public x = 0,
    public y = 0,
    public rotation = 0,
    public scaleX = 1,
    public scaleY = 1
  ) {}
  
  // Methods for transform operations
  setPosition(x: number, y: number): void { /* ... */ }
  rotate(angle: number): void { /* ... */ }
  scale(factor: number): void { /* ... */ }
}
```

### System Organization

```typescript
// systems/MovementSystem.ts
export class MovementSystem {
  // Dependencies injected in constructor
  constructor(
    private world: World,
    private physics: Phaser.Physics.Matter.World
  ) {}
  
  // Main update method
  update(deltaTime: number): void {
    const entities = this.world.getEntitiesWith([Transform, Velocity]);
    
    for (const entity of entities) {
      this.updateEntityMovement(entity, deltaTime);
    }
  }
  
  // Private implementation methods
  private updateEntityMovement(entity: Entity, deltaTime: number): void {
    // Movement logic
  }
}
```

## Import Organization

### Import Order

```typescript
// 1. Node modules
import { Scene, GameObjects } from 'phaser';
import { v4 as uuid } from 'uuid';

// 2. Internal modules (absolute paths)
import { GameConfig } from '@/config/GameConfig';
import { Transform } from '@/components/common/Transform';

// 3. Relative imports
import { Player } from './Player';
import { Enemy } from './Enemy';

// 4. Type-only imports (separate)
import type { GameState } from '@/types/GameTypes';
import type { ComponentType } from '@/types/ComponentTypes';
```

### Path Aliases

```typescript
// tsconfig.json path mapping
{
  "compilerOptions": {
    "paths": {
      "@/*": ["src/*"],
      "@components/*": ["src/components/*"],
      "@scenes/*": ["src/scenes/*"],
      "@systems/*": ["src/systems/*"],
      "@utils/*": ["src/utils/*"],
      "@assets/*": ["assets/*"]
    }
  }
}

// Usage in code
import { Player } from '@components/player/Player';
import { GameScene } from '@scenes/GameScene';
import { mathUtils } from '@utils/mathUtils';
import playerSprite from '@assets/textures/player.png';
```

## Best Practices

### File Organization

1. **Single Responsibility**: One class/interface per file
2. **Logical Grouping**: Related files in same directory
3. **Clear Naming**: Descriptive, consistent naming conventions
4. **Import Organization**: Clean, organized imports

### Directory Structure

1. **Shallow Hierarchy**: Avoid deep nesting (max 3-4 levels)
2. **Feature-based**: Group by feature, not by file type
3. **Consistent Naming**: Use consistent naming patterns
4. **Clear Separation**: Separate concerns clearly

### Code Organization

1. **Dependency Injection**: Inject dependencies rather than importing
2. **Interface Segregation**: Small, focused interfaces
3. **Composition over Inheritance**: Favor composition patterns
4. **Clear Boundaries**: Well-defined module boundaries

---

**Next Steps:**
- [Component Architecture](component-architecture.md) - Learn about ECS patterns
- [Scene Management](scene-management.md) - Phaser scene organization
- [Asset Pipeline](asset-pipeline.md) - Asset management workflow
