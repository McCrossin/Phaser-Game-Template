# Platform Constraints & Limitations

## 🚨 Critical Platform Limitations

This document outlines platform-specific constraints that affect development workflow and deployment capabilities for the New Eden Project.

## GitHub Account Type: Individual Developer

### Core Constraint Impact
**Account Type**: Personal GitHub account (McCrossin)  
**Impact**: Limited to features available for individual developers, NOT organization accounts

### Available Features ✅
- GitHub Actions workflows with generous free tier
- GitHub Container Registry (GHCR) for personal repositories
- Docker image publishing to personal namespace
- Dependabot security and vulnerability scanning
- CodeQL security analysis
- Standard CI/CD pipeline capabilities
- GitHub Pages for documentation hosting

### Organization-Only Features ❌
- GitHub Teams for access management
- Organization-level security policies and compliance
- Advanced package management features
- Organization billing and cost management tools
- Enterprise security features
- Organization-level secrets and environment management

## GitHub Container Registry (GHCR) Configuration

### Current Status: ✅ FULLY CONFIGURED
- **Registry URL**: `ghcr.io/mccrossin/new-eden-project`
- **Authentication**: GitHub Actions token with `packages: write` permission
- **Publishing**: Automatic on main branch builds
- **Access**: Public repository allows public image pulls

### Migration Timeline: IMMEDIATE (Already Complete)
The GHCR integration is already functional and requires no additional configuration changes.

### Testing Verification
```bash
# Test image pull (no authentication required for public repos)
docker pull ghcr.io/mccrossin/new-eden-project:latest

# Verify image exists in registry
curl -H "Accept: application/vnd.github+json" \
     https://api.github.com/users/mccrossin/packages/container/new-eden-project/versions
```

## Performance Testing Environment Constraints

### CI Environment (GitHub Actions)
**Hardware Limitations**:
- 2-core CPU, 7GB RAM, 14GB SSD
- No dedicated GPU (software rendering only)
- Network-limited asset loading
- Shared infrastructure with variable performance

**Performance Expectations**:
- Minimum FPS: 2-5 FPS (vs 30+ locally)
- Build time: Up to 10 minutes (vs 30 seconds locally)
- Memory limit: 512MB effective (vs 256MB locally)
- Load times: 30 seconds acceptable (vs 3 seconds locally)

### Local Development Environment
**Target Specifications**:
- Modern development machine (16GB+ RAM, dedicated GPU)
- Direct file system access for fast asset loading
- Consistent 60 FPS performance expectations
- Build times under 30 seconds

### Mobile/Web Performance
**Browser Constraints**:
- WebGL context limitations on older devices
- Memory constraints on mobile devices (1-4GB typical)
- Touch input vs mouse/keyboard differences
- Various screen sizes and aspect ratios

## Security Scanning Limitations

### CodeQL Limitations
- **Language Support**: TypeScript/JavaScript fully supported
- **Custom Rules**: Limited to GitHub's provided rule sets
- **Scanning Frequency**: Triggered on push/PR, not continuous
- **False Positives**: Game-specific patterns may trigger warnings

### Dependabot Constraints
- **Package Sources**: Limited to npm registry
- **Update Frequency**: Daily/weekly maximum
- **Security Advisories**: Dependent on upstream vulnerability databases
- **Auto-merge**: Available but requires careful configuration for game dependencies

## Development Workflow Constraints

### Solo Developer Limitations
- **Code Review**: Self-review only (no mandatory external review)
- **Testing**: Manual testing required, limited automated browser testing
- **Knowledge Transfer**: Single point of failure risk
- **Time Management**: Personal time constraints vs enterprise teams

### Recommended Mitigation Strategies
- **Documentation**: Comprehensive documentation for future contributors
- **Automated Testing**: Maximum automation to reduce manual testing burden
- **Backup Plans**: Multiple deployment targets and recovery strategies
- **Community**: Open source approach to enable community contributions

## Cost and Resource Limitations

### GitHub Free Tier Limits
- **Actions Minutes**: 2,000 minutes/month for private repos (unlimited for public)
- **Storage**: 500MB packages storage (public repos may have higher limits)
- **Bandwidth**: Generally sufficient for indie game development
- **Concurrent Jobs**: 20 concurrent jobs maximum

### Resource Usage Optimization
- **Efficient Builds**: Use Docker layer caching and targeted builds
- **Selective Testing**: Run full test suites only when necessary
- **Asset Optimization**: Minimize asset sizes for faster CI/CD
- **Dependency Management**: Regular dependency cleanup and optimization

## Migration Path for Organization Features

### Future Organization Setup
When the project grows to require organization features:

1. **Create GitHub Organization**
2. **Transfer Repository**: Move from personal to organization account
3. **Update CI/CD**: Modify container registry URLs and permissions
4. **Team Setup**: Configure teams and access controls
5. **Security Policies**: Implement organization-level security requirements

### Migration Checklist
- [ ] Backup all workflows and configurations
- [ ] Test GHCR access with organization account
- [ ] Update all hardcoded repository references
- [ ] Verify security scanning continues to function
- [ ] Update documentation to reflect organization setup

## Troubleshooting Common Platform Issues

### GHCR Permission Errors
**Symptoms**: `403 Forbidden` when pushing images
**Solution**: Verify `packages: write` permission in workflow file

### CI Performance Test Failures
**Symptoms**: Tests expecting >30 FPS fail in CI
**Solution**: Use environment-aware thresholds (2-5 FPS for CI)

### Security Scan False Positives
**Symptoms**: Game-specific code triggers security warnings
**Solution**: Use inline comments to suppress known false positives

### Build Time Optimization
**Symptoms**: CI builds taking >10 minutes
**Solution**: Implement Docker layer caching and incremental builds

## Platform-Specific Development Guidelines

### Individual Developer Best Practices
1. **Self-Reliance**: Design workflows that don't require external approval
2. **Documentation First**: Assume future contributors will need comprehensive docs
3. **Automation Focus**: Automate everything possible to reduce manual overhead
4. **Graceful Degradation**: Build systems that work even when external services fail

### Future Agent Guidelines
1. **ALWAYS** assume individual developer account limitations
2. **NEVER** suggest organization-level features or configurations
3. **VERIFY** that any GitHub features used are available for personal accounts
4. **TEST** configurations against personal account constraints
5. **DOCUMENT** any account-specific requirements clearly

---

**Last Updated**: July 21, 2025  
**Story**: SETUP-006 Project Health & Documentation Enhancement  
**Status**: ✅ Complete  
**Next Review**: When considering organization migration
