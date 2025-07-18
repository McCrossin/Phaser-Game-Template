/**
 * Base component interface for ECS architecture
 * All game components should implement this interface
 */

export interface IComponent {
    /**
     * Optional update method for components that need per-frame updates
     * @param deltaTime - Time elapsed since last frame in milliseconds
     */
    update?(deltaTime: number): void;

    /**
     * Optional cleanup method for when component is removed
     */
    destroy?(): void;
}

/**
 * Base Component class with common functionality
 */
export abstract class Component implements IComponent {
    public enabled: boolean = true;

    /**
     * Optional update method for components that need per-frame updates
     */
    update?(deltaTime: number): void;

    /**
     * Optional cleanup method for when component is removed
     */
    destroy?(): void;

    /**
     * Called when component is added to an entity
     */
    onAdded?(): void;

    /**
     * Called when component is removed from an entity
     */
    onRemoved?(): void;

    /**
     * Enable this component
     */
    enable(): void {
        this.enabled = true;
    }

    /**
     * Disable this component
     */
    disable(): void {
        this.enabled = false;
    }
}
