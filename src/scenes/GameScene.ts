/**
 * GameScene - Main gameplay scene using ECS architecture
 * Handles the core game loop with Entity-Component-System patterns
 */

import Phaser from 'phaser';
import { GAME_CONSTANTS } from '../utils/Constants';
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
    ProbeComponent,
    InventoryComponent
} from '../components/CoreComponents';

export class GameScene extends Phaser.Scene {
    private world!: World;
    private playerProbeId!: number;

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

        // Initialize ECS World
        this.world = new World();

        // Add core systems
        this.setupSystems();

        // Create game entities
        this.createPlayerProbe();
        this.createEnvironment();

        // Setup camera
        this.setupCamera();

        // Setup ESC key to return to menu
        const escKey = this.input.keyboard?.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
        escKey?.on('down', () => {
            this.returnToMenu();
        });

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

    private createPlayerProbe(): void {
        // Create probe entity
        const probeEntity = this.world.createEntity();
        this.playerProbeId = probeEntity.id;

        // Add components
        probeEntity
            .addComponent(new PositionComponent(640, 360))
            .addComponent(new VelocityComponent(0, 0, 0, 200))
            .addComponent(new SpriteComponent('spaceship'))
            .addComponent(new InputComponent(true)) // Player controlled
            .addComponent(new ProbeComponent())
            .addComponent(new InventoryComponent(1000));

        console.log(`Created player probe with ID: ${probeEntity.id}`);
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

        // Camera will follow the player probe sprite (handled in update)
        const playerProbe = this.world.getEntity(this.playerProbeId);
        if (playerProbe) {
            const position = playerProbe.getComponent(PositionComponent);
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
    }

    private updateCameraFollow(): void {
        const playerProbe = this.world.getEntity(this.playerProbeId);
        if (playerProbe) {
            const position = playerProbe.getComponent(PositionComponent);
            const sprite = playerProbe.getComponent(SpriteComponent);

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
        this.world.clear();
    }
}
