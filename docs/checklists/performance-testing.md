# Performance Testing Checklist

## Pre-Release Performance Verification

### Test Devices
- [ ] Development machine (specify specs: _________________)
- [ ] Mid-range laptop/desktop (8GB RAM, dedicated graphics)
- [ ] Low-end device (if available)

### Test Scenarios

#### 1. Main Menu Performance
- [ ] Verify 60 FPS on main menu
- [ ] Check memory usage in dev tools (<100MB)
- [ ] Verify smooth UI animations
- [ ] Test menu navigation responsiveness

#### 2. Gameplay Performance
- [ ] Play for 5 minutes continuously
- [ ] Monitor FPS during normal play (target: 55-60 FPS)
- [ ] Check for memory leaks (increasing memory usage)
- [ ] Test with maximum expected game objects:
  - [ ] Multiple probes operating
  - [ ] Manufacturing processes running
  - [ ] Equipment animations active

#### 3. Scene Transitions
- [ ] Test all scene changes (menu ↔ game)
- [ ] Verify smooth transitions (<1 second)
- [ ] No freezing or stuttering during transitions
- [ ] Memory cleanup between scenes

#### 4. Stress Testing
- [ ] Create maximum expected game objects
- [ ] Verify FPS stays above 30 FPS under load
- [ ] Check for crashes during extended play
- [ ] Test with multiple browser tabs open
- [ ] Test with system under load (background apps)

### Performance Thresholds

#### Frame Rate Standards
- ✅ **Pass**: Consistent 55-60 FPS
- ⚠️ **Warning**: 30-55 FPS (investigate causes)
- ❌ **Fail**: Below 30 FPS (must fix before release)

#### Loading Time Standards
- ✅ **Pass**: Initial load <3 seconds
- ⚠️ **Warning**: 3-5 seconds (optimize if possible)
- ❌ **Fail**: >5 seconds (must optimize)

#### Memory Usage Standards
- ✅ **Pass**: <100MB total memory
- ⚠️ **Warning**: 100-200MB (monitor closely)
- ❌ **Fail**: >200MB or increasing memory (memory leak)

### Common Performance Issues to Check

#### Rendering Issues
- [ ] Particle effects causing lag
- [ ] Too many active sprites on screen
- [ ] Large texture atlases loading slowly
- [ ] Unnecessary sprite updates every frame

#### Logic Issues
- [ ] Heavy calculations in update loops
- [ ] Memory leaks from not cleaning up objects
- [ ] Synchronous operations blocking the main thread
- [ ] Unnecessary update loops running

#### Browser-Specific Issues
- [ ] Performance differences between Chrome/Firefox/Safari
- [ ] WebGL context issues
- [ ] Canvas rendering fallbacks

### Performance Monitoring Tools

#### In-Game Tools
- [ ] FPS counter enabled (F3 key)
- [ ] Console performance warnings active
- [ ] Scene transition timing logged

#### Browser Developer Tools
- [ ] Performance tab monitoring
- [ ] Memory tab for leak detection
- [ ] Network tab for asset loading

### Testing Protocol

#### Before Each Test Session
1. [ ] Close all unnecessary browser tabs
2. [ ] Enable FPS counter (F3)
3. [ ] Open browser dev tools
4. [ ] Clear browser cache if testing cold loads

#### During Testing
1. [ ] Record FPS readings every 30 seconds
2. [ ] Note any frame drops or stuttering
3. [ ] Monitor memory usage trends
4. [ ] Test all major game features

#### After Testing
1. [ ] Document any performance issues found
2. [ ] Save performance screenshots/recordings
3. [ ] Note system specifications used
4. [ ] Create bug reports for issues found

### Performance Regression Testing

#### When to Test
- [ ] Before every release
- [ ] After major feature additions
- [ ] After performance optimization changes
- [ ] Weekly during active development

#### Baseline Comparison
- [ ] Compare against previous test results
- [ ] Flag any FPS decreases >5%
- [ ] Track memory usage trends over time
- [ ] Monitor loading time changes

### Sign-off

#### Test Completion
- [ ] All scenarios tested
- [ ] Performance meets standards
- [ ] Issues documented and assigned
- [ ] Testing approved by: ________________
- [ ] Date: ________________

#### Performance Approval
**Tester**: ________________  
**Date**: ________________  
**Average FPS**: ______  
**Memory Usage**: ______MB  
**Load Time**: ______seconds  

**Status**: [ ] ✅ Approved [ ] ⚠️ Conditional [ ] ❌ Rejected

**Notes**: 
_________________________________________________________________
_________________________________________________________________
_________________________________________________________________
