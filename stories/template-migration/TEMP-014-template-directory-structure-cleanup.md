# Story: Template Directory Structure Cleanup and Organization

**ID**: TEMP-014  
**Epic**: Template Migration  
**Priority**: High  
**Estimated Points**: 5  
**Dependencies**: TEMP-013

## Description

Reorganize and clean up the Phaser Game Template directory structure to provide a clean, professional foundation for other developers. This includes consolidating scattered files in the root directory, cleaning up obsolete documentation folders, and removing TODO lists that are specific to the original project development rather than template usage.

### Player Experience Goal

Developers using this template will have a clean, well-organized project structure that follows industry best practices and doesn't contain development artifacts from the original project.

### Technical Overview

Systematic cleanup and reorganization of project directories, consolidating related files into logical folder structures, removing development-specific TODO lists, and updating any file path references that change during reorganization.

## Acceptance Criteria

### Functional Requirements

- [x] Root directory contains only essential files (package.json, README.md, index.html, etc.)
- [x] TODO Lists directory is cleaned up with only template-relevant items
- [x] docs/ folder structure is streamlined and contains only template-relevant documentation
- [x] All file path references are updated after any file moves
- [x] Project structure follows modern web development conventions

### Technical Requirements

- [x] All import/require statements updated for moved files
- [x] Configuration files updated with new paths
- [x] Build process works correctly with new structure
- [x] No broken file references in any configuration
- [x] TypeScript path mappings updated if needed

### Game Design Requirements

- [x] Template structure supports easy game development workflow
- [x] Asset organization remains logical for game developers
- [x] Documentation structure supports game development process

## Technical Specifications

### Architecture Context

This cleanup ensures the template follows a clean architecture that separates development tools, documentation, and core game code into logical directories that make sense for template users.

### Files to Create/Modify

- `scripts/cleanup-template-structure.sh`: Script to automate directory reorganization
- `config/template-structure.json`: Configuration defining new directory structure
- Update all configuration files with new paths
- Move files according to new structure plan
- Update documentation with new structure

### Key Classes and Interfaces

```typescript
interface TemplateStructure {
    core: {
        src: string[];
        assets: string[];
        config: string[];
    };
    development: {
        tools: string[];
        scripts: string[];
        testing: string[];
    };
    documentation: {
        essential: string[];
        optional: string[];
    };
}

interface PathUpdateConfig {
    oldPath: string;
    newPath: string;
    filesToUpdate: string[];
}
```

### Integration Points

- **Build System**: Vite configuration must reflect new paths
- **Asset Pipeline**: Asset processing scripts need updated paths
- **Testing Framework**: Test configuration updated for new structure
- **Documentation**: All docs updated with new file locations

### Performance Requirements

- Build time should not increase after reorganization
- All existing functionality preserved
- No broken dependencies after moves

## Implementation Tasks

### 1. Analyze Current Structure and Plan Reorganization

Audit current directory structure and create reorganization plan.

**Estimated Time**: 2 hours
**Status**: [x] Complete

**Technical Details**:

- [x] Survey all files in root directory
- [x] Identify files that can be moved to subdirectories
- [x] Create mapping of old to new locations
- [x] Identify all configuration files that reference paths

### 2. Clean Up TODO Lists Directory

Remove project-specific TODOs and keep only template-relevant items.

**Estimated Time**: 1 hour
**Status**: [x] Complete

**Technical Details**:

- [x] Review each TODO file for template relevance
- [x] Remove development-specific tasks
- [x] Keep template setup and customization TODOs
- [x] Update remaining TODOs for template context

### 3. Clean Up docs/ Folder Structure

Remove obsolete documentation and reorganize remaining docs.

**Estimated Time**: 3 hours
**Status**: [x] Complete

**Technical Details**:

- [x] Remove /docs/technical, /docs/systems, /docs/research subdirectories
- [x] Keep essential template documentation
- [x] Reorganize remaining docs into logical structure
- [x] Update cross-references between documentation files

### 4. Create New Directory Structure

Implement the planned directory reorganization.

**Estimated Time**: 2 hours
**Status**: [x] Complete

**Technical Details**:

- [x] Create new directory structure
- [x] Move files to new locations
- [x] Update package.json scripts
- [x] Update build configuration files

### 5. Update All File Path References

Ensure all references to moved files are updated.

**Estimated Time**: 2 hours
**Status**: [x] Complete

**Technical Details**:

- [x] Update import statements in TypeScript files
- [x] Update configuration file paths
- [x] Update documentation references
- [x] Update script file paths

### 6. Test and Validate Structure

Verify everything works with new structure.

**Estimated Time**: 1 hour
**Status**: [x] Complete

**Technical Details**:

- [x] Run build process to ensure no broken paths
- [x] Test all npm scripts
- [x] Validate all documentation links
- [x] Ensure development workflow still functions

## Game Design Context

### GDD References

- Template Structure Guidelines: Defines optimal project organization for game development
- Developer Workflow: Ensures structure supports efficient game development

### Balance Parameters

```typescript
const STRUCTURE_CONFIG = {
    maxRootFiles: 10,
    maxSubdirectoryDepth: 3,
    requiredDirectories: ['src', 'assets', 'docs'],
    optionalDirectories: ['scripts', 'tools', 'config']
};
```

### Visual/Audio Requirements

- **Documentation**: Updated diagrams showing new directory structure
- **README**: Updated project structure visualization

## Testing Requirements

### Unit Tests

- `test/structure.test.ts`: Validates directory structure compliance
- `test/paths.test.ts`: Validates all path references are correct

### Integration Tests

- Build process completes successfully with new structure
- All npm scripts function correctly
- Development server starts without path errors

### Performance Tests

- Build time: Should not exceed current build time + 10%
- File access: No performance degradation in development

### Gameplay Testing

- [x] Template can be used to create new game project successfully
- [x] All development tools function with new structure
- [x] Documentation is easy to navigate and understand

## Dependencies

### Prerequisite Stories

- TEMP-013: TypeScript consistency must be established before reorganization

### System Dependencies

- Node.js: File system operations
- npm/yarn: Script execution
- Git: Version control for file moves

### Asset Dependencies

- All existing assets: Must remain accessible after moves

## Definition of Done

- [x] All acceptance criteria met
- [x] Code follows TypeScript strict mode standards
- [x] No broken file references anywhere in project
- [x] Build process works correctly
- [x] All npm scripts function properly
- [x] Documentation structure is clean and logical
- [x] TODO Lists contain only template-relevant items
- [x] docs/ folder contains only template documentation
- [x] Root directory is organized and professional
- [x] Feature works on all target platforms
