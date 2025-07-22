export interface BundleOptimizationConfig {
    chunkSizeLimit: number;
    manualChunks: Record<string, string[]>;
    imageOptimization: ImageOptimizationConfig;
    atlasOptimization: AtlasOptimizationConfig;
}

export interface ImageOptimizationConfig {
    quality: number;
    formats: string[];
    progressive: boolean;
    calculateSavings: boolean;
}

export interface AtlasOptimizationConfig {
    maxBins: number;
    defaultMaxSize: number;
    paddingOptimization: boolean;
    sortBySize: boolean;
}

export const BUILD_OPTIMIZATION_CONFIG: BundleOptimizationConfig = {
    chunkSizeLimit: 1000 * 1024, // 1MB
    manualChunks: {
        'phaser-core': ['phaser/src/core'],
        'phaser-gameobjects': ['phaser/src/gameobjects'],
        'phaser-physics': ['phaser/src/physics'],
        'phaser-scene': ['phaser/src/scene'],
        'phaser-base': ['phaser'],
        vendor: [] // Will be determined dynamically
    },
    imageOptimization: {
        quality: 85,
        formats: ['webp', 'png'],
        progressive: true,
        calculateSavings: true
    },
    atlasOptimization: {
        maxBins: 2,
        defaultMaxSize: 2048,
        paddingOptimization: true,
        sortBySize: true
    }
};

export const BUILD_OPTIMIZATION_THRESHOLDS = {
    MAX_CHUNK_SIZE: 1000000, // 1MB max chunk size
    MIN_IMAGE_SAVINGS: 10, // Minimum 10% image savings
    MAX_ATLAS_BINS: 2, // Maximum 2 bins per atlas
    MAX_BUILD_TIME: 300000, // 5 minutes max build time
    TARGET_COMPRESSION_RATIO: 0.3 // Target 30% gzip compression
};

export default BUILD_OPTIMIZATION_CONFIG;
