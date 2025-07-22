# Story: Thorough Template Directory Cleanup and Validation

**ID**: TEMP-010  
**Epic**: Template Migration  
**Priority**: High  
**Estimated Points**: 3  
**Dependencies**: TEMP-008, TEMP-009, TEMP-011

## Description

Perform a comprehensive audit and cleanup of the entire directory structure to ensure the template is clean, professional, and ready for distribution. Remove unnecessary files, validate structure, and ensure the template provides a pristine starting point for new game projects.

### Player Experience Goal

No direct player impact - this is a template quality story that ensures developers using this template get a clean, professional starting point that enables them to create high-quality games efficiently.

### Technical Overview

Systematically review every file and directory in the template, removing development artifacts, personal files, temporary content, and anything that shouldn't be part of a distributed template. Validate that the remaining structure is logical, well-organized, and documented.

## Acceptance Criteria

### Functional Requirements

- [ ] All development artifacts and temporary files are removed
- [ ] Personal or project-specific content is cleaned or generalized
- [ ] Directory structure is logical and well-organized
- [ ] All remaining files serve a clear purpose for template users
- [ ] Template can be used immediately to create new projects
- [ ] File and folder names follow consistent naming conventions
- [ ] Template size is optimized (unnecessary files removed)

### Technical Requirements

- [ ] No broken file references or dead links remain
- [ ] All configuration files contain appropriate default values
- [ ] Dependencies in package.json are current and necessary
- [ ] Git history is appropriate for a template (consider squashing)
- [ ] All scripts and tools work with fresh installations
- [ ] File permissions are set correctly
- [ ] No sensitive information (keys, passwords, personal data) remains

### Game Design Requirements

- [ ] Sample game content is appropriate for a template
- [ ] Asset directory structure supports common game asset types
- [ ] Documentation clearly explains template usage
- [ ] Template supports multiple game genres/styles
- [ ] Example code demonstrates best practices

## Technical Specifications

### Architecture Context

This final cleanup ensures the template represents professional standards and provides developers with a clean, efficient starting point for 2D Phaser game development.

### Files to Create/Modify

- `scripts/template-audit.ps1`: Comprehensive directory audit script
- `scripts/template-validate.ps1`: Template validation and testing script
- `TEMPLATE-USAGE.md`: Instructions for using the template
- `CLEANUP-CHECKLIST.md`: Manual review checklist
- `.templateignore`: Files to exclude when creating new projects

### Key Classes and Interfaces

```typescript
// Template audit and validation utilities
interface DirectoryAuditResult {
    path: string;
    type: 'file' | 'directory';
    size: number;
    purpose: 'required' | 'optional' | 'remove' | 'review';
    reason: string;
}

interface TemplateValidationResult {
    isValid: boolean;
    issues: ValidationIssue[];
    recommendations: string[];
    totalSize: number;
    fileCount: number;
}

interface ValidationIssue {
    severity: 'error' | 'warning' | 'info';
    path: string;
    description: string;
    suggestion?: string;
}
```

### Integration Points

- **File System**: Directory structure validation
- **Package Manager**: Dependency validation and cleanup
- **Version Control**: Git history and configuration review
- **Build System**: Ensure build works from template
- **Documentation**: Comprehensive template usage docs

### Performance Requirements

- Template download/clone time should be minimal (<30 seconds)
- Template size should be under 100MB (excluding node_modules)
- New project creation from template should be under 2 minutes
- Audit script should complete within 5 minutes

## Implementation Tasks

### 1. Create Template Audit Script

Develop automated script to analyze directory structure and identify cleanup opportunities.

**Estimated Time**: 3 hours
**Technical Details**:

- Scan entire directory tree recursively
- Categorize files by type and purpose
- Identify large files that may not be necessary
- Check for common temporary/cache file patterns
- Generate detailed audit report with recommendations
- Include file size analysis and cleanup suggestions

### 2. Remove Development Artifacts

Clean up files that are specific to development and not needed in template.

**Estimated Time**: 2 hours
**Technical Details**:

- Remove `.bmad-core/`, `.bmad-web-bundles/` directories
- Clean up `old docs/` and temporary documentation
- Remove development-specific health reports and analysis files
- Clear any IDE-specific settings that shouldn't be templated
- Remove personal notes, TODO lists, and development logs

### 3. Clean and Organize Documentation

Ensure all documentation is template-appropriate and well-organized.

**Estimated Time**: 2 hours
**Technical Details**:

- Review and update all README files
- Remove project-specific documentation
- Ensure docs/ structure is logical and comprehensive
- Update developer recommendations for template usage
- Create clear template usage instructions
- Remove or update changelog to reflect template status

### 4. Validate and Clean Configuration Files

Review all configuration files for template appropriateness.

**Estimated Time**: 2 hours
**Technical Details**:

- Review package.json for unnecessary dependencies
- Check all config files for hard-coded paths or project-specific values
- Validate TypeScript, ESLint, Prettier configurations
- Review Docker and deployment configurations
- Ensure all configurations use relative paths and generic values
- Update project metadata to be template-appropriate

### 5. Asset and Content Review

Ensure game assets and content are appropriate for a template.

**Estimated Time**: 1 hour
**Technical Details**:

- Review assets/ directory for template-appropriate content
- Ensure sample assets are generic and royalty-free
- Verify asset file sizes are reasonable for template
- Check that assets demonstrate good organization practices
- Remove any project-specific or copyrighted content

### 6. Test Directory Structure

Validate the cleaned directory structure works correctly.

**Estimated Time**: 2 hours
**Technical Details**:

- Test fresh clone and setup process
- Verify all build scripts work from clean state
- Test project creation workflow
- Validate all file references and imports work
- Ensure no missing dependencies or broken links
- Test cross-platform compatibility

### 7. Create Template Usage Documentation

Develop comprehensive instructions for using the template.

**Estimated Time**: 2 hours
**Technical Details**:

- Create TEMPLATE-USAGE.md with setup instructions
- Document required environment setup
- Provide examples of customizing the template
- Include troubleshooting guide
- Create video or visual guide if beneficial
- Document best practices for template customization

### 8. Final Validation and Size Optimization

Perform final checks and optimize template size.

**Estimated Time**: 1 hour
**Technical Details**:

- Run final audit script and address any issues
- Compress large files where possible
- Verify .gitignore is comprehensive
- Check template can be distributed easily
- Validate licensing and attribution
- Ensure template meets professional distribution standards

## Game Design Context

### GDD References

- Remove project-specific GDD content
- Keep template-appropriate game design examples
- Ensure documentation structure supports various game types

### Balance Parameters

```typescript
// Template should include example balance parameters
const TEMPLATE_GAME_CONFIG = {
    // Example values that template users can modify
    playerSpeed: 200,
    enemySpawnRate: 2000,
    scoreMultiplier: 1.0
};
```

### Visual/Audio Requirements

- Sample assets should be generic and professional
- Asset organization should demonstrate best practices
- Include examples of different asset types (sprites, audio, fonts)

## Testing Requirements

### Unit Tests

- `tests/template/audit.test.ts`: Test audit script functionality
- `tests/template/validation.test.ts`: Test template validation
- Test template creation process

### Integration Tests

- Full template setup and build test
- Cross-platform template usage test
- Template customization workflow test
- New project creation from template test

### Performance Tests

- Template download time: <30 seconds
- Template setup time: <2 minutes
- Template size: <100MB (excluding node_modules)
- Build time from fresh template: <5 minutes

### Gameplay Testing

- [ ] Sample game runs correctly from template
- [ ] All template features work in new projects
- [ ] Template can be customized without breaking functionality
- [ ] Template supports different game types and configurations

## Dependencies

### Prerequisite Stories

- TEMP-008: Clean Up Cached Files During Template Transfer
- TEMP-009: Verify GitHub Actions Pipeline Works Locally and Remotely

### System Dependencies

- PowerShell for audit scripts
- Git for repository operations
- Node.js for package validation
- File compression tools for optimization

### Asset Dependencies

- Generic sample assets (sprites, sounds, fonts)
- Template-appropriate example content
- Professional icons and branding elements

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Audit script created and executed successfully
- [ ] All unnecessary files and directories removed
- [ ] Directory structure is clean and logical
- [ ] All configuration files contain appropriate defaults
- [ ] Template usage documentation is comprehensive
- [ ] Template size is optimized and reasonable
- [ ] Template works correctly for new project creation
- [ ] All file references and dependencies are valid
- [ ] Template meets professional distribution standards

## Files/Directories to Review for Cleanup

### Likely to Remove

- [ ] `.bmad-core/` - Development-specific directory
- [ ] `.bmad-web-bundles/` - Development-specific directory
- [ ] `old docs/` - Legacy documentation
- [ ] `AI notes.md` - Development notes
- [ ] `TODO Lists/` - Development todos
- [ ] Personal README files (README-ORIGINAL-BACKUP.md)
- [ ] Development health reports and analysis files
- [ ] Project-specific research files

### Likely to Clean/Generalize

- [ ] `README.md` - Make template-appropriate
- [ ] `package.json` - Remove project-specific metadata
- [ ] All configuration files - Ensure generic defaults
- [ ] Documentation in `docs/` - Make template-relevant
- [ ] Example code - Ensure template-appropriate

### Validate and Keep

- [ ] Core source code structure
- [ ] Build and deployment configurations
- [ ] Testing frameworks and examples
- [ ] Asset directory structure
- [ ] Essential documentation

## Additional Notes

**Template Distribution Considerations**:

- Consider creating releases/tags for stable template versions
- Ensure licensing is clear for template usage
- Consider creating template variants for different game types
- Document versioning strategy for template updates

**Quality Standards**:

- Professional file organization
- Consistent naming conventions
- Comprehensive documentation
- Working examples
- Easy customization
- Cross-platform compatibility

**Post-Cleanup Verification**:

1. Test complete new project creation workflow
2. Verify template can be forked/cloned easily
3. Test on different operating systems
4. Validate with fresh development environment
5. Consider user acceptance testing with other developers
