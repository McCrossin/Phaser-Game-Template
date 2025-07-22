# Story: Template Content Cleanup and New-Eden Reference Removal

**ID**: TEMP-015  
**Epic**: Template Migration  
**Priority**: High  
**Estimated Points**: 3  
**Dependencies**: TEMP-014

## Description

Clean up template-specific content by removing backup files no longer needed and systematically finding and removing all references to "New-Eden" throughout the codebase. Convert game-specific files to be generic template files, or remove them if they're specific to the New-Eden game implementation.

### Player Experience Goal

Developers using this template will receive a clean, generic game template without any references to the original New-Eden game, providing a neutral foundation for their own game development.

### Technical Overview

Comprehensive search and cleanup of all New-Eden references, removal of backup files, and conversion of game-specific content to generic template content suitable for any game development project.

## Acceptance Criteria

### Functional Requirements

- [x] All backup files (README-NEW-EDEN-BACKUP.md, etc.) are removed
- [x] No references to "New-Eden" exist anywhere in the codebase
- [x] Game-specific files are either made generic or removed
- [x] All documentation refers to generic game development concepts
- [x] Template is completely game-agnostic

### Technical Requirements

- [x] All file searches for "New-Eden" return zero results
- [x] No broken references after file removals
- [x] Generic placeholders replace game-specific content
- [x] Configuration files contain template variables instead of hardcoded values
- [x] Code comments are generic and educational

### Game Design Requirements

- [x] Template supports any game genre development
- [x] No bias toward space/sci-fi themes
- [x] Generic asset examples that work for multiple game types
- [x] Documentation covers general game development principles

## Technical Specifications

### Architecture Context

This cleanup ensures the template is truly generic and can be used as a foundation for any type of 2D game development, not just space-themed games like New-Eden.

### Files to Create/Modify

- `scripts/cleanup-game-references.sh`: Script to find and clean New-Eden references
- `config/template-variables.json`: Generic template variable definitions
- Update all files containing New-Eden references
- Remove backup files
- Update documentation to be game-agnostic

### Key Classes and Interfaces

```typescript
interface ReferenceCleanup {
    searchTerms: string[];
    replaceWith: string[];
    filesToCheck: string[];
    filesToRemove: string[];
}

interface TemplateVariables {
    gameName: string;
    gameDescription: string;
    gameGenre: string;
    developerName: string;
}
```

### Integration Points

- **Documentation System**: All docs updated to generic content
- **Configuration Files**: Template variables replace hardcoded values
- **Asset Pipeline**: Generic asset examples
- **Build System**: No game-specific build configurations

### Performance Requirements

- Search and replace operations complete within reasonable time
- No performance impact on template functionality
- File removal doesn't break any dependencies

## Implementation Tasks

### 1. Comprehensive Search for New-Eden References

Find all occurrences of New-Eden references throughout the project.

**Estimated Time**: 1 hour
**Technical Details**:

- Search all file types for "New-Eden", "new-eden", "NEW_EDEN"
- Document all found references with file locations
- Categorize references (removable vs convertible)
- Create replacement strategy for each category

### 2. Remove Backup Files

Clean up all backup files that are no longer needed.

**Estimated Time**: 30 minutes
**Technical Details**:

- Remove README-NEW-EDEN-BACKUP.md
- Remove any other backup files identified
- Update any references to removed backup files
- Verify no broken links remain

### 3. Convert Game-Specific Content to Generic

Transform New-Eden specific content into generic template content.

**Estimated Time**: 2 hours
**Technical Details**:

- Replace game-specific descriptions with generic ones
- Update asset references to be generic
- Convert New-Eden mechanics to generic game concepts
- Update variable names to be game-agnostic

### 4. Update Documentation and Comments

Ensure all documentation is generic and educational.

**Estimated Time**: 1.5 hours
**Technical Details**:

- Remove New-Eden specific examples
- Add generic game development examples
- Update code comments to be educational
- Ensure documentation covers general principles

### 5. Create Template Variable System

Implement a system for easy template customization.

**Estimated Time**: 1 hour
**Technical Details**:

- Define template variables for game name, description, etc.
- Update files to use template variables
- Create documentation for template customization
- Test variable replacement system

### 6. Validate Clean Template

Verify template is completely generic and ready for use.

**Estimated Time**: 1 hour
**Technical Details**:

- Search again for any missed references
- Test template functionality
- Verify all documentation is generic
- Ensure template can be easily customized

## Game Design Context

### GDD References

- Generic Game Development: Template supports any game type
- Template Customization: Easy adaptation for specific game projects

### Balance Parameters

```typescript
const CLEANUP_CONFIG = {
    searchTerms: ['New-Eden', 'new-eden', 'NEW_EDEN', 'neweden'],
    genericReplacements: {
        'New-Eden': 'YourGame',
        'space exploration': 'game mechanics',
        spaceship: 'player character'
    },
    filesToRemove: ['README-NEW-EDEN-BACKUP.md']
};
```

### Visual/Audio Requirements

- **Generic Assets**: Replace space-themed assets with neutral examples
- **Documentation**: Generic screenshots and examples

## Testing Requirements

### Unit Tests

- `test/template-cleanup.test.ts`: Validates no game-specific references remain
- `test/template-variables.test.ts`: Tests template variable system

### Integration Tests

- Full text search returns zero New-Eden references
- Template can be customized for different game types
- All documentation links work correctly

### Performance Tests

- Search operations complete in reasonable time
- Template loading performance unchanged

### Gameplay Testing

- [ ] Template works for different game genres (platformer, RPG, puzzle)
- [ ] No bias toward any specific game type
- [ ] Generic examples are clear and helpful

## Dependencies

### Prerequisite Stories

- TEMP-014: Directory structure must be clean before content cleanup

### System Dependencies

- grep/ripgrep: Text searching capabilities
- sed/awk: Text replacement tools
- Git: Version control for tracking changes

### Asset Dependencies

- Generic placeholder assets: Need neutral examples

## Definition of Done

- [ ] All acceptance criteria met
- [x] Zero search results for "New-Eden" references
- [x] All backup files removed
- [x] Template is completely game-agnostic
- [x] Documentation is generic and educational
- [x] Template variable system implemented
- [x] Template can be easily customized for any game type
- [x] No broken references after cleanup
- [x] Code follows TypeScript strict mode standards
- [x] Feature works on all target platforms
