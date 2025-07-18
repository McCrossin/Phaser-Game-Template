/**
 * Deployment Configuration for New Eden Project
 * 2025 best practices implementation
 */

export interface DeploymentConfig {
    strategies: {
        production: {
            type: string;
            healthCheckEndpoint: string;
            warmupPeriod: string;
            rollbackTriggers: {
                errorRate: number;
                fpsDropBelow: number;
                responseTime: number;
                downtimeCostPerHour: number;
            };
        };
        costOptimization: {
            dynamicScaling: boolean;
            idleShutdown: boolean;
            predictiveScaling: boolean;
            targetUtilization: number;
            expectedSavings: number;
        };
    };
    monitoring: {
        realtimeDashboard: boolean;
        alertChannels: string[];
        metricsRetention: string;
        performanceMetrics: {
            fps: {
                median: boolean;
                stability: boolean;
                variabilityIndex: boolean;
            };
            microfreezes: {
                enabled: boolean;
                threshold: number;
                trackingRange: [number, number];
            };
        };
    };
    security: {
        codeQuality: {
            enabled: boolean;
            languages: string[];
            queries: string[];
        };
        containerScanning: {
            enabled: boolean;
            severity: string;
            ignoreUnfixed: boolean;
        };
        secretScanning: {
            enabled: boolean;
            customPatterns: string[];
        };
    };
}

export const DEPLOYMENT_2025_CONFIG: DeploymentConfig = {
    strategies: {
        production: {
            type: 'blue-green',
            healthCheckEndpoint: '/health',
            warmupPeriod: '5m',
            rollbackTriggers: {
                errorRate: 0.1, // 0.1%
                fpsDropBelow: 55,
                responseTime: 200, // ms
                downtimeCostPerHour: 50000 // $50k/hour for major studios
            }
        },
        costOptimization: {
            dynamicScaling: true,
            idleShutdown: true,
            predictiveScaling: true,
            targetUtilization: 0.7,
            expectedSavings: 0.35 // 35% reduction
        }
    },
    monitoring: {
        realtimeDashboard: true,
        alertChannels: ['slack', 'pagerduty'],
        metricsRetention: '90d',
        performanceMetrics: {
            fps: {
                median: true,
                stability: true,
                variabilityIndex: true
            },
            microfreezes: {
                enabled: true,
                threshold: 100, // ms
                trackingRange: [100, 1000] // 100-1000ms
            }
        }
    },
    security: {
        codeQuality: {
            enabled: true,
            languages: ['javascript', 'typescript'],
            queries: ['security-extended', 'security-and-quality']
        },
        containerScanning: {
            enabled: true,
            severity: 'CRITICAL,HIGH,MEDIUM',
            ignoreUnfixed: false
        },
        secretScanning: {
            enabled: true,
            customPatterns: ['game_api_key', 'player_auth_token', 'server_secret']
        }
    }
};

export const QUALITY_GATES = {
    codeCoverage: 80, // minimum 80%
    bundleSize: 2 * 1024 * 1024, // 2MB maximum
    fpsMinimum: 55, // minimum FPS
    lighthouseScore: 90, // minimum Lighthouse score
    errorRate: 0.1, // maximum 0.1% error rate
    responseTime: 200 // maximum 200ms response time
};
