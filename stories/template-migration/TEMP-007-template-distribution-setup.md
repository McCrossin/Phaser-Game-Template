# Story: Create Template Repository Setup and Distribution

**ID**: TEMP-007  
**Epic**: Template Conversion  
**Priority**: Medium  
**Estimated Points**: 2  
**Dependencies**: TEMP-001, TEMP-002, TEMP-003, TEMP-004, TEMP-005, TEMP-006

## Description

Prepare the template for distribution by creating repository setup instructions, template clone/setup automation, and ensuring the template is ready to be used as a GitHub template repository or distributed independently.

### Player Experience Goal

Developers will be able to quickly create new projects from this template through GitHub's template feature or by cloning and setting up the repository with minimal manual configuration.

### Technical Overview

Create automation scripts for template setup, prepare the repository for GitHub template distribution, and ensure all template features work correctly when instantiated as a new project.

## Acceptance Criteria

### Functional Requirements

- [ ] Repository configured as GitHub template
- [ ] Template setup automation script created
- [ ] New project initialization process documented
- [ ] Template distribution options provided
- [ ] Setup verification process included

### Technical Requirements

- [ ] GitHub template configuration complete
- [ ] Automated setup script functional
- [ ] Template cloning process tested
- [ ] All dependencies properly configured
- [ ] Build system works in new projects

### Game Design Requirements

- [ ] Template supports various 2D game projects
- [ ] Professional development workflow maintained
- [ ] Template easily customizable for different genres
- [ ] Quality standards preserved in template usage

## Technical Specifications

### GitHub Template Configuration

1. **Repository Settings**
    - Enable "Template repository" in GitHub settings
    - Configure repository description for template use
    - Set appropriate repository topics/tags
    - Configure default branch and protections

2. **Template Configuration File**

```json
{
    "name": "phaser-game-template",
    "description": "Professional 2D Phaser game template with CI/CD and monitoring",
    "visibility": "public",
    "template": true,
    "topics": ["phaser", "typescript", "game-template", "2d-game", "vite"]
}
```

### Setup Automation Script

Create `setup-template.js` for automated project initialization:

```javascript
#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Template setup automation
function setupNewProject(projectName, gameTitle, author) {
    console.log(`Setting up new game project: ${projectName}`);

    // Update package.json
    updatePackageJson(projectName, gameTitle, author);

    // Update configuration files
    updateConfigurations(projectName, gameTitle);

    // Initialize git repository
    initializeGit();

    // Install dependencies
    installDependencies();

    console.log('Template setup complete!');
}
```

### Template Distribution Options

1. **GitHub Template**
    - Use GitHub's "Use this template" button
    - Automatic repository creation
    - Preserves all template features

2. **Manual Clone Setup**
    - Clone repository
    - Run setup script
    - Manual configuration

3. **NPX Package** (Future consideration)
    - `npx create-phaser-game my-game`
    - Automated project scaffolding

### Setup Verification Process

```bash
# verify-template-setup.sh
#!/bin/bash

echo "Verifying template setup..."

# Check build system
npm run build
if [ $? -ne 0 ]; then
  echo "❌ Build failed"
  exit 1
fi

# Check tests
npm test
if [ $? -ne 0 ]; then
  echo "❌ Tests failed"
  exit 1
fi

# Check health monitoring
npm run health:check
if [ $? -ne 0 ]; then
  echo "❌ Health check failed"
  exit 1
fi

echo "✅ Template setup verified successfully"
```

## Implementation Tasks

### Phase 1: Repository Configuration (0.5 days)

1. Configure GitHub template settings
2. Update repository metadata
3. Set up template-specific documentation
4. Configure repository protections

### Phase 2: Setup Automation (1 day)

1. Create template setup script
2. Implement project configuration automation
3. Add setup verification process
4. Test automation with new projects

### Phase 3: Distribution Preparation (0.5 days)

1. Create template usage instructions
2. Test GitHub template functionality
3. Verify manual setup process
4. Prepare distribution documentation

## Testing Requirements

### Template Functionality Tests

- GitHub template creation works correctly
- Setup automation script functions properly
- All template features work in new projects
- Verification process catches issues

### Distribution Tests

- Template can be used via GitHub interface
- Manual clone and setup process works
- All documentation is accurate
- New projects build and run correctly

### User Experience Tests

- Template setup is straightforward
- Documentation is clear and complete
- Common issues are addressed
- Template provides immediate value

## Definition of Done

### Repository Setup

- [ ] GitHub template configuration complete
- [ ] Repository properly configured for distribution
- [ ] Template metadata accurate and helpful
- [ ] Distribution options documented

### Automation Complete

- [ ] Template setup script functional
- [ ] Project configuration automation working
- [ ] Setup verification process implemented
- [ ] All automation tested and documented

### Distribution Ready

- [ ] Template works via GitHub template feature
- [ ] Manual setup process documented and tested
- [ ] All template features preserved in new projects
- [ ] Ready for public distribution

### Quality Assurance

- [ ] Template setup tested by multiple users
- [ ] All documentation validated
- [ ] Common issues identified and addressed
- [ ] Professional quality maintained

### Template Validation

- [ ] New projects created from template work correctly
- [ ] All monitoring and CI/CD features functional
- [ ] Template provides immediate development value
- [ ] Setup process is efficient and reliable

This story completes the template conversion by making it ready for distribution and use by other developers.
