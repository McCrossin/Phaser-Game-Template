/**
 * Simple Game Performance Monitor
 * Focused on essential game metrics: FPS and load times
 */

export interface GamePerformanceConfig {
    targetFPS: number;
    maxLoadTimeMs: number;
    maxBundleSizeMB: number;
}

export interface PerformanceMetrics {
    fps: number;
    loadTime: number;
    bundleSize: number;
    timestamp: number;
}

export class SimpleGameMonitor {
    private config: GamePerformanceConfig;

    constructor(
        config: GamePerformanceConfig = {
            targetFPS: 60,
            maxLoadTimeMs: 3000,
            maxBundleSizeMB: 50
        }
    ) {
        this.config = config;
    }

    /**
     * Check if current performance meets game requirements
     */
    checkPerformance(metrics: PerformanceMetrics): boolean {
        const fpsOk = metrics.fps >= this.config.targetFPS * 0.9; // 10% tolerance
        const loadTimeOk = metrics.loadTime <= this.config.maxLoadTimeMs;
        const bundleSizeOk = metrics.bundleSize <= this.config.maxBundleSizeMB;

        return fpsOk && loadTimeOk && bundleSizeOk;
    }

    /**
     * Get performance status summary
     */
    getStatus(metrics: PerformanceMetrics): string {
        if (this.checkPerformance(metrics)) {
            return '✅ Game performance is good';
        }

        const issues: string[] = [];
        if (metrics.fps < this.config.targetFPS * 0.9) {
            issues.push(`Low FPS: ${metrics.fps} (target: ${this.config.targetFPS})`);
        }
        if (metrics.loadTime > this.config.maxLoadTimeMs) {
            issues.push(`Slow load: ${metrics.loadTime}ms (max: ${this.config.maxLoadTimeMs}ms)`);
        }
        if (metrics.bundleSize > this.config.maxBundleSizeMB) {
            issues.push(
                `Large bundle: ${metrics.bundleSize}MB (max: ${this.config.maxBundleSizeMB}MB)`
            );
        }

        return `⚠️ Performance issues: ${issues.join(', ')}`;
    }
}
