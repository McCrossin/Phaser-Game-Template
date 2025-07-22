import { Warning, Error, ERROR_PATTERNS } from './types';
import { promises as fs } from 'fs';
import path from 'path';

export class ErrorDetector {
    private projectRoot: string;
    private detectedWarnings: Warning[] = [];
    private detectedErrors: Error[] = [];

    constructor(projectRoot: string) {
        this.projectRoot = projectRoot;
    }

    /**
     * Scan output for any issues using predefined patterns
     */
    async scanForIssues(output: string, source: string): Promise<void> {
        const lines = output.split('\n');

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i];
            if (line !== undefined) {
                await this.scanLine(line, source, i + 1);
            }
        }
    }

    /**
     * Scan console output for runtime warnings and errors
     */
    async scanConsoleOutput(): Promise<void> {
        // This would be used during runtime testing
        // For now, we'll check log files if they exist
        const logFiles = ['performance-errors.log', 'error.log', 'debug.log'];

        for (const logFile of logFiles) {
            const logPath = path.join(this.projectRoot, logFile);
            if (await this.fileExists(logPath)) {
                const content = await fs.readFile(logPath, 'utf8');
                await this.scanForIssues(content, `log-${logFile}`);
            }
        }
    }

    /**
     * Scan build logs for any issues
     */
    async scanBuildLogs(): Promise<void> {
        const buildLogPaths = ['build.log', 'npm-debug.log', '.npm/_logs'];

        for (const logPath of buildLogPaths) {
            const fullPath = path.join(this.projectRoot, logPath);

            if (await this.fileExists(fullPath)) {
                const stats = await fs.stat(fullPath);

                if (stats.isDirectory()) {
                    // Scan all log files in directory
                    const files = await fs.readdir(fullPath);
                    for (const file of files) {
                        if (file.endsWith('.log')) {
                            const content = await fs.readFile(path.join(fullPath, file), 'utf8');
                            await this.scanForIssues(content, `build-log-${file}`);
                        }
                    }
                } else {
                    const content = await fs.readFile(fullPath, 'utf8');
                    await this.scanForIssues(content, `build-log-${path.basename(logPath)}`);
                }
            }
        }
    }

    /**
     * Scan TypeScript compilation output thoroughly
     */
    async scanTypeScriptOutput(output: string): Promise<void> {
        await this.scanForIssues(output, 'typescript');

        // Additional TypeScript-specific checks
        const tsErrors = this.extractTypeScriptErrors(output);
        for (const error of tsErrors) {
            const errorObj: any = {
                source: 'typescript',
                message: error.message,
                timestamp: new Date().toISOString()
            };

            if (error.file) errorObj.file = error.file;
            if (error.line) errorObj.line = error.line;

            this.addError(errorObj);
        }
    }

    /**
     * Scan ESLint output for warnings and errors
     */
    async scanESLintOutput(output: string): Promise<void> {
        await this.scanForIssues(output, 'eslint');

        // Parse ESLint JSON output if available
        const eslintResults = this.parseESLintOutput(output);
        for (const result of eslintResults) {
            if (result.severity === 'error') {
                const errorObj: any = {
                    source: 'eslint',
                    message: result.message,
                    timestamp: new Date().toISOString()
                };

                if (result.file) errorObj.file = result.file;
                if (result.line) errorObj.line = result.line;

                this.addError(errorObj);
            } else if (result.severity === 'warning') {
                const warningObj: any = {
                    source: 'eslint',
                    message: result.message,
                    timestamp: new Date().toISOString()
                };

                if (result.file) warningObj.file = result.file;
                if (result.line) warningObj.line = result.line;

                this.addWarning(warningObj);
            }
        }
    }

    /**
     * Get all detected warnings
     */
    getWarnings(): Warning[] {
        return [...this.detectedWarnings];
    }

    /**
     * Get all detected errors
     */
    getErrors(): Error[] {
        return [...this.detectedErrors];
    }

    /**
     * Clear all detected issues
     */
    clearIssues(): void {
        this.detectedWarnings = [];
        this.detectedErrors = [];
    }

    /**
     * Check if any errors were detected
     */
    hasErrors(): boolean {
        return this.detectedErrors.length > 0;
    }

    /**
     * Check if any warnings were detected
     */
    hasWarnings(): boolean {
        return this.detectedWarnings.length > 0;
    }

    /**
     * Generate comprehensive error report
     */
    generateErrorReport(): string {
        const report: string[] = [];

        if (this.detectedErrors.length > 0) {
            report.push('🚨 ERRORS DETECTED:');
            for (const error of this.detectedErrors) {
                report.push(`  ❌ [${error.source}] ${error.message}`);
                if (error.file) {
                    report.push(`     File: ${error.file}${error.line ? `:${error.line}` : ''}`);
                }
            }
            report.push('');
        }

        if (this.detectedWarnings.length > 0) {
            report.push('⚠️  WARNINGS DETECTED:');
            for (const warning of this.detectedWarnings) {
                report.push(`  ⚠️  [${warning.source}] ${warning.message}`);
                if (warning.file) {
                    report.push(
                        `     File: ${warning.file}${warning.line ? `:${warning.line}` : ''}`
                    );
                }
            }
            report.push('');
        }

        if (this.detectedErrors.length === 0 && this.detectedWarnings.length === 0) {
            report.push('✅ No errors or warnings detected');
        }

        return report.join('\n');
    }

    /**
     * Scan a single line for issues
     */
    private async scanLine(line: string, source: string, lineNumber: number): Promise<void> {
        for (const pattern of ERROR_PATTERNS) {
            if (pattern.pattern.test(line)) {
                const issue = {
                    source: pattern.source || source,
                    message: line.trim(),
                    line: lineNumber,
                    timestamp: new Date().toISOString()
                };

                if (pattern.severity === 'ERROR') {
                    this.addError(issue);
                } else if (pattern.severity === 'WARNING') {
                    this.addWarning(issue);
                }
            }
        }

        // Additional specific checks
        await this.performSpecificChecks(line, source, lineNumber);
    }

    /**
     * Perform specific checks for different types of output
     */
    private async performSpecificChecks(
        line: string,
        _source: string,
        lineNumber: number
    ): Promise<void> {
        // Check for npm/yarn warnings
        if (line.includes('npm WARN') || line.includes('yarn WARN')) {
            this.addWarning({
                source: 'npm',
                message: line.trim(),
                line: lineNumber,
                timestamp: new Date().toISOString()
            });
        }

        // Check for deprecated dependencies
        if (line.includes('deprecated')) {
            this.addWarning({
                source: 'dependencies',
                message: line.trim(),
                line: lineNumber,
                timestamp: new Date().toISOString()
            });
        }

        // Check for security vulnerabilities
        if (line.includes('vulnerability') || line.includes('audit')) {
            this.addError({
                source: 'security',
                message: line.trim(),
                line: lineNumber,
                timestamp: new Date().toISOString()
            });
        }

        // Check for performance warnings
        if (line.includes('performance') && (line.includes('slow') || line.includes('timeout'))) {
            this.addWarning({
                source: 'performance',
                message: line.trim(),
                line: lineNumber,
                timestamp: new Date().toISOString()
            });
        }
    }

    /**
     * Extract TypeScript errors with file and line information
     */
    private extractTypeScriptErrors(
        output: string
    ): Array<{ message: string; file?: string; line?: number }> {
        const errors: Array<{ message: string; file?: string; line?: number }> = [];
        const lines = output.split('\n');

        for (const line of lines) {
            // Match TypeScript error format: file(line,col): error TS#### message
            const match = line.match(/^(.+?)\((\d+),\d+\):\s+error\s+TS\d+:\s+(.+)$/);
            if (match && match[1] && match[2] && match[3]) {
                errors.push({
                    file: match[1],
                    line: parseInt(match[2]),
                    message: match[3]
                });
            }
        }

        return errors;
    }

    /**
     * Parse ESLint output for structured results
     */
    private parseESLintOutput(
        output: string
    ): Array<{ message: string; file?: string; line?: number; severity: string }> {
        const results: Array<{ message: string; file?: string; line?: number; severity: string }> =
            [];

        try {
            // Try to parse as JSON first
            if (output.trim().startsWith('[') || output.trim().startsWith('{')) {
                const eslintResults = JSON.parse(output);

                if (Array.isArray(eslintResults)) {
                    for (const fileResult of eslintResults) {
                        if (fileResult.messages) {
                            for (const message of fileResult.messages) {
                                results.push({
                                    file: fileResult.filePath,
                                    line: message.line,
                                    message: message.message,
                                    severity: message.severity === 2 ? 'error' : 'warning'
                                });
                            }
                        }
                    }
                }
            } else {
                // Parse text output
                const lines = output.split('\n');
                for (const line of lines) {
                    const match = line.match(/^(.+?):(\d+):\d+:\s+(error|warning)\s+(.+)$/);
                    if (match && match[1] && match[2] && match[3] && match[4]) {
                        results.push({
                            file: match[1],
                            line: parseInt(match[2]),
                            severity: match[3],
                            message: match[4]
                        });
                    }
                }
            }
        } catch (error) {
            // Failed to parse, just scan as regular text
        }

        return results;
    }

    /**
     * Add a warning to the collection
     */
    private addWarning(warning: Warning): void {
        // Avoid duplicates
        const exists = this.detectedWarnings.some(
            w =>
                w.source === warning.source &&
                w.message === warning.message &&
                w.file === warning.file &&
                w.line === warning.line
        );

        if (!exists) {
            this.detectedWarnings.push(warning);
        }
    }

    /**
     * Add an error to the collection
     */
    private addError(error: Error): void {
        // Avoid duplicates
        const exists = this.detectedErrors.some(
            e =>
                e.source === error.source &&
                e.message === error.message &&
                e.file === error.file &&
                e.line === error.line
        );

        if (!exists) {
            this.detectedErrors.push(error);
        }
    }

    /**
     * Check if file exists
     */
    private async fileExists(filePath: string): Promise<boolean> {
        try {
            await fs.access(filePath);
            return true;
        } catch {
            return false;
        }
    }
}
