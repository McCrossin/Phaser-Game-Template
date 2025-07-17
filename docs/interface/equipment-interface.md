# Equipment Interface Design Document

## Overview
The Equipment Interface allows players to manage their probe's 4-slot modular equipment system through an intuitive drag-and-drop interface with clear visual feedback for compatibility and power requirements.

## Interface Layout

### Main Equipment Panel
- **Activation**: Press TAB or click probe
- **Position**: Center screen overlay
- **Size**: 800x600px base resolution

### Equipment Bay Grid
- **Layout**: 2x2 grid of equipment slots
- **Slot Size**: 120x120px per slot
- **Visual Elements**:
  - Slot borders indicating compatibility
  - Power consumption overlay
  - Equipment icons with quality indicators
  - Empty slot placeholders

### Available Equipment List
- **Position**: Right side panel
- **Layout**: Scrollable grid (3 columns)
- **Filtering Options**:
  - By category (Movement/Mining/Analysis/Protection)
  - By power consumption
  - By compatibility with current setup
  - Search by name

### Equipment Details Panel
- **Position**: Left side panel
- **Information Displayed**:
  - Equipment name and tier
  - Power consumption (idle/active)
  - Special abilities or modifiers
  - Compatibility warnings
  - Detailed description

## Interaction Flow

### Drag and Drop Mechanics
1. **Pickup**: Click and hold equipment
2. **Drag**: Visual ghost follows cursor
3. **Hover**: Slots highlight with compatibility
   - Green: Compatible, power available
   - Yellow: Compatible, insufficient power
   - Red: Incompatible combination
4. **Drop**: Equipment snaps to slot or returns

### Visual Feedback System
- **Compatibility Indicators**:
  - Green checkmark: Valid configuration
  - Yellow warning: Power constraints
  - Red X: Invalid combination
- **Power Budget Bar**:
  - Shows total power consumption
  - Highlights overdraw in red
  - Updates in real-time during drag

### Quick Actions
- **Right-click**: Quick unequip
- **Shift-click**: Compare equipment
- **Double-click**: Auto-equip to best slot
- **Hotkeys**: Number keys for quick swap

## Equipment Categories

### Movement Equipment
- **Visual Theme**: Blue highlights
- **Icons**: Directional arrows, speed lines
- Examples: Hover Jets, Track Units, Climbing Gear

### Mining/Extraction Tools
- **Visual Theme**: Orange highlights  
- **Icons**: Drill bits, laser beams
- Examples: Mining Laser, Pneumatic Drill, Chemical Extractor

### Analysis Equipment
- **Visual Theme**: Green highlights
- **Icons**: Radar waves, scan lines
- Examples: Resource Scanner, Seismic Analyzer, Spectroscope

### Environmental Protection
- **Visual Theme**: Purple highlights
- **Icons**: Shield symbols, armor plates
- Examples: Pressure Hull, Thermal Shield, Radiation Shielding

## Mobile/Touch Adaptations

### Touch Controls
- **Tap**: Select equipment
- **Long press**: Pick up for drag
- **Swipe**: Scroll through equipment
- **Pinch**: Zoom interface

### Layout Adjustments
- Larger touch targets (150x150px)
- Increased spacing between slots
- Full-screen interface mode
- Simplified drag indicators

## Performance Optimization

### Rendering Efficiency
- Cached equipment icons
- Batched UI updates
- Lazy loading for inventory
- Efficient tooltip rendering

### Memory Management
- Limited equipment preview models
- Texture atlas for UI elements
- Pooled UI components
- Garbage collection timing

## Accessibility Features

### Visual Accessibility
- High contrast mode
- Colorblind-friendly indicators
- Text labels option
- Adjustable UI scale

### Control Accessibility
- Full keyboard navigation
- Gamepad support
- Customizable hotkeys
- One-handed mode option