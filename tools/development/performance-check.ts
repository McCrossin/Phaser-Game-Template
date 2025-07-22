#!/usr/bin/env node

/**
 * Performance Check Script for Phaser Game Template
 * Validates game performance and provides optimization recommendations
 */

import { readFileSync, existsSync, statSync, readdirSync } from 'fs';
import { join } from 'path';

interface PerformanceThresholds {
    readonly minFPS: number;
    readonly degradationTolerance: number;
    readonly maxBundleSize: number;
    readonly maxLoadTime: number;
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
}

const PERFORMANCE_THRESHOLDS: PerformanceThresholds = {
    minFPS: 55,
    degradationTolerance: 0.03, // 3%
    maxBundleSize: 2 * 1024 * 1024, // 2MB (excluding source maps)
    maxLoadTime: 3000 // 3 seconds
};

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

        if (bundleSize > PERFORMANCE_THRESHOLDS.maxBundleSize) {
            console.error(
                `❌ Bundle size exceeds limit: ${(bundleSize / 1024 / 1024).toFixed(2)}MB > ${PERFORMANCE_THRESHOLDS.maxBundleSize / 1024 / 1024}MB`
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

            if (avgFPS < PERFORMANCE_THRESHOLDS.minFPS) {
                console.error(
                    `❌ FPS below threshold: ${avgFPS} < ${PERFORMANCE_THRESHOLDS.minFPS}`
                );
                return false;
            }

            // Check for FPS degradation if baseline exists
            if (results.fps.baseline) {
                const degradation = (results.fps.baseline - avgFPS) / results.fps.baseline;
                console.log(`FPS degradation: ${(degradation * 100).toFixed(2)}%`);

                if (degradation > PERFORMANCE_THRESHOLDS.degradationTolerance) {
                    console.error(
                        `❌ FPS degradation exceeds tolerance: ${(degradation * 100).toFixed(2)}% > ${PERFORMANCE_THRESHOLDS.degradationTolerance * 100}%`
                    );
                    return false;
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
