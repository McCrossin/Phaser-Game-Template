# Story: GitHub Actions CI Pipeline Failure Troubleshooting

**ID**: TRBL-006  
**Epic**: Production Troubleshooting  
**Priority**: High  
**Estimated Points**: 2  
**Dependencies**: None  
**Type**: Production Troubleshooting Story

## 🚨 CRITICAL PRODUCTION TROUBLESHOOTING STORY NOTICE

**🔒 THIS IS A PRODUCTION TROUBLESHOOTING STORY - NEVER EDIT 🔒**

This story is designed for **REPEATED USE** across game projects when GitHub Actions CI pipeline fails. Follow the procedures exactly as written.

**⚠️ CRITICAL RULE**: If you're troubleshooting a feature implementation that broke the CI pipeline:

1. Use THIS story for systematic debugging procedures
2. Reference the ORIGINAL feature implementation story for context
3. Make ALL fixes and updates in the ORIGINAL feature story - NEVER edit this troubleshooting story
4. Keep this story clean and unchanged for future troubleshooting sessions

## Description

Systematic troubleshooting procedure for GitHub Actions CI pipeline failures in game projects. This includes workflow configuration errors, dependency installation failures, test execution issues, and deployment problems.

### Player Experience Goal

Maintain reliable automated testing and deployment to ensure game quality and prevent regressions from reaching players.

### Technical Overview

Diagnose and resolve CI pipeline issues using GitHub Actions logs, workflow analysis, and systematic debugging approaches.

## Acceptance Criteria

### Functional Requirements

- [ ] CI pipeline executes successfully without failures
- [ ] All workflow steps complete within expected timeframes
- [ ] Tests pass consistently in CI environment
- [ ] Build and deployment processes work correctly
- [ ] Artifacts are generated and stored properly

### Technical Requirements

- [ ] GitHub Actions workflows are syntactically correct
- [ ] Dependencies install successfully in CI environment
- [ ] Environment variables and secrets are properly configured
- [ ] Caching strategies work effectively
- [ ] Parallel job execution completes successfully

### Game Design Requirements

- [ ] Game builds successfully in CI environment
- [ ] Automated tests validate game functionality
- [ ] Performance tests meet thresholds in CI
- [ ] Security scans pass without critical issues

## Technical Specifications

### Architecture Context

GitHub Actions CI pipeline automates testing, building, and deployment processes. Pipeline failures prevent code integration and can block development progress.

### Files to Create/Modify

- `.github/workflows/ci.yml`: Main CI workflow
- `.github/workflows/performance-advanced.yml`: Performance testing workflow
- `.github/workflows/security-scan.yml`: Security scanning workflow
- `.github/workflows/health-monitoring.yml`: Health monitoring workflow
- `package.json`: Scripts and dependencies for CI
- CI-specific configuration files

### Key Classes and Interfaces

```typescript
interface CIWorkflowResult {
    success: boolean;
    duration: number;
    failedJobs: string[];
    errors: WorkflowError[];
    artifacts: Artifact[];
}

interface WorkflowConfiguration {
    triggers: string[];
    jobs: Job[];
    environment: Record<string, string>;
    secrets: string[];
    matrix: MatrixConfig;
}

interface JobResult {
    name: string;
    status: 'success' | 'failure' | 'cancelled';
    duration: number;
    steps: StepResult[];
}
```

### Integration Points

- **GitHub Actions**: CI/CD platform
- **Node.js Environment**: Runtime for build and test execution
- **Package Managers**: npm for dependency management
- **Testing Frameworks**: Vitest, Playwright for automated testing
- **Build Tools**: Vite for production builds

### Performance Requirements

- CI pipeline completes within 15 minutes
- Individual jobs complete within 10 minutes
- Test execution under 5 minutes
- Build process under 3 minutes

## Implementation Tasks

### 1. Analyze CI Pipeline Failure Logs

**Estimated Time**: 30 minutes

Review GitHub Actions logs to understand the specific failure points.

**Technical Details**:

```bash
# Access GitHub Actions tab in repository
# Click on failed workflow run
# Review job logs and error messages
# Check workflow run annotations
# Identify failed steps and error patterns
```

**Failure Analysis**:

- Identify which job/step failed
- Note specific error messages and exit codes
- Check for environment-specific issues
- Review timing and resource usage

### 2. Categorize CI Pipeline Failures

**Estimated Time**: 15 minutes

Classify the type of CI failure to apply appropriate resolution strategy.

**Technical Details**:

**Workflow Configuration Errors**:

- YAML syntax errors in workflow files
- Invalid job dependencies or matrix configurations
- Incorrect trigger conditions
- Missing required workflow permissions

**Dependency Installation Failures**:

- npm install failures or timeout issues
- Package version conflicts in CI environment
- Network connectivity problems
- Cache corruption or invalidation issues

**Test Execution Failures**:

- Unit test failures in CI environment
- E2E test failures due to environment differences
- Performance test threshold failures
- Test timeout issues

**Build and Deployment Failures**:

- TypeScript compilation errors in CI
- Asset processing failures
- Build artifact generation problems
- Deployment authentication or permission issues

### 3. Debug Workflow Configuration

**Estimated Time**: 45 minutes

Fix workflow configuration issues and validate YAML syntax.

**Technical Details**:

**Validate Workflow Syntax**:

```yaml
# Check YAML syntax and GitHub Actions schema
# Use GitHub's workflow editor for validation
# Verify job dependencies and matrix configurations
# Ensure proper indentation and structure
```

**Fix Common Configuration Issues**:

```yaml
name: Game CI Pipeline

on:
    pull_request:
        branches: [main, develop]
    push:
        branches: [main, develop]

jobs:
    test:
        runs-on: ubuntu-latest
        timeout-minutes: 10

        steps:
            - name: Checkout code
              uses: actions/checkout@v4

            - name: Setup Node.js
              uses: actions/setup-node@v4
              with:
                  node-version: '22.17.1'
                  cache: 'npm'
```

**Check Permissions and Secrets**:

```yaml
permissions:
    contents: read
    packages: write
    security-events: write

env:
    NODE_ENV: ci
    GITHUB_TOKEN: ${{ secrets.GITHUB_TOKEN }}
```

### 4. Resolve Dependency Installation Issues

**Estimated Time**: 1 hour

Fix dependency installation problems in CI environment.

**Technical Details**:

**Update package.json for CI**:

```json
{
    "scripts": {
        "ci:install": "npm ci --prefer-offline --no-audit",
        "ci:build": "npm run build",
        "ci:test": "npm run test:ci"
    }
}
```

**Fix Caching Issues**:

```yaml
- name: Cache node modules
  uses: actions/cache@v3
  with:
      path: ~/.npm
      key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
      restore-keys: |
          ${{ runner.os }}-node-
```

**Handle Network and Timeout Issues**:

```yaml
- name: Install dependencies
  run: |
      npm ci --prefer-offline --no-audit --timeout=300000
  timeout-minutes: 5
```

### 5. Fix Test Execution Problems

**Estimated Time**: 1.5 hours

Resolve test failures specific to CI environment.

**Technical Details**:

**Environment-Specific Test Configuration**:

```json
// package.json
{
    "scripts": {
        "test:ci": "vitest run --reporter=verbose --coverage",
        "test:e2e:ci": "playwright test --reporter=github"
    }
}
```

**Update Test Configuration for CI**:

```typescript
// vitest.config.ci.ts
export default defineConfig({
    test: {
        environment: 'node',
        timeout: 30000,
        threads: false, // Disable threading in CI
        coverage: {
            reporter: ['text', 'json', 'html']
        }
    }
});
```

**Fix E2E Test CI Issues**:

```yaml
- name: Install Playwright browsers
  run: npx playwright install --with-deps

- name: Run E2E tests
  run: npm run test:e2e:ci
  env:
      CI: true
```

### 6. Resolve Build and Deployment Issues

**Estimated Time**: 1 hour

Fix build process and deployment problems in CI.

**Technical Details**:

**CI-Specific Build Configuration**:

```typescript
// vite.config.ci.ts
export default defineConfig({
    build: {
        sourcemap: false, // Disable source maps in CI for speed
        minify: true,
        target: 'es2022'
    },
    test: {
        environment: 'node'
    }
});
```

**Update CI Scripts**:

```yaml
- name: Build project
  run: npm run build
  env:
      NODE_ENV: production

- name: Upload build artifacts
  uses: actions/upload-artifact@v3
  with:
      name: build-artifacts
      path: dist/
```

**Fix Deployment Authentication**:

```yaml
- name: Deploy to staging
  run: npm run deploy:staging
  env:
      DEPLOY_TOKEN: ${{ secrets.DEPLOY_TOKEN }}
      STAGING_URL: ${{ secrets.STAGING_URL }}
```

### 7. Validate CI Pipeline Fixes

**Estimated Time**: 30 minutes

Ensure the CI pipeline runs successfully with all fixes applied.

**Technical Details**:

```bash
# Trigger CI pipeline by pushing changes
git add .
git commit -m "fix: resolve CI pipeline issues"
git push origin feature/ci-fix

# Monitor GitHub Actions workflow execution
# Verify all jobs complete successfully
# Check that artifacts are generated correctly
# Validate deployment processes work
```

**Validation Steps**:

- Monitor complete workflow execution
- Verify all jobs pass successfully
- Check execution times are within limits
- Validate artifacts and reports are generated

## Game Design Context

### GDD References

- **Quality Standards**: CI pipeline ensures game meets quality requirements
- **Testing Requirements**: Automated validation of game functionality
- **Performance Standards**: CI validates performance benchmarks

### Balance Parameters

```typescript
const CI_CONFIGURATION = {
    timeouts: {
        workflow: 900, // 15 minutes total
        job: 600, // 10 minutes per job
        step: 300, // 5 minutes per step
        test: 180 // 3 minutes for tests
    },
    retries: {
        flaky_tests: 2, // Retry flaky tests twice
        network_ops: 3, // Retry network operations
        build_failures: 1 // Retry build once
    },
    parallelism: {
        test_jobs: 2, // Run 2 test jobs in parallel
        matrix_size: 4 // Maximum matrix size
    }
};
```

### Visual/Audio Requirements

- **CI Reports**: Clear, readable workflow status and reports
- **Artifact Visualization**: Generated build and test artifacts

## Testing Requirements

### Unit Tests

- CI workflow configuration validation
- Script execution validation in CI environment
- Dependency resolution testing

### Integration Tests

- **Full Pipeline Integration**: Complete CI workflow execution
- **Multi-Job Coordination**: Job dependencies and artifact passing
- **Environment Integration**: CI environment setup and teardown

### Performance Tests

- **Pipeline Speed**: CI completes within time limits
- **Resource Usage**: Memory and CPU usage within CI limits
- **Parallel Execution**: Concurrent jobs complete successfully

### Gameplay Testing

- [ ] Game builds successfully in CI environment
- [ ] All automated tests pass in CI
- [ ] Performance benchmarks meet thresholds
- [ ] Security scans complete without critical issues
- [ ] Deployment processes work correctly

## Dependencies

### Prerequisite Stories

- None - This is a standalone troubleshooting procedure

### System Dependencies

- **GitHub Actions**: CI/CD platform
- **Node.js**: Runtime environment for builds and tests
- **npm**: Package manager for dependencies
- **Browser Dependencies**: For E2E test execution

### Asset Dependencies

- **Workflow Files**: GitHub Actions workflow configurations
- **Scripts**: CI-specific build and test scripts
- **Secrets**: Environment variables and authentication tokens

## Definition of Done

- [ ] CI pipeline failure root cause identified
- [ ] Workflow configuration issues resolved
- [ ] Dependency installation problems fixed
- [ ] Test execution issues resolved
- [ ] Build and deployment problems fixed
- [ ] Complete CI pipeline executes successfully
- [ ] All jobs complete within expected timeframes
- [ ] Artifacts are generated correctly
- [ ] CI performance meets requirements
- [ ] Documentation updated with CI improvements

## CI Pipeline Troubleshooting Quick Reference

### Common CI Failures and Solutions

1. **Workflow Configuration Errors**

    ```yaml
    # Fix YAML syntax errors
    # Validate indentation and structure
    # Check job dependencies
    # Verify trigger conditions
    ```

2. **Dependency Installation Failures**

    ```yaml
    - name: Install dependencies
      run: npm ci --prefer-offline --no-audit
      timeout-minutes: 5
    ```

3. **Test Failures in CI**

    ```json
    // Add CI-specific test configuration
    "test:ci": "vitest run --reporter=verbose"
    ```

4. **Build Issues**

    ```bash
    # Check build scripts for CI compatibility
    npm run build:ci
    ```

5. **Caching Problems**
    ```yaml
    # Clear and rebuild cache
    - uses: actions/cache@v3
      with:
          path: ~/.npm
          key: ${{ runner.os }}-node-${{ hashFiles('**/package-lock.json') }}
    ```

### CI Debugging Commands

```bash
# Local simulation of CI environment
npm ci --prefer-offline --no-audit
npm run validate

# Check workflow syntax
# Use GitHub's workflow editor

# Monitor CI execution
# Check GitHub Actions logs

# Debug specific CI script
npm run ci:test -- --verbose

# Validate CI configuration
npm run ci:validate
```

## 🔒 CRITICAL REMINDER

**NEVER EDIT THIS TROUBLESHOOTING STORY**

This is a production troubleshooting procedure designed for repeated use. If troubleshooting a feature implementation that broke the CI pipeline:

1. ✅ **Use this story** for systematic debugging steps
2. ✅ **Reference the original feature story** for context of what was changed
3. ✅ **Make all fixes in the original feature story** based on findings here
4. ❌ **Never modify this troubleshooting story** - keep it clean for future use

Remember: The goal is to identify CI issues using this systematic approach, then apply fixes in the appropriate implementation stories.
