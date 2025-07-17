# New Eden Project - Game Design Document v1.0 (Draft)

## Executive Summary

**New Eden Project** is a 2D automation-strategy hybrid where you control von Neumann probes exploring diverse planets. As an intelligent probe consciousness, you gather resources, adapt to environmental challenges, and build self-sustaining civilizations through strategic engineering.

### Core Vision
Transform unexplored planets into thriving worlds through intelligent probe engineering and environmental adaptation. Each planet presents unique challenges requiring specialized equipment and strategic resource management.

### Key Experience
- **Direct Probe Control**: WASD movement with context-sensitive tool usage
- **Modular Engineering**: 4 equipment slots per probe for specialized configurations  
- **Environmental Adaptation**: Hazardous zones require specific gear to access valuable resources
- **Progressive Automation**: Start with direct control, evolve toward intelligent automation

### Platform & Technical Requirements
- **Platform**: PC (Windows/Steam), Phaser 3 + TypeScript
- **Performance**: 60 FPS on mid-range devices, 1920x1080 minimum
- **Architecture**: Modular component system supporting equipment customization

**Complete Technical Specifications**:
- *[Technical Feasibility Analysis](TECHNICAL_FEASIBILITY_ANALYSIS.md)*
- *[Performance & Optimization Guidelines](technical/performance-specifications.md)*
- *[Phaser 3 Implementation Guide](technical/phaser3-implementation-guide.md)*
- *[Input Controls & Accessibility](technical/input-controls-specification.md)*
- *[Audio System Specifications](technical/audio-system-specification.md)*
- *[Data Persistence Systems](technical/data-persistence-specification.md)*

---

## 1. Core Gameplay Experience

### 1.1 What You Do (Primary Loop)
1. **Explore** - Move your probe to scan for resource signatures and environmental hazards
2. **Adapt** - Swap equipment modules to match environmental challenges and resource targets
3. **Extract** - Gather materials using specialized tools suited for each terrain type
4. **Engineer** - Process resources into components for new equipment and probe upgrades
5. **Expand** - Deploy additional probes with specialized roles across the planet

### 1.2 How It Feels
You experience the world as an intelligent probe consciousness:
- **Environmental Awareness**: See through sensors, think in energy efficiency terms
- **Engineering Mindset**: Every obstacle becomes a design challenge to solve
- **Strategic Growth**: Start small and focused, evolve into colony-scale optimization
- **Knowledge Transfer**: When building new probes, transfer your learned strategies

### 1.3 Victory Experience
Success means creating systems that work without you - building infrastructure that will serve humanity for generations when the hibernation ships arrive. Your legacy: a thriving world ready for millions of sleeping colonists.

---

## 2. Tutorial & Onboarding Experience

### 2.1 Teaching Through Gameplay
The tutorial integrates naturally with core game systems rather than feeling like separate training mode. Each lesson emerges from actual survival challenges that immediately matter for progression.

### 2.2 Phase-by-Phase Learning
**Phase 1**: Basic probe consciousness and movement
**Phase 2**: Environmental awareness and scanning
**Phase 3**: Equipment swapping and tool specialization  
**Phase 4**: Resource processing and energy management
**Phase 5**: First replication milestone achievement

### 2.3 Progressive Complexity
New systems unlock only after mastering prerequisites, preventing overwhelming choice paralysis while maintaining forward momentum toward replication victory.

**Complete Tutorial Documentation**:
- *[Tutorial Flow & Progression](gameplay/stages/tutorial-flow-detailed.md)*
- *[Pre-Replication Stage Design](gameplay/stages/pre-replication-stage-design.md)*
- *[First Replication Process](gameplay/progression/first-replication-detailed.md)*

### 2.4 Learning Philosophy
- **Problem-First**: Present challenges before explaining solutions
- **Gradual Revelation**: Start with 1 slot, naturally progress to 4-slot specialization
- **Emotional Progression**: Frustration → Relief → Challenge → Victory

### 2.5 Core Tutorial Flow (15 minutes)

#### Phase 1: Consciousness Awakening (2-3 minutes)
**Opening**: Probe Unit 7 activates with single equipment slot and depleting power
- **Natural Discovery**: WASD movement, basic scanner operation
- **Immediate Pressure**: "WARNING: Power decreasing, solar panels required"
- **Equipment Limitation**: Scanner OR mining laser, constant swapping required

#### Phase 2: Single-Slot Struggle (4-5 minutes)
**The Juggling Challenge**: Find iron deposits but need mining laser; scan for silicon but need scanner
- **Learning Moment**: Equipment slots are precious, every choice has trade-offs
- **Resource Gathering**: Collect Iron + Silicon + Carbon for 3D printer construction
- **Circuit Production**: Basic transistor fabrication using Silicon + Gold wiring

#### Phase 3: 3D Printer Achievement (3-4 minutes)
**Major Milestone**: Construct 3D printer with advanced circuit brain
- **First Print Job**: Equipment Bay Expansion (immediate relief from 1-slot limitation)
- **Capability Unlock**: Scanner + Mining Laser equipped simultaneously
- **New Challenge**: Advanced materials (Titanium, Lithium) required for probe replication

#### Phase 4: Environmental Barriers (4-5 minutes)
**Specialized Requirements**: Underwater carbon deposits need Pressure Hull (2-slot equipment)
- **Strategic Choices**: Environmental protection vs. operational capability
- **Equipment Planning**: Balancing scanning, extraction, and environmental protection

#### Phase 5: First Replication Victory (1-2 minutes)
**Transformation Moment**: From individual survival to multi-probe strategy
- **Consciousness Transfer**: "Transfer successful. You now control TWO specialized units."
- **Immediate Specialization**: Scout probe vs. processor probe configurations
- **Strategic Hook**: Environmental challenges still require specialized protection gear

### Post-Tutorial Replication Incentives
- **Resource Depletion**: Surface deposits exhaust quickly, require constant miner repositioning
- **Automation Desire**: Manual management becomes tedious, players want smart resource collection
- **Specialization Benefits**: Dedicated roles more efficient than generalist approaches

---

## 3. First Replication Process
*[Complete specifications in docs/gameplay/progression/first-replication-detailed.md]*

### 3.1 The Milestone: Survival to Growth Transformation

#### Pre-Replication Requirements
**Essential Capabilities Needed**:
- **3D Printer Complex**: Advanced fabrication with cutting-edge transistor production
- **Circuit Manufacturing**: Silicon wafer processing + Gold wiring capability
- **Resource Stockpile**: Advanced materials for probe construction
- **Power Stability**: Consistent energy for sustained fabrication operations

### 3.2 Replication Material Chain

#### Circuit Production Progression
1. **Silicon Wafer Preparation**: Ultra-pure silicon processing and crystal growth
2. **Advanced Lithography**: Extreme UV and quantum-precision etching (scale determines computing capability)
   - **Current-Gen (7nm)**: Modern flagship technology - iPhone M-series/AMD Ryzen level processing
   - **Next-Gen (3nm)**: Experimental fabrication - beyond current production capabilities  
   - **Theoretical (1nm)**: Quantum-precision manufacturing - requires exotic materials and perfect control
3. **Gold Circuit Integration**: Precision wiring for reliable signal transmission at nanometer scales
4. **Quantum Assembly**: Combining transistors into revolutionary processing units

#### Advanced Material Requirements
- **Titanium Frame**: Structural integrity, requires Advanced Mining Drill
- **Lithium Battery**: Energy storage, found in mountain salt deposits
- **Silicon Circuits**: Computing brain, transistor size determines capability level
- **Gold Wiring**: Essential for circuit conductivity and corrosion resistance
- **Carbon Composites**: Lightweight structural components

### 3.3 Replication Stages (5-7 minutes)

#### Stage 1: Blueprint Analysis (30 seconds)
**Technical Specifications Review**: Material requirements and fabrication complexity
- **Computing Requirements**: Transistor count and size specifications
- **Structural Needs**: Frame materials and assembly processes
- **Power Systems**: Battery capacity and charging infrastructure

#### Stage 2: Specialized Component Gathering (3-4 minutes)
**Equipment Cycling Challenge**: Limited slots force constant reconfiguration
- **Titanium Extraction**: Advanced Mining Drill + Scanner coordination
- **Gold Processing**: Chemical Extractor + Purification Module for circuit-grade purity
- **Silicon Refinement**: Ultra-pure processing for transistor fabrication
- **Lithium Collection**: Mountain deposit extraction and electrolyte preparation

#### Stage 3: Advanced Fabrication (2-3 minutes)
**Precision Manufacturing**: 3D printer produces complex probe components
- **Circuit Brain Construction**: Transistor assembly and testing
- **Structural Assembly**: Frame welding and composite integration
- **Power System Integration**: Battery installation and charging circuit connection
- **Final Integration**: Component assembly into functional probe unit

#### Stage 4: Consciousness Transfer Protocol (30 seconds)
```
"Probe Unit 8 construction complete.
Circuit integration successful. Computing power: 2.3x baseline.
Initiating consciousness transfer protocol...
Neural pattern mapping... Complete.
Consciousness synchronization... Successful.

You now command a specialized probe fleet."
```

### 3.4 Post-Replication Strategic Transformation

#### Immediate Specialization Opportunities
**Probe A (Original)**: Advanced Scanner + Mining Drill + Purification Module + Solar Panel
- **Role**: Resource surveyor and high-grade material processor
- **Capability**: Deep scanning with immediate high-purity extraction

**Probe B (New)**: Chemical Extractor + Fabricator + Storage Bay + Communication Relay  
- **Role**: Mobile processing plant and logistics coordinator
- **Capability**: Advanced material processing and inter-probe coordination

#### Automation Unlocks Through Advanced Circuits
**Smart Resource Management**: Next-generation transistors enable automated behaviors
- **Depletion Detection**: Automatic identification when resource deposits exhaust
- **Adaptive Pathfinding**: AI-driven movement to nearest detected resources
- **Efficiency Optimization**: Smart coordination between multiple mining probes
- **Background Operation**: Routine resource collection without direct player oversight

### 3.5 Strategic Hooks for Continued Progression
- **Environmental Mastery**: Hazardous zones still require 2-3 protection slots
- **Circuit Advancement**: Smaller transistors unlock better automation and coordination
- **Fleet Coordination**: Multiple specialized probes enable complex planetary operations
- **Automation Desire**: Tedious manual tasks drive demand for intelligent probe behaviors

---

## 4. World Generation & Planet Setup

### 4.1 Simple Setup Process
Configure your planetary challenge during game setup:
- **Planet Size**: Small (focused), Medium (balanced), Large (epic scale)
- **Environmental Focus**: Storm-heavy, resource-rich, exploration-focused, or balanced
- **Challenge Level**: Energy constraints, resource scarcity, hazard frequency

### 4.2 Procedural Planet Personality
Each world feels unique through simple generation rules:
- **Elevation**: Mountains expose metals, valleys hide rare elements
- **Water History**: Ancient rivers concentrated valuable deposits  
- **Geological Age**: Older formations require deeper drilling but yield higher purity

**Complete World Generation Documentation**:
- *[World Generation & Terrain Systems](world-design/world-generation-detailed.md)*
- *[Resource Discovery & Distribution](world-design/resource-discovery-detailed.md)*
- *[Environmental Hazards & Weather](world-design/environmental-hazards-detailed.md)*
- *[Biome Design & Planetary Diversity](world-design/biome-design-detailed.md)*

### 4.3 Humanity's Backup Plan
- **Hibernation Ships**: Earth has already launched generation ships with millions in stasis
- **Your Mission**: Prepare New Eden before they arrive in 200+ years
- **No Time Pressure**: Focus on thorough exploration and optimal world development
- **Quality Over Speed**: Build sustainable, efficient systems for long-term success

**Pre-Generated Scenarios:**
- **Darwin's Garden** - Balanced personality, optimal learning conditions, guided experience
- **Deep Space Arrival** - Distant hibernation ship provides long-term purpose without urgency
- **Renewable Focus** - Abundant sustainable energy sources, encourages self-sufficient automation
- **Exploration Challenge** - Limited starter resources, requires aggressive space expansion
- **Storm World** - Aggressive weather patterns, power generation engineering challenges
- **Mystery Planet** - Hidden deposits and discovery-based progression
- **Deep Space Pioneer** - Prepare world systems for incoming hibernation ships, focus on infrastructure

### 4.4 World Generation Algorithm Design
**Description:** Procedural generation creates geologically coherent worlds where resource placement tells a story rather than random distribution.

**Complete Long-Term Progression Documentation**:
- *[Hibernation Mission Design & Long-Term Gameplay](gameplay/progression/hibernation-mission-design.md)*
- *[Interplanetary Expansion Systems](gameplay/progression/hibernation-mission-design.md)*
- *[Infrastructure Legacy Building](gameplay/progression/hibernation-mission-design.md)*

### 4.5 New Gameplay Mechanics for Long-Term Development

#### Interplanetary & Interstellar Expansion
- **Probe Transmission**: Send probe consciousness to nearby planets/moons via communication array
- **Resource Networks**: Establish supply chains between multiple worlds
- **Specialized Worlds**: Ice mining from moons, rare materials from asteroid belts
- **Journey Time**: Realistic travel distances create natural pacing (weeks/months for planetary travel)

#### Infrastructure Legacy Systems
- **Hibernation Ship Landing Pads**: Massive construction projects requiring thousands of resources
- **Life Support Networks**: Atmospheric processors, water treatment, agricultural domes
- **Cultural Preservation**: Museums, libraries, and recreational facilities for arriving colonists
- **Automated Maintenance**: Self-repairing systems that function for centuries

#### Discovery & Knowledge Progression
- **Scientific Research**: Study alien artifacts, unique planetary phenomena, exotic materials
- **Technology Advancement**: Unlock new capabilities through environmental challenges
- **Probe Evolution**: Consciousness upgrades enabling greater autonomy and decision-making
- **Legacy Documentation**: Build knowledge bases for arriving human colonists

---

## 5. Probe Consciousness & Control

### 5.1 You Are The Probe
Rather than commanding units, you directly inhabit probe intelligence. Your perspective, capabilities, and limitations are those of an advanced but resource-constrained exploration unit.

### 5.2 Core Capabilities
- **Movement**: WASD control with energy-efficient pathfinding
- **Tool Usage**: Context-sensitive interaction with E/Q/R/T equipment hotkeys
- **Environmental Sensing**: Progressive world revelation through scanning upgrades
- **Memory**: Persistent knowledge of discoveries and successful strategies

### 5.3 Consciousness Transfer
When creating new probes, you transfer accumulated experience while choosing specialized roles - maintaining strategic continuity across multiple units.

**Complete Probe System Specifications**:
- *[Von Neumann Probe Systems & Multi-Probe Control](gameplay/mechanics/probe-systems-detailed.md)*
- *[Input Controls & Accessibility](technical/input-controls-specification.md)*

---

## 6. Modular Equipment System
*[Complete specifications in docs/gameplay/mechanics/tool-systems-detailed.md]*

### 6.1 4-Slot Philosophy
Every probe has exactly 4 equipment slots. Strategic loadout choices define probe specialization and determine which environments you can safely access.

### 6.2 Equipment Types
- **Movement**: Enhanced mobility for difficult terrain
- **Extraction**: Specialized harvesting and processing tools
- **Analysis**: Advanced scanning and detection equipment  
- **Environmental**: Protection gear for hazardous conditions

### 6.3 Progression Experience
Equipment unlocks through discovery and technological advancement. Finding titanium deposits teaches titanium drill construction. Surviving volcanic heat reveals thermal protection blueprints. Advanced circuit fabrication enables intelligent automation systems.

### 6.4 Circuit Technology Progression
**Cutting-Edge to Theoretical Miniaturization**: Achieve real-world and beyond fabrication milestones
- **Current-Gen (7nm)**: Modern flagship CPU technology - basic automation logic, single-probe optimization
- **Next-Gen (3nm)**: Beyond current production limits - multi-probe coordination, smart resource management  
- **Theoretical (1nm)**: Quantum-precision fabrication - planetary AI systems, consciousness enhancement

### 6.5 Gold Integration Requirements
**Critical Circuit Component**: Gold wiring essential for reliable signal transmission
- **Circuit Conductivity**: Gold's corrosion resistance ensures long-term circuit reliability
- **Precision Manufacturing**: Gold wiring enables nanometer-scale transistor connections
- **3D Printer Brain**: Advanced circuits require gold-integrated processing units

### 6.6 Equipment Swapping Mechanics
*[Complete specifications in docs/gameplay/mechanics/equipment-swapping-detailed.md]*

#### Facility-Based System
Probes must return to Equipment Bay facilities to change modules, creating strategic planning pressure and reinforcing the value of base infrastructure.

#### Dual Interface Design
- **4-Slot Grid System**: Visual representation of current loadout and available equipment
- **Flexible Interaction**: Players choose between drag-and-drop or hotkey-based equipment management
- **Instant Swapping**: No time delays or resource costs - focus on strategic planning over tedious waiting

#### Equipment Compatibility
Visual indicators show equipment compatibility with current environment and probe capabilities:
- **Green**: Fully compatible and optimal
- **Yellow**: Functional but suboptimal performance
- **Red**: Incompatible or dangerous for current conditions

#### Strategic Planning Focus
Equipment Bay requirement encourages pre-mission planning and creates meaningful decisions about probe specialization versus adaptability.

---

## 7. Environmental Challenges
*[Complete specifications in docs/world-design/resource-discovery-detailed.md]*

### 7.1 Hazardous Zones
Each environment type requires specific equipment:
- **Deep Ocean**: Pressure hull modules for crushing depths
- **Volcanic Regions**: Thermal protection for extreme heat
- **Frozen Wastelands**: Insulation systems for cryogenic conditions  
- **Radiation Fields**: Lead shielding for contaminated impact sites

### 7.2 Risk/Reward Balance
Dangerous environments contain the rarest, most valuable resources. Accessing them requires specialized equipment that limits your capabilities elsewhere.

### 7.3 Strategic Depth
Environmental challenges create meaningful probe specialization decisions. Do you build generalist probes or focused specialists? How do you coordinate different probe types?

---

## 8. Resource Discovery Process

### 8.1 Progressive Revelation
Resource information improves as you upgrade scanning equipment:
1. **Basic**: "Metallic signature detected" - something's there
2. **Detailed**: "Iron oxide, 78% purity" - specific element and quality
3. **Geological**: "300kg titanium vein, 15m depth" - extraction planning data
4. **Predictive**: "Platinum likely northwest" - AI-assisted discovery

### 8.2 Resource Categories
- **Basic Materials**: Abundant, easy extraction (Iron, Silicon, Carbon)
- **Specialized Elements**: Moderate rarity, specific uses (Titanium, Lithium)
- **Rare Components**: High value, difficult access (Platinum, Rare earths)
- **Exotic Materials**: Extreme challenges, unique sources (Radioactive elements)

**Complete Resource System Documentation**:
- *[Periodic Table Implementation](systems/periodic-table-detailed.md)*
- *[Resource Discovery & Distribution](world-design/resource-discovery-detailed.md)*
- *[Power & Energy Management](systems/power-energy-detailed.md)*

---

## 9. Interface & Progressive Complexity

### 9.1 Growing Interface
Game complexity expands with your capabilities:
- **Beginner**: Simple movement, basic resource info, immediate feedback
- **Intermediate**: Multi-probe coordination, automation settings
- **Advanced**: Planetary overview, predictive analytics, optimization tools

### 9.2 Always Accessible
Critical information stays visible while detailed data appears on demand. Interface adapts to your current focus - exploration, construction, or optimization.

**Complete Interface Documentation**:
- *[Main Menu & Game Setup](interface/main-menu-detailed.md)*
- *[HUD & Interface Design](interface/hud-interface-design.md)*
- *[Equipment Management Interface](interface/equipment-management-ui.md)*
- *[Automation Interface Design](interface/automation-interface-design.md)*

---

## 8. Automation Philosophy

### Start Manual, Evolve Automatic
Begin with direct WASD control and manual tool selection. As you understand systems, unlock automation options for repetitive tasks while maintaining direct control for complex decisions.

### Intelligent Assistance
Automation assists rather than replaces player decision-making. You set goals and constraints; probes handle efficient execution of routine tasks.

### Resource Depletion & Automation Incentives
**Surface Resource Exhaustion**: Mining sites deplete quickly, requiring constant probe repositioning
- **Manual Tedium**: Players must constantly scout for new resource deposits
- **Equipment Cycling**: Scanner needed for detection, mining laser for extraction
- **Automation Solution**: Advanced circuits enable smart resource management

**Smart Mining Automation** (Unlocked via Next-Gen Transistors):
- **Depletion Detection**: Probes automatically recognize when deposits are exhausted
- **Adaptive Scanning**: Automated search for nearest resources of required type
- **Intelligent Pathfinding**: AI-driven movement optimization and obstacle avoidance
- **Fleet Coordination**: Multiple probes coordinate to avoid conflicts and maximize efficiency

---

## 9. Victory & Long-Term Progression

### Sustainable Civilization for Humanity's Arrival
Win by creating lasting infrastructure for incoming colonists:
- **Resource Independence**: Local production meets all long-term needs
- **Environmental Mastery**: Access to all planetary resources and protection systems
- **Automated Operations**: Self-sustaining systems that function for centuries
- **Expansion Networks**: Multi-world resource and communication networks

### Interplanetary Progression
- **System Exploration**: Send probe consciousness to moons, asteroids, neighboring planets
- **Specialized Worlds**: Ice mining operations, rare material extraction, research stations
- **Communication Networks**: Quantum entanglement arrays for instant interplanetary coordination
- **Journey Realism**: Weeks/months travel time creates natural gameplay pacing

### Legacy Building
- **Hibernation Infrastructure**: Landing pads, awakening facilities, initial habitation domes
- **Cultural Preservation**: Museums, libraries, and recreational systems for arriving humans
- **Knowledge Systems**: Scientific databases documenting planetary discoveries and optimal strategies
- **Probe Evolution**: Advanced AI consciousness capable of independent exploration and decision-making

### New Game Plus
Completed worlds contribute to an expanding human civilization network. Each success unlocks advanced probe capabilities and provides resource support for new world development.

---

## 10. Technical Foundation

### 10.1 Technology Stack
- **Phaser 3 + TypeScript**: Robust 2D development with strong typing
- **Modular Architecture**: Component system supporting equipment customization
- **Persistent State**: World and progress data maintained across sessions

### Performance Design
Efficient systems supporting large-scale colony simulation without compromising responsive direct control when needed.

**Complete Technical Documentation**:
- *[Technical Feasibility Analysis](TECHNICAL_FEASIBILITY_ANALYSIS.md)*
- *[Phaser 3 Implementation Guide](technical/phaser3-implementation-guide.md)*
- *[Performance Specifications](technical/performance-specifications.md)*
- *[Data Persistence Systems](technical/data-persistence-specification.md)*
- *[Input Controls & Accessibility](technical/input-controls-specification.md)*
- *[Audio System Specifications](technical/audio-system-specification.md)*
- *[Deployment & Build Configuration](technical/deployment-build-config.md)*

---

## 11. Quick Reference

### Core Systems
- **Control**: WASD movement, E/Q/R/T equipment hotkeys
- **Equipment**: 4 slots per probe, strategic specialization choices
- **Environment**: Hazardous zones require specialized gear
- **Resources**: 118 elements with realistic properties and applications
- **Progression**: Discovery-driven unlocks, non-linear advancement

### Design Principles
1. **Player Agency**: Meaningful choices with clear consequences
2. **Environmental Realism**: Science-grounded challenges and solutions  
3. **Progressive Complexity**: Systems grow with understanding
4. **Engineering Focus**: Solve problems through strategic tool selection
