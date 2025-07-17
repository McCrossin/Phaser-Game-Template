# Pre-Replication Stage Design Document
## New Eden Project - Gameplay Stage Specification

### Stage Overview: From Awakening to First Replication

**Stage Duration**: 45-60 minutes for experienced players, 60-90 minutes for new players
**Core Philosophy**: Productive frustration that makes automation feel like genuine relief
**Victory Condition**: Successful construction and deployment of second probe unit

---

## Stage Identity & Emotional Journey

### The "Constraint Graduation" Experience
This stage transforms players from **survival-focused individuals** into **automation-minded engineers**. Every limitation encountered becomes a problem they'll want to solve through better systems.

### Emotional Arc Design
```
Activation → Overwhelm → Understanding → Tedium → Relief → Anticipation
    ↓           ↓           ↓           ↓        ↓          ↓
 Wake up    Equipment    Learn systems  Manual   3D Printer  Want more
 confused   juggling     make sense     mining   unlocks     automation
            painful                     tedious  capability
```

### Core Tension: "I Need More Hands"
**Primary Limitation**: Single probe with 4 equipment slots facing multi-step processes
- **Equipment Cycling**: Constantly swapping Scanner ↔ Mining Laser ↔ Processing tools
- **Energy Management**: Solar panels compete with operational equipment for slots  
- **Environmental Barriers**: Protection gear reduces operational capability
- **Manual Movement**: Personally shepherding every resource collection operation

---

## Planet Design: "Darwin's Garden" Template

### Geological Foundation
**Planet Type**: Temperate world with moderate geological diversity
- **Terrain**: Rolling hills with scattered forests, small lakes, and mineral outcrops
- **Climate**: Stable weather patterns, no extreme storms during this stage
- **Geological Age**: Young planet with surface deposits accessible but requiring exploration

### Resource Distribution Strategy

#### Starting Area Resources (Within 200m of spawn)
**Immediate Survival Materials**:
- **Iron Deposits**: 2-3 small surface nodes, easily visible, 80-120 units each
- **Silicon Patches**: Crystalline formations in rocky areas, 60-100 units each
- **Solar Collection**: Optimal sun exposure for energy generation

**Strategic Purpose**: Players can immediately address power and basic tool needs without extensive exploration

#### Near-Zone Resources (200-600m from spawn)
**Secondary Development Materials**:
- **Carbon Sources**: Organic deposits in forested areas, requires 2-3 minute travel
- **Copper Veins**: Electrical component requirements, embedded in small hills
- **Water Access**: Small lake for chemical processing, central to near-zone area

**Strategic Purpose**: Encourages early exploration while maintaining reasonable travel times

#### Extended Zone Resources (600-1500m from spawn)
**Advanced Manufacturing Requirements**:
- **Gold Deposits**: High-value, low-quantity veins requiring 5-8 minute exploration
- **Titanium Outcrops**: Mountain base locations, significant travel investment
- **Lithium Salt Flats**: Dried lake beds, requires environmental scanning to locate

**Strategic Purpose**: Forces meaningful exploration decisions and long-term planning

### Environmental Barriers

#### Stage-Appropriate Challenges
**Underwater Carbon Deposits**:
- **Location**: Lake depths requiring Pressure Hull (2-slot equipment)
- **Resource**: High-purity carbon essential for advanced circuit production
- **Challenge**: Forces equipment trade-off between extraction capability and environmental protection

**Mountain Titanium**:
- **Location**: Steep terrain requiring Enhanced Mobility (1-slot equipment) 
- **Resource**: Structural materials for probe frame construction
- **Challenge**: Movement efficiency vs. operational capability decisions

**Subsurface Gold**:
- **Location**: Buried deposits requiring Advanced Drill (1-slot) + Ground Scanner (1-slot)
- **Resource**: Circuit-grade gold for transistor manufacturing
- **Challenge**: Specialized extraction setup reduces general-purpose flexibility

---

## Equipment Limitation Design

### The "Slot Pressure" System
Every meaningful action requires specific equipment, but players can only carry 4 items. This creates constant strategic decisions about what to prioritize.

#### Tier 1: Basic Survival (Tutorial Phase)
**Required Equipment Cycle**:
- **Scanner**: Resource detection and environmental assessment
- **Mining Laser**: Basic material extraction
- **Solar Panel**: Energy generation and storage
- **Storage Bay**: Resource transport and accumulation

**Pain Point**: Can only do one thing at a time, constant equipment swapping

#### Tier 2: Expanded Operations (Post-Equipment Bay)
**New Equipment Options**:
- **Chemical Processor**: Convert raw materials into refined components
- **Advanced Drill**: Access deeper/harder deposits
- **Pressure Hull**: Access underwater resources (2-slot requirement)
- **Ground Penetrator**: Detect subsurface deposits

**Pain Point**: More possibilities but still limited slots, equipment cycling becomes strategic rather than survival-focused

#### Tier 3: Pre-Replication Specialization
**Advanced Equipment Access**:
- **3D Printer**: Fabricate complex components and equipment
- **Circuit Assembler**: Build computing elements for probe brains
- **Enhanced Mobility**: Faster movement and terrain access
- **Communication Array**: Long-range coordination preparation

**Pain Point**: Need to become specialized to be efficient, but specialization limits flexibility

---

## Energy Management Challenges
*[Complete power system specifications in docs/systems/power-energy-detailed.md]*

### Power as the Primary Constraint
**Design Philosophy**: Energy constraints create strategic depth without punishing exploration or resource gathering. Unlike materials (which accumulate), energy must be continuously managed and planned.

### Early Game Power Economics

#### The Solar Panel Dilemma
**Core Challenge**: Energy generation competes with operational capability for precious equipment slots
- **Basic Solar Panel**: 10 units/minute (optimal conditions), requires 1 equipment slot
- **Battery Storage**: 100 units capacity, 90% charge/discharge efficiency
- **Slot Competition**: Every solar panel reduces operational equipment to 3 slots

**Strategic Implications**:
- **Power vs. Capability Trade-off**: More generation = less operational flexibility
- **Weather Dependency**: Cloud cover reduces solar to 5 units/minute, forcing battery management
- **Night Operations**: Zero generation requires careful battery planning

#### Equipment Power Consumption Tiers

##### Tier 1: Essential Operations (Always Affordable)
**Scanner**: 1-3 units/minute depending on mode
- **Passive Mode**: 1 unit/minute (basic environmental awareness)
- **Active Scanning**: 3 units/minute (resource detection)
- **Deep Analysis**: 5 units/minute (detailed composition)

**Basic Movement**: 0.5-2 units/minute depending on terrain
- **Optimal Terrain**: 0.5 units/minute (flat surfaces)
- **Moderate Terrain**: 1 unit/minute (hills, vegetation)
- **Difficult Terrain**: 2 units/minute (rocky, dense areas)

##### Tier 2: Core Operations (Manageable with Planning)
**Mining Laser**: 4-8 units/minute depending on intensity
- **Surface Extraction**: 4 units/minute (basic surface mining)
- **Precision Cutting**: 8 units/minute (precise material extraction)

**Chemical Processor**: 6-12 units/minute depending on complexity
- **Basic Refinement**: 6 units/minute (simple purification)
- **Complex Processing**: 12 units/minute (multi-stage reactions)

##### Tier 3: Power-Hungry Operations (Require Energy Management)
**Advanced Drill**: 10-15 units/minute depending on operation
- **Subsurface Drilling**: 10 units/minute (deep deposit access)
- **Precision Boring**: 15 units/minute (targeted extraction)

**3D Printer**: 15-35 units/minute depending on complexity
- **Simple Components**: 15 units/minute (basic fabrication)
- **Complex Assembly**: 25 units/minute (multi-material construction)
- **Circuit Manufacturing**: 35 units/minute (precision electronics)

#### Critical Energy Challenges

##### Challenge 1: The Manufacturing Power Demand
**Problem**: 3D Printer circuit manufacturing consumes 35 units/minute vs. 10 units/minute solar generation
- **Power Deficit**: 350% of available generation capacity
- **Battery Dependency**: Must accumulate 100+ units before attempting circuit production
- **Timing Pressure**: Can only manufacture during peak solar hours with full battery backup

**Player Response Strategy**:
- **Power Stockpiling**: Operate with minimal equipment for 10+ minutes to build battery reserves
- **Solar Optimization**: Remove all non-essential equipment, dedicate 2 slots to solar panels
- **Timing Coordination**: Schedule manufacturing for midday peak solar (16 units/minute with advanced panels)

**Emotional Impact**: "I can't just make what I need when I need it - I have to plan and prepare"

##### Challenge 2: Environmental Protection Power Overhead
**Problem**: Environmental protection gear adds significant power consumption
- **Pressure Hull**: +8 units/minute for underwater operations (180% of solar generation)
- **Thermal Protection**: +10 units/minute for volcanic environments (200% of solar generation)
- **Combined Environments**: Multiple protection systems create impossible power demands

**Underwater Carbon Extraction Example**:
```
Required Equipment: Scanner + Pressure Hull + Mining Laser
Power Consumption: 3 + 8 + 4 = 15 units/minute
Solar Generation: 10 units/minute
Battery Drain: 5 units/minute
Operation Time: 20 minutes maximum (100-unit battery / 5 units drain)
```

**Player Response Strategy**:
- **Sprint Operations**: Quick in-and-out missions to hazardous zones
- **Power Buffer Planning**: Build energy reserves before environmental access
- **Equipment Minimalism**: Strip probe to bare essentials for environmental work

**Emotional Impact**: "These dangerous environments are bleeding my power - I need better energy systems"

##### Challenge 3: The Day/Night Operational Window
**Solar Generation Cycles**:
- **Peak Solar** (6 hours): 16 units/minute with optimal positioning
- **Standard Solar** (4 hours): 10 units/minute normal generation
- **Low Solar** (2 hours): 5 units/minute during dawn/dusk
- **Night Operations** (12 hours): 0 units/minute, battery dependency only

**Strategic Implications**:
- **Power-Intensive Work Windows**: Only 6 hours per day support high-energy operations
- **Night Activity Constraints**: Limited to low-power operations (scanning, movement)
- **Weather Complications**: Cloud cover reduces generation to 5 units/minute, forces conservative operations

**Player Response Strategy**:
- **Schedule Optimization**: Plan manufacturing and processing during peak solar hours
- **Night Activity Planning**: Use low-power periods for exploration and equipment swapping
- **Weather Monitoring**: Adjust operations based on environmental conditions

**Emotional Impact**: "I'm not free to work when I want - the planet's rhythm controls my operations"

##### Challenge 4: Equipment Cycling Power Overhead
**Travel Energy Costs**: Equipment Bay access consumes significant power
- **Return Journey**: 30-90 seconds travel at 1-2 units/minute = 0.5-3 units per trip
- **Interface Operation**: Equipment Bay systems consume 2 units/minute during swapping
- **Return to Work**: Another 30-90 seconds travel to operation site

**Multiple Cycling Example**:
```
Mining → Scanning → Processing → Manufacturing cycle:
- Trip 1: Mining gear → Scanner (3 units travel + interface)
- Trip 2: Scanner → Chemical Processor (3 units travel + interface)  
- Trip 3: Processor → 3D Printer (3 units travel + interface)
Total Overhead: 9+ units just for equipment management
```

**Player Response Strategy**:
- **Batch Operations**: Group similar activities to minimize equipment changes
- **Strategic Base Placement**: Position Equipment Bay to minimize travel distances
- **Energy Budget Planning**: Account for cycling overhead in power calculations

**Emotional Impact**: "I'm wasting so much energy just changing tools - I need multiple probes"

#### Energy Management Learning Progression

##### Phase 1: Power Awareness (Tutorial Integration)
**Learning Objective**: Understand that energy is a limited resource requiring active management
- **Power Warnings**: Clear feedback when approaching battery depletion
- **Generation vs. Consumption**: Real-time display of energy balance
- **Equipment Power Info**: Show power requirements during equipment selection

**Mastery Indicator**: Player begins checking battery levels before starting high-power operations

##### Phase 2: Operational Planning (Early Post-Tutorial)
**Learning Objective**: Develop intuition for energy-efficient operational sequences
- **Solar Timing**: Schedule power-intensive work during peak generation hours
- **Battery Management**: Build energy reserves before attempting complex operations
- **Weather Adaptation**: Adjust activity based on solar generation conditions

**Mastery Indicator**: Player successfully completes 3D printer operations without power failure

##### Phase 3: Strategic Energy Investment (Pre-Replication)
**Learning Objective**: Balance immediate operational needs with long-term energy infrastructure
- **Equipment Prioritization**: Choose between operational capability and power generation
- **Infrastructure Planning**: Invest in better energy systems vs. immediate operational tools
- **Risk Assessment**: Evaluate whether operations are worth the energy investment

**Mastery Indicator**: Player successfully manages complex multi-step manufacturing while maintaining operational capability

### Energy-Driven Automation Desire

#### Power Management as Tedium Source
**Manual Energy Monitoring**: Constantly checking battery levels and planning around power constraints
- **Battery Anxiety**: Fear of running out of power during critical operations
- **Solar Dependency**: Feeling constrained by daylight hours and weather patterns
- **Overhead Calculation**: Mental math for every operation's power requirements

**Player Psychology**: "I spend more time managing energy than actually accomplishing my goals"

#### Automation Relief Vision
**Smart Power Management**: Advanced circuits enable automated energy optimization
- **Load Scheduling**: AI schedules power-intensive operations during optimal generation
- **Battery Management**: Intelligent power conservation during low-generation periods
- **Equipment Coordination**: Automated power allocation across multiple probe operations

**Replication Promise**: "With multiple probes, I can have dedicated power generation while others work"

#### Energy Efficiency Incentives
**Specialized Roles**: Different probes optimized for different power profiles
- **Power Generation Probe**: Multiple solar panels, minimal operational equipment
- **High-Power Operations Probe**: Advanced drill + 3D printer, minimal generation
- **Efficiency Probe**: Balanced loadout optimized for sustained operations

**Fleet Coordination**: Energy sharing and intelligent load distribution across probe fleet

##### Challenge 2: Weather Patterns
**Clear Skies** (60% of time): 100% solar efficiency
**Cloudy Conditions** (30% of time): 60% solar efficiency
**Storm Systems** (10% of time): 20% solar efficiency, temporary shelter required
**Strategic Decisions**: Energy storage vs. immediate consumption, weather prediction planning

##### Challenge 3: Equipment Power Competition
**High-Energy Extraction**: Advanced Drill + Chemical Processor = 20 units/minute (200% of solar generation)
**Energy-Neutral Operations**: Scanner + Mining Laser = 7 units/minute (70% of solar generation)
**Power Surplus Activities**: Equipment Bay access, 3D printing during peak solar hours

---

## Productive Tedium Design

### Carefully Calibrated Pain Points
The goal is to make players think "I wish I could automate this" without making the experience genuinely unpleasant.

#### Tedium Element 1: Resource Depletion Timing
**Surface Deposit Exhaustion**:
- **Initial Deposits**: Last 8-12 minutes of continuous extraction
- **Discovery Requirement**: Must actively scan for new deposits every 10-15 minutes
- **Travel Investment**: 2-5 minute travel time to reach new deposits

**Player Psychology**: "I found a great iron spot, but now it's gone and I need to hunt for more. I wish I had a probe that could do this automatically."

#### Tedium Element 2: Equipment Cycling Overhead
**Switching Time Investment**:
- **Return to Equipment Bay**: 30-90 seconds depending on current location
- **Interface Navigation**: 15-30 seconds to select and apply new configuration
- **Return to Work Site**: 30-90 seconds travel time back to operation area

**Player Psychology**: "I need to scan for resources, but I'm equipped for mining. By the time I switch gear and come back, I could have just guessed where to dig."

#### Tedium Element 3: Multi-Step Process Management
**Circuit Production Chain**:
1. **Silicon Extraction**: Scanner + Mining Laser (5 minutes)
2. **Silicon Refinement**: Chemical Processor + Storage (8 minutes)
3. **Gold Extraction**: Ground Scanner + Advanced Drill (12 minutes)
4. **Gold Purification**: Chemical Processor + Specialized Filter (15 minutes)
5. **Circuit Assembly**: All materials + Circuit Assembler (10 minutes)

**Player Psychology**: "This is taking forever because I can only do one step at a time. If I had multiple probes, I could parallelize this entire process."

#### Tedium Element 4: Resource Transport Limitations
**Inventory Management**:
- **Storage Bay Capacity**: 50 units maximum per trip
- **Resource Requirements**: Circuit production needs 200+ units of various materials
- **Transport Overhead**: Multiple trips between extraction and processing sites

**Player Psychology**: "I'm spending more time moving materials around than actually working with them. I need dedicated transport or processing probes."

---

## Learning Curve Integration

### Deep Core Concepts
These systems must be thoroughly understood before replication becomes viable.

#### Equipment Slot Strategy
**Learning Objective**: Understand that every equipment choice has opportunity cost
- **Tutorial Integration**: Start with 1 slot, expand to 4 through achievements
- **Mastery Indicator**: Player preemptively plans equipment loadouts for specific tasks
- **Assessment**: Player successfully navigates underwater carbon extraction requiring Pressure Hull

#### Energy Planning
**Learning Objective**: Develop intuition for energy-efficient operation patterns
- **Tutorial Integration**: Power warnings during equipment-intensive operations
- **Mastery Indicator**: Player schedules high-energy work during optimal solar hours
- **Assessment**: Player successfully completes 3D printer operation without power failures

#### Resource Process Understanding
**Learning Objective**: Grasp multi-step manufacturing chains and material flow
- **Tutorial Integration**: Circuit production requires understanding of material refinement
- **Mastery Indicator**: Player organizes work to minimize transport and switching overhead
- **Assessment**: Player successfully produces circuit brain for 3D printer expansion

### Important Systems Introduction
These concepts are introduced but not deeply explored, preparing for post-replication complexity.

#### Environmental Scanning
**Introduction Level**: Basic environmental hazard detection
- **Example**: "Underwater area detected - Pressure Hull recommended"
- **Future Complexity**: Detailed chemical analysis, temperature ranges, radiation levels

#### Multi-Probe Coordination
**Introduction Level**: Communication Array equipment introduction during late-stage
- **Example**: "Communication Array unlocked - enables probe coordination"
- **Future Complexity**: Fleet management, role specialization, automated coordination

#### Advanced Material Processing
**Introduction Level**: Basic chemical processor operations
- **Example**: Convert Iron Ore → Refined Iron → Steel Components
- **Future Complexity**: Complex chemical chains, catalyst management, purity optimization

#### Automation Logic
**Introduction Level**: Equipment Bay automation (automatic tool recommendations)
- **Example**: "Scanner + Advanced Drill recommended for subsurface gold"
- **Future Complexity**: Programmable probe behaviors, conditional logic, fleet AI

---

## Victory Moment Design

### The Relief of Capability Multiplication
**Replication Achievement**: From "doing everything myself" to "commanding specialized units"

#### Immediate Capability Transformation
**Before Replication**:
- Single probe with 4 equipment slots
- Manual management of all operations
- Constant travel between work sites
- Sequential processing of all tasks

**After Replication**:
- Two specialized probes with distinct roles
- Parallel operation capability
- Reduced player travel overhead
- Simultaneous multi-step processes

#### Player Psychology at Victory
**Primary Emotion**: Relief - "Finally, I can stop manually doing everything"
**Secondary Emotion**: Anticipation - "Now I can build the systems I've been imagining"
**Strategic Realization**: "Automation isn't just faster, it's a fundamentally different way of thinking"

### Specialization Opportunity Presentation
**Probe A Configuration Options**:
- **Resource Surveyor**: Advanced Scanner + Ground Penetrator + Communication + Solar Panel
- **Deep Processor**: Chemical Processor + Circuit Assembler + Storage Bay + Enhanced Power

**Probe B Configuration Options**:
- **Mobile Extractor**: Advanced Drill + Mining Laser + Storage Bay + Enhanced Mobility
- **Environmental Specialist**: Pressure Hull + Thermal Protection + Scanner + Communication

**Player Decision**: Choose specialization approach that matches their preferred operational style

---

## Technical Implementation Considerations

### Pacing and Timing Controls
**Resource Depletion Rates**: Configurable timers to ensure appropriate tedium without frustration
**Travel Distance Scaling**: Procedural generation within defined minimum/maximum ranges  
**Equipment Cycling Overhead**: Interface responsiveness tuned to feel deliberate but not sluggish

### Player Feedback Systems
**Efficiency Indicators**: Subtle UI hints about suboptimal operations without being prescriptive
**Automation Previews**: Brief glimpses of post-replication capabilities to maintain motivation
**Progress Tracking**: Clear milestone indicators showing advancement toward replication goal

### Difficulty Curve Balancing
**Adaptive Challenge**: System monitors player struggle patterns and adjusts resource spawn distances
**Skill Assessment**: Track equipment cycling efficiency and suggest optimal advancement timing
**Engagement Maintenance**: Ensure tedium creates motivation rather than frustration through careful calibration

---

## Success Metrics & Design Validation

### Player Behavior Indicators
**Successful Design Signals**:
- Players actively seek equipment cycling efficiency improvements
- Players express frustration about manual operations (in game feedback/forums)
- Players demonstrate relief and excitement when replication unlocks
- Players immediately begin specializing probes after replication success

**Design Failure Signals**:
- Players abandon games during equipment cycling phases
- Players report boredom with resource gathering
- Players don't understand why replication is valuable
- Players continue using generalist probe approaches post-replication

### Progression Timing Targets
**Minimum Viable Time**: 45 minutes (experienced players with optimal strategies)
**Average Expected Time**: 60-75 minutes (players learning systems)
**Maximum Acceptable Time**: 90 minutes (new players with exploration and experimentation)
**Abandonment Threshold**: 120 minutes (indicates design problems requiring adjustment)

---

## Future Stage Integration

### Post-Replication Preparation
This stage establishes foundations that become critical in subsequent gameplay phases:

#### Fleet Management Introduction
**Established Concepts**: Equipment specialization, role-based thinking, coordination benefits
**Future Expansion**: Multi-probe task assignment, automated coordination, strategic planning

#### Environmental Mastery Preparation  
**Established Concepts**: Equipment-environment matching, protection gear trade-offs
**Future Expansion**: Extreme environment access, specialized protection systems, hazard engineering

#### Automation Philosophy Development
**Established Concepts**: Manual tedium as motivation, efficiency optimization, system thinking
**Future Expansion**: Programmable behaviors, conditional logic, autonomous fleet management

#### Resource System Scaling
**Established Concepts**: Multi-step processing, material flow, production chains
**Future Expansion**: Complex manufacturing networks, chemical synthesis, advanced materials

This pre-replication stage serves as the crucial foundation that makes all subsequent automation feel earned, meaningful, and genuinely relieving rather than merely cosmetic.
