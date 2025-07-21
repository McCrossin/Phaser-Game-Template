# Template Directory Structure

The Phaser Game Template has been organized with a clean, professional directory structure that follows modern web development best practices.

## Root Directory

The root directory contains only essential files for the template:

```
├── index.html              # Main HTML entry point
├── package.json            # Project dependencies and scripts
├── README.md              # This documentation
├── TEMPLATE-USAGE.md      # Template usage instructions
├── setup-template.js      # Template setup script
├── verify-template-setup.sh # Template verification script
├── Dockerfile             # Docker configuration
├── docker-compose.yml     # Docker Compose configuration
├── nginx.conf             # Nginx configuration
└── thumbnail.png          # Project thumbnail
```

## Core Directories

### `/src/` - Source Code
Contains all TypeScript source code for the game:
- `components/` - ECS components
- `systems/` - Game systems
- `scenes/` - Phaser scenes
- `types/` - TypeScript type definitions
- `utils/` - Utility functions
- `ecs/` - Entity-Component-System framework
- `config/` - Game configuration

### `/assets/` - Game Assets
Organized asset directory structure:
- `source/` - Original source assets
- `processed/` - Optimized and processed assets
- Asset processing happens automatically during build

### `/config/` - Configuration Files
Build and development configuration:
- `build/` - Build system configuration (Vite, TypeScript, etc.)
- `development/` - Development tools configuration (ESLint, etc.)
- `deployment/` - Deployment configuration
- `monitoring/` - Health monitoring configuration

### `/docs/` - Documentation
Template and development documentation:
- `setup/` - Template setup guides
- `examples/` - Usage examples
- `development/` - Development documentation
- `api/` - Generated API documentation

## Development Tools

### `/scripts/` - Build and Utility Scripts
Automation scripts for common tasks:
- Build scripts
- Cleanup utilities
- CI/CD helpers

### `/tools/` - Development Tools
Advanced development and maintenance tools:
- Build tools
- Deployment utilities
- Monitoring tools
- Maintenance scripts

### `/testing/` - Test Suite
Comprehensive testing setup:
- `unit/` - Unit tests
- `integration/` - Integration tests
- `e2e/` - End-to-end tests
- `config/` - Testing configuration

## Template-Specific Features

### Template Structure Validation
The template includes automatic structure validation:
- Root directory file count limits
- Required directory verification
- Path reference validation
- Build process integrity checks

### Clean Development Workflow
- No development artifacts in template
- Clear separation of concerns
- Industry-standard conventions
- Easy customization paths

## Usage

After setting up the template, you can:

1. **Start Development**: `npm run dev`
2. **Build Production**: `npm run build`
3. **Run Tests**: `npm run test`
4. **Lint Code**: `npm run lint`

The structure supports easy expansion while maintaining organization and performance.
