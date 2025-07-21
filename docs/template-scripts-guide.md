# Template Script Usage Guide

This document provides a comprehensive guide to all available npm scripts in the Phaser Game Template, following the standardization completed in TEMP-012.

## Quick Reference

All template functionality is now accessible via npm scripts for cross-platform compatibility:

```bash
# Development
npm run dev              # Start development server
npm run build            # Build for production
npm run preview          # Preview production build

# Testing
npm test                 # Run unit tests
npm run test:e2e         # Run end-to-end tests
npm run test:performance # Run performance tests
npm run test:coverage    # Generate coverage report

# Code Quality
npm run lint             # Check code style
npm run lint:fix         # Fix code style issues
npm run format           # Format code
npm run typecheck        # Type checking

# Maintenance
npm run clean            # Clean all caches and build artifacts
npm run health:report    # Generate health report
npm run validate         # Run full validation suite
```

## Complete Script Reference

### Development Scripts

#### `npm run dev`
Starts the development server with hot reloading.
- **Environment**: Development
- **Port**: 5173 (default Vite port)
- **Features**: Hot module replacement, source maps, TypeScript compilation

#### `npm run build`
Creates optimized production build.
- **Output**: `dist/` directory
- **Process**: TypeScript compilation → Vite bundling → Asset optimization
- **Performance**: Tree-shaking, minification, compression

#### `npm run preview`
Serves the production build locally for testing.
- **Port**: 4173
- **Purpose**: Test production build before deployment
- **Requirements**: Must run `npm run build` first

### Testing Scripts

#### `npm test` / `npm run test:run`
Runs unit tests using Vitest.
- **Framework**: Vitest
- **Coverage**: Optional (use `npm run test:coverage`)
- **Config**: `testing/config/vitest.config.ts`

#### `npm run test:watch`
Runs tests in watch mode for development.
- **Features**: Auto-rerun on file changes, interactive UI
- **Best for**: Active development and debugging

#### `npm run test:ui`
Opens Vitest UI for interactive testing.
- **Access**: Browser-based interface
- **Features**: Visual test results, coverage visualization

#### `npm run test:e2e`
Runs end-to-end tests using Playwright.
- **Browsers**: Chrome, Firefox, Safari (configurable)
- **Config**: `testing/config/playwright.config.ts`
- **Requirements**: Built application for testing

#### `npm run test:performance`
Executes performance tests with proper environment setup.
- **Cross-platform**: Uses Node.js script runner
- **Features**: Process cleanup, timeout handling, CI optimization
- **Timeout**: 180s (local) / 300s (CI)

### Code Quality Scripts

#### `npm run lint`
Checks code style using ESLint.
- **Config**: `config/development/eslint.config.mjs`
- **Rules**: TypeScript, security, formatting rules
- **Scope**: `src/` directory and TypeScript files

#### `npm run lint:fix`
Automatically fixes linting issues where possible.
- **Safe fixes**: Formatting, imports, simple style issues
- **Manual review**: Check changes before committing

#### `npm run format`
Formats code using Prettier.
- **Files**: TypeScript, JSON, CSS files
- **Standards**: Consistent indentation, quotes, line endings

#### `npm run format:check`
Checks if code formatting is correct without making changes.
- **CI usage**: Validates formatting in automated builds
- **Exit codes**: 0 (formatted) / 1 (needs formatting)

#### `npm run typecheck`
Performs TypeScript type checking without compilation.
- **Speed**: Faster than full compilation
- **Coverage**: Type errors, interface compliance
- **Config**: `config/build/tsconfig.json`

### Maintenance Scripts

#### `npm run clean`
Removes all build artifacts, caches, and temporary files.
- **Cross-platform**: Node.js implementation
- **Scope**: node_modules, dist, coverage, cache directories
- **Safety**: Confirms before deletion

#### `npm run clean:dry-run`
Shows what would be deleted without actually removing files.
- **Purpose**: Preview cleanup operation
- **Safety**: No file system modifications

#### `npm run clean:backup`
Creates backup before cleaning (feature placeholder).
- **Status**: Prepared for future implementation
- **Use case**: Important development environments

#### `npm run health:report`
Generates comprehensive project health report.
- **Cross-platform**: Node.js implementation
- **Output**: `reports/health/health-report-{timestamp}.md`
- **Metrics**: Code quality, performance, dependencies

#### `npm run validate`
Runs complete validation suite.
- **Steps**: Type checking → Linting → Unit tests
- **Purpose**: Pre-commit validation, CI pipeline
- **Exit**: Fails fast on first error

### Build and Deployment Scripts

#### `npm run build:info`
Displays build information and environment details.
- **Data**: Version, commit hash, build timestamp
- **Usage**: Debugging build issues

#### `npm run deploy:staging`
Deploys to staging environment.
- **Config**: `environments/staging.json`
- **Requirements**: Proper credentials and build

#### `npm run deploy:production`
Deploys to production environment.
- **Safety**: Additional confirmations required
- **Config**: `environments/production.json`

#### `npm run rollback`
Performs deployment rollback to previous version.
- **Safety**: Confirms before rollback
- **Scope**: Application files, database migrations (if applicable)

### CI/CD and Testing Scripts

#### `npm run test:ci-compatibility`
Validates complete CI/CD compatibility.
- **Steps**: Validation → Build → Compatibility check
- **Purpose**: Ensure all CI requirements are met

#### `npm run verify:ci-setup`
Verifies CI configuration and setup.
- **Checks**: Environment variables, dependencies, permissions
- **Modes**: Basic check / Full check with secrets

### Template Management Scripts

#### `npm run template:setup`
Initializes template for new project (development only).
- **Location**: `scripts/template-cleanup/setup-template.js`
- **Purpose**: Template development and customization
- **Scope**: Not included in distributed template

#### `npm run template:verify`
Verifies template setup and configuration (development only).
- **Location**: `scripts/template-cleanup/verify-template-setup.sh`
- **Purpose**: Template validation during development

## Script Categories

### Production-Ready Scripts
Scripts that template users will use in their projects:
- All development scripts (`dev`, `build`, `preview`)
- All testing scripts (`test:*`)
- All code quality scripts (`lint`, `format`, `typecheck`)
- Maintenance scripts (`clean`, `validate`, `health:report`)

### Development-Only Scripts
Scripts for template development and customization:
- Template management (`template:*`)
- Advanced CI verification scripts
- Internal build utilities

### Cross-Platform Compatibility

All scripts now use cross-platform implementations:

- **Node.js scripts**: Platform-agnostic JavaScript/TypeScript
- **npm scripts**: Consistent across Windows, macOS, Linux
- **Path handling**: Uses Node.js path utilities
- **Process management**: Platform-specific process handling

### Migration from Shell Scripts

Previous shell scripts have been replaced:

| Old Script | New npm Script | Implementation |
|------------|----------------|----------------|
| `./scripts/cleanup-cache.sh` | `npm run clean` | Node.js script runner |
| `./scripts/cleanup-cache.ps1` | `npm run clean` | Node.js script runner |
| `./scripts/test-performance.sh` | `npm run test:performance` | Node.js script runner |
| `./scripts/generate-health-report.sh` | `npm run health:report` | Node.js script runner |
| `./verify-template-setup.sh` | `npm run template:verify` | Moved to template-cleanup |

## Best Practices

### Development Workflow
```bash
# Start development
npm run dev

# Before committing
npm run validate

# Clean workspace
npm run clean
```

### CI/CD Pipeline
```bash
# Validation
npm run validate

# Build
npm run build

# Testing
npm run test:e2e
npm run test:performance
```

### Troubleshooting
```bash
# Clean everything and reinstall
npm run clean
npm install

# Check types only
npm run typecheck

# Fix formatting issues
npm run format
npm run lint:fix
```

## Performance Considerations

- **Script startup**: Minimal overhead for npm script execution
- **Cross-platform**: <10% performance variance between platforms
- **Caching**: Leverages npm and tool-specific caching
- **Parallel execution**: Multiple scripts can run simultaneously when appropriate

## Environment Variables

Scripts respect common environment variables:
- `CI=true`: Enables CI-specific optimizations
- `NODE_ENV`: Controls development vs production behavior
- `TIMEOUT`: Custom timeout for performance tests

## Support

For issues with scripts:
1. Check this documentation
2. Review script output for error messages
3. Use `--dry-run` options where available
4. Check CI/CD logs for automation issues

## Script Configuration

Script behavior can be customized through:
- Configuration files in `config/` directory
- Environment variables
- Command-line arguments (where supported)
- Package.json script definitions
