#!/usr/bin/env node

/**
 * Performance Check Script for New Eden Project
 * Detects FPS degradation and monitors game performance
 */

import { execSync } from 'child_process';
import { readFileSync, existsSync } from 'fs';

const PERFORMANCE_THRESHOLDS = {
    minFPS: 55,
    degradationTolerance: 0.03, // 3%
    maxBundleSize: 2 * 1024 * 1024, // 2MB
    maxLoadTime: 3000 // 3 seconds
};

function checkBundleSize() {
    console.log('📦 Checking bundle size...');

    if (!existsSync('dist')) {
        console.error('❌ dist directory not found. Run build first.');
        return false;
    }

    try {
        const sizeOutput = execSync('du -sb dist/', { encoding: 'utf8' });
        const bundleSize = parseInt(sizeOutput.split('\t')[0]);

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
        console.error('❌ Bundle size check failed:', error.message);
        return false;
    }
}

function checkPerformanceResults() {
    console.log('🎮 Checking performance test results...');

    if (!existsSync('performance-results.json')) {
        console.warn('⚠️  Performance results not found, skipping FPS check');
        return true;
    }

    try {
        const results = JSON.parse(readFileSync('performance-results.json', 'utf8'));

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
        console.error('❌ Performance check failed:', error.message);
        return false;
    }
}

function main() {
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
