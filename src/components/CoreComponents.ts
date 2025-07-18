/**
 * Core game components for the New Eden Project
 * These components define the basic properties and behaviors of game entities
 */

import { Component } from '../ecs/Component';
import type { Equipment } from '../types/GameTypes';

// Simple types for components
export type ResourceType = string;
export type ProbeStateType = 'idle' | 'moving' | 'mining' | 'scanning' | 'charging';

/**
 * Position component - defines entity location in world space
 */
export class PositionComponent extends Component {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0
    ) {
        super();
    }

    setPosition(x: number, y: number, z: number = 0): void {
        this.x = x;
        this.y = y;
        this.z = z;
    }

    distanceTo(other: PositionComponent): number {
        const dx = this.x - other.x;
        const dy = this.y - other.y;
        const dz = this.z - other.z;
        return Math.sqrt(dx * dx + dy * dy + dz * dz);
    }
}

/**
 * Velocity component - defines entity movement in world space
 */
export class VelocityComponent extends Component {
    constructor(
        public x: number = 0,
        public y: number = 0,
        public z: number = 0,
        public maxSpeed: number = 100
    ) {
        super();
    }

    setVelocity(x: number, y: number, z: number = 0): void {
        this.x = x;
        this.y = y;
        this.z = z;
        this.clampToMaxSpeed();
    }

    addVelocity(x: number, y: number, z: number = 0): void {
        this.x += x;
        this.y += y;
        this.z += z;
        this.clampToMaxSpeed();
    }

    private clampToMaxSpeed(): void {
        const speed = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
        if (speed > this.maxSpeed) {
            const factor = this.maxSpeed / speed;
            this.x *= factor;
            this.y *= factor;
            this.z *= factor;
        }
    }

    getSpeed(): number {
        return Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z);
    }
}

/**
 * Sprite component - defines visual representation
 */
export class SpriteComponent extends Component {
    public sprite?: Phaser.GameObjects.Sprite | undefined;
    public visible: boolean = true;
    public alpha: number = 1;
    public rotation: number = 0;
    public scaleX: number = 1;
    public scaleY: number = 1;

    constructor(
        public textureKey: string,
        public frame?: string | number
    ) {
        super();
    }

    setTexture(textureKey: string, frame?: string | number): void {
        this.textureKey = textureKey;
        this.frame = frame;
        if (this.sprite) {
            this.sprite.setTexture(textureKey, frame);
        }
    }

    setVisible(visible: boolean): void {
        this.visible = visible;
        if (this.sprite) {
            this.sprite.setVisible(visible);
        }
    }

    setAlpha(alpha: number): void {
        this.alpha = alpha;
        if (this.sprite) {
            this.sprite.setAlpha(alpha);
        }
    }

    override destroy(): void {
        if (this.sprite) {
            this.sprite.destroy();
            this.sprite = undefined;
        }
    }
}

/**
 * Probe component - specific to probe entities
 */
export class ProbeComponent extends Component {
    public state: ProbeStateType = 'idle';
    public energy: number = 100;
    public maxEnergy: number = 100;
    public energyConsumptionRate: number = 1; // per second
    public batteryCapacity: number = 100;
    public equipped: Equipment[] = [];
    public maxEquipmentSlots: number = 4;

    constructor() {
        super();
    }

    consumeEnergy(amount: number): boolean {
        if (this.energy >= amount) {
            this.energy -= amount;
            return true;
        }
        return false;
    }

    rechargeEnergy(amount: number): void {
        this.energy = Math.min(this.maxEnergy, this.energy + amount);
    }

    equipItem(equipment: Equipment): boolean {
        if (this.equipped.length < this.maxEquipmentSlots) {
            this.equipped.push(equipment);
            return true;
        }
        return false;
    }

    unequipItem(equipmentId: string): Equipment | undefined {
        const index = this.equipped.findIndex(eq => eq.id === equipmentId);
        if (index !== -1) {
            return this.equipped.splice(index, 1)[0];
        }
        return undefined;
    }

    getEquippedTool(type: string): Equipment | undefined {
        return this.equipped.find(eq => eq.type === type);
    }
}

/**
 * Inventory component - manages resource storage
 */
export class InventoryComponent extends Component {
    public resources: Map<ResourceType, number> = new Map();
    public maxCapacity: number = 1000;

    constructor(maxCapacity: number = 1000) {
        super();
        this.maxCapacity = maxCapacity;
    }

    addResource(type: ResourceType, amount: number): number {
        const current = this.resources.get(type) || 0;
        const totalCapacity = this.getTotalCapacity();
        const availableSpace = this.maxCapacity - totalCapacity;
        const actualAmount = Math.min(amount, availableSpace);

        if (actualAmount > 0) {
            this.resources.set(type, current + actualAmount);
        }

        return actualAmount;
    }

    removeResource(type: ResourceType, amount: number): number {
        const current = this.resources.get(type) || 0;
        const actualAmount = Math.min(amount, current);

        if (actualAmount > 0) {
            const remaining = current - actualAmount;
            if (remaining > 0) {
                this.resources.set(type, remaining);
            } else {
                this.resources.delete(type);
            }
        }

        return actualAmount;
    }

    hasResource(type: ResourceType, amount: number = 1): boolean {
        return (this.resources.get(type) || 0) >= amount;
    }

    getResourceAmount(type: ResourceType): number {
        return this.resources.get(type) || 0;
    }

    getTotalCapacity(): number {
        let total = 0;
        for (const amount of this.resources.values()) {
            total += amount;
        }
        return total;
    }

    getRemainingCapacity(): number {
        return this.maxCapacity - this.getTotalCapacity();
    }

    getAllResources(): [ResourceType, number][] {
        return Array.from(this.resources.entries());
    }
}

/**
 * Input component - handles input for controllable entities
 */
export class InputComponent extends Component {
    public keys: { [key: string]: boolean } = {};
    public moveSpeed: number = 150;
    public isPlayerControlled: boolean = false;

    constructor(isPlayerControlled: boolean = false) {
        super();
        this.isPlayerControlled = isPlayerControlled;
    }

    setKey(key: string, pressed: boolean): void {
        this.keys[key] = pressed;
    }

    isKeyPressed(key: string): boolean {
        return this.keys[key] || false;
    }

    getMovementVector(): { x: number; y: number } {
        const movement = { x: 0, y: 0 };

        if (this.isKeyPressed('left') || this.isKeyPressed('a')) {
            movement.x -= 1;
        }
        if (this.isKeyPressed('right') || this.isKeyPressed('d')) {
            movement.x += 1;
        }
        if (this.isKeyPressed('up') || this.isKeyPressed('w')) {
            movement.y -= 1;
        }
        if (this.isKeyPressed('down') || this.isKeyPressed('s')) {
            movement.y += 1;
        }

        // Normalize diagonal movement
        if (movement.x !== 0 && movement.y !== 0) {
            const length = Math.sqrt(movement.x * movement.x + movement.y * movement.y);
            movement.x /= length;
            movement.y /= length;
        }

        return movement;
    }
}
