# Story: Main Menu Implementation
**ID**: UI-002  
**Epic**: Core UI Foundation & Components  
**Priority**: High  
**Estimated Points**: 5  
**Dependencies**: UI-001

## Description

Implement the main menu system for New Eden Project with a NASA-inspired "Mission Control Interface" theme. The menu will feature live hibernation ship telemetry, journey progress visualization, and mission-focused navigation options. This creates the first impression for players and establishes the game's scientific exploration tone.

### Player Experience Goal
Players are immediately immersed in their role as a mission coordinator preparing robotic probes for humanity's future. The menu conveys the epic scale of the generation ship journey while making it clear that the player has time to build something lasting without pressure.

### Technical Overview
Build a dynamic main menu scene using the UI system architecture, featuring animated background elements, responsive menu options, and smooth transitions. The implementation will include save game detection, settings management, and proper scene transitions to gameplay or other menu screens.

## Acceptance Criteria

### Functional Requirements
- [ ] Main menu loads as the default scene after boot
- [ ] "Initiate New Mission" starts world generation flow
- [ ] "Resume Operations" shows available save games with thumbnails
- [ ] "Mission Archives" displays achievements and completed worlds
- [ ] "Training Protocols" launches tutorial system
- [ ] "Communication Log" opens settings menu
- [ ] Background shows animated hibernation ship journey

### Technical Requirements
- [ ] Menu uses UI component system from UI-001
- [ ] All buttons have hover, pressed, and disabled states
- [ ] Menu options animate in sequence on load
- [ ] Save game detection works with thumbnail generation
- [ ] Settings persist between sessions
- [ ] Smooth transitions between menu sections

### Game Design Requirements
- [ ] NASA mission control aesthetic with technical readouts
- [ ] Hibernation ship journey progress (12.7% complete)
- [ ] Periodic table widget showing discovered elements
- [ ] Ambient space sounds with ship status audio
- [ ] Professional, scientific visual theme

## Technical Specifications

### Architecture Context
The main menu is a dedicated Phaser scene that serves as the game's entry point. It utilizes the UI system for consistent component behavior and integrates with the save system to detect existing games. The menu manages transitions to all other major game scenes.

### Files to Create/Modify
- `src/scenes/menu/MenuScene.ts`: Main menu scene implementation
- `src/scenes/menu/components/MenuButton.ts`: Specialized menu button
- `src/scenes/menu/components/ShipTelemetry.ts`: Background telemetry display
- `src/scenes/menu/components/PeriodicTableWidget.ts`: Element discovery tracker
- `src/scenes/menu/components/SaveGameList.ts`: Save game selection UI
- `src/scenes/menu/effects/StarfieldBackground.ts`: Animated space background
- `src/systems/menu/MenuTransitions.ts`: Scene transition effects
- `src/config/MenuConfig.ts`: Menu-specific configuration
- `src/data/MenuText.ts`: Localized menu strings
- `assets/audio/menu/`: Menu sound effects and ambience

### Key Classes and Interfaces
```typescript
// src/scenes/menu/MenuScene.ts
export class MenuScene extends Phaser.Scene {
    private uiManager: UIManager;
    private menuButtons: Map<string, MenuButton> = new Map();
    private telemetryDisplay: ShipTelemetry;
    private starfield: StarfieldBackground;
    private audioManager: AudioManager;
    
    constructor() {
        super({ key: 'MenuScene' });
    }
    
    preload(): void {
        // Load menu assets
    }
    
    create(): void {
        this.setupBackground();
        this.createMenuOptions();
        this.setupTelemetryDisplay();
        this.playAmbientAudio();
        this.animateMenuEntry();
    }
    
    private setupBackground(): void {
        this.starfield = new StarfieldBackground(this);
        this.starfield.startAnimation();
    }
    
    private createMenuOptions(): void {
        const menuOptions = [
            { key: 'new', text: 'INITIATE NEW MISSION', action: this.startNewGame },
            { key: 'resume', text: 'RESUME OPERATIONS', action: this.showSaveGames },
            { key: 'archives', text: 'MISSION ARCHIVES', action: this.showAchievements },
            { key: 'training', text: 'TRAINING PROTOCOLS', action: this.startTutorial },
            { key: 'comms', text: 'COMMUNICATION LOG', action: this.openSettings }
        ];
        
        menuOptions.forEach((option, index) => {
            const button = new MenuButton(this, {
                x: 960,
                y: 400 + (index * 100),
                text: option.text,
                onClick: option.action.bind(this)
            });
            
            this.menuButtons.set(option.key, button);
        });
    }
}

// src/scenes/menu/components/ShipTelemetry.ts
export class ShipTelemetry extends BaseUIComponent {
    private journeyProgress: number = 0.127; // 12.7%
    private yearsElapsed: number = 27.4;
    private population: number = 1200000;
    private statusText: Phaser.GameObjects.Text;
    private progressBar: ProgressBar;
    
    protected setupComponent(): void {
        this.createTelemetryDisplay();
        this.startTelemetryUpdates();
    }
    
    private createTelemetryDisplay(): void {
        // Create status panels with mission data
        const panel = new Panel(this.scene, {
            x: 0,
            y: 0,
            width: 400,
            height: 200,
            style: 'telemetry'
        });
        
        this.add(panel);
        
        // Add journey progress bar
        this.progressBar = new ProgressBar(this.scene, {
            x: 20,
            y: 50,
            width: 360,
            height: 20,
            value: this.journeyProgress
        });
        
        this.add(this.progressBar);
    }
    
    private startTelemetryUpdates(): void {
        // Simulate live telemetry with subtle animations
        this.scene.time.addEvent({
            delay: 5000,
            loop: true,
            callback: this.updateTelemetry,
            callbackScope: this
        });
    }
}

// src/scenes/menu/components/PeriodicTableWidget.ts
export class PeriodicTableWidget extends BaseUIComponent {
    private elements: Map<string, ElementCell> = new Map();
    private discoveredElements: Set<string> = new Set();
    
    protected setupComponent(): void {
        this.loadDiscoveredElements();
        this.createPeriodicTable();
    }
    
    private createPeriodicTable(): void {
        // Create mini periodic table with discovered elements highlighted
        PERIODIC_TABLE_DATA.forEach((element, index) => {
            const cell = new ElementCell(this.scene, {
                x: (index % 18) * 25,
                y: Math.floor(index / 18) * 25,
                symbol: element.symbol,
                discovered: this.discoveredElements.has(element.symbol)
            });
            
            this.elements.set(element.symbol, cell);
            this.add(cell);
        });
    }
}

// src/config/MenuConfig.ts
export const MENU_CONFIG = {
    ANIMATION: {
        BUTTON_STAGGER: 100, // ms between button animations
        FADE_DURATION: 500,
        SLIDE_DISTANCE: 50,
        TELEMETRY_UPDATE_RATE: 5000
    },
    AUDIO: {
        AMBIENT_VOLUME: 0.3,
        BUTTON_HOVER_VOLUME: 0.2,
        BUTTON_CLICK_VOLUME: 0.4
    },
    TELEMETRY: {
        SHIP_NAME: 'EDEN-7',
        JOURNEY_START_YEAR: 2157,
        TOTAL_JOURNEY_TIME: 215.7, // years
        UPDATE_VARIANCE: 0.001 // slight randomness in readings
    }
};
```

### Integration Points
- **Save System**: Detect and display available save games
- **Settings System**: Load and apply user preferences
- **Audio System**: Ambient sounds and UI feedback
- **Scene Manager**: Smooth transitions to game scenes
- **Achievement System**: Display player progress

### Performance Requirements
- Menu loads in <1 second after boot scene
- Smooth 60 FPS with all animations running
- Save game thumbnails load asynchronously
- Memory usage <50MB for entire menu
- Transition to game scene <2 seconds

## Implementation Tasks

### 1. Create Menu Scene Structure
Set up the basic menu scene with proper lifecycle.

**Estimated Time**: 3 hours
**Technical Details**:
- Extend Phaser.Scene with MenuScene class
- Implement preload for menu-specific assets
- Set up create method with UI manager integration
- Configure scene registry and transitions

### 2. Implement Background Effects
Create the animated space background with ship telemetry.

**Estimated Time**: 4 hours
**Technical Details**:
- Build parallax starfield with multiple layers
- Implement ship telemetry display with live updates
- Add subtle particle effects for ambience
- Ensure performance with effect pooling

### 3. Create Menu Navigation
Build the main menu options with proper interactions.

**Estimated Time**: 4 hours
**Technical Details**:
- Implement MenuButton extending base Button
- Add staggered animation for button entry
- Connect buttons to appropriate actions
- Handle keyboard navigation between options

### 4. Build Save Game UI
Create the save game detection and display system.

**Estimated Time**: 3 hours
**Technical Details**:
- Query save system for available games
- Generate or load save game thumbnails
- Create scrollable list for multiple saves
- Add delete confirmation dialog

### 5. Implement Periodic Table Widget
Build the element discovery visualization.

**Estimated Time**: 3 hours
**Technical Details**:
- Create compact periodic table layout
- Load discovered elements from save data
- Add hover tooltips with element info
- Animate newly discovered elements

### 6. Add Audio and Polish
Implement ambient audio and final visual polish.

**Estimated Time**: 2 hours
**Technical Details**:
- Set up ambient space audio loop
- Add UI sound effects for interactions
- Implement fade in/out for scene transitions
- Fine-tune animations and timing

## Game Design Context

### GDD References
- Main Menu Design: Mission Control Interface specification
- Audio Design: Ambient space sounds with ship updates
- Visual Theme: NASA-inspired technical aesthetic
- Player Motivation: Generation ship narrative framing

### Balance Parameters
```typescript
const MENU_BALANCE = {
    SAVE_SLOTS: 10,
    THUMBNAIL_SIZE: { width: 320, height: 180 },
    MAX_ACHIEVEMENTS_SHOWN: 12,
    ELEMENT_DISCOVERY_ANIMATION_TIME: 2000, // ms
    SHIP_STATUS_MESSAGES: [
        "All systems nominal",
        "Cryogenic chambers stable",
        "Course correction successful",
        "Life support optimal"
    ]
};
```

### Visual/Audio Requirements
- **Background Music**: Ambient space theme (60-90 seconds, looping)
- **Sound Effects**: Button hover, click, transition whoosh
- **Fonts**: Technical mono-spaced for telemetry, clean sans-serif for buttons
- **Visual Effects**: Glowing buttons, particle stars, animated progress bars

## Testing Requirements

### Unit Tests
- `tests/menu/MenuScene.test.ts`: Scene lifecycle and transitions
- `tests/menu/SaveGameList.test.ts`: Save detection and display
- `tests/menu/ShipTelemetry.test.ts`: Telemetry updates and display

### Integration Tests
- `Scene Transitions`: All menu options lead to correct scenes
- `Save System`: Save games properly detected and loaded
- `Settings Application`: Audio/visual settings apply immediately
- `Keyboard Navigation`: Full menu navigation without mouse

### Performance Tests
- `Load Time`: Menu ready in <1 second
- `Animation Performance`: 60 FPS with all effects
- `Memory Management`: Stable memory during extended use

### Gameplay Testing
- [ ] First-time experience feels polished and welcoming
- [ ] Save games are clearly displayed with relevant info
- [ ] Navigation is intuitive with all input methods
- [ ] Audio creates appropriate atmosphere
- [ ] Transitions feel smooth and purposeful

## Dependencies

### Prerequisite Stories
- UI-001: Base UI system must be implemented

### System Dependencies
- UI System: Component architecture from UI-001
- Save System: Basic save/load functionality
- Audio System: Background music and effects support

### Asset Dependencies
- Menu Background Music: Space ambience track
- UI Sound Effects: Hover, click, transition sounds
- Font Files: Technical and UI fonts
- Ship Journey Data: Narrative text for telemetry

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