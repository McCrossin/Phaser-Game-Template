# Story: Remove Git Configuration and Repository References
**ID**: TEMP-002  
**Epic**: Template Conversion  
**Priority**: High  
**Estimated Points**: 1  
**Dependencies**: TEMP-001

## Description

**⚠️ CRITICAL SAFETY ISSUE**: This repository is currently a copy of the New Eden Project and is still connected to the original repository (New-Eden-Project/main). Any commits made will be pushed to the main game repository, which must be prevented immediately.

Remove all New Eden Project git configuration details and repository references, replacing them with generic Phaser Game Template repository information. This includes disconnecting from the original repository, updating remote origins, repository metadata, and any hardcoded repository references in documentation or configuration.

### Player Experience Goal
Template users will have a clean repository setup without any references to the original New Eden Project repository, allowing them to immediately connect their new project to their own git repository.

**IMMEDIATE SAFETY CONCERN**: Developers working on this template conversion must not accidentally push changes to the New Eden Project repository. This story must be completed first to prevent accidental commits to the wrong repository.

### Technical Overview
**URGENT**: Clean up git configuration to prevent accidental commits to the New Eden Project repository. This repository is currently connected to McCrossin/New-Eden-Project and any commits will go to the main game repository.

Clean up git configuration, remove original repository references, update any hardcoded URLs or repository names in configuration files, and prepare the repository for template distribution with appropriate git setup.

## Acceptance Criteria

### Functional Requirements
- [x] **URGENT**: Disconnect from New Eden Project repository (McCrossin/New-Eden-Project)
- [x] All New Eden Project repository references removed
- [x] Git configuration cleaned for template use
- [ ] Repository URLs updated to template repository
- [x] Git history prepared for template distribution
- [x] Remote origins configured appropriately

### Technical Requirements
- [x] .git folder cleaned or prepared for template use
- [x] Repository URLs in configuration files updated
- [x] Any hardcoded repository references removed
- [x] GitHub repository metadata updated
- [x] Git-related documentation updated

### Game Design Requirements
- [x] Template repository ready for immediate use
- [x] No original project repository traces remain
- [x] Professional repository setup maintained
- [x] Template distribution ready

## Technical Specifications

### Git Configuration Updates

1. **Repository URL References**
   - Update any package.json repository fields
   - Clean up hardcoded repository URLs in configs
   - Update documentation links to repository
   - Remove original project remote origins

2. **Repository Metadata**
```json
// package.json repository configuration
{
  "repository": {
    "type": "git",
    "url": "https://github.com/[TEMPLATE-OWNER]/phaser-game-template.git"
  },
  "bugs": {
    "url": "https://github.com/[TEMPLATE-OWNER]/phaser-game-template/issues"
  },
  "homepage": "https://github.com/[TEMPLATE-OWNER]/phaser-game-template#readme"
}
```

3. **Git History Consideration**
   - Option A: Keep existing history for template development tracking
   - Option B: Create clean git history for template distribution
   - Option C: Squash commits to create clean template starting point

### Files to Update

1. **package.json**
   - Remove original repository references
   - Update bug tracking URLs
   - Update homepage references

2. **README.md and Documentation**
   - Update any repository clone instructions
   - Fix links to repository-specific content
   - Update issue reporting instructions

3. **Configuration Files**
   - Check for hardcoded repository URLs
   - Update CI/CD configuration references
   - Clean up deployment configurations

4. **Git Configuration**
   - Remove original remote origins
   - Set up template-appropriate git configuration
   - Prepare for template repository setup

### Template Setup Considerations

**IMMEDIATE ACTION REQUIRED**:
```bash
# FIRST - Prevent accidental pushes to New Eden Project
git remote remove origin  # Disconnects from McCrossin/New-Eden-Project

# Option 1: Create new template repository
git remote add origin [NEW-PHASER-TEMPLATE-REPO-URL]

# Option 2: Work locally until template repository is ready
# (No remote origin until template repository is created)

# SAFETY CHECK: Verify disconnection
git remote -v  # Should show no remotes or only new template remote
```

**For new projects created from template**:
```bash
# Git will be automatically configured by GitHub template system
# New users won't have this safety concern
```

## Implementation Tasks

### Phase 1: URGENT Repository Safety (0.1 days)
1. **IMMEDIATE**: Disconnect from New Eden Project repository
2. Verify no remote connections to McCrossin/New-Eden-Project
3. Document current repository state
4. Set up safe working environment

### Phase 2: Repository Reference Audit (0.15 days)
1. Search for all repository URLs and references
2. Identify hardcoded repository paths  
3. Catalog git-related configuration files
4. Document remaining cleanup needed

### Phase 3: Configuration Updates (0.5 days)
1. Update package.json repository metadata
2. Clean up repository references in documentation
3. Update configuration files with repository URLs
4. Set up new template repository connection

### Phase 4: Git History Preparation (0.25 days)
1. Decide on git history approach for template
2. Clean up sensitive or project-specific commits if needed
3. Prepare repository for template distribution
4. Test git configuration for new projects

## Testing Requirements

### Repository Configuration Tests
- All repository URLs point to template repository
- No original project repository references remain
- Git configuration works for new projects
- Repository metadata is accurate

### Template Distribution Tests
- Template repository can be cloned successfully
- New projects can be created from template
- Git setup works correctly for new users
- All repository links in documentation work

### Integration Tests
- CI/CD pipeline works with new repository configuration
- All build and deployment scripts function correctly
- Documentation links resolve properly
- Template distribution process validated

## Definition of Done

### Git Configuration Clean
- [x] **CRITICAL**: Original repository remote disconnected (McCrossin/New-Eden-Project)
- [x] All original repository references removed
- [ ] Template repository URLs configured
- [x] Git history prepared appropriately
- [x] Safe working environment established

### Repository Metadata Updated
- [x] Package.json repository fields updated
- [x] Documentation repository links corrected
- [x] Issue tracking URLs updated
- [x] Homepage references accurate

### Template Distribution Ready
- [x] Repository ready for GitHub template use
- [x] Git configuration works for new projects
- [x] All repository-related automation functional
- [x] Professional repository setup maintained

### Quality Assurance
- [x] No original project repository traces
- [x] All repository links tested and working
- [x] Template can be distributed immediately
- [x] Git workflow validated for template use

This story ensures the template has clean git configuration and is ready for distribution without any traces of the original New Eden Project repository.
