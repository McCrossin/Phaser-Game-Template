#!/usr/bin/env node

/**
 * Enhanced Performance Check Script for Phaser Game Template
 * Validates game performance with environment-aware thresholds and robust error handling
 * Implements retry logic and comprehensive logging for CI/CD reliability
 */

import { readFileSync, existsSync, statSync, readdirSync, writeFileSync } from 'fs';
import { join } from 'path';

interface PerformanceConfig {
    environment: 'local' | 'ci';
    thresholds: {
        buildTime: number;
        bundleSize: number;
        fps: number;
        loadTime: number;
    };
    retry: {
        maxAttempts: number;
        backoffDelay: number;
    };
}

interface MonitoringResult {
    success: boolean;
    metrics: Record<string, number>;
    errors: string[];
    environment: string;
    timestamp: string;
}

interface PerformanceThresholds {
    readonly minFPS: number;
    readonly avgFPS: number;
    readonly degradationTolerance: number;
    readonly maxBundleSize: number;
    readonly maxLoadTime: number;
    readonly maxMemoryGrowth: number;
    readonly maxMicrofreezes: number;
}

interface FPSMetrics {
    readonly average: number;
    readonly minimum: number;
    readonly maximum: number;
    readonly baseline?: number;
    readonly samples: number;
}

interface MicrofreezeData {
    readonly count: number;
    readonly maxDuration?: number;
}

interface PerformanceResults {
    readonly fps?: FPSMetrics;
    readonly microfreezes?: MicrofreezeData;
    readonly loadTime?: number;
    readonly bundleSize?: number;
    readonly memoryGrowth?: number;
    readonly environment: string;
    readonly timestamp: number;
}

class PerformanceMonitor {
    private readonly config: PerformanceConfig;
    private readonly thresholds: PerformanceThresholds;
    private readonly isCI: boolean;
    private readonly startTime: number;
    private errors: string[] = [];
    private metrics: Record<string, number> = {};

    constructor() {
        this.startTime = Date.now();
        this.isCI = process.env.CI === 'true' || process.env.GITHUB_ACTIONS === 'true';
        
        // Load configuration
        this.config = this.loadConfiguration();
        this.thresholds = this.loadThresholds();
        
        this.logEnvironmentInfo();
    }

    private loadConfiguration(): PerformanceConfig {
        const configPath = 'config/ci-performance-thresholds.json';
        
        try {
            if (existsSync(configPath)) {
                const configData = JSON.parse(readFileSync(configPath, 'utf8'));
                const environment = this.isCI ? 'ci' : 'local';
                const envConfig = configData.environments[environment];
                
                return {
                    environment: environment as 'local' | 'ci',
                    thresholds: {
                        buildTime: envConfig.performance.buildTimeLimit,
                        bundleSize: envConfig.performance.bundleSizeLimit,
                        fps: envConfig.performance.avgFPS,
                        loadTime: envConfig.performance.maxLoadTime
                    },
                    retry: envConfig.retry
                };
            }
        } catch (error) {
            this.logError(`Failed to load configuration: ${(error as Error).message}`);
        }

        // Fallback to environment-aware defaults
        return {
            environment: this.isCI ? 'ci' : 'local',
            thresholds: {
                buildTime: this.isCI ? 600000 : 60000, // 10 min vs 1 min
                bundleSize: this.isCI ? 10485760 : 2097152, // 10MB vs 2MB  
                fps: this.isCI ? 10 : 55,
                loadTime: this.isCI ? 30000 : 3000
            },
            retry: {
                maxAttempts: this.isCI ? 3 : 2,
                backoffDelay: this.isCI ? 2000 : 1000
            }
        };
    }

    private loadThresholds(): PerformanceThresholds {
        return {
            minFPS: this.isCI ? 2 : 30,
            avgFPS: this.config.thresholds.fps,
            degradationTolerance: 0.1, // 10%
            maxBundleSize: this.config.thresholds.bundleSize,
            maxLoadTime: this.config.thresholds.loadTime,
            maxMemoryGrowth: this.isCI ? 150 : 50,
            maxMicrofreezes: this.isCI ? 5 : 2
        };
    }

    private logEnvironmentInfo(): void {
        console.log('🔍 Enhanced Performance Monitor Started');
        console.log(`Environment: ${this.config.environment.toUpperCase()}`);
        console.log(`CI Detection: ${this.isCI}`);
        console.log(`Node Version: ${process.version}`);
        console.log(`Platform: ${process.platform}`);
        
        if (this.isCI) {
            console.log(`GitHub Actions: ${process.env.GITHUB_ACTIONS === 'true'}`);
            console.log(`Runner OS: ${process.env.RUNNER_OS || 'unknown'}`);
        }
        
        console.log('Performance Thresholds:', this.thresholds);
        console.log('Retry Configuration:', this.config.retry);
        console.log('---');
    }

    private logError(message: string): void {
        this.errors.push(message);
        console.error(`❌ ${message}`);
    }

    private logWarning(message: string): void {
        console.warn(`⚠️  ${message}`);
    }

    private logSuccess(message: string): void {
        console.log(`✅ ${message}`);
    }

    private logInfo(message: string): void {
        console.log(`ℹ️  ${message}`);
    }

    private async sleep(ms: number): Promise<void> {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    private async withRetry<T>(
        operation: () => Promise<T> | T,
        operationName: string
    ): Promise<T | null> {
        let lastError: Error | null = null;
        
        for (let attempt = 1; attempt <= this.config.retry.maxAttempts; attempt++) {
            try {
                this.logInfo(`${operationName} - Attempt ${attempt}/${this.config.retry.maxAttempts}`);
                const result = await operation();
                if (attempt > 1) {
                    this.logSuccess(`${operationName} succeeded on attempt ${attempt}`);
                }
                return result;
            } catch (error) {
                lastError = error as Error;
                
                if (attempt < this.config.retry.maxAttempts) {
                    const delay = this.config.retry.backoffDelay * attempt;
                    this.logWarning(`${operationName} failed on attempt ${attempt}, retrying in ${delay}ms...`);
                    await this.sleep(delay);
                } else {
                    this.logError(`${operationName} failed after ${this.config.retry.maxAttempts} attempts: ${lastError.message}`);
                }
            }
        }
        
        return null;
    }

    private getDirectorySize(dirPath: string): number {
        if (!existsSync(dirPath)) {
            return 0;
        }

        let totalSize = 0;

        function calculateSize(currentPath: string): void {
            const stats = statSync(currentPath);

            if (stats.isFile()) {
                // Exclude source maps from bundle size calculation
                if (!currentPath.endsWith('.map')) {
                    totalSize += stats.size;
                }
            } else if (stats.isDirectory()) {
                const files = readdirSync(currentPath);
                files.forEach(file => {
                    calculateSize(join(currentPath, file));
                });
            }
        }

        calculateSize(dirPath);
        return totalSize;
    }

    async checkBundleSize(): Promise<boolean> {
        return await this.withRetry(async () => {
            console.log('📦 Checking bundle size...');

            if (!existsSync('dist')) {
                throw new Error('dist directory not found. Run build first.');
            }

            const bundleSize = this.getDirectorySize('dist');
            const bundleSizeMB = bundleSize / 1024 / 1024;
            const thresholdMB = this.thresholds.maxBundleSize / 1024 / 1024;

            this.metrics.bundleSize = bundleSize;
            this.metrics.bundleSizeMB = bundleSizeMB;

            console.log(`Bundle size: ${bundleSizeMB.toFixed(2)}MB (threshold: <${thresholdMB.toFixed(2)}MB)`);

            // Log size breakdown for debugging
            const mainFiles = ['index.html', 'main.js', 'main.css', 'assets'];
            mainFiles.forEach(file => {
                const filePath = join('dist', file);
                if (existsSync(filePath)) {
                    const size = this.getDirectorySize(filePath);
                    if (size > 0) {
                        console.log(`  ${file}: ${(size / 1024 / 1024).toFixed(2)}MB`);
                    }
                }
            });

            if (bundleSize > this.thresholds.maxBundleSize) {
                throw new Error(`Bundle size exceeds limit: ${bundleSizeMB.toFixed(2)}MB > ${thresholdMB.toFixed(2)}MB`);
            }

            if (bundleSize > this.thresholds.maxBundleSize * 0.8) {
                this.logWarning(`Bundle size approaching limit: ${bundleSizeMB.toFixed(2)}MB (${(bundleSize / this.thresholds.maxBundleSize * 100).toFixed(1)}% of limit)`);
            }

            this.logSuccess('Bundle size check passed');
            return true;
        }, 'Bundle Size Check') !== null;
    }

    async checkPerformanceResults(): Promise<boolean> {
        return await this.withRetry(async () => {
            console.log('🎮 Checking performance test results...');

            if (!existsSync('performance-results.json')) {
                this.logWarning('Performance results not found, skipping FPS check');
                return true;
            }

            const results: PerformanceResults = JSON.parse(
                readFileSync('performance-results.json', 'utf8')
            );

            // Validate results structure
            if (!results.environment || !results.timestamp) {
                throw new Error('Invalid performance results structure');
            }

            console.log(`Performance results from: ${results.environment} environment`);
            console.log(`Results timestamp: ${new Date(results.timestamp).toISOString()}`);

            // Check result freshness (within last 24 hours)
            const resultAge = Date.now() - results.timestamp;
            if (resultAge > 24 * 60 * 60 * 1000) {
                this.logWarning(`Performance results are ${Math.floor(resultAge / (60 * 60 * 1000))} hours old`);
            }

            // Check FPS metrics
            if (results.fps && typeof results.fps.average === 'number') {
                const avgFPS = results.fps.average;
                const minFPS = results.fps.minimum;
                
                this.metrics.avgFPS = avgFPS;
                this.metrics.minFPS = minFPS;
                this.metrics.fpssamples = results.fps.samples;

                console.log(`Average FPS: ${avgFPS.toFixed(2)} (threshold: >${this.thresholds.avgFPS})`);
                console.log(`Minimum FPS: ${minFPS.toFixed(2)} (threshold: >${this.thresholds.minFPS})`);

                if (avgFPS < this.thresholds.avgFPS) {
                    throw new Error(`Average FPS below threshold: ${avgFPS.toFixed(2)} < ${this.thresholds.avgFPS}`);
                }

                if (minFPS < this.thresholds.minFPS) {
                    throw new Error(`Minimum FPS below threshold: ${minFPS.toFixed(2)} < ${this.thresholds.minFPS}`);
                }

                // Check for FPS degradation if baseline exists
                if (results.fps.baseline && typeof results.fps.baseline === 'number') {
                    const degradation = (results.fps.baseline - avgFPS) / results.fps.baseline;
                    this.metrics.fpsDegradation = degradation;
                    
                    console.log(`FPS degradation: ${(degradation * 100).toFixed(2)}% (threshold: <${(this.thresholds.degradationTolerance * 100).toFixed(1)}%)`);

                    if (degradation > this.thresholds.degradationTolerance) {
                        throw new Error(`FPS degradation exceeds tolerance: ${(degradation * 100).toFixed(2)}% > ${(this.thresholds.degradationTolerance * 100).toFixed(1)}%`);
                    }
                }
            }

            // Check for microfreezes
            if (results.microfreezes && typeof results.microfreezes.count === 'number') {
                const freezeCount = results.microfreezes.count;
                this.metrics.microfreezes = freezeCount;
                
                console.log(`Microfreezes detected: ${freezeCount} (threshold: <${this.thresholds.maxMicrofreezes})`);

                if (freezeCount > this.thresholds.maxMicrofreezes) {
                    throw new Error(`Too many microfreezes detected: ${freezeCount} > ${this.thresholds.maxMicrofreezes}`);
                }

                if (freezeCount > 0 && freezeCount <= this.thresholds.maxMicrofreezes) {
                    this.logWarning(`${freezeCount} microfreezes detected (within acceptable range)`);
                }
            }

            this.logSuccess('Performance results check passed');
            return true;
        }, 'Performance Results Check') !== null;
    }

    async generateMonitoringReport(): Promise<void> {
        const executionTime = Date.now() - this.startTime;
        
        const report: MonitoringResult = {
            success: this.errors.length === 0,
            metrics: {
                ...this.metrics,
                executionTimeMs: executionTime
            },
            errors: this.errors,
            environment: this.config.environment,
            timestamp: new Date().toISOString()
        };

        // Write detailed report
        try {
            writeFileSync('performance-monitoring-report.json', JSON.stringify(report, null, 2));
            this.logSuccess('Performance monitoring report generated');
        } catch (error) {
            this.logError(`Failed to write monitoring report: ${(error as Error).message}`);
        }

        // Log summary
        console.log('\n📊 Performance Monitoring Summary:');
        console.log(`Environment: ${report.environment.toUpperCase()}`);
        console.log(`Duration: ${(executionTime / 1000).toFixed(2)}s`);
        console.log(`Success: ${report.success ? '✅' : '❌'}`);
        console.log(`Errors: ${report.errors.length}`);
        
        if (Object.keys(this.metrics).length > 0) {
            console.log('Metrics collected:');
            Object.entries(this.metrics).forEach(([key, value]) => {
                console.log(`  ${key}: ${typeof value === 'number' ? value.toFixed(2) : value}`);
            });
        }
        
        if (this.errors.length > 0) {
            console.log('Errors encountered:');
            this.errors.forEach((error, index) => {
                console.log(`  ${index + 1}. ${error}`);
            });
        }
    }

    async runAllChecks(): Promise<boolean> {
        console.log('🚀 Starting comprehensive performance monitoring...\n');

        const checks = [
            { name: 'Bundle Size', fn: () => this.checkBundleSize() },
            { name: 'Performance Results', fn: () => this.checkPerformanceResults() }
        ];

        let allPassed = true;

        for (const check of checks) {
            try {
                console.log(`--- ${check.name} Check ---`);
                const result = await check.fn();
                if (!result) {
                    allPassed = false;
                }
                console.log('');
            } catch (error) {
                this.logError(`${check.name} check failed: ${(error as Error).message}`);
                allPassed = false;
                console.log('');
            }
        }

        await this.generateMonitoringReport();

        return allPassed;
    }
}

async function main(): Promise<void> {
    const monitor = new PerformanceMonitor();
    
    try {
        const success = await monitor.runAllChecks();
        
        if (success) {
            console.log('🎉 All performance checks passed!');
            process.exit(0);
        } else {
            console.error('💥 Performance checks failed!');
            process.exit(1);
        }
    } catch (error) {
        console.error('🚨 Performance monitoring crashed:', (error as Error).message);
        process.exit(1);
    }
}

if (require.main === module) {
    main();
}

export { PerformanceMonitor, PerformanceConfig, MonitoringResult };
