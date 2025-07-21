# Basic Game Example

Learn game development fundamentals by building a simple platformer game with the Phaser Game Template.

## Game Overview

We'll create **"Cosmic Runner"** - a simple side-scrolling platformer where the player:
- Controls a spaceship character
- Collects energy crystals for points
- Avoids obstacles and enemies
- Progresses through increasingly difficult levels

## Project Setup

### 1. Initialize Your Game Project

```bash
# Clone the template
git clone https://github.com/your-username/phaser-game-template.git cosmic-runner
cd cosmic-runner

# Install dependencies
npm install

# Start development
npm run dev
```

### 2. Update Project Configuration

**package.json:**
```json
{
  "name": "cosmic-runner",
  "description": "A simple space-themed platformer game",
  "author": "Your Name",
  "keywords": ["phaser", "platformer", "space", "game"]
}
```

**index.html:**
```html
<title>Cosmic Runner - Space Adventure</title>
<meta name="description" content="Navigate through space obstacles and collect energy crystals in this exciting platformer game!" />
```

## Game Configuration

### Basic Game Setup

**src/config/GameConfig.ts:**
```typescript
import Phaser from 'phaser';

export const gameConfig: Phaser.Types.Core.GameConfig = {
  title: 'Cosmic Runner',
  width: 800,
  height: 600,
  parent: 'game-container',
  backgroundColor: '#1a1a2e',
  
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 300 },
      debug: false
    }
  },
  
  scene: [
    'BootScene',
    'MenuScene',
    'GameScene',
    'GameOverScene'
  ],
  
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  }
};
```

## Asset Organization

### Organize Game Assets

```
assets/
├── characters/
│   └── spaceship.png           # 32x32 player sprite
├── environment/
│   ├── platform.png            # Platform tiles
│   ├── background.png          # Space background
│   └── stars.png               # Particle effect
├── collectibles/
│   └── crystal.png             # Energy crystal (16x16)
├── enemies/
│   └── asteroid.png            # Obstacle sprite
├── audio/
│   ├── collect.wav             # Collection sound
│   ├── jump.wav                # Jump sound
│   └── background-music.ogg    # Background music
└── ui/
    ├── start-button.png
    └── game-over-panel.png
```

## Scene Implementation

### 1. Boot Scene

**src/scenes/BootScene.ts:**
```typescript
export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload() {
    // Create loading bar
    this.createLoadingBar();
    
    // Load all game assets
    this.loadGameAssets();
  }

  create() {
    // Start menu scene after loading
    this.scene.start('MenuScene');
  }

  private createLoadingBar() {
    const width = this.cameras.main.width;
    const height = this.cameras.main.height;
    
    // Progress bar
    const progressBar = this.add.graphics();
    const progressBox = this.add.graphics();
    progressBox.fillStyle(0x222222, 0.8);
    progressBox.fillRect(width / 4, height / 2 - 30, width / 2, 60);
    
    // Loading text
    const loadingText = this.add.text(width / 2, height / 2 - 50, 'Loading...', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Update progress
    this.load.on('progress', (value: number) => {
      progressBar.clear();
      progressBar.fillStyle(0x4ade80, 1);
      progressBar.fillRect(width / 4 + 10, height / 2 - 20, (width / 2 - 20) * value, 40);
    });
  }

  private loadGameAssets() {
    // Character assets
    this.load.image('spaceship', 'assets/characters/spaceship.png');
    
    // Environment assets
    this.load.image('platform', 'assets/environment/platform.png');
    this.load.image('background', 'assets/environment/background.png');
    
    // Collectibles
    this.load.image('crystal', 'assets/collectibles/crystal.png');
    
    // Enemies
    this.load.image('asteroid', 'assets/enemies/asteroid.png');
    
    // Audio
    this.load.audio('collect', 'assets/audio/collect.wav');
    this.load.audio('jump', 'assets/audio/jump.wav');
    this.load.audio('bgMusic', 'assets/audio/background-music.ogg');
    
    // UI
    this.load.image('startButton', 'assets/ui/start-button.png');
  }
}
```

### 2. Menu Scene

**src/scenes/MenuScene.ts:**
```typescript
export class MenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MenuScene' });
  }

  create() {
    // Add background
    this.add.image(400, 300, 'background');
    
    // Game title
    const title = this.add.text(400, 150, 'COSMIC RUNNER', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      color: '#4ade80',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // Subtitle
    this.add.text(400, 200, 'Collect crystals and avoid asteroids!', {
      fontSize: '18px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Start button
    const startButton = this.add.image(400, 350, 'startButton')
      .setInteractive()
      .setScale(1.5)
      .on('pointerdown', () => this.startGame())
      .on('pointerover', () => startButton.setTint(0xcccccc))
      .on('pointerout', () => startButton.clearTint());
    
    // Instructions
    this.add.text(400, 450, 'Use ARROW KEYS to move and SPACE to jump', {
      fontSize: '14px',
      color: '#aaaaaa'
    }).setOrigin(0.5);
    
    // High score display
    const highScore = localStorage.getItem('cosmicRunnerHighScore') || '0';
    this.add.text(400, 500, `High Score: ${highScore}`, {
      fontSize: '16px',
      color: '#ffd700'
    }).setOrigin(0.5);
  }

  private startGame() {
    this.scene.start('GameScene');
  }
}
```

### 3. Main Game Scene

**src/scenes/GameScene.ts:**
```typescript
export class GameScene extends Phaser.Scene {
  // Game objects
  private player!: Phaser.Physics.Arcade.Sprite;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private crystals!: Phaser.Physics.Arcade.Group;
  private asteroids!: Phaser.Physics.Arcade.Group;
  
  // Controls
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private spaceKey!: Phaser.Input.Keyboard.Key;
  
  // Game state
  private score = 0;
  private lives = 3;
  private level = 1;
  
  // UI elements
  private scoreText!: Phaser.GameObjects.Text;
  private livesText!: Phaser.GameObjects.Text;
  private levelText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  create() {
    // Setup background
    this.add.image(400, 300, 'background');
    
    // Create game world
    this.createPlatforms();
    this.createPlayer();
    this.createCollectibles();
    this.createObstacles();
    
    // Setup controls
    this.setupControls();
    
    // Create UI
    this.createUI();
    
    // Setup physics collisions
    this.setupCollisions();
    
    // Start background music
    this.sound.play('bgMusic', { loop: true, volume: 0.5 });
    
    // Start crystal spawn timer
    this.time.addEvent({
      delay: 3000,
      callback: this.spawnCrystal,
      callbackScope: this,
      loop: true
    });
    
    // Start asteroid spawn timer
    this.time.addEvent({
      delay: 2000,
      callback: this.spawnAsteroid,
      callbackScope: this,
      loop: true
    });
  }

  private createPlatforms() {
    this.platforms = this.physics.add.staticGroup();
    
    // Ground platforms
    this.platforms.create(200, 568, 'platform').setScale(2, 1).refreshBody();
    this.platforms.create(600, 568, 'platform').setScale(2, 1).refreshBody();
    
    // Floating platforms
    this.platforms.create(400, 400, 'platform');
    this.platforms.create(150, 250, 'platform');
    this.platforms.create(650, 220, 'platform');
  }

  private createPlayer() {
    this.player = this.physics.add.sprite(100, 450, 'spaceship');
    this.player.setBounce(0.2);
    this.player.setCollideWorldBounds(true);
    this.player.setScale(1.5);
  }

  private createCollectibles() {
    this.crystals = this.physics.add.group({
      key: 'crystal',
      repeat: 5,
      setXY: { x: 200, y: 0, stepX: 100 }
    });

    this.crystals.children.entries.forEach((crystal: any) => {
      crystal.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
      crystal.setTint(Math.random() * 0xffffff);
    });
  }

  private createObstacles() {
    this.asteroids = this.physics.add.group();
  }

  private setupControls() {
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
  }

  private createUI() {
    this.scoreText = this.add.text(16, 16, 'Score: 0', {
      fontSize: '20px',
      color: '#4ade80'
    });
    
    this.livesText = this.add.text(16, 46, 'Lives: 3', {
      fontSize: '20px',
      color: '#ef4444'
    });
    
    this.levelText = this.add.text(16, 76, 'Level: 1', {
      fontSize: '20px',
      color: '#3b82f6'
    });
  }

  private setupCollisions() {
    // Player collides with platforms
    this.physics.add.collider(this.player, this.platforms);
    
    // Collectibles collide with platforms
    this.physics.add.collider(this.crystals, this.platforms);
    
    // Player collects crystals
    this.physics.add.overlap(this.player, this.crystals, this.collectCrystal, undefined, this);
    
    // Player hits asteroids
    this.physics.add.overlap(this.player, this.asteroids, this.hitAsteroid, undefined, this);
    
    // Asteroids collide with platforms
    this.physics.add.collider(this.asteroids, this.platforms);
  }

  update() {
    // Player movement
    if (this.cursors.left.isDown) {
      this.player.setVelocityX(-160);
    } else if (this.cursors.right.isDown) {
      this.player.setVelocityX(160);
    } else {
      this.player.setVelocityX(0);
    }

    // Jumping
    if (this.spaceKey.isDown && this.player.body.touching.down) {
      this.player.setVelocityY(-500);
      this.sound.play('jump');
    }
    
    // Remove off-screen objects
    this.cleanupOffScreenObjects();
  }

  private collectCrystal(player: any, crystal: any) {
    crystal.disableBody(true, true);
    
    // Update score
    this.score += 10;
    this.scoreText.setText('Score: ' + this.score);
    
    // Play collection sound
    this.sound.play('collect');
    
    // Check for level progression
    if (this.score % 100 === 0) {
      this.level++;
      this.levelText.setText('Level: ' + this.level);
    }
  }

  private hitAsteroid(player: any, asteroid: any) {
    asteroid.disableBody(true, true);
    
    // Lose a life
    this.lives--;
    this.livesText.setText('Lives: ' + this.lives);
    
    // Flash player red
    this.player.setTint(0xff0000);
    this.time.delayedCall(200, () => {
      this.player.clearTint();
    });
    
    // Check game over
    if (this.lives <= 0) {
      this.gameOver();
    }
  }

  private spawnCrystal() {
    const x = Phaser.Math.Between(50, 750);
    const crystal = this.crystals.create(x, 0, 'crystal');
    crystal.setBounce(0.7);
    crystal.setCollideWorldBounds(true);
    crystal.setVelocity(Phaser.Math.Between(-50, 50), 20);
    crystal.setTint(Math.random() * 0xffffff);
  }

  private spawnAsteroid() {
    const x = Phaser.Math.Between(50, 750);
    const asteroid = this.asteroids.create(x, 0, 'asteroid');
    asteroid.setBounce(0.3);
    asteroid.setCollideWorldBounds(true);
    asteroid.setVelocity(Phaser.Math.Between(-100, 100), 50);
    asteroid.setAngularVelocity(Phaser.Math.Between(-200, 200));
  }

  private cleanupOffScreenObjects() {
    // Remove crystals that fall off screen
    this.crystals.children.entries.forEach((crystal: any) => {
      if (crystal.y > 600) {
        crystal.destroy();
      }
    });
    
    // Remove asteroids that fall off screen
    this.asteroids.children.entries.forEach((asteroid: any) => {
      if (asteroid.y > 600) {
        asteroid.destroy();
      }
    });
  }

  private gameOver() {
    // Stop all sounds
    this.sound.stopAll();
    
    // Save high score
    const highScore = localStorage.getItem('cosmicRunnerHighScore') || '0';
    if (this.score > parseInt(highScore)) {
      localStorage.setItem('cosmicRunnerHighScore', this.score.toString());
    }
    
    // Transition to game over scene
    this.scene.start('GameOverScene', { score: this.score, level: this.level });
  }
}
```

### 4. Game Over Scene

**src/scenes/GameOverScene.ts:**
```typescript
export class GameOverScene extends Phaser.Scene {
  private finalScore = 0;
  private finalLevel = 1;

  constructor() {
    super({ key: 'GameOverScene' });
  }

  init(data: { score: number, level: number }) {
    this.finalScore = data.score;
    this.finalLevel = data.level;
  }

  create() {
    // Background
    this.add.image(400, 300, 'background');
    
    // Game over title
    this.add.text(400, 150, 'GAME OVER', {
      fontSize: '48px',
      fontFamily: 'Arial Black',
      color: '#ef4444',
      stroke: '#000000',
      strokeThickness: 4
    }).setOrigin(0.5);
    
    // Final score
    this.add.text(400, 250, `Final Score: ${this.finalScore}`, {
      fontSize: '24px',
      color: '#ffffff'
    }).setOrigin(0.5);
    
    // Level reached
    this.add.text(400, 280, `Level Reached: ${this.finalLevel}`, {
      fontSize: '20px',
      color: '#aaaaaa'
    }).setOrigin(0.5);
    
    // High score
    const highScore = localStorage.getItem('cosmicRunnerHighScore') || '0';
    this.add.text(400, 320, `High Score: ${highScore}`, {
      fontSize: '18px',
      color: '#ffd700'
    }).setOrigin(0.5);
    
    // Play again button
    const playAgainText = this.add.text(400, 400, 'PLAY AGAIN', {
      fontSize: '24px',
      color: '#4ade80',
      fontFamily: 'Arial Black'
    }).setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.restartGame())
      .on('pointerover', () => playAgainText.setTint(0xcccccc))
      .on('pointerout', () => playAgainText.clearTint());
    
    // Menu button
    const menuText = this.add.text(400, 450, 'MAIN MENU', {
      fontSize: '20px',
      color: '#ffffff'
    }).setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => this.goToMenu())
      .on('pointerover', () => menuText.setTint(0xcccccc))
      .on('pointerout', () => menuText.clearTint());
  }

  private restartGame() {
    this.scene.start('GameScene');
  }

  private goToMenu() {
    this.scene.start('MenuScene');
  }
}
```

## Game Enhancement Ideas

### 1. Power-ups System

```typescript
// src/objects/PowerUp.ts
export class PowerUp extends Phaser.GameObjects.Sprite {
  public type: 'speed' | 'jump' | 'shield';
  
  constructor(scene: Phaser.Scene, x: number, y: number, type: 'speed' | 'jump' | 'shield') {
    super(scene, x, y, `powerup-${type}`);
    this.type = type;
    scene.add.existing(this);
    scene.physics.add.existing(this);
  }
  
  applyEffect(player: Phaser.Physics.Arcade.Sprite) {
    switch (this.type) {
      case 'speed':
        // Increase player speed temporarily
        break;
      case 'jump':
        // Increase jump height
        break;
      case 'shield':
        // Provide temporary invincibility
        break;
    }
  }
}
```

### 2. Particle Effects

```typescript
// Add explosion effect when collecting items
private collectCrystal(player: any, crystal: any) {
  // Create particle explosion
  const particles = this.add.particles(crystal.x, crystal.y, 'stars', {
    speed: { min: 50, max: 100 },
    scale: { start: 0.5, end: 0 },
    lifespan: 300,
    quantity: 10
  });
  
  // Clean up particles
  this.time.delayedCall(300, () => particles.destroy());
  
  // ... rest of collection logic
}
```

### 3. Level Progression

```typescript
// src/data/LevelConfig.ts
export interface LevelConfig {
  asteroidSpawnRate: number;
  crystalSpawnRate: number;
  difficulty: number;
  backgroundMusic: string;
}

export const levels: LevelConfig[] = [
  {
    asteroidSpawnRate: 3000,
    crystalSpawnRate: 2000,
    difficulty: 1,
    backgroundMusic: 'level1-music'
  },
  {
    asteroidSpawnRate: 2000,
    crystalSpawnRate: 2500,
    difficulty: 2,
    backgroundMusic: 'level2-music'
  }
  // ... more levels
];
```

## Testing Your Game

### Test the Complete Game Flow

```bash
# Run the game in development
npm run dev

# Test the following flow:
# 1. Boot scene loads assets
# 2. Menu scene appears with title and start button
# 3. Game scene starts when button is clicked
# 4. Player can move, jump, and collect crystals
# 5. Score increases and level progresses
# 6. Game over scene appears when lives reach 0
# 7. High score is saved and displayed
```

### Performance Testing

```bash
# Check game performance
npm run test:performance

# Build and test production version
npm run build
npm run preview
```

## Deployment

### Build for Production

```bash
# Create production build
npm run build

# Test production build
npm run preview
```

### Deploy to GitHub Pages

```bash
# Build and deploy
npm run build
npm run deploy

# Or manually:
# 1. Push to GitHub
# 2. Enable GitHub Pages in repository settings
# 3. Set source to GitHub Actions
# 4. Use the included CI/CD workflow
```

## Next Steps

Congratulations! You've built a complete game. Here are some enhancements to consider:

1. **Add More Levels**: Create different environments and challenges
2. **Implement Sound Design**: Add more audio feedback and music
3. **Create Animations**: Add sprite animations for characters
4. **Add Mobile Support**: Implement touch controls for mobile devices
5. **Multiplayer Features**: Add local or online multiplayer
6. **Save System**: Implement game progress saving
7. **Achievements**: Add an achievement system
8. **Visual Polish**: Add more particle effects and visual enhancements

---

**Resources:**
- [Component Examples](component-examples.md) - Learn advanced component patterns
- [Best Practices](best-practices.md) - Game development best practices
- [Customization Guide](../customization/) - Advanced customization options
