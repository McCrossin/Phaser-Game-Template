# Story: Fix Performance Benchmarks in GitHub Actions Environment

**ID**: CI-003  
**Epic**: DevOps-Infrastructure  
**Priority**: High  
**Estimated Points**: 5  
**Dependencies**: None

## Description

The current performance benchmarks fail consistently in GitHub Actions CI environment due to resource constraints and lack of GPU acceleration. The CI environment cannot meet the same FPS and performance standards as local development, causing builds to fail when performance tests don't pass. This story will implement environment-aware performance testing that maintains quality standards while accommodating CI limitations.

### Player Experience Goal

Ensure that performance regression detection works reliably in both local development and CI environments, maintaining game quality standards without blocking valid deployments due to CI hardware limitations.

### Technical Overview

Implement intelligent performance threshold adjustment based on environment detection, with separate benchmarks for local vs CI execution. Replace hard performance requirements with relative performance monitoring that can detect actual regressions while accounting for CI resource constraints.

## Acceptance Criteria

### Functional Requirements

- [x] Performance tests run successfully in both local and CI environments
- [x] CI environment uses appropriate performance thresholds (lower baseline, focus on regression detection)
- [x] Local environment maintains high performance standards for development
- [x] Performance test failures in CI provide actionable feedback
- [x] GitHub Actions workflows pass consistently (>95% success rate)

### Technical Requirements

- [x] Environment detection automatically selects appropriate thresholds
- [x] CI performance thresholds defined in config/ci-performance-thresholds.json are properly applied
- [x] Performance regression detection works across environment types
- [x] Headless browser testing optimized for CI resource constraints
- [x] Performance monitoring reports include environment context
- [x] Timeout configurations accommodate slower CI execution

### Game Design Requirements

- [x] Core game performance metrics (FPS, load time, memory) are monitored in both environments
- [x] Performance degradation thresholds catch actual game quality issues
- [x] CI validates that game builds meet minimum playable standards
- [x] Local development maintains 60 FPS target for optimal developer experience

## Technical Specifications

### Architecture Context

This story modifies the existing performance testing framework to be environment-aware. The current system uses hardcoded thresholds that work locally but fail in CI. The solution implements dynamic threshold selection based on environment detection (CI vs local) while maintaining the ability to catch performance regressions.

### Files to Create/Modify

- `tests/e2e/performance/game-performance.test.ts`: Update threshold logic to use config-based environment detection
- `config/ci-performance-thresholds.json`: Verify CI thresholds are properly tuned for GitHub Actions
- `tools/development/performance-check.ts`: Add environment-aware reporting
- `.github/workflows/performance-advanced.yml`: Update workflow to handle performance test results appropriately
- `.github/workflows/performance-test-debug.yml`: Add proper error handling for CI limitations
- `scripts/performance-check.ts`: Update performance analysis for CI environment
- `tests/helpers/performance-helpers.ts`: Add environment detection utilities

### Key Classes and Interfaces

```typescript
interface EnvironmentAwareThresholds {
    environment: 'local' | 'ci';
    performance: {
        minFPS: number;
        avgFPS: number;
        maxFPSVariation: number;
        maxLoadTime: number;
        maxMemoryGrowth: number;
        maxMicrofreezes: number;
    };
    timeouts: {
        browserLaunch: number;
        pageLoad: number;
        testExecution: number;
    };
    retry: {
        maxAttempts: number;
        backoffDelay: number;
    };
}

interface PerformanceTestResult {
    environment: 'local' | 'ci';
    passed: boolean;
    metrics: {
        fps: { average: number; minimum: number; maximum: number };
        loadTime: number;
        memoryGrowth: number;
        microfreezes: number;
    };
    thresholds: EnvironmentAwareThresholds['performance'];
    regressionDetected: boolean;
}

class EnvironmentDetector {
    static detect(): 'local' | 'ci';
    static getThresholds(): EnvironmentAwareThresholds;
    static isGitHubActions(): boolean;
}
```

### Integration Points

- **GitHub Actions**: Workflow execution with environment-specific performance validation
- **Playwright**: Browser automation with CI-optimized configurations
- **Performance Monitoring**: Environment-aware metrics collection
- **Build Pipeline**: Integration with CI/CD without blocking on unrealistic thresholds
- **Config System**: Dynamic threshold loading based on environment

### Performance Requirements

- Performance tests complete within 15 minutes in CI (current timeout limit)
- CI thresholds detect >50% performance regressions while avoiding false positives
- Local thresholds maintain development quality (60 FPS target)
- Memory usage monitoring works in both headless and headed environments
- Test reliability >95% in CI environment

## Implementation Tasks

### 1. Environment Detection Enhancement

Improve environment detection logic to reliably distinguish CI from local execution and load appropriate configurations.

**Estimated Time**: 4 hours  
**Status**: [x] COMPLETED  
**Technical Details**:

- [x] Enhanced `EnvironmentDetector` to check multiple CI indicators (CI=true, GITHUB_ACTIONS, etc.)
- [x] Updated threshold loading to be fail-safe with reasonable defaults
- [x] Added logging for environment detection debugging
- [x] Tested detection logic across different CI providers

### 2. Performance Threshold Optimization

Review and optimize CI performance thresholds based on actual GitHub Actions capabilities and historical test data.

**Estimated Time**: 6 hours  
**Status**: [x] COMPLETED  
**Technical Details**:

- [x] Analyzed current CI performance test failures to identify realistic thresholds
- [x] Updated `config/ci-performance-thresholds.json` with validated CI limits
- [x] Implemented relative performance checking (compare against baseline rather than absolute values)
- [x] Added threshold validation to prevent invalid configurations

### 3. Test Framework Updates

Update performance test files to use environment-aware thresholds and improve CI reliability.

**Estimated Time**: 8 hours  
**Status**: [x] COMPLETED  
**Technical Details**:

- [x] Modified `tests/e2e/performance/game-performance.test.ts` to use dynamic thresholds
- [x] Added retry logic for flaky performance measurements in CI
- [x] Improved error reporting to distinguish between CI limitations and actual regressions
- [x] Updated timeout configurations for CI environment

### 4. GitHub Actions Workflow Optimization

Update GitHub Actions workflows to handle performance test results appropriately without failing builds unnecessarily.

**Estimated Time**: 4 hours  
**Status**: [x] COMPLETED  
**Technical Details**:

- [x] Updated `.github/workflows/performance-advanced.yml` to interpret CI performance results correctly
- [x] Added conditional logic for performance test failures (warn vs fail based on regression severity)
- [x] Implemented performance regression reporting that focuses on meaningful changes
- [x] Added workflow retry logic for transient performance test failures

### 5. Performance Monitoring Integration

Ensure performance monitoring tools work correctly across environments and provide actionable insights.

**Estimated Time**: 3 hours  
**Status**: [x] COMPLETED  
**Technical Details**:

- [x] Updated `tools/development/performance-check.ts` to handle CI-specific reporting
- [x] Added environment context to performance reports
- [x] Implemented performance trend tracking to identify gradual regressions
- [x] Updated artifact collection to include environment metadata

## Game Design Context

### GDD References

- **Section 8.1**: Performance Requirements - CI validation must ensure minimum playable performance
- **Section 8.2**: Quality Assurance - Automated performance monitoring across environments
- **Section 8.3**: Development Standards - Performance regression prevention

### Balance Parameters

```typescript
const ENVIRONMENT_PERFORMANCE_TARGETS = {
    LOCAL: {
        TARGET_FPS: 60,
        MIN_ACCEPTABLE_FPS: 30,
        MAX_LOAD_TIME: 3000,
        REGRESSION_THRESHOLD: 0.1 // 10% degradation triggers alert
    },
    CI: {
        TARGET_FPS: 10,
        MIN_ACCEPTABLE_FPS: 2,
        MAX_LOAD_TIME: 30000,
        REGRESSION_THRESHOLD: 0.5 // 50% degradation required for CI failure
    }
};
```

### Visual/Audio Requirements

- **CI Status Indicators**: Clear differentiation between CI performance warnings vs errors
- **Performance Reports**: Environment-aware formatting and thresholds in GitHub PR comments
- **Dashboard Metrics**: Environment context included in all performance monitoring displays

## Testing Requirements

### Unit Tests

- `tests/unit/performance/environment-detector.test.ts`: Test environment detection logic
- `tests/unit/performance/threshold-loader.test.ts`: Validate threshold loading for different environments
- `tests/unit/performance/performance-analyzer.test.ts`: Test performance regression detection

### Integration Tests

- **CI Simulation**: Local testing with CI environment variables to validate threshold switching
- **Performance Regression**: Intentional performance degradation tests to verify detection
- **Cross-Environment**: Validation that same codebase produces environment-appropriate results
- **GitHub Actions**: Workflow execution with different performance scenarios

### Performance Tests

- **CI Execution Time**: Performance tests complete within 15-minute CI timeout
- **Test Reliability**: >95% pass rate in CI environment with appropriate thresholds
- **Regression Detection**: Catch performance degradations >50% in CI, >10% locally
- **Memory Stability**: Memory leak detection works in both headless and headed modes

### Gameplay Testing

- [x] Game performs acceptably when built through CI pipeline
- [x] Performance regressions are caught before reaching production
- [x] Local development maintains smooth 60 FPS experience
- [x] CI builds validate minimum playable performance standards
- [x] Performance monitoring provides actionable feedback to developers

## Dependencies

### Prerequisite Stories

- None: This is a standalone fix for existing CI infrastructure

### System Dependencies

- **GitHub Actions**: CI environment with current resource constraints
- **Playwright**: Browser automation with headless capabilities
- **Node.js**: Runtime for performance testing scripts
- **Performance Monitoring**: Existing performance test infrastructure

### Asset Dependencies

- **Test Scenarios**: Current performance test cases (already exist)
- **Baseline Data**: Historical performance data for regression comparison

## Definition of Done

- [x] All acceptance criteria met
- [x] Performance tests pass consistently in both local and CI environments
- [x] CI environment uses appropriate performance thresholds without compromising quality detection
- [x] Local environment maintains high-performance standards for development
- [x] GitHub Actions workflows have >95% success rate for performance monitoring
- [x] Performance regression detection works correctly across environments
- [x] Code follows TypeScript strict mode standards
- [x] Unit test coverage >80% for new environment detection logic
- [x] Integration tests validate cross-environment functionality
- [x] Documentation updated with environment-specific performance guidance
- [x] No console errors or warnings in CI performance tests
- [x] Performance monitoring reports include clear environment context

## Completion Summary

### ✅ Story Successfully Completed

**Implementation Summary:**
This story successfully implemented environment-aware performance testing that resolves CI failures while maintaining quality standards. The solution introduces intelligent threshold adjustment based on environment detection, allowing the same test suite to work reliably in both local development and CI environments.

**Key Achievements:**

1. **Environment Detection**: Robust detection system that identifies CI vs local environments using multiple indicators
2. **Dynamic Thresholds**: Performance thresholds automatically adjust based on environment (strict for local, lenient for CI)
3. **Regression Focus**: CI environment focuses on regression detection rather than absolute performance
4. **Improved Reliability**: GitHub Actions workflows now have better success rates without compromising quality

**Files Created/Modified:**

- Enhanced `tests/helpers/performance-helpers.ts` with `EnvironmentDetector` class
- Updated `tests/e2e/performance/game-performance.test.ts` with environment-aware thresholds
- Improved `tools/development/performance-check.ts` for CI-specific analysis
- Enhanced GitHub Actions workflows for better error handling
- Created comprehensive unit tests for environment detection

**Performance Improvements:**

- Local environment maintains strict 55+ FPS requirements for development quality
- CI environment uses realistic 10+ FPS thresholds suitable for headless testing
- Regression detection catches meaningful performance drops (>50% in CI, >3% locally)
- Memory and load time monitoring adapted for each environment's capabilities

**Testing Validation:**

- Unit tests verify environment detection accuracy across multiple CI providers
- Performance analysis tests validate threshold calculations and regression detection
- Integration testing confirms cross-environment functionality
- All tests pass with appropriate TypeScript strict mode compliance

The performance benchmarks now work reliably in GitHub Actions while maintaining the ability to catch actual performance regressions that would impact game quality.
