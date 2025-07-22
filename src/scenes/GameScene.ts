/**
 * GameScene - Main gameplay scene using ECS architecture
 * Handles the core game loop    private createPlayerEntity(): void {
        // Create player entity
        const playerEntity = this.world.createEntity();
        this.playerEntityId = playerEntity.id;

        // Add components
        playerEntity
            .addComponent(new PositionComponent(640, 360))
            .addComponent(new VelocityComponent(0, 0, 0, 200))
            .addComponent(new SpriteComponent('spaceship'))
            .addComponent(new InputComponent())
            .addComponent(new PlayerComponent())
            .addComponent(new InventoryComponent());

        console.log(`Created player entity with ID: ${playerEntity.id}`);mponent-System patterns
 */

import Phaser from 'phaser';
import { GAME_CONSTANTS } from '../utils/Constants';
import { SimpleFPSCounter } from '../utils/SimpleFPSCounter';
import { PerformanceLogger } from '../config/DebugConfig';
import { World } from '../ecs/World';
import {
    MovementSystem,
    InputSystem,
    RenderingSystem,
    EnergySystem,
    DebugSystem
} from '../systems/CoreSystems';
import {
    PositionComponent,
    VelocityComponent,
    SpriteComponent,
    InputComponent,
    PlayerComponent,
    InventoryComponent
} from '../gameObjects/CoreComponents';

export class GameScene extends Phaser.Scene {
    private world!: World;
    private playerEntityId!: number;
    private fpsCounter?: SimpleFPSCounter;

    constructor() {
        super({ key: 'GameScene' });
    }

    preload(): void {
        // Load assets if not already loaded
        if (!this.textures.exists('space')) {
            this.load.image('space', 'assets/space.png');
        }
        if (!this.textures.exists('spaceship')) {
            this.load.image('spaceship', 'assets/spaceship.png');
        }
        if (!this.textures.exists('phaser')) {
            this.load.image('phaser', 'assets/phaser.png');
        }
    }

    create(): void {
        console.log('GameScene: Starting with ECS architecture');

        // Log scene start for performance monitoring
        PerformanceLogger.logSceneStart('GameScene');

        // Initialize ECS World
        this.world = new World();

        // Add core systems
        this.setupSystems();

        // Create game entities
        this.createPlayerEntity();
        this.createEnvironment();

        // Setup camera
        this.setupCamera();

        // Setup ESC key to return to menu
        const escKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        escKey?.on('down', () => {
            this.returnToMenu();
        });

        // Initialize FPS counter for development
        this.fpsCounter = new SimpleFPSCounter(this);

        // Log scene completion for performance monitoring
        PerformanceLogger.logSceneComplete('GameScene');

        console.log('GameScene: ECS initialization complete');
    }

    private setupSystems(): void {
        // Add systems in priority order
        this.world.addSystem(new InputSystem(this.world.getEntityManager(), this));
        this.world.addSystem(new MovementSystem(this.world.getEntityManager()));
        this.world.addSystem(new EnergySystem(this.world.getEntityManager()));
        this.world.addSystem(new RenderingSystem(this.world.getEntityManager(), this));
        this.world.addSystem(new DebugSystem(this.world.getEntityManager(), this));
    }

    private createPlayerEntity(): void {
        // Create player entity
        const playerEntity = this.world.createEntity();
        this.playerEntityId = playerEntity.id;

        // Add components
        playerEntity
            .addComponent(new PositionComponent(640, 360))
            .addComponent(new VelocityComponent(0, 0, 0, 200))
            .addComponent(new SpriteComponent('spaceship'))
            .addComponent(new InputComponent(true)) // Player controlled
            .addComponent(new PlayerComponent())
            .addComponent(new InventoryComponent(1000));

        console.log(`Created player entity with ID: ${playerEntity.id}`);
    }

    private createEnvironment(): void {
        // Set world bounds
        this.physics.world.setBounds(0, 0, GAME_CONSTANTS.WORLD_WIDTH, GAME_CONSTANTS.WORLD_HEIGHT);

        // Create background
        this.add
            .tileSprite(0, 0, GAME_CONSTANTS.WORLD_WIDTH, GAME_CONSTANTS.WORLD_HEIGHT, 'space')
            .setOrigin(0, 0)
            .setDepth(-1);

        // Add some static entities for testing (resource nodes)
        for (let i = 0; i < 5; i++) {
            const x = Phaser.Math.Between(100, GAME_CONSTANTS.WORLD_WIDTH - 100);
            const y = Phaser.Math.Between(100, GAME_CONSTANTS.WORLD_HEIGHT - 100);

            const resource = this.world.createEntity();
            resource
                .addComponent(new PositionComponent(x, y))
                .addComponent(new SpriteComponent('phaser')); // Using phaser logo as placeholder
        }
    }

    private setupCamera(): void {
        // Setup camera bounds
        this.cameras.main.setBounds(0, 0, GAME_CONSTANTS.WORLD_WIDTH, GAME_CONSTANTS.WORLD_HEIGHT);

        // Camera will follow the player entity sprite (handled in update)
        const playerEntity = this.world.getEntity(this.playerEntityId);
        if (playerEntity) {
            const position = playerEntity.getComponent(PositionComponent);
            if (position) {
                this.cameras.main.centerOn(position.x, position.y);
                this.cameras.main.setZoom(1);
            }
        }
    }

    override update(_time: number, delta: number): void {
        // Update ECS world
        this.world.update(delta);

        // Update camera to follow player probe
        this.updateCameraFollow();

        // Update FPS counter
        this.fpsCounter?.update();
    }

    private updateCameraFollow(): void {
        const playerEntity = this.world.getEntity(this.playerEntityId);
        if (playerEntity) {
            const position = playerEntity.getComponent(PositionComponent);
            const sprite = playerEntity.getComponent(SpriteComponent);

            if (position && sprite?.sprite) {
                // Update camera to follow sprite
                this.cameras.main.startFollow(sprite.sprite);
            }
        }
    }

    private returnToMenu(): void {
        this.cameras.main.fadeOut(300, 0, 0, 0);

        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('StartScene');
        });
    }

    shutdown(): void {
        console.log('GameScene: Shutting down ECS world');

        // Clean up FPS counter
        this.fpsCounter?.destroy();

        // Clean up ECS world
        this.world.clear();
    }
}
