# Project Health Monitoring System

This directory contains the comprehensive health monitoring system implemented as part of **SETUP-006 Project Health & Documentation Enhancement**.

## 🎯 Overview

The monitoring system provides automated health checks, technical debt tracking, and performance baseline monitoring to ensure long-term project health and maintainability.

## 📁 Components

### Health Checker (`tools/monitoring/health-check.ts`)
Comprehensive framework health monitoring that checks:
- **Build Health**: TypeScript compilation, build times, ESLint issues
- **Test Health**: Test execution, coverage analysis
- **Performance Health**: Bundle size, FPS baselines
- **Security Health**: Vulnerability scanning, dependency audits
- **Dependency Health**: Package metadata, dependency count, lock files

### Technical Debt Tracker (`tools/monitoring/technical-debt-tracker.ts`)
Scans the codebase for technical debt patterns:
- TODO/FIXME/HACK comments
- Temporary code and disabled features
- Deprecated code usage
- ESLint disable statements
- Categorizes and prioritizes debt items

### Health Monitoring Workflow (`.github/workflows/health-monitoring.yml`)
Automated CI/CD integration:
- Weekly health reports on Sundays
- Triggered on monitoring tool changes
- Manual execution with full scan option
- Generates and stores health report artifacts

## 🚀 Usage

### Manual Health Check
```bash
# Compile monitoring tools
npx tsc tools/monitoring/health-check.ts --outDir tools/monitoring/compiled --target es2022 --module node16 --moduleResolution node16 --allowSyntheticDefaultImports --esModuleInterop
npx tsc tools/monitoring/technical-debt-tracker.ts --outDir tools/monitoring/compiled --target es2022 --module node16 --moduleResolution node16 --allowSyntheticDefaultImports --esModuleInterop

# Run comprehensive health check
node tools/monitoring/compiled/health-check.js

# Run technical debt scan
node tools/monitoring/compiled/technical-debt-tracker.js

# Or use the convenience script (handles compilation automatically)
./scripts/generate-health-report.sh
```

### Automated Monitoring
The system runs automatically:
- **Weekly**: Every Sunday at 6 AM UTC
- **On Changes**: When monitoring tools are modified
- **Manual**: Via GitHub Actions workflow dispatch

### Reading Reports
Health reports are available as GitHub Actions artifacts:
1. Go to Actions tab in GitHub
2. Find the "Health Monitoring" workflow
3. Download the latest health report artifact

## 📊 Health Scoring

### Overall Health Score
- **90-100**: Excellent health 🟢
- **75-89**: Good health 🟡
- **50-74**: Warning state 🟠
- **0-49**: Critical issues 🔴

### Individual Check Scoring
Each health check (build, tests, performance, security, dependencies) is scored individually:
- Issues reduce the score based on severity
- Critical issues can reduce score to 0
- Multiple minor issues accumulate

## 🎯 Performance Baselines

### Environment-Specific Thresholds

| Metric | CI Environment | Local Development | Production Target |
|--------|---------------|-------------------|-------------------|
| Min FPS | 2 | 30 | 55 |
| Avg FPS | 10 | 55 | 60 |
| Build Time | 10 minutes | 30 seconds | N/A |
| Memory Limit | 512MB | 256MB | 128MB |
| Load Time | 30 seconds | 1 second | 3 seconds |

### Regression Detection
- **Minor Regression**: 5-10% performance decrease (investigate)
- **Moderate Regression**: 10-20% performance decrease (must fix)
- **Major Regression**: 20%+ performance decrease (blocks release)

## 🏗️ Technical Debt Management

### Debt Categories
- **Code Quality**: FIXME, HACK, ESLint disables
- **Feature**: TODO comments for planned features
- **Temporary**: Temporary code and disabled features
- **Maintenance**: Deprecated code usage
- **Performance**: Performance-related debt
- **Security**: Security-related technical debt

### Severity Levels
- **High**: FIXME, HACK, deprecated usage
- **Medium**: TODO, temporary code
- **Low**: ESLint disables, temporary comments

### Acceptable Debt Limits
- TODO comments: ≤10
- Temporary fixes: ≤5
- Deprecated code: 0
- High-severity items: ≤3

## 🔧 Configuration

### Health Check Configuration
Edit `tools/monitoring/health-check.ts` to adjust:
- Health score thresholds
- Performance baselines
- Check timeouts and limits

### Technical Debt Configuration
Edit `tools/monitoring/technical-debt-tracker.ts` to adjust:
- Debt pattern matching
- File inclusion/exclusion rules
- Severity mappings
- Category classifications

### Workflow Configuration
Edit `.github/workflows/health-monitoring.yml` to adjust:
- Execution schedule (currently weekly)
- Artifact retention periods
- Notification settings

## 📈 Monitoring Dashboard

### GitHub Actions Integration
- Health status visible in Actions tab
- Workflow badges show current health
- Artifact downloads for detailed reports

### Local Monitoring
```bash
# Quick health overview
npm run health:check

# Detailed technical debt analysis
npm run health:debt

# Performance baseline generation
npm run health:performance
```

## 🚨 Alerts and Notifications

### Automatic Alerts
The system automatically alerts when:
- Overall health score drops below 50
- Critical security vulnerabilities are found
- High-severity technical debt exceeds limits
- Build or test failures occur

### Manual Review Triggers
Review recommended when:
- Health score drops below 75
- Technical debt increases significantly
- Performance regressions detected
- New high-severity debt introduced

## 📚 Integration with Development Workflow

### Pre-commit Checks
- ESLint prevents new code quality issues
- TypeScript compilation catches type errors
- Performance tests prevent major regressions

### Pull Request Validation
- Health checks run on significant changes
- Technical debt analysis for new contributions
- Performance impact assessment

### Release Gates
- Health score must be above 75 for releases
- No critical security vulnerabilities
- High-severity technical debt below limits

## 🔍 Troubleshooting

### Common Issues

#### Health Check Failures in CI
- Check CI environment performance thresholds
- Verify build and test configurations
- Review artifact logs for specific errors

#### False Positive Debt Detection
- Update pattern matching in technical debt tracker
- Add file exclusions for generated code
- Adjust severity mappings for project context

#### Performance Baseline Variations
- CI performance varies due to shared resources
- Use environment-aware thresholds
- Focus on trends rather than absolute values

### Getting Help
- Review health report artifacts for detailed analysis
- Check workflow logs for execution details
- Update monitoring tool configurations as needed

## 📋 Maintenance

### Regular Tasks
- **Weekly**: Review automated health reports
- **Monthly**: Update performance baselines if improved
- **Quarterly**: Review and adjust debt thresholds
- **As Needed**: Update monitoring patterns for new debt types

### Configuration Updates
When updating monitoring:
1. Test changes locally first
2. Update documentation if behavior changes
3. Consider impact on existing baselines
4. Notify team of significant changes

---

**Last Updated**: July 21, 2025  
**Story**: SETUP-006 Project Health & Documentation Enhancement  
**Maintainer**: Maya (Game Developer)  
**Status**: ✅ Operational
