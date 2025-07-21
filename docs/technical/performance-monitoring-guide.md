# Performance Monitoring - Developer Reference

## Quick Start Guide

### FPS Counter Usage

**Toggle FPS Display**: Press `F3` in development builds to show/hide the FPS counter

**Color Coding**:
- 🟢 **Green** (≥55 FPS): Excellent performance
- 🟡 **Yellow** (30-55 FPS): Warning - investigate causes
- 🔴 **Red** (<30 FPS): Critical - must fix

### Console Monitoring

The performance system automatically logs:
- Scene transition times
- FPS warnings when performance drops below 30 FPS
- Performance events and major operations

## API Reference

### SimpleFPSCounter

```typescript
import { SimpleFPSCounter } from '@/utils/SimpleFPSCounter';

// Initialize in scene (automatic in GameScene/StartScene)
const fpsCounter = new SimpleFPSCounter(this);

// Manual control
fpsCounter.setVisible(true);           // Show FPS counter
fpsCounter.setVisible(false);          // Hide FPS counter
const currentFPS = fpsCounter.getCurrentFPS(); // Get current FPS value

// Update (call in scene update loop)
fpsCounter.update();

// Cleanup (call in scene shutdown)
fpsCounter.destroy();
```

### PerformanceLogger

```typescript
import { PerformanceLogger } from '@/config/DebugConfig';

// Scene timing
PerformanceLogger.logSceneStart('SceneName');
PerformanceLogger.logSceneComplete('SceneName');

// Custom events
PerformanceLogger.logEvent('Asset Loading', 150.5); // with duration
PerformanceLogger.logEvent('Game Initialized');     // without duration

// Performance warnings
PerformanceLogger.warn('Heavy operation detected in update loop');
```

## Development Workflow

### Daily Development

1. **Start Dev Server**: `npm run dev`
2. **Open Game**: Navigate to http://localhost:5173/
3. **Enable FPS Counter**: Press `F3`
4. **Monitor Performance**: Watch for yellow/red FPS indicators
5. **Check Console**: Review performance warnings and timing logs

### Performance Testing

1. **Use Testing Checklist**: `docs/checklists/performance-testing.md`
2. **Test Multiple Scenarios**: Main menu, gameplay, scene transitions
3. **Verify Thresholds**: 55-60 FPS target, <3s load times
4. **Document Issues**: Use checklist sign-off section

### Before Release

1. **Run Performance Tests**: Follow complete checklist
2. **Verify Production Build**: Ensure zero FPS counter overhead
3. **Check Memory Usage**: No leaks during extended play
4. **Sign-off Documentation**: Complete performance approval

## Configuration

### Debug Settings

Edit `src/config/DebugConfig.ts`:

```typescript
export const DEBUG_CONFIG: DebugConfig = {
    showFPS: false,              // Initial FPS counter visibility
    performanceWarnings: true,   // Console warnings for issues
    enablePerformanceLogging: true, // Scene timing and events
    logSceneTransitions: true    // Scene load time logging
};
```

### Performance Thresholds

Modify thresholds in `SimpleFPSCounter.ts`:

```typescript
// Color coding thresholds
if (fps >= 55) {        // Green threshold
    this.fpsText.setColor('#00ff00');
} else if (fps >= 30) { // Yellow threshold
    this.fpsText.setColor('#ffff00');
} else {                // Red threshold (warning logged)
    this.fpsText.setColor('#ff0000');
}
```

## Troubleshooting

### Common Issues

**FPS Counter Not Showing**:
- Verify you're in development mode (`NODE_ENV !== 'production'`)
- Press `F3` to toggle visibility
- Check browser console for errors

**Performance Warnings in Console**:
- `Low FPS detected: XX` - Game running below 30 FPS
- `Scene "X" took Xms to load (>1s)` - Slow scene transitions
- Check for heavy operations in update loops

**Production Builds**:
- FPS counter automatically disabled
- No performance overhead
- Console logging disabled

### Performance Optimization

**If FPS drops below 55**:
1. Check for expensive operations in `update()` loops
2. Review object creation/destruction patterns
3. Verify texture atlas usage
4. Monitor memory usage for leaks
5. Use object pooling for frequently created objects

**Scene Load Times >1s**:
1. Reduce asset sizes
2. Implement progressive loading
3. Use texture atlases
4. Optimize asset pipeline

## Testing Integration

### Unit Tests

Run FPS counter tests:
```bash
npm test -- tests/unit/utils/SimpleFPSCounter.test.ts
```

### E2E Performance Tests

```bash
npm run test:e2e -- tests/e2e/performance/
```

### Manual Testing

Use the comprehensive checklist:
```bash
open docs/checklists/performance-testing.md
```

## File Locations

- **FPS Counter**: `src/utils/SimpleFPSCounter.ts`
- **Debug Config**: `src/config/DebugConfig.ts`
- **Testing Checklist**: `docs/checklists/performance-testing.md`
- **Unit Tests**: `tests/unit/utils/SimpleFPSCounter.test.ts`
- **Integration**: `src/scenes/GameScene.ts`, `src/scenes/StartScene.ts`

## Best Practices

### Development

- ✅ Always test with FPS counter enabled
- ✅ Monitor console for performance warnings
- ✅ Test on multiple devices/browsers
- ✅ Use performance checklist before releases

### Production

- ✅ Verify zero performance monitoring overhead
- ✅ Confirm FPS counter is disabled
- ✅ No debug logging in console
- ✅ Performance targets met (55-60 FPS)

---

**Last Updated**: July 21, 2025  
**Story**: SETUP-005 Performance Monitoring Infrastructure  
**Status**: ✅ Complete
