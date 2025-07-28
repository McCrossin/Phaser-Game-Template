# Template Quality Assurance System

The Phaser Game Template includes a comprehensive quality assurance system that validates code quality, security, performance, documentation, and template cleanliness according to professional development standards.

## Overview

The quality assurance system consists of several components:

- **Template Auditor**: Core audit engine that validates template quality across multiple categories
- **Artifact Cleaner**: Removes development artifacts and optimizes template structure
- **Report Generator**: Creates professional audit reports in multiple formats
- **CLI Interface**: User-friendly command-line interface for audit execution

## Quick Start

### Basic Template Audit

```bash
# Run basic quality audit
npm run audit:template

# Run comprehensive audit with cleanup
npm run audit:template:full

# Preview what would be cleaned (safe mode)
npm run audit:template:dry-run
```

### Quality Thresholds

The system uses professional quality thresholds:

- **Minimum Passing Score**: 88%
- **Professional Grade**: 92%
- **Excellent Quality**: 96%

## Audit Categories

### 1. Code Quality (25% weight)

- **TypeScript Strict Mode**: All files compile without errors
- **ESLint Compliance**: Zero warnings or errors
- **Test Coverage**: Minimum 80% unit test coverage
- **Code Complexity**: Acceptable cyclomatic complexity
- **Type Safety**: Minimal use of 'any' type

### 2. Documentation (20% weight)

- **README Completeness**: All essential sections present
- **Documentation Accuracy**: Content matches implementation
- **Link Validation**: All links are accessible
- **API Documentation**: Public APIs documented with TSDoc
- **Setup Instructions**: Clear developer onboarding

### 3. Security (20% weight)

- **Dependency Security**: No high/critical vulnerabilities
- **Security Configuration**: Proper security headers
- **Sensitive Data**: No hardcoded secrets
- **File Permissions**: Appropriate security permissions

### 4. Performance (15% weight)

- **60 FPS Target**: Stable frame rate performance
- **Bundle Size**: Under 5MB production bundle
- **Load Time**: Under 2 seconds initial load
- **Memory Usage**: Efficient memory management
- **Asset Optimization**: Compressed and optimized assets

### 5. Template Cleanup (20% weight)

- **Unused Dependencies**: Clean package.json
- **Backup Files**: No .bak, .tmp files
- **Dead Code**: Under 2% unused code
- **Configuration**: Clean config files
- **Placeholders**: Template scaffolding removed
- **System Files**: No .DS_Store, Thumbs.db

## Available Commands

### Audit Commands

```bash
# Basic template audit (console output)
npm run audit:template

# Full audit with cleanup and verbose output
npm run audit:template:full

# Dry run - show what would be done without changes
npm run audit:template:dry-run

# Quality audit only (no cleanup)
npm run audit:quality
```

### Cleanup Commands

```bash
# Clean development artifacts
npm run cleanup:template

# Preview cleanup (safe mode)
npm run cleanup:template:dry-run
```

### Advanced Usage

```bash
# Custom configuration
npx tsx tools/quality-assurance/run-template-audit.ts --config=custom-audit.json

# Specific output formats
npx tsx tools/quality-assurance/run-template-audit.ts --html-only
npx tsx tools/quality-assurance/run-template-audit.ts --json-only

# Verbose output with all details
npx tsx tools/quality-assurance/run-template-audit.ts --verbose
```

## Report Formats

### Console Output
Real-time feedback during audit execution with summary results.

### HTML Report
Professional web-based report with:
- Executive summary with visual score indicators
- Detailed category breakdowns
- Interactive findings and recommendations
- Responsive design for desktop and mobile

### JSON Report
Machine-readable audit data for integration with other tools:
- Complete audit results
- Structured findings and recommendations
- Performance metrics and timing data

### Markdown Report
Documentation-friendly format for inclusion in project docs:
- GitHub-compatible markdown
- Table-formatted results
- Linked recommendations

## Configuration

### Custom Audit Configuration

Create a custom audit configuration file:

```json
{
  "auditCategories": [
    {
      "name": "Custom Category",
      "description": "Custom validation category",
      "criteria": [...],
      "weight": 25,
      "requiredScore": 90,
      "enabled": true
    }
  ],
  "qualityThresholds": {
    "overall": {
      "minimum": 85,
      "professional": 90,
      "excellent": 95
    }
  }
}
```

### Environment Variables

```bash
# Skip cleanup confirmation in CI
export CI=true

# Custom report output directory
export AUDIT_OUTPUT_DIR="./custom-reports"

# Disable colored output
export NO_COLOR=1
```

## Integration with CI/CD

### GitHub Actions

```yaml
name: Template Quality Audit
on: [push, pull_request]

jobs:
  quality-audit:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: '18'
      - run: npm ci
      - run: npm run audit:template:dry-run
      - run: npm run audit:quality
```

### Pre-commit Hook

```bash
# Add to .husky/pre-commit
npm run audit:quality
```

## Troubleshooting

### Common Issues

**TypeScript Compilation Errors**
```bash
# Fix TypeScript issues
npm run typecheck
npm run lint:fix
```

**Test Coverage Below Threshold**
```bash
# Run tests with coverage
npm run test:coverage
# Add tests for uncovered files
```

**Security Vulnerabilities**
```bash
# Fix security issues
npm audit fix
npm run security:check:local
```

**Performance Issues**
```bash
# Check performance metrics
npm run performance:check
npm run test:performance
```

### Debug Mode

Enable verbose logging for troubleshooting:

```bash
npm run audit:template:full -- --verbose
```

### Recovery

If cleanup causes issues, restore from backup:

```bash
# Backups are automatically created in backup-cleanup-YYYY-MM-DD/
# Restore manually if needed
```

## Best Practices

### Before Using Template

1. Run full audit with cleanup:
   ```bash
   npm run audit:template:full
   ```

2. Review generated reports in `reports/quality-assurance/`

3. Address critical and high-priority recommendations

4. Verify final quality score meets your standards

### During Development

1. Run quick quality checks:
   ```bash
   npm run audit:quality
   ```

2. Monitor quality metrics in CI/CD

3. Address issues promptly to maintain quality

### Template Maintenance

1. Run periodic comprehensive audits
2. Update quality thresholds as standards evolve
3. Review and update audit criteria regularly
4. Monitor quality trends over time

## Advanced Topics

### Custom Audit Criteria

Extend the audit system with custom criteria:

```typescript
// tools/quality-assurance/custom-criteria.ts
export class CustomCriterion implements AuditCriterion {
  async validate(): Promise<CriterionResult> {
    // Custom validation logic
  }
}
```

### Quality Metrics Dashboard

Generate quality trends dashboard:

```bash
# Generate historical quality report
npx tsx tools/quality-assurance/generate-trends.ts
```

### Integration with External Tools

- **SonarQube**: Export results to SonarQube format
- **CodeClimate**: Integration with CodeClimate quality metrics
- **Custom Webhooks**: Send audit results to external systems

## Support

For issues with the quality assurance system:

1. Check the [troubleshooting guide](#troubleshooting)
2. Review the generated reports for detailed findings
3. Use verbose mode for detailed debugging information
4. Check the [GitHub repository](https://github.com/McCrossin/Phaser-Game-Template) for known issues

---

*Part of the Phaser Game Template Quality Assurance System*
