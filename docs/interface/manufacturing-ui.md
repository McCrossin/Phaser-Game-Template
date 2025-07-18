# Manufacturing UI Design Document

## Overview
The Manufacturing UI provides intuitive access to the game's crafting system, featuring recipe discovery, queue management, and clear resource requirement displays for the 3D Printer, Circuit Assembler, and Chemical Processing units.

## Main Manufacturing Interface

### Layout Structure
- **Activation**: Click on manufacturing building or press M
- **Window Size**: 1200x800px default
- **Sections**:
  - Recipe browser (left panel)
  - Crafting details (center)
  - Queue management (right panel)
  - Resource inventory (bottom)

### Recipe Browser
- **Layout**: Categorized tree structure
- **Categories**:
  - Basic Components
  - Advanced Circuits
  - Equipment Modules
  - Structural Elements
  - Discovered Recipes (special section)
- **Visual Elements**:
  - Recipe icons (64x64px)
  - Completion checkmarks
  - New recipe indicators
  - Search/filter bar

### Crafting Details Panel
- **Selected Recipe Display**:
  - Large item preview (128x128px)
  - Recipe name and description
  - Manufacturing time estimate
  - Power consumption rate
- **Resource Requirements**:
  - Grid of required materials
  - Quantity needed vs available
  - Missing resources highlighted in red
  - Alternative recipe options

### Manufacturing Queue
- **Queue Display**:
  - Vertical list of queued items
  - Progress bars for active crafting
  - Time remaining estimates
  - Drag to reorder functionality
- **Queue Controls**:
  - Pause/resume buttons
  - Cancel with resource refund
  - Priority boost option
  - Repeat quantity selector

## Recipe Discovery System

### Discovery Interface
- **Unknown Recipes**: Shown as "???" silhouettes
- **Hint System**: 
  - Partial resource hints
  - Discovery progress bar
  - Experiment suggestions
- **Discovery Animation**:
  - Dramatic reveal effect
  - Recipe learned notification
  - Auto-categorization

### Experimentation Mode
- **Freeform Crafting**:
  - Drag resources to experiment slots
  - Compatibility indicators
  - Success probability display
  - Failed experiment feedback

## Resource Management

### Resource Display
- **Inventory Grid**:
  - Periodic table organization
  - Quantity overlays
  - Rarity color coding
  - Quick deposit interface

### Resource Flow Visualization
- **Animated Indicators**:
  - Resources flowing to machine
  - Consumption rate display
  - Storage capacity warnings
  - Logistics path preview

## Manufacturing Buildings UI

### 3D Printer Interface
- **Unique Elements**:
  - Layer-by-layer progress visual
  - Material feed indicators
  - Print quality settings
  - Speed vs efficiency slider

### Circuit Assembler Interface
- **Unique Elements**:
  - Circuit complexity tiers (7nm/3nm/1nm)
  - Silicon wafer consumption
  - Clean room status indicator
  - Yield percentage display

### Chemical Processor Interface
- **Unique Elements**:
  - Reaction chamber visual
  - Temperature/pressure controls
  - Catalyst slot system
  - Byproduct management

## Visual Design Language

### Color Coding
- **Resource Tiers**:
  - Common: Gray/White
  - Uncommon: Green
  - Rare: Blue
  - Exotic: Purple
- **Status Indicators**:
  - Active: Animated green
  - Queued: Static yellow
  - Blocked: Flashing red
  - Complete: Pulsing white

### Animation and Feedback
- **Crafting Animations**:
  - Progress bar fills
  - Machine operation visuals
  - Steam/particle effects
  - Success celebration burst
- **Audio Cues**:
  - Crafting start/complete
  - Discovery chime
  - Error buzzer
  - Queue notification

## Mobile Optimization

### Touch Adaptations
- **Larger Touch Targets**: 100x100px minimum
- **Swipe Gestures**: 
  - Navigate categories
  - Scroll queues
  - Dismiss windows
- **Long Press Actions**:
  - View recipe details
  - Queue multiple items
  - Cancel crafting

### Simplified Layout
- **Tab-based Navigation**: Separate screens for browse/craft/queue
- **Full-Screen Mode**: Maximum space utilization
- **Context Menus**: Replace hover tooltips

## Performance Considerations

### Optimization Strategies
- **Lazy Loading**: Load recipes as needed
- **Icon Caching**: Pre-rendered recipe icons
- **Update Batching**: Group UI updates
- **LOD System**: Simplified visuals when zoomed out

### Memory Management
- **Limited Active Recipes**: Only load visible recipes
- **Pooled UI Elements**: Reuse queue items
- **Efficient Tooltips**: Single tooltip instance

## Accessibility Features

### Visual Accessibility
- **Text Mode**: Full text descriptions
- **High Contrast**: Clear boundaries
- **Colorblind Mode**: Shape-based indicators
- **Scalable UI**: 50% to 200% scaling

### Control Accessibility
- **Full Keyboard Nav**: Tab through all elements
- **Screen Reader**: Crafting status announcements
- **One-Click Mode**: Simplified interactions
- **Batch Operations**: Craft multiple with single action