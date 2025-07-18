# HUD Design Document

## Overview
The Heads-Up Display (HUD) provides critical information to players without obstructing gameplay. It displays energy levels, resource counts, equipment status, and environmental warnings.

## Layout Structure

### Top Bar - Energy Display
- **Position**: Top center of screen
- **Components**:
  - Solar generation rate (kW)
  - Current battery level (kWh)
  - Net power flow indicator (+/- kW)
  - Visual battery meter with percentage

### Left Panel - Equipment Status
- **Position**: Left side, vertically centered
- **Components**:
  - 4 equipment slots with icons
  - Active tool highlight
  - Power consumption per tool
  - Durability/charge indicators
  - Hotkey labels (E/Q/R/T)

### Right Panel - Resource Summary
- **Position**: Right side, scrollable list
- **Components**:
  - Compact resource inventory
  - Currently held resources (top 5-8)
  - Storage capacity indicator
  - Quick access to full inventory

### Bottom Bar - Environmental Status
- **Position**: Bottom center
- **Components**:
  - Current biome/area name
  - Environmental hazard warnings
  - Weather conditions affecting solar
  - Probe health/integrity

## Visual Design

### Style Guidelines
- Semi-transparent backgrounds (80% opacity)
- Clean, minimalist design language
- High contrast for readability
- Color coding for resource types
- Animation for state changes

### Responsive Scaling
- HUD scales with resolution
- Minimum readable size enforced
- Touch-friendly sizing on mobile
- Collapsible panels for more screen space

## Interaction Design

### Mouse/Touch Controls
- Hover for detailed tooltips
- Click to expand panels
- Drag to reposition (settings)
- Pinch to scale HUD size

### Keyboard Shortcuts
- Tab: Toggle full HUD
- I: Open inventory
- E/Q/R/T: Equipment selection
- H: Hide/show HUD elements

## Performance Considerations
- Update energy display every 100ms
- Batch resource updates
- Efficient text rendering
- Minimal draw calls

## Accessibility Features
- Colorblind-friendly modes
- Scalable text size
- High contrast option
- Screen reader support for key values