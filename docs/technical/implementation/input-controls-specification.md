# Input & Controls Specification
## New Eden Project - Complete Input Control Design

### Document Overview
**Version**: 1.0  
**Status**: Development Ready  
**Target Platform**: Phaser 3 + TypeScript (Web Browser)  
**Performance Target**: 60 FPS with responsive input handling  
**Control Context**: Multi-modal interaction supporting keyboard, mouse, and accessibility needs

---

## 🎯 Input Design Philosophy

### Core Input Principles

**1. Multi-Modal Flexibility**
- Primary and secondary methods for all critical actions
- Seamless switching between keyboard and mouse interaction
- Accessibility-first design with customizable controls
- Touch-ready interface architecture for future mobile support

**2. Context-Aware Input**
- Different control schemes for exploration vs. interface management
- Modal input handling that adapts to current game state
- Intuitive control remapping that maintains spatial logic
- Performance-optimized input polling for 60 FPS responsiveness

**3. Progressive Complexity**
- Simple controls for basic probe operation
- Advanced hotkey systems for power users
- Fleet management shortcuts that scale with probe count
- Equipment management efficiency tools for experienced players

---

## 🕹️ Core Gameplay Controls

### Probe Movement & Navigation

**Primary Movement (WASD)**
- **W**: Move North/Forward
- **A**: Move West/Left  
- **S**: Move South/Backward
- **D**: Move East/Right

**Alternative Movement (Arrow Keys)**
- **↑**: Move North/Forward
- **←**: Move West/Left
- **↓**: Move South/Backward  
- **→**: Move East/Right

**Movement Modifiers**
- **Shift + Movement**: Precise movement mode (50% speed, exact positioning)
- **Ctrl + Movement**: Fast travel mode (200% speed when energy permits)
- **Alt + Movement**: Survey mode (slow movement with continuous environmental scanning)

**Mouse Movement Support**
- **Right-Click**: Move to target location (pathfinding navigation)
- **Right-Click + Drag**: Queue multiple movement waypoints
- **Middle-Mouse + Drag**: Pan camera view (probe follows when released)
- **Mouse Wheel**: Zoom in/out on probe and surrounding area

### Equipment Interaction Controls

**Basic Equipment Usage**
- **E**: Activate primary equipment (context-sensitive)
- **Q**: Activate secondary equipment (if equipped)
- **R**: Activate tertiary equipment (if equipped)
- **T**: Activate quaternary equipment (if equipped)
- **F**: Interact with nearby objects/facilities (Equipment Bay, resources)

**Equipment Context Actions**
- **Shift + E/Q/R/T**: Toggle equipment on/off (for continuous operation equipment)
- **Ctrl + E/Q/R/T**: Access equipment-specific configuration menu
- **Alt + E/Q/R/T**: Show equipment status and efficiency information

**Equipment Quick-Select Wheel**
- **Hold Tab**: Display equipment selection wheel around cursor
- **Mouse Movement + Tab**: Highlight equipment while wheel is open
- **Release Tab**: Activate highlighted equipment
- **Scroll Wheel + Tab**: Cycle through equipment while wheel is displayed

### Resource Collection & Management

**Resource Interaction**
- **Space**: Collect/gather resources at current location
- **Ctrl + Space**: Automated resource collection (depletes local resources)
- **Shift + Space**: Selective resource gathering (opens resource selection interface)

**Inventory Management**
- **I**: Open inventory and resource summary
- **Ctrl + I**: Sort inventory by resource type
- **Shift + I**: Sort inventory by quantity/rarity
- **Alt + I**: Show resource processing chain recommendations

---

## 🖱️ Mouse & Pointer Controls

### Interface Interaction Patterns

**Equipment Bay Interface**
- **Left-Click**: Select equipment or slot
- **Drag & Drop**: Move equipment between slots and storage
- **Right-Click**: Show equipment details and compatibility information
- **Double-Click**: Quick-equip/unequip equipment to/from optimal slot
- **Shift + Click**: Multi-select equipment for batch operations
- **Ctrl + Click**: Add equipment to comparison view

**Solar Panel Management**
- **Left-Click**: Select individual solar panel
- **Drag**: Adjust panel orientation for optimal efficiency
- **Right-Click**: Access panel configuration menu
- **Shift + Drag**: Adjust multiple panels simultaneously
- **Ctrl + Click**: Group panels for coordinated control
- **Double-Click**: Auto-optimize panel positioning

**World Interaction**
- **Left-Click**: Basic interaction/selection
- **Right-Click**: Context menu for objects and environmental features
- **Ctrl + Left-Click**: Queue actions for automated execution
- **Shift + Left-Click**: Multi-target selection for area operations
- **Alt + Left-Click**: Analyze target (show detailed information)

### Camera & View Controls

**Camera Movement**
- **Middle-Mouse + Drag**: Pan camera view freely
- **Mouse Wheel**: Zoom in/out centered on cursor position
- **Shift + Mouse Wheel**: Fine zoom adjustment (smaller increments)
- **Ctrl + Mouse Wheel**: Rapid zoom (larger increments)

**View Management**
- **Home**: Center camera on active probe
- **End**: Center camera on Equipment Bay facility
- **Page Up/Down**: Cycle through probe fleet (if multiple probes)
- **Insert**: Toggle between probe-centered and free camera mode
- **Delete**: Reset camera zoom to default level

---

## ⌨️ Advanced Keyboard Controls

### Equipment Management Hotkeys

**Equipment Bay Interface**
- **1-4**: Select equipment slots for modification
- **Shift + 1-4**: Apply saved equipment preset to selected slot configuration
- **Ctrl + 1-4**: Save current equipment configuration as preset
- **Alt + 1-4**: Quick-swap to pre-defined equipment loadout

**Equipment Presets**
- **F1-F4**: Load saved equipment configurations (Deep Sea, Volcanic, Arctic, Radiation)
- **Ctrl + F1-F4**: Update saved configuration with current equipment setup
- **Shift + F1-F4**: Apply configuration to all probes in fleet
- **Alt + F1-F4**: Compare current configuration with saved preset

**Equipment Categories**
- **Tab**: Cycle through equipment categories (Mining, Analysis, Environmental, Utility)
- **Shift + Tab**: Reverse cycle through equipment categories
- **Ctrl + Tab**: Show all equipment in expanded category view
- **Enter**: Equip highlighted equipment to selected slot
- **Backspace**: Remove equipment from selected slot

### Fleet Management Controls

**Multi-Probe Operations**
- **F5-F8**: Switch direct control between different probes
- **Ctrl + F5-F8**: Switch probe control mode (Direct/Assisted/Autonomous)
- **Shift + F5-F8**: Show detailed status for specific probe
- **Alt + F5-F8**: Issue high-level commands to specific probe

**Fleet Coordination**
- **Ctrl + A**: Select all probes in fleet
- **Ctrl + G**: Group selected probes for coordinated operations
- **Ctrl + U**: Ungroup selected probe group
- **Ctrl + C**: Copy equipment configuration from active probe
- **Ctrl + V**: Apply copied configuration to selected probe(s)

**Consciousness Transfer**
- **F9**: Initiate consciousness transfer interface
- **Shift + F9**: Emergency consciousness transfer to nearest probe
- **Ctrl + F9**: Show consciousness network status and connectivity
- **Alt + F9**: Toggle between consciousness transfer modes

### System & Interface Controls

**Menu Navigation**
- **Escape**: Open main game menu / Close current interface
- **P**: Pause/unpause game
- **M**: Open/close world map
- **N**: Open/close probe fleet status panel
- **B**: Open/close equipment bay interface

**Information & Analysis**
- **H**: Show/hide help overlay with control reminders
- **J**: Show/hide journal and mission objectives
- **K**: Show/hide resource discovery log and periodic table progress
- **L**: Show/hide system performance metrics and efficiency indicators

**Quick Actions**
- **Enter**: Confirm current action or selection
- **Space**: Context-sensitive primary action (collect, activate, confirm)
- **Backspace**: Cancel current action or return to previous interface
- **Delete**: Clear selection or remove selected item

---

## 📱 Touch & Mobile Controls (Future Support)

### Touch Interface Design

**Basic Touch Gestures**
- **Single Tap**: Select/interact with objects
- **Double Tap**: Quick action (context-dependent)
- **Long Press**: Show context menu or detailed information
- **Tap + Hold + Drag**: Move probe or drag equipment

**Multi-Touch Gestures**
- **Pinch**: Zoom in/out on game world
- **Two-Finger Pan**: Move camera view
- **Three-Finger Tap**: Open quick action menu
- **Four-Finger Swipe**: Switch between probe fleet members

**Touch-Optimized Interface Elements**
- **Virtual D-Pad**: Movement control overlay (optional, can be disabled)
- **Equipment Wheel**: Touch-friendly equipment selection interface
- **Solar Panel Touch Controls**: Direct manipulation of panel orientation
- **Fleet Status Bar**: Swipe-accessible probe status information

### Adaptive Interface Scaling

**Screen Size Adaptations**
- **Large Tablets**: Full desktop-like interface with touch enhancements
- **Standard Tablets**: Simplified interface with essential controls
- **Large Phones**: Condensed interface optimized for portrait/landscape
- **Standard Phones**: Minimal interface focusing on core gameplay

**Touch Accessibility**
- **Large Touch Targets**: Minimum 44px touch targets for all interactive elements
- **Gesture Alternatives**: Alternative input methods for complex gestures
- **Haptic Feedback**: Vibration feedback for important actions (if supported)
- **Voice Control**: Basic voice commands for accessibility (future enhancement)

---

## ♿ Accessibility & Customization

### Control Customization Options

**Key Remapping**
- **Full Remapping**: All keyboard controls can be reassigned
- **Conflict Detection**: Automatic detection and resolution of key binding conflicts
- **Profile Management**: Save and load custom control schemes
- **Quick Reset**: One-click return to default control configuration

**Mouse Sensitivity & Behavior**
- **Pointer Speed**: Adjustable mouse sensitivity (0.1x to 5.0x multiplier)
- **Acceleration**: Optional mouse acceleration curves
- **Click Timing**: Adjustable double-click timing threshold
- **Drag Sensitivity**: Customizable drag distance threshold for drag-and-drop operations

**Control Difficulty Adjustments**
- **Simplified Controls**: Reduced control complexity mode with fewer hotkeys
- **Auto-Assist**: Automatic equipment management and optimization (optional)
- **Extended Timers**: Longer interaction windows for timed actions
- **Confirmation Prompts**: Additional confirmation for potentially destructive actions

### Accessibility Features

**Visual Accessibility**
- **High Contrast**: High contrast mode for better visual distinction
- **Color Alternatives**: Alternative visual indicators for color-dependent feedback
- **Text Scaling**: Scalable text for control tooltips and interface labels
- **Focus Indicators**: Clear visual focus indicators for keyboard navigation

**Motor Accessibility**
- **One-Handed Operation**: Alternative control schemes for single-hand operation
- **Reduced Precision**: Larger interaction targets and more forgiving precision requirements
- **Hold vs. Toggle**: Option to convert hold-to-activate to toggle-based controls
- **Sticky Keys**: Support for sticky key functionality

**Cognitive Accessibility**
- **Control Hints**: Always-visible control reminders (optional)
- **Simplified Interface**: Reduced interface complexity with essential controls only
- **Action Confirmation**: Confirmation prompts for complex or irreversible actions
- **Tutorial Integration**: Built-in control learning and practice modes

### Assistive Technology Support

**Screen Reader Compatibility**
- **Interface Narration**: Screen reader support for interface elements
- **Action Descriptions**: Verbal descriptions of available actions and results
- **Status Updates**: Audio feedback for important game state changes
- **Navigation Aids**: Logical tab order and keyboard navigation paths

**Alternative Input Devices**
- **Switch Control**: Support for external switch controllers
- **Eye Tracking**: Basic eye tracking support for selection (future enhancement)
- **Game Controller**: Standard gamepad support with customizable mappings
- **Specialized Devices**: Framework for specialized accessibility hardware

---

## ⚙️ Technical Implementation

### Input Architecture (Phaser 3)

**Input Manager System**
```typescript
class InputManager {
  private keyboardManager: KeyboardManager;
  private mouseManager: MouseManager;
  private touchManager: TouchManager;
  private accessibility: AccessibilityManager;
  
  constructor(scene: Phaser.Scene) {
    this.setupInputSystems(scene);
    this.loadUserPreferences();
  }
  
  // Unified input state management
  getInputState(): InputState {
    return this.consolidateInputSources();
  }
  
  // Context-aware input handling
  setInputContext(context: InputContext): void {
    this.updateActiveControls(context);
  }
}
```

**Context-Sensitive Input Handling**
```typescript
enum InputContext {
  WORLD_EXPLORATION = "exploration",
  EQUIPMENT_MANAGEMENT = "equipment",
  FLEET_COORDINATION = "fleet",
  SOLAR_MANAGEMENT = "solar",
  MENU_NAVIGATION = "menu"
}

interface InputMapping {
  context: InputContext;
  controls: Map<string, InputAction>;
  priority: number;
  fallthrough: boolean;
}
```

### Performance Optimization

**Input Polling Strategy**
- **60 FPS Input Polling**: Core movement and interaction controls
- **30 FPS Interface Polling**: Menu navigation and non-critical interface updates
- **10 FPS Background Polling**: System hotkeys and accessibility functions
- **Event-Driven Processing**: Mouse clicks, key presses, and touch events

**Memory Management**
- **Input Event Pooling**: Reuse input event objects to minimize garbage collection
- **Efficient Key Mapping**: Optimized data structures for fast key lookup
- **Touch Point Tracking**: Efficient tracking of multi-touch points
- **Gesture Recognition**: Lightweight gesture detection with minimal CPU overhead

### Cross-Platform Compatibility

**Browser Input Handling**
- **Keyboard Event Normalization**: Consistent key codes across browsers
- **Mouse Wheel Standards**: Support for different mouse wheel implementations
- **Touch Event Polyfills**: Compatibility layer for older touch implementations
- **Gamepad API Integration**: Standard gamepad support where available

**Platform-Specific Adaptations**
- **macOS**: Command key support alongside Ctrl key
- **iOS Safari**: Touch event optimization and viewport handling
- **Android Chrome**: Performance optimizations for touch input
- **Desktop PWA**: Native-like control handling in progressive web app mode

---

## 📋 Control Reference & Help System

### In-Game Control Hints

**Contextual Help Display**
- **Dynamic Tooltips**: Show relevant controls based on cursor/selection context
- **Interface Overlays**: Temporary control hints for complex interfaces
- **Progress Hints**: Control suggestions that evolve with player progress
- **Error Recovery**: Helpful control suggestions when players seem stuck

**Help System Integration**
- **Interactive Tutorial**: Learning mode with highlighted controls and guided practice
- **Control Cheat Sheet**: Quick reference overlay (toggled with 'H' key)
- **Video Demonstrations**: Short control demonstration clips (future enhancement)
- **Progressive Disclosure**: Advanced controls revealed as players advance

### Control Documentation

**Player Reference Guide**
- **Quick Start**: Essential controls for immediate gameplay
- **Advanced Techniques**: Power user controls and efficiency shortcuts
- **Accessibility Guide**: Comprehensive accessibility options and alternatives
- **Troubleshooting**: Common control issues and solutions

**Developer Documentation**
- **Control Architecture**: Technical documentation for development team
- **Customization API**: Framework for adding new control schemes
- **Platform Guidelines**: Platform-specific control implementation notes
- **Testing Protocols**: Input testing procedures and validation requirements

---

## 🔧 Development Implementation Plan

### Phase 1: Core Controls (Week 1-2)
- [ ] Basic WASD movement with mouse support
- [ ] Equipment interaction controls (E, Q, R, T keys)
- [ ] Camera controls (mouse pan, zoom, focus)
- [ ] Basic interface navigation (click, drag, keyboard)
- [ ] Equipment Bay drag-and-drop interface

### Phase 2: Advanced Controls (Week 3-4)
- [ ] Multi-probe fleet management hotkeys
- [ ] Equipment preset system (F1-F4, Ctrl+1-4)
- [ ] Advanced equipment management (Tab cycling, Enter/Backspace)
- [ ] Solar panel manipulation controls
- [ ] Context-sensitive help system

### Phase 3: Accessibility & Polish (Week 5-6)
- [ ] Control customization and remapping system
- [ ] Accessibility features and alternative input methods
- [ ] Touch interface preparation and responsive design
- [ ] Performance optimization and input lag minimization
- [ ] Comprehensive testing across different input devices

### Quality Assurance Requirements

**Input Responsiveness Testing**
- [ ] Input lag measurement and optimization (target: <16ms)
- [ ] Accuracy testing for drag-and-drop operations
- [ ] Multi-input device compatibility testing
- [ ] Performance impact assessment for input processing
- [ ] Accessibility compliance validation

**User Experience Validation**
- [ ] Control intuitiveness testing with new players
- [ ] Advanced control efficiency testing with experienced players
- [ ] Accessibility testing with assistive technology users
- [ ] Cross-platform control consistency validation
- [ ] Mobile touch interface usability testing (future)

---

## 🔮 Future Enhancements

### Advanced Input Features
- **Voice Control**: Basic voice commands for accessibility and efficiency
- **Gesture Recognition**: Custom gesture support for touch interfaces
- **Eye Tracking**: Gaze-based selection and navigation (accessibility)
- **Brain-Computer Interface**: Experimental BCI support for advanced accessibility
- **AI Input Assistance**: Smart input prediction and automation options

### Platform Expansion
- **Console Controller Support**: Full gamepad mapping for console-style play
- **VR Controls**: Hand tracking and spatial controls for VR implementation
- **AR Interface**: Augmented reality control schemes for mobile AR
- **Cloud Gaming**: Optimized controls for streaming platforms
- **Smart TV**: Television remote control compatibility

### Community Features
- **Control Sharing**: Community-contributed control schemes and presets
- **Competitive Controls**: Optimized control schemes for speedrunning and challenges
- **Streaming Integration**: Stream-friendly controls with viewer interaction
- **Accessibility Crowdsourcing**: Community-contributed accessibility improvements
- **Cultural Adaptations**: Region-specific control preferences and standards

---

**Document Status**: Ready for Development Implementation  
**Next Review**: Post-Phase 1 Control Implementation  
**Dependencies**: Visual Art & Asset Specification, Audio & Sound Design Document  
**Validation**: Accessibility Expert Review, Platform Compatibility Testing, User Experience Validation
