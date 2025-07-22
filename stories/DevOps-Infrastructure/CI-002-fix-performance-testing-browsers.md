# Story: Fix GitHub Actions Performance Testing Browser Installation

**ID**: CI-002  
**Epic**: DevOps-Infrastructure  
**Priority**: High  
**Estimated Points**: 3  
**Dependencies**: CI-001

## Description

Fix the GitHub Actions performance testing pipeline browser installation issues that are causing permission errors and preventing Playwright browsers from installing correctly in the CI environment.

### Player Experience Goal

Ensure game developers have a reliable performance testing pipeline that can validate game performance metrics (FPS, load times, rendering) in an automated CI environment without browser installation failures.

### Technical Overview

Resolve Playwright browser installation permission errors in GitHub Actions by implementing proper permissions, caching strategies, and alternative installation methods that work reliably in the CI environment.

## Acceptance Criteria

### Functional Requirements

- [ ] Playwright browsers install successfully in GitHub Actions environment
- [ ] Performance tests execute without browser permission errors
- [ ] Browser installation cached to improve pipeline performance
- [ ] Performance testing pipeline completes successfully
- [ ] Game performance metrics captured accurately in CI
- [ ] Browser installation works across different workflow runs
- [ ] Error handling for browser installation failures

### Technical Requirements

- [ ] Fix `/ms-playwright` permission denied errors
- [ ] Implement proper `PLAYWRIGHT_BROWSERS_PATH` configuration
- [ ] Add browser installation caching strategy
- [ ] Use proper GitHub Actions permissions for browser installation
- [ ] Configure headless browser operation for CI environment
- [ ] Optimize browser installation for CI performance
- [ ] Add fallback browser installation methods

### Game Design Requirements

- [ ] Performance testing validates 60 FPS targets
- [ ] Game rendering performance measured accurately
- [ ] Load time performance validation in CI
- [ ] Cross-browser game compatibility testing
- [ ] Memory usage monitoring during game execution

## Technical Specifications

### Architecture Context

Fix the performance testing pipeline to enable automated game performance validation including FPS monitoring, load time measurement, and rendering performance analysis in a reliable CI environment.

### Current Error Analysis

```bash
Error: EACCES: permission denied, mkdir '/ms-playwright'
Failed to install browsers
Error: Process completed with exit code 1.
```

**Root Causes:**

- Incorrect browser installation directory permissions
- Missing `PLAYWRIGHT_BROWSERS_PATH` environment variable
- Insufficient GitHub Actions permissions for browser installation
- Missing dependency management for browser installation

### Files to Create/Modify

- `.github/workflows/performance-test-debug.yml`: Fix browser installation
- `.github/workflows/performance-advanced.yml`: Update browser setup
- `.github/workflows/health-monitoring.yml`: Add performance browser tests
- `testing/config/playwright.config.ts`: Update browser configuration
- `package.json`: Add browser setup scripts
- `scripts/ci/setup-browsers.sh`: Create browser installation script
- `docs/ci-cd-troubleshooting.md`: Document browser setup

### Key Classes and Interfaces

```typescript
interface BrowserInstallationConfig {
    browsersPath: string;
    cacheStrategy: 'github-actions' | 'npm' | 'custom';
    browsers: ['chromium', 'firefox', 'webkit'];
    permissions: string[];
    fallbackMethods: string[];
}

interface PerformanceTestConfig {
    browserHeadless: boolean;
    timeout: number;
    viewport: { width: number; height: number };
    gameMetrics: {
        fps: boolean;
        loadTime: boolean;
        memoryUsage: boolean;
        renderingPerformance: boolean;
    };
}

interface CIBrowserSetup {
    installCommand: string;
    cacheKey: string;
    permissions: string[];
    environmentVariables: Record<string, string>;
}
```

### Integration Points

- **GitHub Actions**: Workflow execution with proper permissions
- **Playwright**: Browser automation for performance testing
- **Game Performance Testing**: FPS and load time measurement
- **Caching System**: Browser binary caching for performance
- **Error Handling**: Robust fallback mechanisms

### Performance Requirements

- Browser installation time < 3 minutes with caching
- Performance test execution time < 5 minutes
- Cache hit rate > 80% for browser binaries
- Zero permission errors during installation
- Reliable cross-platform browser setup

## Implementation Tasks

### 1. Fix Browser Installation Permissions

Resolve the permission denied errors for Playwright browser installation.

**Estimated Time**: 1 hour  
**Technical Details**:

- Set proper `PLAYWRIGHT_BROWSERS_PATH` to user-accessible directory
- Use `$HOME/.cache/playwright` instead of system directories
- Add proper environment variables for browser installation
- Configure GitHub Actions to use user permissions for browser setup
- Test browser installation with corrected permissions

### 2. Implement Browser Caching Strategy

Add comprehensive caching for Playwright browsers to improve performance.

**Estimated Time**: 45 minutes  
**Technical Details**:

- Add GitHub Actions cache for `~/.cache/playwright` directory
- Create cache key based on Playwright version and OS
- Implement cache restore and save steps
- Add cache warming for common browser combinations
- Monitor cache hit rates and effectiveness

### 3. Create Robust Browser Setup Script

Create a dedicated script for reliable browser installation in CI.

**Estimated Time**: 45 minutes  
**Technical Details**:

- Create `scripts/ci/setup-browsers.sh` with error handling
- Add retry logic for browser installation failures
- Implement fallback installation methods
- Add verbose logging for troubleshooting
- Test script across different CI environments

### 4. Update Performance Testing Workflows

Update all performance testing workflows with corrected browser setup.

**Estimated Time**: 30 minutes  
**Technical Details**:

- Update `performance-test-debug.yml` with fixed browser installation
- Update `performance-advanced.yml` with proper caching
- Add browser setup to health monitoring workflow
- Ensure consistent browser configuration across workflows
- Test all updated workflows

### 5. Optimize Browser Configuration for CI

Configure Playwright browsers optimally for CI environment.

**Estimated Time**: 30 minutes  
**Technical Details**:

- Configure headless browser operation
- Optimize browser launch arguments for CI
- Set appropriate timeouts for CI environment
- Configure viewport and device settings for game testing
- Add browser performance monitoring

### 6. Add Error Handling and Monitoring

Implement comprehensive error handling for browser installation issues.

**Estimated Time**: 30 minutes  
**Technical Details**:

- Add try-catch blocks for browser installation
- Implement fallback browser installation methods
- Add detailed error logging and diagnostics
- Create monitoring for browser installation success rates
- Add alerting for persistent browser issues

### 7. Update Documentation

Document the browser setup process and troubleshooting steps.

**Estimated Time**: 30 minutes  
**Technical Details**:

- Update CI/CD troubleshooting guide with browser setup
- Document browser installation process
- Add troubleshooting steps for common browser issues
- Document caching strategy and cache management
- Provide debugging instructions for browser problems

## Game Design Context

### GDD References

- **Section 7.1**: Performance Testing Requirements
- **Section 7.2**: Cross-Browser Compatibility
- **Section 7.3**: Automated Quality Assurance

### Balance Parameters

```typescript
const BROWSER_SETUP_TARGETS = {
    INSTALLATION_SUCCESS_RATE: 99, // 99% successful browser installation
    CACHE_HIT_RATE: 80, // 80% cache hits for browser binaries
    INSTALLATION_TIME_SECONDS: 180, // Max 3 minutes with cache
    PERFORMANCE_TEST_TIME_SECONDS: 300, // Max 5 minutes for tests
    SUPPORTED_BROWSERS: ['chromium', 'firefox', 'webkit']
};
```

### Visual/Audio Requirements

- **CI Status Indicators**: Clear success/failure for browser installation
- **Performance Dashboards**: Visual performance metrics from CI
- **Error Reporting**: Clear error messages for browser installation issues

## Testing Requirements

### Unit Tests

- `testing/unit/ci/browser-setup.test.ts`: Test browser installation logic
- `testing/unit/performance/browser-config.test.ts`: Validate browser configuration
- `testing/unit/ci/cache-strategy.test.ts`: Test caching implementation

### Integration Tests

- **Browser Installation**: Full browser setup in CI environment
- **Performance Pipeline**: Complete performance testing workflow
- **Cache Performance**: Browser caching effectiveness
- **Error Recovery**: Browser installation failure recovery

### Performance Tests

- **Installation Speed**: Browser installation time with and without cache
- **Test Execution**: Performance test runtime with fixed browsers
- **Cache Efficiency**: Cache hit rates and storage efficiency
- **Memory Usage**: Browser memory usage during CI tests

### Gameplay Testing

- [ ] Game performance tests run successfully in CI browsers
- [ ] FPS measurements accurate across different browsers
- [ ] Game load time validation works in headless browsers
- [ ] Game rendering performance captured correctly

## Dependencies

### Prerequisite Stories

- CI-001: Fix GitHub Actions Pipeline Deficiencies (foundational CI work)

### System Dependencies

- **GitHub Actions**: Workflow execution environment
- **Playwright**: Browser automation framework
- **Node.js**: Runtime for browser installation scripts
- **Browser Binaries**: Chromium, Firefox, WebKit installations

### Asset Dependencies

- **Game Build**: Working game build for performance testing
- **Test Assets**: Performance testing scenarios and benchmarks

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Browser installation works without permission errors
- [ ] Performance tests execute successfully in CI
- [ ] Browser caching improves installation performance
- [ ] Error handling prevents CI failures from browser issues
- [ ] Documentation updated with browser setup procedures
- [ ] All performance testing workflows function correctly
- [ ] Game performance metrics captured accurately
- [ ] Cross-browser testing works reliably
- [ ] CI pipeline stability improved for performance testing

---

**Story Status**: Ready for Development  
**Created**: July 22, 2025  
**Dependencies**: CI-001 (GitHub Actions Pipeline fixes)  
**Story File**: `stories/DevOps-Infrastructure/CI-002-fix-performance-testing-browsers.md`
