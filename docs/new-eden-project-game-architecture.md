# New Eden Project Game Architecture Document

## Introduction

This document outlines the complete technical architecture for New Eden Project, a 2D automation-strategy game built with Phaser 3 and TypeScript. It serves as the technical foundation for AI-driven game development, ensuring consistency and scalability across all game systems.

This architecture is designed to support the gameplay mechanics defined in the Game Design Document while maintaining 60 FPS performance and cross-platform compatibility.

### Change Log

| Date | Version | Description | Author |
| :--- | :------ | :---------- | :----- |
| 2025-07-17 | 1.0 | Initial architecture document | Maya (Game Developer) |

## Technical Overview

### Architecture Summary

New Eden Project employs a component-based architecture built on Phaser 3.70+, leveraging TypeScript's strict type system for reliability and maintainability. The game is structured around discrete system updates (100ms intervals) to optimize performance while managing multiple autonomous probes across vast planetary environments.

Key architectural decisions:
- **Modular Equipment System**: 4-slot drag-and-drop interface with runtime equipment swapping
- **Discrete Power Management**: Kilowatt-based energy calculations updated at fixed intervals
- **Component-Based Entities**: Probes composed of interchangeable equipment modules
- **Event-Driven Communication**: Systems communicate through typed events for loose coupling
- **Performance-First Design**: Object pooling, culling, and progressive loading strategies

The architecture directly supports the GDD's core requirements:
- Real-time probe control with strategic automation
- Complex resource gathering and manufacturing chains
- Environmental challenges requiring equipment adaptation
- Multi-probe coordination with performance scaling

### Platform Targets

**Primary Platform:** PC (Web browsers - Chrome, Firefox, Edge)
**Secondary Platforms:** Steam (via Electron wrapper), Mobile (future consideration)
**Minimum Requirements:** 
- GTX 1060 or equivalent
- 8GB RAM
- Modern browser with WebGL 2.0 support
**Target Performance:** 60 FPS on mid-range hardware (GTX 1060, 8GB RAM)

### Technology Stack

**Core Engine:** Phaser 3.70+
**Language:** TypeScript 5.0+ (Strict Mode)
**Build Tool:** Vite (optimized for Phaser 3 development)
**Package Manager:** npm
**Testing:** Vitest + Playwright (for integration tests)
**Deployment:** Static hosting (Netlify/Vercel) with CDN distribution

## Project Structure

### Repository Organization

```text
new-eden-project/
├── src/
│   ├── scenes/              # Game scenes
│   │   ├── boot/           # Initial loading
│   │   ├── menu/           # Menu screens
│   │   ├── game/           # Gameplay scenes
│   │   └── tutorial/       # Tutorial sequences
│   ├── gameObjects/         # Custom game objects
│   │   ├── probe/          # Probe and equipment
│   │   ├── environment/    # World elements
│   │   ├── ui/             # UI components
│   │   └── effects/        # Visual effects
│   ├── systems/             # Core game systems
│   │   ├── energy/         # Power management
│   │   ├── equipment/      # Equipment handling
│   │   ├── resources/      # Resource system
│   │   ├── manufacturing/  # Crafting chains
│   │   └── save/           # Save/load system
│   ├── utils/               # Utility functions
│   ├── types/               # TypeScript definitions
│   ├── config/              # Game configuration
│   └── main.ts              # Entry point
├── assets/
│   ├── images/              # Sprite assets
│   ├── audio/               # Sound files
│   ├── data/                # JSON data files
│   └── fonts/               # Font files
├── public/                  # Static web assets
├── tests/                   # Test files
│   ├── unit/               # Unit tests
│   ├── integration/        # Integration tests
│   └── performance/        # Performance benchmarks
├── docs/                    # Documentation
│   ├── stories/            # Development stories
│   └── architecture/       # Technical docs
└── dist/                    # Built game files
```

### Module Organization

#### Scene Structure
- Each scene in separate file with lifecycle management
- Scene-specific assets loaded on demand
- Clear data contracts between scenes
- Memory cleanup in shutdown methods

#### Game Object Pattern
- Component-based architecture for equipment modularity
- Inheritance from Phaser.GameObjects for rendering
- Type-safe property definitions with interfaces
- Event emitters for state changes

#### System Architecture
- Singleton managers for global systems (Energy, Save, Audio)
- Event-driven communication between systems
- Clear separation of concerns (rendering vs logic)
- Testable business logic separated from Phaser dependencies

## Core Game Systems

### Scene Management System

**Purpose:** Handle game flow and scene transitions

**Key Components:**
- Scene loading with progress tracking
- Data passing between scenes via registry
- Transition effects with fade/slide animations
- Memory management with asset cleanup

**Implementation Requirements:**
- BootScene for initial asset loading
- MenuScene with settings and save management
- GameScene with pause/resume capability
- TutorialScene with 6-phase progression

**Files to Create:**
- `src/scenes/boot/BootScene.ts`
- `src/scenes/boot/PreloadScene.ts`
- `src/scenes/menu/MenuScene.ts`
- `src/scenes/game/GameScene.ts`
- `src/scenes/tutorial/TutorialScene.ts`
- `src/systems/SceneManager.ts`

### Game State Management

**Purpose:** Track player progress and game status

**State Categories:**
- Player progress (unlocked equipment, discovered recipes)
- Game settings (audio levels, control preferences)
- Session data (current probe states, resource counts)
- Persistent data (achievements, total playtime)

**Implementation Requirements:**
- LocalStorage-based save system with compression
- State validation with schema checking
- Auto-save every 60 seconds during gameplay
- Multiple save slots (minimum 3)

**Files to Create:**
- `src/systems/GameState.ts`
- `src/systems/save/SaveManager.ts`
- `src/systems/save/SaveValidator.ts`
- `src/types/SaveData.ts`

### Asset Management System

**Purpose:** Efficient loading and management of game assets

**Asset Categories:**
- Sprite sheets for probes and equipment
- Environmental tileset with 118 element variations
- UI elements and icons
- Audio files for ambience and effects

**Implementation Requirements:**
- Progressive loading with priority queue
- Texture atlas generation for sprites
- Audio sprite sheets for effects
- Error recovery for failed loads

**Files to Create:**
- `src/systems/AssetManager.ts`
- `src/config/AssetManifest.ts`
- `src/utils/TextureAtlasBuilder.ts`

### Input Management System

**Purpose:** Handle all player input across platforms

**Input Types:**
- Keyboard controls (WASD movement, E/Q/R/T equipment)
- Mouse interaction (click to move, drag equipment)
- Touch gestures (tap to move, pinch zoom)
- Gamepad support (future consideration)

**Implementation Requirements:**
- Input action mapping with rebinding
- Context-sensitive controls based on equipped tools
- Touch-optimized virtual controls for mobile
- Input buffering for responsive feel

**Files to Create:**
- `src/systems/input/InputManager.ts`
- `src/systems/input/TouchControls.ts`
- `src/systems/input/KeyboardMapper.ts`
- `src/types/InputActions.ts`

### Probe Control System

**Purpose:** Core movement and control mechanics for von Neumann probes

**Core Functionality:**
- WASD direct control with physics-based movement
- Context-sensitive tool activation
- Multi-probe management (Direct/Assisted/Autonomous modes)
- Consciousness transfer between probes

**Dependencies:** Physics system, Input system, Equipment system

**Performance Considerations:** 
- Direct control probe updates every frame
- Assisted probes update every 100ms
- Autonomous probes update every 500ms

**Files to Create:**
- `src/systems/probe/ProbeController.ts`
- `src/gameObjects/probe/Probe.ts`
- `src/systems/probe/MultiProbeManager.ts`
- `src/types/ProbeTypes.ts`

### Equipment System

**Purpose:** Modular 4-slot equipment management

**Core Functionality:**
- Drag-and-drop equipment interface
- Real-time compatibility checking
- Power consumption calculations
- Equipment effects on probe capabilities

**Dependencies:** UI system, Energy system, Save system

**Performance Considerations:** 
- Equipment updates only on change
- Cached capability calculations
- Efficient tooltip rendering

**Files to Create:**
- `src/systems/equipment/EquipmentManager.ts`
- `src/systems/equipment/EquipmentSlot.ts`
- `src/gameObjects/equipment/BaseEquipment.ts`
- `src/types/EquipmentTypes.ts`

### Energy Management System

**Purpose:** Solar power generation and consumption tracking

**Core Functionality:**
- Discrete power level calculations (100ms updates)
- Solar panel efficiency based on placement
- Battery storage with charge/discharge curves
- Weather effects on generation

**Dependencies:** Equipment system, Environmental system

**Performance Considerations:**
- Lookup tables for power calculations
- Batched updates for multiple panels
- Efficient weather modifier application

**Files to Create:**
- `src/systems/energy/EnergyManager.ts`
- `src/systems/energy/SolarPanel.ts`
- `src/systems/energy/Battery.ts`
- `src/types/EnergyTypes.ts`

### Resource & Manufacturing System

**Purpose:** 118-element resource gathering and processing

**Core Functionality:**
- Periodic table-based resource system
- Recipe discovery mechanics
- Manufacturing queue management
- Resource storage and logistics

**Dependencies:** Equipment system, Save system

**Performance Considerations:**
- Efficient resource lookup structures
- Batched manufacturing updates
- Optimized inventory calculations

**Files to Create:**
- `src/systems/resources/ResourceManager.ts`
- `src/systems/manufacturing/ManufacturingSystem.ts`
- `src/systems/manufacturing/RecipeDiscovery.ts`
- `src/data/PeriodicTable.ts`
- `src/types/ResourceTypes.ts`

### Physics & Collision System

**Physics Engine:** Arcade Physics (Phaser's built-in system)

**Collision Categories:**
- Probe-to-terrain collision
- Resource node interaction
- Environmental hazard detection
- Equipment placement validation

**Implementation Requirements:**
- Optimized collision groups
- Spatial partitioning for large worlds
- Collision callbacks for interactions
- Physics body pooling

**Files to Create:**
- `src/systems/physics/PhysicsManager.ts`
- `src/systems/physics/CollisionHandler.ts`
- `src/config/PhysicsConfig.ts`

### Audio System

**Audio Requirements:**
- Ambient planetary soundscapes
- Equipment operation sounds
- UI feedback sounds
- Dynamic music based on activity

**Implementation Features:**
- Audio sprite management for effects
- Crossfading for music transitions
- 3D positional audio for off-screen events
- Volume controls per category

**Files to Create:**
- `src/systems/audio/AudioManager.ts`
- `src/systems/audio/MusicController.ts`
- `src/config/AudioManifest.ts`

### UI System

**UI Components:**
- Energy HUD with generation/consumption
- Resource inventory display
- Equipment management interface
- Manufacturing queue visualization
- Environmental warnings

**Implementation Requirements:**
- Responsive scaling for different resolutions
- Touch-friendly interaction areas
- Keyboard navigation support
- Smooth transitions and animations

**Files to Create:**
- `src/systems/ui/UIManager.ts`
- `src/gameObjects/ui/HUD.ts`
- `src/gameObjects/ui/EquipmentPanel.ts`
- `src/gameObjects/ui/ResourceDisplay.ts`
- `src/types/UITypes.ts`

### Environmental System

**Purpose:** Procedural world generation and hazard management

**Core Functionality:**
- Geologically coherent resource placement
- Environmental hazard zones
- Weather system with effects
- Day/night cycle impact

**Dependencies:** Resource system, Energy system

**Performance Considerations:**
- Chunk-based world loading
- LOD system for distant terrain
- Efficient hazard calculations

**Files to Create:**
- `src/systems/world/WorldGenerator.ts`
- `src/systems/world/EnvironmentalHazards.ts`
- `src/systems/world/WeatherSystem.ts`
- `src/types/WorldTypes.ts`

## Performance Architecture

### Performance Targets

**Frame Rate:** 60 FPS sustained, 30 FPS minimum
**Memory Usage:** <500MB total
**Load Times:** <5s initial, <2s per scene transition
**Battery Optimization:** Reduced updates when tab not visible

### Optimization Strategies

#### Object Pooling
- Mining laser projectiles
- Particle effects for drilling
- Resource node spawning
- UI element recycling

#### Asset Optimization
- Texture atlases for all sprites
- Compressed audio (OGG Vorbis)
- Lazy loading for tutorial assets
- Progressive texture quality

#### Rendering Optimization
- Sprite batching for similar objects
- Frustum culling for off-screen elements
- Reduced particle density on low-end hardware
- Dynamic resolution scaling

#### Files to Create
- `src/utils/ObjectPool.ts`
- `src/utils/PerformanceMonitor.ts`
- `src/config/OptimizationConfig.ts`

## Game Configuration

### Phaser Configuration

```typescript
// src/config/GameConfig.ts
export const gameConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    width: 1920,
    height: 1080,
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 }, // Top-down perspective
            debug: false
        }
    },
    scene: [], // Populated dynamically
    render: {
        pixelArt: false,
        antialias: true
    },
    fps: {
        target: 60,
        forceSetTimeOut: false
    }
};
```

### Game Balance Configuration

```typescript
// src/config/GameBalance.ts
export const GameBalance = {
    probe: {
        baseSpeed: 200,
        basePower: 10, // kW
        baseStorage: 100 // units
    },
    energy: {
        solarGeneration: {
            base: 1.0, // kW
            weather_modifiers: {
                clear: 1.0,
                cloudy: 0.5,
                storm: 0.25
            }
        },
        batteryCapacity: 50, // kWh
        chargeEfficiency: 0.9
    },
    equipment: {
        powerConsumption: {
            idle: 0.1,
            mining: 5.0,
            manufacturing: 25.0
        }
    },
    difficulty: {
        tutorial: {
            energyDrainRate: 0.5,
            resourceAbundance: 2.0
        },
        normal: {
            energyDrainRate: 1.0,
            resourceAbundance: 1.0
        },
        hard: {
            energyDrainRate: 1.5,
            resourceAbundance: 0.7
        }
    }
};
```

## Development Guidelines

### TypeScript Standards

#### Type Safety
- Use strict mode with all checks enabled
- Define interfaces for all data structures
- Avoid `any` type - use `unknown` with guards
- Use enums for game states and equipment types

#### Code Organization
- One class per file with matching filename
- Group related files in subdirectories
- Use barrel exports for clean imports
- Comprehensive JSDoc comments

### Phaser 3 Best Practices

#### Scene Management
- Clean up listeners in shutdown()
- Use scene data for state passing
- Implement proper preload chains
- Avoid circular scene dependencies

#### Game Object Design
- Extend Phaser classes appropriately
- Implement update() for frame logic
- Use components for shared behavior
- Clean up in destroy() method

### Testing Strategy

#### Unit Testing
- Test game balance calculations
- Validate save/load serialization
- Test equipment compatibility rules
- Verify resource recipes

#### Integration Testing
- Scene transition flows
- Multi-probe coordination
- Save system edge cases
- Performance benchmarks

#### Files to Create
- `tests/unit/EnergyCalculations.test.ts`
- `tests/unit/EquipmentCompatibility.test.ts`
- `tests/integration/SaveSystem.test.ts`
- `tests/performance/MultiProbe.bench.ts`

## Deployment Architecture

### Build Process

#### Development Build
- Source maps enabled
- Hot module replacement
- Debug overlays active
- Unminified code

#### Production Build
- Tree shaking enabled
- Asset compression
- Code splitting
- Error tracking integration

### Deployment Strategy

#### Web Deployment
- Static hosting (Netlify/Vercel)
- CloudFlare CDN for assets
- Service worker for offline play
- Progressive web app manifest

#### Desktop Packaging
- Electron wrapper for Steam
- Auto-updater integration
- Cloud save sync
- Achievement integration

## Implementation Roadmap

### Phase 1: Foundation (4 weeks)

#### Core Systems
- Project setup with Vite + TypeScript
- Basic scene management structure
- Asset loading pipeline
- Input handling framework

#### Story Epics
- "Project Setup and Configuration"
- "Core Scene Management System"
- "Asset Loading Foundation"

### Phase 2: Game Systems (4 weeks)

#### Gameplay Systems
- Probe movement and control
- Energy generation/consumption
- Basic mining mechanics
- Equipment system foundation

#### Story Epics
- "Probe Control Implementation"
- "Energy System Development"
- "Equipment Management System"

### Phase 3: Content & Polish (4 weeks)

#### Content Systems
- Tutorial implementation
- Save/load functionality
- Manufacturing chains
- Environmental challenges

#### Story Epics
- "Tutorial System Implementation"
- "Save System Development"
- "Manufacturing and Recipes"

## Risk Assessment

| Risk | Probability | Impact | Mitigation Strategy |
| --- | --- | --- | --- |
| Performance issues with multiple probes | High | High | Implement tiered update system with LOD |
| Complex equipment UI on mobile | Medium | High | Design mobile-first interface with larger touch targets |
| Save file corruption | Low | Critical | Implement backup saves and validation |
| Manufacturing balance issues | High | Medium | Extensive playtesting with telemetry |

## Success Criteria

### Technical Metrics
- Maintain 60 FPS with 10+ active probes
- Save/load completes in <2 seconds
- Zero game-breaking bugs at launch
- 95% browser compatibility

### Code Quality
- 80%+ test coverage on core systems
- Zero TypeScript errors in strict mode
- All systems documented with examples
- Performance benchmarks pass