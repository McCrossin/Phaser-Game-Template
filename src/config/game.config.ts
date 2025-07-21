/**
 * Game Configuration
 * Central configuration for Phaser game settings
 */

export const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Phaser Game Template',
    type: Phaser.AUTO,
    width: 1024,
    height: 768,
    parent: 'game-container',
    backgroundColor: '#1a1a2e',

    // Physics configuration
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 300 },
            debug: false
        }
    },

    // Performance and rendering settings
    render: {
        pixelArt: false,
        antialias: true,
        roundPixels: false
    },

    // Scale configuration for responsive design
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 320,
            height: 240
        },
        max: {
            width: 1920,
            height: 1080
        }
    },

    // Input configuration
    input: {
        keyboard: true,
        mouse: true,
        touch: true,
        gamepad: false
    },

    // Audio configuration
    audio: {
        disableWebAudio: false
    },

    // Development settings
    disableContextMenu: true,
    banner: {
        hidePhaser: false,
        text: '#16537e',
        background: ['#ffffff', '#71c5cf', '#ffffff']
    }
};

// Export additional game constants
export const GAME_CONSTANTS = {
    TITLE: 'Phaser Game Template',
    VERSION: '1.0.0',
    TARGET_FPS: 60,
    WORLD_WIDTH: 1024,
    WORLD_HEIGHT: 768
} as const;
