# Epic: Equipment Management System

## Epic Overview
Implement the modular 4-slot equipment system with drag-and-drop interface, compatibility checking, and real-time capability updates.

## User Stories

### Story 1: Equipment Slot Framework
**As a** player  
**I want to** have 4 equipment slots on my probe  
**So that** I can customize my capabilities

**Acceptance Criteria:**
- [ ] 4-slot visual grid interface
- [ ] Slots can be empty or filled
- [ ] Equipment icons display clearly
- [ ] Slot highlighting on hover

### Story 2: Drag-and-Drop Interface
**As a** player  
**I want to** drag equipment between slots  
**So that** I can reconfigure my probe

**Acceptance Criteria:**
- [ ] Click and drag equipment items
- [ ] Visual ghost follows cursor
- [ ] Snap to valid slots
- [ ] Return to origin if invalid

### Story 3: Compatibility System
**As a** player  
**I want to** see equipment compatibility  
**So that** I can make valid configurations

**Acceptance Criteria:**
- [ ] Green border: compatible
- [ ] Yellow border: power limited
- [ ] Red border: incompatible
- [ ] Tooltip explains restrictions

### Story 4: Equipment Categories
**As a** player  
**I want** different equipment types  
**So that** I can tackle various challenges

**Acceptance Criteria:**
- [ ] Movement tools (jets, tracks)
- [ ] Mining tools (laser, drill)
- [ ] Analysis tools (scanner, spectroscope)
- [ ] Protection (shields, armor)

### Story 5: Power Management Integration
**As a** player  
**I want to** see equipment power usage  
**So that** I can balance my energy

**Acceptance Criteria:**
- [ ] Show kW usage per equipment
- [ ] Total power consumption bar
- [ ] Idle vs active power states
- [ ] Warning if over power budget

### Story 6: Equipment Effects
**As a** player  
**I want** equipment to change probe behavior  
**So that** gameplay is meaningful

**Acceptance Criteria:**
- [ ] Movement speed modifiers
- [ ] Mining efficiency bonuses
- [ ] Scan range increases
- [ ] Environmental resistances

### Story 7: Equipment Bay Building
**As a** player  
**I want to** change equipment at special buildings  
**So that** I must plan my loadouts

**Acceptance Criteria:**
- [ ] Equipment Bay structure
- [ ] Must be at bay to swap
- [ ] Storage for unused equipment
- [ ] Quick loadout presets

## Technical Requirements
- Component-based equipment system
- Efficient UI rendering
- Touch-friendly controls
- Save/load equipment states

## Dependencies
- Probe Control System
- Energy Management System
- Building System
- UI Framework

## Estimated Effort
- Slot Framework: 2 days
- Drag-and-Drop: 3 days
- Compatibility: 2 days
- Equipment Types: 4 days
- Power Integration: 1 day
- Equipment Effects: 3 days
- Equipment Bay: 2 days
- **Total: 17 days**