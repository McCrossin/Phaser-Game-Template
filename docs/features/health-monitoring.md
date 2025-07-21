# Health Monitoring System

**Overview**: Professional-grade health monitoring and technical debt tracking for game development projects.

## 🎯 What's Included

The health monitoring system provides automated tracking of:

- **Framework Health**: TypeScript compilation, build performance, and ESLint compliance
- **Test Health**: Test execution, coverage analysis, and timing metrics
- **Performance Health**: FPS baselines, memory usage, and bundle size monitoring
- **Security Health**: Vulnerability scanning and dependency audits
- **Technical Debt**: Code quality patterns, complexity analysis, and maintenance alerts

## 🚀 Benefits for Game Development

### Professional Quality Standards
- **Enterprise-grade monitoring** typically found only in AAA studios
- **Automated quality gates** prevent performance regressions
- **Technical debt tracking** keeps your codebase maintainable

### Development Workflow Integration
- **Pre-commit checks** catch issues before they reach the repository
- **CI/CD integration** ensures consistent quality standards
- **Performance monitoring** maintains 60 FPS target for games

### Scalable for Any Project Size
- **Configurable thresholds** adapt to project requirements
- **Environment-aware testing** works in both CI and local development
- **Automated reporting** provides regular health insights

## 🔧 Configuration

### Health Check Configuration

Located in `tools/monitoring/health-check.ts`:

```typescript
interface HealthCheckConfig {
    projectName: string; // Configurable project name
    performanceTargets: {
        buildTime: number; // Max build time (seconds)
        bundleSize: number; // Max bundle size (MB)
        frameRate: number; // Target FPS
    };
    qualityThresholds: {
        testCoverage: number; // Minimum test coverage %
        codeComplexity: number; // Max cyclomatic complexity
        techDebtScore: number; // Max technical debt score
    };
}
```

### Environment-Specific Thresholds

The system automatically adapts thresholds based on environment:

| Metric | CI Environment | Local Development | Production Target |
|--------|---------------|-------------------|-------------------|
| Min FPS | 2 | 30 | 55 |
| Avg FPS | 10 | 55 | 60 |
| Build Time | 10 minutes | 30 seconds | N/A |
| Memory Limit | 512MB | 256MB | 128MB |
| Load Time | 30 seconds | 1 second | 3 seconds |

### Customization Options

1. **Performance Targets**: Adjust FPS and memory thresholds for your game type
2. **Quality Thresholds**: Set minimum test coverage and complexity limits
3. **Debt Patterns**: Configure technical debt detection patterns
4. **Severity Mappings**: Customize issue severity classifications

## 📋 Usage Examples

### Manual Health Check

```bash
# Generate comprehensive health report
./scripts/generate-health-report.sh

# Quick health status
npx tsc tools/monitoring/health-check.ts --outDir tools/monitoring/compiled --target es2022 --module node16 --moduleResolution node16 --allowSyntheticDefaultImports --esModuleInterop
node tools/monitoring/compiled/health-check.js
```

### Technical Debt Analysis

```bash
# Scan for technical debt patterns
npx tsc tools/monitoring/technical-debt-tracker.ts --outDir tools/monitoring/compiled --target es2022 --module node16 --moduleResolution node16 --allowSyntheticDefaultImports --esModuleInterop
node tools/monitoring/compiled/technical-debt-tracker.js
```

### Automated Monitoring

The system runs automatically:
- **Weekly**: Every Sunday at 6 AM UTC via GitHub Actions
- **On Changes**: When monitoring tools are modified
- **Manual**: Via GitHub Actions workflow dispatch

## 🔍 Reading Health Reports

### Health Status Indicators

- ✅ **Healthy (80-100%)**: All systems functioning optimally
- ⚠️ **Warning (60-79%)**: Some issues need attention
- 🚨 **Critical (<60%)**: Immediate action required

### Understanding Metrics

**Build Health**:
- TypeScript compilation status
- Build time performance
- Bundle size analysis

**Test Health**:
- Test execution success rate
- Coverage percentage
- Test timing performance

**Performance Health**:
- FPS baseline compliance
- Memory usage patterns
- Load time analysis

**Security Health**:
- Vulnerability scan results
- Dependency audit status
- Security policy compliance

## 🚨 Alert Thresholds

### Automatic Alerts

The system automatically alerts when:
- Overall health score drops below 50%
- Critical security vulnerabilities are found
- High-severity technical debt exceeds limits
- Build or test failures occur

### Manual Review Triggers

Review recommended when:
- Health score drops below 75%
- Technical debt increases significantly
- Performance regressions detected
- New high-severity debt introduced

## 🔧 Troubleshooting

### Common Issues

**Health Check Failures in CI**:
- Check CI environment performance thresholds
- Verify build and test configurations
- Review artifact logs for specific errors

**False Positive Debt Detection**:
- Update pattern matching in technical debt tracker
- Add file exclusions for generated code
- Adjust severity mappings for project context

**Performance Baseline Variations**:
- CI performance varies due to shared resources
- Use environment-aware thresholds
- Focus on trends rather than absolute values

### Getting Help

- Review health report artifacts for detailed analysis
- Check workflow logs for execution details
- Update monitoring tool configurations as needed

## 🏆 Best Practices

### Development Workflow

1. **Pre-commit**: Run health checks before committing changes
2. **Pull Requests**: Include health impact assessment
3. **Regular Reviews**: Weekly review of automated reports
4. **Trend Monitoring**: Track health trends over time

### Configuration Management

1. **Test Changes Locally**: Verify configuration updates work
2. **Update Documentation**: Keep configuration examples current
3. **Consider Impact**: Assess impact on existing baselines
4. **Team Communication**: Notify team of significant changes

---

**Last Updated**: July 21, 2025  
**Story**: TEMP-006 Health Monitoring & CI/CD Preservation  
**Status**: ✅ Complete
