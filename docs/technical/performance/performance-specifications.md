# Performance Specifications & Optimization Guidelines
## New Eden Project - Technical Design Constraints

### Performance Requirements Overview

**Primary Constraint**: Maintain 60 FPS on mid-range devices (1920x1080 minimum)
**Target Hardware**: Gaming PCs with dedicated graphics, 8GB RAM, quad-core CPU
**Framework**: Phaser 3 + TypeScript optimized for 2D performance

---

## Core Performance Design Principles

### 1. Discrete System Updates
**Principle**: Replace continuous calculations with discrete, lookup-based systems

#### Energy System Optimization
```typescript
// ❌ AVOID: Real-time trigonometry calculations
function calculateSolarEfficiency(angle: number, time: number): number {
  return Math.sin(angle) * Math.cos(time * Math.PI / 12); // 60 calculations/second
}

// ✅ PREFERRED: Lookup table with 100ms updates
interface SolarLookupTable {
  [timeOfDay: string]: {
    [direction: string]: number;
  };
}

class PerformantEnergySystem {
  private readonly UPDATE_INTERVAL = 100; // ms
  private updateTimer = 0;
  
  update(delta: number): void {
    this.updateTimer += delta;
    if (this.updateTimer >= this.UPDATE_INTERVAL) {
      this.efficiency = SOLAR_LOOKUP[this.timeOfDay][this.direction];
      this.updateTimer = 0;
    }
  }
}
```

**Performance Benefit**: Reduces calculations from 60/second to 10/second per probe

### 2. Multi-Probe Management Constraints
**Principle**: Limit active processing to maintain frame rate

#### Probe Update Distribution
```typescript
enum ProbeControlMode {
  DIRECT = "direct",       // 1 probe maximum - full 60 FPS updates
  ASSISTED = "assisted",   // 2-3 probes - player oversight, AI execution
  AUTONOMOUS = "autonomous" // Unlimited - background, rotational updates
}

class PerformantProbeManager {
  private readonly MAX_DIRECT_PROBES = 1;
  private readonly MAX_ASSISTED_PROBES = 3;
  
  update(delta: number): void {
    // Always update active probe at full framerate
    this.directProbe.update(delta);
    
    // Update assisted probes with simplified logic
    this.assistedProbes.forEach(probe => probe.updateAssisted(delta));
    
    // Rotate autonomous probe updates across frames
    this.updateAutonomousRotation(delta);
  }
}
```

**Performance Guarantee**: Never exceeds processing capacity regardless of fleet size

### 3. Component Processing Optimization
**Principle**: Declare performance requirements for all game components

#### Performance Classification System
```typescript
interface PerformantGameComponent {
  readonly updateFrequency: 'frame' | 'frequent' | 'infrequent';
  readonly priority: 'critical' | 'normal' | 'background';
  readonly maxConcurrentInstances: number;
  
  // All components must implement both update methods
  update(delta: number): void;          // Full processing for active components
  updateSimplified(delta: number): void; // Reduced processing for background components
}

// Example implementation
class MiningDrill implements PerformantGameComponent {
  readonly updateFrequency = 'frequent';
  readonly priority = 'normal';
  readonly maxConcurrentInstances = 5;
  
  update(delta: number): void {
    // Full processing: animation, sound, particle effects, collision detection
  }
  
  updateSimplified(delta: number): void {
    // Background processing: progress tracking only, no visual updates
  }
}
```

---

## System-Specific Performance Requirements

### Circuit Manufacturing System
**Design Constraint**: Simplify nanometer complexity while preserving player satisfaction

#### Balanced Implementation
```typescript
enum CircuitTier {
  CURRENT_GEN = "7nm",    // Modern flagship CPU technology
  NEXT_GEN = "3nm",       // Beyond current production limits
  THEORETICAL = "1nm"     // Quantum-precision fabrication
}

interface CircuitPerformanceSpec {
  tier: CircuitTier;
  displayScale: string;                    // Player sees: "7nm achieved!"
  automationLevel: number;                 // Discrete processing power multiplier
  unlockRequirements: ResourceRequirement[];
  
  // Performance-friendly calculation
  getProcessingPower(): number {
    return CIRCUIT_PERFORMANCE_LOOKUP[this.tier]; // Simple lookup, no complex math
  }
}
```

**Player Experience**: Still feels like semiconductor engineering advancement
**Performance**: Zero impact from nanometer calculations

### Chemical Processing System
**Design Constraint**: Recipe-based processing with discovery mechanics

#### Discovery + Performance Balance
```typescript
interface PerformantChemicalSystem {
  // Discovery maintains engineering satisfaction
  discoverRecipe(inputs: ResourceType[]): ChemicalRecipe | null;
  
  // Processing uses discrete calculations for performance
  processRecipe(recipe: ChemicalRecipe): ProcessingResult {
    return {
      success: this.hasInputs(recipe.inputs),
      outputs: recipe.outputs,                    // Pre-calculated results
      timeRequired: recipe.processingTime,        // Discrete time cost
      energyConsumed: recipe.energyCost          // Discrete energy cost
    };
  }
}
```

**Engineering Satisfaction**: Players discover realistic chemical combinations
**Performance Guarantee**: No real-time chemical simulation impact on frame rate

### Power/Energy System
**Design Constraint**: Strategic energy management without real-time calculations

#### Solar Energy Optimization
```typescript
class StrategicSolarSystem {
  // Strategic planning preserved
  private readonly EFFICIENCY_TABLE = {
    dawn: { north: 20, east: 80, south: 40, west: 20 },
    midday: { north: 40, east: 60, south: 100, west: 60 },
    dusk: { north: 20, east: 20, south: 40, west: 80 },
    night: { north: 0, east: 0, south: 0, west: 0 }
  };
  
  // Performance-optimized updates
  private readonly UPDATE_INTERVAL = 100; // ms
  
  getStrategicPlacement(): EnergyStrategy {
    // Players still make meaningful energy decisions
    // But calculations use lookup tables, not trigonometry
    return this.EFFICIENCY_TABLE[this.timeOfDay][this.direction];
  }
}
```

**Strategic Depth**: Energy planning remains a core decision
**Performance**: 100ms update intervals instead of per-frame calculations

---

## Development Guidelines

### Performance Testing Requirements
**All Systems Must Meet**:
1. **60 FPS Minimum**: No system can cause frame drops below 60 FPS
2. **Scaling Tests**: Performance validated with maximum expected concurrent objects
3. **Memory Management**: No memory leaks during extended gameplay sessions
4. **Loading Time Limits**: World generation must complete within 5 seconds

### Code Review Checklist
**Before Implementation**:
- [ ] Does this system use lookup tables instead of real-time calculations?
- [ ] Are update frequencies appropriate for the system's priority?
- [ ] Does the system gracefully handle maximum concurrent usage?
- [ ] Has the system been tested with 60 FPS monitoring active?

### Phaser 3 Optimization Patterns
**Recommended Approaches**:
```typescript
// Use object pooling for frequently created/destroyed objects
class ProbeProjectilePool {
  private pool: Phaser.GameObjects.Sprite[] = [];
  
  getProjectile(): Phaser.GameObjects.Sprite {
    return this.pool.pop() || this.scene.add.sprite(0, 0, 'projectile');
  }
  
  releaseProjectile(projectile: Phaser.GameObjects.Sprite): void {
    projectile.setVisible(false);
    this.pool.push(projectile);
  }
}

// Batch sprite updates to minimize draw calls
class PerformantSpriteManager {
  updateSpriteBatch(sprites: Phaser.GameObjects.Sprite[]): void {
    // Group sprites by texture for efficient rendering
    // Update positions in single batch operation
  }
}

// Use Phaser's built-in performance features
class OptimizedGameScene extends Phaser.Scene {
  create(): void {
    // Enable texture packing for UI elements
    this.load.atlas('ui', 'ui.png', 'ui.json');
    
    // Use tilemaps for large static environments
    this.map = this.make.tilemap({ key: 'level' });
    
    // Implement culling for off-screen objects
    this.physics.world.setBounds(0, 0, 3200, 2400);
  }
}
```

---

## Future Performance Considerations

### Planned Feature Impact Assessment
**Each new feature must document**:
1. **Performance Cost**: Expected CPU/memory impact
2. **Scaling Behavior**: How performance changes with player progression
3. **Optimization Strategy**: How the feature maintains 60 FPS requirement
4. **Fallback Options**: Performance degradation handling for lower-end hardware

### Expansion Content Guidelines
**When Adding New Systems**:
- Geothermal energy: Must use same discrete update system as solar
- Nuclear reactors: Cannot exceed current energy system performance cost  
- Advanced automation: Must respect multi-probe processing limits
- New chemical recipes: Must use existing discrete processing framework

**Performance Budget Allocation**:
- **Player Control**: 40% of CPU budget (movement, UI, direct interactions)
- **Game Systems**: 35% of CPU budget (energy, chemistry, manufacturing)
- **Multi-Probe Management**: 15% of CPU budget (assisted/autonomous probes)
- **Visual Effects**: 10% of CPU budget (particles, animations, polish)

This performance specification ensures that New Eden Project maintains smooth, responsive gameplay while delivering the complex engineering simulation experience that defines the game's core appeal.
