#!/usr/bin/env node

/**
 * Enhanced Build Info Generator for Phaser Game Template
 * Generates comprehensive build metadata and version information
 */

import { writeFileSync } from 'fs';
import { execSync } from 'child_process';
import { readFileSync } from 'fs';

function getGitInfo() {
    try {
        const commit = execSync('git rev-parse HEAD', { encoding: 'utf8' }).trim();
        const branch = execSync('git rev-parse --abbrev-ref HEAD', { encoding: 'utf8' }).trim();
        return { commit, branch };
    } catch (error) {
        console.warn('Git info not available:', error.message);
        return { commit: 'unknown', branch: 'unknown' };
    }
}

function generateBuildInfo() {
    const packageJson = JSON.parse(readFileSync('package.json', 'utf8'));
    const { commit, branch } = getGitInfo();

    return {
        version: packageJson.version,
        buildTime: new Date().toISOString(),
        gitCommit: commit.substring(0, 8),
        gitBranch: branch,
        buildNumber: process.env.GITHUB_RUN_NUMBER || '0',
        nodeVersion: process.version,
        environment: process.env.NODE_ENV || 'development',
        performanceTarget: {
            fps: 60,
            bundleSize: '2MB',
            loadTime: '3s'
        },
        security: {
            codeqlScan: process.env.GITHUB_ACTIONS === 'true',
            containerScan: process.env.GITHUB_ACTIONS === 'true',
            dependencyScan: process.env.GITHUB_ACTIONS === 'true'
        }
    };
}

// Generate build info
const buildInfo = generateBuildInfo();

// Write to dist directory
try {
    writeFileSync('dist/build-info.json', JSON.stringify(buildInfo, null, 2));
    console.log('✅ Build info generated successfully');
    console.log(`📦 Version: ${buildInfo.version}`);
    console.log(`🚀 Build: ${buildInfo.buildNumber}`);
    console.log(`🔧 Commit: ${buildInfo.gitCommit}`);
    console.log(`🌿 Branch: ${buildInfo.gitBranch}`);
} catch (error) {
    console.error('❌ Failed to generate build info:', error.message);
    process.exit(1);
}
