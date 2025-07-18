# Epic: Probe Control System

## Epic Overview
Implement the complete probe control system including movement, equipment management, and multi-probe coordination.

## User Stories

### Story 1: Basic Probe Movement
**As a** player  
**I want to** control my probe using WASD keys  
**So that** I can explore the planet surface

**Acceptance Criteria:**
- [ ] WASD keys move probe in 8 directions
- [ ] Smooth movement at 200 units/second base speed
- [ ] Collision detection with terrain
- [ ] Movement affects power consumption (0.5kW)

### Story 2: Equipment System Integration
**As a** player  
**I want to** equip different tools on my probe  
**So that** I can perform various tasks

**Acceptance Criteria:**
- [ ] 4-slot equipment system implemented
- [ ] Drag-and-drop equipment interface
- [ ] Equipment affects probe capabilities
- [ ] Power consumption per equipment type

### Story 3: Context-Sensitive Controls
**As a** player  
**I want to** use equipped tools with mouse clicks  
**So that** I can interact with the environment

**Acceptance Criteria:**
- [ ] Left-click activates primary tool
- [ ] Visual feedback for tool usage
- [ ] Different tools have different interactions
- [ ] Range limitations enforced

### Story 4: Multi-Probe Management
**As a** player  
**I want to** control multiple probes  
**So that** I can scale my operations

**Acceptance Criteria:**
- [ ] Switch between probes with Tab
- [ ] Minimap shows all probe locations
- [ ] Direct control mode (1 probe, 60 FPS)
- [ ] Assisted mode (2-3 probes, reduced updates)
- [ ] Autonomous mode (4+ probes, AI control)

### Story 5: Probe Replication
**As a** player  
**I want to** create new probes  
**So that** I can expand my capabilities

**Acceptance Criteria:**
- [ ] Build new probe with 3D printer
- [ ] Transfer consciousness to new probe
- [ ] Maintain experience/upgrades
- [ ] Resource cost: 100 circuits + materials

## Technical Requirements
- TypeScript implementation
- Component-based probe architecture
- Efficient update loops for multi-probe
- State synchronization system

## Dependencies
- Input Management System
- Equipment System
- Energy Management System
- Physics System

## Estimated Effort
- Basic Movement: 3 days
- Equipment Integration: 5 days
- Context Controls: 2 days
- Multi-Probe: 5 days
- Replication: 3 days
- **Total: 18 days**