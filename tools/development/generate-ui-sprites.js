#!/usr/bin/env node

/**
 * Generate basic UI sprites for the UI atlas
 * This creates minimal placeholder UI elements to resolve the missing atlas issue
 */

import { promises as fs } from 'fs';
import path from 'path';

async function generateUISprites() {
    // Dynamic import of sharp for ES module compatibility
    const { default: sharp } = await import('sharp');

    const outputDir = 'assets/source/ui';

    // Ensure output directory exists
    await fs.mkdir(outputDir, { recursive: true });

    console.log('🎨 Generating basic UI sprites...');

    // Button states
    const buttonColors = {
        'button-normal': { r: 0, g: 100, b: 200, alpha: 1 },
        'button-hover': { r: 0, g: 120, b: 240, alpha: 1 },
        'button-pressed': { r: 0, g: 80, b: 160, alpha: 1 },
        'button-disabled': { r: 100, g: 100, b: 100, alpha: 0.5 }
    };

    // Panel backgrounds
    const panelColors = {
        'panel-dark': { r: 20, g: 20, b: 40, alpha: 0.9 },
        'panel-light': { r: 40, g: 40, b: 80, alpha: 0.8 },
        'panel-border': { r: 100, g: 150, b: 255, alpha: 1 }
    };

    // Progress bar elements
    const progressColors = {
        'progress-bg': { r: 40, g: 40, b: 40, alpha: 1 },
        'progress-fill': { r: 0, g: 255, b: 100, alpha: 1 },
        'progress-border': { r: 200, g: 200, b: 200, alpha: 1 }
    };

    // Icon placeholders
    const iconColors = {
        'icon-settings': { r: 200, g: 200, b: 200, alpha: 1 },
        'icon-play': { r: 0, g: 255, b: 0, alpha: 1 },
        'icon-pause': { r: 255, g: 255, b: 0, alpha: 1 },
        'icon-stop': { r: 255, g: 0, b: 0, alpha: 1 }
    };

    // Generate button sprites (256x64 px)
    for (const [name, color] of Object.entries(buttonColors)) {
        const image = sharp({
            create: {
                width: 256,
                height: 64,
                channels: 4,
                background: color
            }
        });

        await image.png().toFile(path.join(outputDir, `${name}.png`));
        console.log(`  ✅ Created ${name}.png`);
    }

    // Generate panel backgrounds (512x512 px)
    for (const [name, color] of Object.entries(panelColors)) {
        const image = sharp({
            create: {
                width: 512,
                height: 512,
                channels: 4,
                background: color
            }
        });

        await image.png().toFile(path.join(outputDir, `${name}.png`));
        console.log(`  ✅ Created ${name}.png`);
    }

    // Generate progress bar elements (200x20 px)
    for (const [name, color] of Object.entries(progressColors)) {
        const image = sharp({
            create: {
                width: 200,
                height: 20,
                channels: 4,
                background: color
            }
        });

        await image.png().toFile(path.join(outputDir, `${name}.png`));
        console.log(`  ✅ Created ${name}.png`);
    }

    // Generate icon placeholders (64x64 px)
    for (const [name, color] of Object.entries(iconColors)) {
        const image = sharp({
            create: {
                width: 64,
                height: 64,
                channels: 4,
                background: color
            }
        });

        await image.png().toFile(path.join(outputDir, `${name}.png`));
        console.log(`  ✅ Created ${name}.png`);
    }

    console.log('🎉 UI sprites generated successfully!');
    console.log(`📁 Output directory: ${outputDir}`);
    console.log('💡 These are basic placeholder sprites - replace with proper UI assets later');
}

// Run the generator
generateUISprites().catch(console.error);
