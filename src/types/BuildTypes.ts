/**
 * Type definitions for build tools and development utilities
 * Provides strong typing for the build system and development tools
 */

// Build System Types
export interface BuildInfo {
    readonly version: string;
    readonly buildTime: string;
    readonly gitCommit: string;
    readonly gitBranch: string;
    readonly buildNumber: string;
    readonly nodeVersion: string;
    readonly environment: string;
    readonly performanceTarget: PerformanceTarget;
    readonly security: SecurityInfo;
}

export interface PerformanceTarget {
    readonly fps: number;
    readonly bundleSize: string;
    readonly loadTime: string;
}

export interface SecurityInfo {
    readonly codeqlScan: boolean;
    readonly containerScan: boolean;
    readonly dependencyScan: boolean;
}

// Performance Monitoring Types
export interface PerformanceMetrics {
    readonly fps: FPSMetrics;
    readonly memory: MemoryMetrics;
    readonly loadTime: LoadTimeMetrics;
    readonly microfreezes: MicrofreezeMetrics;
}

export interface FPSMetrics {
    readonly average: number;
    readonly minimum: number;
    readonly maximum: number;
    readonly baseline?: number;
    readonly samples: number[];
}

export interface MemoryMetrics {
    readonly current: number;
    readonly peak: number;
    readonly baseline?: number;
    readonly gcCount: number;
}

export interface LoadTimeMetrics {
    readonly initial: number;
    readonly assets: number;
    readonly total: number;
    readonly breakdown: Record<string, number>;
}

export interface MicrofreezeMetrics {
    readonly count: number;
    readonly maxDuration: number;
    readonly averageDuration: number;
    readonly timestamps: number[];
}

// Development Tool Types
export interface ScriptRunnerOptions {
    readonly dryRun?: boolean;
    readonly backup?: boolean;
    readonly timeout?: number;
    readonly extraArgs?: string[];
    readonly verbose?: boolean;
}

export interface CleanupResult {
    readonly success: boolean;
    readonly removedPaths: string[];
    readonly failedPaths: string[];
    readonly totalSize: number;
    readonly errors: string[];
}

export interface TestResult {
    readonly passed: boolean;
    readonly duration: number;
    readonly coverage?: CoverageResult;
    readonly performance?: PerformanceMetrics;
    readonly errors: string[];
}

export interface CoverageResult {
    readonly lines: number;
    readonly statements: number;
    readonly functions: number;
    readonly branches: number;
    readonly threshold: CoverageThreshold;
}

export interface CoverageThreshold {
    readonly lines: number;
    readonly statements: number;
    readonly functions: number;
    readonly branches: number;
}

// Code Quality Types
export interface LintResult {
    readonly filePath: string;
    readonly messages: LintMessage[];
    readonly errorCount: number;
    readonly warningCount: number;
    readonly fixableErrorCount: number;
    readonly fixableWarningCount: number;
}

export interface LintMessage {
    readonly ruleId: string | null;
    readonly severity: number;
    readonly message: string;
    readonly line: number;
    readonly column: number;
    readonly nodeType?: string;
    readonly source?: string;
}

// Asset Processing Types
export interface AssetProcessingOptions {
    readonly quality: number;
    readonly format: string;
    readonly compress: boolean;
    readonly generateSourceMap: boolean;
}

export interface AssetProcessingResult {
    readonly inputPath: string;
    readonly outputPath: string;
    readonly originalSize: number;
    readonly processedSize: number;
    readonly compressionRatio: number;
    readonly processingTime: number;
}

// Deployment Types
export interface DeploymentConfig {
    readonly environment: 'development' | 'staging' | 'production';
    readonly target: DeploymentTarget;
    readonly buildOptions: BuildOptions;
    readonly rollbackOptions: RollbackOptions;
}

export interface DeploymentTarget {
    readonly platform: 'web' | 'electron' | 'mobile';
    readonly url?: string;
    readonly credentials?: DeploymentCredentials;
    readonly healthCheck: HealthCheckConfig;
}

export interface DeploymentCredentials {
    readonly apiKey?: string;
    readonly token?: string;
    readonly username?: string;
    readonly region?: string;
}

export interface BuildOptions {
    readonly minify: boolean;
    readonly sourceMaps: boolean;
    readonly treeshaking: boolean;
    readonly compression: boolean;
    readonly optimization: OptimizationLevel;
}

export type OptimizationLevel = 'none' | 'basic' | 'advanced';

export interface RollbackOptions {
    readonly enabled: boolean;
    readonly retainVersions: number;
    readonly automaticRollback: boolean;
    readonly healthCheckThreshold: number;
}

export interface HealthCheckConfig {
    readonly endpoint: string;
    readonly timeout: number;
    readonly retries: number;
    readonly interval: number;
}

// CI/CD Types
export interface CIConfig {
    readonly provider: 'github' | 'gitlab' | 'jenkins';
    readonly stages: CIStage[];
    readonly triggers: CITrigger[];
    readonly environment: Record<string, string>;
}

export interface CIStage {
    readonly name: string;
    readonly commands: string[];
    readonly dependencies: string[];
    readonly condition?: string;
    readonly timeout: number;
}

export interface CITrigger {
    readonly event: 'push' | 'pull_request' | 'schedule' | 'manual';
    readonly branches?: string[];
    readonly paths?: string[];
    readonly schedule?: string;
}

// Utility Types for Development Tools
export type LogLevel = 'debug' | 'info' | 'warn' | 'error';

export interface Logger {
    debug(message: string, ...args: unknown[]): void;
    info(message: string, ...args: unknown[]): void;
    warn(message: string, ...args: unknown[]): void;
    error(message: string, ...args: unknown[]): void;
}

export interface FileSystemPath {
    readonly absolute: string;
    readonly relative: string;
    readonly exists: boolean;
    readonly isDirectory: boolean;
    readonly size: number;
}

export interface ProcessResult {
    readonly exitCode: number;
    readonly stdout: string;
    readonly stderr: string;
    readonly duration: number;
    readonly command: string;
}

// Configuration Types
export interface ToolConfig {
    readonly typescript: TypeScriptConfig;
    readonly eslint: ESLintConfig;
    readonly prettier: PrettierConfig;
    readonly vite: ViteConfig;
}

export interface TypeScriptConfig {
    readonly strict: boolean;
    readonly noImplicitAny: boolean;
    readonly exactOptionalPropertyTypes: boolean;
    readonly noUncheckedIndexedAccess: boolean;
    readonly paths: Record<string, string[]>;
}

export interface ESLintConfig {
    readonly extends: string[];
    readonly rules: Record<string, unknown>;
    readonly parser: string;
    readonly plugins: string[];
}

export interface PrettierConfig {
    readonly tabWidth: number;
    readonly useTabs: boolean;
    readonly singleQuote: boolean;
    readonly trailingComma: 'none' | 'es5' | 'all';
}

export interface ViteConfig {
    readonly base: string;
    readonly outDir: string;
    readonly sourcemap: boolean;
    readonly minify: boolean;
    readonly target: string;
}
