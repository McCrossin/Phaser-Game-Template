# Phaser Game Template

**Professional 2D game development template with modern tooling and streamlined workflows.**

[![Game CI Pipeline](https://github.com/McCrossin/Phaser-Game-Template/workflows/Game%20CI%20Pipeline/badge.svg)](https://github.com/McCrossin/Phaser-Game-Template/actions)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue.svg)](https://www.typescriptlang.org/)
[![Phaser](https://img.shields.io/badge/Phaser-3.70+-orange.svg)](https://phaser.io/)
[![Game Ready](https://img.shields.io/badge/Game-Ready-green.svg)](#)

## 🎯 Game Development Template

**Phaser Game Template** is a streamlined 2D game development template built with Phaser 3, TypeScript, and optimized CI/CD workflows. This template provides everything you need to start building professional 2D games with efficient development workflows.

### ✨ Key Features

- **🎮 Phaser 3 + TypeScript**: Modern game development with full type safety
- **⚡ Vite Build System**: Lightning-fast dev server and optimized production builds
- **🧪 Core Testing Suite**: Essential unit tests and integration tests for game logic
- **🚀 Simple CI/CD**: Streamlined game development pipeline with GitHub Actions
- **📊 Game Performance Monitoring**: 60 FPS validation and basic performance tracking
- **🎨 Asset Pipeline**: Automated texture packing and game asset optimization
- **📱 Cross-Platform Gaming**: Desktop and mobile browser support
- **🛠️ Modern Game Tooling**: ESLint, Prettier, and development best practices
- **📚 Focused Documentation**: Clean setup guides and game development workflows
- **🎯 Advanced Testing (Optional)**: E2E tests, visual regression, and performance benchmarking

## � Quick Start

Get your game running in under 5 minutes:

### Prerequisites

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **Git** for version control
- Code editor (VS Code recommended)

### 5-Minute Setup

```bash
# 1. Use this template (click "Use this template" on GitHub)
# or clone directly:
git clone https://github.com/McCrossin/Phaser-Game-Template.git my-awesome-game
cd my-awesome-game

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser (auto-opens to http://localhost:5173)
```

**🎉 That's it!** Your game development environment is ready.

### Next Steps

1. **� Start Building**: Edit `src/scenes/GameScene.ts` for your game logic
2. **� Add Assets**: Replace demo assets in `assets/` folder
3. **🏗️ Study the Architecture**: Review `docs/development/brownfield-architecture.md`
4. **🧪 Write Tests**: Add game-specific tests to `testing/core/unit/`
5. **📖 Read Simplified Workflow**: Check `docs/development/simplified-workflow.md`
6. **🚀 Deploy**: Use `./scripts/deploy-simple.sh` for easy deployment

## 📚 Template Documentation

### 🚀 Essential Guides

- **[Simplified Workflow](docs/development/simplified-workflow.md)** - Streamlined development process
- **[Template Setup Guide](docs/template-setup-guide.md)** - Complete setup and configuration
- **[Architecture Overview](docs/development/brownfield-architecture.md)** - Technical architecture guide

### 🛠️ Development Resources

- **[Project Structure](docs/development/project-structure.md)** - Code organization
- **[Component Architecture](docs/development/component-architecture.md)** - ECS patterns
- **[Scene Management](docs/development/scene-management.md)** - Phaser scene patterns
- **[Asset Pipeline](docs/development/asset-pipeline.md)** - Asset management
- **[Testing Framework](docs/features/testing-framework.md)** - Testing capabilities

### 🎮 Game Development

- **[Basic Game Example](docs/examples/basic-game.md)** - Complete game walkthrough
- **[Best Practices](docs/examples/best-practices.md)** - Development guidelines
- **[Performance Optimization](docs/features/performance-tools.md)** - Optimization techniques

## 📚 Documentation (Legacy)

### 🚀 Getting Started

- **[Quick Start Guide](docs/setup/quick-start.md)** - 5-minute setup
- **[Detailed Setup](docs/setup/detailed-setup.md)** - Complete installation guide
- **[System Requirements](docs/setup/requirements.md)** - Prerequisites and compatibility
- **[Troubleshooting](docs/setup/troubleshooting.md)** - Common issues and solutions

### 🎮 Features

- **[Features Overview](docs/features/overview.md)** - Complete feature list
- **[Build System](docs/features/build-system.md)** - Vite + TypeScript configuration
- **[Testing Framework](docs/features/testing-framework.md)** - Testing capabilities
- **[CI/CD Pipeline](docs/features/ci-cd-pipeline.md)** - Automated workflows
- **[Health Monitoring](docs/features/health-monitoring.md)** - Performance tracking
- **[Performance Tools](docs/features/performance-tools.md)** - Optimization techniques

### 🛠️ Development

- **[Project Structure](docs/development/project-structure.md)** - Code organization
- **[Component Architecture](docs/development/component-architecture.md)** - ECS patterns
- **[Scene Management](docs/development/scene-management.md)** - Phaser scene patterns
- **[Asset Pipeline](docs/development/asset-pipeline.md)** - Asset management
- **[Debugging Guide](docs/development/debugging.md)** - Debugging techniques

### 🎨 Customization

- **[New Project Setup](docs/customization/new-project-setup.md)** - Customize for your game
- **[Configuration Guide](docs/customization/configuration.md)** - Advanced configuration
- **[Extending Systems](docs/customization/extending-systems.md)** - Add new functionality
- **[Deployment Guide](docs/customization/deployment.md)** - Deploy your game

### 📖 Examples

- **[Basic Game Example](docs/examples/basic-game.md)** - Complete game walkthrough
- **[Component Examples](docs/examples/component-examples.md)** - Component usage patterns
- **[Best Practices](docs/examples/best-practices.md)** - Development guidelines

## 🎮 What's Included

### Game Development Features

- **Phaser 3 Integration**: Latest version with TypeScript support
- **Scene Management**: Organized scene lifecycle and state management
- **Physics Systems**: Matter.js and Arcade Physics configurations
- **Asset Loading**: Efficient asset management and optimization
- **Audio System**: Comprehensive audio handling with Web Audio API
- **Input Handling**: Keyboard, mouse, touch, and gamepad support

### Development Tools

- **TypeScript 5.0+**: Full type safety and modern JavaScript features
- **Vite Build System**: Fast development and optimized production builds
- **Hot Module Replacement**: Instant updates during development
- **Source Maps**: Debug original TypeScript code in production

### Testing & Quality

- **Vitest**: Fast unit testing with TypeScript support
- **Playwright**: Cross-browser E2E testing
- **ESLint**: Code quality and consistency checking
- **Prettier**: Automatic code formatting
- **Husky**: Git hooks for quality gates

### Production Ready

- **CI/CD Pipeline**: GitHub Actions for automated testing and deployment
- **Performance Monitoring**: Built-in FPS and memory tracking
- **Health Checks**: Automated project health reporting
- **Cross-Platform**: Desktop and mobile browser support
- **PWA Ready**: Service worker and offline support configuration

## 📁 Project Structure

```
your-game/
├── src/                          # TypeScript source code
│   ├── main.ts                   # Game initialization and configuration
│   ├── components/               # Reusable game components
│   ├── scenes/                   # Game scenes (Menu, Game, UI)
│   ├── systems/                  # ECS systems and game logic
│   ├── utils/                    # Utility functions and helpers
│   └── types/                    # TypeScript type definitions
├── assets/                       # Game assets
│   ├── source/                   # Source images and audio
│   └── processed/                # Optimized game assets
├── config/                       # Build and development configuration
│   ├── build/                    # TypeScript and Vite configuration
│   ├── development/              # ESLint and development tools
│   └── deployment/               # Deployment configuration
├── testing/                      # Test configuration and files
│   ├── unit/                     # Unit test files
│   ├── e2e/                      # End-to-end test files
│   └── config/                   # Testing configuration
├── tools/                        # Development and build tools
│   ├── build/                    # Build automation scripts
│   ├── deployment/               # Deployment scripts
│   ├── monitoring/               # Health check and monitoring
│   └── development/              # Development utilities
└── docs/                         # Documentation
    ├── api/                      # API documentation
    ├── developers/               # Developer guides
    └── technical/                # Technical specifications
```

## 🛠 Development Workflow

### Available Commands

```bash
# Development
npm run dev                       # Start development server
npm run build                     # Build for production
npm run preview                   # Preview production build

# Testing
npm run test                      # Run unit tests in watch mode
npm run test:run                  # Run all tests once
npm run test:e2e                  # Run end-to-end tests
npm run test:coverage             # Generate test coverage report

# Code Quality
npm run lint                      # Check code style
npm run lint:fix                  # Fix linting issues
npm run format                    # Format code with Prettier
npm run typecheck                 # TypeScript type checking

# Health & Monitoring
npm run health:check              # Run health diagnostics
npm run health:debt               # Check technical debt
npm run performance:check         # Performance analysis
```

### Development Guidelines

1. **Type Safety**: Use TypeScript strictly, avoid `any` types
2. **Performance**: Target 60 FPS on all supported platforms
3. **Testing**: Write tests for all game logic and components
4. **Code Style**: Follow ESLint and Prettier configurations
5. **Assets**: Use the asset pipeline for optimization
6. **Documentation**: Document public APIs and complex logic

## 🎮 Game Development Features

### Phaser 3 Setup

- Pre-configured scenes architecture
- Component-based game objects
- Asset loading and management
- Input handling system
- Audio management

### Development Tools

- Hot module replacement for fast iteration
- Source maps for debugging
- TypeScript strict mode
- Comprehensive linting rules
- Automated formatting

### Testing Infrastructure

- Unit testing with Vitest
- E2E testing with Playwright
- Visual regression testing
- Performance benchmarking
- Coverage reporting

### Build & Deployment

- Optimized production builds
- Asset bundling and compression
- Environment configuration
- Health monitoring
- Deployment automation

## 📊 Health & Monitoring

This template includes comprehensive monitoring tools:

- **Health Checks**: Automated system health validation
- **Performance Monitoring**: FPS tracking and optimization alerts
- **Technical Debt Tracking**: Code quality metrics and warnings
- **Build Health**: CI/CD pipeline status and build metrics

Run health checks regularly:

```bash
npm run health:check      # Full health diagnostic
npm run health:report     # Generate health report
```

## 🚀 Deployment

### Environment Configuration

The template supports multiple environments:

- **Development**: Local development with hot reload
- **Testing**: Automated testing environment
- **Staging**: Pre-production testing
- **Production**: Optimized production deployment

### Deployment Commands

```bash
npm run deploy:staging        # Deploy to staging
npm run deploy:production     # Deploy to production
npm run rollback             # Rollback deployment
```

### CI/CD Pipeline

The template includes GitHub Actions workflows for:

- Automated testing on pull requests
- Code quality checks and linting
- Performance regression testing
- Automated deployment to staging/production

## 📝 Customizing Your Game

### 1. Basic Setup

1. Update `package.json` with your game details
2. Replace placeholder assets in `assets/source/`
3. Modify `src/main.ts` for your game configuration
4. Update `index.html` with your game title and metadata

### 2. Game Content

1. Create your scenes in `src/scenes/`
2. Add game components in `src/components/`
3. Implement game systems in `src/systems/`
4. Add assets and configure loading

### 3. Deployment Setup

1. Configure your hosting provider
2. Update deployment scripts in `tools/deployment/`
3. Set up environment variables
4. Test the deployment pipeline

## 🤝 Contributing

This template is designed to be forked and customized for your specific game. Consider contributing improvements back to the template:

1. Fork the repository
2. Create a feature branch
3. Make your improvements
4. Ensure all tests pass
5. Submit a pull request

## 📄 License

MIT License - see LICENSE file for details.

## 🆘 Support

For template-related issues:

- Check the documentation in `docs/`
- Review the health check reports
- Use the debugging tools included
- Check GitHub issues for common problems

For game development help:

- Phaser 3 documentation: [phaser.io](https://phaser.io/phaser3)
- TypeScript handbook: [typescriptlang.org](https://www.typescriptlang.org/)
- Vite documentation: [vitejs.dev](https://vitejs.dev/)

---

**Happy Game Development!** 🎮
