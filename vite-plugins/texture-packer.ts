import { Plugin } from 'vite';
import { promises as fs } from 'fs';
import { join, basename, extname } from 'path';
import { MaxRectsPacker, Rectangle } from 'maxrects-packer';

export interface AtlasConfig {
    name: string;
    source: string; // Source directory
    files: string[]; // Sprite file patterns
    options: {
        maxSize: number;
        padding: number;
        trim: boolean;
        extrude: number;
    };
}

interface SpriteData {
    filename: string;
    frame: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    rotated: boolean;
    trimmed: boolean;
    spriteSourceSize: {
        x: number;
        y: number;
        w: number;
        h: number;
    };
    sourceSize: {
        w: number;
        h: number;
    };
}

interface AtlasData {
    frames: Record<string, SpriteData>;
    meta: {
        app: string;
        version: string;
        image: string;
        format: string;
        size: {
            w: number;
            h: number;
        };
        scale: string;
    };
}

export function texturePackerPlugin(atlases: AtlasConfig[]): Plugin {
    return {
        name: 'texture-packer',
        async buildStart() {
            console.log('🗂️  Starting texture atlas generation...');

            for (const atlas of atlases) {
                await generateAtlas(atlas);
            }

            console.log(`✅ Generated ${atlases.length} texture atlases`);
        }
    };
}

async function generateAtlas(config: AtlasConfig): Promise<void> {
    try {
        console.log(`📦 Generating atlas: ${config.name}`);

        // Find all sprite files
        const spriteFiles = await findSpriteFiles(config.source, config.files);

        if (spriteFiles.length === 0) {
            console.warn(`⚠️  No sprites found for atlas: ${config.name}`);
            return;
        }

        // Load sprite images and get dimensions
        const sprites = await loadSprites(spriteFiles, config.options);

        // Pack sprites into atlas
        const packedAtlas = packSprites(sprites, config);

        // Generate atlas image and JSON
        await saveAtlas(packedAtlas, config);

        console.log(
            `✅ Atlas ${config.name}: ${sprites.length} sprites → ${packedAtlas.width}x${packedAtlas.height}px`
        );
    } catch (error) {
        console.error(`❌ Failed to generate atlas ${config.name}:`, error);
        throw error;
    }
}

async function findSpriteFiles(sourceDir: string, patterns: string[]): Promise<string[]> {
    const files: string[] = [];

    try {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        const entries = await fs.readdir(sourceDir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = join(sourceDir, entry.name);

            if (entry.isDirectory()) {
                // Recursively search subdirectories
                const subFiles = await findSpriteFiles(fullPath, patterns);
                files.push(...subFiles);
            } else if (isSpriteFile(entry.name, patterns)) {
                files.push(fullPath);
            }
        }
    } catch {
        console.warn(`⚠️  Could not read directory: ${sourceDir}`);
    }

    return files;
}

function isSpriteFile(filename: string, patterns: string[]): boolean {
    const ext = extname(filename).toLowerCase();
    const isImage = ['.png', '.jpg', '.jpeg', '.gif', '.bmp', '.webp'].includes(ext);

    if (!isImage) return false;

    if (patterns.length === 0) return true;

    return patterns.some(pattern => {
        // Simple glob pattern matching
        // eslint-disable-next-line security/detect-non-literal-regexp
        const regex = new RegExp(pattern.replace(/\*/g, '.*'));
        return regex.test(filename);
    });
}

interface LoadedSprite {
    path: string;
    name: string;
    width: number;
    height: number;
    trimmed: {
        x: number;
        y: number;
        width: number;
        height: number;
    };
    originalWidth: number;
    originalHeight: number;
    buffer: Buffer;
}

async function loadSprites(
    spriteFiles: string[],
    options: AtlasConfig['options']
): Promise<LoadedSprite[]> {
    const sprites: LoadedSprite[] = [];

    for (const spritePath of spriteFiles) {
        try {
            // Dynamic import of sharp for ES module compatibility
            const { default: sharp } = await import('sharp');
            const image = sharp(spritePath);
            const metadata = await image.metadata();

            if (!metadata.width || !metadata.height) {
                console.warn(`⚠️  Could not read dimensions for: ${spritePath}`);
                continue;
            }

            let processedImage = image;
            let trimmed = {
                x: 0,
                y: 0,
                width: metadata.width,
                height: metadata.height
            };

            // Trim transparent pixels if enabled
            if (options.trim) {
                try {
                    const trimResult = await image.trim().toBuffer({ resolveWithObject: true });
                    processedImage = sharp(trimResult.data);

                    // Calculate trim offset (Sharp doesn't provide this directly)
                    trimmed = {
                        x: 0, // Would need additional logic to calculate exact trim offset
                        y: 0,
                        width: trimResult.info.width,
                        height: trimResult.info.height
                    };
                } catch {
                    // If trim fails, use original image
                    console.warn(`⚠️  Could not trim: ${spritePath}`);
                }
            }

            const buffer = await processedImage.png().toBuffer();

            sprites.push({
                path: spritePath,
                name: basename(spritePath, extname(spritePath)),
                width: trimmed.width,
                height: trimmed.height,
                trimmed,
                originalWidth: metadata.width,
                originalHeight: metadata.height,
                buffer
            });
        } catch (error) {
            console.error(`❌ Failed to load sprite: ${spritePath}`, error);
        }
    }

    return sprites;
}

interface PackedAtlas {
    width: number;
    height: number;
    sprites: Array<LoadedSprite & { x: number; y: number }>;
}

function packSprites(sprites: LoadedSprite[], config: AtlasConfig): PackedAtlas {
    const maxSize = config.options.maxSize;
    const padding = config.options.padding;

    // Create packer with max dimensions
    const packer = new MaxRectsPacker(maxSize, maxSize, padding);

    // Add rectangles for each sprite
    const rectangles: Rectangle[] = sprites.map(sprite => {
        const rect = new Rectangle(sprite.width, sprite.height);
        rect.data = sprite;
        return rect;
    });

    // Pack the rectangles
    packer.addArray(rectangles);

    if (packer.bins.length === 0) {
        throw new Error(`Could not fit sprites into atlas ${config.name}`);
    }

    if (packer.bins.length > 1) {
        console.warn(
            `⚠️  Atlas ${config.name} required ${packer.bins.length} bins - consider reducing sprite count or increasing max size`
        );
    }

    // Use the first bin
    const bin = packer.bins[0];
    if (!bin) {
        throw new Error(`Failed to pack sprites for atlas ${config.name}`);
    }

    const packedSprites = bin.rects.map(rect => ({
        ...(rect.data as LoadedSprite),
        x: rect.x,
        y: rect.y
    }));

    return {
        width: bin.width,
        height: bin.height,
        sprites: packedSprites
    };
}

async function saveAtlas(atlas: PackedAtlas, config: AtlasConfig): Promise<void> {
    const outputDir = 'assets/processed/atlases';
    await ensureDirectoryExists(outputDir);

    // Dynamic import of sharp for ES module compatibility
    const { default: sharp } = await import('sharp');

    // Create atlas image
    const atlasImage = sharp({
        create: {
            width: atlas.width,
            height: atlas.height,
            channels: 4,
            background: { r: 0, g: 0, b: 0, alpha: 0 }
        }
    });

    // Composite all sprites
    const composite = atlas.sprites.map(sprite => ({
        input: sprite.buffer,
        top: sprite.y,
        left: sprite.x
    }));

    const atlasImagePath = join(outputDir, `${config.name}.png`);
    await atlasImage.composite(composite).png().toFile(atlasImagePath);

    // Create JSON metadata
    const atlasData: AtlasData = {
        frames: {},
        meta: {
            app: 'Phaser Game Template Asset Pipeline',
            version: '1.0.0',
            image: `${config.name}.png`,
            format: 'RGBA8888',
            size: {
                w: atlas.width,
                h: atlas.height
            },
            scale: '1'
        }
    };

    // Add frame data for each sprite
    for (const sprite of atlas.sprites) {
        atlasData.frames[sprite.name] = {
            filename: sprite.name,
            frame: {
                x: sprite.x,
                y: sprite.y,
                w: sprite.width,
                h: sprite.height
            },
            rotated: false,
            trimmed:
                sprite.trimmed.width !== sprite.originalWidth ||
                sprite.trimmed.height !== sprite.originalHeight,
            spriteSourceSize: {
                x: sprite.trimmed.x,
                y: sprite.trimmed.y,
                w: sprite.trimmed.width,
                h: sprite.trimmed.height
            },
            sourceSize: {
                w: sprite.originalWidth,
                h: sprite.originalHeight
            }
        };
    }

    const atlasJsonPath = join(outputDir, `${config.name}.json`);
    // eslint-disable-next-line security/detect-non-literal-fs-filename
    await fs.writeFile(atlasJsonPath, JSON.stringify(atlasData, null, 2));
}

async function ensureDirectoryExists(dir: string): Promise<void> {
    try {
        // eslint-disable-next-line security/detect-non-literal-fs-filename
        await fs.mkdir(dir, { recursive: true });
    } catch {
        // Directory might already exist
    }
}
