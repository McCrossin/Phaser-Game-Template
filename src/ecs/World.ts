/**
 * World class - main ECS coordinator
 * Manages entities, systems, and the game loop
 */

import { Entity } from './Entity';
import { System } from './System';
import { EntityManager } from './EntityManager';

export class World {
    private entityManager: EntityManager;
    private systems: System[] = [];
    private systemsToAdd: System[] = [];
    private systemsToRemove: System[] = [];
    private running = false;

    constructor() {
        this.entityManager = new EntityManager();
    }

    /**
     * Create a new entity in this world
     */
    createEntity(): Entity {
        return this.entityManager.createEntity();
    }

    /**
     * Remove an entity from this world
     */
    removeEntity(entityId: number): boolean {
        return this.entityManager.removeEntity(entityId);
    }

    /**
     * Get entity by ID
     */
    getEntity(entityId: number): Entity | undefined {
        return this.entityManager.getEntity(entityId);
    }

    /**
     * Add a system to this world
     */
    addSystem(system: System): void {
        if (this.running) {
            this.systemsToAdd.push(system);
        } else {
            this.systems.push(system);
            this.systems.sort((a, b) => a.priority - b.priority);
            system.onAdded?.();
        }
    }

    /**
     * Remove a system from this world
     */
    removeSystem(system: System): void {
        if (this.running) {
            this.systemsToRemove.push(system);
        } else {
            const index = this.systems.indexOf(system);
            if (index !== -1) {
                this.systems.splice(index, 1);
                system.onRemoved?.();
                system.destroy();
            }
        }
    }

    /**
     * Get all systems
     */
    getSystems(): System[] {
        return [...this.systems];
    }

    /**
     * Get system by type
     */
    getSystem<T extends System>(systemType: new (...args: any[]) => T): T | undefined {
        return this.systems.find(system => system instanceof systemType) as T;
    }

    /**
     * Update all systems - main game loop
     */
    update(deltaTime: number): void {
        this.running = true;

        // Update all systems
        for (const system of this.systems) {
            if (system.enabled) {
                system.update(deltaTime);
            }
        }

        this.running = false;

        // Process pending system additions
        if (this.systemsToAdd.length > 0) {
            for (const system of this.systemsToAdd) {
                this.systems.push(system);
                system.onAdded?.();
            }
            this.systems.sort((a, b) => a.priority - b.priority);
            this.systemsToAdd.length = 0;
        }

        // Process pending system removals
        if (this.systemsToRemove.length > 0) {
            for (const systemToRemove of this.systemsToRemove) {
                const index = this.systems.indexOf(systemToRemove);
                if (index !== -1) {
                    this.systems.splice(index, 1);
                    systemToRemove.onRemoved?.();
                    systemToRemove.destroy();
                }
            }
            this.systemsToRemove.length = 0;
        }
    }

    /**
     * Get entities with specific components
     */
    getEntitiesWithComponents(componentTypes: (new (...args: any[]) => any)[]): Entity[] {
        return this.entityManager.getEntitiesWithComponents(componentTypes);
    }

    /**
     * Clear all entities and systems
     */
    clear(): void {
        // Clear all systems
        for (const system of this.systems) {
            system.destroy();
        }
        this.systems.length = 0;
        this.systemsToAdd.length = 0;
        this.systemsToRemove.length = 0;

        // Clear all entities
        this.entityManager.clear();

        this.running = false;
    }

    /**
     * Get world statistics
     */
    getStats(): {
        entities: number;
        systems: number;
        pooledEntities: number;
        componentTypes: number;
    } {
        const entityStats = this.entityManager.getStats();
        return {
            entities: entityStats.totalEntities,
            systems: this.systems.length,
            pooledEntities: entityStats.pooledEntities,
            componentTypes: entityStats.componentTypes
        };
    }

    /**
     * Get the entity manager for advanced operations
     */
    getEntityManager(): EntityManager {
        return this.entityManager;
    }
}
