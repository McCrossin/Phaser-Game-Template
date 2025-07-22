# CI/CD Troubleshooting Guide

This guide helps diagnose and resolve common issues with the CI/CD pipeline and performance monitoring in GitHub Actions.

## 🚨 Quick Diagnosis

### Performance Tests Failing in CI but Passing Locally

**Symptoms**: Tests pass locally but fail in GitHub Actions with timeout or performance threshold errors.

**Root Causes**:
- CI environment has lower computational resources
- Network latency affects asset loading
- Shared runners cause performance variations
- Browser automation behaves differently in headless mode

**Solutions**:
1. **Check Environment-Aware Thresholds**: Verify that CI thresholds are properly configured in `config/ci-performance-thresholds.json`
2. **Increase Timeouts**: CI environment typically needs 2-3x longer timeouts
3. **Review Resource Allocation**: Ensure workflow has sufficient memory and CPU allocation
4. **Check Network Dependencies**: Minimize external API calls during performance tests

**Example Fix**:
```yaml
# In .github/workflows/performance-advanced.yml
env:
  NODE_OPTIONS: '--max-old-space-size=4096'
  PLAYWRIGHT_TIMEOUT_MULTIPLIER: 2
```

### Build Failures in CI

**Symptoms**: Build succeeds locally but fails in CI with memory errors or dependency issues.

**Diagnosis Steps**:
1. Check Node.js version compatibility
2. Verify dependency lock file is committed
3. Review memory usage during build
4. Check for platform-specific dependencies

**Solutions**:
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"

# Clear npm cache
npm cache clean --force

# Use exact dependency versions
npm ci --prefer-offline
```

### Artifact Upload Failures

**Symptoms**: Performance results not available as artifacts, or upload errors.

**Common Causes**:
- Missing artifact directories
- Insufficient permissions
- File size limits exceeded
- Network timeouts

**Solutions**:
```yaml
- name: Create artifact directories
  run: mkdir -p test-results playwright-report

- name: Upload with error handling
  uses: actions/upload-artifact@v4
  if: always()
  with:
    name: performance-results-${{ github.run_number }}
    path: |
      test-results/
      performance-*.json
    retention-days: 30
```

## 🔧 Environment-Specific Issues

### GitHub Actions Resource Constraints

**Memory Issues**:
```bash
# Monitor memory usage
free -h

# Set memory limits
export NODE_OPTIONS="--max-old-space-size=4096 --optimize-for-size"

# Clean up during workflow
npm cache clean --force
```

**CPU Performance**:
- Use `strategy.fail-fast: false` to prevent one failure from stopping all jobs
- Consider reducing parallel processes in CI
- Use `timeout-minutes` to prevent hanging jobs

**Network Issues**:
```yaml
# Add retry logic for network-dependent operations
- name: Install dependencies with retry
  uses: nick-fields/retry@v3
  with:
    timeout_minutes: 10
    max_attempts: 3
    retry_wait_seconds: 30
    command: npm ci
```

### Browser Automation Issues

**Common Problems**:
- Browser crashes in headless mode
- Inconsistent rendering
- Missing system dependencies

**Solutions**:
```yaml
# Install with system dependencies
- name: Setup browsers
  run: npx playwright install chromium --with-deps

# Use stable browser settings
env:
  PLAYWRIGHT_BROWSERS_PATH: /ms-playwright
```

**Environment Variables for Debugging**:
```yaml
env:
  DEBUG: 'playwright:*'  # Enable Playwright debugging
  PWDEBUG: 1              # Interactive debugging (local only)
```

## 📊 Performance Monitoring Issues

### Inconsistent FPS Measurements

**Symptoms**: FPS varies significantly between runs.

**Causes**:
- Shared CI resources
- Background processes
- Browser optimization differences
- Test timing issues

**Solutions**:
1. **Use Statistical Analysis**: Average multiple runs instead of single measurements
2. **Environment-Aware Baselines**: Set different baselines for CI vs local
3. **Trend Analysis**: Focus on trends rather than absolute values

```typescript
// In performance tests
const PERFORMANCE_THRESHOLDS = {
    minFPS: isCI ? 2 : 30,     // Much lower threshold for CI
    avgFPS: isCI ? 10 : 55,    // Realistic CI expectations
    maxVariation: isCI ? 4.0 : 1.5  // Allow more variation in CI
};
```

### Memory Leak Detection False Positives

**Symptoms**: Memory usage tests fail in CI but pass locally.

**Causes**:
- Garbage collection timing differences
- CI environment memory pressure
- Browser process management

**Solutions**:
```typescript
// Adjust thresholds for CI
const memoryThresholds = {
    maxGrowth: isCI ? 150 : 50,  // Allow more growth in CI
    testDuration: isCI ? 5000 : 10000  // Shorter tests in CI
};
```

### Bundle Size Variations

**Symptoms**: Bundle size differs between local and CI builds.

**Diagnosis**:
```bash
# Compare build outputs
ls -la dist/
du -sh dist/*

# Check for platform-specific builds
npm run build -- --analyze
```

## 🛠️ Advanced Debugging

### Enable Verbose Logging

**In Workflow**:
```yaml
- name: Debug performance issues
  run: npm run test:performance
  env:
    DEBUG: 'performance:*'
    VERBOSE_LOGGING: true
    PERFORMANCE_LOG_LEVEL: debug
```

**In Performance Tests**:
```typescript
if (process.env.VERBOSE_LOGGING === 'true') {
    console.log('Detailed performance metrics:', {
        environment: process.env.CI ? 'CI' : 'local',
        memoryUsage: process.memoryUsage(),
        cpuUsage: process.cpuUsage()
    });
}
```

### Capture Screenshots and Videos

```yaml
- name: Run tests with media capture
  run: npm run test:performance
  env:
    PLAYWRIGHT_VIDEO: 'on-failure'
    PLAYWRIGHT_SCREENSHOT: 'only-on-failure'
```

### Remote Debugging

**For Local Testing of CI Issues**:
```bash
# Simulate CI environment locally
export CI=true
export GITHUB_ACTIONS=true
export NODE_OPTIONS="--max-old-space-size=4096"

# Run CI setup script
./scripts/ci-environment-setup.sh

# Run performance check
npx tsx scripts/performance-check.ts
```

## 📋 Common Error Messages and Solutions

### "Browser Launch Timeout"
```
Error: Browser launch timeout
```
**Solution**:
- Increase browser launch timeout
- Install browser dependencies: `npx playwright install-deps`
- Check available memory

### "Performance Results Not Found"
```
Error: performance-results.json not found
```
**Solution**:
- Ensure performance tests run before performance check
- Check test output directory
- Verify file writing permissions

### "FPS Below Threshold"
```
Error: Average FPS below threshold: 3.2 < 10
```
**Solution**:
- Review CI-specific thresholds
- Check if test is running too long
- Verify CI environment capacity

### "Bundle Size Exceeds Limit"
```
Error: Bundle size exceeds limit: 12.5MB > 10MB
```
**Solution**:
- Check for unoptimized assets
- Review webpack/build configuration
- Exclude source maps from size calculation

## 🔄 Retry and Recovery Strategies

### Automatic Retry Configuration

```yaml
# Workflow level
- uses: nick-fields/retry@v3
  with:
    timeout_minutes: 15
    max_attempts: 3
    retry_wait_seconds: 60

# Script level (in performance-check.ts)
async withRetry<T>(operation: () => Promise<T>, maxAttempts: number = 3): Promise<T> {
    for (let attempt = 1; attempt <= maxAttempts; attempt++) {
        try {
            return await operation();
        } catch (error) {
            if (attempt === maxAttempts) throw error;
            await this.sleep(1000 * attempt); // Exponential backoff
        }
    }
}
```

### Graceful Degradation

```typescript
// Continue testing even if some checks fail
try {
    await this.runPerformanceTest();
} catch (error) {
    console.warn('Performance test failed, continuing with limited metrics');
    this.recordPartialResults();
}
```

## 📈 Monitoring and Alerting

### Performance Trend Analysis

```bash
# Check performance trends over time
git log --oneline --grep="performance" | head -10

# Compare performance results
diff performance-results-old.json performance-results-new.json
```

### Setting Up Alerts

```yaml
# Workflow failure notification
- name: Notify on failure
  if: failure()
  uses: actions/github-script@v7
  with:
    script: |
      github.rest.issues.create({
        owner: context.repo.owner,
        repo: context.repo.repo,
        title: 'Performance monitoring failed',
        body: 'CI performance monitoring failed. Please investigate.'
      });
```

## 🆘 Getting Help

### Diagnostic Information to Collect

When reporting issues, include:

1. **Environment Details**:
   ```bash
   node --version
   npm --version
   git log -1 --oneline
   ```

2. **CI Logs**: Complete GitHub Actions logs
3. **Local Reproduction**: Can the issue be reproduced locally?
4. **Performance Results**: Include `performance-monitoring-report.json`
5. **Configuration**: Contents of `config/ci-performance-thresholds.json`

### Useful Commands for Investigation

```bash
# Check CI environment setup
./scripts/ci-environment-setup.sh

# Run enhanced performance check
npx tsx scripts/performance-check.ts

# Local CI simulation
export CI=true && npm run test:performance

# Check bundle analysis
npm run build -- --analyze
```

### Contact and Resources

- **Template Repository**: Check issues and discussions
- **GitHub Actions Documentation**: [GitHub Actions Docs](https://docs.github.com/en/actions)
- **Playwright Documentation**: [Playwright Docs](https://playwright.dev/)
- **Performance Monitoring**: Review `docs/features/performance-tools.md`

---

**Last Updated**: July 22, 2025  
**Story**: TEMP-016 CI/CD Template Reliability  
**Version**: 1.0
