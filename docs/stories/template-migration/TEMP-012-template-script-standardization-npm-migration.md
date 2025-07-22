# Story: Template Script Standardization and NPM Migration

**ID**: TEMP-012  
**Epic**: Template Migration  
**Priority**: High  
**Estimated Points**: 4  
**Dependencies**: TEMP-011

## Description

Standardize the template's script execution to use npm scripts wherever possible, replacing PowerShell and Bash scripts with cross-platform npm-based alternatives. Review existing shell scripts to determine which should be migrated to npm scripts, which should remain for development purposes, and which should be removed from the template entirely.

### Player Experience Goal

Developers using this template will have a consistent, cross-platform development experience using standard npm commands, regardless of their operating system (Windows, macOS, Linux).

### Technical Overview

Comprehensive audit of all shell scripts, migration of appropriate functionality to npm scripts in package.json, removal of template-setup specific scripts, and creation of cross-platform alternatives for necessary development tools.

## Acceptance Criteria

### Functional Requirements

- [x] All code quality scripts use npm commands instead of shell scripts
- [x] Cross-platform compatibility for all development scripts
- [x] Template-specific setup scripts are removed or moved to development tools
- [x] Essential development scripts remain accessible via npm run commands
- [x] Performance monitoring scripts work consistently across platforms

### Technical Requirements

- [x] package.json scripts section is comprehensive and well-organized
- [x] No PowerShell (.ps1) or Bash (.sh) scripts in root scripts/ directory for template users
- [x] Development-only scripts clearly separated from template functionality
- [x] All npm scripts have proper error handling and cross-platform paths
- [x] Script dependencies are clearly documented

### Game Design Requirements

- [x] Game development workflow remains efficient
- [x] Build and deployment processes are streamlined
- [x] Performance monitoring is easily accessible
- [x] Template users can run all necessary commands via npm

## Technical Specifications

### Architecture Context

This migration ensures the template provides a standard Node.js/npm development experience that works consistently across all platforms and integrates well with modern JavaScript/TypeScript toolchains.

### Files to Create/Modify

- `package.json`: Enhanced scripts section with migrated functionality
- `tools/development/script-runner.js`: Cross-platform script execution utilities
- `scripts/template-cleanup/`: Move template-specific scripts here
- Remove or relocate: `scripts/cleanup-cache.ps1`, `scripts/cleanup-cache.sh`
- Update: All CI/CD configurations to use npm scripts
- Create: `docs/template-scripts-guide.md`

### Key Classes and Interfaces

```typescript
interface ScriptConfig {
    name: string;
    command: string;
    description: string;
    crossPlatform: boolean;
    category: 'build' | 'test' | 'quality' | 'dev' | 'maintenance';
}

interface PlatformScript {
    windows?: string;
    unix?: string;
    npm: string;
    fallback?: string;
}

interface ScriptMigration {
    oldScript: string;
    newNpmScript: string;
    migration: 'direct' | 'rewrite' | 'remove' | 'relocate';
    reason: string;
}
```

### Integration Points

- **Package.json**: Central script management
- **CI/CD Pipeline**: Updated to use npm scripts
- **Development Workflow**: Standardized commands
- **Build System**: Integrated with npm script ecosystem

### Performance Requirements

- Script execution time should not increase significantly
- Cross-platform scripts run within 10% performance variance
- npm script startup overhead minimized

## Implementation Tasks

### 1. Audit Existing Shell Scripts

Identify and categorize all PowerShell and Bash scripts in the project.

**Estimated Time**: 1.5 hours
**Technical Details**:

- [x] Inventory all .ps1 and .sh files
- [x] Categorize by function (build, test, cleanup, template-setup, etc.)
- [x] Determine migration strategy for each script
- [x] Identify scripts that should be removed from template

### 2. Migrate Code Quality Scripts to NPM

Convert shell-based code quality scripts to npm equivalents.

**Estimated Time**: 2 hours
**Technical Details**:

- [x] Replace shell scripts with npm-based alternatives
- [x] Ensure cross-platform compatibility
- [x] Update package.json with new script definitions
- [x] Test scripts on multiple platforms

### 3. Remove Template-Specific Setup Scripts

Clean up scripts that are only needed for template development.

**Estimated Time**: 1 hour
**Technical Details**:

- [x] Move template setup scripts to development tools directory
- [x] Remove scripts from main template distribution
- [x] Update documentation to reflect script changes
- [x] Ensure template users don't get development artifacts

### 4. Create Cross-Platform Development Utilities

Build Node.js-based utilities for platform-specific functionality.

**Estimated Time**: 2.5 hours
**Technical Details**:

- [x] Create JavaScript utilities for file operations
- [x] Implement cross-platform path handling
- [x] Add proper error handling and logging
- [x] Create wrapper scripts for complex operations

### 5. Update CI/CD and Documentation

Ensure all automation uses new npm scripts.

**Estimated Time**: 1.5 hours
**Technical Details**:

- [x] Update GitHub Actions workflows
- [x] Modify build processes to use npm scripts
- [x] Update all documentation references
- [x] Create script usage guide for template users

### 6. Validate Script Migration

Test all migrated scripts across platforms.

**Estimated Time**: 1.5 hours
**Technical Details**:

- [x] Test npm scripts on Windows, macOS, and Linux
- [x] Verify CI/CD pipeline functionality
- [x] Ensure development workflow remains efficient
- [x] Document any platform-specific considerations

## Game Design Context

### GDD References

- Development Workflow: Standardized development process
- Template Architecture: Clean separation of concerns

### Balance Parameters

```typescript
const SCRIPT_CONFIG = {
    maxNpmScripts: 25, // Keep package.json manageable
    scriptCategories: ['build', 'test', 'quality', 'dev', 'maintenance'],
    crossPlatformRequirement: true,
    performanceThreshold: 1.1 // Max 10% performance decrease
};
```

### Visual/Audio Requirements

- **Documentation**: Updated script reference diagrams
- **README**: Clear npm script usage examples

## Testing Requirements

### Unit Tests

- `test/scripts.test.ts`: Validates npm script functionality
- `test/cross-platform.test.ts`: Tests platform compatibility

### Integration Tests

- All npm scripts execute successfully
- CI/CD pipeline works with new scripts
- Development workflow functions correctly across platforms

### Performance Tests

- Script execution time benchmarks
- Cross-platform performance comparison
- CI/CD pipeline performance validation

### Gameplay Testing

- [x] Template setup works with npm scripts
- [x] Development workflow is efficient
- [x] Build and deployment processes are reliable

## Dependencies

### Prerequisite Stories

- TEMP-011: Variable identification must be complete before script migration

### System Dependencies

- Node.js: Runtime for npm scripts
- npm/yarn: Package management and script execution
- Cross-platform tools: For file operations

### Asset Dependencies

- Package.json: Must be properly structured

## Definition of Done

- [x] All acceptance criteria met
- [x] Code quality scripts use npm commands
- [x] Cross-platform compatibility verified
- [x] Template-specific scripts removed from distribution
- [x] CI/CD pipeline updated to use npm scripts
- [x] Documentation reflects new script structure
- [x] Performance requirements met
- [x] All platforms tested successfully
- [x] Code follows TypeScript strict mode standards
- [x] Feature works on all target platforms
