# Asset Pipeline Documentation

## Overview

The New Eden Project uses an automated asset pipeline that processes images, audio, and generates texture atlases during the build process. This pipeline optimizes assets for web delivery while maintaining quality and supporting multiple formats.

## Pipeline Components

### 1. Image Optimizer
- **Location**: `build/plugins/image-optimizer.ts`
- **Purpose**: Compresses images and generates WebP versions with PNG fallbacks
- **Quality Settings**:
  - UI elements: 95% quality
  - Game sprites: 85% quality  
  - Backgrounds: 75% quality

### 2. Texture Packer
- **Location**: `build/plugins/texture-packer.ts`
- **Purpose**: Combines multiple sprites into texture atlases
- **Features**:
  - MaxRects packing algorithm
  - Automatic sprite trimming
  - JSON metadata generation for Phaser

### 3. Audio Processor
- **Location**: `build/plugins/audio-processor.ts`
- **Purpose**: Optimizes audio files with format conversion
- **Formats**: WebM (Opus) with MP3 fallback
- **Bitrates**:
  - Music: 128kbps
  - Sound effects: 96kbps
  - Voice: 64kbps

### 4. Asset Manifest Generator
- **Location**: `build/plugins/asset-manifest.ts`
- **Purpose**: Creates loading manifests for intelligent asset preloading
- **Categories**: Essential, Level-specific, Optional

### 5. Enhanced Asset Loader
- **Location**: `src/systems/AssetLoader.ts`
- **Purpose**: Loads assets with progressive loading and format detection
- **Features**:
  - Runtime format support detection
  - Progress tracking
  - Category-based loading

## Directory Structure

```
assets/
├── raw/                    # Source assets (not committed)
│   ├── sprites/           # Game sprites for atlasing
│   ├── ui/               # UI elements
│   ├── audio/            # Audio files
│   └── backgrounds/      # Background images
└── processed/            # Optimized assets (generated)
    ├── images/           # Optimized images
    ├── atlases/          # Generated texture atlases
    ├── audio/            # Compressed audio
    └── asset-manifest.json # Loading manifest
```

## Asset Naming Conventions

### Images
- UI elements: `assets/raw/ui/button-primary.png`
- Game sprites: `assets/raw/sprites/player-idle.png`
- Backgrounds: `assets/raw/backgrounds/space-nebula.jpg`

### Audio
- Music: `assets/raw/audio/music/main-theme.wav`
- Sound effects: `assets/raw/audio/sfx/laser-shot.wav`
- Voice: `assets/raw/audio/voice/narrator-intro.wav`

## Configuration

Asset pipeline settings are defined in `src/config/AssetConfig.ts`:

```typescript
export const ASSET_PIPELINE_CONFIG = {
    image: {
        formats: ['webp', 'png'],
        quality: {
            ui: 95,
            sprites: 85,
            backgrounds: 75
        },
        maxSize: { width: 2048, height: 2048 }
    },
    audio: {
        formats: ['webm', 'mp3'],
        bitrates: {
            music: 128,
            sfx: 96,
            voice: 64
        }
    },
    atlas: {
        maxSize: 2048,
        padding: 2,
        algorithm: 'MaxRects',
        trim: true,
        extrude: 1
    }
};
```

## Build Integration

The pipeline integrates with Vite through plugins in `vite.config.ts`:

```typescript
plugins: [
    imageOptimizerPlugin({
        sourceDir: resolve(__dirname, 'assets/raw'),
        outputDir: resolve(__dirname, 'assets/processed'),
        isDev: process.env.NODE_ENV === 'development',
    }),
    texturePackerPlugin([
        {
            name: 'sprites',
            source: resolve(__dirname, 'assets/raw/sprites'),
            files: ['*.png', '*.jpg'],
            options: { maxSize: 2048, padding: 2, trim: true, extrude: 1 }
        }
    ]),
    // ... other plugins
]
```

## Usage in Game Code

### Basic Asset Loading

```typescript
import { AssetLoader } from '@/systems/AssetLoader';

// In a Phaser scene
const assetLoader = new AssetLoader(this);

// Set up progress callback
assetLoader.setProgressCallback((progress) => {
    console.log(`Loading ${progress.category}: ${progress.percentage}%`);
});

// Load essential assets first
await assetLoader.preloadEssential();

// Load level-specific assets
await assetLoader.preloadLevel('level-1');

// Load optional assets in background
await assetLoader.preloadOptional();
```

### Using Processed Assets

```typescript
// Images are automatically loaded with best format
this.add.image(100, 100, 'player-sprite');

// Atlases work the same way
this.add.sprite(200, 200, 'sprites', 'player-idle-01');

// Audio with format fallbacks
this.sound.add('laser-shot').play();
```

## Development vs Production

### Development Mode
- Asset optimization is skipped for faster iteration
- Assets are served directly from `assets/raw/`
- Basic manifest is generated

### Production Mode
- Full optimization pipeline runs
- Assets are processed and saved to `assets/processed/`
- Complete manifest with hashes and metadata

## Performance Targets

- **Image compression**: 40-60% size reduction
- **Texture atlases**: 70% draw call reduction
- **Audio compression**: 50-70% size reduction
- **Total bundle size**: <10MB initial load
- **Build time increase**: <30 seconds

## Troubleshooting

### Common Issues

1. **FFmpeg not found**: Audio optimization will skip if FFmpeg is not installed
2. **Large textures**: Images larger than 2048x2048 are automatically resized
3. **Atlas overflow**: Sprites that don't fit are warned about in console
4. **Missing assets**: Check console for asset loading warnings

### Debug Information

The pipeline provides detailed logging:
- Image optimization results with size savings
- Atlas generation with sprite counts
- Audio compression statistics
- Asset manifest summary

## Adding New Asset Types

To support new asset types:

1. Add type to `AssetEntry` interface in `asset-manifest.ts`
2. Update `AssetLoader` to handle the new type
3. Create processor plugin if needed
4. Update configuration in `AssetConfig.ts`

## Browser Compatibility

The pipeline automatically detects browser capabilities:
- WebP support detection with PNG fallback
- WebM audio support with MP3 fallback
- Graceful degradation for older browsers
