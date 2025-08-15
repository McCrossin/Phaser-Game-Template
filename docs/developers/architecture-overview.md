# New Eden Project - Architecture Overview

## High-Level System Architecture

The New Eden Project is built using a modern, scalable architecture designed for performance and maintainability.

### Core Technologies

- **Game Engine**: Phaser 3 - Industry-standard HTML5 game framework
- **Language**: TypeScript - Type-safe JavaScript for better development experience
- **Architecture Pattern**: Entity-Component-System (ECS) - Scalable game object management
- **Build Tool**: Vite - Fast, modern build tooling
- **Asset Pipeline**: Custom Vite plugins for texture packing and optimization

### System Components

#### 1. ECS Architecture (`src/ecs/`)
- **Entities**: Game objects (probes, resources, structures)
- **Components**: Data containers (position, velocity, inventory)
- **Systems**: Logic processors (movement, collision, manufacturing)

#### 2. Scene Management (`src/scenes/`)
- **MainMenuScene**: Game entry point and navigation
- **GameScene**: Primary gameplay environment
- **UIScene**: Heads-up display and interface overlays

#### 3. Core Systems (`src/systems/`)
- **MovementSystem**: Entity positioning and physics
- **RenderSystem**: Display and visual effects
- **InputSystem**: Player interaction handling
- **ResourceSystem**: Material and energy management

#### 4. Asset Management (`assets/`)
- **Source Assets**: Original art and audio files
- **Processed Assets**: Optimized textures and atlases
- **Manifests**: Asset loading and caching information

### Performance Targets

- **60 FPS** on target platforms
- **< 2 second** initial load time
- **Cross-platform** compatibility (desktop, mobile)
- **Scalable** to 1000+ simultaneous game objects

### Development Workflow

1. **Feature Development**: Implement in appropriate system/component
2. **Testing**: Unit tests for logic, e2e tests for integration
3. **Performance**: Validate 60 FPS target with performance tests
4. **Documentation**: Update relevant technical documentation

See individual system documentation in `docs/technical/` for implementation details.
