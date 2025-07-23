/**
 * Unit tests for EnvironmentDetector
 * Tests environment detection logic and threshold loading
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import { EnvironmentDetector } from '../../helpers/performance-helpers.js';

describe('EnvironmentDetector', () => {
    // Store original CI-related environment variables
    const ciVariables = [
        'CI',
        'GITHUB_ACTIONS',
        'GITLAB_CI',
        'TRAVIS',
        'CIRCLECI',
        'JENKINS_URL',
        'BUILDKITE'
    ];
    let originalCiEnv: Record<string, string | undefined> = {};

    beforeEach(() => {
        // Store original values of CI variables before clearing them
        originalCiEnv = {};
        ciVariables.forEach(key => {
            originalCiEnv[key] = process.env[key];
        });

        // Clear all CI-related environment variables
        ciVariables.forEach(key => {
            delete process.env[key];
        });
    });

    afterEach(() => {
        // Restore original CI environment variables only
        ciVariables.forEach(key => {
            if (originalCiEnv[key] !== undefined) {
                process.env[key] = originalCiEnv[key];
            } else {
                delete process.env[key];
            }
        });
    });

    describe('detect()', () => {
        it('should detect local environment by default', () => {
            expect(EnvironmentDetector.detect()).toBe('local');
        });

        it('should detect CI environment with CI=true', () => {
            process.env['CI'] = 'true';
            expect(EnvironmentDetector.detect()).toBe('ci');
        });

        it('should detect CI environment with GITHUB_ACTIONS=true', () => {
            process.env['GITHUB_ACTIONS'] = 'true';
            expect(EnvironmentDetector.detect()).toBe('ci');
        });

        it('should detect CI environment with GITLAB_CI=true', () => {
            process.env['GITLAB_CI'] = 'true';
            expect(EnvironmentDetector.detect()).toBe('ci');
        });

        it('should detect CI environment with TRAVIS=true', () => {
            process.env['TRAVIS'] = 'true';
            expect(EnvironmentDetector.detect()).toBe('ci');
        });

        it('should detect CI environment with CIRCLECI=true', () => {
            process.env['CIRCLECI'] = 'true';
            expect(EnvironmentDetector.detect()).toBe('ci');
        });

        it('should detect CI environment with JENKINS_URL set', () => {
            process.env['JENKINS_URL'] = 'https://jenkins.example.com';
            expect(EnvironmentDetector.detect()).toBe('ci');
        });

        it('should detect CI environment with BUILDKITE=true', () => {
            process.env['BUILDKITE'] = 'true';
            expect(EnvironmentDetector.detect()).toBe('ci');
        });

        it('should detect local environment with CI=false', () => {
            process.env['CI'] = 'false';
            expect(EnvironmentDetector.detect()).toBe('local');
        });

        it('should detect local environment with empty CI variable', () => {
            process.env['CI'] = '';
            expect(EnvironmentDetector.detect()).toBe('local');
        });
    });

    describe('isGitHubActions()', () => {
        it('should return false by default', () => {
            expect(EnvironmentDetector.isGitHubActions()).toBe(false);
        });

        it('should return true when GITHUB_ACTIONS=true', () => {
            process.env['GITHUB_ACTIONS'] = 'true';
            expect(EnvironmentDetector.isGitHubActions()).toBe(true);
        });

        it('should return false when GITHUB_ACTIONS=false', () => {
            process.env['GITHUB_ACTIONS'] = 'false';
            expect(EnvironmentDetector.isGitHubActions()).toBe(false);
        });
    });

    describe('getThresholds()', () => {
        it('should return local thresholds by default', () => {
            const thresholds = EnvironmentDetector.getThresholds();

            expect(thresholds.environment).toBe('local');
            expect(thresholds.performance.avgFPS).toBe(55);
            expect(thresholds.performance.minFPS).toBe(30);
            expect(thresholds.performance.maxLoadTime).toBe(3000);
            expect(thresholds.timeouts.browserLaunch).toBe(10000);
        });

        it('should return CI thresholds in CI environment', () => {
            process.env['CI'] = 'true';
            const thresholds = EnvironmentDetector.getThresholds();

            expect(thresholds.environment).toBe('ci');
            expect(thresholds.performance.avgFPS).toBe(10);
            expect(thresholds.performance.minFPS).toBe(2);
            expect(thresholds.performance.maxLoadTime).toBe(30000);
            expect(thresholds.timeouts.browserLaunch).toBe(30000);
        });

        it('should have appropriate retry settings for each environment', () => {
            // Local environment
            const localThresholds = EnvironmentDetector.getThresholds();
            expect(localThresholds.retry.maxAttempts).toBe(2);
            expect(localThresholds.retry.backoffDelay).toBe(1000);

            // CI environment
            process.env['CI'] = 'true';
            const ciThresholds = EnvironmentDetector.getThresholds();
            expect(ciThresholds.retry.maxAttempts).toBe(3);
            expect(ciThresholds.retry.backoffDelay).toBe(2000);
        });

        it('should have CI thresholds more lenient than local', () => {
            // Ensure clean local environment first
            delete process.env['CI'];
            delete process.env['GITHUB_ACTIONS'];
            delete process.env['GITLAB_CI'];
            delete process.env['TRAVIS'];
            delete process.env['CIRCLECI'];
            delete process.env['JENKINS_URL'];
            delete process.env['BUILDKITE'];

            const localThresholds = EnvironmentDetector.getThresholds();

            process.env['CI'] = 'true';
            const ciThresholds = EnvironmentDetector.getThresholds();

            // CI should have lower FPS requirements
            expect(ciThresholds.performance.avgFPS).toBeLessThan(
                localThresholds.performance.avgFPS
            );
            expect(ciThresholds.performance.minFPS).toBeLessThan(
                localThresholds.performance.minFPS
            );

            // CI should have longer timeouts
            expect(ciThresholds.performance.maxLoadTime).toBeGreaterThan(
                localThresholds.performance.maxLoadTime
            );
            expect(ciThresholds.timeouts.browserLaunch).toBeGreaterThan(
                localThresholds.timeouts.browserLaunch
            );

            // CI should allow more variation and memory growth
            expect(ciThresholds.performance.maxFPSVariation).toBeGreaterThan(
                localThresholds.performance.maxFPSVariation
            );
            expect(ciThresholds.performance.maxMemoryGrowth).toBeGreaterThan(
                localThresholds.performance.maxMemoryGrowth
            );
        });

        it('should handle missing config gracefully', () => {
            // Clear all CI environment variables to ensure local detection
            delete process.env['CI'];
            delete process.env['GITHUB_ACTIONS'];
            delete process.env['GITLAB_CI'];
            delete process.env['TRAVIS'];
            delete process.env['CIRCLECI'];
            delete process.env['JENKINS_URL'];
            delete process.env['BUILDKITE'];

            // This test assumes the config file exists, but if it doesn't,
            // the function should fall back to defaults without throwing
            expect(() => {
                const thresholds = EnvironmentDetector.getThresholds();
                expect(thresholds).toBeDefined();
                expect(thresholds.environment).toBe('local');
            }).not.toThrow();
        });
    });

    describe('threshold validation', () => {
        it('should have reasonable threshold values', () => {
            // Clear all CI environment variables to ensure local detection
            delete process.env['CI'];
            delete process.env['GITHUB_ACTIONS'];
            delete process.env['GITLAB_CI'];
            delete process.env['TRAVIS'];
            delete process.env['CIRCLECI'];
            delete process.env['JENKINS_URL'];
            delete process.env['BUILDKITE'];

            const localThresholds = EnvironmentDetector.getThresholds();

            // Validate local thresholds are reasonable
            expect(localThresholds.performance.avgFPS).toBeGreaterThan(20);
            expect(localThresholds.performance.maxLoadTime).toBeLessThan(10000);
            expect(localThresholds.performance.maxMemoryGrowth).toBeGreaterThan(0);

            process.env['CI'] = 'true';
            const ciThresholds = EnvironmentDetector.getThresholds();

            // Validate CI thresholds are reasonable
            expect(ciThresholds.performance.avgFPS).toBeGreaterThan(1);
            expect(ciThresholds.performance.maxLoadTime).toBeLessThan(60000);
            expect(ciThresholds.performance.maxMemoryGrowth).toBeGreaterThan(0);
        });

        it('should have consistent threshold relationships', () => {
            const localThresholds = EnvironmentDetector.getThresholds();

            // Min FPS should be less than or equal to avg FPS
            expect(localThresholds.performance.minFPS).toBeLessThanOrEqual(
                localThresholds.performance.avgFPS
            );

            process.env['CI'] = 'true';
            const ciThresholds = EnvironmentDetector.getThresholds();

            expect(ciThresholds.performance.minFPS).toBeLessThanOrEqual(
                ciThresholds.performance.avgFPS
            );
        });
    });
});
