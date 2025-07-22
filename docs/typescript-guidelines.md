# TypeScript Guidelines for Phaser Game Development

## Overview

This template follows a **TypeScript-first approach** for game development, providing type safety, better developer experience, and more maintainable code. This document outlines when to use TypeScript vs JavaScript and the coding standards to follow.

## Language Usage Guidelines

### Always TypeScript
- **Game source code** (`src/` directory)
- **Component and entity systems**
- **Game logic and mechanics**
- **Asset loading and management**
- **Build and development tools**
- **Test files**
- **Configuration that supports TypeScript**

### TypeScript Preferred
- **Build scripts and automation**
- **Deployment tools**
- **Development utilities**
- **Performance monitoring tools**
- **CI/CD scripts**

### JavaScript Acceptable
- **Simple configuration files** (when TypeScript isn't supported)
- **Legacy third-party scripts** (until they can be migrated)
- **Generated documentation files**
- **One-off maintenance scripts** (under 50 lines)

## TypeScript Standards

### Strict Mode Configuration
All TypeScript code must pass strict mode compilation:

```typescript
// Required in tsconfig.json
{
  "strict": true,
  "noImplicitAny": true,
  "noImplicitReturns": true,
  "noUnusedLocals": true,
  "noUnusedParameters": true,
  "exactOptionalPropertyTypes": true,
  "noImplicitOverride": true,
  "noPropertyAccessFromIndexSignature": true,
  "noUncheckedIndexedAccess": true
}
```

### Type Definitions

#### Game Entities
```typescript
interface GameEntity {
  readonly id: string;
  readonly type: EntityType;
  position: Vector2D;
  velocity: Vector2D;
  components: ComponentMap;
}
```

#### Systems
```typescript
interface System {
  readonly name: string;
  readonly priority: number;
  update(deltaTime: number, entities: GameEntity[]): void;
  initialize(): void;
  destroy(): void;
}
```

#### Components
```typescript
interface Component {
  readonly type: ComponentType;
  readonly entityId: string;
  isActive: boolean;
}
```

### Naming Conventions

- **Interfaces**: PascalCase with descriptive names (`GameEntity`, `AssetLoader`)
- **Types**: PascalCase (`EntityType`, `ComponentType`)
- **Enums**: PascalCase with UPPER_CASE values (`WeatherType.CLEAR`)
- **Files**: PascalCase for classes, camelCase for utilities (`GameScene.ts`, `utils.ts`)

### Import/Export Patterns

#### Prefer named exports
```typescript
// Good
export class GameScene extends Phaser.Scene { }
export interface GameConfig { }

// Avoid default exports except for main entry points
export default class Game extends Phaser.Game { } // Only for main.ts
```

#### Use path aliases
```typescript
// Good
import { GameEntity } from '@/types/GameTypes';
import { AssetLoader } from '@/systems/AssetLoader';

// Avoid relative imports beyond one level
import { Utils } from '../../../utils/Utils'; // Avoid
```

### Function Signatures

#### Explicit return types for public APIs
```typescript
// Required for public methods
public createEntity(type: EntityType): GameEntity {
  // implementation
}

// Optional for private/internal methods
private updatePosition(entity: GameEntity) {
  // implementation
}
```

#### Generic constraints
```typescript
interface Repository<T extends GameEntity> {
  findById(id: string): T | undefined;
  save(entity: T): void;
}
```

## Performance Considerations

### Type Assertions
```typescript
// Use type guards instead of assertions when possible
function isPlayer(entity: GameEntity): entity is Player {
  return entity.type === EntityType.PLAYER;
}

// Only use assertions when you're certain
const player = entity as Player; // Use sparingly
```

### Compilation Performance
- Keep type complexity reasonable
- Use `interface` over `type` for object shapes
- Leverage incremental compilation with `composite: true`

## Integration with Phaser

### Scene Types
```typescript
class GameScene extends Phaser.Scene {
  private entities: GameEntity[] = [];
  private systems: System[] = [];

  create(): void {
    // Type-safe scene initialization
  }

  update(time: number, delta: number): void {
    // Type-safe game loop
  }
}
```

### Asset Loading
```typescript
interface AssetManifest {
  readonly images: Record<string, AssetDefinition>;
  readonly audio: Record<string, AssetDefinition>;
  readonly data: Record<string, AssetDefinition>;
}
```

## Error Handling

### Type-safe error handling
```typescript
type Result<T, E = Error> = 
  | { success: true; data: T }
  | { success: false; error: E };

function loadAsset(path: string): Result<Phaser.Textures.Texture> {
  try {
    // loading logic
    return { success: true, data: texture };
  } catch (error) {
    return { success: false, error: error as Error };
  }
}
```

## Testing Standards

### Type-safe tests
```typescript
describe('GameEntity', () => {
  let entity: GameEntity;

  beforeEach(() => {
    entity = createTestEntity();
  });

  it('should update position correctly', () => {
    const newPosition: Vector2D = { x: 10, y: 20 };
    entity.position = newPosition;
    expect(entity.position).toEqual(newPosition);
  });
});
```

## Migration Guidelines

### Converting JavaScript to TypeScript

1. **Rename file** from `.js` to `.ts`
2. **Add type annotations** starting with function parameters and return types
3. **Define interfaces** for object shapes
4. **Enable strict mode** and fix all type errors
5. **Add proper imports/exports** using TypeScript syntax
6. **Update build configuration** to include the new TypeScript files

### Example Migration
```javascript
// Before (JavaScript)
function createEntity(type, x, y) {
  return {
    id: generateId(),
    type: type,
    position: { x: x, y: y },
    active: true
  };
}
```

```typescript
// After (TypeScript)
interface Entity {
  readonly id: string;
  readonly type: EntityType;
  position: Vector2D;
  active: boolean;
}

function createEntity(type: EntityType, x: number, y: number): Entity {
  return {
    id: generateId(),
    type,
    position: { x, y },
    active: true
  };
}
```

## Tools and Configuration

### Required Tools
- **TypeScript Compiler**: Latest stable version
- **ESLint**: With TypeScript parser and rules
- **Prettier**: For consistent code formatting
- **VS Code**: With TypeScript extensions

### Recommended VS Code Extensions
- TypeScript Importer
- Error Lens
- TypeScript Hero
- Bracket Pair Colorizer

## Code Review Checklist

- [ ] All game code is TypeScript
- [ ] Strict mode passes without errors
- [ ] Public APIs have explicit return types
- [ ] Interfaces are used instead of `any`
- [ ] Path aliases are used for imports
- [ ] ESLint passes with TypeScript rules
- [ ] No unnecessary type assertions
- [ ] Generic constraints are appropriate
- [ ] Error handling is type-safe

## Performance Requirements

- TypeScript compilation: < 5 seconds for full build
- Incremental compilation: < 1 second
- Runtime performance: No degradation vs JavaScript
- Bundle size: TypeScript types stripped in production

---

Following these guidelines ensures a consistent, type-safe development experience that leverages TypeScript's full potential for game development while maintaining the performance and flexibility needed for rapid prototyping.
