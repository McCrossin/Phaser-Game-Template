# Performance Tools Guide

**Overview**: Comprehensive performance monitoring, benchmarking, and optimization tools for game development.

## 🎯 Performance Monitoring Suite

The template includes enterprise-grade performance tools typically found only in AAA game development:

- **Real-time FPS Monitoring**: In-game performance counter with F3 toggle
- **Automated Performance Testing**: Playwright-based performance regression detection
- **Memory Usage Tracking**: Heap analysis and memory leak detection
- **Bundle Size Analysis**: Build optimization and asset monitoring
- **Load Time Optimization**: Game startup performance tracking

## 🔧 Tools Overview

### 1. FPS Counter (`src/utils/SimpleFPSCounter.ts`)

**Real-time performance monitoring during development**

```typescript
// Automatic integration in development builds
const fpsCounter = new SimpleFPSCounter(this, {
    x: 10,
    y: 10,
    style: { fontSize: '16px', color: '#00ff00' }
});

// Toggle with F3 key (development only)
// Color-coded: Green (60+), Yellow (30-59), Red (<30)
```

**Features**:
- Zero impact in production builds
- Color-coded performance indicators
- Keyboard toggle (F3) for development
- Configurable positioning and styling

### 2. Performance Test Suite

**Automated regression testing with environment-aware thresholds**

Located in `tests/e2e/performance/game-performance.test.ts`:

```typescript
// Environment-specific thresholds
const PERFORMANCE_THRESHOLDS = {
    minFPS: isCI ? 2 : 5,              // Minimum acceptable FPS
    avgFPS: isCI ? 10 : 25,            // Target average FPS
    maxLoadTime: isCI ? 30000 : 10000, // Maximum load time (ms)
    maxMemoryGrowth: isCI ? 150 : 50,  // Memory growth limit (MB)
    maxMicrofreezes: isCI ? 5 : 2,     // Acceptable frame drops
    maxBundleSize: 2097152             // Bundle size limit (bytes)
};
```

### 3. Performance Check Script

**Build-time performance validation**

Located in `tools/development/performance-check.js`:

```bash
# Validate performance metrics
node tools/development/performance-check.js

# Automated checks:
# - Bundle size analysis
# - Build time monitoring
# - Performance regression detection
```

### 4. Build Performance Monitoring

**Integrated into the build process**

```bash
# Performance-monitored build
npm run build

# Outputs:
# - Bundle size analysis
# - Build time metrics
# - Asset optimization results
# - Performance warnings
```

## 🚀 Running Performance Tests

### Local Development Testing

```bash
# Full performance test suite
npm run test:performance

# Quick performance check
npm run build && node tools/development/performance-check.js

# Interactive performance analysis
npx playwright test --project=performance --headed
```

### CI/CD Integration

Performance tests run automatically:
- **Pull Requests**: Regression detection on every PR
- **Main Branch**: Baseline updates and trend tracking
- **Scheduled**: Weekly performance health checks

### Manual Performance Analysis

```bash
# Start development server with performance monitoring
npm run dev

# Open browser and press F3 to toggle FPS counter
# Monitor real-time performance during development
```

## 📊 Performance Baselines

### Target Performance Standards

| Environment | Min FPS | Avg FPS | Load Time | Memory | Bundle Size |
|-------------|---------|---------|-----------|---------|-------------|
| **Production** | 55 | 60 | <3s | <128MB | <2MB |
| **Development** | 30 | 55 | <1s | <256MB | N/A |
| **CI Environment** | 2 | 10 | <30s | <512MB | <2MB |

### Performance Categories

**🟢 Excellent (90-100%)**:
- Consistent 60 FPS
- Sub-second load times
- Minimal memory usage
- No frame drops

**🟡 Good (70-89%)**:
- 30-59 FPS average
- 1-3 second load times
- Moderate memory usage
- Occasional frame drops

**🔴 Needs Improvement (<70%)**:
- Below 30 FPS
- Long load times (>3s)
- High memory usage
- Frequent frame drops

## 🔍 Performance Monitoring Configuration

### Environment-Aware Thresholds

The system automatically adjusts expectations based on environment:

```typescript
// Automatic environment detection
const isCI = process.env.CI === 'true';
const isProduction = process.env.NODE_ENV === 'production';

// Adaptive performance expectations
const getPerformanceThresholds = () => {
    if (isCI) return CI_THRESHOLDS;
    if (isProduction) return PRODUCTION_THRESHOLDS;
    return DEVELOPMENT_THRESHOLDS;
};
```

### Custom Threshold Configuration

Update thresholds in `tests/e2e/performance/game-performance.test.ts`:

```typescript
// Customize for your game type
const CUSTOM_THRESHOLDS = {
    minFPS: 30,        // Lower for complex simulations
    avgFPS: 45,        // Adjusted for 3D games
    maxLoadTime: 15000, // Higher for large worlds
    maxMemoryGrowth: 100, // Adjusted for asset-heavy games
    maxMicrofreezes: 3,   // Acceptable for complex scenes
};
```

## 📈 Performance Analysis Tools

### Browser Developer Tools Integration

**Performance Tab Analysis**:
```bash
# Start performance profiling session
1. Open DevTools (F12)
2. Navigate to Performance tab
3. Start recording
4. Interact with game
5. Stop recording and analyze
```

**Memory Tab Analysis**:
```bash
# Memory leak detection
1. Open DevTools Memory tab
2. Take heap snapshot
3. Interact with game
4. Take another snapshot
5. Compare for memory leaks
```

### Automated Performance Reports

**Playwright HTML Reports**:
```bash
# Generate interactive performance report
npm run test:performance
npx playwright show-report

# Features:
# - Interactive performance graphs
# - Frame rate analysis
# - Memory usage charts
# - Load time breakdowns
```

### Performance Metrics Tracking

**Built-in Metrics Collection**:
- Frame rate sampling (real-time)
- Memory usage monitoring
- Load time measurement
- Bundle size analysis
- Asset loading performance

## 🛠️ Optimization Recommendations

### FPS Optimization

**Common Techniques**:
1. **Sprite Batching**: Use texture atlases
2. **Object Pooling**: Reuse game objects
3. **LOD Systems**: Level-of-detail for complex scenes
4. **Culling**: Don't render off-screen objects

**Implementation Example**:
```typescript
// Object pooling for bullets
class BulletPool {
    private pool: Bullet[] = [];
    
    get(): Bullet {
        return this.pool.pop() || new Bullet();
    }
    
    release(bullet: Bullet): void {
        bullet.reset();
        this.pool.push(bullet);
    }
}
```

### Memory Optimization

**Best Practices**:
1. **Asset Management**: Load/unload assets per scene
2. **Texture Compression**: Use appropriate formats
3. **Audio Optimization**: Compressed audio formats
4. **Code Splitting**: Dynamic imports for large features

### Load Time Optimization

**Strategies**:
1. **Asset Preloading**: Critical assets first
2. **Code Splitting**: Load features on demand
3. **Asset Compression**: Optimized images and audio
4. **Caching Strategy**: Browser cache optimization

## 🚨 Performance Alerts and Monitoring

### Automated Alerts

The system alerts when:
- FPS drops below target thresholds
- Memory usage exceeds limits
- Load times increase significantly
- Bundle size grows unexpectedly

### Performance Regression Detection

**Automatic Detection**:
- 5-10% decrease: Investigation recommended
- 10-20% decrease: Fix required
- 20%+ decrease: Blocks release

**Manual Review Triggers**:
- New asset additions
- Major code changes
- Third-party dependency updates
- Engine version updates

## 🔧 Troubleshooting Performance Issues

### Common Issues and Solutions

#### Low FPS in Development
**Symptoms**: FPS counter shows low performance
**Solutions**:
- Check browser DevTools for performance bottlenecks
- Verify development server performance
- Test in production build
- Profile with browser performance tools

#### Performance Test Failures in CI
**Symptoms**: Tests pass locally but fail in CI
**Solution**: Environment-aware thresholds are already configured
- CI uses lower thresholds due to shared resources
- Focus on trend analysis rather than absolute values

#### Memory Leaks
**Symptoms**: Increasing memory usage over time
**Solutions**:
- Use browser Memory tab for heap analysis
- Check for retained object references
- Verify proper cleanup in scene transitions
- Review event listener management

#### Bundle Size Increases
**Symptoms**: Build warnings about large chunks
**Solutions**:
- Analyze bundle with webpack-bundle-analyzer
- Implement code splitting for large dependencies
- Remove unused dependencies
- Optimize asset sizes

## 🏆 Performance Best Practices

### Development Workflow

1. **Continuous Monitoring**: Keep FPS counter visible during development
2. **Performance Testing**: Run performance tests before committing
3. **Profile Regularly**: Use browser tools for deep analysis
4. **Baseline Tracking**: Monitor performance trends over time

### Game-Specific Optimization

1. **Scene Management**: Optimize scene transitions
2. **Asset Strategy**: Implement smart asset loading
3. **Update Loops**: Efficient game loop design
4. **Physics Optimization**: Optimize collision detection

### Team Collaboration

1. **Performance Culture**: Make performance everyone's responsibility
2. **Regular Reviews**: Weekly performance check-ins
3. **Knowledge Sharing**: Document optimization techniques
4. **Tool Training**: Ensure team knows performance tools

---

**Last Updated**: July 21, 2025  
**Story**: TEMP-006 Health Monitoring & CI/CD Preservation  
**Status**: ✅ Complete
