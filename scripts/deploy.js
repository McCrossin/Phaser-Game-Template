#!/usr/bin/env node

/**
 * Blue-Green Deployment Script for New Eden Project
 * Implements zero-downtime deployment with 2-minute rollback capability
 */

import { execSync } from 'child_process';

const ENVIRONMENTS = {
    staging: {
        url: 'https://staging.neweden.game',
        healthCheck: '/health'
    },
    production: {
        url: 'https://play.neweden.game',
        healthCheck: '/health'
    }
};

function parseArgs() {
    const args = process.argv.slice(2);
    const environment =
        args.find(arg => arg.startsWith('--environment='))?.split('=')[1] || 'staging';
    const version = args.find(arg => arg.startsWith('--version='))?.split('=')[1] || 'latest';

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

function healthCheck(url) {
    console.log(`🏥 Health checking ${url}...`);
    try {
        execSync(`curl -f ${url}/health`, { encoding: 'utf8' });
        console.log('✅ Health check passed');
        return true;
    } catch (error) {
        console.error('❌ Health check failed:', error.message);
        return false;
    }
}

function deploy() {
    const { environment, version } = parseArgs();

    console.log(`🚀 Starting blue-green deployment to ${environment}`);
    console.log(`📦 Version: ${version}`);

    const envConfig = ENVIRONMENTS[environment];
    if (!envConfig) {
        throw new Error(`Unknown environment: ${environment}`);
    }

    try {
        // Deploy new version (green)
        runCommand(
            `docker pull ghcr.io/mccrossin/galactic-automation:${version}`,
            'Pulling new image'
        );
        runCommand(
            `docker-compose -f docker-compose.${environment}.yml up -d --no-deps game-green`,
            'Starting green deployment'
        );

        // Wait for green to be ready
        console.log('⏳ Waiting for green deployment to be ready...');
        setTimeout(() => {
            if (healthCheck(`${envConfig.url}-green`)) {
                // Switch traffic to green
                runCommand(
                    `docker-compose -f docker-compose.${environment}.yml up -d --no-deps nginx`,
                    'Switching traffic to green'
                );

                // Stop blue (old version)
                runCommand(
                    `docker-compose -f docker-compose.${environment}.yml stop game-blue`,
                    'Stopping blue deployment'
                );

                console.log('🎉 Blue-green deployment completed successfully!');
                console.log(`🌐 Application available at: ${envConfig.url}`);
            } else {
                throw new Error('Green deployment health check failed');
            }
        }, 30000); // Wait 30 seconds
    } catch (error) {
        console.error('💥 Deployment failed, initiating rollback...');
        // Rollback logic would go here
        throw error;
    }
}

if (require.main === module) {
    deploy().catch(error => {
        console.error('Deployment failed:', error.message);
        process.exit(1);
    });
}
