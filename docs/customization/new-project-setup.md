# New Project Setup Guide

Transform the Phaser Game Template into your unique game project with this comprehensive customization guide.

## Quick Customization Checklist

### ✅ Essential Changes (5 minutes)

- [ ] **Project Identity**
  - [ ] Update `package.json` (name, description, author)
  - [ ] Modify `index.html` title and meta tags
  - [ ] Replace favicon and thumbnails
  
- [ ] **Game Configuration**
  - [ ] Edit `src/config/GameConfig.ts` (title, dimensions)
  - [ ] Update game scenes in `src/scenes/`
  - [ ] Replace placeholder assets in `assets/`

- [ ] **Version Control**
  - [ ] Initialize new Git repository
  - [ ] Update README.md with your game description
  - [ ] Configure GitHub repository settings

### 🎮 Game-Specific Changes (30 minutes)

- [ ] **Core Gameplay**
  - [ ] Design your main game scene
  - [ ] Implement game mechanics
  - [ ] Create player and enemy behaviors
  
- [ ] **Visual Assets**
  - [ ] Replace character sprites
  - [ ] Add background graphics
  - [ ] Create UI elements
  
- [ ] **Audio Integration**
  - [ ] Add game music and sound effects
  - [ ] Configure audio system
  
- [ ] **Game Balance**
  - [ ] Configure physics settings
  - [ ] Set gameplay parameters
  - [ ] Define difficulty progression

## Detailed Customization Steps

### 1. Project Identity Setup

#### Update Package Configuration

Edit `package.json` with your project details:

```json
{
  "name": "my-awesome-game",
  "version": "1.0.0",
  "description": "An amazing 2D adventure game built with Phaser 3",
  "author": "Your Name <your.email@example.com>",
  "license": "MIT",
  "keywords": [
    "phaser",
    "game",
    "2d",
    "typescript",
    "adventure",
    "puzzle"
  ],
  "homepage": "https://yourusername.github.io/my-awesome-game",
  "repository": {
    "type": "git",
    "url": "https://github.com/yourusername/my-awesome-game.git"
  },
  "bugs": {
    "url": "https://github.com/yourusername/my-awesome-game/issues"
  }
}
```

#### Update HTML Metadata

Modify `index.html` for your game:

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  
  <!-- Game Identity -->
  <title>My Awesome Game - Epic 2D Adventure</title>
  <meta name="description" content="Join the adventure in this amazing 2D puzzle game. Explore mystical worlds and solve challenging puzzles!" />
  <meta name="keywords" content="2d game, puzzle, adventure, phaser, html5" />
  <meta name="author" content="Your Name" />
  
  <!-- Social Media Meta Tags -->
  <meta property="og:title" content="My Awesome Game" />
  <meta property="og:description" content="Epic 2D adventure game with challenging puzzles" />
  <meta property="og:image" content="/thumbnail.png" />
  <meta property="og:url" content="https://yourusername.github.io/my-awesome-game" />
  <meta property="og:type" content="website" />
  
  <!-- Twitter Card -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="My Awesome Game" />
  <meta name="twitter:description" content="Epic 2D adventure game" />
  <meta name="twitter:image" content="/thumbnail.png" />
  
  <!-- Favicon and Icons -->
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="alternate icon" href="/favicon.ico" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
  
  <!-- PWA Manifest -->
  <link rel="manifest" href="/manifest.json" />
</head>
<body>
  <div id="game-container"></div>
  <script type="module" src="/src/main.ts"></script>
</body>
</html>
```

#### Create Custom Icons

Replace the default icons with your game's branding:

```bash
# Icon files to replace
/favicon.svg              # SVG favicon (recommended)
/favicon.ico              # ICO favicon (fallback)
/apple-touch-icon.png     # Apple touch icon (180x180)
/thumbnail.png            # Social media thumbnail (1200x630)
```

### 2. Game Configuration

#### Update Game Settings

Modify `src/config/GameConfig.ts`:

```typescript
import Phaser from 'phaser';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  // Game identity
  title: 'My Awesome Game',
  version: '1.0.0',
  
  // Display configuration
  type: Phaser.AUTO,
  width: 1024,        // Your game width
  height: 768,        // Your game height
  parent: 'game-container',
  
  // Rendering settings
  backgroundColor: '#2c3e50',  // Your theme color
  
  // Physics configuration
  physics: {
    default: 'matter',  // or 'arcade' for simpler physics
    matter: {
      gravity: { y: 0.8 },  // Adjust for your game
      debug: false  // Set to true for development
    }
  },
  
  // Scene configuration
  scene: [
    // List your scenes in order
    'BootScene',
    'MenuScene', 
    'GameScene',
    'GameOverScene'
  ],
  
  // Audio settings
  audio: {
    disableWebAudio: false,
    context: false
  },
  
  // Input configuration
  input: {
    keyboard: true,
    mouse: true,
    touch: true,
    gamepad: false  // Enable if you want gamepad support
  },
  
  // Scale manager for responsive design
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 320,
      height: 240
    },
    max: {
      width: 1920,
      height: 1080
    }
  }
};
```

#### Environment-Specific Configuration

Create environment configurations in `environments/`:

**environments/development.json:**
```json
{
  "gameConfig": {
    "physics": {
      "matter": {
        "debug": true
      }
    },
    "scale": {
      "mode": "FIT"
    }
  },
  "features": {
    "showFPS": true,
    "debugMode": true,
    "skipIntro": true
  }
}
```

**environments/production.json:**
```json
{
  "gameConfig": {
    "physics": {
      "matter": {
        "debug": false
      }
    }
  },
  "features": {
    "showFPS": false,
    "debugMode": false,
    "skipIntro": false
  },
  "analytics": {
    "enabled": true,
    "trackingId": "your-analytics-id"
  }
}
```

### 3. Scene Customization

#### Create Your Main Menu

Customize `src/scenes/MenuScene.ts`:

```typescript
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  preload() {
    // Load menu assets
    this.load.image('logo', 'assets/ui/logo.png');
    this.load.image('startButton', 'assets/ui/start-button.png');
    this.load.audio('menuMusic', 'assets/audio/menu-theme.ogg');
  }

  create() {
    // Add background
    const bg = this.add.image(512, 384, 'menuBackground');
    bg.setDisplaySize(1024, 768);

    // Add game logo
    const logo = this.add.image(512, 200, 'logo');
    logo.setScale(0.8);

    // Create animated title
    const title = this.add.text(512, 300, 'MY AWESOME GAME', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      color: '#ffffff',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);

    // Add pulsing animation
    this.tweens.add({
      targets: title,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1
    });

    // Create start button
    const startButton = this.add.image(512, 500, 'startButton')
      .setInteractive()
      .on('pointerdown', () => this.startGame())
      .on('pointerover', () => startButton.setTint(0xcccccc))
      .on('pointerout', () => startButton.clearTint());

    // Play menu music
    this.sound.play('menuMusic', { loop: true, volume: 0.5 });
  }

  private startGame() {
    this.sound.stopAll();
    this.scene.start('GameScene');
  }
}
```

#### Design Your Game Scene

Create your main gameplay in `src/scenes/GameScene.ts`:

```typescript
export class GameScene extends Phaser.Scene {
  private player!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private score = 0;
  private scoreText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload() {
    // Load game assets
    this.load.spritesheet('player', 'assets/characters/player.png', {
      frameWidth: 32,
      frameHeight: 48
    });
    this.load.image('background', 'assets/backgrounds/game-bg.png');
    this.load.audio('bgMusic', 'assets/audio/game-music.ogg');
  }

  create() {
    // Setup background
    this.add.image(512, 384, 'background');

    // Create player
    this.player = this.add.sprite(100, 400, 'player');
    this.physics.add.existing(this.player);

    // Setup player animations
    this.anims.create({
      key: 'walk',
      frames: this.anims.generateFrameNumbers('player', { start: 0, end: 3 }),
      frameRate: 10,
      repeat: -1
    });

    // Setup controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // Create UI
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '32px',
      color: '#000'
    });

    // Start background music
    this.sound.play('bgMusic', { loop: true, volume: 0.3 });
  }

  update() {
    // Player movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
      this.player.anims.play('walk', true);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
      this.player.anims.play('walk', true);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
      this.player.anims.stop();
    }

    if (this.cursors.up.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
    }
  }

  private updateScore(points: number) {
    this.score += points;
    this.scoreText.setText('Score: ' + this.score);
  }
}
```

### 4. Asset Integration

#### Organize Your Assets

Create a systematic asset structure:

```
assets/
├── characters/
│   ├── player/
│   │   ├── player-idle.png
│   │   ├── player-walk.png
│   │   └── player-jump.png
│   └── enemies/
│       ├── enemy1-sprites.png
│       └── enemy2-sprites.png
├── backgrounds/
│   ├── level1-bg.png
│   ├── level2-bg.png
│   └── menu-bg.png
├── ui/
│   ├── buttons/
│   ├── panels/
│   └── icons/
├── audio/
│   ├── music/
│   │   ├── menu-theme.ogg
│   │   └── level1-music.ogg
│   └── sfx/
│       ├── jump.wav
│       ├── collect.wav
│       └── explosion.wav
└── data/
    ├── levels/
    └── configs/
```

#### Asset Loading Configuration

Create `src/config/AssetConfig.ts`:

```typescript
export interface AssetDefinition {
  key: string;
  type: 'image' | 'spritesheet' | 'audio' | 'json';
  url: string;
  config?: any;
}

export const gameAssets: AssetDefinition[] = [
  // Character assets
  {
    key: 'player',
    type: 'spritesheet',
    url: 'assets/characters/player/player-spritesheet.png',
    config: { frameWidth: 32, frameHeight: 48 }
  },
  
  // Background assets
  {
    key: 'level1-bg',
    type: 'image',
    url: 'assets/backgrounds/level1-bg.png'
  },
  
  // Audio assets
  {
    key: 'bgMusic',
    type: 'audio',
    url: 'assets/audio/music/level1-music.ogg'
  },
  
  // Game data
  {
    key: 'level1-data',
    type: 'json',
    url: 'assets/data/levels/level1.json'
  }
];

// Asset loading helper
export function loadAssets(scene: Phaser.Scene, assets: AssetDefinition[]) {
  assets.forEach(asset => {
    switch (asset.type) {
      case 'image':
        scene.load.image(asset.key, asset.url);
        break;
      case 'spritesheet':
        scene.load.spritesheet(asset.key, asset.url, asset.config);
        break;
      case 'audio':
        scene.load.audio(asset.key, asset.url);
        break;
      case 'json':
        scene.load.json(asset.key, asset.url);
        break;
    }
  });
}
```

### 5. Game Mechanics Implementation

#### Create Game Components

Implement your game's core mechanics:

```typescript
// src/components/PlayerController.ts
export class PlayerController {
  private player: Phaser.GameObjects.Sprite;
  private cursors: Phaser.Types.Input.Keyboard.CursorKeys;
  private jumpSound: Phaser.Sound.BaseSound;

  constructor(scene: Phaser.Scene, player: Phaser.GameObjects.Sprite) {
    this.player = player;
    this.cursors = scene.input.keyboard.createCursorKeys();
    this.jumpSound = scene.sound.add('jumpSound');
  }

  update() {
    // Implement your player movement logic
    this.handleMovement();
    this.handleJumping();
    this.handleAnimations();
  }

  private handleMovement() {
    const speed = 200;
    
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-speed);
      this.player.setFlipX(true);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(speed);
      this.player.setFlipX(false);
    } else {
      this.player.setVelocityX(0);
    }
  }

  private handleJumping() {
    if (this.cursors.up.isDown && this.isOnGround()) {
      this.player.setVelocityY(-400);
      this.jumpSound.play();
    }
  }

  private handleAnimations() {
    if (this.player.body.velocity.x !== 0) {
      this.player.anims.play('player-walk', true);
    } else {
      this.player.anims.play('player-idle');
    }
  }

  private isOnGround(): boolean {
    return this.player.body.touching.down;
  }
}
```

#### Game State Management

Create a game state system:

```typescript
// src/systems/GameState.ts
export interface GameState {
  score: number;
  lives: number;
  level: number;
  time: number;
}

export class GameStateManager {
  private state: GameState = {
    score: 0,
    lives: 3,
    level: 1,
    time: 0
  };

  private listeners: Map<string, Function[]> = new Map();

  getState(): GameState {
    return { ...this.state };
  }

  updateScore(points: number) {
    this.state.score += points;
    this.emit('scoreChanged', this.state.score);
  }

  loseLife() {
    this.state.lives--;
    this.emit('livesChanged', this.state.lives);
    
    if (this.state.lives <= 0) {
      this.emit('gameOver');
    }
  }

  nextLevel() {
    this.state.level++;
    this.emit('levelChanged', this.state.level);
  }

  on(event: string, callback: Function) {
    if (!this.listeners.has(event)) {
      this.listeners.set(event, []);
    }
    this.listeners.get(event)!.push(callback);
  }

  private emit(event: string, ...args: any[]) {
    const callbacks = this.listeners.get(event) || [];
    callbacks.forEach(callback => callback(...args));
  }
}
```

### 6. Customization Checklist

#### Complete Customization Tasks

**Visual Branding:**
- [ ] Replace all placeholder graphics
- [ ] Create consistent visual style
- [ ] Design UI elements (buttons, panels, icons)
- [ ] Add particle effects and animations
- [ ] Create loading screens and transitions

**Audio Design:**
- [ ] Add background music for each scene
- [ ] Implement sound effects for actions
- [ ] Create audio settings/volume controls
- [ ] Add voice acting (optional)
- [ ] Implement dynamic audio mixing

**Gameplay Features:**
- [ ] Implement core game mechanics
- [ ] Create level progression system
- [ ] Add scoring and achievements
- [ ] Implement save/load functionality
- [ ] Create difficulty settings

**User Experience:**
- [ ] Add settings menu
- [ ] Implement pause functionality
- [ ] Create help/tutorial system
- [ ] Add accessibility options
- [ ] Optimize for mobile devices

**Technical Polish:**
- [ ] Performance optimization
- [ ] Error handling and fallbacks
- [ ] Cross-browser testing
- [ ] Mobile responsiveness
- [ ] SEO optimization

## Deployment Preparation

### Pre-Deployment Checklist

Before deploying your customized game:

```bash
# 1. Run full test suite
npm run test

# 2. Build production version
npm run build

# 3. Test production build locally
npm run preview

# 4. Run health checks
npm run health

# 5. Generate documentation
npm run docs

# 6. Update version numbers
npm version patch  # or minor/major
```

### Deployment Configuration

Update deployment settings in your customized project:

```typescript
// vite.config.ts - Deployment configuration
export default defineConfig({
  base: '/my-awesome-game/',  // GitHub Pages path
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    sourcemap: false,  // Disable for production
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser'],
          game: ['./src/main.ts']
        }
      }
    }
  }
});
```

---

**Your Game is Ready!** 🎉

Your customized Phaser game template is now ready for development and deployment. Continue with:

- [Configuration Guide](configuration.md) - Advanced configuration options
- [Extending Systems](extending-systems.md) - Add new functionality
- [Deployment Guide](deployment.md) - Deploy your game to the web
