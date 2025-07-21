# New Eden Project - Coding Standards

## TypeScript Guidelines

### Type Safety
- Use strict TypeScript configuration
- Prefer explicit types over `any`
- Use union types for controlled variations
- Document complex types with JSDoc

```typescript
// Good
interface ProbeState {
    position: Vector2;
    energy: number;
    status: 'idle' | 'moving' | 'processing';
}

// Avoid
let probe: any = {...};
```

### Naming Conventions
- **Classes**: PascalCase (`MovementSystem`, `ProbeEntity`)
- **Functions/Variables**: camelCase (`calculateDistance`, `currentPosition`)
- **Constants**: UPPER_SNAKE_CASE (`MAX_PROBE_COUNT`, `DEFAULT_ENERGY`)
- **Files**: kebab-case (`movement-system.ts`, `probe-entity.ts`)

## Code Organization

### File Structure
- One primary class/interface per file
- Group related utilities in index files
- Use barrel exports for clean imports

```typescript
// src/systems/index.ts
export { MovementSystem } from './movement-system';
export { RenderSystem } from './render-system';
```

### Component Design
- Keep components data-only (no methods)
- Systems handle all logic processing
- Use composition over inheritance

## Performance Standards

### Memory Management
- Pool frequently created objects
- Dispose of resources properly
- Avoid memory leaks in event listeners

### Rendering Optimization
- Batch similar draw calls
- Use object pooling for particles
- Implement frustum culling for off-screen objects

## Testing Requirements

### Unit Tests
- Test all public methods
- Mock external dependencies
- Maintain > 80% code coverage

### Integration Tests
- Test system interactions
- Validate performance targets
- Test cross-platform compatibility

## Code Review Checklist

- [ ] TypeScript strict mode compliance
- [ ] Performance impact assessed
- [ ] Tests written and passing
- [ ] Documentation updated
- [ ] No console.log statements in production code
- [ ] Proper error handling implemented
