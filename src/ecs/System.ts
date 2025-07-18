/**
 * Base System class for ECS architecture
 * Systems process entities that have specific component combinations
 */

import { Entity } from './Entity';
import { EntityManager } from './EntityManager';

export abstract class System {
    public enabled: boolean = true;
    public priority: number = 0;
    protected entityManager: EntityManager;

    constructor(entityManager: EntityManager, priority: number = 0) {
        this.entityManager = entityManager;
        this.priority = priority;
    }

    /**
     * Define which component types this system requires
     * Entities must have ALL of these components to be processed
     */
    abstract getRequiredComponents(): (new (...args: any[]) => any)[];

    /**
     * Main update method called each frame
     * @param deltaTime - Time elapsed since last frame in milliseconds
     */
    abstract update(deltaTime: number): void;

    /**
     * Get all entities that match this system's component requirements
     */
    protected getEntities(): Entity[] {
        if (!this.enabled) return [];

        const requiredComponents = this.getRequiredComponents();
        return this.entityManager.getEntitiesWithComponents(requiredComponents);
    }

    /**
     * Called when system is added to the world
     */
    onAdded?(): void;

    /**
     * Called when system is removed from the world
     */
    onRemoved?(): void;

    /**
     * Enable this system
     */
    enable(): void {
        this.enabled = true;
    }

    /**
     * Disable this system
     */
    disable(): void {
        this.enabled = false;
    }

    /**
     * Clean up system resources
     */
    destroy(): void {
        this.enabled = false;
    }
}
