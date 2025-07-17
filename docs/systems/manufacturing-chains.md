# Manufacturing Chains System Design

## Overview
The Manufacturing Chains system enables players to transform raw resources into complex equipment and structures through discovered recipes and automated production facilities.

## Manufacturing Facilities

### 3D Printer
- **Purpose**: Basic fabrication of structural components and tools
- **Power Requirement**: 15kW active, 2kW idle
- **Input**: Raw materials (metals, polymers)
- **Output**: Physical components, casings, basic tools
- **Recipes**: 
  - Storage Container: 50 Iron + 20 Silicon
  - Solar Panel Frame: 30 Aluminum + 10 Copper
  - Basic Probe Chassis: 100 Titanium + 50 Carbon

### Circuit Assembler
- **Purpose**: Electronic component manufacturing
- **Power Requirement**: 20kW active, 5kW idle
- **Tiers**:
  - BASIC (7nm): Standard automation circuits
  - ADVANCED (3nm): Multi-probe coordination
  - QUANTUM (1nm): AI-level processing
- **Input**: Silicon wafers, rare elements, gold
- **Output**: Circuit boards, processors, memory

### Chemical Processor
- **Purpose**: Element refinement and compound creation
- **Power Requirement**: 25kW active, 3kW idle
- **Processes**:
  - Refinement: Ore → Pure elements
  - Synthesis: Combine elements → Compounds
  - Catalysis: Accelerated reactions
- **Special Features**: Temperature/pressure control

## Recipe System

### Recipe Discovery
- **Known Recipes**: Start with 5-10 basic recipes
- **Discovery Methods**:
  - Experimentation: Try random combinations
  - Analysis: Scan manufactured items
  - Data Logs: Find recipes in ruins
  - Research: Unlock through tech tree

### Recipe Categories

#### Basic Components
- **Metal Sheets**: 10 Iron → 5 Sheets
- **Wire Coils**: 5 Copper → 10 Coils  
- **Insulation**: 3 Carbon + 2 Silicon → 5 Insulation
- **Glass Panels**: 10 Silicon → 3 Panels

#### Intermediate Parts
- **Power Cells**: 5 Lithium + 3 Copper + Circuit
- **Servo Motors**: 10 Iron + 5 Copper + 2 Magnets
- **Sensors**: 3 Silicon + 2 Gold + Basic Circuit
- **Heat Sinks**: 10 Aluminum + 5 Copper

#### Advanced Equipment
- **Mining Laser Mk2**: Lens + Power Cell + Advanced Circuit + Titanium Frame
- **Quantum Scanner**: Quantum Circuit + Rare Earth Magnets + Sensor Array
- **Fusion Battery**: Deuterium + Lithium + Quantum Circuit + Containment Shell

#### Structures
- **Equipment Bay**: 200 Iron + 100 Silicon + 10 Circuits + 50 Aluminum
- **Power Relay**: 50 Copper + 20 Gold + 5 Advanced Circuits
- **Storage Silo**: 500 Iron + 100 Carbon + Control System

## Production Chains

### Example: Advanced Mining Laser
```
Raw Materials:
├─ Titanium Ore (30) → Refined Titanium (10)
├─ Silicon (20) → Optical Lens (1)
├─ Gold (5) + Silicon (10) → Advanced Circuit (1)
├─ Lithium (10) + Copper (5) → Power Cell (1)
└─ Carbon (15) → Focusing Crystal (1)

Assembly:
All components → 3D Printer → Advanced Mining Laser
Time: 180 seconds
Power: 45kW total
```

### Manufacturing Queue System
- **Queue Capacity**: 10 items per facility
- **Priority System**: Drag to reorder
- **Batch Production**: Set repeat counts
- **Dependencies**: Auto-queue sub-components
- **Pause/Resume**: Maintain progress

## Automation Features

### Input/Output Management
- **Auto-Pull**: Draw from connected storage
- **Smart Routing**: Send outputs to appropriate storage
- **Buffer Storage**: 50 items input/output buffer
- **Overflow Handling**: Pause when output full

### Production Optimization
- **Parallel Processing**: Multiple facilities
- **Pipeline Efficiency**: Minimize idle time
- **Power Management**: Stagger high-draw operations
- **Recipe Caching**: Remember successful discoveries

## Quality and Efficiency

### Quality Tiers
- **Basic**: 100% material cost, standard output
- **Improved**: 90% material cost, 10% chance of bonus
- **Advanced**: 80% material cost, faster production
- **Master**: 70% material cost, chance of double output

### Efficiency Modifiers
- **Power Surplus**: +10% speed with excess power
- **Temperature**: Optimal range for chemical processes
- **Maintenance**: Degradation over time without service
- **Upgrades**: Permanent facility improvements

## Recipe Balance

### Time Costs
- **Basic Items**: 10-30 seconds
- **Intermediate**: 60-120 seconds
- **Advanced**: 180-300 seconds
- **Mega Projects**: 10-30 minutes

### Material Ratios
- **Common Materials**: 10:1 to 5:1 waste
- **Refined Materials**: 3:1 typical
- **Precision Items**: 1:1 with catalysts
- **Efficiency Improves**: With better equipment

### Power Economics
- **Energy per Item**: Balanced against value
- **Batch Efficiency**: Lower power per unit in batches
- **Idle Drain**: Encourages turning off facilities
- **Peak Management**: Stagger production

## UI Integration

### Recipe Browser
- **Tree View**: Hierarchical categories
- **Grid View**: Visual recipe cards
- **Search**: By name, material, output
- **Favorites**: Pin frequently used

### Production Monitor
- **Timeline View**: See all active production
- **Resource Flow**: Visualize material usage
- **Bottleneck Alerts**: Identify constraints
- **Efficiency Metrics**: Track performance

## Late Game Features

### Mega-Manufacturing
- **Assembly Lines**: Chain facilities
- **Mass Production**: 10x batches
- **Exotic Recipes**: Quantum/alien tech
- **Self-Replication**: Probe manufacturing

### Research Integration
- **Tech Unlocks**: New recipe categories
- **Efficiency Research**: Reduce costs
- **Discovery Aids**: Hint system
- **Mastery System**: Specialization bonuses

## Technical Implementation

### Recipe Data Structure
```typescript
interface Recipe {
  id: string;
  name: string;
  category: RecipeCategory;
  inputs: ResourceRequirement[];
  outputs: ResourceOutput[];
  facility: FacilityType;
  powerCost: number;
  duration: number;
  discovered: boolean;
  techRequired?: TechNode;
}

interface ResourceRequirement {
  elementId: number;
  quantity: number;
  quality?: QualityTier;
}
```

### Manufacturing Queue
```typescript
class ManufacturingQueue {
  items: QueueItem[];
  maxSize: number = 10;
  
  add(recipe: Recipe, quantity: number): void;
  remove(index: number): void;
  reorder(from: number, to: number): void;
  pause(): void;
  resume(): void;
  getProgress(): number;
  getTimeRemaining(): number;
}
```