# Phaser 3 Implementation Guide
## New Eden Project - Technical Implementation Patterns

### Framework Overview

**Target Framework**: Phaser 3.70+ with TypeScript 5.0+
**Performance Goal**: 60 FPS on mid-range hardware (GTX 1060, 8GB RAM)
**Architecture**: Component-based design with performance-first optimization

---

## Core System Implementations

### 1. Equipment System Architecture

#### 4-Slot Grid Implementation
```typescript
class EquipmentSlotSystem {
  private slots: Phaser.GameObjects.Container[] = [];
  private equippedItems: Equipment[] = new Array(4).fill(null);
  
  constructor(scene: Phaser.Scene) {
    // Create 4-slot visual grid using Phaser containers
    this.createSlotGrid(scene);
    this.setupDragAndDrop(scene);
  }
  
  private createSlotGrid(scene: Phaser.Scene): void {
    for (let i = 0; i < 4; i++) {
      const slot = scene.add.container(100 + (i * 80), 100);
      
      // Background slot sprite
      const slotBg = scene.add.rectangle(0, 0, 64, 64, 0x333333);
      slotBg.setStrokeStyle(2, 0x666666);
      slot.add(slotBg);
      
      this.slots.push(slot);
    }
  }
  
  private setupDragAndDrop(scene: Phaser.Scene): void {
    // Enable drag-and-drop using Phaser's input system
    scene.input.setDraggable(/* equipment sprites */);
    
    scene.input.on('drag', (pointer, gameObject, dragX, dragY) => {
      gameObject.x = dragX;
      gameObject.y = dragY;
    });
    
    scene.input.on('drop', (pointer, gameObject, dropZone) => {
      this.handleEquipmentDrop(gameObject, dropZone);
    });
  }
}
```

#### Equipment Compatibility Visual System
```typescript
enum CompatibilityState {
  COMPATIBLE = 0x00ff00,    // Green
  SUBOPTIMAL = 0xffff00,    // Yellow  
  INCOMPATIBLE = 0xff0000   // Red
}

class CompatibilityIndicator {
  updateCompatibility(equipment: Equipment, environment: Environment): void {
    const compatibility = this.calculateCompatibility(equipment, environment);
    
    // Use Phaser sprite tinting for performance
    equipment.sprite.setTint(compatibility);
    
    // Add subtle glow effect for emphasis
    if (compatibility === CompatibilityState.INCOMPATIBLE) {
      this.addWarningGlow(equipment.sprite);
    }
  }
  
  private addWarningGlow(sprite: Phaser.GameObjects.Sprite): void {
    // Use Phaser's built-in effects instead of custom shaders
    sprite.setPostPipeline('glow');
  }
}
```

### 2. Solar Energy System Implementation

#### Strategic Solar Panel Placement
```typescript
class SolarPanelSystem {
  private readonly EFFICIENCY_LOOKUP = {
    dawn: { north: 20, east: 80, south: 40, west: 20 },
    midday: { north: 40, east: 60, south: 100, west: 60 },
    dusk: { north: 20, east: 20, south: 40, west: 80 },
    night: { north: 0, east: 0, south: 0, west: 0 }
  };
  
  private readonly UPDATE_INTERVAL = 100; // ms
  private updateTimer = 0;
  
  update(delta: number): void {
    this.updateTimer += delta;
    if (this.updateTimer >= this.UPDATE_INTERVAL) {
      this.calculatePowerGeneration();
      this.updateTimer = 0;
    }
  }
  
  private calculatePowerGeneration(): void {
    // Performance-optimized lookup instead of trigonometry
    const efficiency = this.EFFICIENCY_LOOKUP[this.timeOfDay][this.direction];
    const terrainBonus = this.getTerrainBonus();
    const weatherPenalty = this.getWeatherPenalty();
    
    this.currentOutput = efficiency * terrainBonus * weatherPenalty;
  }
}
```

#### Energy UI Implementation
```typescript
class EnergyDisplayUI {
  private energyBar: Phaser.GameObjects.Graphics;
  private powerIndicators: Phaser.GameObjects.Text[] = [];
  
  constructor(scene: Phaser.Scene) {
    this.createEnergyBar(scene);
    this.createPowerIndicators(scene);
  }
  
  updateEnergyDisplay(current: number, maximum: number): void {
    // Efficient graphics update using Phaser's built-in systems
    this.energyBar.clear();
    this.energyBar.fillStyle(0x00ff00);
    
    const fillWidth = (current / maximum) * 200;
    this.energyBar.fillRect(10, 10, fillWidth, 20);
    
    // Batch text updates to minimize draw calls
    this.powerIndicators.forEach((indicator, index) => {
      indicator.setText(`Panel ${index + 1}: ${this.panelOutputs[index]}%`);
    });
  }
}
```

### 3. Circuit Manufacturing Visualization

#### Nanometer Achievement Effects
```typescript
class CircuitFabricationScene extends Phaser.Scene {
  fabricateCircuit(tier: CircuitTier): void {
    // Visual celebration for nanometer achievements
    const achievement = this.createAchievementDisplay(tier);
    
    switch(tier) {
      case CircuitTier.FOUNDATION:
        this.displayAchievement("28nm FOUNDATION Fabrication!", "Reliable foundation technology!");
        this.playSound('achievement_foundation');
        break;
      case CircuitTier.RELIABLE:
        this.displayAchievement("14nm RELIABLE Circuits!", "Dependable manufacturing achieved!");
        this.playSound('achievement_reliable');
        break;
      case CircuitTier.PRECISION:
        this.displayAchievement("7nm PRECISION Breakthrough!", "High-precision fabrication!");
        this.playSound('achievement_precision');
        break;
      case CircuitTier.ADVANCED:
        this.displayAchievement("3nm ADVANCED Technology!", "Beyond current production limits!");
        this.playSound('achievement_advanced');
        break;
      case CircuitTier.QUANTUM:
        this.displayAchievement("1nm QUANTUM Precision!", "Quantum-scale manufacturing!");
        this.playSound('achievement_quantum');
        break;
      case CircuitTier.TRANSCENDENT:
        this.displayAchievement("Sub-nm TRANSCENDENT!", "Theoretical perfection achieved!");
        this.playSound('achievement_transcendent');
        break;
    }
  }
  
  private createFabricationAnimation(scale: string): void {
    // Use Phaser's particle system for circuit fabrication effects
    const particles = this.add.particles(400, 300, 'spark', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.5, end: 0 },
      blendMode: 'ADD',
      lifespan: 600,
      tint: this.getScaleColor(scale)
    });
    
    // Animate circuit assembly with tweens
    this.tweens.add({
      targets: particles,
      duration: 2000,
      onComplete: () => particles.destroy()
    });
  }
}
```

### 4. Multi-Probe Management System

#### Hybrid Control Implementation
```typescript
enum ProbeControlMode {
  DIRECT = "direct",
  ASSISTED = "assisted",
  AUTONOMOUS = "autonomous"
}

class MultiProbeManager {
  private probes: Map<string, ProbeController> = new Map();
  private activeProbeId: string;
  private readonly MAX_DIRECT_UPDATES = 1;
  
  update(delta: number): void {
    let directUpdates = 0;
    
    for (const [id, probe] of this.probes) {
      switch (probe.controlMode) {
        case ProbeControlMode.DIRECT:
          if (directUpdates < this.MAX_DIRECT_UPDATES) {
            probe.update(delta);
            directUpdates++;
          }
          break;
          
        case ProbeControlMode.ASSISTED:
          probe.updateAssisted(delta);
          break;
          
        case ProbeControlMode.AUTONOMOUS:
          // Rotational updates for performance
          if (this.shouldUpdateAutonomous(id)) {
            probe.updateSimplified(delta);
          }
          break;
      }
    }
  }
  
  private shouldUpdateAutonomous(probeId: string): boolean {
    // Rotate autonomous updates across frames
    const frameCount = this.scene.game.loop.frame;
    const probeIndex = Array.from(this.probes.keys()).indexOf(probeId);
    return (frameCount % this.probes.size) === probeIndex;
  }
}
```

#### Consciousness Transfer UI
```typescript
class ConsciousnessTransferUI {
  showTransferOptions(newProbe: ProbeController): void {
    // Create modal dialog for control mode selection
    const modal = this.scene.add.container(400, 300);
    
    const background = this.scene.add.rectangle(0, 0, 400, 200, 0x000000, 0.8);
    const title = this.scene.add.text(0, -60, 'Consciousness Transfer Complete', {
      fontSize: '24px',
      color: '#00ff00'
    }).setOrigin(0.5);
    
    // Control mode buttons
    const directButton = this.createModeButton(-100, 0, 'Direct Control', 
      () => this.setControlMode(newProbe, ProbeControlMode.DIRECT));
    const assistedButton = this.createModeButton(0, 0, 'Assisted Mode',
      () => this.setControlMode(newProbe, ProbeControlMode.ASSISTED));  
    const autonomousButton = this.createModeButton(100, 0, 'Autonomous',
      () => this.setControlMode(newProbe, ProbeControlMode.AUTONOMOUS));
    
    modal.add([background, title, directButton, assistedButton, autonomousButton]);
  }
}
```

### 5. Discovery-Based Chemistry System

#### Recipe Discovery Interface
```typescript
class ChemicalDiscoverySystem {
  private knownRecipes: Map<string, ChemicalRecipe> = new Map();
  
  experimentWithMaterials(inputs: ResourceType[]): ChemicalRecipe | null {
    const recipeKey = this.generateRecipeKey(inputs);
    
    // Check if already discovered
    if (this.knownRecipes.has(recipeKey)) {
      return this.knownRecipes.get(recipeKey);
    }
    
    // Validate combination using lookup table (performance-friendly)
    const recipe = this.validateRecipe(inputs);
    if (recipe) {
      this.knownRecipes.set(recipeKey, recipe);
      this.showDiscoveryEffect(recipe);
      return recipe;
    }
    
    return null;
  }
  
  private showDiscoveryEffect(recipe: ChemicalRecipe): void {
    // Visual feedback for successful discovery
    const discoveryText = this.scene.add.text(400, 200, 
      `Discovery: ${recipe.name}!`, {
        fontSize: '32px',
        color: '#ffff00'
      }
    ).setOrigin(0.5);
    
    // Educational context popup
    const contextText = this.scene.add.text(400, 250,
      recipe.engineeringInsight, {
        fontSize: '16px',
        color: '#ffffff',
        wordWrap: { width: 300 }
      }
    ).setOrigin(0.5);
    
    // Animate discovery notification
    this.scene.tweens.add({
      targets: [discoveryText, contextText],
      alpha: { from: 1, to: 0 },
      y: '-=50',
      duration: 3000,
      onComplete: () => {
        discoveryText.destroy();
        contextText.destroy();
      }
    });
  }
}
```

### 6. Performance Optimization Patterns

#### Object Pooling for Projectiles/Particles
```typescript
class ProjectilePool {
  private pool: Phaser.GameObjects.Sprite[] = [];
  private scene: Phaser.Scene;
  
  constructor(scene: Phaser.Scene, initialSize: number = 10) {
    this.scene = scene;
    this.initializePool(initialSize);
  }
  
  private initializePool(size: number): void {
    for (let i = 0; i < size; i++) {
      const projectile = this.scene.add.sprite(0, 0, 'projectile');
      projectile.setVisible(false);
      this.pool.push(projectile);
    }
  }
  
  getProjectile(): Phaser.GameObjects.Sprite {
    const projectile = this.pool.pop();
    if (projectile) {
      projectile.setVisible(true);
      return projectile;
    } else {
      // Pool exhausted, create new one
      return this.scene.add.sprite(0, 0, 'projectile');
    }
  }
  
  releaseProjectile(projectile: Phaser.GameObjects.Sprite): void {
    projectile.setVisible(false);
    projectile.setPosition(0, 0);
    this.pool.push(projectile);
  }
}
```

#### Efficient Tilemap Usage for World Generation
```typescript
class WorldGenerationScene extends Phaser.Scene {
  generateWorld(worldData: WorldData): void {
    // Use Phaser tilemaps for optimal rendering performance
    const map = this.make.tilemap({
      tileWidth: 64,
      tileHeight: 64,
      width: worldData.width,
      height: worldData.height
    });
    
    // Pre-baked tileset for geological layers
    const terrainTileset = map.addTilesetImage('terrain', 'terrain-tiles');
    
    // Create layers for different geological features
    const baseLayer = map.createLayer('base', terrainTileset, 0, 0);
    const resourceLayer = map.createLayer('resources', terrainTileset, 0, 0);
    const hazardLayer = map.createLayer('hazards', terrainTileset, 0, 0);
    
    // Use tilemap collision for efficient environmental detection
    baseLayer.setCollisionByProperty({ collides: true });
    
    // Enable culling for large worlds
    this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);
  }
}
```

#### Sprite Batching for UI Elements
```typescript
class PerformantUI {
  private uiContainer: Phaser.GameObjects.Container;
  
  constructor(scene: Phaser.Scene) {
    this.uiContainer = scene.add.container(0, 0);
    this.setupBatchedSprites(scene);
  }
  
  private setupBatchedSprites(scene: Phaser.Scene): void {
    // Use texture atlas for UI elements to minimize draw calls
    const uiAtlas = scene.textures.get('ui-atlas');
    
    // Batch similar UI elements together
    const energyBars = scene.add.group({
      defaultKey: 'ui-atlas',
      defaultFrame: 'energy-bar'
    });
    
    // Update UI elements in batches
    this.updateUIBatch(energyBars);
  }
  
  private updateUIBatch(group: Phaser.GameObjects.Group): void {
    // Batch updates to minimize individual sprite calls
    group.children.entries.forEach((sprite, index) => {
      const uiSprite = sprite as Phaser.GameObjects.Sprite;
      uiSprite.setPosition(10, 10 + (index * 30));
      uiSprite.setAlpha(this.getEnergyLevel(index));
    });
  }
}
```

---

## Development Best Practices

### Performance Testing Framework
```typescript
class PerformanceMonitor {
  private fpsCounter: number = 0;
  private frameTime: number = 0;
  
  update(): void {
    this.fpsCounter = this.scene.game.loop.actualFps;
    this.frameTime = this.scene.game.loop.delta;
    
    // Alert if performance drops below 60 FPS
    if (this.fpsCounter < 60) {
      console.warn(`Performance warning: ${this.fpsCounter} FPS`);
    }
  }
  
  logPerformanceMetrics(): void {
    console.log(`FPS: ${this.fpsCounter}, Frame Time: ${this.frameTime}ms`);
  }
}
```

### Memory Management
```typescript
class SceneManager extends Phaser.Scene {
  shutdown(): void {
    // Clean up resources when switching scenes
    this.textures.destroy();
    this.sound.destroy();
    this.input.destroy();
    
    // Clear object pools
    this.projectilePool.clear();
    this.particlePool.clear();
  }
  
  preload(): void {
    // Use compressed textures and atlases
    this.load.atlas('sprites', 'sprites.png', 'sprites.json');
    this.load.audio('sounds', 'sounds.webm'); // Use WebM for compression
  }
}
```

This implementation guide ensures that New Eden Project leverages Phaser 3's strengths while maintaining the 60 FPS performance requirement across all major game systems.
