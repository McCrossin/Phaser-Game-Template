# Phaser Game Template

## 🎯 Template Overview

**Phaser Game Template** is a professional 2D game development template built with Phaser 3, TypeScript, and modern development tools. This template provides a complete foundation for creating high-quality 2D games with built-in CI/CD, health monitoring, and performance optimization.

### Template Features

- **Phaser 3 + TypeScript**: Modern game development with type safety
- **Vite Build System**: Fast development and optimized production builds
- **Comprehensive Testing**: Unit tests, E2E tests, and performance testing
- **CI/CD Pipeline**: Automated testing, linting, and deployment
- **Health Monitoring**: Built-in health checks and technical debt tracking
- **Performance Tools**: 60 FPS optimization and performance benchmarking
- **Asset Pipeline**: Automated texture packing and asset optimization
- **Modern Tooling**: ESLint, Prettier, Husky, and more

## 🚀 Quick Start

### Prerequisites

- **Node.js 18+** (Download from [nodejs.org](https://nodejs.org/))
- **Git** (For version control)
- **VS Code** (Recommended IDE with TypeScript support)

### Creating Your Game

```bash
# 1. Use this template (click "Use this template" on GitHub)
# or clone directly:
git clone <your-repository-url>
cd your-game-name

# 2. Install dependencies
npm install

# 3. Start development server
npm run dev

# 4. Open browser (should auto-open to http://localhost:3000)
```

### Template Customization

1. **Update package.json**: Change name, description, author, and keywords
2. **Modify game content**: Replace placeholder scenes and assets
3. **Configure deployment**: Update deployment scripts for your hosting
4. **Customize branding**: Replace favicon, thumbnails, and metadata

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
