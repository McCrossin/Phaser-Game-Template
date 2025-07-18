/**
 * Entity class - represents a unique game object with an ID and component collection
 * Part of the ECS (Entity-Component-System) architecture
 */

export class Entity {
    private static nextId = 1;
    public readonly id: number;
    private components = new Map<string, any>();
    private componentTypes = new Set<string>();

    constructor() {
        this.id = Entity.nextId++;
    }

    /**
     * Add a component to this entity
     */
    addComponent<T extends object>(component: T): this {
        const componentName = (component as any).constructor.name;
        this.components.set(componentName, component);
        this.componentTypes.add(componentName);
        return this;
    }

    /**
     * Get a component by type
     */
    getComponent<T>(componentType: new (...args: any[]) => T): T | undefined {
        return this.components.get(componentType.name) as T;
    }

    /**
     * Check if entity has a specific component type
     */
    hasComponent<T>(componentType: new (...args: any[]) => T): boolean {
        return this.componentTypes.has(componentType.name);
    }

    /**
     * Check if entity has all required component types
     */
    hasComponents(componentTypes: (new (...args: any[]) => any)[]): boolean {
        return componentTypes.every(type => this.hasComponent(type));
    }

    /**
     * Remove a component from this entity
     */
    removeComponent<T>(componentType: new (...args: any[]) => T): boolean {
        const componentName = componentType.name;
        const removed = this.components.delete(componentName);
        this.componentTypes.delete(componentName);
        return removed;
    }

    /**
     * Get all component types this entity has
     */
    getComponentTypes(): string[] {
        return Array.from(this.componentTypes);
    }

    /**
     * Destroy entity - clears all components
     */
    destroy(): void {
        this.components.clear();
        this.componentTypes.clear();
    }
}
