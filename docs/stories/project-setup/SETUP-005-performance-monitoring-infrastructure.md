# Story: Basic Performance Monitoring (MVP)
**ID**: SETUP-005  
**Epic**: Project Setup and Configuration  
**Priority**: Medium  
**Estimated Points**: 1  
**Dependencies**: SETUP-001 (Initial Project Configuration)

## Description

Implement minimal performance monitoring to ensure the game runs at acceptable frame rates during development. This story establishes a simple FPS display and basic performance verification process to catch major performance issues before MVP release.

### Player Experience Goal
Players enjoy smooth gameplay at 60 FPS on target devices. Basic monitoring ensures we catch major performance problems during development.

### Technical Overview
Add a simple FPS counter using Phaser's built-in metrics and establish a manual performance testing checklist for pre-release verification.

## Acceptance Criteria

### Functional Requirements
- [ ] FPS counter displays in development builds
- [ ] Performance testing checklist created
- [ ] Basic performance logging to console

### Technical Requirements
- [ ] Simple FPS display implementation
- [ ] Development-only performance metrics
- [ ] No production overhead

### Game Design Requirements
- [ ] 60 FPS maintained in typical gameplay
- [ ] Smooth scene transitions
- [ ] No visible stuttering or lag

## Technical Specifications

### Architecture Context
A lightweight performance monitoring solution that provides just enough visibility during development without adding complexity or overhead.

### Files to Create/Modify
- `src/utils/SimpleFPSCounter.ts`: Basic FPS display
- `docs/checklists/performance-testing.md`: Manual testing checklist
- `src/config/config.ts`: Add debug flag for FPS display

### Key Classes and Interfaces
```typescript
// src/utils/SimpleFPSCounter.ts
export class SimpleFPSCounter {
    private fpsText: Phaser.GameObjects.Text;
    private isVisible: boolean = false;
    
    constructor(private scene: Phaser.Scene) {
        // Only create in development
        if (import.meta.env.DEV) {
            this.createFPSDisplay();
            this.setupToggleKey();
        }
    }
    
    private createFPSDisplay(): void {
        this.fpsText = this.scene.add.text(10, 10, 'FPS: 0', {
            font: '16px monospace',
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 }
        });
        
        this.fpsText.setScrollFactor(0);
        this.fpsText.setDepth(999999);
        this.fpsText.setVisible(false);
    }
    
    private setupToggleKey(): void {
        // Press F3 to toggle FPS display
        this.scene.input.keyboard.on('keydown-F3', () => {
            this.isVisible = !this.isVisible;
            this.fpsText.setVisible(this.isVisible);
            
            if (this.isVisible) {
                console.log('Performance Monitoring Enabled');
                console.log('Target FPS: 60');
                console.log('Press F3 to hide');
            }
        });
    }
    
    update(): void {
        if (this.isVisible && this.fpsText) {
            const fps = Math.round(this.scene.game.loop.actualFps);
            
            // Update text
            this.fpsText.setText(`FPS: ${fps}`);
            
            // Color code based on performance
            if (fps >= 55) {
                this.fpsText.setColor('#00ff00'); // Green
            } else if (fps >= 30) {
                this.fpsText.setColor('#ffff00'); // Yellow  
            } else {
                this.fpsText.setColor('#ff0000'); // Red
            }
            
            // Log warnings for consistently bad performance
            if (fps < 30) {
                console.warn(`Low FPS detected: ${fps}`);
            }
        }
    }
}

// Usage in scenes
export class GameScene extends Phaser.Scene {
    private fpsCounter?: SimpleFPSCounter;
    
    create() {
        // ... scene setup ...
        
        // Add FPS counter in development
        if (import.meta.env.DEV) {
            this.fpsCounter = new SimpleFPSCounter(this);
        }
    }
    
    update(time: number, delta: number) {
        // ... game logic ...
        
        this.fpsCounter?.update();
    }
}
```

### Integration Points
- **Phaser Game Loop**: Simple update call
- **Development Builds**: Only active in dev mode
- **Manual Testing**: Checklist for pre-release

### Performance Requirements
- Zero impact on production builds
- Minimal overhead in development (<0.1%)
- No external dependencies

## Implementation Tasks

### 1. Create Simple FPS Counter
Build a basic FPS display for development.

**Estimated Time**: 1 hour
**Technical Details**:
- Implement SimpleFPSCounter class
- Use Phaser's built-in actualFps
- Add toggle key (F3) for visibility
- Color coding for performance levels
- Console warnings for low FPS

### 2. Create Performance Testing Checklist
Document manual testing procedures.

**Estimated Time**: 30 minutes
**Technical Details**:
- Create markdown checklist
- Define test scenarios
- List target devices
- Set performance thresholds
- Include common problem areas

### 3. Add Development Logging
Basic performance logging for debugging.

**Estimated Time**: 30 minutes  
**Technical Details**:
- Log scene load times
- Track major performance events
- Add console commands for debugging
- Document usage for team

## Game Design Context

### GDD References
- Performance: 60 FPS target on mid-range hardware
- MVP Scope: Basic functionality first

### Performance Targets
- Desktop: 60 FPS consistent
- Mobile: 30 FPS minimum (if supporting mobile)
- Scene transitions: Under 1 second
- Initial load: Under 5 seconds

## Testing Requirements

### Manual Testing Checklist
```markdown
# Performance Testing Checklist

## Pre-Release Performance Verification

### Test Devices
- [ ] Development machine (specify specs)
- [ ] Mid-range laptop/desktop
- [ ] Low-end device (if available)

### Test Scenarios
1. **Main Menu**
   - [ ] Verify 60 FPS
   - [ ] Check memory usage in dev tools
   
2. **Gameplay**
   - [ ] Play for 5 minutes continuously
   - [ ] Monitor FPS during normal play
   - [ ] Check for memory leaks (increasing memory)
   
3. **Scene Transitions**
   - [ ] Test all scene changes
   - [ ] Verify smooth transitions
   - [ ] No freezing or stuttering

4. **Stress Test**
   - [ ] Create maximum expected game objects
   - [ ] Verify FPS stays above 30
   - [ ] Check for crashes

### Performance Thresholds
- ✅ Pass: Consistent 55-60 FPS
- ⚠️ Warning: 30-55 FPS (investigate)
- ❌ Fail: Below 30 FPS (must fix)

### Common Issues to Check
- [ ] Particle effects causing lag
- [ ] Too many active sprites
- [ ] Memory leaks from not cleaning up
- [ ] Large texture atlases
- [ ] Unnecessary update loops
```

## Dependencies

### Prerequisite Stories
- SETUP-001: Initial Project Configuration (completed)

### NPM Dependencies
None - uses only Phaser's built-in functionality

## Definition of Done

- [ ] FPS counter implemented and working
- [ ] Toggle key (F3) functioning
- [ ] Performance checklist created
- [ ] Basic logging implemented
- [ ] Tested on multiple devices
- [ ] Zero impact on production builds
- [ ] Team knows how to use tools
- [ ] Documentation complete