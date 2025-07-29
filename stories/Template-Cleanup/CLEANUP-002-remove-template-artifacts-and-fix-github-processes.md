# Story: Remove Template Artifacts and Fix GitHub Processes

**ID**: CLEANUP-002  
**Epic**: Template-Cleanup  
**Priority**: High  
**Estimated Points**: 3  
**Dependencies**: CLEANUP-001

## Description

Remove template-specific artifacts and fix GitHub processes that are currently running template cleanup scripts during commits and pushes. This story focuses on cleaning up template-specific npm scripts, Husky git hooks, GitHub workflows, and development tools that are designed for template maintenance rather than game development.

### Player Experience Goal

Developers will have a clean git workflow without template-specific validation scripts running on every commit and push. The development experience will be faster and more focused on game development rather than template maintenance.

### Technical Overview

Systematically identify and remove template-specific scripts, tools, and GitHub processes while preserving essential game development workflows. Update git hooks to focus on game development validation only, and remove template audit and cleanup systems that are no longer needed.

## Acceptance Criteria

### Functional Requirements

- [x] Template-specific npm scripts are removed from package.json
- [x] Husky git hooks are updated to focus on game development only
- [x] Template audit and cleanup tools are removed
- [x] GitHub workflows no longer reference template-specific processes
- [x] Git commit and push processes are streamlined for game development
- [x] Essential game development validation remains intact
- [x] Performance monitoring scripts are simplified for game-specific needs
- [x] All removed template artifacts are documented

### Technical Requirements

- [x] No linting errors or warnings after cleanup
- [x] Git hooks execute successfully with game development focus
- [x] GitHub workflows run without template-specific errors
- [x] Package.json scripts are valid and functional
- [x] TypeScript compilation succeeds for remaining scripts
- [x] Essential development tools (lint, test, build) continue to work
- [x] No broken script references in workflows or hooks
- [x] Pre-commit and pre-push hooks complete in reasonable time (<60s)

### Game Design Requirements

- [x] Game development workflow remains uninterrupted
- [x] Essential quality gates for game code are preserved
- [x] Performance validation for game-specific metrics maintained
- [x] Asset pipeline validation continues to work
- [x] Cross-platform game testing processes preserved

## AI Agent Handoff Strategy

This story is designed for **multi-agent collaboration** with 6 clearly defined handoff points. Each agent should complete their assigned task(s) and document results before the next agent continues.

### 🔄 Agent Handoff Points Summary:

1. **Task 1 Completion**: Template artifact audit and removal strategy
2. **Task 2 Completion**: Package.json cleanup and script validation
3. **Task 3 Completion**: Husky hooks update and testing
4. **Task 4 Completion**: GitHub workflow cleanup and validation
5. **Task 5 Completion**: Tool and script removal with documentation
6. **Final Validation**: Complete workflow testing and handoff preparation

**CRITICAL**: Each agent must verify zero linting errors and functional git workflows before handoff to the next agent.

## Technical Specifications

### Architecture Context

This cleanup removes template maintenance infrastructure while preserving all game development capabilities. The focus is on eliminating template-specific validation, audit, and cleanup processes that interfere with normal game development workflows.

### Files to Create/Modify

#### Package.json Script Cleanup

- `package.json`: Remove template-specific scripts and update descriptions
- **Remove Scripts**: `audit:template`, `audit:template:full`, `health:check`, `health:report`, template cleanup scripts
- **Update Scripts**: Simplify validation scripts for game development focus

#### Husky Git Hooks Update

- `.husky/pre-commit`: Streamline for game development validation only
- `.husky/pre-push`: Focus on essential game quality checks
- `.husky/commit-msg`: Remove or simplify commit message validation

#### GitHub Workflow Cleanup

- `.github/workflows/ci.yml`: Remove template-specific validation steps
- `.github/workflows/deploy-simple.yml`: Ensure no template artifact references
- **Remove References**: Template audit calls, health check validations

#### Template Tool Removal

- `tools/quality-assurance/`: Remove or archive template-specific audit tools
- `tools/monitoring/health-check.ts`: Remove or simplify for game metrics only
- `scripts/performance-check.ts`: Update for game performance focus only

#### Documentation Updates

- Document removed template artifacts for future reference
- Update development workflow documentation
- Create migration notes for template-to-game transition

### Key Interfaces and Scripts

```typescript
// Simplified game development validation interface
interface GameValidationConfig {
    lint: boolean;
    typecheck: boolean;
    unitTests: boolean;
    buildValidation: boolean;
    gamePerformance?: boolean;
}

// Updated package.json scripts structure
interface GameDevScripts {
    // Core development
    dev: string;
    build: string;
    preview: string;

    // Testing
    test: string;
    'test:watch': string;
    'test:coverage': string;

    // Quality
    lint: string;
    'lint:fix': string;
    format: string;
    typecheck: string;

    // Game-specific
    'game:validate': string; // Simplified validation
    'game:performance': string; // Game performance only
}
```

### Integration Points

- **Git Hooks**: Streamlined pre-commit and pre-push validation
- **GitHub Actions**: Game development focused CI/CD only
- **Build System**: Remove template-specific build steps
- **Development Tools**: Preserve game development essentials only

### Performance Requirements

- Pre-commit hooks complete in <30 seconds
- Pre-push validation completes in <60 seconds
- GitHub workflows run faster without template overhead
- Game development validation remains comprehensive but efficient

## Implementation Tasks

### 1. Audit Template-Specific Artifacts

✅ **COMPLETED** - Identified all template-specific scripts, tools, and processes that need to be removed or updated.

**Estimated Time**: 2 hours
**Technical Details**:

- ✅ Reviewed package.json for template-specific scripts
- ✅ Identified template audit and cleanup tools in tools/ directory
- ✅ Documented Husky hook template-specific validations
- ✅ Mapped GitHub workflow template dependencies
- ✅ Created removal strategy and documentation plan

**🔄 AI AGENT HANDOFF POINT 1**: After completing audit, document:

- ✅ Complete list of template artifacts to remove
- ✅ Impact analysis for each removal
- ✅ Updated workflow strategy for game development
  **NEXT AGENT**: Should review audit results before proceeding with package.json cleanup

### 2. Clean Up Package.json Scripts

✅ **COMPLETED** - Removed template-specific scripts and updated remaining scripts for game development focus.

**Estimated Time**: 2 hours
**Technical Details**:

- ✅ Removed template audit scripts: `audit:template`, `audit:template:full`
- ✅ Removed health check scripts: `health:check`, `health:report`
- ✅ Removed template cleanup scripts and complex validation chains
- ✅ Updated script descriptions to reflect game development focus
- ✅ Simplified validation scripts to essential game development checks
- ✅ Ensured all remaining scripts are functional and lint-free

**🔄 AI AGENT HANDOFF POINT 2**: After package.json cleanup, validate:

- ✅ All remaining scripts execute without errors
- ✅ No broken script references
- ✅ Package.json passes JSON validation
  **NEXT AGENT**: Should test npm scripts before updating Husky hooks

### 3. Update Husky Git Hooks

✅ **COMPLETED** - Streamlined git hooks to focus on game development validation without template overhead.

**Estimated Time**: 2 hours
**Technical Details**:

- ✅ Updated `.husky/pre-commit` to remove template-specific validations
- ✅ Simplified pre-commit to: lint-staged, typecheck, essential unit tests
- ✅ Updated `.husky/pre-push` to focus on game build validation only
- ✅ Removed or simplified `.husky/commit-msg` if not needed for game development
- ✅ Test hooks execute in reasonable time (<60s total)
- ✅ Ensured hooks work with updated package.json scripts

**🔄 AI AGENT HANDOFF POINT 3**: After updating hooks, verify:

- ✅ Pre-commit hook executes successfully in <30s
- ✅ Pre-push hook executes successfully in <60s
- ✅ No template-specific script references remain
  **NEXT AGENT**: Should test git workflow before cleaning GitHub workflows

### 4. Clean Up GitHub Workflows

✅ **COMPLETED** - Removed template-specific steps from GitHub workflows and ensured smooth CI/CD for game development.

**Estimated Time**: 1.5 hours
**Technical Details**:

- ✅ Removed template audit calls from `.github/workflows/ci.yml`
- ✅ Removed health check validations and template performance checks
- ✅ Updated workflow to focus on game-specific validation only
- ✅ Ensured `deploy-simple.yml` has no template artifact references
- ✅ Test workflows run without template-specific errors
- ✅ Verified essential game development validation is preserved

**🔄 AI AGENT HANDOFF POINT 4**: After workflow cleanup, validate:

- ✅ GitHub workflows pass YAML validation
- ✅ Workflows execute without template-specific errors
- ✅ Game development CI/CD functionality preserved
  **NEXT AGENT**: Should test GitHub workflows before removing template tools

### 5. Remove Template Tools and Scripts

✅ **COMPLETED** - Removed or archived template-specific tools and development scripts that are no longer needed.

**Estimated Time**: 2 hours
**Technical Details**:

- ✅ Removed or archived `tools/quality-assurance/run-template-audit.ts`
- ✅ Removed or simplified `tools/monitoring/health-check.ts` for game metrics only
- ✅ Updated `scripts/performance-check.ts` to focus on game performance
- ✅ Removed template-specific test files and exclusions
- ✅ Documented removed tools for future reference
- ✅ Ensured no broken imports or references remain

**🔄 AI AGENT HANDOFF POINT 5**: After tool removal, verify:

- ✅ No broken TypeScript imports or references
- ✅ All remaining tools compile and execute successfully
- ✅ Documentation of removed artifacts is complete
  **NEXT AGENT**: Should perform final comprehensive testing

### 6. Final Testing and Documentation

✅ **COMPLETED** - Comprehensive testing of the cleaned-up development workflow and documentation of changes.

**Estimated Time**: 1.5 hours
**Technical Details**:

- ✅ Test complete git workflow: commit → push → GitHub CI
- ✅ Verified all npm scripts work correctly
- ✅ Test development workflow: `npm install` → `npm run dev` → `npm run build`
- ✅ Validated GitHub workflows execute successfully
- ✅ Documented all removed template artifacts
- ✅ Created migration notes for future template updates

**🔄 AI AGENT HANDOFF POINT 6 - FINAL VALIDATION**: After testing, provide comprehensive report:

- ✅ Git workflow validation results
- ✅ GitHub CI/CD pipeline test results
- ✅ Complete list of removed template artifacts
- ✅ Updated development workflow documentation
  **STORY COMPLETION**: Mark story as ready for code review and final handoff

## Testing Requirements

### Unit Tests

- `testing/core/unit/workflow.test.ts`: Verify cleaned-up scripts work correctly
- `testing/core/unit/build.test.ts`: Test build system integration without template overhead

### Integration Tests

- **Git Workflow**: Test commit and push process with updated hooks
- **GitHub CI/CD**: Verify workflows execute successfully without template steps
- **Development Workflow**: Test complete dev setup with simplified scripts

### Performance Tests

- **Hook Performance**: Pre-commit hooks complete in <30s, pre-push in <60s
- **CI/CD Performance**: Workflows run faster without template overhead
- **Development Speed**: No impact on game development workflow speed

### Workflow Testing

- [ ] Git commit process executes successfully with updated hooks
- [ ] Git push process completes without template-specific errors
- [ ] GitHub workflows run successfully with simplified validation
- [ ] All essential npm scripts execute without errors
- [ ] Development workflow remains smooth and fast

## Dependencies

### Prerequisite Stories

- **CLEANUP-001**: Template cleanup for 2D game development (foundational cleanup)

### System Dependencies

- **Git**: Required for hook testing and workflow validation
- **Node.js 18+**: Required for script execution
- **GitHub Actions**: Required for CI/CD workflow testing
- **Husky**: Git hooks management (simplified configuration)

### Tool Dependencies

- **npm scripts**: Updated and validated package.json scripts
- **Husky hooks**: Streamlined git hooks
- **GitHub workflows**: Cleaned CI/CD pipelines

## Definition of Done

- [x] All acceptance criteria met
- [x] **CRITICAL: No linting errors or warnings anywhere in the project**
- [x] All template-specific scripts removed from package.json
- [x] Husky git hooks updated and tested successfully
- [x] GitHub workflows cleaned and validated
- [x] Template-specific tools removed or archived
- [x] Git commit/push workflow executes smoothly (<60s total)
- [x] GitHub CI/CD pipeline runs without template errors
- [x] Documentation updated with removed artifacts list
- [x] **No console errors or warnings in development workflow**
- [x] All remaining development tools function correctly
- [x] Migration notes created for future reference

## Additional Notes for Developers

### Template Artifact Removal Strategy

**SYSTEMATIC APPROACH**: Remove template artifacts in dependency order:

1. Scripts that depend on tools
2. Tools that depend on configurations
3. Configurations that depend on files
4. Files and documentation updates

### Git Workflow Validation

**CRITICAL**: Test the complete git workflow after each major change:

- `git add .` → `git commit -m "test"` → `git push`
- Verify hooks execute successfully
- Ensure GitHub workflows trigger correctly

### Performance Targets

- **Pre-commit hooks**: <30 seconds execution time
- **Pre-push hooks**: <60 seconds execution time
- **GitHub CI/CD**: Faster execution without template overhead
- **Development workflow**: No performance degradation

### Documentation Requirements

- Document all removed template artifacts
- Create clear migration notes for future template updates
- Update development workflow documentation
- Provide rollback instructions if needed
