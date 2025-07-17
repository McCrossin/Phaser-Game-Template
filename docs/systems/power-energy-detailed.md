# Power & Energy Systems Design Document
## New Eden Project - Solar-Focused Energy Strategy (Phase 1)

### System Overview: Energy as Strategic Constraint

**Design Philosophy**: Energy serves as the primary operational constraint that drives strategic decision-making, equipment specialization, and technological progression. Unlike resources (which are gathered), energy must be continuously generated and managed through strategic solar panel placement and usage optimization.

**Phase 1 Focus**: Solar power systems with strategic placement and efficiency optimization
**Future Expansion**: Geothermal, nuclear, fusion, and environmental energy harvesting (documented for later development phases)

**Core Principle**: Energy scarcity creates meaningful choices without punishing exploration or experimentation.

---

## Energy Fundamentals

### What Energy Represents
Energy in New Eden Project represents the **operational capacity** of probe systems rather than fuel consumption. It encompasses:
- **Computing Power**: Processing cycles for analysis, coordination, and decision-making
- **Motor Systems**: Movement actuators, drilling mechanisms, and fabrication motors
- **Sensor Arrays**: Active scanning, environmental monitoring, and communication systems
- **Manufacturing**: 3D printing, chemical processing, and component assembly

### Energy vs. Power Distinction (Watt-hour System)
**Energy**: Total capacity available for operations (measured in Energy Units, where 1 EU = 100 Watt-hours)
**Power**: Rate of energy consumption per time unit (Watts, converted to EU/min by dividing by 100)
**Battery Storage**: Accumulated energy reserves measured in kWh (1 kWh = 10 EU)

**Real-World Context**: 
- 100W equipment = 1 EU/min consumption (LED lightbulb equivalent)
- 1000W equipment = 10 EU/min consumption (microwave equivalent)
- Solar panels based on 400W residential panels scaled to 25% efficiency for alien conditions

---

## Energy Consumption Systems

### Equipment Power Requirements

#### Analysis & Detection Equipment
**Basic Scanner** (10-30W / 0.1-0.3 EU/min):
- **Passive Mode**: 10W (0.1 EU/min) - idle environmental monitoring (smartphone equivalent)
- **Active Scanning**: 30W (0.3 EU/min) - directed resource detection (tablet equivalent)
- **Deep Analysis**: 50W (0.5 EU/min) - detailed composition analysis

**Ground Penetrator** (20-80W / 0.2-0.8 EU/min):
- **Surface Scanning**: 20W (0.2 EU/min) - basic subsurface detection
- **Deep Penetration**: 80W (0.8 EU/min) - deep geological analysis (laptop equivalent)
- **Continuous Monitoring**: 40W (0.4 EU/min) - ongoing subsurface tracking

**Advanced Scanner** (120-300W / 1.2-3.0 EU/min):
- **Passive Mode**: 120W (1.2 EU/min) - enhanced environmental awareness (desktop PC)
- **Active Scanning**: 200W (2.0 EU/min) - detailed resource analysis
- **Predictive Analysis**: 300W (3.0 EU/min) - AI-assisted resource prediction

#### Extraction & Processing Equipment
**Mining Laser** (300-800W / 3-8 EU/min):
- **Surface Extraction**: 400W (4 EU/min) - basic surface mining (power drill equivalent)
- **Precision Cutting**: 800W (8 EU/min) - precise material extraction (industrial cutter)
- **Continuous Operation**: 600W (6 EU/min) - sustained mining operations

**Advanced Drill** (800-1500W / 8-15 EU/min):
- **Subsurface Drilling**: 1000W (10 EU/min) - deep deposit access (industrial drill)
- **Precision Boring**: 1500W (15 EU/min) - targeted vein extraction (jackhammer equivalent)
- **Continuous Drilling**: 1200W (12 EU/min) - sustained deep extraction

**Chemical Processor** (600-1200W / 6-12 EU/min):
- **Basic Refinement**: 600W (6 EU/min) - simple material purification (microwave equivalent)
- **Complex Processing**: 1200W (12 EU/min) - multi-stage chemical reactions (industrial oven)
- **Continuous Processing**: 800W (8 EU/min) - ongoing material conversion

#### Manufacturing & Fabrication Equipment
**3D Printer** (1500-2500W / 15-25 EU/min):
- **Simple Components**: 1500W (15 EU/min) - basic part fabrication (industrial 3D printer)
- **Complex Assembly**: 2500W (25 EU/min) - multi-material construction
- **Circuit Manufacturing**: 3500W (35 EU/min) - precision electronic assembly

**Circuit Assembler** (2000-4500W / 20-45 EU/min):
- **Macro-Scale Circuits**: 2000W (20 EU/min) - 10μm transistor assembly (pick-and-place machine)
- **Micro-Scale Circuits**: 3000W (30 EU/min) - 1μm transistor fabrication
- **Nano-Scale Circuits**: 4500W (45 EU/min) - 100nm precision manufacturing (semiconductor fab equivalent)

#### Environmental Protection Equipment
**Pressure Hull** (300-1200W / 3-12 EU/min):
- **Environmental Sealing**: 300W (3 EU/min) - atmospheric pressure management (HVAC system)
- **Deep Water Operations**: 800W (8 EU/min) - high-pressure environment operation
- **Emergency Protocols**: 1200W (12 EU/min) - crisis response systems (submarine life support)

**Thermal Protection** (500-1500W / 5-15 EU/min):
- **Temperature Regulation**: 500W (5 EU/min) - basic thermal management (space heater)
- **Extreme Heat Resistance**: 1000W (10 EU/min) - volcanic environment operation
- **Active Cooling**: 1500W (15 EU/min) - intensive thermal regulation (industrial HVAC)

### Movement & Mobility Costs
**Standard Movement** (50-200W / 0.5-2.0 EU/min):
- **Optimal Terrain**: 50W (0.5 EU/min) - flat, clear surfaces (electric scooter)
- **Moderate Terrain**: 100W (1 EU/min) - hills, light vegetation (electric bike)
- **Difficult Terrain**: 200W (2 EU/min) - rocky, dense forest (ATV equivalent)

**Enhanced Mobility Equipment** (+100-300W / +1-3 EU/min):
- **Terrain Adaptation**: +100W (+1 EU/min) - adaptive movement systems
- **High-Speed Travel**: +300W (+3 EU/min) - rapid movement capability
- **All-Terrain Access**: +200W (+2 EU/min) - specialized environment navigation

---

## Solar Power Generation Systems

### Solar Panel Specifications (Real-World Based)

#### Panel Performance Ratings
**Basic Solar Panel** (100W peak, 1.0 EU/min optimal):
- **Real-world baseline**: 400W residential panel scaled to 25% efficiency for alien conditions
- **Peak Generation**: 100W (perfect conditions, optimal sun angle)
- **Average Generation**: 40W (accounting for day/night/weather cycles)
- **Minimum Generation**: 10W (heavy clouds, suboptimal positioning)

**Advanced Solar Panel** (200W peak, 2.0 EU/min optimal):
- **Enhanced efficiency**: Improved alien-environment adaptation
- **Peak Generation**: 200W (perfect conditions)
- **Average Generation**: 80W (day/night/weather averaged)
- **Minimum Generation**: 20W (adverse conditions)

**Industrial Solar Panel** (250W peak, 2.5 EU/min optimal):
- **Maximum efficiency**: Optimized for alien star spectrum
- **Peak Generation**: 250W (perfect conditions)
- **Average Generation**: 100W (day/night/weather averaged)
- **Minimum Generation**: 25W (adverse conditions)

#### Environmental Efficiency Modifiers
| Condition | Efficiency Multiplier | Duration Pattern |
|-----------|----------------------|------------------|
| **Perfect Sun** | 100% | 6-8 hours/day |
| **Partial Clouds** | 60-80% | 4-6 hours/day |
| **Heavy Clouds** | 20-40% | 2-4 hours/day |
| **Dust Storm** | 10-30% | 1-12 hours |
| **Night Cycle** | 0% | 8-12 hours/day |

### Battery Storage Systems (kWh Specifications)

#### Battery Performance Specifications
**Basic Battery** (10 kWh capacity, 100 EU):
- **Charge Rate**: 50W (0.5 EU/min) - 200 minutes full charge
- **Discharge Rate**: Unlimited (equipment-limited)
- **Efficiency**: 90% charge/discharge efficiency
- **Real-world equivalent**: Tesla Powerwall scaled down

**Advanced Battery** (20 kWh capacity, 200 EU):
- **Charge Rate**: 100W (1.0 EU/min) - 200 minutes full charge
- **Discharge Rate**: Unlimited (equipment-limited)
- **Efficiency**: 92% charge/discharge efficiency
- **Real-world equivalent**: Commercial lithium battery system

**Industrial Battery** (40 kWh capacity, 400 EU):
- **Charge Rate**: 200W (2.0 EU/min) - 200 minutes full charge
- **Discharge Rate**: Unlimited (equipment-limited)  
- **Efficiency**: 95% charge/discharge efficiency
- **Real-world equivalent**: Grid-scale battery storage unit

---

## Energy Management Strategies

### Critical Energy Scenarios (Real-World Context)

#### Tutorial Phase Energy Budget (6 kWh total)
```
Movement & Exploration: 1 kWh (50W × 20 minutes)
Scanning Operations: 1.5 kWh (100W × 15 minutes)
Initial Mining: 2 kWh (400W × 5 minutes total)
Solar Panel Construction: 1.5 kWh (1500W × 1 minute)

Solar Generation: 1.5 kWh (100W × 15 minutes)
Net Battery Requirement: 4.5 kWh (45 EU starting charge)
```

#### Circuit Manufacturing Energy Budget
```
Circuit Assembler Operation: 3500W for 45 seconds = 2.625 kWh
Supporting Systems: 500W for 45 seconds = 0.375 kWh
Total Manufacturing Cost: 3.0 kWh (30 EU)

Solar Offset: 100W × 0.75 minutes = 75 Wh (0.75 EU)
Net Battery Cost: 2.925 kWh (29.25 EU)

Recommendation: 30 kWh battery reserve + 300W solar minimum
```

#### Environmental Operations Power Overhead
```
Underwater Mining Example:
- Base Mining: 400W (4 EU/min)
- Pressure Hull: 800W (8 EU/min)
- Enhanced Scanner: 200W (2 EU/min)
Total: 1400W (14 EU/min)

Solar Generation: 100W (1 EU/min) surface conditions
Net Drain: 1300W (13 EU/min)
20 kWh Battery Runtime: ~15.4 hours theoretical, 20 minutes practical

Strategic Implication: Environmental work requires sprint operations with energy stockpiling
```

### Performance Optimization Guidelines

#### Energy System Update Frequency
```javascript
// Optimized for 60 FPS with realistic energy calculations
const ENERGY_CONFIG = {
    UPDATE_INTERVAL: 100, // ms (10 updates/second)
    WATT_TO_EU_CONVERSION: 100, // 1 EU = 100 Wh
    MIN_BATTERY_WARNING: 0.3, // 30% battery warning
    CRITICAL_BATTERY_WARNING: 0.1, // 10% battery critical
    
    SOLAR_CALCULATION_INTERVAL: 200, // ms (5 updates/second)
    WEATHER_UPDATE_INTERVAL: 5000, // ms (weather changes)
    UI_UPDATE_INTERVAL: 33 // ms (30 FPS UI updates)
};
```

#### Memory Management for Large Fleets
```javascript
// Efficient power calculation for multi-probe operations
class FleetEnergyManager {
    updateFleetEnergy(deltaMs) {
        const energyDelta = deltaMs / 60000; // Convert to minutes
        
        for (const probe of this.activeProbes) {
            const consumption = probe.getTotalPowerWatts() / 100; // Convert W to EU/min
            const generation = probe.getSolarPowerWatts() / 100;
            const netChange = (generation - consumption) * energyDelta;
            
            probe.modifyBattery(netChange);
        }
    }
}
```

---

**Document Status**: Updated with Real-World Power Specifications  
**Energy Foundation**: 100 Watt-hours = 1 Energy Unit  
**Solar Baseline**: 400W residential panels scaled to 25% alien efficiency  
**Equipment Power**: All consumption based on real-world equipment equivalents  
**Performance Target**: 60 FPS with optimized 100ms energy update intervals
