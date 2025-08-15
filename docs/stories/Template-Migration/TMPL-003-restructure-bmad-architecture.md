# Story: Restructure Project to Match BMad Game Development Architecture

**ID**: TMPL-003  
**Epic**: Template-Migration  
**Priority**: Medium  
**Estimated Points**: 3  
**Dependencies**: TMPL-002

## Description

Restructure the project directories and file organization to match the BMad Knowledge Base game development architecture specifications, ensuring optimal organization for Phaser 3 + TypeScript game development.

### Player Experience Goal

Provide game developers with an intuitive, well-organized project structure that follows industry best practices for game development, making it easy to locate and organize game code, assets, and documentation.

### Technical Overview

Reorganize the existing project structure to align with BMad KB specifications, creating dedicated directories for game objects, scenes, systems, and properly organizing assets with source/processed separation.

## Acceptance Criteria

### Functional Requirements

- [ ] Project structure matches BMad KB game development architecture
- [ ] Game code organized in scenes, gameObjects, systems, utils, types, config
- [ ] Assets properly separated into source and processed directories
- [ ] Documentation organized with stories and design subdirectories
- [ ] Tools directory contains only game development utilities
- [ ] All import paths updated to reflect new structure
- [ ] Build system recognizes new directory structure

### Technical Requirements

- [ ] `src/components/` renamed to `src/gameObjects/` following BMad KB spec
- [ ] `assets/` directory restructured with `source/` and `processed/` subdirectories
- [ ] `docs/stories/` directory created for development stories
- [ ] `docs/design/` directory created for game design documents
- [ ] All TypeScript imports updated to new paths
- [ ] Vite configuration updated for new structure
- [ ] Testing paths updated to new directory organization

### Game Design Requirements

- [ ] Game scenes properly organized for different game states
- [ ] Game objects directory structured for reusable components
- [ ] Game systems directory for core game logic
- [ ] Configuration directory for game balance and settings
- [ ] Asset organization supports efficient game asset pipeline

## Technical Specifications

### Architecture Context

Transform the current project structure into the BMad Knowledge Base specified architecture for optimal Phaser 3 + TypeScript game development workflow and maintainability.

### Target Structure (BMad KB Specification)

```text
game-project/
├── src/
│   ├── scenes/          # Game scenes (BootScene, MenuScene, GameScene)
│   ├── gameObjects/     # Custom game objects and entities (renamed from components)
│   ├── systems/         # Core game systems (GameState, InputManager, etc.)
│   ├── utils/           # Utility functions and helpers
│   ├── types/           # TypeScript type definitions
│   └── config/          # Game configuration and balance
├── assets/              # Game assets (images, audio, data)
│   ├── source/          # Source assets for processing
│   └── processed/       # Optimized game assets (current assets/ content)
├── docs/
│   ├── stories/         # Development stories
│   └── design/          # Game design documents
├── tests/               # Unit and integration tests (current testing/)
├── tools/               # Game development tools only
└── config/              # Build and deployment configuration
```

### Directory Migration Plan

**Rename Operations:**

- `src/components/` → `src/gameObjects/`
- `testing/` → `tests/`
- Create `assets/source/` and move appropriate content
- Create `assets/processed/` and move current `assets/` content
- Create `docs/stories/` and move existing story files
- Create `docs/design/` for future game design documents

### Files to Create/Modify

- Update all import statements in TypeScript files
- Update Vite configuration paths
- Update test configuration paths
- Update asset pipeline configuration
- Update CI/CD workflow paths
- Create new directory structure
- Move existing files to new locations

### Key Classes and Interfaces

```typescript
interface ProjectStructureMap {
    oldPath: string;
    newPath: string;
    updateImports: boolean;
    updateConfig: boolean;
}

interface GameDirectoryStructure {
    src: {
        scenes: string[];
        gameObjects: string[];
        systems: string[];
        utils: string[];
        types: string[];
        config: string[];
    };
    assets: {
        source: string[];
        processed: string[];
    };
    docs: {
        stories: string[];
        design: string[];
    };
}

interface ImportUpdateConfig {
    filePattern: string;
    searchPattern: RegExp;
    replacePattern: string;
}
```

### Integration Points

- **Vite Build System**: Update asset and module resolution paths
- **TypeScript Compiler**: Update import path resolution
- **Testing Framework**: Update test file paths and imports
- **Asset Pipeline**: Update source and processed asset paths
- **CI/CD**: Update workflow file paths

### Performance Requirements

- Restructuring completed without build system interruption
- All imports resolve correctly after restructuring
- Asset pipeline functions with new directory structure
- Development server works with new organization
- Testing suite runs successfully with new paths

## Dev Notes

### Technical Implementation Context

**BMad Architecture Compliance:**

- Target structure follows BMad Knowledge Base specifications for Phaser 3 + TypeScript game development
- Primary change: `src/components/` → `src/gameObjects/` to align with game development terminology
- Asset organization: current flat `assets/` → structured `assets/source/` and `assets/processed/`
- Documentation organization: stories and design separation in `docs/`

**Directory Migration Strategy:**

```bash
# Safe file moving operations
mv src/components/ src/gameObjects/
mkdir -p assets/source assets/processed docs/stories docs/design
# Move current assets to processed (they are already optimized)
mv assets/*.png assets/*.jpg assets/processed/ 2>/dev/null || true
```

**Import Path Updates Required:**

- All TypeScript files importing from `../components/` → `../gameObjects/`
- Vite configuration may need asset path updates
- Test files importing component files need path updates
- Search pattern: `from ['"].*components/` → `from ['"].*gameObjects/`

**Critical Files Affected:**

- `src/main.ts` - Likely imports from components
- `src/scenes/*.ts` - Scene files importing game objects
- `testing/**/*.test.ts` - Test files importing components
- `vite.config.ts` - May reference asset paths
- Any configuration files with hardcoded paths

**Build System Considerations:**

- Vite uses file system watchers that handle directory renames gracefully
- TypeScript compiler will report import errors that need fixing
- Asset pipeline tools may need path configuration updates
- Hot reload should continue working after path updates

**Testing Strategy:**

- Verify TypeScript compilation after each major move
- Test development server startup after restructuring
- Validate asset loading with new organization
- Run full test suite to catch import path issues

**Risk Mitigation:**

- Incremental approach: one directory type at a time
- Git tracking of moves preserves file history
- Backup approach: branch before major restructuring
- Rollback plan: Git reset if critical functionality breaks

**Dependencies:**

- Must complete TMPL-002 first to avoid conflicts with template file cleanup
- Coordinate with asset pipeline configuration
- Update any CI/CD paths that reference specific directories

## Implementation Tasks

### 1. Create New Directory Structure

Create the target directory structure following BMad KB specifications.

**Estimated Time**: 30 minutes  
**Technical Details**:

- Create `src/gameObjects/` directory
- Create `assets/source/` directory
- Create `assets/processed/` directory
- Create `docs/stories/` directory
- Create `docs/design/` directory
- Verify all target directories exist

### 2. Move Components to GameObjects

Rename and reorganize the components directory to gameObjects following BMad conventions.

**Estimated Time**: 45 minutes  
**Technical Details**:

- Move all files from `src/components/` to `src/gameObjects/`
- Update internal imports within moved files
- Verify no components are lost in migration
- Update any component-specific documentation
- Test that gameObjects directory functions correctly

### 3. Reorganize Assets Directory

Restructure assets into source and processed subdirectories.

**Estimated Time**: 45 minutes  
**Technical Details**:

- Create `assets/source/` and `assets/processed/` directories
- Move current optimized assets to `assets/processed/`
- Move source assets (if any) to `assets/source/`
- Update asset pipeline configuration
- Update Vite asset path configuration
- Test asset loading with new structure

### 4. Update Import Statements

Update all TypeScript import statements to reflect new directory structure.

**Estimated Time**: 1 hour  
**Technical Details**:

- Scan all `.ts` and `.tsx` files for import statements
- Update imports from `components/` to `gameObjects/`
- Update any asset import paths
- Update relative import paths affected by moves
- Verify all imports resolve correctly
- Test TypeScript compilation

### 5. Update Build Configuration

Update Vite and TypeScript configurations for new directory structure.

**Estimated Time**: 30 minutes  
**Technical Details**:

- Update Vite asset path configuration
- Update TypeScript path mapping if used
- Update any webpack-style aliases
- Update test configuration paths
- Verify build system recognizes new structure
- Test development server startup

### 6. Move and Organize Documentation

Organize documentation into stories and design subdirectories.

**Estimated Time**: 30 minutes  
**Technical Details**:

- Create `docs/stories/` directory structure
- Move existing story files to `docs/stories/`
- Create `docs/design/` for future game design documents
- Update any documentation links
- Update README.md references to documentation paths
- Organize documentation logically

### 7. Update Testing Infrastructure

Update testing paths and imports for new directory structure.

**Estimated Time**: 30 minutes  
**Technical Details**:

- Rename `testing/` to `tests/` if following strict BMad convention
- Update test imports to new gameObjects path
- Update test configuration paths
- Update any test asset paths
- Verify all tests run with new structure
- Update CI/CD test paths

## Game Design Context

### GDD References

- **Architecture Standards**: BMad Knowledge Base project organization
- **Development Workflow**: Optimal directory structure for game development
- **Asset Management**: Source/processed asset separation

### Balance Parameters

```typescript
const RESTRUCTURE_TARGETS = {
    DIRECTORY_COMPLIANCE: 100, // 100% BMad KB compliance
    IMPORT_ACCURACY: 100, // All imports must resolve
    BUILD_SUCCESS: 100, // Build must work after restructure
    DEVELOPMENT_SPEED: 105 // Improve development workflow by 5%
};
```

### Visual/Audio Requirements

- **Directory Visual Organization**: Clear, intuitive folder structure
- **Asset Organization**: Logical separation of source and processed assets
- **Documentation Structure**: Easy navigation of stories and design docs

## Testing Requirements

### Unit Tests

- `tests/unit/structure/bmad-compliance.test.ts`: Validate BMad KB architecture compliance
- `tests/unit/imports/path-resolution.test.ts`: Verify all imports resolve correctly
- `tests/unit/assets/pipeline-structure.test.ts`: Test asset pipeline with new structure

### Integration Tests

- **Build System**: Full build with new directory structure
- **Development Server**: Hot reload with new organization
- **Asset Pipeline**: Complete asset processing with new paths
- **Import Resolution**: All TypeScript imports resolve correctly

### Performance Tests

- **Build Time**: Ensure restructuring doesn't slow builds
- **Development Server**: Fast startup with new structure
- **Asset Loading**: Efficient asset pipeline with new organization

### Gameplay Testing

- [ ] Game loads correctly with new directory structure
- [ ] All game objects and components function after move
- [ ] Asset loading works with new asset organization
- [ ] Development workflow remains efficient

## Dependencies

### Prerequisite Stories

- TMPL-002: Clean Template Files (must complete first to avoid conflicts)

### System Dependencies

- **File System**: Safe file moving and directory creation
- **Git**: Proper tracking of file moves and renames
- **TypeScript**: Import path resolution
- **Vite**: Asset and module path resolution

### Asset Dependencies

- **Game Assets**: Preserved asset functionality after reorganization
- **Asset Pipeline**: Maintained processing capabilities

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Project structure matches BMad KB specifications exactly
- [ ] All imports resolve correctly in TypeScript
- [ ] Build system works with new directory structure
- [ ] Asset pipeline processes correctly with new organization
- [ ] Testing suite runs successfully with new paths
- [ ] Development server starts and functions correctly
- [ ] Documentation organized in stories and design directories
- [ ] CI/CD pipeline works with new structure
- [ ] No functionality lost during restructuring

---

**Story Status**: Ready for Development  
**Created**: July 22, 2025  
**Dependencies**: Must complete TMPL-002 first  
**Story File**: `stories/Template-Migration/TMPL-003-restructure-bmad-architecture.md`

## File List

_This section will be updated by the development agent to track all files created, modified, or deleted during implementation._

### Files to be Created

- `assets/source/` directory
- `assets/processed/` directory
- `docs/stories/` directory
- `docs/design/` directory

### Files to be Modified

- All TypeScript files with imports from `components/` → `gameObjects/`
- `vite.config.ts` - Asset path configuration updates
- Test configuration files with updated paths
- Any configuration files referencing old directory structure

### Files to be Moved

- `src/components/` → `src/gameObjects/` (entire directory)
- Current `assets/*.png`, `assets/*.jpg` → `assets/processed/`
- Existing story files → `docs/stories/`
- `testing/` → `tests/` (if following strict BMad convention)

### Files to be Deleted

- `src/components/` directory (after move to `src/gameObjects/`)
- Any broken symlinks or empty directories after restructuring

## Change Log

### July 22, 2025 - Initial Creation

- **Author**: Sarah (Product Owner)
- **Changes**:
    - Created comprehensive story for BMad architecture restructuring
    - Defined detailed target structure and migration plan
    - Added specific implementation tasks with clear sequencing
    - Added missing Dev Notes section with technical implementation context
    - Added File List section for tracking restructuring changes
    - Added Change Log section for story modification tracking
    - Established dependency on TMPL-002 completion
- **Validation Status**: Ready for development (all critical sections added)
