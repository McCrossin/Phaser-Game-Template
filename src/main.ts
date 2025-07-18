import Phaser from 'phaser';
import { StartScene } from '@/scenes/StartScene';
import { GameScene } from '@/scenes/GameScene';
import { GameConfig } from '@/types/GameTypes';

// Test ECS on startup
import '@/test/ECSTest';

// Game Configuration Constants
export const GAME_CONFIG: GameConfig = {
    WORLD_WIDTH: 2048,
    WORLD_HEIGHT: 2048,
    TILE_SIZE: 32,
    TARGET_FPS: 60,
    MAX_PROBES: 10,
    UPDATE_INTERVAL: 100 // 100ms = 10 updates per second for game logic
} as const;

const phaserConfig: Phaser.Types.Core.GameConfig = {
    type: Phaser.AUTO,
    title: 'New Eden Project',
    version: '0.1.0',
    parent: 'game-container',
    width: 1280,
    height: 720,
    backgroundColor: '#000000',
    pixelArt: false,
    antialias: true,
    scene: [StartScene, GameScene],
    scale: {
        mode: Phaser.Scale.FIT,
        autoCenter: Phaser.Scale.CENTER_BOTH,
        min: {
            width: 800,
            height: 600
        },
        max: {
            width: 1920,
            height: 1080
        }
    },
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { x: 0, y: 0 }, // No gravity in space
            debug: false
        }
    },
    fps: {
        target: GAME_CONFIG.TARGET_FPS,
        forceSetTimeOut: true
    },
    render: {
        antialias: true,
        pixelArt: false,
        roundPixels: false
    }
};

// Initialize the game
const game = new Phaser.Game(phaserConfig);

// Global error handling
window.addEventListener('error', event => {
    console.error('Game Error:', event.error);
});

window.addEventListener('unhandledrejection', event => {
    console.error('Unhandled Promise Rejection:', event.reason);
});

export default game;
