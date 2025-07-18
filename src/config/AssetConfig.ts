/**
 * Asset Pipeline Configuration
 * Defines processing settings for different asset types
 */

export interface ImageQualityProfile {
    ui: number;
    sprites: number;
    backgrounds: number;
}

export interface AudioBitrateProfile {
    music: number;
    sfx: number;
    voice: number;
}

export interface AtlasSettings {
    maxSize: number;
    padding: number;
    algorithm: 'MaxRects' | 'ShelfPack';
    trim: boolean;
    extrude: number;
}

export interface AssetPipelineConfig {
    image: {
        formats: string[];
        quality: ImageQualityProfile;
        maxSize: {
            width: number;
            height: number;
        };
    };
    audio: {
        formats: string[];
        bitrates: AudioBitrateProfile;
    };
    atlas: AtlasSettings;
}

export const ASSET_PIPELINE_CONFIG: AssetPipelineConfig = {
    image: {
        formats: ['webp', 'png'], // WebP with PNG fallback
        quality: {
            ui: 95, // High quality for UI elements
            sprites: 85, // Balanced for game sprites
            backgrounds: 75 // Lower for large backgrounds
        },
        maxSize: {
            width: 2048, // Maximum texture size
            height: 2048
        }
    },
    audio: {
        formats: ['webm', 'mp3'], // WebM Opus with MP3 fallback
        bitrates: {
            music: 128, // kbps for background music
            sfx: 96, // kbps for sound effects
            voice: 64 // kbps for voice (if any)
        }
    },
    atlas: {
        maxSize: 2048, // Maximum atlas dimensions
        padding: 2, // Pixel padding between sprites
        algorithm: 'MaxRects', // Packing algorithm
        trim: true, // Remove transparent pixels
        extrude: 1 // Edge extrusion for filtering
    }
};

export interface SupportedFormats {
    image: string[];
    audio: string[];
}

export const ASSET_CATEGORIES = {
    UI: {
        quality: 'highest' as const,
        atlas: false, // UI elements loaded individually
        formats: ['png'] // No compression for pixel-perfect UI
    },
    SPRITES: {
        quality: 'balanced' as const,
        atlas: true, // Pack into texture atlases
        formats: ['webp', 'png']
    },
    BACKGROUNDS: {
        quality: 'optimized' as const,
        atlas: false, // Too large for atlases
        formats: ['webp', 'jpg']
    },
    PARTICLES: {
        quality: 'balanced' as const,
        atlas: true, // Pack small particle textures
        formats: ['webp', 'png']
    }
} as const;

export type AssetCategory = keyof typeof ASSET_CATEGORIES;
