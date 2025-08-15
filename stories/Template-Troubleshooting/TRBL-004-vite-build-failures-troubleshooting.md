# Story: Vite Build Failures Troubleshooting

**ID**: TRBL-004  
**Epic**: Production Troubleshooting  
**Priority**: High  
**Estimated Points**: 2  
**Dependencies**: None  
**Type**: Production Troubleshooting Story

## 🚨 CRITICAL PRODUCTION TROUBLESHOOTING STORY NOTICE

**🔒 THIS IS A PRODUCTION TROUBLESHOOTING STORY - NEVER EDIT 🔒**

This story is designed for **REPEATED USE** across game projects when Vite build process fails. Follow the procedures exactly as written.

**⚠️ CRITICAL RULE**: If you're troubleshooting a feature implementation that broke the build:

1. Use THIS story for systematic debugging procedures
2. Reference the ORIGINAL feature implementation story for context
3. Make ALL fixes and updates in the ORIGINAL feature story - NEVER edit this troubleshooting story
4. Keep this story clean and unchanged for future troubleshooting sessions

## Description

Systematic troubleshooting procedure for Vite build failures in game projects. This includes asset loading issues, dependency resolution problems, TypeScript compilation in build context, and production optimization failures.

### Player Experience Goal

Ensure the game builds successfully for production deployment with optimal performance and correct asset loading.

### Technical Overview

Diagnose and resolve Vite build issues using build analysis tools, dependency checking, and configuration validation.

## Acceptance Criteria

### Functional Requirements

- [ ] `npm run build` completes successfully without errors
- [ ] All game assets are properly bundled and optimized
- [ ] Production build runs correctly in browser
- [ ] Bundle size meets optimization targets
- [ ] Source maps are generated correctly

### Technical Requirements

- [ ] Vite build process completes without compilation errors
- [ ] All dependencies are resolved correctly
- [ ] TypeScript compilation succeeds in build context
- [ ] Asset optimization and bundling works properly
- [ ] Build output is structured correctly

### Game Design Requirements

- [ ] Game functions identically in production build
- [ ] All game assets load correctly in production
- [ ] Game performance is maintained or improved
- [ ] Production build maintains game quality

## Technical Specifications

### Architecture Context

Vite build process transforms the development game code into an optimized production bundle. Build failures prevent deployment and indicate issues with dependencies, assets, or configuration.

### Files to Create/Modify

- `config/build/vite.config.ts`: Vite build configuration
- `config/build/tsconfig.build.json`: Build-specific TypeScript configuration
- `config/build/optimization.config.ts`: Build optimization settings
- `vite-plugins/`: Custom Vite plugins for game assets
- `package.json`: Build scripts and dependencies
- Source files with build issues

### Key Classes and Interfaces

```typescript
interface BuildResult {
    success: boolean;
    duration: number;
    bundleSize: number;
    errors: BuildError[];
    warnings: BuildWarning[];
    assets: AssetInfo[];
}

interface BuildConfiguration {
    target: string;
    outDir: string;
    sourcemap: boolean;
    minify: boolean;
    rollupOptions: RollupOptions;
}

interface AssetOptimization {
    images: ImageOptimizationConfig;
    audio: AudioOptimizationConfig;
    textures: TextureOptimizationConfig;
}
```

### Integration Points

- **Vite Build System**: Main build orchestration
- **TypeScript Compiler**: Code compilation during build
- **Rollup Bundler**: Asset bundling and optimization
- **Custom Plugins**: Game-specific asset processing
- **Asset Pipeline**: Image and audio optimization

### Performance Requirements

- Build completes within 5 minutes
- Bundle size under 10MB
- Build memory usage under 4GB
- Asset optimization maintains quality

## Implementation Tasks

### 1. Analyze Build Failure Output

**Estimated Time**: 30 minutes

Review build error output to understand the specific failure points.

**Technical Details**:

```bash
# Run build with verbose output
npm run build -- --mode development

# Check build with debug information
DEBUG=vite:* npm run build

# Analyze build info
npm run build:info

# Check build analysis
npm run build:analyze
```

**Error Analysis**:

- Identify specific build step failures
- Check dependency resolution issues
- Note asset loading problems
- Review TypeScript compilation errors in build context

### 2. Categorize Build Failures

**Estimated Time**: 15 minutes

Classify the type of build failure to apply appropriate resolution strategy.

**Technical Details**:

**Dependency Resolution Failures**:

- Missing or incompatible dependencies
- Module resolution issues
- Circular dependency problems
- External dependency loading issues

**Asset Processing Failures**:

- Image optimization failures
- Audio file processing issues
- Texture atlas generation problems
- Asset manifest creation errors

**TypeScript Compilation Failures**:

- Build-specific TypeScript configuration issues
- Type definition problems in build context
- Import/export resolution in build

**Bundle Optimization Failures**:

- Minification errors
- Tree-shaking issues
- Code splitting problems
- Source map generation failures

### 3. Debug Dependency Issues

**Estimated Time**: 45 minutes

Resolve dependency-related build failures.

**Technical Details**:

**Check Dependency Resolution**:

```bash
# Verify dependencies are installed
npm list --depth=0

# Check for dependency conflicts
npm ls --depth=0 | grep -E "(UNMET|peer dep missing)"

# Clean and reinstall dependencies
rm -rf node_modules package-lock.json
npm install

# Check for outdated dependencies
npm outdated
```

**Fix Import Issues**:

```typescript
// Before: Problematic import
import { GameComponent } from './relative/path';

// After: Resolved import
import { GameComponent } from '@/components/GameComponent';

// Check vite.config.ts alias configuration
export default defineConfig({
    resolve: {
        alias: {
            '@': path.resolve(__dirname, '../../src')
        }
    }
});
```

### 4. Resolve Asset Processing Issues

**Estimated Time**: 1 hour

Fix problems with asset loading and optimization during build.

**Technical Details**:

**Check Asset Pipeline**:

```bash
# Verify asset manifest
cat assets/processed/asset-manifest.json

# Check asset optimization
ls -la assets/processed/

# Test asset plugins
npm run dev # Verify assets work in dev mode
```

**Fix Asset Loading**:

```typescript
// Verify asset imports in build
import spriteUrl from '@/assets/sprites/player.png';

// Check Vite asset handling
export default defineConfig({
    assetsInclude: ['**/*.png', '**/*.jpg', '**/*.mp3', '**/*.json']
});
```

**Debug Custom Plugins**:

```typescript
// Check vite-plugins configuration
import { imageOptimizer } from './vite-plugins/image-optimizer';

export default defineConfig({
    plugins: [
        imageOptimizer({
            debug: true // Enable debug logging
        })
    ]
});
```

### 5. Fix TypeScript Build Issues

**Estimated Time**: 45 minutes

Resolve TypeScript compilation problems specific to the build process.

**Technical Details**:

**Check Build TypeScript Config**:

```json
// config/build/tsconfig.build.json
{
    "extends": "./tsconfig.json",
    "compilerOptions": {
        "outDir": "../../dist",
        "declaration": true,
        "sourceMap": true
    },
    "exclude": ["../../tests", "../../node_modules"]
}
```

**Fix Build-Specific Type Issues**:

```typescript
// Add build-specific type definitions
declare module '*.png' {
    const value: string;
    export default value;
}

declare module '*.mp3' {
    const value: string;
    export default value;
}
```

**Verify Build Script**:

```bash
# Check TypeScript compilation in build
npx tsc --project config/build/tsconfig.build.json

# Verify build process
npm run build
```

### 6. Optimize Build Configuration

**Estimated Time**: 1 hour

Adjust Vite configuration to resolve build optimization issues.

**Technical Details**:

**Update Vite Configuration**:

```typescript
// config/build/vite.config.ts
export default defineConfig({
    build: {
        target: 'es2022',
        outDir: '../../dist',
        sourcemap: true,
        minify: 'terser',

        rollupOptions: {
            output: {
                manualChunks: {
                    phaser: ['phaser'],
                    vendor: ['lodash', 'uuid']
                }
            }
        },

        // Increase chunk size limit if needed
        chunkSizeWarningLimit: 1000
    }
});
```

**Configure Asset Optimization**:

```typescript
export default defineConfig({
    plugins: [
        // Image optimization
        imageOptimizer({
            quality: 85,
            progressive: true
        }),

        // Audio optimization
        audioProcessor({
            bitrate: 128,
            format: 'mp3'
        })
    ]
});
```

### 7. Validate Build Success

**Estimated Time**: 30 minutes

Ensure the build completes successfully and produces correct output.

**Technical Details**:

```bash
# Run complete build
npm run build

# Verify build output
ls -la dist/

# Test production build
npm run preview

# Check bundle analysis
npm run build:analyze

# Verify build in different environments
npm run build -- --mode production
```

## Game Design Context

### GDD References

- **Asset Requirements**: Ensure all game assets are properly bundled
- **Performance Standards**: Maintain game performance in production build
- **Platform Support**: Build works across target platforms

### Balance Parameters

```typescript
const BUILD_CONFIGURATION = {
    bundleSize: {
        target: 8 * 1024 * 1024, // 8MB target
        warning: 10 * 1024 * 1024, // 10MB warning
        critical: 15 * 1024 * 1024 // 15MB critical
    },
    buildTime: {
        target: 180000, // 3 minutes
        warning: 300000, // 5 minutes
        critical: 600000 // 10 minutes
    },
    optimization: {
        minify: true,
        treeshake: true,
        compress: true,
        sourcemaps: true
    }
};
```

### Visual/Audio Requirements

- **Asset Quality**: Maintain visual and audio quality after optimization
- **Loading Performance**: Optimized assets for fast loading

## Testing Requirements

### Unit Tests

- Build configuration validation tests
- Asset optimization validation tests
- Plugin functionality tests

### Integration Tests

- **Build Process Integration**: Verify complete build pipeline
- **Asset Integration**: Ensure assets load correctly in build
- **Configuration Integration**: Validate all config files work together

### Performance Tests

- **Build Speed**: Build completes within time limits
- **Bundle Size**: Output meets size requirements
- **Asset Quality**: Optimized assets maintain acceptable quality

### Gameplay Testing

- [ ] Game functions identically in production build
- [ ] All assets load correctly in production
- [ ] Game performance is maintained
- [ ] No runtime errors in production build
- [ ] Save/load functionality works in production

## Dependencies

### Prerequisite Stories

- None - This is a standalone troubleshooting procedure

### System Dependencies

- **Vite**: Build system and bundler
- **TypeScript**: Code compilation
- **Node.js**: Build process runtime
- **Asset Optimization Tools**: Image and audio processing

### Asset Dependencies

- **Source Assets**: All game assets in assets/ folder
- **Build Configuration**: Vite and TypeScript config files
- **Custom Plugins**: Game-specific build plugins

## Definition of Done

- [ ] Build failure root cause identified
- [ ] Dependency issues resolved
- [ ] Asset processing problems fixed
- [ ] TypeScript compilation succeeds
- [ ] Build optimization works correctly
- [ ] `npm run build` completes successfully
- [ ] Production build runs correctly in browser
- [ ] Bundle size meets targets
- [ ] Build performance is acceptable
- [ ] CI pipeline build returns to green

## Build Troubleshooting Quick Reference

### Common Build Failures and Solutions

1. **Dependency Resolution Errors**

    ```bash
    # Clean and reinstall
    rm -rf node_modules package-lock.json
    npm install

    # Check for conflicts
    npm ls --depth=0
    ```

2. **Asset Loading Issues**

    ```typescript
    // Use proper asset imports
    import spriteUrl from '@/assets/sprite.png';

    // Check vite.config.ts asset handling
    assetsInclude: ['**/*.png', '**/*.mp3'];
    ```

3. **TypeScript Build Errors**

    ```bash
    # Check build-specific tsconfig
    npx tsc --project config/build/tsconfig.build.json

    # Verify type definitions
    ```

4. **Bundle Size Issues**

    ```typescript
    // Configure code splitting
    rollupOptions: {
        output: {
            manualChunks: {
                vendor: ['large-library'];
            }
        }
    }
    ```

5. **Plugin Failures**
    ```typescript
    // Debug custom plugins
    plugins: [myPlugin({ debug: true })];
    ```

### Build Debugging Commands

```bash
# Run build with debug
DEBUG=vite:* npm run build

# Analyze build output
npm run build:analyze

# Check build info
npm run build:info

# Test production build
npm run preview

# Verify dependencies
npm list --depth=0

# Clean build
npm run clean && npm run build
```

## 🔒 CRITICAL REMINDER

**NEVER EDIT THIS TROUBLESHOOTING STORY**

This is a production troubleshooting procedure designed for repeated use. If troubleshooting a feature implementation that broke the build:

1. ✅ **Use this story** for systematic debugging steps
2. ✅ **Reference the original feature story** for context of what was changed
3. ✅ **Make all fixes in the original feature story** based on findings here
4. ❌ **Never modify this troubleshooting story** - keep it clean for future use

Remember: The goal is to identify issues using this systematic approach, then apply fixes in the appropriate implementation stories.
