/**
 * Async Game Loader
 *
 * This module provides dynamic imports and code splitting for the game,
 * allowing the main Phaser library to be loaded separately from application code.
 */

import type { GameConfig } from '../types/GameTypes';

// Loading states
export enum LoadingState {
    INITIALIZING = 'initializing',
    LOADING_PHASER = 'loading_phaser',
    LOADING_SCENES = 'loading_scenes',
    LOADING_ASSETS = 'loading_assets',
    READY = 'ready',
    ERROR = 'error'
}

export interface GameLoadProgress {
    state: LoadingState;
    progress: number;
    message: string;
}

export class AsyncGameLoader {
    private onProgress?: (progress: GameLoadProgress) => void;

    constructor(onProgress?: (progress: GameLoadProgress) => void) {
        if (onProgress) {
            this.onProgress = onProgress;
        }
    }

    async loadGame(): Promise<void> {
        try {
            this.updateProgress(LoadingState.INITIALIZING, 0, 'Initializing game...');

            // Load Phaser dynamically
            this.updateProgress(LoadingState.LOADING_PHASER, 25, 'Loading Phaser engine...');
            const Phaser = await this.loadPhaser();

            // Load scenes dynamically
            this.updateProgress(LoadingState.LOADING_SCENES, 50, 'Loading game scenes...');
            const { StartScene, GameScene } = await this.loadScenes();

            // Load game configuration
            this.updateProgress(LoadingState.LOADING_ASSETS, 75, 'Loading game configuration...');
            const gameConfig = await this.loadGameConfig();

            // Initialize Phaser game
            this.updateProgress(LoadingState.READY, 100, 'Starting game...');
            this.initializeGame(Phaser, { StartScene, GameScene }, gameConfig);
        } catch (error) {
            this.updateProgress(LoadingState.ERROR, 0, `Failed to load game: ${error}`);
            throw error;
        }
    }

    private async loadPhaser() {
        const { default: Phaser } = await import('phaser');
        return Phaser;
    }

    private async loadScenes() {
        const [{ StartScene }, { GameScene }] = await Promise.all([
            import('../scenes/StartScene'),
            import('../scenes/GameScene')
        ]);

        return { StartScene, GameScene };
    }

    private async loadGameConfig(): Promise<GameConfig> {
        const { GAME_CONFIG } = await import('../config/GameConfig');
        return GAME_CONFIG;
    }

    private initializeGame(
        Phaser: typeof import('phaser'),
        scenes: {
            StartScene: typeof import('../scenes/StartScene').StartScene;
            GameScene: typeof import('../scenes/GameScene').GameScene;
        },
        _gameConfig: GameConfig
    ): void {
        const phaserConfig: Phaser.Types.Core.GameConfig = {
            type: Phaser.AUTO,
            title: 'Phaser Game Template',
            version: '1.0.0',
            parent: 'game-container',
            backgroundColor: '#2c3e50',
            scale: {
                mode: Phaser.Scale.FIT,
                autoCenter: Phaser.Scale.CENTER_BOTH,
                width: 800,
                height: 600
            },
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: { x: 0, y: 0 },
                    debug: false
                }
            },
            render: {
                antialias: true,
                pixelArt: false,
                roundPixels: false
            },
            scene: [scenes.StartScene, scenes.GameScene]
        };

        new Phaser.Game(phaserConfig);
    }

    private updateProgress(state: LoadingState, progress: number, message: string): void {
        if (this.onProgress) {
            this.onProgress({ state, progress, message });
        }
    }
}

// Default export for easy usage
export default AsyncGameLoader;
