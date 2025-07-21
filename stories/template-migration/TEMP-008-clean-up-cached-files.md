# Story: Clean Up Cached Files During Template Transfer

**ID**: TEMP-008  
**Epic**: Template Migration  
**Priority**: High  
**Estimated Points**: 2  
**Dependencies**: None

## Description

Remove all cached files, build artifacts, and project-specific resources that are causing conflicts during the transfer of the game project to a template directory structure. This cleanup will ensure a clean state for the template and prevent cached resources from interfering with fresh builds.

### Player Experience Goal

No direct player impact - this is a development infrastructure story that ensures the template works properly for future projects and prevents build/deployment issues.

### Technical Overview

Systematically identify and remove all cached files, temporary directories, build artifacts, and project-specific configurations that should not be part of a clean template. This includes node modules, build outputs, test results, coverage reports, and any IDE-specific cached files.

## Acceptance Criteria

### Functional Requirements

- [ ] All node_modules dependencies are removed and will be reinstalled fresh
- [ ] Build output directories (dist, build) are cleaned
- [ ] Test artifacts and coverage reports are removed
- [ ] Temporary and cache directories are cleared
- [ ] Project runs cleanly after cache cleanup
- [ ] Template can be used to create new projects without conflicts

### Technical Requirements

- [ ] All build artifacts in dist/ and build/ directories are removed
- [ ] Node modules cache is cleared completely
- [ ] Test results and coverage data is cleaned
- [ ] Playwright test artifacts are removed
- [ ] Package-lock.json is regenerated after npm install
- [ ] Git working directory is clean after cleanup
- [ ] All IDE cache files (.vscode cache, etc.) are cleaned

### Game Design Requirements

- [ ] Game assets in assets/ directory are preserved (not cached files)
- [ ] Source code and configuration files remain intact
- [ ] Documentation files are preserved
- [ ] Template structure remains functional

## Technical Specifications

### Architecture Context

This cleanup operation prepares the project for template conversion by removing all cached and generated files that could cause conflicts in new projects created from this template.

### Files to Create/Modify

- `scripts/cleanup-cache.sh`: PowerShell script for comprehensive cache cleanup
- `scripts/cleanup-cache.ps1`: PowerShell version for Windows compatibility
- `.gitignore`: Update to ensure cached files are properly ignored
- `package.json`: Update clean script commands

### Key Classes and Interfaces

```typescript
// No new TypeScript interfaces needed - this is a build/infrastructure story
// Script will be shell/PowerShell based
```

### Integration Points

- **Build System**: Vite build cache clearing
- **Package Manager**: npm cache and node_modules removal
- **Testing Framework**: Vitest, Playwright cache clearing
- **Version Control**: Git status verification
- **IDE Integration**: VS Code cache clearing

### Performance Requirements

- Script execution should complete within 30 seconds
- Disk space should be freed (typically 200MB+ from node_modules)
- Subsequent builds should start fresh without cache conflicts

## Implementation Tasks

### 1. Create Cache Cleanup Scripts

Create comprehensive cleanup scripts for both Unix-like systems and Windows PowerShell.

**Estimated Time**: 2 hours
**Technical Details**:

- Create `scripts/cleanup-cache.sh` for Unix-like systems
- Create `scripts/cleanup-cache.ps1` for Windows PowerShell
- Include safety checks before deletion
- Add verbose output for user feedback
- Handle permission issues gracefully

### 2. Remove Build Artifacts

Clear all generated build outputs and temporary files.

**Estimated Time**: 1 hour
**Technical Details**:

- Remove `dist/` directory completely
- Clear `build/` generated content (preserve config)
- Remove `coverage/` test coverage reports
- Clear `test-results/` and `playwright-report/`
- Remove any `.tsbuildinfo` files

### 3. Clean Package Manager Cache

Remove node_modules and package manager caches.

**Estimated Time**: 1 hour
**Technical Details**:

- Remove `node_modules/` directory
- Clear npm cache (`npm cache clean --force`)
- Remove `package-lock.json` (will regenerate)
- Clear any yarn.lock if present
- Verify package.json integrity

### 4. Clear Testing Artifacts

Remove all test-generated files and cache.

**Estimated Time**: 1 hour
**Technical Details**:

- Remove all `test-results/` subdirectories
- Clear `coverage/` directory completely
- Remove `.nyc_output/` if exists
- Clear Playwright cache and downloads
- Remove any Jest cache directories

### 5. Clean IDE and Tool Caches

Remove IDE-specific cache and temporary files.

**Estimated Time**: 1 hour
**Technical Details**:

- Clear `.vscode/` settings cache (preserve user settings)
- Remove TypeScript build info files
- Clear ESLint cache (`.eslintcache`)
- Remove Prettier cache if exists
- Clean any VS Code extension caches

### 6. Update Git Configuration

Ensure .gitignore properly excludes cached files.

**Estimated Time**: 30 minutes
**Technical Details**:

- Review and update `.gitignore` entries
- Add any missing cache directory patterns
- Verify git status is clean after cleanup
- Remove any accidentally committed cache files from git history

### 7. Validation and Testing

Verify cleanup was successful and project still functions.

**Estimated Time**: 1 hour
**Technical Details**:

- Run `npm install` to reinstall dependencies
- Execute `npm run build` to verify build works
- Run test suite to ensure functionality
- Check disk space freed by cleanup
- Verify no broken references to deleted files

## Game Design Context

### GDD References

- N/A - Infrastructure story

### Balance Parameters

```typescript
// No balance parameters - infrastructure story
```

### Visual/Audio Requirements

- N/A - No assets affected, only cached files removed

## Testing Requirements

### Unit Tests

- `tests/scripts/cleanup-cache.test.ts`: Test cleanup script functionality
- Verify script handles missing directories gracefully
- Test script output and error handling

### Integration Tests

- Full cleanup and rebuild cycle test
- Verify project functionality after cleanup
- Test template creation process after cleanup

### Performance Tests

- Cleanup execution time: <30 seconds
- Build time after cleanup: baseline measurement
- Disk space freed: >200MB typical

### Gameplay Testing

- [ ] Game loads and runs after cleanup and rebuild
- [ ] All game features function normally
- [ ] No missing assets or broken references
- [ ] Performance is maintained or improved

## Dependencies

### Prerequisite Stories

- None - This is a foundational cleanup story

### System Dependencies

- PowerShell (Windows) or Bash (Unix-like)
- Node.js and npm for reinstallation
- Git for status verification

### Asset Dependencies

- Game assets: Preserved (not cache files)
- Source code: Preserved
- Configuration files: Preserved

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Cleanup scripts created and tested
- [ ] All cached files and build artifacts removed
- [ ] Project rebuilds successfully from clean state
- [ ] No console errors or warnings after cleanup
- [ ] Template can be used to create new projects
- [ ] Documentation updated with cleanup instructions
- [ ] Git working directory is clean
- [ ] Disk space has been freed appropriately
- [ ] All dependencies reinstall correctly

## Additional Notes

**Safety Considerations:**

- Always backup project before running cleanup
- Scripts should include confirmation prompts
- Preserve source code and assets
- Test scripts on development environment first

**Post-Cleanup Steps:**

1. Run `npm install` to reinstall dependencies
2. Execute `npm run build` to verify build works
3. Run test suite to ensure all functionality works
4. Commit the clean state to version control
