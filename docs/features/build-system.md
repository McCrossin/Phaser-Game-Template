# Build System Documentation

The Phaser Game Template uses Vite as its build system, providing fast development and optimized production builds.

## Overview

**Vite** is a modern build tool that provides:
- ⚡ Lightning-fast dev server with Hot Module Replacement (HMR)
- 📦 Optimized production builds with Rollup
- 🔧 Zero-config TypeScript support
- 🎨 Built-in asset processing
- 🔌 Rich plugin ecosystem

## Development Build

### Dev Server Features

The development server provides an optimal development experience:

```bash
npm run dev
```

**Key Features:**
- **Hot Module Replacement**: Instant updates without page refresh
- **Fast Startup**: Sub-second server startup time
- **Source Maps**: Debug original TypeScript code
- **Error Overlay**: Clear error messages in browser
- **TypeScript Integration**: Real-time type checking

### Configuration

The dev server is configured in `vite.config.ts`:

```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  // Development server configuration
  server: {
    port: 5173,
    host: true,  // Allow external connections
    open: true,  // Auto-open browser
    cors: true   // Enable CORS
  },
  
  // TypeScript path resolution
  resolve: {
    alias: {
      '@': resolve(__dirname, 'src'),
      '@assets': resolve(__dirname, 'assets')
    }
  },
  
  // Asset handling
  assetsInclude: ['**/*.png', '**/*.jpg', '**/*.mp3', '**/*.wav']
});
```

### Development Optimizations

**Fast Refresh for Game Development:**
```typescript
// Preserve game state during hot reload
if (import.meta.hot) {
  import.meta.hot.accept('./gameConfig', (newModule) => {
    // Update game config without full reload
    updateGameConfig(newModule.gameConfig);
  });
}
```

**Asset Hot Reload:**
```typescript
// Assets update automatically during development
const texture = this.load.image('player', '/assets/player.png');
// Changes to player.png will update immediately
```

## Production Build

### Build Process

Generate optimized production builds:

```bash
npm run build
```

**Build Steps:**
1. **TypeScript Compilation**: Type checking and compilation
2. **Asset Processing**: Image optimization and compression
3. **Code Bundling**: Module bundling with Rollup
4. **Minification**: Code minification and tree shaking
5. **Output Generation**: Optimized files in `dist/` folder

### Build Configuration

Production builds are optimized for performance:

```typescript
export default defineConfig({
  build: {
    // Output directory
    outDir: 'dist',
    
    // Generate source maps for debugging
    sourcemap: true,
    
    // Minification settings
    minify: 'esbuild',
    
    // Rollup configuration
    rollupOptions: {
      output: {
        // Manual chunk splitting
        manualChunks: {
          // Separate Phaser into its own chunk
          phaser: ['phaser'],
          
          // Vendor libraries
          vendor: ['uuid', 'lodash']
        }
      }
    },
    
    // Bundle size limits
    chunkSizeWarningLimit: 1000
  }
});
```

### Asset Optimization

**Image Processing:**
```typescript
// Automatic image optimization
build: {
  assetsInlineLimit: 4096, // Inline small images
  
  // Asset naming for caching
  rollupOptions: {
    output: {
      assetFileNames: (assetInfo) => {
        const info = assetInfo.name.split('.');
        const ext = info[info.length - 1];
        
        if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
          return `images/[name]-[hash][extname]`;
        }
        if (/mp3|wav|ogg/i.test(ext)) {
          return `audio/[name]-[hash][extname]`;
        }
        return `assets/[name]-[hash][extname]`;
      }
    }
  }
}
```

## TypeScript Integration

### Compiler Configuration

TypeScript compilation is configured via `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "moduleResolution": "node",
    "strict": true,
    "jsx": "preserve",
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    
    // Path mapping
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"],
      "@assets/*": ["assets/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist"]
}
```

### Build-time Type Checking

```bash
# Type check without building
npm run type-check

# Type check in watch mode
npm run type-check:watch
```

### Vite TypeScript Plugin

```typescript
import { defineConfig } from 'vite';
import typescript from '@rollup/plugin-typescript';

export default defineConfig({
  plugins: [
    typescript({
      // TypeScript compiler options
      compilerOptions: {
        outDir: 'dist',
        declaration: true,
        declarationMap: true
      }
    })
  ]
});
```

## Asset Pipeline

### Asset Processing

Vite automatically processes different asset types:

**Images:**
```typescript
// Static imports (bundled and optimized)
import playerSprite from '@assets/player.png';

// Dynamic imports (code splitting)
const backgroundImage = await import('@assets/background.png');

// URL imports (for dynamic loading)
import playerUrl from '@assets/player.png?url';
```

**Audio Files:**
```typescript
// Audio asset handling
import shootSound from '@assets/audio/shoot.mp3';
import backgroundMusic from '@assets/audio/music.ogg';

// Phaser asset loading
this.load.audio('shoot', shootSound);
this.load.audio('bgMusic', backgroundMusic);
```

**JSON Data:**
```typescript
// Static JSON imports
import gameConfig from '@assets/data/config.json';

// Dynamic JSON loading
const levelData = await import('@assets/data/level1.json');
```

### Asset Optimization Settings

```typescript
// vite.config.ts asset configuration
export default defineConfig({
  // Asset handling
  assetsInclude: [
    '**/*.tmx',      // Tiled map files
    '**/*.tsx',      // Tiled tileset files
    '**/*.fnt',      // Bitmap font files
    '**/*.atlas'     // Texture atlas files
  ],
  
  // CSS handling for UI
  css: {
    modules: {
      localsConvention: 'camelCase'
    }
  }
});
```

## Environment Configuration

### Environment Variables

Configure different environments using `.env` files:

**.env.development:**
```env
VITE_API_URL=http://localhost:3000
VITE_DEBUG_MODE=true
VITE_ENABLE_PHYSICS_DEBUG=true
VITE_SHOW_FPS=true
```

**.env.production:**
```env
VITE_API_URL=https://api.yourgame.com
VITE_DEBUG_MODE=false
VITE_ENABLE_PHYSICS_DEBUG=false
VITE_SHOW_FPS=false
```

**Usage in Code:**
```typescript
// Access environment variables
const apiUrl = import.meta.env.VITE_API_URL;
const debugMode = import.meta.env.VITE_DEBUG_MODE === 'true';

// Environment-specific configuration
export const gameConfig = {
  physics: {
    default: 'matter',
    matter: {
      debug: debugMode
    }
  },
  fps: {
    target: 60,
    forceSetTimeOut: true,
    showFPS: import.meta.env.VITE_SHOW_FPS === 'true'
  }
};
```

### Build Modes

```bash
# Development mode
npm run dev

# Production mode
npm run build

# Preview production build
npm run preview

# Custom mode
vite build --mode staging
```

## Plugin System

### Essential Plugins

The template includes optimized plugins:

```typescript
import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    // TypeScript support
    typescript({
      tsconfig: './tsconfig.json'
    }),
    
    // Asset optimization
    {
      name: 'asset-optimizer',
      generateBundle(options, bundle) {
        // Custom asset processing
      }
    }
  ]
});
```

### Game-Specific Plugins

**Phaser Asset Plugin:**
```typescript
// Custom plugin for Phaser asset handling
const phaserAssetPlugin = () => ({
  name: 'phaser-assets',
  load(id) {
    if (id.endsWith('.atlas')) {
      // Handle texture atlas files
      return processAtlasFile(id);
    }
  }
});
```

## Performance Optimization

### Bundle Analysis

Analyze bundle composition:

```bash
# Generate bundle report
npm run build:analyze

# Visualize bundle
npx vite-bundle-analyzer dist
```

### Code Splitting Strategies

**Route-based Splitting:**
```typescript
// Dynamic scene imports for code splitting
const GameScene = () => import('./scenes/GameScene');
const MenuScene = () => import('./scenes/MenuScene');

// Lazy load scenes
async function loadScene(sceneName: string) {
  const SceneClass = await sceneName === 'game' 
    ? GameScene() 
    : MenuScene();
  
  return new SceneClass.default();
}
```

**Library Splitting:**
```typescript
// Manual chunk configuration
build: {
  rollupOptions: {
    output: {
      manualChunks: (id) => {
        if (id.includes('phaser')) return 'phaser';
        if (id.includes('node_modules')) return 'vendor';
        if (id.includes('scenes/')) return 'scenes';
        if (id.includes('components/')) return 'components';
      }
    }
  }
}
```

### Tree Shaking

Optimize bundle size with tree shaking:

```typescript
// Use named imports for better tree shaking
import { Scene, GameObjects } from 'phaser';

// Instead of
import * as Phaser from 'phaser';

// Export only what's needed
export { GameScene } from './GameScene';
export { Player } from './Player';

// Instead of
export * from './index';
```

## Build Scripts

### Available Scripts

```json
{
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview",
    "build:analyze": "vite build && npx vite-bundle-analyzer dist",
    "build:prod": "vite build --mode production",
    "build:staging": "vite build --mode staging",
    "type-check": "tsc --noEmit",
    "type-check:watch": "tsc --noEmit --watch"
  }
}
```

### Custom Build Scripts

**Health Check Build:**
```bash
#!/bin/bash
# build-with-health.sh

echo "🔍 Running health checks..."
npm run health

echo "🔧 Type checking..."
npm run type-check

echo "🏗️ Building production..."
npm run build

echo "📊 Analyzing bundle..."
npm run build:analyze

echo "✅ Build complete!"
```

## Troubleshooting

### Common Build Issues

**TypeScript Errors:**
```bash
# Clear TypeScript cache
rm -rf node_modules/.cache
npm run type-check
```

**Asset Loading Issues:**
```typescript
// Ensure correct asset paths
const assetPath = new URL('../assets/image.png', import.meta.url).href;
```

**Memory Issues:**
```bash
# Increase Node.js memory
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build
```

### Performance Optimization

**Large Bundle Size:**
```typescript
// Check for unnecessary imports
import { specific } from 'large-library';
// Instead of
import * as everything from 'large-library';
```

**Slow Development Server:**
```typescript
// Optimize dev server
server: {
  fs: {
    // Improve file system performance
    strict: false,
    allow: ['..']
  }
}
```

---

**Next Steps:**
- [Testing Framework](testing-framework.md) - Learn about testing setup
- [CI/CD Pipeline](ci-cd-pipeline.md) - Automated build and deployment
- [Performance Tools](performance-tools.md) - Optimization techniques
