/**
 * Debug Configuration for Development Builds
 * Controls debug features and performance monitoring
 */

// Environment detection utility
const isDevelopment = process.env['NODE_ENV'] !== 'production';

export interface DebugConfig {
    showFPS: boolean;
    performanceWarnings: boolean;
    enablePerformanceLogging: boolean;
    logSceneTransitions: boolean;
}

export const DEBUG_CONFIG: DebugConfig = {
    showFPS: false, // Toggle with F3 key
    performanceWarnings: true,
    enablePerformanceLogging: true,
    logSceneTransitions: true
};

/**
 * Performance logging utilities
 */
export class PerformanceLogger {
    private static sceneStartTimes = new Map<string, number>();

    /**
     * Log scene load start time
     */
    static logSceneStart(sceneName: string): void {
        if (DEBUG_CONFIG.logSceneTransitions && isDevelopment) {
            this.sceneStartTimes.set(sceneName, performance.now());
            console.log(`[Performance] Scene "${sceneName}" loading started`);
        }
    }

    /**
     * Log scene load completion time
     */
    static logSceneComplete(sceneName: string): void {
        if (DEBUG_CONFIG.logSceneTransitions && isDevelopment) {
            const startTime = this.sceneStartTimes.get(sceneName);
            if (startTime) {
                const loadTime = performance.now() - startTime;
                console.log(
                    `[Performance] Scene "${sceneName}" loaded in ${loadTime.toFixed(2)}ms`
                );
                this.sceneStartTimes.delete(sceneName);

                // Warn if scene takes too long to load
                if (loadTime > 1000) {
                    console.warn(
                        `[Performance] Scene "${sceneName}" took ${loadTime.toFixed(2)}ms to load (>1s)`
                    );
                }
            }
        }
    }

    /**
     * Log performance events
     */
    static logEvent(event: string, duration?: number): void {
        if (DEBUG_CONFIG.enablePerformanceLogging && isDevelopment) {
            if (duration !== undefined) {
                console.log(`[Performance] ${event}: ${duration.toFixed(2)}ms`);
            } else {
                console.log(`[Performance] ${event}`);
            }
        }
    }

    /**
     * Warning for performance issues
     */
    static warn(message: string): void {
        if (DEBUG_CONFIG.performanceWarnings && isDevelopment) {
            console.warn(`[Performance Warning] ${message}`);
        }
    }
}
