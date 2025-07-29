# Simplified Development Workflow

This guide covers the streamlined development workflow for the Phaser Game Template after the template cleanup.

## 🎯 Overview

The template has been simplified to focus on essential game development needs while maintaining all core functionality. Complex enterprise features have been moved to optional directories or removed entirely.

## 🚀 Quick Development Workflow

### 1. Start Development

```bash
npm install
npm run dev
```

Your game will be available at `http://localhost:5173` with hot reload enabled.

### 2. Build Your Game

```bash
npm run build
```

This creates an optimized production build in the `dist/` directory.

### 3. Test Your Game

**Core Testing (always available):**
```bash
npm run test           # Run unit tests
npm run test:watch     # Run tests in watch mode
npm run typecheck      # TypeScript validation
npm run lint           # Code quality checks
```

**Advanced Testing (optional):**
See `testing/advanced/README.md` for E2E tests, visual regression, and performance benchmarking.

### 4. Deploy Your Game

**Simple Deployment:**
```bash
./scripts/deploy-simple.sh staging
./scripts/deploy-simple.sh production
```

**Automatic Deployment:**
Push to `main` branch triggers automatic GitHub Pages deployment via GitHub Actions.

## 📁 Simplified Project Structure

```
Phaser-Game-Template/
├── src/                      # Game source code
├── assets/                   # Game assets
├── environments/             # Environment configurations
├── testing/
│   ├── core/                # Essential tests (always enabled)
│   └── advanced/            # Optional advanced testing
├── config/
│   ├── build/               # Build configurations
│   ├── development/         # Development tools config
│   ├── deployment/simple/   # Simple deployment configs
│   └── monitoring/          # Basic game performance config
├── scripts/
│   └── deploy-simple.sh     # Simple deployment script
└── .github/workflows/
    ├── ci.yml               # Core CI pipeline
    └── deploy-simple.yml    # Simple deployment
```

## 🔧 Environment Configurations

- **`environments/development.json`** - Development settings (debug enabled, profiling on)
- **`environments/staging.json`** - Staging settings (debug on, production-like)
- **`environments/production.json`** - Production settings (debug off, optimized)
- **`environments/testing.json`** - Testing settings (minimal config)

## 📊 Performance Monitoring

**Essential Monitoring (built-in):**
- FPS tracking during development
- Bundle size validation
- Basic load time monitoring

**Advanced Monitoring (optional):**
Complex performance analysis is available but not enabled by default.

## 🚀 CI/CD Pipeline

**Simplified GitHub Actions:**
- **`ci.yml`** - Builds, tests, and validates your game
- **`deploy-simple.yml`** - Simple deployment to GitHub Pages

**Removed Complex Workflows:**
- Enterprise health monitoring
- Advanced performance analysis
- Complex deployment gates
- Security scanning (basic security is included in CI)

## 🎮 Game Development Focus

This simplified template lets you focus on:

1. **Building your game** with Phaser 3 + TypeScript
2. **Testing core functionality** with essential test suite
3. **Deploying easily** with simple scripts
4. **Maintaining performance** with basic monitoring

**Advanced features are available when needed** in the `testing/advanced/` directory.

## 🛠️ Development Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Build for production |
| `npm run preview` | Preview production build |
| `npm run test` | Run unit tests |
| `npm run lint` | Check code quality |
| `npm run typecheck` | TypeScript validation |
| `npm run performance:check` | Basic performance validation |

## 📚 Next Steps

1. **Edit** `src/scenes/GameScene.ts` to build your game
2. **Add assets** to the `assets/` directory
3. **Write tests** in `testing/core/unit/`
4. **Deploy** using `./scripts/deploy-simple.sh`
5. **Enable advanced features** only when needed

## 🎯 When to Use Advanced Features

- **E2E Testing**: For complex user journey validation
- **Visual Regression**: When visual consistency is critical
- **Performance Benchmarking**: For detailed optimization work
- **Complex Deployment**: For enterprise environments

See individual directories for setup instructions when you need these features.
