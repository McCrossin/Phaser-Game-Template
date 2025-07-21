# New Eden Project - Development Setup

## 🎯 Project Overview

**New Eden Project** is a 2D automation-strategy game featuring probe consciousness gameplay, authentic science education, and meaningful narrative purpose. You are the last guardian of consciousness in an empty universe, tasked with preserving intelligence through automated exploration and replication.

### Key Features

- **Probe Consciousness Gameplay**: Direct control of exploration probes
- **Authentic Science Education**: Real 118-element periodic table and circuit fabrication
- **4-Slot Equipment System**: Strategic equipment swapping with environmental hazards
- **Narrative-Driven Automation**: Your work has cosmic significance
- **Premium Early Access Model**: Targeting $8M-$25M revenue potential

## � IMPORTANT: Indie Developer Configuration

**This project is configured for an individual developer account (McCrossin), NOT a GitHub organization.**

📖 **For AI Agents**: See [`docs/technical/DEVELOPER-CONSTRAINTS.md`](docs/technical/DEVELOPER-CONSTRAINTS.md) for critical configuration requirements and limitations.

## �🚀 Quick Start

### Prerequisites

- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **Git** (For version control)
- **VS Code** (Recommended IDE with TypeScript support)

### Installation

```bash
# 1. Clone the repository
git clone <repository-url>
cd "New Eden Project"

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser (should auto-open to http://localhost:3000)
```

## 📁 Project Structure

```
New Eden Project/
├── src/                          # TypeScript source code
│   ├── main.ts                   # Game initialization and configuration
│   ├── scenes/                   # Phaser 3 game scenes
│   │   ├── StartScene.ts         # Main menu and title screen
│   │   └── GameScene.ts          # Primary gameplay scene
│   ├── systems/                  # Game systems (ECS architecture)
│   ├── components/               # ECS components
│   ├── entities/                 # Game entities
│   ├── types/                    # TypeScript type definitions
│   │   └── GameTypes.ts          # Core game type definitions
│   └── utils/                    # Utility functions
│       ├── Constants.ts          # Game constants and configuration
│       └── Utils.ts              # Helper functions
├── assets/                       # Game assets (images, audio, etc.)
├── docs/                         # Design documentation (extensive)
│   ├── implementation-prd.md     # Product Requirements Document
│   ├── implementation-architecture.md # Technical architecture
│   ├── new-eden-project-gdd.md   # Game Design Document
│   └── technical/                # Technical specifications
├── dist/                         # Built game files (auto-generated)
├── package.json                  # Node.js dependencies and scripts
├── tsconfig.json                 # TypeScript configuration
├── vite.config.ts                # Vite build configuration
└── index.html                    # Game container HTML
```

## 🛠️ Development Commands

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Production build
npm run preview      # Preview production build

# Code Quality
npm run typecheck    # TypeScript type checking
npm run lint         # ESLint code linting
npm run lint:fix     # Auto-fix linting issues

# Testing
npm run test         # Run test suite (Vitest)

# Performance Monitoring
# In development builds:
# - Press F3 to toggle FPS counter
# - Monitor console for performance warnings
# - Use docs/checklists/performance-testing.md for manual testing
```

## 🎮 Current Development Status

### ✅ Completed (Stories 1.1-1.5)

- **Production Build System**: TypeScript + Vite configuration
- **Project Structure**: Modular architecture with path aliases
- **Basic Scenes**: StartScene and GameScene with TypeScript
- **Type Definitions**: Comprehensive game type system
- **Development Workflow**: Hot reload, linting, testing setup
- **Performance Monitoring**: FPS counter, performance logging, testing checklist

### 🚧 In Progress

- **Core Game Architecture**: ECS patterns and state management

### 📋 Next Steps (Following Implementation Priority Matrix)

**Week 1-2: Foundation Infrastructure**

- [x] ECS (Entity Component System) architecture
- [x] Performance monitoring and optimization
- [ ] Game state management with scene transitions
- [ ] Basic probe movement and input handling

**Week 3-4: Core Resource Loop**

- [ ] Energy system with solar panel placement
- [ ] Basic mining and resource collection
- [ ] Simple fabrication system
- [ ] Save/load prototype

**Week 5-8: Equipment & Progression**

- [ ] 4-slot equipment bay system
- [ ] Equipment swapping with drag-and-drop UI
- [ ] Scanner operations and resource detection
- [ ] Tutorial flow implementation

## 🏗️ Architecture Overview

### Tech Stack

- **Frontend**: TypeScript 5.0+ with strict mode
- **Game Engine**: Phaser 3.88.2 with WebGL rendering
- **Build System**: Vite 4.4+ for fast development and optimization
- **State Management**: Custom ECS (Entity Component System)
- **Testing**: Vitest for unit and integration tests
- **Linting**: ESLint with TypeScript rules

### Performance Targets

- **60 FPS** on mid-range hardware (GTX 1060, 8GB RAM)
- **Sub-2 second** save/load operations
- **Efficient memory management** with object pooling
- **Cross-platform compatibility** (desktop and mobile browsers)

### Key Design Patterns

- **Component-based Architecture**: Modular equipment and probe systems
- **Event-driven Communication**: Decoupled system interactions
- **Phaser Scene Management**: Clean separation between game states
- **TypeScript Strict Mode**: Type safety and AI development support

## 🔬 Game Systems Overview

### Core Gameplay Loop

1. **Probe Control**: Direct consciousness gameplay with WASD movement
2. **Energy Management**: Solar panel placement and power consumption (kW-based)
3. **Resource Discovery**: 118-element periodic table with real chemistry
4. **Equipment Specialization**: 4-slot system with environmental challenges
5. **Manufacturing**: Circuit fabrication from 28nm to quantum scale
6. **Replication**: Probe consciousness transfer and fleet management

### Technical Implementation

- **Update Frequency**: 100ms intervals for game logic (10 updates/second)
- **Render Frequency**: 60 FPS visual updates
- **Energy Units**: Real-world kW/kWh calculations
- **Save Format**: JSON with LZ4 compression

## 📚 Documentation

### Essential Reading

- **[Implementation PRD](docs/implementation-prd.md)**: Complete 12-story development plan
- **[Technical Architecture](docs/implementation-architecture.md)**: Component-based ECS architecture
- **[Game Design Document](docs/new-eden-project-gdd.md)**: Complete game vision (664+ lines)
- **[Priority Matrix](docs/technical/implementation-priority-matrix.md)**: 16-week development roadmap

### Quick Reference

- **[Developer Quick Reference](docs/technical/developer-quick-reference.md)**: Equipment stats, power consumption, progression gates
- **[Phaser 3 Implementation Guide](docs/technical/implementation/phaser3-implementation-guide.md)**: Code patterns and examples

## 🐛 Debugging

### Development Tools

- **Browser Console**: Primary debugging tool
- **Phaser Debug Mode**: Physics and collision visualization
- **Performance Overlay**: Press F4 in-game (planned)
- **Debug Info**: Current probe position, FPS, memory usage

### Common Issues

- **Asset Loading**: Check browser network tab for 404 errors
- **TypeScript Errors**: Run `npm run typecheck` for detailed error information
- **Performance**: Monitor FPS in debug overlay

## 🎯 Contributing

### Code Standards

- **TypeScript Strict Mode**: No `any` types, explicit function return types
- **ESLint Rules**: Enforced code formatting and best practices
- **Performance First**: 60 FPS target with efficient algorithms
- **Documentation**: Comprehensive inline documentation required

### Development Workflow

1. **Feature Branches**: Create feature branches from `main`
2. **Type Safety**: Ensure all TypeScript checks pass
3. **Testing**: Write tests for game systems and utilities
4. **Documentation**: Update relevant docs for changes
5. **Performance Testing**: Validate 60 FPS target

## 📈 Business Context

### Market Position

- **Premium Early Access**: $19.99 launch price, targeting $8M-$25M revenue
- **Educational Value**: STEM market with 15-20% annual growth
- **Unique Positioning**: Only narrative-driven automation game
- **Target Audience**: Ages 25-40, PC strategy players, STEM educators

### Success Metrics

- **Tutorial Completion**: >85% target rate
- **First Replication**: Achievable within 4 hours
- **Performance**: 60 FPS on target hardware
- **Community**: >70% positive Steam reviews

## 🔗 Useful Links

- **[Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)**
- **[TypeScript Handbook](https://www.typescriptlang.org/docs/)**
- **[Vite Documentation](https://vitejs.dev/)**
- **[VS Code TypeScript Guide](https://code.visualstudio.com/docs/languages/typescript)**

---

**Status**: Foundation phase complete - Ready for core system implementation  
**Next Milestone**: Week 2 - Core game architecture and probe movement  
**Development Readiness**: 95% complete according to comprehensive documentation review
