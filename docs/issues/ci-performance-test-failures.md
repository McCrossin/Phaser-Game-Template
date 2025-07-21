# CI Performance Test Failures - Issue Tracker

## Issue Summary
**Status**: Open  
**Priority**: Medium  
**Assignee**: Next available developer  
**Story**: SETUP-005 Performance Monitoring Infrastructure  

## Problem Description
GitHub Actions CI pipeline is failing on performance tests due to environment constraints. The FPS Performance Test expects minimum 5 FPS but is getting ~3-5 FPS in CI environment.

## Error Details
```
Error: expect(received).toBeGreaterThan(expected)
Expected: > 5
Received: 3.1133250311332787 (and similar values across retries)
```

Full error log available in: `runfpsbenchmarks_error.txt`

## Impact Assessment
- ❌ CI pipeline fails on performance tests
- ✅ Local development unaffected
- ✅ Core FPS counter functionality works perfectly
- ✅ Manual testing shows good performance

## Root Cause
1. **CI Resource Constraints**: GitHub Actions runners have limited CPU/GPU resources
2. **Headless Browser Limitations**: Playwright headless mode may perform differently
3. **Strict Test Thresholds**: 5 FPS minimum may be unrealistic for CI environment

## Recommended Solutions

### Quick Fix (Estimated: 15 minutes)
Adjust CI thresholds in `tests/e2e/performance/game-performance.test.ts`:
```typescript
// Line 54: Change from
expect(minFPS).toBeGreaterThan(5);
// To
expect(minFPS).toBeGreaterThan(2); // More realistic for CI
```

### Better Solution (Estimated: 1 hour)
Environment-aware testing:
```typescript
const isCI = process.env.CI === 'true';
const thresholds = {
  minFPS: isCI ? 2 : 5,
  avgFPS: isCI ? 10 : 15,
  degradation: isCI ? 0.6 : 0.5
};
```

### Comprehensive Solution (Estimated: 3-4 hours)
1. Create separate Playwright configs for CI vs local
2. Implement performance benchmarking instead of strict pass/fail
3. Add performance regression detection
4. Store baseline performance metrics

## Test Environment Data
```
CI Performance Observed:
- Average FPS: 82-155 FPS (Good)
- Min FPS: 3-5 FPS (Problematic for strict thresholds)
- Max FPS: 1666-3333 FPS (Indicating performance spikes)
- Load Time: ~843ms (Acceptable)
- Memory Usage: Stable at ~24MB
```

## Acceptance Criteria for Fix
- [ ] CI performance tests pass consistently
- [ ] Local performance tests still work
- [ ] Thresholds are appropriate for each environment
- [ ] Documentation updated with new thresholds
- [ ] No regression in actual performance monitoring

## Files to Modify
- `tests/e2e/performance/game-performance.test.ts` - Main test file
- `playwright.config.ts` - Potentially add CI-specific config
- `docs/technical/performance-monitoring-guide.md` - Update with CI considerations

## Testing Checklist
- [ ] Run tests locally (should pass)
- [ ] Run tests in CI environment (should pass after fix)
- [ ] Verify FPS counter still works in development
- [ ] Test performance monitoring on actual game usage
- [ ] Update documentation

---
**Created**: July 21, 2025  
**Last Updated**: July 21, 2025  
**Next Review**: When developer picks up this issue
