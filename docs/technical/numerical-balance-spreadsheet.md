# Numerical Balance Spreadsheet - New Eden Project

## Document Information
- **Document Type**: Game Balance Specification & Reference
- **Target Audience**: Development Team, Game Designers, QA Testers
- **Status**: Complete Balance Framework
- **Dependencies**: Power Systems, Equipment Systems, Progression Design
- **Implementation Priority**: HIGH - Critical for development

---

## Balance Philosophy & Design Constraints

### Core Balance Principles
1. **Energy as Primary Constraint**: Power management drives strategic decisions without punishing exploration
2. **Meaningful Equipment Choices**: Each equipment slot decision has strategic consequences
3. **Progressive Complexity**: Tutorial simplicity → Pre-replication challenge → Multi-probe coordination
4. **Automation Incentive**: Single-probe limitations drive desire for fleet expansion
5. **60 FPS Performance**: All values optimized for discrete 100ms update intervals

### Critical Balance Constraints
- **Solar Panel Output**: 10 units/minute baseline (optimal conditions)
- **Equipment Slots**: 4 total slots create meaningful trade-offs
- **Battery Capacity**: 100 units baseline storage
- **Tutorial Duration**: 15-minute guided experience
- **Progression Timing**: 2-4 hours to first replication milestone

---

## Energy System Balance Framework - Real-World Power Specifications

### Power Unit System Definition

#### Energy Unit Conversion (Based on Real-World Solar Technology)
**Base Energy Unit: Watt-hours (Wh)**
- **1 Energy Unit = 100 Wh** (convenient scaling for gameplay)
- **Real-world reference**: Standard residential solar panel = ~400W peak
- **Unknown planet scaling**: 25% efficiency due to different star spectrum and atmospheric conditions

#### Real-World Solar Panel Baseline
```
Standard Earth Solar Panel (400W peak):
- Peak Generation: 400W = 4 Energy Units/minute (under optimal conditions)
- Daily Average: ~150W = 1.5 Energy Units/minute (accounting for day/night/weather)
- Annual Average: ~120W = 1.2 Energy Units/minute (seasonal variations)

New Eden Project Scaling (25% efficiency):
- Peak Generation: 100W = 1 Energy Unit/minute per panel
- Optimal Conditions: 25% boost = 1.25 Energy Units/minute
- Standard Conditions: Base rate = 1 Energy Unit/minute
```

### Solar Energy Generation (Watt-hour Based)

#### Solar Panel Power Output Table
```
Time Period          | Duration | North | East  | South | West  | Actual Power Output
-------------------- | -------- | ----- | ----- | ----- | ----- | ------------------
Dawn                 | 2 hours  | 20W   | 80W   | 40W   | 20W   | 0.2-0.8 EU/min
Morning              | 2 hours  | 40W   | 60W   | 80W   | 40W   | 0.4-0.8 EU/min  
Midday (Peak)        | 2 hours  | 40W   | 60W   | 100W  | 60W   | 0.4-1.0 EU/min
Afternoon            | 2 hours  | 40W   | 40W   | 80W   | 60W   | 0.4-0.8 EU/min
Dusk                 | 2 hours  | 20W   | 20W   | 40W   | 80W   | 0.2-0.8 EU/min
Night                | 12 hours | 0W    | 0W    | 0W    | 0W    | 0 EU/min
```
*EU = Energy Units (100 Wh each)*

#### Weather Impact Modifiers (Realistic Atmospheric Effects)
- **Clear Skies**: 100% efficiency (60% of time) - No atmospheric interference
- **Cloudy Conditions**: 60% efficiency (30% of time) - Light diffusion and absorption
- **Storm Systems**: 20% efficiency (10% of time) - Heavy cloud cover, requires shelter

#### Solar Panel Technology Progression
| Panel Type | Peak Power | Energy Output | Efficiency vs Earth | Manufacturing Cost | Earth Equivalent |
|------------|------------|---------------|-------------------|-------------------|------------------|
| **Basic Solar Panel** | 100W | 1.0 EU/min | 25% | 5 Silicon + 2 kWh Energy | 400W residential panel |
| **Advanced Solar Panel** | 160W | 1.6 EU/min | 40% | 8 Silicon + 2 Rare Metal + 3.5 kWh | 640W high-efficiency panel |
| **Industrial Solar Array** | 250W | 2.5 EU/min | 62.5% | 12 Silicon + 5 Rare Metal + 5 kWh | 1000W commercial panel |

### Battery Storage Systems (Real-World Energy Density)

#### Battery Technology Specifications
| Battery Type | Capacity | Energy Density | Charge/Discharge Rate | Real-World Equivalent |
|--------------|----------|----------------|----------------------|----------------------|
| **Basic Battery** | 10 kWh (100 EU) | 150 Wh/kg | 90% efficiency | Tesla Powerwall 2 (13.5 kWh) |
| **Advanced Battery** | 20 kWh (200 EU) | 200 Wh/kg | 95% efficiency | LiFePO4 industrial pack |
| **Industrial Battery** | 40 kWh (400 EU) | 250 Wh/kg | 98% efficiency | Grid-scale lithium storage |

**Manufacturing Cost Reference**:
- Basic Battery: 3 Silicon + 1 Rare Metal + 1.5 kWh Energy (lithium-ion equivalent)
- Advanced Battery: 5 Silicon + 3 Rare Metal + 3 kWh Energy (advanced chemistry)
- Industrial Battery: 8 Silicon + 6 Rare Metal + 5 kWh Energy (optimized grid storage)

---

## Equipment Power Consumption Reference (Watt-hour System)

### Analysis & Detection Equipment

| Equipment | Passive Mode | Active Mode | Intensive Mode | Real-World Power | Manufacturing Cost |
|-----------|--------------|-------------|----------------|------------------|-------------------|
| **Basic Scanner** | 10W (0.1 EU/min) | 30W (0.3 EU/min) | 50W (0.5 EU/min) | Tablet computer | 2 Silicon + 1 kWh |
| **Ground Penetrator** | 20W (0.2 EU/min) | 40W (0.4 EU/min) | 80W (0.8 EU/min) | Ground-penetrating radar | 4 Silicon + 1 Rare Metal + 2 kWh |
| **Advanced Scanner** | 20W (0.2 EU/min) | 60W (0.6 EU/min) | 120W (1.2 EU/min) | Scientific spectrometer | 6 Silicon + 3 Rare Metal + 3.5 kWh |

**Design Notes**:
- Passive modes: Similar to smartphone/tablet power consumption
- Active modes: Comparable to laptop under load
- Intensive modes: Small desktop computer equivalent

### Extraction & Processing Equipment

| Equipment | Light Operation | Standard Operation | Heavy Operation | Real-World Power | Manufacturing Cost |
|-----------|-----------------|-------------------|-----------------|------------------|-------------------|
| **Mining Laser** | 300W (3 EU/min) | 400W (4 EU/min) | 800W (8 EU/min) | Industrial laser cutter | 3 Silicon + 1 Iron + 1.5 kWh |
| **Advanced Drill** | 800W (8 EU/min) | 1000W (10 EU/min) | 1500W (15 EU/min) | Industrial drill press | 5 Silicon + 2 Rare Metal + 2.5 kWh |
| **Chemical Processor** | 600W (6 EU/min) | 800W (8 EU/min) | 1200W (12 EU/min) | Laboratory reactor | 4 Silicon + 2 Iron + 2 kWh |

**Design Notes**:
- Light operations: Hand tool equivalent power
- Standard operations: Small workshop machine power
- Heavy operations: Industrial equipment power draw

### Manufacturing & Fabrication Equipment

| Equipment | Simple Items | Complex Items | Precision Items | Real-World Power | Manufacturing Cost |
|-----------|--------------|---------------|-----------------|------------------|-------------------|
| **3D Printer** | 1500W (15 EU/min) | 2500W (25 EU/min) | 3500W (35 EU/min) | Industrial 3D printer | 6 Silicon + 2 Iron + 3 kWh |
| **Circuit Assembler** | 2000W (20 EU/min) | 3000W (30 EU/min) | 4500W (45 EU/min) | PCB manufacturing line | 8 Silicon + 4 Rare Metal + 5 kWh |
| **Industrial Fabricator** | 3000W (30 EU/min) | 5000W (50 EU/min) | 8000W (80 EU/min) | Small factory line | 12 Silicon + 8 Rare Metal + 10 kWh |

**Design Notes**:
- Simple items: Desktop 3D printer equivalent
- Complex items: Professional manufacturing equipment
- Precision items: High-end industrial fabrication power

### Environmental Protection Equipment

| Equipment | Basic Protection | Enhanced Protection | Extreme Conditions | Real-World Power | Manufacturing Cost |
|-----------|------------------|-------------------|-------------------|------------------|-------------------|
| **Pressure Hull** | 300W (3 EU/min) | 800W (8 EU/min) | 1200W (12 EU/min) | Submarine life support | 4 Silicon + 2 Iron + 2.5 kWh |
| **Thermal Protection** | 500W (5 EU/min) | 1000W (10 EU/min) | 1500W (15 EU/min) | Industrial HVAC system | 5 Silicon + 2 Rare Metal + 3 kWh |
| **Radiation Shielding** | 400W (4 EU/min) | 800W (8 EU/min) | 1500W (15 EU/min) | Nuclear facility safety | 6 Silicon + 3 Rare Metal + 3.5 kWh |

**Design Notes**:
- Environmental protection systems consume significant power for active systems
- Power requirements scaled to life support and environmental control systems
- Extreme conditions require industrial-grade power consumption

### Movement & Mobility Costs (Electric Vehicle Reference)

| Terrain Type | Base Movement | Enhanced Mobility | High-Speed Travel | Real-World Reference |
|--------------|---------------|-------------------|-------------------|---------------------|
| **Optimal Terrain** | 50W (0.5 EU/min) | 150W (1.5 EU/min) | 350W (3.5 EU/min) | Electric golf cart |
| **Moderate Terrain** | 100W (1 EU/min) | 200W (2 EU/min) | 400W (4 EU/min) | Electric ATV |
| **Difficult Terrain** | 200W (2 EU/min) | 300W (3 EU/min) | 500W (5 EU/min) | Electric off-road vehicle |

**Additional Mobility Equipment**:
- **Terrain Adaptation**: +100W (+1 EU/min) - Adaptive suspension/traction systems
- **All-Terrain Access**: +200W (+2 EU/min) - Specialized mobility gear equivalent to heavy machinery

---

## Resource Generation & Processing Balance

### Resource Extraction Rates

#### Mining & Harvesting Rates
| Resource Type | Basic Tools | Advanced Tools | Industrial Tools | Depletion Rate |
|---------------|-------------|----------------|------------------|----------------|
| **Silicon** | 2 units/min | 4 units/min | 8 units/min | 5% per hour |
| **Iron** | 1.5 units/min | 3 units/min | 6 units/min | 8% per hour |
| **Carbon** | 3 units/min | 5 units/min | 10 units/min | 10% per hour |
| **Rare Metals** | 0.5 units/min | 1 unit/min | 2 units/min | 3% per hour |
| **Specialized Alloys** | 0.2 units/min | 0.5 units/min | 1 unit/min | 2% per hour |

#### Resource Processing Efficiency
| Processing Type | Basic Processor | Advanced Processor | Industrial Processor |
|-----------------|----------------|-------------------|---------------------|
| **Purification** | 80% yield | 90% yield | 95% yield |
| **Refinement** | 75% yield | 85% yield | 92% yield |
| **Synthesis** | 70% yield | 80% yield | 88% yield |

**Design Notes**:
- Resource depletion encourages exploration and probe specialization
- Processing efficiency improvements justify equipment upgrades
- Rare material scarcity drives strategic resource management

### Manufacturing Time Requirements

#### Component Production Times

| Component | Basic Fabrication | Advanced Fabrication | Batch Production |
|-----------|-------------------|---------------------|------------------|
| **FOUNDATION Circuit** | 35 seconds | 25 seconds | 18 seconds each |
| **RELIABLE Circuit** | 45 seconds | 30 seconds | 22 seconds each |
| **PRECISION Circuit** | 60 seconds | 40 seconds | 30 seconds each |
| **ADVANCED Circuit** | 90 seconds | 60 seconds | 45 seconds each |
| **QUANTUM Circuit** | 120 seconds | 80 seconds | 60 seconds each |
| **TRANSCENDENT Circuit** | 180 seconds | 120 seconds | 90 seconds each |
| **Equipment Component** | 60 seconds | 40 seconds | 30 seconds each |
| **Probe Component** | 300 seconds | 200 seconds | 150 seconds each |

#### Complex Assembly Times
| Assembly Type | Duration | Energy Required | Success Rate |
|---------------|----------|-----------------|--------------|
| **Probe Replication** | 1200 seconds | 2000 units | 90% (Basic), 95% (Advanced) |
| **Equipment Bay** | 600 seconds | 800 units | 95% (Advanced Tools) |
| **Advanced Fabricator** | 480 seconds | 600 units | 92% (Precision Tools) |
| **Circuit Assembler** | 360 seconds | 450 units | 88% (Basic), 95% (Advanced) |

**Design Notes**:
- Long manufacturing times encourage multi-probe coordination
- High energy requirements drive infrastructure investment
- Success rates create tension and reward better equipment

---

## Progression Timing Analysis

### Tutorial Phase Progression (0-15 minutes)

#### Learning Objectives & Timing
| Milestone | Target Time | Energy Budget | Key Learning |
|-----------|-------------|---------------|--------------|
| **Basic Movement** | 0-2 minutes | 10 units | WASD controls, energy awareness |
| **Resource Detection** | 2-5 minutes | 15 units | Scanner usage, resource identification |
| **First Mining** | 5-8 minutes | 25 units | Mining laser operation, material collection |
| **Energy Management** | 8-12 minutes | 40 units | Solar panels, battery management |
| **Basic Fabrication** | 12-15 minutes | 60 units | 3D printer, simple component creation |

#### Tutorial Energy Curve
```
Time (minutes): 0    3    6    9    12   15
Energy Usage:   10→  15→  25→  35→  50→  60 units
Complexity:     Low→ Low→ Med→ Med→ High→ High
```

### Pre-Replication Phase (15 minutes - 4 hours)

#### Major Milestones & Energy Requirements
| Phase | Duration | Energy Investment | Key Achievements |
|-------|----------|-------------------|------------------|
| **Equipment Specialization** | 30-60 min | 200-400 units | Advanced tools, specialized equipment |
| **Infrastructure Development** | 60-90 min | 500-800 units | Equipment Bay, advanced fabrication |
| **Circuit Technology** | 90-150 min | 1000-1500 units | Circuit manufacturing capability |
| **Replication Preparation** | 150-240 min | 2000-3000 units | Probe component manufacturing |

#### Energy Management Complexity Progression
```
Phase 1: Single solar panel, basic battery management
Phase 2: Multiple panels, weather planning
Phase 3: Advanced batteries, load scheduling
Phase 4: Industrial energy infrastructure
```

### Post-Replication Scaling (4+ hours)

#### Multi-Probe Energy Economics
| Fleet Size | Energy Generation | Operational Capacity | Coordination Overhead |
|------------|-------------------|----------------------|----------------------|
| **2 Probes** | 20-32 units/min | 150% of single probe | 5% efficiency loss |
| **3 Probes** | 30-48 units/min | 200% of single probe | 8% efficiency loss |
| **5 Probes** | 50-80 units/min | 300% of single probe | 12% efficiency loss |
| **10 Probes** | 100-160 units/min | 500% of single probe | 20% efficiency loss |

**Design Notes**:
- Coordination overhead prevents linear scaling
- Encourages strategic probe specialization
- Creates management complexity as fleet grows

---

## Equipment Progression & Unlock Requirements

### Technology Tier Progression

#### Tier 1: Survival Technology (Tutorial → 30 minutes)
| Equipment | Silicon Cost | Iron Cost | Energy Cost | Unlock Requirement |
|-----------|--------------|-----------|-------------|-------------------|
| Basic Scanner | 2 | 0 | 10 | Tutorial completion |
| Mining Laser | 3 | 1 | 15 | First resource discovery |
| Basic Solar Panel | 5 | 0 | 20 | Energy management lesson |
| 3D Printer | 6 | 2 | 30 | Manufacturing introduction |

#### Tier 2: Specialized Equipment (30 minutes → 2 hours)
| Equipment | Silicon Cost | Rare Metal Cost | Energy Cost | Unlock Requirement |
|-----------|--------------|-----------------|-------------|-------------------|
| Advanced Scanner | 6 | 3 | 35 | Resource analysis mastery |
| Advanced Drill | 5 | 2 | 25 | Deep mining necessity |
| Chemical Processor | 4 | 2 | 20 | Material refinement need |
| Advanced Solar Panel | 8 | 2 | 35 | Energy expansion demand |

#### Tier 3: Industrial Systems (2-4 hours)
| Equipment | Silicon Cost | Rare Metal Cost | Specialized Alloy Cost | Energy Cost |
|-----------|--------------|-----------------|------------------------|-------------|
| Circuit Assembler | 8 | 4 | 2 | 50 |
| Industrial Fabricator | 12 | 8 | 4 | 100 |
| Advanced Battery | 5 | 3 | 1 | 30 |
| Probe Replicator | 20 | 15 | 8 | 200 |

### Circuit Technology Progression

#### Circuit Manufacturing Requirements
| Circuit Type | Manufacturing Time | Energy Cost | Material Cost | Capabilities Unlocked |
|--------------|-------------------|-------------|---------------|----------------------|
| **Basic Circuit** | 45 seconds | 35 units/min | 3 Silicon + 1 Rare Metal | Basic automation, simple probe coordination |
| **Advanced Circuit** | 90 seconds | 35 units/min | 5 Silicon + 3 Rare Metal | Smart pathfinding, resource optimization |
| **Quantum Circuit** | 180 seconds | 35 units/min | 8 Silicon + 6 Rare Metal + 2 Specialized Alloy | Full automation, predictive systems |

#### Automation Capabilities Lookup
```javascript
const AUTOMATION_CAPABILITIES = {
  BASIC_CIRCUIT: [
    'resource_detection_automation',
    'basic_mining_queues',
    'simple_pathfinding',
    'energy_monitoring_alerts'
  ],
  ADVANCED_CIRCUIT: [
    'multi_probe_coordination',
    'smart_resource_allocation',
    'weather_pattern_adaptation',
    'equipment_optimization'
  ],
  QUANTUM_CIRCUIT: [
    'full_fleet_automation',
    'predictive_resource_management',
    'autonomous_exploration',
    'self_optimizing_systems'
  ]
};
```

---

## Energy Balance Validation Framework (Watt-hour System)

### Critical Energy Scenarios

#### Scenario 1: Tutorial Completion (15 minutes)
```
Energy Budget: 6 kWh (60 EU) total
Required Activities:
- Movement (1 kWh / 10 EU): Basic exploration and positioning (50W average)
- Scanning (1.5 kWh / 15 EU): Resource detection and analysis (100W average)  
- Mining (2 kWh / 20 EU): First material extraction (400W for 5 minutes)
- Fabrication (1.5 kWh / 15 EU): Solar panel construction (1500W for 1 minute)

Solar Generation: Basic panel @ 1 EU/min = 1.5 kWh over 15 minutes
Battery Requirement: 6 - 1.5 = 4.5 kWh (45 EU) minimum starting charge
Result: Achievable with 50% starting battery + solar generation
```

#### Scenario 2: First Circuit Manufacturing
```
Circuit Assembler Power: 3500W (35 EU/min) for precision electronics
Manufacturing Time: 45 seconds = 0.75 minutes
Energy Requirement: 3500W × 0.75 min = 2625 Wh (26.25 EU)
Solar Generation: 100W × 0.75 min = 75 Wh (0.75 EU)
Battery Requirement: 2625 - 75 = 2550 Wh (25.5 EU minimum)

Strategic Implication: Requires 25% battery reserve + strategic timing
Real-world equivalent: Running a high-end desktop computer for 45 minutes
```

#### Scenario 3: Environmental Operations (Underwater Mining)
```
Underwater Mining Configuration:
- Pressure Hull: 800W (8 EU/min) - submarine life support equivalent
- Mining Laser: 400W (4 EU/min) - industrial cutting tool
- Scanner: 300W (3 EU/min) - active sonar/detection
Total Consumption: 1500W (15 EU/min)
Solar Generation: 100W (1 EU/min) - optimal surface conditions
Net Battery Drain: 1400W (14 EU/min)
Maximum Operation Time: 10 kWh ÷ 1.4 kW = 7.1 hours theoretical
Practical Operation Time: 20 minutes (safety buffer + efficiency losses)

Strategic Implication: Environmental work requires careful power management
Real-world equivalent: Operating underwater ROV with full sensor suite
```

### Power System Reality Check

#### Comparison to Real-World Systems
| Game Equipment | Real-World Equivalent | Actual Power Draw | Game Power (Scaled) |
|----------------|----------------------|-------------------|---------------------|
| Basic Scanner | Smartphone | 5-10W | 10-30W |
| Mining Laser | Industrial Laser | 1-5 kW | 300-800W |
| 3D Printer | Industrial 3D Printer | 3-8 kW | 1500-3500W |
| Pressure Hull | Submarine Life Support | 5-15 kW | 300-1200W |
| Solar Panel | Residential Solar | 400W peak | 100W peak (25% alien efficiency) |

#### Energy Density Validation
- **Battery Energy Density**: 150-250 Wh/kg (realistic for 2025+ lithium technology)
- **Solar Panel Efficiency**: 25% of Earth efficiency (alien star spectrum + atmosphere)
- **Power Scaling**: All equipment 25% of Earth equivalent (alien materials/technology)

### Balance Validation Checkpoints

#### Energy Sufficiency Tests
1. **Tutorial completion within power constraints?** ✅ Yes, requires 50% starting battery
2. **Circuit manufacturing without excessive waiting?** ✅ Yes, 25% battery reserve sufficient
3. **Environmental operations challenging but feasible?** ✅ Yes, 20-minute operational windows
4. **Multi-probe coordination provides meaningful benefits?** ✅ Yes, parallel operations possible

#### Real-World Plausibility Check
1. **Power consumption realistic for equipment types?** ✅ Yes, scaled appropriately for alien tech
2. **Solar generation feasible for alien planet?** ✅ Yes, 25% efficiency accounts for differences
3. **Battery capacity reasonable for size/weight?** ✅ Yes, matches advanced lithium technology
4. **Manufacturing power requirements realistic?** ✅ Yes, comparable to industrial equipment

#### Progression Timing Validation
1. **Tutorial to Equipment Bay**: 30-45 minutes → Requires 3-4.5 kWh energy investment
2. **Equipment Bay to First Circuit**: 60-90 minutes → Requires 20-30 kWh total energy
3. **First Circuit to Probe Replication**: 90-180 minutes → Requires 100-200 kWh infrastructure
4. **Single Probe to Multi-Probe Fleet**: 3-5 hours → 500+ kWh energy systems needed

---

## Difficulty Curve & Player Skill Progression

### Energy Management Skill Curve

#### Novice Player Profile (0-30 minutes)
- **Energy Awareness**: Learning to monitor battery levels
- **Basic Planning**: Understanding power vs. capability trade-offs
- **Solar Timing**: Recognizing peak generation periods
- **Emergency Management**: Recovering from energy depletion

**Balance Adjustments for Novices**:
- 20% energy consumption reduction during tutorial
- Clear energy warnings at 30% and 10% battery
- Extended battery capacity (120 units instead of 100)
- Simplified weather patterns (clear skies more frequent)

#### Intermediate Player Profile (30 minutes - 2 hours)
- **Strategic Planning**: Multi-step operation planning
- **Weather Adaptation**: Adjusting activities based on conditions
- **Equipment Optimization**: Choosing efficient tool combinations
- **Infrastructure Investment**: Balancing immediate needs vs. long-term efficiency

**Standard Balance Values**: All base values apply

#### Expert Player Profile (2+ hours)
- **Advanced Coordination**: Multi-probe fleet management
- **Resource Optimization**: Maximizing extraction efficiency
- **Automation Utilization**: Leveraging circuit-based automation
- **System Mastery**: Understanding all energy interactions

**Expert Challenge Scaling**:
- 15% increased energy consumption for all operations
- More aggressive weather patterns
- Resource depletion 25% faster
- Higher complexity manufacturing requirements

### Accessibility & Difficulty Options

#### Energy Management Assistance Levels

| Difficulty Level | Energy Consumption | Battery Capacity | Solar Generation | Weather Frequency |
|------------------|-------------------|------------------|------------------|-------------------|
| **Casual** | -30% | +50% | +25% | Clear skies 80% |
| **Standard** | Baseline | Baseline | Baseline | Clear skies 60% |
| **Challenging** | +20% | -20% | -15% | Clear skies 40% |
| **Expert** | +40% | -30% | -25% | Clear skies 30% |

#### Progression Timing Options
- **Relaxed**: 2x longer for all major milestones
- **Standard**: Base progression timing
- **Accelerated**: 0.75x timing for experienced players
- **Speedrun**: 0.5x timing with achievement tracking

---

## Implementation & Testing Guidelines

### Balance Testing Protocol

#### Automated Balance Tests
1. **Energy Conservation**: Verify no energy generation/consumption exploits
2. **Progression Timing**: Automated playthroughs measuring milestone completion
3. **Resource Balance**: Validate material costs vs. availability
4. **Performance Impact**: Ensure 60 FPS with all balance calculations

#### Player Testing Scenarios
1. **Tutorial Completion**: 10 new players, measure completion time and difficulty
2. **First Replication**: Track energy management decisions and failure points
3. **Multi-Probe Coordination**: Evaluate fleet management complexity
4. **Long-Term Progression**: 10-hour gameplay sessions for endgame balance

### Development Implementation Notes

#### Performance-Optimized Balance Calculations
```javascript
// Energy update system - 100ms intervals
class BalanceOptimizedEnergySystem {
  private readonly UPDATE_INTERVAL = 100; // ms
  private updateTimer = 0;
  
  update(delta: number): void {
    this.updateTimer += delta;
    if (this.updateTimer >= this.UPDATE_INTERVAL) {
      this.updateEnergyBalance();
      this.updateTimer = 0;
    }
  }
  
  private updateEnergyBalance(): void {
    // All power consumption/generation calculations
    // Optimized for discrete intervals, not continuous
    const generation = this.calculateGeneration();
    const consumption = this.calculateConsumption();
    this.currentEnergy += (generation - consumption) * 0.1; // 100ms slice
  }
}
```

#### Balance Value Storage
```typescript
// Comprehensive TypeScript implementation-ready balance configuration
interface EquipmentConfig {
  powerConsumption: {
    idle: number;
    active: number;
    peak: number;
  };
  realWorldReference: string;
  materialCost: Record<string, number>;
  manufacturingEnergyCost: number;
}

interface CircuitTierConfig {
  name: string;
  fabricationNode: string;
  powerMultiplier: number;
  manufacturingCost: number;
  automationCapabilities: string[];
}

interface GameBalanceConfig {
  ENERGY: {
    SOLAR_BASE_OUTPUT: number;
    BATTERY_BASE_CAPACITY: number;
    UPDATE_INTERVAL: number;
    ENERGY_UNITS_PER_KWH: number;
  };
  EQUIPMENT: Record<string, EquipmentConfig>;
  CIRCUITS: Record<string, CircuitTierConfig>;
  PROGRESSION: {
    TUTORIAL_TARGET: number;
    FIRST_CIRCUIT_TARGET: number;
    FIRST_REPLICATION_TARGET: number;
  };
  MATERIALS: Record<string, {
    rarity: number;
    discoveryDifficulty: number;
    processingEnergy: number;
  }>;
}

// Implementation-ready balance constants
const GAME_BALANCE: GameBalanceConfig = {
  ENERGY: {
    SOLAR_BASE_OUTPUT: 10,     // units/minute baseline
    BATTERY_BASE_CAPACITY: 100, // units storage
    UPDATE_INTERVAL: 100,       // milliseconds (60 FPS compatible)
    ENERGY_UNITS_PER_KWH: 10    // 1 kWh = 10 energy units
  },
  
  EQUIPMENT: {
    basic_scanner: {
      powerConsumption: { idle: 1, active: 3, peak: 5 },
      realWorldReference: "Tablet computer",
      materialCost: { silicon: 2, iron: 1 },
      manufacturingEnergyCost: 10
    },
    mining_laser: {
      powerConsumption: { idle: 2, active: 8, peak: 12 },
      realWorldReference: "Industrial laser cutter",
      materialCost: { silicon: 3, iron: 2, titanium: 1 },
      manufacturingEnergyCost: 25
    },
    advanced_drill: {
      powerConsumption: { idle: 5, active: 15, peak: 25 },
      realWorldReference: "Mining equipment",
      materialCost: { titanium: 3, iron: 5, silicon: 2 },
      manufacturingEnergyCost: 50
    },
    circuit_fabricator: {
      powerConsumption: { idle: 10, active: 35, peak: 50 },
      realWorldReference: "Semiconductor fab equipment",
      materialCost: { silicon: 10, titanium: 5, rare_metals: 2 },
      manufacturingEnergyCost: 100
    },
    solar_panel_basic: {
      powerConsumption: { idle: 0, active: 0, peak: 0 },
      realWorldReference: "Residential solar panel",
      materialCost: { silicon: 5, iron: 3 },
      manufacturingEnergyCost: 15
    },
    solar_panel_advanced: {
      powerConsumption: { idle: 0, active: 0, peak: 0 },
      realWorldReference: "High-efficiency solar panel",
      materialCost: { silicon: 8, titanium: 2, rare_metals: 1 },
      manufacturingEnergyCost: 30
    }
  },
  
  CIRCUITS: {
    basic: {
      name: "BASIC",
      fabricationNode: "7nm",
      powerMultiplier: 1.0,
      manufacturingCost: 25,
      automationCapabilities: ["simple_mining", "basic_fabrication"]
    },
    advanced: {
      name: "ADVANCED", 
      fabricationNode: "3nm",
      powerMultiplier: 0.7,
      manufacturingCost: 50,
      automationCapabilities: ["complex_mining", "advanced_fabrication", "resource_processing"]
    },
    quantum: {
      name: "QUANTUM",
      fabricationNode: "1nm",
      powerMultiplier: 0.4,
      manufacturingCost: 100,
      automationCapabilities: ["autonomous_operations", "multi_probe_coordination", "advanced_analysis"]
    }
  },
  
  PROGRESSION: {
    TUTORIAL_TARGET: 900,        // 15 minutes in seconds
    FIRST_CIRCUIT_TARGET: 2700,  // 45 minutes
    FIRST_REPLICATION_TARGET: 14400 // 4 hours
  },
  
  MATERIALS: {
    iron: { rarity: 0.8, discoveryDifficulty: 1, processingEnergy: 2 },
    silicon: { rarity: 0.6, discoveryDifficulty: 2, processingEnergy: 3 },
    titanium: { rarity: 0.3, discoveryDifficulty: 3, processingEnergy: 5 },
    lithium: { rarity: 0.4, discoveryDifficulty: 3, processingEnergy: 4 },
    cobalt: { rarity: 0.2, discoveryDifficulty: 4, processingEnergy: 6 },
    rare_metals: { rarity: 0.1, discoveryDifficulty: 5, processingEnergy: 10 }
  }
};

// Utility functions for balance calculations
class BalanceCalculator {
  static getEquipmentPowerDraw(equipmentType: string, operationMode: 'idle' | 'active' | 'peak'): number {
    const equipment = GAME_BALANCE.EQUIPMENT[equipmentType];
    return equipment ? equipment.powerConsumption[operationMode] : 0;
  }
  
  static calculateSolarGeneration(panelType: 'basic' | 'advanced', conditions: number = 1.0): number {
    const baseGeneration = GAME_BALANCE.ENERGY.SOLAR_BASE_OUTPUT;
    const multiplier = panelType === 'advanced' ? 2.0 : 1.0;
    return baseGeneration * multiplier * conditions;
  }
  
  static getCircuitEfficiency(circuitType: string): number {
    const circuit = GAME_BALANCE.CIRCUITS[circuitType];
    return circuit ? circuit.powerMultiplier : 1.0;
  }
  
  static calculateManufacturingTime(itemType: string): number {
    const equipment = GAME_BALANCE.EQUIPMENT[itemType];
    if (!equipment) return 0;
    
    // Base manufacturing time calculation (energy cost / solar generation)
    const energyCost = equipment.manufacturingEnergyCost;
    const solarGeneration = GAME_BALANCE.ENERGY.SOLAR_BASE_OUTPUT;
    return (energyCost / solarGeneration) * 60; // Convert to seconds
  }
  
  static validateProgressionTiming(): boolean {
    // Verify tutorial can be completed within energy constraints
    const tutorialEnergyCost = this.calculateTutorialEnergyRequirement();
    const availableEnergy = GAME_BALANCE.ENERGY.BATTERY_BASE_CAPACITY * 0.5; // Start at 50%
    const solarGeneration = GAME_BALANCE.ENERGY.SOLAR_BASE_OUTPUT * 15; // 15 minutes of generation
    
    return (tutorialEnergyCost <= availableEnergy + solarGeneration);
  }
  
  private static calculateTutorialEnergyRequirement(): number {
    // Sum of tutorial actions: scanning + basic mining + first component
    return 5 + 15 + 25; // Scanner active + mining operations + fabrication
  }
}

// Lookup tables for quick runtime access
const EQUIPMENT_POWER_LOOKUP = new Map<string, { idle: number; active: number; peak: number }>();
const MATERIAL_PROCESSING_LOOKUP = new Map<string, number>();
const CIRCUIT_AUTOMATION_LOOKUP = new Map<string, string[]>();

// Initialize lookup tables for performance
Object.entries(GAME_BALANCE.EQUIPMENT).forEach(([key, config]) => {
  EQUIPMENT_POWER_LOOKUP.set(key, config.powerConsumption);
});

Object.entries(GAME_BALANCE.MATERIALS).forEach(([key, config]) => {
  MATERIAL_PROCESSING_LOOKUP.set(key, config.processingEnergy);
});

Object.entries(GAME_BALANCE.CIRCUITS).forEach(([key, config]) => {
  CIRCUIT_AUTOMATION_LOOKUP.set(key, config.automationCapabilities);
});

// Export for game engine integration
export { 
  GAME_BALANCE, 
  BalanceCalculator, 
  EQUIPMENT_POWER_LOOKUP, 
  MATERIAL_PROCESSING_LOOKUP, 
  CIRCUIT_AUTOMATION_LOOKUP,
  type GameBalanceConfig,
  type EquipmentConfig,
  type CircuitTierConfig
};
```

### Real-Time Balance Monitoring System

```typescript
class BalanceMonitor {
  private playerMetrics: Map<string, PlayerMetrics> = new Map();
  private aggregateStats: AggregateGameStats = {
    tutorialCompletionRate: 0,
    averageTutorialDuration: 0,
    energyDepletionIncidents: 0,
    firstReplicationTimes: [],
    commonProgressionBlocks: []
  };
  
  recordPlayerAction(playerId: string, action: GameAction): void {
    const metrics = this.getPlayerMetrics(playerId);
    
    switch (action.type) {
      case 'tutorial_complete':
        metrics.tutorialCompleted = true;
        metrics.tutorialDuration = action.timestamp - metrics.sessionStart;
        break;
      case 'energy_depleted':
        metrics.energyDepletions++;
        break;
      case 'first_replication':
        metrics.firstReplicationTime = action.timestamp - metrics.sessionStart;
        break;
    }
    
    this.updateAggregateStats();
  }
  
  getBalanceAdjustmentRecommendations(): BalanceAdjustment[] {
    const recommendations: BalanceAdjustment[] = [];
    
    // Tutorial completion rate analysis
    if (this.aggregateStats.tutorialCompletionRate < 0.8) {
      recommendations.push({
        component: 'tutorial_energy',
        adjustment: 'reduce_requirements',
        magnitude: 0.15,
        reason: 'Low tutorial completion rate'
      });
    }
    
    // Energy depletion frequency analysis
    if (this.aggregateStats.energyDepletionIncidents > 3) {
      recommendations.push({
        component: 'solar_generation',
        adjustment: 'increase_output',
        magnitude: 0.1,
        reason: 'High energy depletion incidents'
      });
    }
    
    return recommendations;
  }
  
  private updateAggregateStats(): void {
    const allMetrics = Array.from(this.playerMetrics.values());
    
    this.aggregateStats.tutorialCompletionRate = 
      allMetrics.filter(m => m.tutorialCompleted).length / allMetrics.length;
    
    this.aggregateStats.averageTutorialDuration = 
      allMetrics
        .filter(m => m.tutorialDuration > 0)
        .reduce((sum, m) => sum + m.tutorialDuration, 0) / 
      allMetrics.filter(m => m.tutorialDuration > 0).length;
  }
  
  private getPlayerMetrics(playerId: string): PlayerMetrics {
    if (!this.playerMetrics.has(playerId)) {
      this.playerMetrics.set(playerId, {
        sessionStart: Date.now(),
        tutorialCompleted: false,
        tutorialDuration: 0,
        energyDepletions: 0,
        firstReplicationTime: 0
      });
    }
    return this.playerMetrics.get(playerId)!;
  }
}

interface PlayerMetrics {
  sessionStart: number;
  tutorialCompleted: boolean;
  tutorialDuration: number;
  energyDepletions: number;
  firstReplicationTime: number;
}

interface AggregateGameStats {
  tutorialCompletionRate: number;
  averageTutorialDuration: number;
  energyDepletionIncidents: number;
  firstReplicationTimes: number[];
  commonProgressionBlocks: string[];
}

interface GameAction {
  type: string;
  timestamp: number;
  data?: any;
}

interface BalanceAdjustment {
  component: string;
  adjustment: string;
  magnitude: number;
  reason: string;
}
```
