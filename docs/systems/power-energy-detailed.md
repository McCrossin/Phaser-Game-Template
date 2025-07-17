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

### Equipment Power Requirements (Kilowatt-Based)

#### Analysis & Detection Equipment
**Basic Scanner** (0.3kW):
- **Passive Mode**: 0.1kW - idle environmental monitoring 
- **Active Scanning**: 0.3kW - directed resource detection
- **Deep Analysis**: 0.5kW - detailed composition analysis

**Ground Penetrator** (0.8kW):
- **Surface Scanning**: 0.4kW - basic subsurface detection
- **Deep Penetration**: 0.8kW - deep geological analysis
- **Continuous Monitoring**: 0.6kW - ongoing subsurface tracking

**Advanced Scanner** (1.5kW):
- **Passive Mode**: 1.0kW - enhanced environmental awareness
- **Active Scanning**: 1.5kW - detailed resource analysis
- **Predictive Analysis**: 2.0kW - AI-assisted resource prediction

#### Extraction & Processing Equipment
**Mining Laser** (2.5kW):
- **Surface Extraction**: 2.0kW - basic surface mining
- **Precision Cutting**: 2.5kW - precise material extraction
- **Continuous Operation**: 2.2kW - sustained mining operations

**Advanced Drill** (6.0kW):
- **Subsurface Drilling**: 5.0kW - deep deposit access
- **Precision Boring**: 6.0kW - targeted vein extraction
- **Continuous Drilling**: 5.5kW - sustained deep extraction

**Chemical Processor** (3.5kW):
- **Basic Refinement**: 2.5kW - simple material purification
- **Complex Processing**: 3.5kW - multi-stage chemical reactions
- **Continuous Processing**: 3.0kW - ongoing material conversion

#### Manufacturing & Fabrication Equipment
**3D Printer** (7.5kW):
- **Simple Components**: 5.0kW - basic part fabrication
- **Complex Assembly**: 7.5kW - multi-material construction
- **Circuit Manufacturing**: 12kW - precision electronic assembly

**Circuit Assembler** (15kW):
- **BASIC Circuits (7nm)**: 10kW - modern flagship transistor assembly
- **ADVANCED Circuits (3nm)**: 15kW - next-generation fabrication
- **QUANTUM Circuits (1nm)**: 25kW - theoretical precision manufacturing

#### Environmental Protection Equipment
**Pressure Hull** (4.5kW):
- **Environmental Sealing**: 3.0kW - atmospheric pressure management
- **Deep Water Operations**: 4.5kW - high-pressure environment operation
- **Emergency Protocols**: 6.0kW - crisis response systems

**Thermal Protection** (5.5kW):
- **Temperature Regulation**: 4.0kW - basic thermal management
- **Extreme Heat Resistance**: 5.5kW - volcanic environment operation
- **Active Cooling**: 7.0kW - intensive thermal regulation

### Movement & Mobility Costs
**Standard Movement** (0.5kW):
- **Optimal Terrain**: 0.3kW - flat, clear surfaces
- **Moderate Terrain**: 0.5kW - hills, light vegetation
- **Difficult Terrain**: 0.8kW - rocky, dense forest

**Enhanced Mobility Equipment** (+1.0kW):
- **Terrain Adaptation**: +0.8kW - adaptive movement systems
- **High-Speed Travel**: +1.5kW - rapid movement capability
- **All-Terrain Access**: +1.0kW - specialized environment navigation

---

## Solar Power Generation Systems

### Solar Panel Specifications (Kilowatt-Based Performance)

#### Panel Performance Ratings
**Basic Solar Panel** (5kW peak generation):
- **Real-world scale**: Residential-grade solar installation adapted for alien conditions
- **South Facing**: 5.0kW (Clear) / 2.5kW (Cloudy) / 1.3kW (Storm)
- **East/West Facing**: 4.0kW (Clear) / 2.0kW (Cloudy) / 1.0kW (Storm)
- **North Facing**: 2.5kW (Clear) / 1.3kW (Cloudy) / 0.6kW (Storm)

**Advanced Solar Panel** (10kW peak generation):
- **Enhanced efficiency**: Improved alien-environment adaptation and tracking systems
- **South Facing**: 10kW (Clear) / 5.0kW (Cloudy) / 2.5kW (Storm)
- **East/West Facing**: 8.0kW (Clear) / 4.0kW (Cloudy) / 2.0kW (Storm)
- **North Facing**: 5.0kW (Clear) / 2.5kW (Cloudy) / 1.3kW (Storm)

**Industrial Solar Panel** (25kW peak generation):
- **Maximum efficiency**: Military-grade panels optimized for alien star spectrum
- **South Facing**: 25kW (Clear) / 13kW (Cloudy) / 6.0kW (Storm)
- **East/West Facing**: 20kW (Clear) / 10kW (Cloudy) / 5.0kW (Storm)
- **North Facing**: 13kW (Clear) / 6.0kW (Cloudy) / 3.0kW (Storm)

#### Environmental Power Generation (Performance Optimized)
| Panel Type | Clear Weather | Cloudy | Storm | Night |
|------------|---------------|--------|-------|-------|
| **Basic (South)** | 5.0kW | 2.5kW | 1.3kW | 0kW |
| **Advanced (South)** | 10kW | 5.0kW | 2.5kW | 0kW |
| **Industrial (South)** | 25kW | 13kW | 6.0kW | 0kW |

**Update System**: Discrete 100ms intervals (10 updates/second)
**Weather Effects**: Simple multipliers applied to base generation
**Strategic Planning**: Panel placement and weather awareness critical for power budget

### Battery Storage Systems (Kilowatt-Hour Specifications)

#### Battery Performance Specifications
**Basic Battery** (50kWh capacity):
- **Charge Rate**: 5kW maximum (10 hours full charge from empty)
- **Discharge Rate**: Equipment-limited (can power any single high-draw item)
- **Efficiency**: 90% charge/discharge efficiency
- **Real-world equivalent**: Tesla Model S battery pack

**Advanced Battery** (150kWh capacity):
- **Charge Rate**: 15kW maximum (10 hours full charge from empty)
- **Discharge Rate**: Equipment-limited (can power multiple high-draw items simultaneously)
- **Efficiency**: 95% charge/discharge efficiency
- **Real-world equivalent**: Small commercial battery bank

**Industrial Battery** (500kWh capacity):
- **Charge Rate**: 50kW maximum (10 hours full charge from empty)
- **Discharge Rate**: Equipment-limited (unlimited simultaneous equipment operation)
- **Efficiency**: 98% charge/discharge efficiency
- **Real-world equivalent**: Grid-scale battery storage system
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

## Strategic Power Balance Analysis

### Game Design Balance Philosophy
Power generation vs consumption creates meaningful equipment choices without creating frustrating energy poverty. Players must plan their loadouts and solar placement strategically.

#### Basic Probe Power Budget (Single Basic Solar Panel)
**Clear Weather Generation**: 5.0kW
**Sustainable Equipment Loadouts**:
- Scanner (0.3kW) + Mining Laser (2.5kW) + Movement (0.5kW) = 3.3kW ✅ **Comfortable**
- Scanner (0.3kW) + Drill (6.0kW) + Movement (0.5kW) = 6.8kW ❌ **Requires advanced solar**
- 3D Printer (7.5kW) = ❌ **Requires advanced solar or battery backup**

#### Advanced Probe Power Budget (Single Advanced Solar Panel)
**Clear Weather Generation**: 10kW
**Sustainable Equipment Loadouts**:
- Advanced Scanner (1.5kW) + Drill (6.0kW) + Pressure Hull (4.5kW) = 12kW ❌ **Requires careful timing**
- Scanner (0.3kW) + Drill (6.0kW) + Chemical Processor (3.5kW) = 9.8kW ✅ **Just sustainable**
- 3D Printer (7.5kW) + Scanner (0.3kW) + Movement (0.5kW) = 8.3kW ✅ **Manufacturing focused**

#### Industrial Operations (Multiple Panels + Battery Storage)
**Industrial Solar Panel**: 25kW peak
**Circuit Fabrication**: 15-25kW requirements
**Strategic Decisions**:
- **Weather Dependency**: Storm conditions (6kW) cannot sustain high-power manufacturing
- **Battery Investment**: 150kWh battery provides 10 hours of 15kW circuit fabrication
- **Multi-Panel Setup**: 2x Advanced panels (20kW) enable weather-independent operation

### Strategic Depth Created
1. **Early Game**: Single basic panel forces equipment slot trade-offs
2. **Mid Game**: Advanced panels enable specialized high-power equipment
3. **Late Game**: Industrial operations require infrastructure investment and planning
4. **Weather Planning**: Storm periods require battery backup or reduced operations
5. **Specialization Rewards**: Dedicated power-generation probes become valuable

**Balance Assessment**: ✅ **Well-Balanced**
- Power scarcity creates meaningful choices without being punitive
- Clear progression path from constraint to abundance
- Weather and equipment interactions create strategic depth
- Infrastructure investment feels rewarding and necessary

---

**Document Status**: Updated with Real-World Power Specifications  
**Energy Foundation**: 100 Watt-hours = 1 Energy Unit  
**Solar Baseline**: 400W residential panels scaled to 25% alien efficiency  
**Equipment Power**: All consumption based on real-world equipment equivalents  
**Performance Target**: 60 FPS with optimized 100ms energy update intervals
