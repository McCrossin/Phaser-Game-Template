# Production Game Troubleshooting Stories - Complete Index

## 🚨 CRITICAL USAGE INSTRUCTIONS

**These are PRODUCTION TROUBLESHOOTING STORIES designed for REPEATED USE**

### For AI Agents and Developers:

1. **🔒 NEVER EDIT THESE STORIES** - They are standardized procedures for production use
2. **📚 REFERENCE IMPLEMENTATION STORIES** - When troubleshooting broken features, use BOTH:
    - The appropriate troubleshooting story from this collection
    - The original feature implementation story (for context)
3. **✅ FOLLOW SYSTEMATICALLY** - These procedures are tested and validated across projects
4. **🎯 SELECT THE RIGHT STORY** - Choose based on the type of failure you're experiencing
5. **⚠️ MAKE FIXES IN IMPLEMENTATION STORIES ONLY** - Apply fixes in the original implementation stories, never modify these troubleshooting procedures

## Complete Story Collection

### Code Quality & Compilation Troubleshooting

| Story ID     | Title                                                                                               | Use When                                             | Points |
| ------------ | --------------------------------------------------------------------------------------------------- | ---------------------------------------------------- | ------ |
| **TRBL-001** | [TypeScript Compilation Errors Troubleshooting](TRBL-001-typescript-compilation-troubleshooting.md) | TypeScript errors, compilation failures, type issues | 2      |

### Testing System Troubleshooting

| Story ID     | Title                                                                                | Use When                                              | Points |
| ------------ | ------------------------------------------------------------------------------------ | ----------------------------------------------------- | ------ |
| **TRBL-002** | [Unit Test Failures Troubleshooting](TRBL-002-unit-test-failures-troubleshooting.md) | Unit tests fail, Vitest issues, test assertion errors | 2      |
| **TRBL-003** | [E2E Test Failures Troubleshooting](TRBL-003-e2e-test-failures-troubleshooting.md)   | Playwright tests fail, browser automation issues      | 3      |

### Build & Performance Troubleshooting

| Story ID     | Title                                                                                           | Use When                                         | Points |
| ------------ | ----------------------------------------------------------------------------------------------- | ------------------------------------------------ | ------ |
| **TRBL-004** | [Vite Build Failures Troubleshooting](TRBL-004-vite-build-failures-troubleshooting.md)          | Build fails, bundle issues, asset problems       | 2      |
| **TRBL-005** | [Performance Testing Pipeline Troubleshooting](TRBL-005-performance-testing-troubleshooting.md) | Performance tests fail, FPS drops, memory issues | 3      |

### CI/CD Pipeline Troubleshooting

| Story ID     | Title                                                                                                | Use When                                            | Points |
| ------------ | ---------------------------------------------------------------------------------------------------- | --------------------------------------------------- | ------ |
| **TRBL-006** | [GitHub Actions CI Pipeline Troubleshooting](TRBL-006-github-actions-ci-pipeline-troubleshooting.md) | CI pipeline fails, workflow errors, action failures | 2      |

## How to Use This Collection

### 1. Identify Your Issue Type

**Code Quality Issues**: Compilation errors, type issues

- Use **TRBL-001** for TypeScript compilation issues

**Testing Issues**: Test failures, automation problems

- Use **TRBL-002** for unit test failures
- Use **TRBL-003** for E2E test failures

**Build & Performance Issues**: Bundle failures, performance problems

- Use **TRBL-004** for Vite build and bundling issues
- Use **TRBL-005** for performance testing failures

**CI/CD Issues**: Pipeline failures, workflow errors

- Use **TRBL-006** for GitHub Actions CI pipeline failures

### 2. Gather Context

If you're troubleshooting a **feature implementation** that broke something:

1. **Identify the broken system** (compilation, tests, build, CI, etc.)
2. **Locate the original feature story** that was being implemented
3. **Select the appropriate troubleshooting story** from this collection
4. **Use BOTH stories together**:
    - The troubleshooting story provides systematic debugging steps
    - The feature story provides context about what changes were made

### 3. Follow the Systematic Process

Each troubleshooting story follows this structure:

1. **Analyze** - Understand the failure
2. **Categorize** - Identify the type of issue
3. **Reproduce** - Replicate the problem locally
4. **Debug** - Apply systematic debugging techniques
5. **Fix** - Implement targeted solutions IN THE ORIGINAL IMPLEMENTATION STORY
6. **Validate** - Ensure the fix works and doesn't break other things

### 4. Common Troubleshooting Scenarios

**Scenario**: Feature implementation broke CI pipeline

- **Primary Story**: TRBL-010 (GitHub Actions CI Pipeline Troubleshooting)
- **Context Story**: Original feature implementation story
- **Approach**: Follow TRBL-010 steps while referencing what was changed in the feature story
- **Fix Location**: Apply fixes in the original feature story

**Scenario**: New component causes unit tests to fail

- **Primary Story**: TRBL-003 (Unit Test Failures Troubleshooting)
- **Context Story**: Component implementation story
- **Approach**: Use TRBL-003 debugging steps with context from component changes
- **Fix Location**: Update the component implementation story

**Scenario**: Performance optimization caused E2E test failures

- **Primary Story**: TRBL-005 (E2E Test Failures Troubleshooting)
- **Context Story**: Performance optimization story
- **Approach**: Follow TRBL-005 with understanding of what optimizations were made
- **Fix Location**: Modify the performance optimization story

## Quick Reference Commands

### Diagnostic Commands

```bash
# Compilation Diagnostics
npm run typecheck           # TypeScript validation
npm run build              # Production build

# Testing Diagnostics
npm run test:run           # Unit tests
npm run test:e2e           # E2E tests
npm run test:coverage      # Coverage analysis

# Build Diagnostics
npm run build:analyze      # Bundle analysis
npm run performance:check  # Performance validation

# CI/CD Diagnostics
npm run validate           # Full validation suite
npm run health:check       # System health check
```

### Common Failure Patterns

1. **After Adding New Dependencies**
    - Check: TypeScript compilation (TRBL-001)
    - Check: Build process (TRBL-006)
    - Check: CI pipeline (TRBL-010)

2. **After Implementing New Game Features**
    - Check: Unit tests (TRBL-003)
    - Check: E2E tests (TRBL-005)
    - Check: Performance tests (TRBL-007)

3. **After Configuration Changes**
    - Check: Build system (TRBL-006)
    - Check: TypeScript setup (TRBL-001)
    - Check: CI workflows (TRBL-010)

## Story Maintenance

**🔒 CRITICAL**: These troubleshooting stories should remain stable and not be edited. They represent tested procedures for common issues in game projects.

If you discover new failure patterns or need additional troubleshooting procedures:

1. Document the new pattern
2. Consider if it fits within existing stories
3. If needed, create new troubleshooting stories following the same format
4. Update this index to include new stories
5. **Never modify existing troubleshooting procedures**

## Troubleshooting Story Principles

### 🔒 Never Edit Rule

- These stories are **production-ready procedures**
- They've been tested across multiple projects
- Editing them breaks their reliability for future use
- **All fixes go in implementation stories, not troubleshooting stories**

### 📚 Context Integration

- Always use troubleshooting stories WITH implementation stories
- Troubleshooting stories provide systematic debugging
- Implementation stories provide context of what changed
- Together they enable effective problem resolution

### ✅ Systematic Approach

- Each story follows proven debugging methodologies
- Steps are ordered for maximum efficiency
- Procedures cover both identification and resolution
- Validation ensures fixes don't introduce new issues

## Related Documentation

- [Architecture Overview](../docs/development/brownfield-architecture.md)
- [Testing Framework](../docs/features/testing-framework.md)
- [CI/CD Pipeline](../docs/features/ci-cd-pipeline.md)
- [Performance Tools](../docs/features/performance-tools.md)

---

**Remember**: These are production troubleshooting stories designed for repeated use across game projects. They provide systematic approaches to common issues. Always reference the original implementation story alongside these troubleshooting stories when debugging feature-related issues, and apply all fixes in the implementation stories to keep these troubleshooting procedures clean for future use.
