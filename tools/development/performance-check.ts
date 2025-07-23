#!/usr/bin/env node

/**
 * Performance Check Script for Phaser Game Template
 * Validates game performance and provides optimization recommendations
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

// Import environment detection for consistency
class EnvironmentDetector {
    static detect(): 'local' | 'ci' {
        return process.env['CI'] === 'true' ||
            process.env['GITHUB_ACTIONS'] === 'true' ||
            process.env['GITLAB_CI'] === 'true' ||
            process.env['TRAVIS'] === 'true' ||
            process.env['CIRCLECI'] === 'true' ||
            process.env['JENKINS_URL'] !== undefined ||
            process.env['BUILDKITE'] === 'true'
            ? 'ci'
            : 'local';
    }

    static getThresholds() {
        const environment = this.detect();
        const configPath = join(process.cwd(), 'config', 'ci-performance-thresholds.json');

        try {
            if (existsSync(configPath)) {
                const config = JSON.parse(readFileSync(configPath, 'utf8'));
                const envConfig = config.environments[environment];

                if (envConfig) {
                    return {
                        environment,
                        ...envConfig
                    };
                }
            }
        } catch (error) {
            console.warn('Failed to load performance thresholds config, using defaults:', error);
        }

        // Fallback defaults
        return environment === 'ci'
            ? {
                  environment: 'ci',
                  performance: {
                      minFPS: 2,
                      avgFPS: 10,
                      maxFPSVariation: 4.0,
                      maxLoadTime: 30000,
                      maxMemoryGrowth: 150,
                      maxMicrofreezes: 5,
                      buildTimeLimit: 600000,
                      bundleSizeLimit: 10485760
                  }
              }
            : {
                  environment: 'local',
                  performance: {
                      minFPS: 30,
                      avgFPS: 55,
                      maxFPSVariation: 1.5,
                      maxLoadTime: 3000,
                      maxMemoryGrowth: 50,
                      maxMicrofreezes: 2,
                      buildTimeLimit: 60000,
                      bundleSizeLimit: 2097152
                  }
              };
    }
}

interface FPSMetrics {
    readonly average: number;
    readonly baseline?: number;
}

interface MicrofreezeData {
    readonly count: number;
    readonly maxDuration?: number;
}

interface PerformanceResults {
    readonly fps?: FPSMetrics;
    readonly microfreezes?: MicrofreezeData;
    readonly loadTime?: number;
    readonly environment?: string;
}

// Get environment-aware thresholds
const thresholds = EnvironmentDetector.getThresholds();
const isCI = thresholds.environment === 'ci';

console.log(`Performance check running in ${thresholds.environment} environment`);

function getDirectorySize(dirPath: string): number {
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

function checkBundleSize(): boolean {
    console.log('📦 Checking bundle size...');

    if (!existsSync('dist')) {
        console.error('❌ dist directory not found. Run build first.');
        return false;
    }

    try {
        const bundleSize = getDirectorySize('dist');

        console.log(`Bundle size: ${(bundleSize / 1024 / 1024).toFixed(2)}MB`);

        if (bundleSize > thresholds.performance.bundleSizeLimit) {
            console.error(
                `❌ Bundle size exceeds limit: ${(bundleSize / 1024 / 1024).toFixed(2)}MB > ${thresholds.performance.bundleSizeLimit / 1024 / 1024}MB`
            );
            return false;
        }

        console.log('✅ Bundle size check passed');
        return true;
    } catch (error) {
        console.error('❌ Bundle size check failed:', (error as Error).message);
        return false;
    }
}

function checkPerformanceResults(): boolean {
    console.log('🎮 Checking performance test results...');

    if (!existsSync('performance-results.json')) {
        console.warn('⚠️  Performance results not found, skipping FPS check');
        return true;
    }

    try {
        const results: PerformanceResults = JSON.parse(
            readFileSync('performance-results.json', 'utf8')
        );

        // Check FPS metrics
        if (results.fps && results.fps.average) {
            const avgFPS = results.fps.average;
            console.log(`Average FPS: ${avgFPS}`);

            if (avgFPS < thresholds.performance.avgFPS) {
                const severity = isCI ? 'Warning' : 'Error';
                console.log(
                    `${isCI ? '⚠️' : '❌'} ${severity}: FPS below threshold: ${avgFPS} < ${thresholds.performance.avgFPS}`
                );
                if (!isCI) return false; // Only fail in local environment
            }

            // Check for FPS degradation if baseline exists
            if (results.fps.baseline) {
                const degradation = (results.fps.baseline - avgFPS) / results.fps.baseline;
                const degradationTolerance = isCI ? 0.5 : 0.03; // 50% for CI, 3% for local
                console.log(`FPS degradation: ${(degradation * 100).toFixed(2)}%`);

                if (degradation > degradationTolerance) {
                    const severity = isCI && degradation < 0.7 ? 'Warning' : 'Error';
                    console.log(
                        `${isCI && degradation < 0.7 ? '⚠️' : '❌'} ${severity}: FPS degradation ${isCI && degradation < 0.7 ? 'notable' : 'exceeds tolerance'}: ${(degradation * 100).toFixed(2)}% > ${degradationTolerance * 100}%`
                    );
                    if (!isCI || degradation >= 0.7) return false; // Fail only for severe degradation in CI
                }
            }
        }

        // Check for microfreezes
        if (results.microfreezes && results.microfreezes.count > 0) {
            console.warn(`⚠️  Detected ${results.microfreezes.count} microfreezes`);
            if (results.microfreezes.count > 5) {
                console.error('❌ Too many microfreezes detected');
                return false;
            }
        }

        console.log('✅ Performance check passed');
        return true;
    } catch (error) {
        console.error('❌ Performance check failed:', (error as Error).message);
        return false;
    }
}

function main(): void {
    console.log('🔍 Running performance checks...');

    const bundleCheck = checkBundleSize();
    const performanceCheck = checkPerformanceResults();

    const allPassed = bundleCheck && performanceCheck;

    if (allPassed) {
        console.log('🎉 All performance checks passed!');
        process.exit(0);
    } else {
        console.error('💥 Performance checks failed!');
        process.exit(1);
    }
}

main();
