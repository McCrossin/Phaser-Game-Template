/**
 * Real-time test monitoring and hanging test detection
 * Monitors test execution and terminates hanging t                        // Detect test start
            const testStartMatch = line.match(/❯ (.+\.test\.ts) (.+)/);
            if (testStartMatch && testStartMatch[1] && testStartMatch[2]) {
                const filePath = testStartMatch[1]!;
                const testName = testStartMatch[2]!;
                const testKey = `${filePath}:${testName}`;

                this.activeTests.set(testKey, {
                    testName,
                    filePath,
                    startTime: Date.now(),
                    duration: 0,
                    status: 'running',
                    memoryUsage: process.memoryUsage().heapUsed
                });

                this.emit('testStarted', { filePath, testName });
            }
 */

import { spawn, ChildProcess } from 'child_process';
import { EventEmitter } from 'events';

interface TestMonitorConfig {
    maxTestDuration: number; // Maximum time for a single test
    maxSuiteDuration: number; // Maximum time for entire suite
    hangingTestThreshold: number; // Time before considering a test hanging
    memoryThreshold: number; // Memory usage threshold
    enableKillSwitch: boolean; // Whether to automatically kill hanging tests
}

interface TestExecutionStatus {
    testName: string;
    filePath: string;
    startTime: number;
    duration: number;
    status: 'running' | 'completed' | 'hanging' | 'killed';
    memoryUsage: number;
}

export class TestMonitor extends EventEmitter {
    private readonly config: TestMonitorConfig;
    private testProcess: ChildProcess | null = null;
    private activeTests: Map<string, TestExecutionStatus> = new Map();
    private suiteStartTime: number = 0;
    private monitoringInterval: NodeJS.Timeout | null = null;
    private hangingTestDetector: NodeJS.Timeout | null = null;

    constructor(config: Partial<TestMonitorConfig> = {}) {
        super();

        this.config = {
            maxTestDuration: 10000, // 10 seconds per test
            maxSuiteDuration: 30000, // 30 seconds for entire suite
            hangingTestThreshold: 5000, // 5 seconds before considering hanging
            memoryThreshold: 512 * 1024 * 1024, // 512MB
            enableKillSwitch: true,
            ...config
        };
    }

    /**
     * Start monitoring test execution
     */
    startMonitoring(testCommand: string[]): Promise<boolean> {
        return new Promise((resolve, reject) => {
            console.log('🔍 Starting test monitoring...');

            this.suiteStartTime = Date.now();
            this.activeTests.clear();

            // Start test process
            if (!testCommand[0]) {
                reject(new Error('Test command is required'));
                return;
            }
            this.testProcess = spawn(testCommand[0], testCommand.slice(1), {
                stdio: ['pipe', 'pipe', 'pipe'],
                env: { ...process.env, FORCE_COLOR: '0' }
            });

            if (!this.testProcess) {
                reject(new Error('Failed to start test process'));
                return;
            }

            // Monitor test output
            this.testProcess.stdout?.on('data', data => {
                this.parseTestOutput(data.toString());
            });

            this.testProcess.stderr?.on('data', data => {
                this.parseTestError(data.toString());
            });

            this.testProcess.on('exit', code => {
                this.cleanup();
                resolve(code === 0);
            });

            this.testProcess.on('error', error => {
                this.cleanup();
                reject(error);
            });

            // Start monitoring intervals
            this.startMonitoringIntervals();

            // Set suite timeout
            setTimeout(() => {
                if (this.testProcess && !this.testProcess.killed) {
                    console.log('❌ Test suite exceeded maximum duration, terminating...');
                    this.killTestProcess('suite timeout');
                    resolve(false);
                }
            }, this.config.maxSuiteDuration);
        });
    }

    /**
     * Parse test output to track execution
     */
    private parseTestOutput(output: string): void {
        const lines = output.split('\n');

        for (const line of lines) {
            // Detect test start
            const testStartMatch = line.match(/❯ (.+\.test\.ts) (.+)/);
            if (testStartMatch && testStartMatch[1] && testStartMatch[2]) {
                const filePath = testStartMatch[1]!;
                const testName = testStartMatch[2]!;
                const testKey = `${filePath}:${testName}`;

                this.activeTests.set(testKey, {
                    testName,
                    filePath,
                    startTime: Date.now(),
                    duration: 0,
                    status: 'running',
                    memoryUsage: process.memoryUsage().heapUsed
                });

                this.emit('testStarted', { filePath, testName });
            }

            // Detect test completion
            const testEndMatch = line.match(/[✓×] (.+) (\d+)ms/);
            if (testEndMatch) {
                const testName = testEndMatch[1];
                const durationStr = testEndMatch[2];

                if (!testName || !durationStr) {
                    return; // Skip if either is undefined
                }

                const duration = parseInt(durationStr);

                // Find and update the test
                for (const [key, test] of this.activeTests) {
                    if (test.testName.includes(testName) || testName.includes(test.testName)) {
                        test.status = 'completed';
                        test.duration = duration;

                        this.emit('testCompleted', test);

                        if (duration > this.config.hangingTestThreshold) {
                            this.emit('slowTest', test);
                        }

                        this.activeTests.delete(key);
                        break;
                    }
                }
            }

            // Detect queued tests
            if (line.includes('[queued]')) {
                console.log('⏳ Test queued detected:', line);
                this.emit('testQueued', { line });
            }
        }
    }

    /**
     * Parse test errors
     */
    private parseTestError(error: string): void {
        if (error.includes('timeout') || error.includes('hung')) {
            console.log('❌ Test timeout/hang detected:', error);
            this.emit('testHanging', { error });
        }
    }

    /**
     * Start monitoring intervals for hanging tests
     */
    private startMonitoringIntervals(): void {
        // Check for hanging tests every 2 seconds
        this.hangingTestDetector = setInterval(() => {
            const now = Date.now();
            const hangingTests: TestExecutionStatus[] = [];

            for (const [, test] of this.activeTests) {
                const runTime = now - test.startTime;

                if (runTime > this.config.hangingTestThreshold && test.status === 'running') {
                    test.status = 'hanging';
                    hangingTests.push(test);

                    console.log(`⚠️ Hanging test detected: ${test.testName} (${runTime}ms)`);
                    this.emit('testHanging', test);
                }

                // Kill test if it exceeds maximum duration
                if (runTime > this.config.maxTestDuration && this.config.enableKillSwitch) {
                    console.log(`💀 Killing hanging test: ${test.testName} (${runTime}ms)`);
                    test.status = 'killed';
                    this.emit('testKilled', test);

                    // In a real implementation, we'd need to kill specific test processes
                    // For now, we'll kill the entire test process
                    this.killTestProcess(`test ${test.testName} exceeded max duration`);
                    break;
                }
            }

            if (hangingTests.length > 0) {
                this.emit('hangingTestsDetected', hangingTests);
            }
        }, 2000);

        // Monitor memory usage
        this.monitoringInterval = setInterval(() => {
            const memUsage = process.memoryUsage();

            if (memUsage.heapUsed > this.config.memoryThreshold) {
                console.log(
                    `⚠️ High memory usage detected: ${(memUsage.heapUsed / 1024 / 1024).toFixed(0)}MB`
                );
                this.emit('highMemoryUsage', memUsage);
            }
        }, 5000);
    }

    /**
     * Kill the test process
     */
    private killTestProcess(reason: string): void {
        if (this.testProcess && !this.testProcess.killed) {
            console.log(`💀 Killing test process: ${reason}`);
            this.testProcess.kill('SIGTERM');

            // Force kill after 5 seconds if it doesn't respond
            setTimeout(() => {
                if (this.testProcess && !this.testProcess.killed) {
                    console.log('🔥 Force killing test process...');
                    this.testProcess.kill('SIGKILL');
                }
            }, 5000);
        }
    }

    /**
     * Clean up monitoring resources
     */
    private cleanup(): void {
        if (this.monitoringInterval) {
            clearInterval(this.monitoringInterval);
            this.monitoringInterval = null;
        }

        if (this.hangingTestDetector) {
            clearInterval(this.hangingTestDetector);
            this.hangingTestDetector = null;
        }

        this.activeTests.clear();
        this.testProcess = null;
    }

    /**
     * Get current test execution status
     */
    getExecutionStatus(): {
        suiteRunTime: number;
        activeTestCount: number;
        hangingTestCount: number;
        memoryUsage: NodeJS.MemoryUsage;
    } {
        const now = Date.now();
        const hangingCount = Array.from(this.activeTests.values()).filter(
            test => test.status === 'hanging'
        ).length;

        return {
            suiteRunTime: now - this.suiteStartTime,
            activeTestCount: this.activeTests.size,
            hangingTestCount: hangingCount,
            memoryUsage: process.memoryUsage()
        };
    }

    /**
     * Stop monitoring
     */
    stop(): void {
        if (this.testProcess && !this.testProcess.killed) {
            this.killTestProcess('manual stop');
        }
        this.cleanup();
    }
}
