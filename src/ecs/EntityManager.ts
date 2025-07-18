/**
 * EntityManager - manages all entities in the game world
 * Provides efficient queries for entities with specific component combinations
 */

import { Entity } from './Entity';

export class EntityManager {
    private entities = new Map<number, Entity>();
    private componentIndex = new Map<string, Set<number>>();
    private entityPool: Entity[] = [];
    private readonly maxPoolSize = 1000;

    /**
     * Create a new entity
     */
    createEntity(): Entity {
        let entity: Entity;

        // Reuse from pool if available
        if (this.entityPool.length > 0) {
            entity = this.entityPool.pop()!;
            // Reset entity ID for new use
            (entity as any).id = (Entity as any).nextId++;
        } else {
            entity = new Entity();
        }

        this.entities.set(entity.id, entity);
        return entity;
    }

    /**
     * Add an existing entity to the manager
     */
    addEntity(entity: Entity): void {
        this.entities.set(entity.id, entity);
        this.updateComponentIndex(entity);
    }

    /**
     * Remove and destroy an entity
     */
    removeEntity(entityId: number): boolean {
        const entity = this.entities.get(entityId);
        if (!entity) return false;

        // Remove from component indices
        this.removeFromComponentIndex(entity);

        // Remove from entities map
        this.entities.delete(entityId);

        // Clean up entity
        entity.destroy();

        // Return to pool if space available
        if (this.entityPool.length < this.maxPoolSize) {
            this.entityPool.push(entity);
        }

        return true;
    }

    /**
     * Get entity by ID
     */
    getEntity(entityId: number): Entity | undefined {
        return this.entities.get(entityId);
    }

    /**
     * Get all entities
     */
    getAllEntities(): Entity[] {
        return Array.from(this.entities.values());
    }

    /**
     * Get entities that have ALL of the specified component types
     */
    getEntitiesWithComponents(componentTypes: (new (...args: any[]) => any)[]): Entity[] {
        if (componentTypes.length === 0) {
            return this.getAllEntities();
        }

        // Start with entities that have the first component type
        const firstComponent = componentTypes[0];
        if (!firstComponent) return [];

        const firstComponentName = firstComponent.name;
        const entityIds = this.componentIndex.get(firstComponentName);

        if (!entityIds || entityIds.size === 0) {
            return [];
        }

        const result: Entity[] = [];

        // Check each entity to see if it has all required components
        for (const entityId of entityIds) {
            const entity = this.entities.get(entityId);
            if (entity && entity.hasComponents(componentTypes)) {
                result.push(entity);
            }
        }

        return result;
    }

    /**
     * Update component index when entity components change
     */
    updateComponentIndex(entity: Entity): void {
        // Remove old indices
        this.removeFromComponentIndex(entity);

        // Add new indices
        const componentTypes = entity.getComponentTypes();
        for (const componentType of componentTypes) {
            if (!this.componentIndex.has(componentType)) {
                this.componentIndex.set(componentType, new Set());
            }
            this.componentIndex.get(componentType)!.add(entity.id);
        }
    }

    /**
     * Remove entity from component index
     */
    private removeFromComponentIndex(entity: Entity): void {
        for (const [, entityIds] of this.componentIndex) {
            entityIds.delete(entity.id);
        }
    }

    /**
     * Get count of entities with a specific component
     */
    getEntityCountWithComponent(componentType: new (...args: any[]) => any): number {
        const entityIds = this.componentIndex.get(componentType.name);
        return entityIds ? entityIds.size : 0;
    }

    /**
     * Clear all entities
     */
    clear(): void {
        // Clean up all entities
        for (const entity of this.entities.values()) {
            entity.destroy();
        }

        this.entities.clear();
        this.componentIndex.clear();
        this.entityPool.length = 0;
    }

    /**
     * Get statistics about the entity manager
     */
    getStats(): {
        totalEntities: number;
        pooledEntities: number;
        componentTypes: number;
    } {
        return {
            totalEntities: this.entities.size,
            pooledEntities: this.entityPool.length,
            componentTypes: this.componentIndex.size
        };
    }
}
