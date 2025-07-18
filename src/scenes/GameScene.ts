import Phaser from 'phaser';
import { GAME_CONFIG } from '@/main';

export class GameScene extends Phaser.Scene {
  private worldBackground!: Phaser.GameObjects.TileSprite;
  private probe!: Phaser.GameObjects.Sprite;
  private cursors!: Phaser.Types.Input.Keyboard.CursorKeys;
  private debugText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  preload(): void {
    // Temporary assets - will be replaced with proper game assets
    this.load.image('world-bg', 'assets/space.png');
    this.load.image('probe', 'assets/spaceship.png');
  }

  create(): void {
    // World background
    this.worldBackground = this.add.tileSprite(
      0, 0, 
      GAME_CONFIG.WORLD_WIDTH, 
      GAME_CONFIG.WORLD_HEIGHT, 
      'world-bg'
    ).setOrigin(0, 0);

    // Probe (player character)
    this.probe = this.add.sprite(640, 360, 'probe');
    this.probe.setScale(0.5);

    // Camera setup
    this.cameras.main.setBounds(0, 0, GAME_CONFIG.WORLD_WIDTH, GAME_CONFIG.WORLD_HEIGHT);
    this.cameras.main.startFollow(this.probe);
    this.cameras.main.setZoom(1);

    // Input setup
    this.setupInput();

    // Debug information
    this.createDebugDisplay();

    // Initialize game systems
    this.initializeGameSystems();
  }

  update(time: number, delta: number): void {
    this.handleInput(delta);
    this.updateDebugDisplay();
  }

  private setupInput(): void {
    // Keyboard input
    this.cursors = this.input.keyboard?.createCursorKeys() as Phaser.Types.Input.Keyboard.CursorKeys;
    
    // WASD keys
    const wasdKeys = this.input.keyboard?.addKeys('W,S,A,D') as Record<string, Phaser.Input.Keyboard.Key>;
    
    // Add WASD to cursors for convenience
    if (wasdKeys) {
      this.cursors.up = wasdKeys.W;
      this.cursors.down = wasdKeys.S;
      this.cursors.left = wasdKeys.A;
      this.cursors.right = wasdKeys.D;
    }

    // Escape key to return to menu
    const escKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
    escKey?.on('down', () => {
      this.returnToMenu();
    });
  }

  private handleInput(delta: number): void {
    const speed = 200; // pixels per second
    const moveDistance = (speed * delta) / 1000;

    if (this.cursors.left?.isDown) {
      this.probe.x -= moveDistance;
    }
    if (this.cursors.right?.isDown) {
      this.probe.x += moveDistance;
    }
    if (this.cursors.up?.isDown) {
      this.probe.y -= moveDistance;
    }
    if (this.cursors.down?.isDown) {
      this.probe.y += moveDistance;
    }

    // Keep probe within world bounds
    this.probe.x = Phaser.Math.Clamp(this.probe.x, 0, GAME_CONFIG.WORLD_WIDTH);
    this.probe.y = Phaser.Math.Clamp(this.probe.y, 0, GAME_CONFIG.WORLD_HEIGHT);
  }

  private createDebugDisplay(): void {
    this.debugText = this.add.text(10, 10, '', {
      fontSize: '14px',
      color: '#00ff00',
      backgroundColor: '#000000',
      padding: { x: 8, y: 4 }
    });
    this.debugText.setScrollFactor(0); // Fixed to camera
    this.debugText.setDepth(1000); // Always on top
  }

  private updateDebugDisplay(): void {
    const probeX = Math.round(this.probe.x);
    const probeY = Math.round(this.probe.y);
    const fps = Math.round(this.game.loop.actualFps);
    
    this.debugText.setText([
      `New Eden Project - Development Build`,
      `Probe Position: (${probeX}, ${probeY})`,
      `FPS: ${fps}`,
      `Target: ${GAME_CONFIG.TARGET_FPS}`,
      ``,
      `Controls:`,
      `WASD/Arrow Keys: Move`,
      `ESC: Return to menu`
    ]);
  }

  private initializeGameSystems(): void {
    // Placeholder for game systems initialization
    // TODO: Initialize ECS systems, energy management, equipment, etc.
    console.log('Game systems initialized');
  }

  private returnToMenu(): void {
    this.cameras.main.fadeOut(300, 0, 0, 0);
    
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('StartScene');
    });
  }
}
