# Story: Performance Testing Pipeline Troubleshooting

**ID**: TRBL-005  
**Epic**: Production Troubleshooting  
**Priority**: High  
**Estimated Points**: 3  
**Dependencies**: None  
**Type**: Production Troubleshooting Story

## 🚨 CRITICAL PRODUCTION TROUBLESHOOTING STORY NOTICE

**🔒 THIS IS A PRODUCTION TROUBLESHOOTING STORY - NEVER EDIT 🔒**

This story is designed for **REPEATED USE** across game projects when performance testing fails or performance benchmarks are not met. Follow the procedures exactly as written.

**⚠️ CRITICAL RULE**: If you're troubleshooting a feature implementation that caused performance issues:

1. Use THIS story for systematic debugging procedures
2. Reference the ORIGINAL feature implementation story for context
3. Make ALL fixes and updates in the ORIGINAL feature story - NEVER edit this troubleshooting story
4. Keep this story clean and unchanged for future troubleshooting sessions

## Description

Systematic troubleshooting procedure for performance testing failures in game projects. This includes FPS drops, memory leaks, bundle size increases, and performance benchmark failures.

### Player Experience Goal

Maintain 60 FPS gameplay experience across all target platforms and ensure optimal game performance.

### Technical Overview

Diagnose and resolve performance regressions using automated testing tools, profiling, and performance monitoring systems.

## Acceptance Criteria

### Functional Requirements

- [ ] Performance tests identify specific performance bottlenecks
- [ ] FPS maintains 60 FPS target in all test scenarios
- [ ] Memory usage stays within defined thresholds
- [ ] Bundle size remains optimized
- [ ] Performance monitoring pipeline returns to passing state

### Technical Requirements

- [ ] Performance test suite executes without errors
- [ ] All performance metrics meet defined thresholds
- [ ] Memory leaks are identified and resolved
- [ ] Frame rate analysis shows consistent 60 FPS
- [ ] Bundle analysis shows optimal asset loading

### Game Design Requirements

- [ ] Game maintains responsive player controls
- [ ] Visual effects don't impact performance
- [ ] Audio playback remains smooth
- [ ] Scene transitions maintain target FPS

## Technical Specifications

### Architecture Context

Performance testing validates that the game maintains 60 FPS, manages memory efficiently, and loads assets optimally. Performance regressions directly impact player experience.

### Files to Create/Modify

- `tests/e2e/performance.spec.ts`: E2E performance tests
- `tests/e2e/performance/game-performance.test.ts`: Detailed game performance tests
- `scripts/performance-check.ts`: Performance validation script
- `tools/development/performance-check.ts`: Development performance tools
- `config/ci-performance-thresholds.json`: Performance threshold configuration
- `config/monitoring/health-thresholds.json`: Health monitoring thresholds

### Key Classes and Interfaces

```typescript
interface PerformanceMetrics {
    fps: number;
    memoryUsage: number;
    loadTime: number;
    bundleSize: number;
    renderTime: number;
}

interface PerformanceThresholds {
    minFPS: number;
    maxMemoryMB: number;
    maxLoadTimeMs: number;
    maxBundleSizeMB: number;
    maxRenderTimeMs: number;
}

interface PerformanceTestResult {
    metrics: PerformanceMetrics;
    thresholds: PerformanceThresholds;
    passed: boolean;
    failures: string[];
}
```

### Integration Points

- **Phaser 3 Game Engine**: Performance monitoring hooks
- **Browser Performance APIs**: FPS and memory measurement
- **Playwright Testing**: E2E performance automation
- **Vite Build System**: Bundle analysis and optimization
- **GitHub Actions**: Automated performance validation

### Performance Requirements

- Maintain 60 FPS during gameplay
- Memory usage under 512MB on desktop, 256MB on mobile
- Initial load time under 3 seconds
- Bundle size under 10MB
- Frame render time under 16.67ms (60 FPS)

## Implementation Tasks

### 1. Analyze Performance Test Failures

**Estimated Time**: 45 minutes

Review failed performance tests to identify specific metrics that failed thresholds.

**Technical Details**:

```bash
# Check GitHub Actions performance workflow results
# Review performance-results.json for detailed metrics
# Examine performance-monitoring-report.json for trends
# Identify which specific thresholds were exceeded
# Note performance regression patterns

# Run local performance tests
npm run test:performance
npm run performance:check

# Run with detailed profiling
npm run test:e2e -- --project=performance
```

**Failure Analysis**:

- Check performance test results and logs
- Review specific metrics that failed thresholds
- Identify patterns in performance degradation
- Determine if failures are consistent or intermittent

### 2. Reproduce Performance Issues Locally

**Estimated Time**: 1 hour

Run performance tests locally to confirm issues and enable detailed profiling.

**Technical Details**:

```bash
# Run local performance tests
npm run test:performance
npm run performance:check

# Run with detailed profiling
npm run test:e2e -- --project=performance

# Check specific performance scenarios
npm run dev # Run in browser with dev tools open
```

**Local Testing Steps**:

- Start the game in development mode
- Open browser development tools
- Monitor performance metrics during gameplay
- Compare results with expected thresholds

### 3. Profile Game Performance

**Estimated Time**: 1.5 hours

Use browser development tools and profiling to identify performance bottlenecks.

**Technical Details**:

**Browser Profiling**:

```javascript
// Open game in Chrome DevTools
// Use Performance tab to record gameplay
// Identify long tasks and frame drops
// Check Memory tab for memory leaks
// Use Lighthouse for comprehensive analysis
```

**Code Profiling**:

```typescript
// Add performance markers in game code
performance.mark('game-start');
performance.mark('scene-load-start');
// ... game operations
performance.mark('scene-load-end');
performance.measure('scene-load', 'scene-load-start', 'scene-load-end');
```

**Performance Monitoring Integration**:

```typescript
// Monitor game object pools
console.log('Active sprites:', this.children.length);
console.log('Physics bodies:', this.physics.world.bodies.entries.length);

// Check texture cache
console.log('Texture cache size:', this.textures.cache.entries.size);
```

### 4. Analyze Bundle Size and Assets

**Estimated Time**: 45 minutes

Check if bundle size increases or asset loading issues are causing performance problems.

**Technical Details**:

```bash
# Analyze bundle composition
npm run build:analyze

# Check asset manifest
cat assets/processed/asset-manifest.json

# Validate asset optimization
npm run build
ls -la dist/ # Check file sizes
```

**Asset Analysis**:

- Review bundle composition and size changes
- Check asset optimization effectiveness
- Identify large assets impacting load times
- Validate texture packing and compression

### 5. Check Memory Management

**Estimated Time**: 1 hour

Identify and resolve memory leaks or excessive memory usage.

**Technical Details**:

**Memory Leak Detection**:

```typescript
// Monitor game object pools
console.log('Active sprites:', this.children.length);
console.log('Physics bodies:', this.physics.world.bodies.entries.length);

// Check texture cache
console.log('Texture cache size:', this.textures.cache.entries.size);

// Monitor scene lifecycle
scene.events.on('shutdown', () => {
    // Cleanup validation
    console.log('Scene cleanup complete');
});
```

**Memory Optimization**:

```typescript
// Review object pooling implementation
// Check texture and audio cleanup
// Validate event listener removal
// Monitor garbage collection patterns
```

### 6. Optimize Performance Bottlenecks

**Estimated Time**: 2-3 hours

Implement specific optimizations based on profiling results.

**Technical Details**:

**Frame Rate Optimization**:

```typescript
// Optimize render loops
scene.time.addEvent({
    delay: 16, // 60 FPS
    callback: () => {
        // Batch operations
        this.updateGameObjects();
    },
    loop: true
});

// Use object pooling
class BulletPool extends ObjectPool<Bullet> {
    create(): Bullet {
        return new Bullet(this.scene);
    }
}
```

**Asset Loading Optimization**:

```typescript
// Preload critical assets
scene.load.image('critical', 'assets/critical.png');

// Lazy load non-critical assets
scene.load.on('complete', () => {
    this.loadNonCriticalAssets();
});
```

**Memory Management**:

```typescript
// Proper cleanup in scene shutdown
scene.events.on('shutdown', () => {
    this.cleanup();
});

// Remove event listeners
this.events.removeAllListeners();
```

### 7. Validate Performance Fixes

**Estimated Time**: 45 minutes

Verify that optimizations resolve the performance issues.

**Technical Details**:

```bash
# Run full performance test suite
npm run test:performance
npm run performance:check

# Validate in CI environment
git push origin feature/performance-fix
# Monitor CI performance tests

# Test on multiple devices/browsers
npm run test:e2e -- --project=performance
```

**Validation Steps**:

- Run complete performance test suite
- Verify all metrics meet thresholds
- Test across different browsers and devices
- Confirm no performance regression in other areas

## Game Design Context

### GDD References

- **Performance Standards**: 60 FPS target across all game scenarios
- **Platform Requirements**: Desktop and mobile browser optimization
- **Asset Guidelines**: Optimal file sizes and loading strategies

### Balance Parameters

```typescript
const PERFORMANCE_THRESHOLDS = {
    fps: {
        min: 58, // Allow 2 FPS tolerance
        target: 60,
        critical: 45 // Below this is unplayable
    },
    memory: {
        desktop: 512 * 1024 * 1024, // 512MB
        mobile: 256 * 1024 * 1024, // 256MB
        critical: 1024 * 1024 * 1024 // 1GB critical threshold
    },
    loading: {
        initial: 3000, // 3 seconds
        scene: 1000, // 1 second
        asset: 500 // 500ms per asset
    }
};
```

### Visual/Audio Requirements

- **Performance Indicators**: Visual FPS counter for development
- **Loading Feedback**: Performance-optimized loading screens
- **Quality Settings**: Configurable quality for different devices

## Testing Requirements

### Unit Tests

- `tests/unit/systems/performance-monitoring.test.ts`: Performance monitoring system tests
- `tests/unit/optimization/object-pooling.test.ts`: Object pool performance tests
- `tests/helpers/performance-helpers.ts`: Performance testing utilities

### Integration Tests

- **Asset Loading Performance**: Test asset loading times and memory usage
- **Scene Transition Performance**: Validate smooth scene changes
- **Game Loop Performance**: Ensure consistent frame rates during gameplay

### Performance Tests

- **FPS Stability**: Maintain 60 FPS for 30 seconds of gameplay
- **Memory Leak Detection**: Memory usage should not increase over time
- **Bundle Size Validation**: Total bundle under 10MB threshold
- **Load Time Testing**: Initial load under 3 seconds

### Gameplay Testing

- [ ] Game feels responsive during intense action sequences
- [ ] No visible frame drops during particle effects
- [ ] Smooth scrolling and camera movement
- [ ] Audio remains synchronized with visuals
- [ ] Touch controls remain responsive on mobile

## Dependencies

### Prerequisite Stories

- None - This is a standalone troubleshooting procedure

### System Dependencies

- **Phaser 3**: Game engine with performance monitoring
- **Playwright**: E2E testing framework
- **Chrome DevTools**: Browser profiling tools
- **Vite**: Build system with bundle analysis

### Asset Dependencies

- **Performance Test Assets**: Test sprites, audio, and data files
- **Profiling Configuration**: DevTools and monitoring setup
- **Threshold Configuration**: Performance limits in config files

## Definition of Done

- [ ] Performance test failures root cause identified
- [ ] Local performance profiling completed
- [ ] Specific bottlenecks identified and documented
- [ ] Performance optimizations implemented
- [ ] All performance tests pass locally
- [ ] Performance metrics meet or exceed thresholds
- [ ] No performance regression in other areas
- [ ] CI performance pipeline returns to green
- [ ] Performance improvements validated across devices
- [ ] Documentation updated with optimization notes

## Performance Troubleshooting Quick Reference

### Common Performance Issues and Solutions

1. **Frame Rate Drops**

    ```typescript
    // Check for expensive operations in update loops
    // Use object pooling for frequently created/destroyed objects
    // Batch sprite updates and physics calculations
    ```

2. **Memory Leaks**

    ```typescript
    // Ensure proper cleanup in scene shutdown
    scene.events.on('shutdown', () => {
        this.cleanup();
    });

    // Remove event listeners
    this.events.removeAllListeners();
    ```

3. **Large Bundle Size**

    ```bash
    # Check asset optimization
    npm run build:analyze

    # Compress images and audio files
    # Use texture atlases for sprites
    ```

4. **Slow Loading Times**

    ```typescript
    // Implement progressive loading
    // Use compression for assets
    // Optimize critical rendering path
    ```

5. **High Memory Usage**

    ```typescript
    // Monitor texture cache
    this.textures.cache.entries.clear();

    // Use object pooling
    // Implement proper garbage collection
    ```

### Performance Monitoring Commands

```bash
# Run performance test suite
npm run test:performance

# Check current performance metrics
npm run performance:check

# Generate performance report
npm run health:check

# Analyze bundle size
npm run build:analyze

# Run with performance profiling
npm run test:e2e -- --project=performance --debug
```

## 🔒 CRITICAL REMINDER

**NEVER EDIT THIS TROUBLESHOOTING STORY**

This is a production troubleshooting procedure designed for repeated use. If troubleshooting a feature implementation that caused performance issues:

1. ✅ **Use this story** for systematic debugging steps
2. ✅ **Reference the original feature story** for context of what was changed
3. ✅ **Make all fixes in the original feature story** based on findings here
4. ❌ **Never modify this troubleshooting story** - keep it clean for future use

Remember: The goal is to identify performance issues using this systematic approach, then apply fixes in the appropriate implementation stories.
