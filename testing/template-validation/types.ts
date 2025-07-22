export interface TemplateQualityReport {
    testResults: TestSuiteResults;
    buildResults: BuildValidation;
    lintResults: LintValidation;
    performanceResults: PerformanceValidation;
    healthChecks: HealthCheckResults;
    overallStatus: 'PASS' | 'FAIL';
    warnings: Warning[];
    errors: Error[];
    qualityGates?: QualityGate[];
    duration?: number;
    summary?: ValidationSummary;
}

export interface TestSuiteResults {
    unitTests: UnitTestResults;
    integrationTests: IntegrationTestResults;
    e2eTests: E2ETestResults;
}

export interface UnitTestResults {
    status: 'PASS' | 'FAIL' | 'SKIPPED';
    output: string;
    duration: number;
    testsRun?: number;
    testsPassed?: number;
    testsFailed?: number;
    coverage?: CoverageResults;
}

export interface IntegrationTestResults {
    status: 'PASS' | 'FAIL' | 'SKIPPED';
    output: string;
    duration: number;
    reason?: string;
}

export interface E2ETestResults {
    status: 'PASS' | 'FAIL' | 'SKIPPED';
    output: string;
    duration: number;
    browsersRun?: string[];
    screenshotsGenerated?: number;
}

export interface CoverageResults {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
    threshold: CoverageThreshold;
}

export interface CoverageThreshold {
    lines: number;
    functions: number;
    branches: number;
    statements: number;
}

export interface BuildValidation {
    typescript: TypeScriptValidation;
    vite: ViteBuildValidation;
    docker: DockerValidation;
}

export interface TypeScriptValidation {
    status: 'PASS' | 'FAIL';
    warnings: number;
    errors: number;
    output: string;
}

export interface ViteBuildValidation {
    status: 'PASS' | 'FAIL';
    output: string;
    buildSize: number;
    warnings?: number;
    errors?: number;
}

export interface DockerValidation {
    status: 'PASS' | 'FAIL' | 'SKIPPED';
    output?: string;
    reason?: string;
    error?: string;
}

export interface LintValidation {
    status: 'PASS' | 'FAIL';
    warnings: number;
    errors: number;
    output: string;
    issues?: LintIssue[];
}

export interface LintIssue {
    file: string;
    line: number;
    column: number;
    rule: string;
    severity: 'error' | 'warning';
    message: string;
}

export interface PerformanceValidation {
    status: 'PASS' | 'FAIL';
    output: string;
    metrics?: PerformanceMetrics;
}

export interface PerformanceMetrics {
    fps: number;
    memoryUsage: number;
    loadTime: number;
    bundleSize: number;
}

export interface HealthCheckResults {
    status: 'PASS' | 'FAIL';
    output: string;
    checks?: HealthCheck[];
}

export interface HealthCheck {
    name: string;
    status: 'PASS' | 'FAIL';
    message?: string;
    timestamp: string;
}

export interface QualityGate {
    name: string;
    threshold: number;
    actualValue: number;
    status: 'PASS' | 'FAIL';
    severity: 'ERROR' | 'WARNING' | 'INFO';
    description?: string;
}

export interface Warning {
    source: string;
    message: string;
    file?: string;
    line?: number;
    timestamp: string;
}

export interface Error {
    source: string;
    message: string;
    file?: string;
    line?: number;
    stack?: string;
    timestamp: string;
}

export interface ValidationSummary {
    totalTests: number;
    passedTests: number;
    failedTests: number;
    warnings: number;
    errors: number;
    qualityGatesPassed: number;
    qualityGatesFailed: number;
}

export interface ReportAnalysis {
    coverageReport?: CoverageReportAnalysis;
    performanceReport?: PerformanceReportAnalysis;
    ciReport?: CIReportAnalysis;
    healthReport?: HealthReportAnalysis;
}

export interface CoverageReportAnalysis {
    fileExists: boolean;
    isValid: boolean;
    meetsThresholds: boolean;
    issues: string[];
}

export interface PerformanceReportAnalysis {
    fileExists: boolean;
    isValid: boolean;
    meetsTargets: boolean;
    regressions: string[];
}

export interface CIReportAnalysis {
    workflowStatus: 'PASS' | 'FAIL' | 'UNKNOWN';
    failedJobs: string[];
    issues: string[];
}

export interface HealthReportAnalysis {
    fileExists: boolean;
    isValid: boolean;
    allChecksPass: boolean;
    failedChecks: string[];
}

// Quality thresholds configuration
export interface QualityThresholds {
    TEST_SUCCESS_RATE: number;
    WARNING_COUNT: number;
    ERROR_COUNT: number;
    CODE_COVERAGE: number;
    PERFORMANCE_REGRESSION: number;
    BUILD_SUCCESS_RATE: number;
    FPS_TARGET: number;
    MEMORY_LIMIT_MB: number;
    BUNDLE_SIZE_LIMIT_MB: number;
}

export const DEFAULT_QUALITY_THRESHOLDS: QualityThresholds = {
    TEST_SUCCESS_RATE: 100, // 100% test pass rate required
    WARNING_COUNT: 0, // Zero warnings allowed
    ERROR_COUNT: 0, // Zero errors allowed
    CODE_COVERAGE: 80, // Minimum 80% coverage
    PERFORMANCE_REGRESSION: 0, // No performance regression allowed
    BUILD_SUCCESS_RATE: 100, // 100% build success required
    FPS_TARGET: 60, // Minimum 60 FPS
    MEMORY_LIMIT_MB: 512, // Memory limit for validation process
    BUNDLE_SIZE_LIMIT_MB: 10 // Bundle size limit
};

// Error detection patterns
export interface ErrorPattern {
    pattern: RegExp;
    severity: 'ERROR' | 'WARNING' | 'INFO';
    source: string;
    description: string;
}

export const ERROR_PATTERNS: ErrorPattern[] = [
    {
        pattern: /error/i,
        severity: 'ERROR',
        source: 'general',
        description: 'General error detected'
    },
    {
        pattern: /warning/i,
        severity: 'WARNING',
        source: 'general',
        description: 'General warning detected'
    },
    {
        pattern: /fail(ed|ure)/i,
        severity: 'ERROR',
        source: 'test',
        description: 'Test failure detected'
    },
    {
        pattern: /cannot find module/i,
        severity: 'ERROR',
        source: 'typescript',
        description: 'Module resolution error'
    },
    {
        pattern: /type\s+error/i,
        severity: 'ERROR',
        source: 'typescript',
        description: 'TypeScript type error'
    },
    {
        pattern: /deprecated/i,
        severity: 'WARNING',
        source: 'general',
        description: 'Deprecated API usage'
    },
    {
        pattern: /coverage.*not met/i,
        severity: 'ERROR',
        source: 'coverage',
        description: 'Coverage threshold not met'
    }
];
