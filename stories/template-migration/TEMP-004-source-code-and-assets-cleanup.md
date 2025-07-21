# Story: Remove Game-Specific Source Code and Assets

**ID**: TEMP-004  
**Epic**: Template Conversion  
**Priority**: High  
**Estimated Points**: 5  
**Dependencies**: TEMP-001, TEMP-002, TEMP-003

## Description

Remove all New Eden Project-specific source code, game logic, and assets while preserving the technical infrastructure, build system, and development tools. Create a minimal but functional Phaser 3 starter project with example components.

### Player Experience Goal

Developers will receive a clean, functional Phaser 3 project with example scenes, components, and systems that demonstrate best practices without any game-specific content.

### Technical Overview

Strip out New Eden game logic, assets, and specific implementations while maintaining the TypeScript architecture, build system, testing framework, and development tools. Create example scenes and components that showcase the template's capabilities.

## Acceptance Criteria

### Functional Requirements

- [x] All New Eden specific game logic removed
- [x] Game-specific assets removed (keeping placeholder assets)
- [x] Functional example Phaser 3 scenes created
- [x] Component architecture examples provided
- [x] Build system and tools remain fully functional

### Technical Requirements

- [x] src/ folder contains template code only
- [x] Example scenes demonstrate Phaser 3 patterns
- [x] TypeScript architecture preserved
- [x] ECS/component system examples included
- [x] Testing framework with example tests

### Game Design Requirements

- [x] No New Eden mechanics in codebase
- [x] Generic game systems as examples
- [x] Scalable architecture for any 2D game
- [x] Performance optimization examples included

## Technical Specifications

### Source Code Structure After Cleanup

```
src/
├── main.ts                 # Entry point with example game config
├── scenes/                 # Example scenes
│   ├── BootScene.ts       # Asset loading scene
│   ├── MenuScene.ts       # Main menu example
│   ├── GameScene.ts       # Basic gameplay scene example
│   └── UIScene.ts         # UI overlay example
├── components/            # Example component architecture
│   ├── BaseComponent.ts   # Component base class
│   ├── MovementComponent.ts # Movement example
│   └── RenderComponent.ts # Rendering example
├── systems/               # Example game systems
│   ├── InputManager.ts    # Input handling system
│   ├── SceneManager.ts    # Scene management
│   └── ConfigManager.ts   # Configuration management
├── gameObjects/           # Example game objects
│   ├── Player.ts          # Basic player example
│   └── GameObject.ts      # Base game object class
├── utils/                 # Utility functions (preserve existing)
├── types/                 # TypeScript definitions (clean up game-specific)
└── config/                # Game configuration (make generic)
```

### Assets to Remove/Replace

1. **Remove New Eden Assets**
    - assets/sprites/ (New Eden specific sprites)
    - Game-specific audio files
    - New Eden themed UI elements

2. **Keep/Add Template Assets**
    - assets/phaser.png (Phaser logo)
    - Basic placeholder sprites
    - Example UI elements
    - Template background/space image

### Example Scene Implementation

```typescript
// src/scenes/GameScene.ts - Example gameplay scene
export class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        // Example implementation showing template patterns
        this.add
            .text(400, 300, 'Template Game Scene', {
                fontSize: '32px',
                fill: '#ffffff'
            })
            .setOrigin(0.5);

        // Example of component usage
        // Template patterns without game-specific logic
    }
}
```

### Configuration Updates

```typescript
// src/config/GameConfig.ts - Generic game configuration
export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    title: 'Phaser Game Template',
    scene: [BootScene, MenuScene, GameScene]
    // Remove New Eden specific configurations
};
```

## Implementation Tasks

### Phase 1: Code Analysis and Planning (0.5 days)

1. Identify all New Eden specific code
2. Catalog reusable infrastructure components
3. Plan example implementations
4. Document code removal strategy

### Phase 2: Source Code Cleanup (2 days)

1. Remove New Eden game logic from all files
2. Clean up type definitions
3. Remove game-specific configurations
4. Update imports and dependencies

### Phase 3: Example Implementation (1.5 days)

1. Create example scenes showing best practices
2. Implement component architecture examples
3. Create basic game object examples
4. Add configuration examples

### Phase 4: Asset Management (0.5 days)

1. Remove New Eden specific assets
2. Add placeholder/example assets
3. Update asset loading configurations
4. Test asset pipeline

### Phase 5: Testing and Validation (0.5 days)

1. Update tests for template code
2. Verify build processes work
3. Test example scenes function correctly
4. Validate development workflow

## Testing Requirements

### Unit Tests

- Example components have test coverage
- Utility functions tested
- Configuration loading tested
- Scene management tested

### Integration Tests

- Example scenes load and function correctly
- Asset loading pipeline works
- Build system produces working game
- Development server functions properly

### Performance Tests

- Template maintains performance standards
- Example scenes meet frame rate targets
- Asset loading is efficient
- Memory usage is reasonable

## Definition of Done

### Implementation Complete

- [x] All New Eden specific code removed
- [x] Functional example scenes implemented
- [x] Component architecture examples created
- [x] Build system fully functional

### Quality Assurance

- [x] Example code demonstrates best practices
- [x] No game-specific content remains
- [x] Template is immediately usable
- [x] Code quality standards maintained

### Technical Validation

- [x] All tests pass with new template code
- [x] Build processes work correctly
- [x] Performance benchmarks met
- [x] Development workflow validated

### Asset Management

- [x] Game-specific assets removed
- [x] Placeholder assets functional
- [x] Asset pipeline works correctly
- [x] Template ready for new game assets

### Documentation

- [x] Code examples are well-documented
- [x] Component architecture explained
- [x] Template usage patterns documented
- [x] Development patterns demonstrated

This story creates a clean, functional template while preserving all the valuable infrastructure and development tools.
