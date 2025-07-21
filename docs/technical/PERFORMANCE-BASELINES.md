# Performance Baselines & Environment Specifications

## Environment-Specific Performance Targets

This document establishes performance baselines for different development and deployment environments, enabling accurate performance regression detection and environment-appropriate testing.

## Performance Baseline Summary

| Environment | Min FPS | Avg FPS | Target FPS | Build Time | Memory Limit | Load Time |
|-------------|---------|---------|------------|------------|--------------|-----------|
| **Production** | 55 | 60 | 60 | N/A | 128MB | 3 seconds |
| **Local Dev** | 30 | 55 | 60 | 30 seconds | 256MB | 1 second |
| **CI Environment** | 2 | 10 | 15 | 10 minutes | 512MB | 30 seconds |

## Production Environment Baselines

### Target Performance Standards
- **Frame Rate**: Consistent 55-60 FPS during normal gameplay
- **Load Time**: Initial game load under 3 seconds
- **Memory Usage**: Maximum 128MB active memory
- **Scene Transitions**: Under 1 second between scenes
- **Save/Load**: Under 2 seconds for save/load operations

### Device Tier Specifications

#### Tier 1: High-End Devices
- **Target**: 60 FPS constant, all features enabled
- **Specs**: 16GB+ RAM, dedicated GPU, modern CPU
- **Features**: Full visual effects, maximum detail settings

#### Tier 2: Mid-Range Devices  
- **Target**: 55-60 FPS with minor optimizations
- **Specs**: 8GB RAM, integrated graphics, 2-4 year old hardware
- **Features**: Reduced particle effects, medium detail settings

#### Tier 3: Low-End Devices
- **Target**: 30+ FPS with significant optimizations
- **Specs**: 4GB RAM, older integrated graphics, 5+ year old hardware
- **Features**: Minimal visual effects, low detail settings

### Production Performance Monitoring
```typescript
const PRODUCTION_THRESHOLDS = {
    frameRate: {
        target: 60,
        minimum: 55,
        critical: 30
    },
    loadTime: {
        target: 2000,  // 2 seconds
        maximum: 3000, // 3 seconds
        critical: 5000 // 5 seconds
    },
    memory: {
        target: 100,   // 100MB
        maximum: 128,  // 128MB
        critical: 200  // 200MB
    }
};
```

## Local Development Environment Baselines

### Performance Expectations
- **Frame Rate**: 30+ FPS minimum, 55+ FPS target
- **Build Time**: Under 30 seconds for incremental builds
- **Hot Reload**: Under 3 seconds for code changes
- **Test Execution**: Full test suite under 2 minutes

### Development Machine Specifications
**Recommended Minimum**:
- 16GB RAM
- Modern CPU (Intel i5/AMD Ryzen 5 or better)
- Dedicated GPU (optional but recommended)
- SSD storage for project files

**Optimal Configuration**:
- 32GB+ RAM
- High-end CPU (Intel i7/AMD Ryzen 7 or better)
- Dedicated GPU with 4GB+ VRAM
- NVMe SSD storage

### Local Performance Testing
```bash
# Run performance validation
npm run dev
# Press F3 to enable FPS counter
# Verify 30+ FPS in development mode

# Build performance test
npm run build
# Should complete in under 30 seconds

# Test suite performance
npm test
# Should complete in under 2 minutes
```

## CI Environment (GitHub Actions) Baselines

### Environment Constraints
- **Hardware**: 2-core CPU, 7GB RAM, 14GB SSD
- **GPU**: None (software rendering only)
- **Network**: Shared, variable latency
- **Concurrency**: Up to 20 parallel jobs

### Realistic Performance Expectations
```typescript
const CI_THRESHOLDS = {
    frameRate: {
        minimum: 2,    // Bare minimum for functionality test
        target: 10,    // Realistic expectation for CI
        warning: 5     // Below this suggests real problems
    },
    buildTime: {
        target: 300000,   // 5 minutes
        maximum: 600000,  // 10 minutes
        critical: 900000  // 15 minutes (timeout)
    },
    memory: {
        target: 256,   // 256MB
        maximum: 512,  // 512MB
        critical: 1024 // 1GB (GitHub Actions limit)
    },
    loadTime: {
        target: 10000,  // 10 seconds
        maximum: 30000, // 30 seconds
        critical: 60000 // 1 minute
    }
};
```

### CI Performance Test Configuration
```typescript
// tests/e2e/performance/ci-aware-performance.test.ts
const isCI = process.env.CI === 'true';

const PERFORMANCE_THRESHOLDS = {
    minFPS: isCI ? 2 : 5,
    avgFPS: isCI ? 10 : 25,
    maxLoadTime: isCI ? 30000 : 10000,
    maxMemoryGrowth: isCI ? 150 : 50,
    maxMicrofreezes: isCI ? 5 : 2,
};
```

## Performance Regression Detection

### Baseline Update Process
1. **Manual Verification**: Test performance changes locally
2. **Peer Review**: Document performance impact in PRs
3. **Automated Detection**: CI tests flag significant regressions
4. **Baseline Updates**: Update baselines when improvements are intentional

### Regression Thresholds
- **Minor Regression**: 5-10% performance decrease (investigate)
- **Moderate Regression**: 10-20% performance decrease (must fix)
- **Major Regression**: 20%+ performance decrease (blocks release)

### Performance Improvement Tracking
```typescript
interface PerformanceBaseline {
    timestamp: string;
    environment: 'ci' | 'local' | 'production';
    metrics: {
        averageFPS: number;
        minimumFPS: number;
        buildTimeMs: number;
        memoryUsageMB: number;
        loadTimeMs: number;
    };
    gitCommit: string;
    notes: string;
}
```

## Performance Testing Workflow

### Pre-Release Performance Validation
1. **Local Performance Test**: Full checklist on development machine
2. **Multiple Browser Test**: Chrome, Firefox, Safari if available
3. **Device Tier Test**: Test on available devices (minimum Tier 2)
4. **CI Performance Validation**: Automated tests must pass
5. **Production Simulation**: Build and test production bundle locally

### Automated Performance Gates
```yaml
# .github/workflows/performance-gate.yml
name: Performance Gate
on:
  pull_request:
    branches: [main]

jobs:
  performance-test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '22'
      - name: Install dependencies
        run: npm ci
      - name: Build project
        run: npm run build
      - name: Run performance tests
        run: npm run test:performance
      - name: Check performance thresholds
        run: node tools/development/performance-check.js
```

## Performance Optimization Guidelines

### Frame Rate Optimization
- **Object Pooling**: Reuse game objects instead of creating/destroying
- **Update Frequency**: Reduce update frequency for non-critical systems
- **Culling**: Only update/render visible objects
- **Batching**: Group similar operations together

### Memory Optimization
- **Asset Management**: Unload unused assets promptly
- **Garbage Collection**: Minimize object creation in update loops
- **Texture Atlases**: Use texture atlases instead of individual images
- **Audio Management**: Stream audio instead of loading all at once

### Load Time Optimization
- **Code Splitting**: Load only necessary code initially
- **Asset Preloading**: Intelligent preloading of likely-needed assets
- **Compression**: Use gzip/brotli compression for assets
- **CDN Usage**: Use CDN for static asset delivery

## Troubleshooting Performance Issues

### Common Performance Problems

#### Frame Rate Issues
**Symptoms**: FPS below target thresholds
**Investigation**:
1. Check browser developer tools performance tab
2. Look for expensive operations in update loops
3. Monitor object creation/destruction patterns
4. Review texture/asset usage

#### Memory Leaks
**Symptoms**: Increasing memory usage over time
**Investigation**:
1. Use browser memory profiler
2. Check for unreferenced object cleanup
3. Verify event listener removal
4. Review asset disposal patterns

#### Slow Load Times
**Symptoms**: Initial load or scene transitions taking too long
**Investigation**:
1. Check network tab for asset loading
2. Review asset sizes and compression
3. Test with simulated slow network
4. Monitor main thread blocking

### Environment-Specific Issues

#### CI Performance Test Failures
**Symptoms**: Tests pass locally but fail in CI
**Solution**: Use environment-aware thresholds
```typescript
const threshold = isCI ? CI_THRESHOLDS : LOCAL_THRESHOLDS;
```

#### Production vs Development Performance
**Symptoms**: Performance differs between dev and production builds
**Investigation**:
1. Compare build outputs and asset sizes
2. Check for development-only code inclusion
3. Verify minification and optimization settings
4. Test production build locally

## Performance Monitoring Tools

### Built-in Game Tools
- **FPS Counter**: Press F3 in development builds
- **Memory Monitor**: Console logging of memory usage
- **Performance Warnings**: Automatic warnings for slow operations

### Browser Developer Tools
- **Performance Tab**: Frame analysis and CPU profiling
- **Memory Tab**: Heap snapshots and memory leak detection
- **Network Tab**: Asset loading analysis
- **Lighthouse**: Overall performance scoring

### Automated Monitoring
- **GitHub Actions**: Automated performance testing in CI
- **Performance Check Script**: `tools/development/performance-check.js`
- **Regression Detection**: Automated baseline comparison

---

**Last Updated**: July 21, 2025  
**Story**: SETUP-006 Project Health & Documentation Enhancement  
**Status**: ✅ Complete  
**Next Review**: When significant performance changes are made
