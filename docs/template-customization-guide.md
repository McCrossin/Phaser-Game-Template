# 🎨 Template Customization Guide

**Complete guide for customizing the Phaser Game Template for your specific game project.**

## Customization Overview

This template provides a flexible foundation that can be adapted for various types of 2D games. This guide covers systematic customization from basic configuration to advanced architectural modifications.

## Basic Customization

### 1. Project Identity

#### Update Package Information

Edit `package.json`:

```json
{
  "name": "your-game-name",
  "version": "1.0.0",
  "description": "Your awesome game description",
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/your-game.git"
  },
  "homepage": "https://yourusername.github.io/your-game",
  "keywords": ["phaser", "game", "typescript", "your-genre"]
}
```

#### Configure Game Settings

Update `project.config`:

```ini
[game]
title = "Your Game Title"
width = 1920
height = 1080
# Adjust dimensions for your target platform

[user]
id = "your-unique-developer-id"

[editor]
editor_version = "1.1.2"
phaser_version = "3.88.2"
```

#### Update Main README

Customize `README.md` with your game information:

- Replace template badges with your project badges
- Update game description and features
- Add your screenshots and gameplay GIFs
- Include your specific setup instructions

### 2. Visual Identity

#### Replace Demo Assets

1. **Remove template assets** from `assets/source/`:
   ```bash
   rm assets/source/sprites/*
   rm assets/phaser.png assets/space.png assets/spaceship.png
   ```

2. **Add your assets**:
   ```
   assets/source/
   ├── sprites/
   │   ├── player/
   │   ├── enemies/
   │   └── ui/
   ├── audio/
   │   ├── music/
   │   ├── sfx/
   └── fonts/
   ```

3. **Process assets**:
   ```bash
   npm run build:assets
   ```

#### Update Game Configuration

Modify `src/config/GameConfig.ts`:

```typescript
export const GAME_CONFIG = {
    title: 'Your Game Title',
    width: 1920,
    height: 1080,
    backgroundColor: '#your-background-color',
    pixelArt: true, // Enable for pixel art games
    physics: {
        default: 'arcade', // or 'matter' for advanced physics
        arcade: {
            gravity: { y: 300 }, // Adjust for your game type
            debug: false
        }
    },
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH
    }
};
```

## Game-Specific Customization

### 1. Scene Architecture

#### Create Your Scenes

Replace template scenes with your game scenes:

```typescript
// src/scenes/MenuScene.ts
export class MenuScene extends Phaser.Scene {
    constructor() {
        super({ key: 'MenuScene' });
    }

    preload() {
        this.load.image('menu-bg', 'assets/ui/menu-background.png');
        this.load.image('play-button', 'assets/ui/play-button.png');
    }

    create() {
        this.add.image(960, 540, 'menu-bg');
        
        const playButton = this.add.image(960, 540, 'play-button')
            .setInteractive()
            .on('pointerdown', () => {
                this.scene.start('GameScene');
            });
    }
}
```

#### Update Scene Registration

Modify `src/main.ts` to include your scenes:

```typescript
import { MenuScene } from './scenes/MenuScene';
import { GameScene } from './scenes/GameScene';
import { UIScene } from './scenes/UIScene';

const config: Phaser.Types.Core.GameConfig = {
    // ... other config
    scene: [MenuScene, GameScene, UIScene]
};
```

### 2. Component System Customization

#### Define Game-Specific Components

Create components for your game mechanics in `src/components/`:

```typescript
// src/components/GameComponents.ts
export interface HealthComponent {
    maxHealth: number;
    currentHealth: number;
    invulnerable: boolean;
}

export interface WeaponComponent {
    damage: number;
    fireRate: number;
    lastFired: number;
    ammo: number;
}

export interface InventoryComponent {
    items: string[];
    capacity: number;
}

// Export all components for easy access
export type GameComponents = {
    health: HealthComponent;
    weapon: WeaponComponent;
    inventory: InventoryComponent;
    // ... add your components
};
```

#### Implement Game Systems

Create systems for your game logic in `src/systems/`:

```typescript
// src/systems/CombatSystem.ts
export class CombatSystem {
    update(entities: Entity[], deltaTime: number) {
        entities.forEach(entity => {
            if (this.hasComponents(entity, ['health', 'weapon'])) {
                this.updateCombat(entity, deltaTime);
            }
        });
    }

    private updateCombat(entity: Entity, deltaTime: number) {
        // Your combat logic
    }

    private hasComponents(entity: Entity, components: string[]): boolean {
        return components.every(comp => entity.components[comp]);
    }
}
```

### 3. Input System Customization

#### Define Input Mappings

Create your input configuration in `src/config/InputConfig.ts`:

```typescript
export const INPUT_CONFIG = {
    // Keyboard mappings
    keys: {
        MOVE_LEFT: ['ArrowLeft', 'A'],
        MOVE_RIGHT: ['ArrowRight', 'D'],
        MOVE_UP: ['ArrowUp', 'W'],
        MOVE_DOWN: ['ArrowDown', 'S'],
        JUMP: ['Space'],
        ATTACK: ['Z', 'J'],
        SPECIAL: ['X', 'K'],
        PAUSE: ['Escape', 'P']
    },

    // Gamepad mappings
    gamepad: {
        MOVE: 'LEFT_STICK',
        JUMP: 'A',
        ATTACK: 'X',
        SPECIAL: 'Y',
        PAUSE: 'START'
    },

    // Touch/mouse mappings
    touch: {
        enabled: true,
        joystick: {
            enabled: true,
            position: { x: 100, y: 500 }
        }
    }
};
```

## Advanced Customization

### 1. Build System Modification

#### Custom Asset Pipeline

Modify `vite-plugins/` to add custom asset processing:

```typescript
// vite-plugins/custom-asset-processor.ts
export function customAssetProcessor() {
    return {
        name: 'custom-asset-processor',
        generateBundle(options, bundle) {
            // Your custom asset processing logic
        }
    };
}
```

#### Environment Configuration

Customize build configurations in `config/`:

```json
// config/development.json
{
    "debug": true,
    "performance": {
        "targetFPS": 60,
        "memoryLimit": "512MB"
    },
    "features": {
        "devTools": true,
        "console": true
    }
}
```

### 2. Testing Customization

#### Game-Specific Tests

Create tests for your game mechanics in `tests/unit/`:

```typescript
// tests/unit/CombatSystem.test.ts
import { CombatSystem } from '../../src/systems/CombatSystem';

describe('CombatSystem', () => {
    let combatSystem: CombatSystem;

    beforeEach(() => {
        combatSystem = new CombatSystem();
    });

    test('applies damage correctly', () => {
        // Your test logic
    });
});
```

#### Performance Tests

Customize performance tests in `tests/e2e/performance/`:

```typescript
// tests/e2e/performance/game-specific-performance.test.ts
test('maintains 60 FPS during intense gameplay', async ({ page }) => {
    await page.goto('/');
    
    // Start intense gameplay scenario
    await page.keyboard.press('Space'); // Start game
    await page.keyboard.press('I'); // Enable intense mode
    
    // Measure performance
    const fpsData = await page.evaluate(() => {
        return window.gamePerformance.getFPS();
    });
    
    expect(fpsData.average).toBeGreaterThan(58);
});
```

### 3. Deployment Customization

#### GitHub Actions Workflow

Customize `.github/workflows/ci.yml` for your needs:

```yaml
name: Your Game CI/CD

on:
  push:
    branches: [ main, develop ]
  pull_request:
    branches: [ main ]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
      
      - name: Install dependencies
        run: npm ci
      
      - name: Run your custom tests
        run: npm run test:game-specific
      
      - name: Build game
        run: npm run build
      
      - name: Deploy to your hosting
        run: npm run deploy:your-service
```

## Game Genre Adaptations

### Platform Games

```typescript
// Typical platform game configuration
export const PLATFORM_CONFIG = {
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 800 },
            debug: false
        }
    },
    features: {
        jumpControls: true,
        scrollingCamera: true,
        collisionDetection: 'tiles'
    }
};
```

### Top-Down Games

```typescript
// Top-down game configuration
export const TOPDOWN_CONFIG = {
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    features: {
        fourDirectionalMovement: true,
        minimap: true,
        worldBounds: true
    }
};
```

### Puzzle Games

```typescript
// Puzzle game configuration
export const PUZZLE_CONFIG = {
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 0 },
            debug: false
        }
    },
    features: {
        turnBased: true,
        gridSystem: true,
        undoSystem: true
    }
};
```

## Performance Optimization

### Asset Optimization

```typescript
// Custom asset optimization settings
export const ASSET_CONFIG = {
    images: {
        quality: 85,
        progressive: true,
        mozjpeg: true
    },
    sprites: {
        padding: 2,
        powerOfTwo: true,
        maxSize: 2048
    },
    audio: {
        bitrate: 128,
        format: 'ogg'
    }
};
```

### Memory Management

```typescript
// Custom memory management
export class AssetManager {
    private loadedAssets = new Map();
    
    loadAsset(key: string, path: string) {
        if (!this.loadedAssets.has(key)) {
            // Load and cache asset
        }
        return this.loadedAssets.get(key);
    }
    
    unloadUnusedAssets() {
        // Clean up unused assets
    }
}
```

## Maintenance and Updates

### Template Updates

When the template receives updates:

1. **Check changelog**: Review template changes
2. **Backup your changes**: Commit your current state
3. **Merge updates**: Carefully integrate template improvements
4. **Test thoroughly**: Ensure your customizations still work

### Version Management

```json
// Track your customization version
{
  "template": {
    "baseVersion": "2.0",
    "customizationVersion": "1.0",
    "lastUpdated": "2025-07-22"
  }
}
```

## Best Practices

1. **Gradual Customization**: Start with basic changes, then move to advanced
2. **Documentation**: Document your customizations for team members
3. **Testing**: Test changes thoroughly before committing
4. **Backup**: Keep backups of working versions
5. **Modularity**: Keep customizations modular for easier updates

---

**Template Version**: 2.0  
**Last Updated**: July 22, 2025  
**Customization Guide Version**: 1.0
