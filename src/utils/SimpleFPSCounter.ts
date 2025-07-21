/**
 * Simple FPS Counter for Development Builds
 * Provides real-time performance monitoring with toggle capability
 */

export class SimpleFPSCounter {
    private fpsText?: Phaser.GameObjects.Text;
    private isVisible: boolean = false;
    private isDevelopment: boolean;

    constructor(private scene: Phaser.Scene) {
        // Check environment at runtime to make testing easier
        this.isDevelopment = process.env['NODE_ENV'] !== 'production';

        // Only create in development
        if (this.isDevelopment) {
            this.createFPSDisplay();
            this.setupToggleKey();
        }
    }

    private createFPSDisplay(): void {
        this.fpsText = this.scene.add.text(10, 10, 'FPS: 0', {
            font: '16px monospace',
            color: '#00ff00',
            backgroundColor: '#000000',
            padding: { x: 5, y: 5 }
        });

        this.fpsText.setScrollFactor(0);
        this.fpsText.setDepth(999999);
        this.fpsText.setVisible(false);
    }

    private setupToggleKey(): void {
        // Press F3 to toggle FPS display
        this.scene.input.keyboard?.on('keydown-F3', () => {
            this.isVisible = !this.isVisible;
            this.fpsText?.setVisible(this.isVisible);

            if (this.isVisible) {
                console.log('Performance Monitoring Enabled');
                console.log('Target FPS: 60');
                console.log('Press F3 to hide');
            }
        });
    }

    update(): void {
        if (this.isVisible && this.fpsText && this.isDevelopment) {
            const fps = Math.round(this.scene.game.loop.actualFps);

            // Update text
            this.fpsText.setText(`FPS: ${fps}`);

            // Color code based on performance
            if (fps >= 55) {
                this.fpsText.setColor('#00ff00'); // Green
            } else if (fps >= 30) {
                this.fpsText.setColor('#ffff00'); // Yellow
            } else {
                this.fpsText.setColor('#ff0000'); // Red
            }

            // Log warnings for consistently bad performance
            if (fps < 30) {
                console.warn(`Low FPS detected: ${fps}`);
            }
        }
    }

    /**
     * Get current FPS for external monitoring
     */
    getCurrentFPS(): number {
        return Math.round(this.scene.game.loop.actualFps);
    }

    /**
     * Enable/disable FPS display programmatically
     */
    setVisible(visible: boolean): void {
        if (this.isDevelopment) {
            this.isVisible = visible;
            this.fpsText?.setVisible(visible);
        }
    }

    /**
     * Clean up resources
     */
    destroy(): void {
        if (this.fpsText) {
            this.fpsText.destroy();
        }
    }
}
