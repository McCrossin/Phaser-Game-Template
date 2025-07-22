/**
 * Global type declarations for the Phaser 3 game template
 * Extends the Window interface to include game instance for testing and debugging
 */

declare global {
    interface Window {
        game?: Phaser.Game;
    }
}

// Export empty object to make this a module
export {};
