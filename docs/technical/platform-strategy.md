# Platform Strategy Document

**Document Version**: 1.0  
**Last Updated**: 2025-01-21  
**Status**: Active  
**Owner**: Technical Lead  

## Executive Summary

This document formally defines the platform strategy for New Eden Project, establishing desktop PC as the primary and sole target platform for initial development. Mobile and other platform support has been deferred to future phases to ensure focused delivery of a polished desktop experience.

## Platform Decision

### Primary Platform (Phase 1)
- **Target**: Desktop PC Web Browsers
- **Supported Browsers**: Chrome 90+, Firefox 88+, Edge 90+, Safari 14+
- **Operating Systems**: Windows 10/11, macOS 10.15+, Linux (Ubuntu 20.04+)
- **Input Methods**: Keyboard and Mouse only
- **Display**: 1280x720 minimum, up to 4K resolution
- **Deployment**: Web-based (browser)

### Deferred Platforms (Future Phases)
- **Mobile Browsers**: iOS Safari, Chrome Android (Phase 2+)
- **Steam**: Via Electron wrapper (Phase 2+)
- **Native Mobile Apps**: iOS/Android (Phase 3+)
- **Console**: Not currently planned

## Rationale for Desktop-First Strategy

### Technical Benefits
1. **Simplified Development**: Single input paradigm (keyboard/mouse) reduces complexity
2. **Performance Optimization**: Can target consistent hardware capabilities
3. **UI/UX Focus**: Design for precision input without touch compromises
4. **Faster Iteration**: No need for device-specific testing during development

### Business Benefits
1. **Target Audience Alignment**: 95%+ of target players are PC gamers (per business-strategy.md)
2. **Resource Efficiency**: Smaller team can deliver higher quality with focused scope
3. **Market Entry**: Faster time to market with single platform focus
4. **Quality over Quantity**: Better to excel on one platform than be mediocre on many

### Design Benefits
1. **NASA Aesthetic**: Complex mission control interfaces work better on desktop
2. **Information Density**: Can display more data without mobile constraints
3. **Precision Controls**: Equipment swapping and probe control benefit from mouse precision
4. **Keyboard Shortcuts**: Power users can leverage extensive keyboard controls

## Technical Implications

### UI System Architecture
- **Scaling**: Focus on desktop resolutions (1280x720 to 4K)
- **Interaction**: Mouse hover states, right-click context menus
- **Layout**: Fixed aspect ratios, no mobile-responsive breakpoints
- **Performance**: Target 60 FPS consistently, 4ms UI update budget

### Input System Design
- **Primary**: Keyboard shortcuts for all major actions
- **Secondary**: Mouse for selection and drag operations
- **No Touch**: Remove touch gesture handling from initial scope
- **Accessibility**: Focus on keyboard navigation completeness

### Asset Pipeline
- **Textures**: Optimize for desktop GPU memory (2-8GB VRAM)
- **Audio**: Full quality without mobile bandwidth concerns
- **Fonts**: Can use system fonts without mobile embedding concerns

## Migration Path for Future Mobile Support

When mobile support is added in Phase 2+:

1. **Conditional Loading**: Implement platform detection and conditional UI
2. **Touch Input Layer**: Add touch gesture system as separate module
3. **Responsive UI**: Introduce breakpoints and mobile layouts
4. **Performance Tiers**: Create quality settings for mobile devices
5. **Progressive Enhancement**: Desktop remains primary, mobile adapts

## Implementation Guidelines

### Code Architecture
```typescript
// Platform detection (for future use)
export enum Platform {
  DESKTOP = 'desktop',
  MOBILE = 'mobile', // Future
  TABLET = 'tablet'  // Future
}

// Current implementation always returns DESKTOP
export function getCurrentPlatform(): Platform {
  return Platform.DESKTOP;
}
```

### Removed/Deferred Features
- Touch gesture recognition
- Mobile-specific UI layouts
- Touch-friendly button sizing (44px targets)
- Safe area handling
- Portrait orientation support
- Virtual keyboard handling
- Haptic feedback
- Device motion controls

### Desktop-Optimized Features
- Keyboard shortcut system
- Mouse hover states
- Tooltip on hover
- Right-click context menus
- Precise click targets (24px minimum)
- Multi-window support consideration
- Alt+Tab friendly pause behavior

## Documentation Updates Required

1. **Implementation PRD**: Update NFR3 to specify desktop-only support
2. **Input Controls Specification**: Mark touch section as deferred
3. **UI Stories**: Remove mobile-specific acceptance criteria
4. **Architecture Documents**: Update platform assumptions
5. **GDD**: Clarify initial platform scope

## Success Metrics

### Phase 1 (Desktop) Success Criteria
- 60 FPS on mid-range desktop hardware
- <3 second initial load time on broadband
- All features accessible via keyboard
- Zero mobile-specific code in codebase
- 100% feature completeness for desktop

### Future Mobile Readiness
- Clean separation of platform-specific code
- No hard-coded desktop assumptions in core systems
- Modular input system ready for extension
- UI components built with future scaling in mind

## Decision Review

This platform strategy will be reviewed:
- After initial desktop release
- When player metrics show >10% mobile traffic
- If business strategy shifts to mobile-first
- Quarterly as part of technical planning

## Approval

This platform strategy has been approved by:
- Technical Lead: [Signature]
- Product Owner: [Signature]
- Game Designer: [Signature]

---

**Note**: This document supersedes any previous platform assumptions in other documentation. All development should follow this desktop-first strategy until formally revised.