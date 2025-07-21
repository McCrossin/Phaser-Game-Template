# New Eden Project - Developer File Structure Recommendations

## Overview

Based on the current development state and brownfield architecture analysis, these recommendations will improve project organization, maintainability, and developer experience during active development.

**Priority**: Implement during next development sprint
**Impact**: Medium - Improves developer experience without breaking existing functionality
**Effort**: Low to Medium - Mostly file moves and configuration updates

---

## 1. Testing Infrastructure Consolidation

### Current State

Testing configurations are scattered across root directory:

- `playwright.config.ts` (root)
- `vitest.config.ts` (root)
- `tests/` directory with mixed structure

### Recommended Structure

```
testing/
├── config/
│   ├── playwright.config.ts      # Move from root
│   ├── vitest.config.ts          # Move from root
│   └── test-helpers.ts           # Common test utilities
├── unit/                         # Move from tests/unit/
├── e2e/                          # Move from tests/e2e/
├── performance/                  # Move from tests/e2e/performance/
└── fixtures/                     # Test data and mock files
```

### Implementation Steps

1. Create `testing/` directory structure
2. Move configuration files with updated import paths
3. Update `package.json` scripts to reference new paths
4. Update CI/CD configuration files

**Benefits**: Cleaner root directory, logical test organization, easier to find testing resources

---

## 2. Configuration Management Optimization

### Current State

Configuration files mixed throughout root directory

### Recommended Structure

```
config/
├── build/
│   ├── vite.config.ts           # Move from root
│   ├── tsconfig.json            # Move from root
│   ├── tsconfig.build.json      # Move from root
│   └── typedoc.json             # Move from root
├── development/
│   ├── eslint.config.mjs        # Move from root
│   └── .prettierrc              # Create if missing
├── deployment/
│   └── config.ts                # Already exists in deployment/
└── game/
    └── debug-config.ts          # From src/config/DebugConfig.ts
```

### Implementation Steps

1. Create `config/` directory with subdirectories
2. Move configuration files with path updates
3. Update all import statements in source files
4. Update build scripts and CI/CD references

**Benefits**: Centralized configuration management, easier environment-specific configs

---

## 3. Documentation Structure Enhancement

### Current State

Documentation is well-organized but could benefit from developer-focused structure

### Recommended Additions

```
docs/
├── developers/                  # NEW - Developer-specific documentation
│   ├── getting-started.md      # Quick start guide for new developers
│   ├── architecture-overview.md # High-level system overview
│   ├── coding-standards.md     # Development guidelines
│   └── debugging-guide.md      # Troubleshooting common issues
├── api/                        # Already exists - Generated TypeScript docs
├── technical/                  # Already exists and well-organized
└── deployment/                 # NEW - Deployment-specific docs
    ├── environment-setup.md
    ├── ci-cd-guide.md
    └── production-checklist.md
```

### Implementation Steps

1. Create developer documentation from existing content
2. Extract practical guidance from brownfield architecture
3. Create quick reference guides for common development tasks

**Benefits**: Faster onboarding for new developers, centralized development guidance

---

## 4. Asset Pipeline Organization

### Current State

Assets are organized but could be more granular for development

### Recommended Enhancement

```
assets/
├── source/                     # Rename from 'raw/'
│   ├── sprites/
│   ├── audio/                  # NEW - For future audio implementation
│   ├── ui/                     # NEW - UI elements and icons
│   └── effects/                # NEW - Particle effects, animations
├── processed/                  # Keep existing structure
│   ├── atlases/
│   ├── sprites/
│   └── manifests/              # NEW - Separate manifest files
└── development/                # NEW - Development-only assets
    ├── debug-textures/
    ├── test-sprites/
    └── placeholder-assets/
```

### Implementation Steps

1. Reorganize asset directories
2. Update asset pipeline configurations
3. Update import paths in game code
4. Create development asset guidelines

**Benefits**: Better asset organization, separation of development vs production assets

---

## 5. Source Code Structure Refinement

### Current State

Source code is well-organized with ECS architecture

### Recommended Enhancements

```
src/
├── core/                       # NEW - Core game framework
│   ├── Game.ts                # Main game class
│   ├── GameConfig.ts          # Centralized configuration
│   └── GameStates.ts          # Game state management
├── ecs/                       # Keep existing structure
├── systems/                   # Keep existing structure
├── components/                # Keep existing structure
├── scenes/                    # Keep existing structure
├── utils/                     # Keep existing structure
├── types/                     # Keep existing structure
├── services/                  # NEW - External integrations
│   ├── SaveLoadService.ts     # Save/load logic
│   ├── AssetService.ts        # Asset management
│   └── PerformanceService.ts  # Performance monitoring
└── constants/                 # NEW - Move from utils/Constants.ts
    ├── GameConstants.ts
    ├── UIConstants.ts
    └── PhysicsConstants.ts
```

### Implementation Steps

1. Create new directory structure
2. Refactor existing files into logical services
3. Update import paths throughout codebase
4. Create index files for clean imports

**Benefits**: Better separation of concerns, easier to locate functionality

---

## 6. Development Tools Organization

### Current State

Development scripts and tools are in various locations

### Recommended Structure

```
tools/
├── development/
│   ├── dev-server.js          # Custom development utilities
│   ├── asset-watcher.js       # Asset change monitoring
│   └── performance-profiler.js # Development performance tools
├── build/
│   ├── build-info.js          # Move from scripts/
│   ├── asset-optimizer.js     # Asset processing tools
│   └── bundle-analyzer.js     # Bundle size analysis
├── deployment/
│   ├── deploy.js              # Move from scripts/
│   ├── rollback.js            # Move from scripts/
│   └── environment-setup.js   # Environment configuration
└── maintenance/
    ├── cleanup.js             # Cache and temp file cleanup
    ├── dependency-audit.js    # Security and update checking
    └── documentation-sync.js  # Keep docs in sync
```

### Implementation Steps

1. Create `tools/` directory structure
2. Move existing scripts from `scripts/` directory
3. Create new development utilities
4. Update `package.json` script references

**Benefits**: Better organization of development tools, easier to find utilities

---

## 7. Environment Configuration Enhancement

### Current State

No clear environment-specific configuration structure

### Recommended Addition

```
environments/
├── development.json           # Development-specific settings
├── testing.json              # Testing environment settings
├── staging.json              # Staging deployment settings
├── production.json           # Production configuration
└── local.example.json        # Template for local overrides
```

### Implementation Steps

1. Create environment configuration files
2. Update build system to use environment configs
3. Create environment switching utilities
4. Document environment setup process

**Benefits**: Clear environment management, easier deployment configuration

---

## Implementation Priority

### **Phase 1: Immediate (Next Sprint)**

1. ✅ **Testing Infrastructure Consolidation** - Improves developer experience immediately
2. ✅ **Configuration Management** - Reduces root directory clutter

### **Phase 2: Short-term (Following Sprint)**

3. ✅ **Developer Documentation** - Improves onboarding and productivity
4. ✅ **Development Tools Organization** - Better development workflow

### **Phase 3: Medium-term (Next Month)**

5. ✅ **Source Code Structure Refinement** - Prepares for core systems implementation
6. ✅ **Asset Pipeline Enhancement** - Supports upcoming content implementation

### **Phase 4: Long-term (Future Consideration)**

7. ✅ **Environment Configuration** - Important for deployment but not urgent

---

## Migration Script Recommendations

### Create Migration Utilities

```bash
# Suggested npm scripts to add to package.json
"migrate:structure": "node tools/migration/restructure-project.js",
"migrate:configs": "node tools/migration/move-configs.js",
"migrate:tests": "node tools/migration/reorganize-tests.js",
"migrate:verify": "node tools/migration/verify-structure.js"
```

### Automated Migration Steps

1. Create backup of current structure
2. Run automated file moves with path updates
3. Update all configuration references
4. Verify build and test processes still work
5. Update documentation to reflect new structure

---

## Compatibility Considerations

### Maintain Compatibility

- Keep existing npm scripts working during transition
- Ensure CI/CD pipelines continue to function
- Preserve all existing functionality
- Update import paths gradually

### Risk Mitigation

- Implement changes in feature branch
- Test thoroughly before merging
- Document rollback procedures
- Communicate changes to team members

---

## Expected Benefits

### Developer Experience

- ✅ Faster navigation to relevant files
- ✅ Clearer project organization
- ✅ Easier onboarding for new team members
- ✅ Better separation of concerns

### Project Maintenance

- ✅ Easier to locate and update configurations
- ✅ More scalable project structure
- ✅ Better support for multiple environments
- ✅ Reduced cognitive load when working with codebase

### Future Development

- ✅ Structure supports planned feature implementation
- ✅ Easier to add new systems and components
- ✅ Better foundation for team collaboration
- ✅ Supports growth to larger development team

---

_Generated: July 21, 2025_
_Based on: Brownfield Architecture Analysis and Current Development State_
