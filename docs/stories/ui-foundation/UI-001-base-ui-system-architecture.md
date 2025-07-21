# Story: Base UI System Architecture
**ID**: UI-001  
**Epic**: Core UI Foundation & Components  
**Priority**: High  
**Estimated Points**: 5  
**Dependencies**: SETUP-001

## Description

Establish the foundational UI system architecture for New Eden Project, including a responsive scaling system, base UI component classes, event handling, and desktop-focused interaction support. This story creates the reusable UI framework that all game interfaces will build upon, ensuring consistent behavior and appearance across the game with scalable HUD elements for windowed and fullscreen modes.

### Player Experience Goal
Players will experience a polished, responsive interface that scales seamlessly across different desktop resolutions and window modes (windowed, fullscreen). The UI will feel intuitive and reactive, with smooth animations and clear visual feedback for all interactions using mouse and keyboard.

### Technical Overview
Implement a component-based UI system built on Phaser 3's GameObject system, with custom base classes for common UI elements. The system will handle responsive scaling from the base 1920x1080 resolution, support mouse and keyboard input with appropriate interaction areas, and provide a consistent event system for UI interactions. HUD elements must scale appropriately when transitioning between windowed and fullscreen modes.

## Acceptance Criteria

### Functional Requirements
- [ ] UI scales correctly maintaining aspect ratio across desktop resolutions (up to 4K)
- [ ] HUD elements scale appropriately in windowed and fullscreen modes
- [ ] Keyboard navigation works with Tab/Shift+Tab and Enter/Space for activation
- [ ] UI elements provide visual feedback for hover, press, and disabled states
- [ ] Z-order management keeps UI elements above game elements

### Technical Requirements
- [ ] Base UI component class with lifecycle management
- [ ] Event system for UI interactions (click, hover, focus)
- [ ] Responsive scaling utilities for different desktop resolutions and window modes
- [ ] Mouse interaction support with hover states
- [ ] Keyboard focus management system
- [ ] UI animation/tween utilities

### Game Design Requirements
- [ ] NASA-inspired aesthetic with clean, technical appearance
- [ ] Consistent color scheme: primary (#00D4FF), secondary (#FF6B35), background (#0A0E27)
- [ ] Smooth transitions (200-300ms) for state changes
- [ ] Accessibility: high contrast ratios, clear focus indicators

## Technical Specifications

### Architecture Context
The UI system sits as a layer above the game world, managing all player interface elements. It integrates with Phaser's scene system but maintains its own component hierarchy for easier management. All UI components extend from base classes that handle common functionality like scaling, input, and lifecycle.

### Files to Create/Modify
- `src/systems/ui/UIManager.ts`: Central UI management system
- `src/systems/ui/components/BaseUIComponent.ts`: Base class for all UI elements
- `src/systems/ui/components/Button.ts`: Reusable button component
- `src/systems/ui/components/Panel.ts`: Container panel component
- `src/systems/ui/components/Label.ts`: Text label component
- `src/systems/ui/components/ProgressBar.ts`: Progress/loading bar component
- `src/systems/ui/utils/ScaleManager.ts`: Responsive scaling utilities
- `src/systems/ui/utils/InputManager.ts`: UI-specific input handling
- `src/systems/ui/utils/AnimationManager.ts`: UI animation utilities
- `src/types/UITypes.ts`: TypeScript interfaces for UI system
- `src/config/UIConfig.ts`: UI configuration constants
- `src/config/UITheme.ts`: Visual theme configuration

### Key Classes and Interfaces
```typescript
// src/types/UITypes.ts
export interface UIComponentConfig {
    x: number;
    y: number;
    width?: number;
    height?: number;
    anchor?: { x: number; y: number };
    scale?: number;
    interactive?: boolean;
    visible?: boolean;
}

export interface UITheme {
    colors: {
        primary: string;
        secondary: string;
        background: string;
        text: string;
        disabled: string;
        hover: string;
        active: string;
    };
    fonts: {
        default: string;
        heading: string;
        mono: string;
    };
    animations: {
        duration: number;
        easing: string;
    };
}

// src/systems/ui/components/BaseUIComponent.ts
export abstract class BaseUIComponent extends Phaser.GameObjects.Container {
    protected config: UIComponentConfig;
    protected isInteractive: boolean = false;
    protected isFocused: boolean = false;
    protected isDisabled: boolean = false;
    
    constructor(scene: Phaser.Scene, config: UIComponentConfig) {
        super(scene, config.x, config.y);
        this.config = config;
        this.setupComponent();
    }
    
    protected abstract setupComponent(): void;
    
    public setInteractive(hitArea?: Phaser.Geom.Rectangle): this {
        // Implementation
        return this;
    }
    
    public focus(): void {
        this.isFocused = true;
        this.onFocusChanged(true);
    }
    
    public blur(): void {
        this.isFocused = false;
        this.onFocusChanged(false);
    }
    
    protected abstract onFocusChanged(focused: boolean): void;
    
    public enable(): void {
        this.isDisabled = false;
        this.alpha = 1;
    }
    
    public disable(): void {
        this.isDisabled = true;
        this.alpha = 0.5;
    }
}

// src/systems/ui/UIManager.ts
export class UIManager {
    private static instance: UIManager;
    private scene: Phaser.Scene;
    private components: Map<string, BaseUIComponent> = new Map();
    private focusedComponent: BaseUIComponent | null = null;
    
    static getInstance(scene?: Phaser.Scene): UIManager {
        if (!UIManager.instance) {
            if (!scene) throw new Error('Scene required for first initialization');
            UIManager.instance = new UIManager(scene);
        }
        return UIManager.instance;
    }
    
    registerComponent(id: string, component: BaseUIComponent): void {
        this.components.set(id, component);
    }
    
    handleKeyboardNavigation(keyCode: number): void {
        // Tab navigation implementation
    }
    
    setFocus(component: BaseUIComponent): void {
        if (this.focusedComponent) {
            this.focusedComponent.blur();
        }
        this.focusedComponent = component;
        component.focus();
    }
}

// src/systems/ui/components/Button.ts
export class Button extends BaseUIComponent {
    private background: Phaser.GameObjects.Rectangle;
    private text: Phaser.GameObjects.Text;
    private clickCallback?: () => void;
    
    constructor(scene: Phaser.Scene, config: ButtonConfig) {
        super(scene, config);
    }
    
    protected setupComponent(): void {
        // Create background and text
        // Set up interaction events
    }
    
    public onClick(callback: () => void): this {
        this.clickCallback = callback;
        return this;
    }
    
    protected onFocusChanged(focused: boolean): void {
        // Visual feedback for focus state
    }
}
```

### Integration Points
- **Scene System**: UI components integrate with Phaser scenes
- **Input System**: Coordinates with game input for UI priority
- **Audio System**: UI sound effects for interactions
- **Save System**: UI state persistence for settings

### Performance Requirements
- UI updates consume <4ms per frame
- Mouse click response time <50ms
- Animation frame rate maintains 60 FPS
- Memory footprint <10MB for UI system
- Z-sorting optimized for <100 UI elements

## Implementation Tasks

### 1. Create Base UI Architecture
Establish the core UI system structure and base classes.

**Estimated Time**: 4 hours
**Technical Details**:
- Implement UIManager singleton with component registry
- Create BaseUIComponent with lifecycle methods
- Set up UI scene layering with proper z-order
- Implement basic event propagation system

### 2. Implement Responsive Scaling
Create utilities for handling different screen sizes and resolutions.

**Estimated Time**: 3 hours
**Technical Details**:
- Implement ScaleManager with breakpoint support
- Create responsive positioning utilities
- Handle window mode transitions (windowed to fullscreen)
- Test scaling from 1280x720 to 4K resolutions
- Ensure HUD elements maintain readability at all scales

### 3. Build Core UI Components
Implement the essential reusable UI components.

**Estimated Time**: 6 hours
**Technical Details**:
- Create Button component with states (normal, hover, pressed, disabled)
- Implement Panel container with layout support
- Build Label component with text styling
- Create ProgressBar with animation support

### 4. Implement Input Handling
Set up comprehensive input support for all platforms.

**Estimated Time**: 4 hours
**Technical Details**:
- Implement advanced mouse interaction (hover states, right-click context)
- Create keyboard navigation system
- Add gamepad support foundation
- Ensure proper input priority over game elements

### 5. Create Animation System
Build utilities for smooth UI animations and transitions.

**Estimated Time**: 3 hours
**Technical Details**:
- Implement tween utilities for common animations
- Create easing functions for natural motion
- Build transition system for scene changes
- Add particle effect support for UI feedback

### 6. Establish Theme System
Create a flexible theming system for consistent visuals.

**Estimated Time**: 2 hours
**Technical Details**:
- Define theme configuration structure
- Implement theme application to components
- Create NASA-inspired default theme
- Add theme switching capability

## Game Design Context

### GDD References
- UI/UX Design: NASA-inspired mission control aesthetic
- Accessibility: Support for colorblind modes and screen readers
- Platform Support: Desktop-focused design with window/fullscreen scaling

### Balance Parameters
```typescript
const UI_CONFIG = {
    CLICK_TARGET_MIN_SIZE: 24, // pixels for desktop precision
    DOUBLE_CLICK_THRESHOLD: 300, // ms
    HOVER_DELAY: 50, // ms before showing hover state
    ANIMATION_DURATION: 250, // ms
    TOOLTIP_DELAY: 1000, // ms
    FOCUS_OUTLINE_WIDTH: 3, // pixels
    HUD_SCALE_MIN: 0.75, // minimum HUD scale in windowed mode
    HUD_SCALE_MAX: 1.25, // maximum HUD scale for large displays
};
```

### Visual/Audio Requirements
- **Fonts**: NASA-inspired technical fonts (fallback to system monospace)
- **Sound Effects**: Subtle click, hover, and transition sounds
- **Visual Effects**: Glow effects for focused elements, smooth transitions

## Testing Requirements

### Unit Tests
- `tests/ui/BaseUIComponent.test.ts`: Component lifecycle and state management
- `tests/ui/UIManager.test.ts`: Component registration and focus management
- `tests/ui/ScaleManager.test.ts`: Responsive scaling calculations
- `tests/ui/InputManager.test.ts`: Input event handling

### Integration Tests
- `Mouse Interaction`: Hover states and click areas work correctly
- `Keyboard Navigation`: Tab order and activation work properly
- `Screen Scaling`: UI maintains proportions across resolutions
- `State Persistence`: UI state saves and restores correctly

### Performance Tests
- `Frame Time Impact`: UI updates stay under 4ms
- `Memory Usage`: Component pooling keeps memory stable
- `Animation Performance`: 60 FPS during transitions

### Gameplay Testing
- [ ] UI elements respond immediately to mouse and keyboard input
- [ ] HUD scales appropriately between windowed and fullscreen modes
- [ ] Keyboard navigation is intuitive and complete
- [ ] Visual feedback is clear for all interactions
- [ ] UI remains responsive during gameplay

## Dependencies

### Prerequisite Stories
- SETUP-001: Project setup must be complete

### System Dependencies
- Phaser 3.70+: GameObject and Scene systems
- TypeScript: Type safety for UI components

### Asset Dependencies
- UI Sound Effects: Click, hover, transition sounds (placeholder ok)
- Font Files: NASA-inspired fonts (system fallback ok)

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Code follows TypeScript strict mode standards
- [ ] Unit test coverage >80% for new code
- [ ] Integration tests passing
- [ ] Performance targets met (60 FPS maintained)
- [ ] Code review completed
- [ ] Documentation updated
- [ ] No console errors or warnings
- [ ] Feature works on all target platforms
- [ ] Save/load compatibility maintained