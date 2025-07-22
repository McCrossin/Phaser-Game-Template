# 🚀 Phaser Game Template Setup Guide

**Complete setup instructions for creating your game project from the Phaser Game Template.**

## Prerequisites

Before setting up your project, ensure you have:

- **Node.js 18+** ([Download here](https://nodejs.org/))
- **Git** for version control
- **Code Editor** (VS Code recommended with TypeScript support)
- **Web Browser** (Chrome or Firefox recommended for development)

## Setup Methods

### Method 1: GitHub Template (Recommended)

The fastest way to start your game project:

1. **Create Repository from Template**
   - Go to [McCrossin/Phaser-Game-Template](https://github.com/McCrossin/Phaser-Game-Template)
   - Click **"Use this template"** → **"Create a new repository"**
   - Choose repository name and settings
   - Clone your new repository

2. **Initialize Your Project**
   ```bash
   cd your-game-repository
   npm install
   npm run dev
   ```

3. **Verify Setup**
   - Browser should open to `http://localhost:5173`
   - You should see the demo game running
   - Check that hot reload works by editing files

### Method 2: Manual Clone

For direct cloning and customization:

1. **Clone Template**
   ```bash
   git clone https://github.com/McCrossin/Phaser-Game-Template.git my-game
   cd my-game
   ```

2. **Remove Template Git History** (Optional)
   ```bash
   rm -rf .git
   git init
   git add .
   git commit -m "Initial commit from Phaser Game Template"
   ```

3. **Install and Start**
   ```bash
   npm install
   npm run dev
   ```

## Project Customization

### 1. Basic Configuration

Edit `project.config` to customize your game:

```ini
[game]
title = "Your Game Title"
width = 1280
height = 720

[user]
id = "your-unique-id"

[editor]
editor_version = "1.1.2"
phaser_version = "3.88.2"
```

### 2. Package Information

Update `package.json` with your project details:

```json
{
  "name": "your-game-name",
  "version": "1.0.0",
  "description": "Your game description",
  "author": "Your Name",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/your-repo.git"
  }
}
```

### 3. Game Configuration

Modify `src/config/GameConfig.ts` for game-specific settings:

```typescript
export const GAME_CONFIG = {
    title: 'Your Game Title',
    width: 1280,
    height: 720,
    backgroundColor: '#2c3e50',
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    }
};
```

### 4. Asset Replacement

Replace demo assets with your game assets:

1. **Remove demo assets** from `assets/` directory
2. **Add your assets** (sprites, sounds, etc.)
3. **Update asset loading** in your scenes
4. **Run asset pipeline**: `npm run build:assets`

## Development Workflow

### Available Scripts

```bash
# Development
npm run dev          # Start development server with hot reload
npm run build        # Build production version
npm run preview      # Preview production build locally

# Testing
npm test            # Run unit tests
npm run test:e2e    # Run end-to-end tests
npm run test:perf   # Run performance tests

# Code Quality
npm run lint        # Check code quality
npm run lint:fix    # Fix linting issues
npm run format      # Format code with Prettier

# Asset Management
npm run build:assets    # Process and optimize assets
npm run clean:assets    # Clean processed assets
```

### Development Tools

- **Hot Reload**: Automatic browser refresh on file changes
- **TypeScript**: Real-time type checking and IntelliSense
- **Performance Monitor**: Press F3 in-game to toggle FPS counter
- **Debug Mode**: Set `debug: true` in game config for development features

## Project Structure

```
your-game/
├── src/
│   ├── main.ts              # Game entry point
│   ├── config/              # Game configuration
│   ├── scenes/              # Game scenes
│   ├── components/          # ECS components
│   ├── systems/             # ECS systems
│   ├── types/               # TypeScript types
│   └── utils/               # Utility functions
├── assets/                  # Game assets
│   ├── processed/           # Optimized assets
│   └── source/              # Source assets
├── tests/                   # Test files
├── docs/                    # Documentation
└── config/                  # Build configuration
```

## Customization Areas

### 1. Game Scenes

Create your game scenes in `src/scenes/`:

```typescript
export class YourGameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'YourGameScene' });
    }

    preload() {
        // Load your assets
    }

    create() {
        // Initialize your game
    }

    update() {
        // Game loop logic
    }
}
```

### 2. Component System

Add game-specific components in `src/components/`:

```typescript
export interface YourComponent {
    health: number;
    damage: number;
    // ... your properties
}
```

### 3. Game Systems

Implement game logic in `src/systems/`:

```typescript
export class YourSystem {
    update(entities: Entity[], deltaTime: number) {
        // Your system logic
    }
}
```

## Deployment

### Local Production Build

```bash
npm run build
npm run preview
```

### GitHub Pages Deployment

The template includes GitHub Actions for automatic deployment:

1. **Enable GitHub Pages** in repository settings
2. **Push to main branch** - deployment runs automatically
3. **Access your game** at `https://yourusername.github.io/your-repo`

### Custom Deployment

The build output in `dist/` can be deployed to any static hosting service:

- **Netlify**: Drag and drop `dist` folder
- **Vercel**: Connect GitHub repository
- **AWS S3**: Upload `dist` contents
- **Custom Server**: Serve `dist` with any web server

## Troubleshooting

### Common Issues

**Port already in use:**
```bash
npm run dev -- --port 3000
```

**TypeScript errors:**
- Check `tsconfig.json` configuration
- Ensure all dependencies are installed
- Restart TypeScript language server in your editor

**Asset loading issues:**
- Verify asset paths are correct
- Run `npm run build:assets` to regenerate asset manifest
- Check browser console for loading errors

**Performance issues:**
- Enable debug mode to monitor FPS
- Run performance tests: `npm run test:perf`
- Check browser developer tools performance tab

### Getting Help

- **Documentation**: Check `docs/` directory for detailed guides
- **Issues**: Create GitHub issues for bugs or questions
- **Community**: Join the Phaser community forums
- **Examples**: Browse `docs/examples/` for implementation patterns

## Next Steps

1. **Read the Architecture Guide**: `docs/development/brownfield-architecture.md`
2. **Review Code Examples**: Browse `docs/examples/` directory
3. **Set Up CI/CD**: Configure automated testing and deployment
4. **Start Building**: Create your first game scene and components!

---

**Template Version**: 2.0  
**Last Updated**: July 22, 2025  
**Compatibility**: Node.js 18+, Phaser 3.70+, TypeScript 5.0+
