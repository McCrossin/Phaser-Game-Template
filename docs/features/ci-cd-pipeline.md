# CI/CD Pipeline Setup Guide

**Overview**: Professional automated testing and deployment pipeline using GitHub Actions for game development projects.

## 🎯 What's Included

The CI/CD pipeline provides:

- **Automated Testing**: Unit tests, integration tests, and performance validation
- **Build Verification**: Cross-platform build testing and artifact generation
- **Quality Checks**: Code linting, security scanning, and dependency audits
- **Deployment Automation**: Staging and production deployment workflows
- **Performance Gates**: Automated performance regression detection

## 🏗️ Pipeline Architecture

### Core Workflows

1. **CI Pipeline** (`.github/workflows/ci.yml`)
   - Security scanning
   - Linting and type checking
   - Unit tests
   - E2E testing
   - Build verification

2. **Health Monitoring** (`.github/workflows/health-monitoring.yml`)
   - Weekly automated health checks
   - Technical debt analysis
   - Performance baseline tracking

3. **Performance Testing** (`.github/workflows/performance-advanced.yml`)
   - Automated performance regression detection
   - FPS benchmarking
   - Memory usage analysis

4. **Security Scanning** (`.github/workflows/security-scan.yml`)
   - Dependency vulnerability scanning
   - Code security analysis
   - Security policy enforcement

## 🚀 Quick Setup

### 1. Repository Configuration

The pipeline works out-of-the-box with this template. No additional configuration required for basic usage.

### 2. Required Secrets (Optional)

For advanced features, add these GitHub repository secrets:

```bash
# For deployment workflows (optional)
DEPLOY_TOKEN=your_deployment_token
STAGING_URL=your_staging_environment_url
PRODUCTION_URL=your_production_environment_url

# For enhanced security scanning (optional)
SNYK_TOKEN=your_snyk_token
CODECOV_TOKEN=your_codecov_token
```

### 3. Branch Protection Rules

Recommended branch protection for `main`:

- Require status checks to pass before merging
- Require branches to be up to date before merging
- Required status checks:
  - `security-scan`
  - `lint-and-typecheck`
  - `unit-tests`
  - `e2e-tests`
  - `build-test`

## ⚙️ Configuration Options

### Environment-Specific Settings

The pipeline automatically detects and configures for different environments:

```yaml
# CI environment detection
- name: Set CI environment
  run: |
    echo "CI=true" >> $GITHUB_ENV
    echo "NODE_ENV=production" >> $GITHUB_ENV
    echo "GITHUB_ACTIONS=true" >> $GITHUB_ENV
```

### Performance Test Configuration

Located in `tests/e2e/performance/game-performance.test.ts`:

```typescript
// Environment-aware thresholds
const PERFORMANCE_THRESHOLDS = {
    minFPS: isCI ? 2 : 5,        // Lower threshold for CI
    avgFPS: isCI ? 10 : 25,      // Realistic CI expectations
    maxLoadTime: isCI ? 30000 : 10000,  // Longer load times allowed in CI
    maxMemoryGrowth: isCI ? 150 : 50,    // More memory growth allowed in CI
    maxMicrofreezes: isCI ? 5 : 2,       // More microfreezes allowed in CI
};
```

### Customizing Node.js Versions

Update the Node.js version across all workflows:

```yaml
- name: Setup Node.js
  uses: actions/setup-node@v4
  with:
    node-version: '22'  # Update this version as needed
    cache: 'npm'
```

## 🎮 Game-Specific Features

### Performance Gates

Automatic performance regression detection:

- **FPS Monitoring**: Ensures game maintains target frame rates
- **Bundle Size Limits**: Prevents bloated builds
- **Memory Usage**: Monitors memory consumption patterns
- **Load Time Analysis**: Tracks game startup performance

### Game Asset Pipeline

- **Asset Optimization**: Automatic image and audio optimization
- **Texture Packing**: Efficient sprite atlas generation
- **Asset Manifest**: Automated asset catalog generation

### Cross-Platform Testing

- **Multiple Browsers**: Chrome, Firefox, Safari testing
- **Device Simulation**: Mobile and tablet viewport testing
- **Performance Validation**: Cross-platform performance verification

## 📊 Monitoring and Reports

### Automated Reports

The pipeline generates several types of reports:

1. **Health Reports**: Weekly comprehensive health analysis
2. **Performance Reports**: FPS, memory, and load time metrics
3. **Security Reports**: Vulnerability scans and dependency audits
4. **Test Coverage**: Code coverage analysis and trends

### Viewing Results

#### GitHub Actions Tab
- Navigate to your repository's **Actions** tab
- View workflow runs and their status
- Download artifacts for detailed reports

#### Health Report Artifacts
- Generated weekly and on monitoring changes
- Contains comprehensive project health analysis
- Available as downloadable artifacts

#### Performance Test Results
- HTML reports with interactive charts
- Frame rate analysis and memory usage graphs
- Available via `npx playwright show-report`

## 🔧 Local Testing

### Testing Pipeline Locally

Before pushing changes, test the pipeline locally:

```bash
# Quick compatibility check
node tools/maintenance/test-github-actions.js --quick

# Full pipeline simulation
node tools/maintenance/test-github-actions.js

# Docker build test only
node tools/maintenance/test-github-actions.js --docker-only
```

### Manual Script Execution

Run individual pipeline components:

```bash
# Linting and type checking
npm run lint
npm run typecheck

# Testing
npm run test:run
npm run test:e2e

# Build verification
npm run build

# Performance testing
npm run test:performance
```

## 🚨 Troubleshooting

### Common Pipeline Issues

#### CI Performance Test Failures
**Symptoms**: Tests pass locally but fail in CI
**Solution**: Use environment-aware thresholds (already configured)

#### Build Failures in CI
**Symptoms**: Build succeeds locally but fails in CI
**Diagnosis**:
- Check Node.js version compatibility
- Verify dependency lock file is committed
- Review memory/timeout limits

#### Permission Issues
**Symptoms**: Deployment or artifact upload failures
**Solution**: Verify GitHub token permissions and repository settings

### Performance Variations

#### Expected CI Limitations
- Lower FPS due to shared resources
- Longer build times in CI environment
- Higher memory usage during testing

#### Monitoring Trends
- Focus on performance trends rather than absolute values
- Use regression detection for significant changes
- Adjust thresholds based on project needs

## 🔄 Deployment Workflows

### Staging Deployment

Automatic deployment to staging on `develop` branch:

```yaml
# .github/workflows/deploy-staging.yml
on:
  push:
    branches: [develop]
```

### Production Deployment

Manual deployment to production with approval:

```yaml
# .github/workflows/deploy-production.yml
on:
  workflow_dispatch:
    inputs:
      environment:
        description: 'Deployment environment'
        required: true
        default: 'production'
```

### Docker Integration

The pipeline includes Docker support:

- **Multi-stage builds**: Optimized production images
- **Security scanning**: Container vulnerability analysis
- **Registry publishing**: Automated image publishing

## 🏆 Best Practices

### Development Workflow

1. **Feature Branches**: Always work in feature branches
2. **Pull Requests**: Use PR workflow for code review
3. **Status Checks**: Wait for all checks before merging
4. **Regular Updates**: Keep dependencies and Node.js version current

### Pipeline Maintenance

1. **Regular Reviews**: Monthly review of pipeline configuration
2. **Performance Baselines**: Update baselines when legitimate improvements are made
3. **Security Updates**: Keep GitHub Actions and dependencies updated
4. **Documentation**: Update this guide when making pipeline changes

### Monitoring

1. **Trend Analysis**: Monitor performance trends over time
2. **Alert Response**: Investigate and resolve pipeline failures promptly
3. **Capacity Planning**: Monitor CI usage and adjust as needed

---

**Last Updated**: July 21, 2025  
**Story**: TEMP-006 Health Monitoring & CI/CD Preservation  
**Status**: ✅ Complete
