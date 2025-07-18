/**
 * Simple test to verify ECS architecture is working
 */

import { World } from '../ecs/World';
import {
    PositionComponent,
    VelocityComponent,
    SpriteComponent
} from '../components/CoreComponents';

// Simple test function
export function testECS(): boolean {
    console.log('Testing ECS Architecture...');

    try {
        // Create world
        const world = new World();

        // Create entity
        const entity = world.createEntity();

        // Add components
        entity
            .addComponent(new PositionComponent(100, 200))
            .addComponent(new VelocityComponent(10, 15))
            .addComponent(new SpriteComponent('test'));

        // Test component retrieval
        const position = entity.getComponent(PositionComponent);
        const velocity = entity.getComponent(VelocityComponent);

        if (!position || !velocity) {
            console.error('Failed to retrieve components');
            return false;
        }

        // Test component values
        if (position.x !== 100 || position.y !== 200) {
            console.error('Position component values incorrect');
            return false;
        }

        if (velocity.x !== 10 || velocity.y !== 15) {
            console.error('Velocity component values incorrect');
            return false;
        }

        // Test entity queries
        const entities = world.getEntitiesWithComponents([PositionComponent, VelocityComponent]);
        if (entities.length !== 1) {
            console.error('Entity query failed');
            return false;
        }

        console.log('✅ ECS Architecture test passed!');
        console.log(`Created entity ${entity.id} with components:`, entity.getComponentTypes());

        // Cleanup
        world.clear();

        return true;
    } catch (error) {
        console.error('❌ ECS test failed:', error);
        return false;
    }
}

// Auto-run test when module loads
testECS();
