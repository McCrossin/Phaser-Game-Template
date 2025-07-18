# Story: Performance Monitoring Infrastructure
**ID**: SETUP-005  
**Epic**: Project Setup and Configuration  
**Priority**: High  
**Estimated Points**: 5  
**Dependencies**: SETUP-001 (Initial Project Configuration), SETUP-002 (Development Workflow Setup), SETUP-003 (CI/CD Pipeline Configuration)

## Description

Implement comprehensive performance monitoring and profiling infrastructure that tracks FPS, memory usage, draw calls, and other critical metrics during development and production. This story establishes automated performance regression detection, real-time monitoring dashboards, and detailed profiling tools to ensure the game maintains its 60 FPS target across all devices and scenarios.

### Player Experience Goal
Players enjoy smooth, consistent gameplay at 60 FPS without stuttering, memory leaks, or performance degradation over time. The monitoring infrastructure catches performance issues before release, ensuring optimal performance on both high-end and mid-range devices, resulting in a premium gaming experience regardless of hardware.

### Technical Overview
Integrate performance monitoring using the Performance Observer API, Core Web Vitals (LCP, INP, CLS), custom FPS counters using DOM elements for efficiency, and Phaser's built-in metrics (game.loop.actualFps). Set up automated performance benchmarking with Playwright, real-time monitoring dashboards, and alerts for performance regressions. All metrics integrate with the development workflow from SETUP-002 and CI pipeline from SETUP-003.

## Acceptance Criteria

### Functional Requirements
- [ ] FPS counter displays using DOM elements (not canvas text)
- [ ] Memory usage tracked via performance.measureUserAgentSpecificMemory()
- [ ] Core Web Vitals (LCP, INP, CLS) monitored
- [ ] Draw call monitoring via Phaser's renderer.drawCount
- [ ] Performance metrics logged to dashboard
- [ ] Automated alerts for performance regressions
- [ ] Performance profiling tools integrated

### Technical Requirements
- [ ] Performance monitoring service configured
- [ ] Custom performance metrics collection
- [ ] Integration with GitHub Actions for CI benchmarking
- [ ] Real-time dashboard for metrics visualization
- [ ] Performance budgets enforced in builds
- [ ] Client-side performance data collection

### Game Design Requirements
- [ ] 60 FPS maintained in typical gameplay
- [ ] Memory usage stays under 500MB
- [ ] Load times tracked and optimized
- [ ] Scene transition performance monitored
- [ ] Particle system performance tracked

## Technical Specifications

### Architecture Context
The performance monitoring infrastructure provides visibility into game performance across development, testing, and production environments. It integrates with Phaser's systems to track game-specific metrics and feeds data into both development tools and production monitoring systems.

### Files to Create/Modify
- `src/systems/PerformanceMonitor.ts`: Core performance monitoring system
- `src/systems/FPSCounter.ts`: Advanced FPS tracking
- `src/systems/MemoryProfiler.ts`: Memory usage tracking
- `src/systems/DrawCallCounter.ts`: Render performance monitoring
- `src/config/PerformanceConfig.ts`: Performance thresholds and settings
- `src/plugins/PerformancePlugin.ts`: Phaser plugin for monitoring
- `scripts/performance-benchmark.js`: CI performance testing
- `.github/workflows/performance.yml`: Updated performance workflow
- `public/debug-panel.html`: Development debug interface
- `src/utils/PerformanceReporter.ts`: Metrics reporting utility
- `tests/performance/`: Performance test suite
- `performance-budgets.json`: Performance budget configuration

### Key Classes and Interfaces
```typescript
// src/systems/PerformanceMonitor.ts
export class PerformanceMonitor {
    private metrics: PerformanceMetrics;
    private observers: PerformanceObserver[] = [];
    private frameTimeBuffer: CircularBuffer<number>;
    
    constructor(private scene: Phaser.Scene) {
        this.frameTimeBuffer = new CircularBuffer(120); // 2 seconds at 60fps
        this.setupObservers();
        this.initializeMetrics();
    }
    
    private setupObservers(): void {
        // Monitor long tasks and Core Web Vitals
        const longTaskObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.duration > 50) { // Tasks longer than 50ms
                    this.recordLongTask(entry);
                }
            }
        });
        longTaskObserver.observe({ entryTypes: ['longtask'] });
        
        // Monitor INP (Interaction to Next Paint)
        const inpObserver = new PerformanceObserver((list) => {
            for (const entry of list.getEntries()) {
                if (entry.interactionId) {
                    this.recordINP(entry);
                }
            }
        });
        inpObserver.observe({ entryTypes: ['event'] });
        
        // Monitor LCP (Largest Contentful Paint)
        const lcpObserver = new PerformanceObserver((list) => {
            const entries = list.getEntries();
            const lastEntry = entries[entries.length - 1];
            this.metrics.lcp = lastEntry.renderTime || lastEntry.loadTime;
        });
        lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] });
        
        // Monitor memory if available
        if ('memory' in performance) {
            this.startMemoryMonitoring();
        }
    }
    
    update(time: number, delta: number): void {
        this.frameTimeBuffer.push(delta);
        
        // Use Phaser's built-in FPS for accuracy
        this.metrics.fps = this.scene.game.loop.actualFps;
        this.metrics.frameTime = delta;
        this.metrics.drawCalls = this.scene.renderer.drawCount;
        
        // Update CLS (Cumulative Layout Shift)
        this.updateCLS();
        
        // Check performance budgets
        this.checkPerformanceBudgets();
        
        // Report metrics every second
        if (time - this.lastReportTime > 1000) {
            this.reportMetrics();
            this.lastReportTime = time;
        }
    }
}

// src/systems/FPSCounter.ts
export class FPSCounter {
    private fpsElement: HTMLDivElement;
    private metricsElement: HTMLDivElement;
    private scene: Phaser.Scene;
    
    constructor(scene: Phaser.Scene) {
        this.scene = scene;
        
        // Create DOM elements for better performance (as per 2025 best practices)
        this.createDOMElements();
    }
    
    private createDOMElements(): void {
        // Create container
        const container = document.createElement('div');
        container.id = 'performance-monitor';
        container.style.cssText = `
            position: fixed;
            top: 10px;
            right: 10px;
            background: rgba(0, 0, 0, 0.7);
            color: white;
            padding: 10px;
            font-family: monospace;
            font-size: 14px;
            z-index: 9999;
            border-radius: 5px;
        `;
        
        // FPS display
        this.fpsElement = document.createElement('div');
        this.fpsElement.id = 'fps';
        container.appendChild(this.fpsElement);
        
        // Additional metrics
        this.metricsElement = document.createElement('div');
        this.metricsElement.id = 'metrics';
        container.appendChild(this.metricsElement);
        
        document.body.appendChild(container);
    }
    
    update(metrics: PerformanceMetrics): void {
        const fps = Math.floor(this.scene.game.loop.actualFps);
        
        // Update DOM elements (better performance than canvas text)
        this.fpsElement.innerHTML = `FPS: ${fps}`;
        
        // Color coding based on performance
        if (fps >= 55) {
            this.fpsElement.style.color = '#00ff00'; // Green
        } else if (fps >= 30) {
            this.fpsElement.style.color = '#ffff00'; // Yellow
        } else {
            this.fpsElement.style.color = '#ff0000'; // Red
        }
        
        // Update additional metrics
        this.metricsElement.innerHTML = `
            Draw Calls: ${metrics.drawCalls}<br>
            Memory: ${Math.round(metrics.memory / 1048576)}MB<br>
            INP: ${metrics.inp?.toFixed(0) || 'N/A'}ms<br>
            LCP: ${metrics.lcp?.toFixed(0) || 'N/A'}ms
        `;
    }
}

// src/config/PerformanceConfig.ts
export interface PerformanceConfig {
    monitoring: {
        enabled: boolean;
        sampleRate: number; // Percentage of users to monitor in production
        reportingInterval: number; // Milliseconds
    };
    budgets: {
        fps: {
            target: number;
            minimum: number;
            warningThreshold: number;
        };
        memory: {
            maxHeapSize: number; // MB
            warningThreshold: number; // MB
        };
        drawCalls: {
            maximum: number;
            warningThreshold: number;
        };
        loadTime: {
            initial: number; // Seconds
            scene: number; // Seconds
        };
    };
    alerts: {
        enabled: boolean;
        channels: string[]; // console, remote, slack
        thresholds: AlertThreshold[];
    };
}

export const PERFORMANCE_CONFIG: PerformanceConfig = {
    monitoring: {
        enabled: true,
        sampleRate: process.env.NODE_ENV === 'production' ? 10 : 100,
        reportingInterval: 5000
    },
    budgets: {
        fps: {
            target: 60,
            minimum: 30,
            warningThreshold: 55
        },
        memory: {
            maxHeapSize: 500,
            warningThreshold: 400
        },
        drawCalls: {
            maximum: 100,
            warningThreshold: 80
        },
        loadTime: {
            initial: 3,
            scene: 0.5
        },
        // Core Web Vitals thresholds (2025 standards)
        webVitals: {
            lcp: { good: 2500, needsImprovement: 4000 }, // milliseconds
            inp: { good: 200, needsImprovement: 500 },   // milliseconds
            cls: { good: 0.1, needsImprovement: 0.25 }   // score
        }
    },
    alerts: {
        enabled: true,
        channels: ['console', 'remote'],
        thresholds: [
            { metric: 'fps', condition: 'below', value: 30, severity: 'critical' },
            { metric: 'fps', condition: 'below', value: 55, severity: 'warning' },
            { metric: 'memory', condition: 'above', value: 500, severity: 'critical' }
        ]
    }
};

// src/plugins/PerformancePlugin.ts
export class PerformancePlugin extends Phaser.Plugins.BasePlugin {
    private monitor: PerformanceMonitor;
    private debugPanel?: DebugPanel;
    private isRecording: boolean = false;
    private performanceData: PerformanceData[] = [];
    
    init(data?: any): void {
        console.log('Performance Plugin Initialized');
        
        // Add console commands for debugging
        this.addConsoleCommands();
        
        // Initialize based on environment
        if (this.game.config.physics?.arcade?.debug || 
            process.env.NODE_ENV === 'development') {
            this.enableDebugMode();
        }
    }
    
    start(): void {
        this.monitor = new PerformanceMonitor(this.game.scene.getScenes()[0]);
        
        // Hook into game update loop
        this.game.events.on('step', this.update, this);
        
        // Listen for performance events
        this.setupPerformanceListeners();
    }
    
    private addConsoleCommands(): void {
        // @ts-ignore - Adding to window for debugging
        window.performancePlugin = {
            startRecording: () => this.startRecording(),
            stopRecording: () => this.stopRecording(),
            getReport: () => this.generateReport(),
            showDebugPanel: () => this.showDebugPanel(),
            runBenchmark: () => this.runBenchmark()
        };
    }
    
    private runBenchmark(): BenchmarkResult {
        const results: BenchmarkResult = {
            fps: { min: Infinity, max: 0, avg: 0 },
            memory: { min: Infinity, max: 0, avg: 0 },
            drawCalls: { min: Infinity, max: 0, avg: 0 }
        };
        
        // Run performance intensive scenarios
        const scenarios = [
            () => this.spawnParticles(1000),
            () => this.createSprites(500),
            () => this.runPhysicsStressTest()
        ];
        
        scenarios.forEach(scenario => {
            this.measureScenario(scenario, results);
        });
        
        return results;
    }
}

// scripts/performance-benchmark.js
import { chromium } from 'playwright';
import { writeFileSync } from 'fs';

async function runPerformanceBenchmark() {
    const browser = await chromium.launch();
    const context = await browser.newContext();
    const page = await context.newPage();
    
    // Enable performance metrics collection
    await context.addInitScript(() => {
        window.performanceMetrics = [];
        
        // Use Phaser's built-in FPS and Core Web Vitals
        const { onLCP, onINP, onCLS } = await import('web-vitals');
        
        window.coreWebVitals = {
            lcp: null,
            inp: null,
            cls: null
        };
        
        onLCP((metric) => { window.coreWebVitals.lcp = metric.value; });
        onINP((metric) => { window.coreWebVitals.inp = metric.value; });
        onCLS((metric) => { window.coreWebVitals.cls = metric.value; });
        
        // Monitor game performance
        setInterval(() => {
            if (window.game) {
                window.performanceMetrics.push({
                    timestamp: performance.now(),
                    fps: Math.floor(window.game.loop.actualFps),
                    memory: performance.memory?.usedJSHeapSize || 0,
                    drawCalls: window.game.renderer.drawCount,
                    ...window.coreWebVitals
                });
            }
        }, 1000);
    });
    
    // Navigate to game
    await page.goto('http://localhost:5173');
    
    // Wait for game to load
    await page.waitForFunction(() => window.game?.scene?.scenes?.length > 0);
    
    // Run benchmark scenarios
    const results = await runScenarios(page);
    
    // Generate report
    const report = generatePerformanceReport(results);
    writeFileSync('performance-report.json', JSON.stringify(report, null, 2));
    
    await browser.close();
    
    // Check against budgets
    checkPerformanceBudgets(report);
}
```

### Integration Points
- **Phaser Game Loop**: Hooks into update cycle for metrics
- **Browser Performance API**: Uses native performance monitoring
- **CI/CD Pipeline**: Automated benchmarking in builds
- **Development Tools**: Debug panel and console commands
- **Production Monitoring**: Sampled data collection

### Performance Requirements
- Monitoring overhead: <2% performance impact
- Data collection: <1KB/second bandwidth
- Dashboard updates: Real-time (<100ms latency)
- Benchmark runs: Complete in <5 minutes
- Alert latency: <30 seconds for critical issues

## Implementation Tasks

### 1. Create Core Performance Monitor
Build the central performance monitoring system.

**Estimated Time**: 5 hours
**Technical Details**:
- Implement PerformanceMonitor class
- Create circular buffer for frame times
- Set up Performance Observer API usage
- Implement metric collection and aggregation
- Create performance budget checking
- Add extensible reporter system

### 2. Implement FPS Counter and Debug UI
Create visual performance monitoring tools.

**Estimated Time**: 4 hours
**Technical Details**:
- Build FPS counter with color coding
- Create mini performance graph
- Add memory usage display
- Implement draw call counter
- Create collapsible debug panel
- Add hotkeys for toggle visibility

### 3. Set Up Memory Profiling
Implement memory usage tracking and leak detection.

**Estimated Time**: 3 hours
**Technical Details**:
- Use Performance.memory API where available
- Track object creation and disposal
- Monitor texture memory usage
- Implement garbage collection tracking
- Create memory leak detection
- Add memory snapshot capabilities

### 4. Configure CI Performance Testing
Integrate performance testing into CI pipeline.

**Estimated Time**: 4 hours
**Technical Details**:
- Create Playwright-based benchmark runner
- Implement scenario-based testing
- Add performance regression detection
- Generate performance reports
- Create GitHub Action for benchmarking
- Set up performance badge generation

### 5. Build Performance Dashboard
Create real-time monitoring dashboard.

**Estimated Time**: 4 hours
**Technical Details**:
- Design dashboard UI layout
- Implement real-time data streaming
- Create historical trend graphs
- Add alert configuration interface
- Build performance comparison tools
- Create exportable reports

### 6. Implement Production Monitoring
Set up performance monitoring for production.

**Estimated Time**: 3 hours
**Technical Details**:
- Implement sampling logic (10% of users)
- Create anonymous data collection
- Set up data aggregation endpoints
- Configure alert thresholds
- Add performance analytics
- Create monitoring documentation

## Game Design Context

### GDD References
- Performance: 60 FPS target on mid-range hardware
- Optimization: Smooth gameplay across all devices
- Quality: Premium gaming experience maintained

### Performance Targets
```typescript
const PERFORMANCE_TARGETS = {
    scenes: {
        menu: { fps: 60, memory: 100, drawCalls: 20 },
        gameplay: { fps: 60, memory: 300, drawCalls: 80 },
        battle: { fps: 55, memory: 400, drawCalls: 100 }
    },
    devices: {
        desktop: { minFPS: 60, targetFPS: 120 },
        mobile: { minFPS: 30, targetFPS: 60 },
        tablet: { minFPS: 45, targetFPS: 60 }
    },
    operations: {
        sceneTransition: 500, // ms
        assetLoading: 100, // ms per asset
        saveGame: 200, // ms
        loadGame: 300 // ms
    }
};
```

### Monitoring Points
- Game initialization and loading
- Scene transitions and setup
- Combat system performance
- Particle effects and animations
- UI responsiveness
- Network operations (if any)

## Testing Requirements

### Unit Tests
- `tests/performance/PerformanceMonitor.test.ts`: Core monitoring logic
- `tests/performance/FPSCounter.test.ts`: FPS calculation accuracy
- `tests/performance/MemoryProfiler.test.ts`: Memory tracking

### Integration Tests
- Performance monitoring doesn't impact game performance
- Metrics are accurately collected and reported
- Alerts fire at correct thresholds
- Dashboard displays real-time data

### Performance Tests
- Monitoring overhead stays under 2%
- Benchmark scenarios complete successfully
- Performance budgets are enforced
- Regression detection works accurately

### Manual Testing
- [ ] FPS counter displays correctly
- [ ] Debug panel shows all metrics
- [ ] Performance alerts trigger properly
- [ ] CI benchmarks run successfully
- [ ] Production monitoring works

## Dependencies

### Prerequisite Stories
- SETUP-001: Initial Project Configuration (completed)
- SETUP-002: Development Workflow Setup (completed)
- SETUP-003: CI/CD Pipeline Configuration (completed)

### NPM Dependencies
- playwright: ^1.45.0 - For automated performance testing
- web-vitals: ^4.0.0 - Core Web Vitals monitoring (official Google library)
- @sentry/browser: ^8.0.0 - Error and performance monitoring with INP support
- perfume.js: ^9.0.0 - Web performance monitoring library
- circular-buffer: ^1.0.3 - Efficient data structure

### Browser APIs
- Performance Observer API (with 2025 entry types)
- User Timing API (with metadata support)
- Core Web Vitals APIs (LCP, INP, CLS)
- performance.measureUserAgentSpecificMemory() API
- Element Timing API
- Event Timing API

## Definition of Done

- [ ] All acceptance criteria met
- [ ] Performance monitoring integrated into game
- [ ] FPS counter and debug UI functional
- [ ] CI performance benchmarks running
- [ ] Production monitoring configured
- [ ] Performance budgets enforced
- [ ] Documentation complete
- [ ] No performance overhead from monitoring
- [ ] Alerts configured and tested
- [ ] Team trained on performance tools