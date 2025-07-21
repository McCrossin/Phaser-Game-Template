/**
 * Core game systems for the Phaser Game Template
 * Provides foundational ECS architecture and system management
 */

import { System } from '../ecs/System';
import { EntityManager } from '../ecs/EntityManager';
import {
    PositionComponent,
    VelocityComponent,
    SpriteComponent,
    InputComponent,
    ProbeComponent
} from '../components/CoreComponents';

/**
 * Movement System - handles entity movement based on velocity
 */
export class MovementSystem extends System {
    constructor(entityManager: EntityManager) {
        super(entityManager, 1); // High priority for movement
    }

    getRequiredComponents() {
        return [PositionComponent, VelocityComponent];
    }

    update(deltaTime: number): void {
        const entities = this.getEntities();
        const deltaSeconds = deltaTime / 1000;

        for (const entity of entities) {
            const position = entity.getComponent(PositionComponent)!;
            const velocity = entity.getComponent(VelocityComponent)!;

            // Update position based on velocity
            position.x += velocity.x * deltaSeconds;
            position.y += velocity.y * deltaSeconds;
            position.z += velocity.z * deltaSeconds;

            // Update sprite position if available
            const sprite = entity.getComponent(SpriteComponent);
            if (sprite?.sprite) {
                sprite.sprite.setPosition(position.x, position.y);
            }
        }
    }
}

/**
 * Input System - handles player input for controllable entities
 */
export class InputSystem extends System {
    private cursors?: Phaser.Types.Input.Keyboard.CursorKeys;
    private wasdKeys?: { [key: string]: Phaser.Input.Keyboard.Key };

    constructor(entityManager: EntityManager, scene?: Phaser.Scene) {
        super(entityManager, 0); // Highest priority for input

        if (scene && scene.input.keyboard) {
            this.cursors = scene.input.keyboard.createCursorKeys();
            this.wasdKeys = scene.input.keyboard.addKeys('W,S,A,D,UP,DOWN,LEFT,RIGHT') as {
                [key: string]: Phaser.Input.Keyboard.Key;
            };
        }
    }

    getRequiredComponents() {
        return [InputComponent, VelocityComponent];
    }

    update(_deltaTime: number): void {
        const entities = this.getEntities();

        for (const entity of entities) {
            const input = entity.getComponent(InputComponent)!;
            const velocity = entity.getComponent(VelocityComponent)!;

            if (!input.isPlayerControlled) continue;

            // Update input state
            this.updateInputState(input);

            // Calculate movement based on input
            const movement = input.getMovementVector();
            velocity.setVelocity(movement.x * input.moveSpeed, movement.y * input.moveSpeed);
        }
    }

    private updateInputState(input: InputComponent): void {
        if (!this.cursors || !this.wasdKeys) return;

        // Arrow keys
        input.setKey('left', this.cursors.left.isDown);
        input.setKey('right', this.cursors.right.isDown);
        input.setKey('up', this.cursors.up.isDown);
        input.setKey('down', this.cursors.down.isDown);

        // WASD keys
        input.setKey('w', this.wasdKeys['W']?.isDown || false);
        input.setKey('a', this.wasdKeys['A']?.isDown || false);
        input.setKey('s', this.wasdKeys['S']?.isDown || false);
        input.setKey('d', this.wasdKeys['D']?.isDown || false);
    }
}

/**
 * Rendering System - handles sprite rendering and visual updates
 */
export class RenderingSystem extends System {
    private scene: Phaser.Scene;

    constructor(entityManager: EntityManager, scene: Phaser.Scene) {
        super(entityManager, 10); // Lower priority for rendering
        this.scene = scene;
    }

    getRequiredComponents() {
        return [PositionComponent, SpriteComponent];
    }

    update(_deltaTime: number): void {
        const entities = this.getEntities();

        for (const entity of entities) {
            const position = entity.getComponent(PositionComponent)!;
            const spriteComp = entity.getComponent(SpriteComponent)!;

            // Create sprite if it doesn't exist
            if (!spriteComp.sprite) {
                this.createSprite(spriteComp, position);
            }

            // Update sprite properties
            if (spriteComp.sprite) {
                spriteComp.sprite.setPosition(position.x, position.y);
                spriteComp.sprite.setVisible(spriteComp.visible);
                spriteComp.sprite.setAlpha(spriteComp.alpha);
                spriteComp.sprite.setRotation(spriteComp.rotation);
                spriteComp.sprite.setScale(spriteComp.scaleX, spriteComp.scaleY);
                spriteComp.sprite.setDepth(position.z);
            }
        }
    }

    private createSprite(spriteComp: SpriteComponent, position: PositionComponent): void {
        try {
            spriteComp.sprite = this.scene.add.sprite(
                position.x,
                position.y,
                spriteComp.textureKey,
                spriteComp.frame
            );
        } catch (error) {
            console.warn(`Failed to create sprite with texture: ${spriteComp.textureKey}`, error);
        }
    }

    override destroy(): void {
        // Clean up any remaining sprites when system is destroyed
        const entities = this.getEntities();
        for (const entity of entities) {
            const spriteComp = entity.getComponent(SpriteComponent);
            if (spriteComp?.sprite) {
                spriteComp.sprite.destroy();
                spriteComp.sprite = undefined;
            }
        }
        super.destroy();
    }
}

/**
 * Energy System - handles energy consumption and management for probes
 */
export class EnergySystem extends System {
    constructor(entityManager: EntityManager) {
        super(entityManager, 2); // Medium priority
    }

    getRequiredComponents() {
        return [ProbeComponent];
    }

    update(deltaTime: number): void {
        const entities = this.getEntities();
        const deltaSeconds = deltaTime / 1000;

        for (const entity of entities) {
            const probe = entity.getComponent(ProbeComponent)!;

            // Consume energy based on state and equipped items
            let energyConsumption = probe.energyConsumptionRate;

            // Additional consumption for movement
            const velocity = entity.getComponent(VelocityComponent);
            if (velocity && velocity.getSpeed() > 0) {
                energyConsumption += velocity.getSpeed() * 0.01; // Energy per unit speed
            }

            // Additional consumption for equipped items
            for (const equipment of probe.equipped) {
                energyConsumption += equipment.powerConsumption;
            }

            // Apply energy consumption
            const energyUsed = energyConsumption * deltaSeconds;
            probe.energy = Math.max(0, probe.energy - energyUsed);

            // Update probe state based on energy
            if (probe.energy <= 0 && probe.state !== 'idle') {
                probe.state = 'idle';
                // Stop movement if out of energy
                if (velocity) {
                    velocity.setVelocity(0, 0, 0);
                }
            }
        }
    }
}

/**
 * Debug System - provides debug information and visual debugging
 */
export class DebugSystem extends System {
    private scene: Phaser.Scene;
    private debugText?: Phaser.GameObjects.Text | undefined;
    private updateCounter = 0;
    private readonly updateInterval = 30; // Update every 30 frames (~0.5 seconds at 60fps)

    constructor(entityManager: EntityManager, scene: Phaser.Scene) {
        super(entityManager, 100); // Lowest priority
        this.scene = scene;
        this.createDebugText();
    }

    getRequiredComponents() {
        return []; // Debug system can run without specific components
    }

    update(_deltaTime: number): void {
        this.updateCounter++;

        if (this.updateCounter >= this.updateInterval) {
            this.updateCounter = 0;
            this.updateDebugInfo();
        }
    }

    private createDebugText(): void {
        this.debugText = this.scene.add.text(10, 10, '', {
            fontSize: '14px',
            color: '#00ff88',
            backgroundColor: 'rgba(0, 0, 0, 0.8)',
            padding: { x: 8, y: 4 }
        });
        this.debugText.setDepth(1000); // Ensure it's on top
        this.debugText.setScrollFactor(0); // Fixed position
    }

    private updateDebugInfo(): void {
        if (!this.debugText) return;

        const stats = this.entityManager.getStats();
        const probes = this.entityManager.getEntitiesWithComponents([ProbeComponent]);

        let debugInfo = `FPS: ${Math.round(this.scene.game.loop.actualFps)}\n`;
        debugInfo += `Entities: ${stats.totalEntities}\n`;
        debugInfo += `Pooled: ${stats.pooledEntities}\n`;
        debugInfo += `Components: ${stats.componentTypes}\n`;
        debugInfo += `Probes: ${probes.length}\n`;

        // Show probe information
        if (probes.length > 0) {
            const probeEntity = probes[0];
            if (probeEntity) {
                const probe = probeEntity.getComponent(ProbeComponent);
                if (probe) {
                    debugInfo += `Energy: ${Math.round(probe.energy)}/${probe.maxEnergy}\n`;
                    debugInfo += `State: ${probe.state}\n`;
                }

                const position = probeEntity.getComponent(PositionComponent);
                if (position) {
                    debugInfo += `Pos: (${Math.round(position.x)}, ${Math.round(position.y)})\n`;
                }
            }
        }

        this.debugText.setText(debugInfo);
    }

    override destroy(): void {
        if (this.debugText) {
            this.debugText.destroy();
            this.debugText = undefined;
        }
        super.destroy();
    }
}
