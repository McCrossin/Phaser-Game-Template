import Phaser from 'phaser';
import { SimpleFPSCounter } from '../utils/SimpleFPSCounter';
import { PerformanceLogger } from '../config/DebugConfig';

export class StartScene extends Phaser.Scene {
    private background!: Phaser.GameObjects.TileSprite;
    private ship!: Phaser.GameObjects.Sprite;
    private titleText!: Phaser.GameObjects.Text;
    private subtitleText!: Phaser.GameObjects.Text;
    private startButton!: Phaser.GameObjects.Text;
    private fpsCounter?: SimpleFPSCounter;

    constructor() {
        super({ key: 'StartScene' });
    }

    preload(): void {
        // Load assets
        this.load.image('background', 'assets/space.png');
        this.load.image('logo', 'assets/phaser.png');
        this.load.spritesheet('ship', 'assets/spaceship.png', {
            frameWidth: 176,
            frameHeight: 96
        });

        // Loading progress display
        this.createLoadingBar();
    }

    create(): void {
        // Log scene start for performance monitoring
        PerformanceLogger.logSceneStart('StartScene');

        // Background
        this.background = this.add.tileSprite(640, 360, 1280, 720, 'background');

        // Title and branding
        this.createTitle();

        // Animated spaceship
        this.createSpaceship();

        // Start button
        this.createStartButton();

        // Input handling
        this.setupInput();

        // Initialize FPS counter for development
        this.fpsCounter = new SimpleFPSCounter(this);

        // Log scene completion for performance monitoring
        PerformanceLogger.logSceneComplete('StartScene');
    }

    override update(): void {
        // Parallax background scrolling
        this.background.tilePositionX += 1;

        // Update FPS counter
        this.fpsCounter?.update();
    }

    private createLoadingBar(): void {
        const loadingText = this.add
            .text(640, 360, 'Loading...', {
                fontSize: '24px',
                color: '#ffffff'
            })
            .setOrigin(0.5);

        this.load.on('progress', (progress: number) => {
            loadingText.setText(`Loading... ${Math.round(progress * 100)}%`);
        });

        this.load.on('complete', () => {
            loadingText.destroy();
        });
    }

    private createTitle(): void {
        // Main title
        this.titleText = this.add
            .text(640, 150, 'PHASER GAME TEMPLATE', {
                fontSize: '48px',
                color: '#00ff88',
                fontFamily: 'Arial, sans-serif',
                stroke: '#000000',
                strokeThickness: 2
            })
            .setOrigin(0.5);

        // Subtitle
        this.subtitleText = this.add
            .text(640, 200, 'Professional 2D Game Development Foundation', {
                fontSize: '20px',
                color: '#88ffaa',
                fontFamily: 'Arial, sans-serif',
                fontStyle: 'italic'
            })
            .setOrigin(0.5);

        // Title animation
        this.tweens.add({
            targets: [this.titleText, this.subtitleText],
            alpha: { from: 0, to: 1 },
            duration: 2000,
            ease: 'Power2'
        });
    }

    private createSpaceship(): void {
        this.ship = this.add.sprite(640, 400, 'ship');

        // Create flying animation
        this.ship.anims.create({
            key: 'fly',
            frames: this.anims.generateFrameNumbers('ship', { start: 0, end: 2 }),
            frameRate: 15,
            repeat: -1
        });

        this.ship.play('fly');

        // Gentle floating animation
        this.tweens.add({
            targets: this.ship,
            y: 420,
            duration: 3000,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });
    }

    private createStartButton(): void {
        this.startButton = this.add
            .text(640, 550, 'Press SPACE to Begin Mission', {
                fontSize: '24px',
                color: '#ffffff',
                fontFamily: 'Arial, sans-serif',
                backgroundColor: '#004422',
                padding: { x: 20, y: 10 }
            })
            .setOrigin(0.5);

        // Pulsing animation
        this.tweens.add({
            targets: this.startButton,
            alpha: { from: 0.7, to: 1 },
            duration: 1000,
            ease: 'Sine.inOut',
            yoyo: true,
            loop: -1
        });

        // Hover effects
        this.startButton.setInteractive({ useHandCursor: true });

        this.startButton.on('pointerover', () => {
            this.startButton.setStyle({ backgroundColor: '#006633' });
        });

        this.startButton.on('pointerout', () => {
            this.startButton.setStyle({ backgroundColor: '#004422' });
        });

        this.startButton.on('pointerdown', () => {
            this.startGame();
        });
    }

    private setupInput(): void {
        // Keyboard input
        const spaceKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        spaceKey?.on('down', () => {
            this.startGame();
        });
    }

    private startGame(): void {
        // Transition to game scene
        this.cameras.main.fadeOut(500, 0, 0, 0);

        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('GameScene');
        });
    }
}
