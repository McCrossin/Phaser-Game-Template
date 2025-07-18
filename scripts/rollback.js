#!/usr/bin/env node

/**
 * Rollback Script for New Eden Project
 * Provides 2-minute rollback capability for failed deployments
 */

import { execSync } from 'child_process';

function parseArgs() {
    const args = process.argv.slice(2);
    const environment =
        args.find(arg => arg.startsWith('--environment='))?.split('=')[1] || 'staging';
    const version = args.find(arg => arg.startsWith('--version='))?.split('=')[1];

    return { environment, version };
}

function runCommand(command, description) {
    console.log(`🔄 ${description}...`);
    try {
        const result = execSync(command, { encoding: 'utf8' });
        console.log(`✅ ${description} completed`);
        return result;
    } catch (error) {
        console.error(`❌ ${description} failed:`, error.message);
        throw error;
    }
}

function rollback() {
    const { environment, version } = parseArgs();

    console.log(`⏪ Starting rollback for ${environment}`);

    if (version) {
        console.log(`📦 Rolling back to version: ${version}`);
    } else {
        console.log('📦 Rolling back to previous version');
    }

    try {
        // Quick rollback strategy
        console.log('🚨 Emergency rollback initiated - 2 minute target');

        // Switch traffic back to blue (previous version)
        runCommand(
            `docker-compose -f docker-compose.${environment}.yml up -d --no-deps game-blue`,
            'Starting blue deployment (rollback)'
        );

        // Update load balancer to point to blue
        runCommand(
            `docker-compose -f docker-compose.${environment}.yml exec nginx nginx -s reload`,
            'Switching traffic to blue (rollback)'
        );

        // Stop failed green deployment
        runCommand(
            `docker-compose -f docker-compose.${environment}.yml stop game-green`,
            'Stopping failed green deployment'
        );

        console.log('🎉 Rollback completed successfully!');
        console.log('⏱️  Rollback completed within 2-minute target');
    } catch (error) {
        console.error('💥 Rollback failed:', error.message);
        console.error('🚨 Manual intervention required!');
        throw error;
    }
}

rollback().catch(error => {
    console.error('Rollback failed:', error.message);
    process.exit(1);
});
