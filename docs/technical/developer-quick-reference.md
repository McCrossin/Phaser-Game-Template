# Developer Quick Reference
## New Eden Project - Essential Implementation Data

### Performance Monitoring Quick Reference

#### FPS Counter (Development Only)
```
Toggle: F3 key
Colors: Green (≥55 FPS) | Yellow (30-55 FPS) | Red (<30 FPS)
API: SimpleFPSCounter from '@/utils/SimpleFPSCounter'
Location: Top-left corner (development builds only)
```

#### Performance Thresholds
```
Target FPS: 60 FPS (minimum 55 FPS)
Warning Threshold: 30 FPS (console warnings logged)
Scene Load Time: <1 second (warnings for >1s)
Memory Usage: <100MB (monitor for leaks)
```

#### Console Commands (Development)
```typescript
// Available in scenes with FPS counter
this.fpsCounter?.setVisible(true);   // Show FPS
this.fpsCounter?.getCurrentFPS();    // Get current FPS
PerformanceLogger.logEvent('Custom Event', 123.45);
```

---

### Power System Quick Reference (Watt-hour Based)

#### Energy Conversion Table
```
1 Energy Unit (EU) = 100 Watt-hours (Wh)
Power Rate (EU/min) = Power (Watts) ÷ 100
Energy Capacity (EU) = Capacity (kWh) × 10

Real-World Context:
- 100W = 1 EU/min (LED lightbulb equivalent)
- 1000W = 10 EU/min (microwave equivalent)  
- 3500W = 35 EU/min (high-end desktop + monitor)
```

#### Equipment Power Consumption Lookup

| Equipment Type | Power Range (W) | Power Range (EU/min) | Real-World Equivalent |
|----------------|-----------------|----------------------|----------------------|
| **Basic Scanner** | 10-30W | 0.1-0.3 | Smartphone → Tablet |
| **Advanced Scanner** | 120-300W | 1.2-3.0 | Laptop → Desktop PC |
| **Mining Laser** | 300-800W | 3-8 | Power Drill → Industrial Cutter |
| **Advanced Drill** | 800-1500W | 8-15 | Industrial Drill → Jackhammer |
| **Chemical Processor** | 600-1200W | 6-12 | Microwave → Industrial Oven |
| **3D Printer** | 1500-2500W | 15-25 | Industrial 3D Printer |
| **Circuit Assembler** | 2000-4500W | 20-45 | Pick-and-place machine |
| **Pressure Hull** | 300-1200W | 3-12 | HVAC System → Submarine Life Support |
| **Thermal Protection** | 500-1500W | 5-15 | Space Heater → Industrial HVAC |

#### Solar Panel Specifications

| Panel Type | Power Output (W) | Power Output (EU/min) | Cost | Unlock Requirement |
|------------|------------------|-----------------------|------|-------------------|
| **Basic Solar Panel** | 100W | 1.0 | 5 Silicon | Tutorial completion |
| **Advanced Solar Panel** | 200W | 2.0 | 8 Silicon + 2 Rare Metal | Equipment Bay |
| **Industrial Solar Panel** | 250W | 2.5 | 12 Silicon + 4 Rare Metal + 2 Alloy | Circuit Technology |

**Unknown Planet Efficiency**: 25% of Earth efficiency due to star spectrum and atmospheric conditions

#### Battery System Reference

| Battery Type | Capacity (kWh) | Capacity (EU) | Charge Rate | Manufacturing Cost |
|--------------|----------------|---------------|-------------|-------------------|
| **Basic Battery** | 10 kWh | 100 EU | 50W (0.5 EU/min) | 3 Silicon + 1 Rare Metal |
| **Advanced Battery** | 20 kWh | 200 EU | 100W (1.0 EU/min) | 5 Silicon + 3 Rare Metal |
| **Industrial Battery** | 40 kWh | 400 EU | 200W (2.0 EU/min) | 8 Silicon + 5 Rare Metal + 2 Alloy |

---

### Resource Processing Chain Reference

#### Raw Material → Refined Material Processing

| Process | Input Materials | Output | Processing Time | Energy Cost (kWh) | Equipment Required |
|---------|-----------------|---------|-----------------|-------------------|-------------------|
| **Silicon Purification** | 3 Raw Silicon | 1 Silicon | 30 seconds | 0.3 kWh (3 EU) | Chemical Processor |
| **Metal Refinement** | 4 Raw Metal | 1 Rare Metal | 45 seconds | 0.9 kWh (9 EU) | Chemical Processor |
| **Alloy Creation** | 2 Silicon + 1 Rare Metal | 1 Specialized Alloy | 90 seconds | 1.8 kWh (18 EU) | Advanced Chemical Processor |

#### Component Manufacturing Chain

| Component | Materials Required | Manufacturing Time | Energy Cost (kWh) | Equipment Required |
|-----------|-------------------|-------------------|-------------------|-------------------|
| **FOUNDATION Circuit** | 2 Silicon + 1 Copper | 30 seconds | 1.8 kWh (18 EU) | Circuit Assembler |
| **RELIABLE Circuit** | 3 Silicon + 1 Copper + 1 Rare Metal | 45 seconds | 2.625 kWh (26.25 EU) | Circuit Assembler |
| **PRECISION Circuit** | 4 Silicon + 2 Copper + 2 Rare Metal | 60 seconds | 3.5 kWh (35 EU) | Circuit Assembler |
| **ADVANCED Circuit** | 5 Silicon + 3 Copper + 3 Rare Metal | 90 seconds | 5.25 kWh (52.5 EU) | Circuit Assembler |
| **QUANTUM Circuit** | 6 Silicon + 4 Copper + 4 Rare Metal + 1 Alloy | 120 seconds | 7.2 kWh (72 EU) | Circuit Assembler |
| **TRANSCENDENT Circuit** | 8 Silicon + 6 Copper + 6 Rare Metal + 2 Alloy | 180 seconds | 13.5 kWh (135 EU) | Circuit Assembler |

#### Critical Path Analysis
```
Tutorial → Equipment Bay → Circuit Technology → Probe Replication

Phase 1 (0-30 min): Survival & Basic Infrastructure
- Target: 1-2 Solar Panels (100-200W)
- Battery: 10 kWh minimum
- Focus: Basic resource gathering + energy independence

Phase 2 (30-90 min): Specialization & Efficiency  
- Target: 3-5 Solar Panels (300-500W)
- Battery: 20 kWh recommended
- Focus: Advanced equipment + manufacturing capability

Phase 3 (90-240 min): Industrial Operations
- Target: 8-10 Solar Panels (800-1000W)
- Battery: 40 kWh for complex operations
- Focus: Circuit manufacturing + probe preparation

Phase 4 (240+ min): Fleet Expansion
- Target: 20+ Solar Panels (2000W+)
- Battery: Multiple 40 kWh systems
- Focus: Multi-probe coordination + automation
```

---

### Critical Game Mechanics Implementation

#### Energy Balance Validation
```javascript
// Core energy validation for 60 FPS performance
const ENERGY_UPDATE_INTERVAL = 100; // ms (10 FPS for energy system)
const WATT_TO_EU_CONVERSION = 100; // 1 EU = 100 Wh

function validateEnergyBalance(equipment, solarPanels, battery) {
    const totalConsumption = equipment.reduce((sum, item) => 
        sum + (item.powerWatts / WATT_TO_EU_CONVERSION), 0);
    const totalGeneration = solarPanels.reduce((sum, panel) => 
        sum + (panel.powerWatts / WATT_TO_EU_CONVERSION), 0);
    
    const netEnergyRate = totalGeneration - totalConsumption;
    const batteryRuntime = battery.capacityEU / Math.abs(netEnergyRate);
    
    return {
        sustainable: netEnergyRate >= 0,
        batteryRuntime: netEnergyRate < 0 ? batteryRuntime : Infinity,
        powerSurplus: Math.max(0, netEnergyRate)
    };
}
```

#### Progression Gate Validation
```javascript
// Key progression checkpoints for development testing
const PROGRESSION_GATES = {
    TUTORIAL_COMPLETE: {
        maxTime: 900, // 15 minutes
        requiredEnergy: 6000, // 6 kWh (60 EU)
        solarRequirement: 100 // 100W minimum
    },
    EQUIPMENT_BAY: {
        maxTime: 2700, // 45 minutes  
        requiredEnergy: 24000, // 24 kWh (240 EU)
        solarRequirement: 300 // 300W recommended
    },
    FIRST_CIRCUIT: {
        maxTime: 5400, // 90 minutes
        requiredEnergy: 84000, // 84 kWh (840 EU) 
        solarRequirement: 500 // 500W for sustained operations
    },
    PROBE_REPLICATION: {
        maxTime: 14400, // 4 hours
        requiredEnergy: 600000, // 600 kWh (6000 EU)
        solarRequirement: 2000 // 2000W for industrial operations
    }
};
```

---

### Resource Distribution & Discovery Patterns

#### Resource Spawn Probability (per 100x100 tile region)

| Resource Type | Surface Probability | Deep Probability | Depletion Rate | Regeneration |
|---------------|-------------------|------------------|----------------|--------------|
| **Silicon Deposits** | 80% | 95% | Slow (200 extractions) | None |
| **Metal Veins** | 60% | 85% | Medium (150 extractions) | None |
| **Rare Metal Nodes** | 25% | 45% | Fast (75 extractions) | None |
| **Specialized Minerals** | 5% | 15% | Very Fast (25 extractions) | None |

#### Environmental Resource Modifiers

| Environment Type | Resource Abundance | Extraction Difficulty | Power Modifier |
|------------------|-------------------|----------------------|----------------|
| **Temperate Plains** | 100% baseline | 100% baseline | 100% baseline |
| **Volcanic Regions** | 150% metals | 125% difficulty | 120% power (cooling) |
| **Frozen Zones** | 75% overall | 150% difficulty | 130% power (heating) |
| **Ocean/Underwater** | 200% rare materials | 200% difficulty | 150% power (pressure) |
| **Radiation Zones** | 300% specialized | 300% difficulty | 200% power (shielding) |

---

### Performance Optimization Guidelines

#### Phaser 3 Implementation Targets
```javascript
// Performance budgets for 60 FPS maintenance
const PERFORMANCE_BUDGETS = {
    ENERGY_SYSTEM_MS: 2, // Max 2ms per frame for energy calculations
    EQUIPMENT_UPDATE_MS: 3, // Max 3ms per frame for equipment state
    SOLAR_CALCULATION_MS: 1, // Max 1ms per frame for solar generation
    POWER_UI_UPDATE_MS: 1, // Max 1ms per frame for power UI updates
    
    // Update frequencies for optimization
    ENERGY_UPDATE_HZ: 10, // 10 times per second (100ms intervals)
    SOLAR_UPDATE_HZ: 5,   // 5 times per second (200ms intervals)  
    UI_UPDATE_HZ: 30,     // 30 times per second for smooth UI
};
```

#### Memory Management for Large Fleets
```javascript
// Object pooling strategy for multi-probe operations
class ProbeEnergyPool {
    constructor() {
        this.pool = [];
        this.activeProbes = new Set();
    }
    
    getProbe() {
        return this.pool.pop() || new ProbeEnergyState();
    }
    
    releaseProbe(probe) {
        probe.reset();
        this.pool.push(probe);
        this.activeProbes.delete(probe);
    }
}
```

---

### Common Player Experience Flows

#### Tutorial Energy Management Pattern
```
0-2 min: Learn basic movement (20-50W consumption)
2-5 min: First scanning operations (100-150W consumption)  
5-8 min: Initial mining (400W bursts)
8-12 min: Solar panel construction (1500W manufacturing)
12-15 min: Energy independence achievement
```

#### First Circuit Manufacturing Flow
```
Preparation Phase (60-70 min):
- Stockpile materials: 3 Silicon + 1 Rare Metal
- Ensure 30 kWh battery reserve (300 EU)
- Solar capacity: 500W+ for sustained operations

Manufacturing Phase (70-75 min):
- Circuit Assembler: 3500W for 45 seconds
- Total energy: 2.625 kWh consumed
- Solar offset: 375 Wh generated during process
- Net battery cost: 2.25 kWh (22.5 EU)

Validation Phase (75-90 min):
- Circuit integration and testing
- Automation system activation
- Performance verification
```

#### Environmental Challenge Patterns
```javascript
// Power overhead for environmental protection
const ENVIRONMENTAL_OVERHEADS = {
    UNDERWATER: {
        powerMultiplier: 1.5, // 50% increase for pressure systems
        equipmentRequired: ['pressure_hull'],
        maxDepth: 100, // meters
        emergencyPowerReserve: 5000 // 5 kWh emergency reserve
    },
    VOLCANIC: {
        powerMultiplier: 1.2, // 20% increase for cooling
        equipmentRequired: ['thermal_protection'],
        heatDamageThreshold: 85, // Celsius
        coolingPowerBase: 500 // 500W baseline cooling
    },
    RADIATION: {
        powerMultiplier: 2.0, // 100% increase for shielding
        equipmentRequired: ['radiation_shielding'],
        exposureLimit: 3600, // 1 hour maximum exposure
        shieldingPowerBase: 1200 // 1200W baseline shielding
    }
};
```

---

### Development Team Implementation Notes

#### Phase 1 Development Priorities
1. **Core Energy System** (Week 1-2)
   - Basic power consumption/generation framework
   - Solar panel placement and efficiency calculation
   - Battery charge/discharge mechanics

2. **Equipment Integration** (Week 3-4)
   - Equipment power consumption implementation
   - Real-time power monitoring and alerts
   - Equipment efficiency based on power availability

3. **Balance Validation** (Week 5-6)
   - Automated testing for progression timing
   - Player testing for energy management difficulty
   - Performance optimization for 60 FPS target

#### Critical Implementation Risks
| Risk | Probability | Impact | Mitigation Strategy |
|------|-------------|---------|-------------------|
| **Performance with large fleets** | Medium | High | Object pooling + update frequency optimization |
| **Energy balance too punishing** | Low | Medium | Extensive playtesting + difficulty options |
| **Solar placement complexity** | Low | Low | Clear visual feedback + placement assistance |
| **Power system confusion** | Medium | Medium | Tutorial focus + clear UI indicators |

#### Testing & Validation Checklist
- [ ] **Tutorial completion rate >90%** with energy constraints
- [ ] **60 FPS maintained** with 10+ probe fleet + full solar arrays
- [ ] **Energy progression feels rewarding** rather than punishing
- [ ] **Environmental challenges** create meaningful strategic decisions
- [ ] **Multi-probe coordination** provides clear operational benefits
- [ ] **Power consumption** matches real-world intuition for equipment types

---

**Document Status**: Complete Developer Reference  
**Next Review**: Before implementation kickoff  
**Update Frequency**: After major balance changes or new equipment additions  
**Validation**: All values tested against numerical balance spreadsheet specifications
