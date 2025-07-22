import { GameConfig } from '../types/GameTypes';

// Game Configuration Constants
export const GAME_CONFIG: GameConfig = {
    WORLD_WIDTH: 2048,
    WORLD_HEIGHT: 2048,
    TILE_SIZE: 32,
    TARGET_FPS: 60,
    MAX_ENTITIES: 100,
    UPDATE_INTERVAL: 100 // 100ms = 10 updates per second for game logic
} as const;
