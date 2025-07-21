/**
 * Technical Debt Tracker - Automated technical debt detection and analysis
 * Part of SETUP-006 Project Health & Documentation Enhancement
 */

import { promises as fs } from 'fs';
import path from 'path';

interface DebtPattern {
    name: string;
    pattern: RegExp;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'code-quality' | 'performance' | 'security' | 'maintainability' | 'documentation';
    description: string;
    suggestion: string;
}

interface DebtItem {
    file: string;
    line: number;
    column: number;
    pattern: string;
    severity: 'low' | 'medium' | 'high' | 'critical';
    category: 'code-quality' | 'performance' | 'security' | 'maintainability' | 'documentation';
    description: string;
    suggestion: string;
    context: string;
}

interface DebtReport {
    timestamp: string;
    summary: {
        totalItems: number;
        bySeverity: Record<string, number>;
        byCategory: Record<string, number>;
        filesScanned: number;
        projectHealth: 'excellent' | 'good' | 'needs-attention' | 'critical';
    };
    items: DebtItem[];
    recommendations: string[];
}

class TechnicalDebtTracker {
    private patterns: DebtPattern[];
    private projectRoot: string;
    private excludePatterns: RegExp[];

    constructor(projectRoot: string = process.cwd()) {
        this.projectRoot = projectRoot;
        this.excludePatterns = [
            /node_modules/,
            /\.git/,
            /dist/,
            /build/,
            /coverage/,
            /\.next/,
            /\.nuxt/,
            /\.cache/,
            /playwright-report/,
            /test-results/,
            /\.vscode/,
            /\.idea/,
            /tools\/monitoring\/compiled/,
            /reports\/health/,
            /docs\/api/,
            /docs\/.*\.js$/
        ];

        this.patterns = [
            // Code Quality Patterns
            {
                name: 'TODO Comments',
                pattern: /\/\/ TODO[:\s]*(.*)|\/\* TODO[:\s]*(.*?)\*\//gi,
                severity: 'low',
                category: 'maintainability',
                description: 'TODO comments indicate incomplete work',
                suggestion: 'Create proper issues for TODOs and remove comments'
            },
            {
                name: 'FIXME Comments',
                pattern: /\/\/ FIXME[:\s]*(.*)|\/\* FIXME[:\s]*(.*?)\*\//gi,
                severity: 'medium',
                category: 'code-quality',
                description: 'FIXME comments indicate broken or problematic code',
                suggestion: 'Fix the identified issues and remove FIXME comments'
            },
            {
                name: 'HACK Comments',
                pattern: /\/\/ HACK[:\s]*(.*)|\/\* HACK[:\s]*(.*?)\*\//gi,
                severity: 'high',
                category: 'maintainability',
                description: 'HACK comments indicate non-standard solutions',
                suggestion: 'Refactor hacks into proper implementations'
            },
            {
                name: 'Console Statements',
                pattern: /console\.(log|debug|info|warn|error)\s*\(/gi,
                severity: 'medium',
                category: 'code-quality',
                description: 'Console statements should not be in production code',
                suggestion: 'Replace with proper logging or remove debug statements'
            },
            {
                name: 'Debugger Statements',
                pattern: /debugger\s*;/gi,
                severity: 'high',
                category: 'code-quality',
                description: 'Debugger statements will cause issues in production',
                suggestion: 'Remove debugger statements before deployment'
            },
            {
                name: 'Magic Numbers',
                pattern: /(?<![a-zA-Z_$])[0-9]{3,}(?![a-zA-Z_$])/g,
                severity: 'low',
                category: 'maintainability',
                description: 'Large numeric literals should be named constants',
                suggestion: 'Extract magic numbers into named constants'
            },
            {
                name: 'Any Type Usage',
                pattern: /:\s*any\b/g,
                severity: 'medium',
                category: 'code-quality',
                description: 'Using "any" type defeats TypeScript type safety',
                suggestion: 'Replace "any" with specific types or proper interfaces'
            },
            {
                name: 'Suppressed TypeScript Errors',
                pattern: /@ts-ignore|@ts-expect-error/g,
                severity: 'medium',
                category: 'code-quality',
                description: 'TypeScript error suppression should be used sparingly',
                suggestion: 'Fix underlying type issues instead of suppressing errors'
            },

            // Performance Patterns
            {
                name: 'Synchronous File Operations',
                pattern: /fs\.readFileSync|fs\.writeFileSync|fs\.existsSync/g,
                severity: 'medium',
                category: 'performance',
                description: 'Synchronous file operations block the event loop',
                suggestion: 'Use asynchronous file operations (fs.promises or async/await)'
            },
            {
                name: 'Nested Loops',
                pattern: /for\s*\([^}]*\{[^}]*for\s*\(/gs,
                severity: 'low',
                category: 'performance',
                description: 'Nested loops can cause performance issues with large datasets',
                suggestion: 'Consider algorithm optimization or data structure changes'
            },

            // Security Patterns
            {
                name: 'Hardcoded Credentials',
                pattern:
                    /(password|secret|api[_-]?key|auth[_-]?token|access[_-]?token)\s*[:=]\s*['"][^'"]+['"]/gi,
                severity: 'critical',
                category: 'security',
                description: 'Hardcoded credentials are a security risk',
                suggestion: 'Move credentials to environment variables or secure configuration'
            },
            {
                name: 'Eval Usage',
                pattern: /\beval\s*\(/g,
                severity: 'critical',
                category: 'security',
                description: 'Dynamic code execution can be a security risk',
                suggestion:
                    'Avoid dynamic execution and use safer alternatives like JSON.parse() or proper parsing'
            },

            // Documentation Patterns
            {
                name: 'Missing Function Documentation',
                pattern:
                    /^(?!\s*\/\*\*|\s*\/\/).*function\s+\w+\s*\(|^(?!\s*\/\*\*|\s*\/\/).*const\s+\w+\s*=\s*\(/gm,
                severity: 'low',
                category: 'documentation',
                description: 'Public functions should have documentation',
                suggestion: 'Add JSDoc comments to document function purpose and parameters'
            },

            // Maintainability Patterns
            {
                name: 'Long Parameter Lists',
                pattern: /\([^)]*,\s*[^)]*,\s*[^)]*,\s*[^)]*,\s*[^)]*,/g,
                severity: 'medium',
                category: 'maintainability',
                description: 'Functions with many parameters are hard to maintain',
                suggestion: 'Use object parameters or break into smaller functions'
            },
            {
                name: 'Deep Nesting',
                pattern: /\s{16,}\w/g,
                severity: 'medium',
                category: 'maintainability',
                description: 'Deeply nested code is hard to read and maintain',
                suggestion: 'Extract nested logic into separate functions or early returns'
            },
            {
                name: 'Unused Imports',
                pattern: /^import\s+(?:{[^}]*}|\w+)\s+from\s+['"][^'"]+['"];?\s*$/gm,
                severity: 'low',
                category: 'code-quality',
                description: 'Unused imports add unnecessary bloat',
                suggestion: 'Remove unused imports to keep code clean'
            }
        ];
    }

    private async getAllFiles(
        dir: string,
        extensions: string[] = ['.ts', '.tsx', '.js', '.jsx']
    ): Promise<string[]> {
        const files: string[] = [];

        const entries = await fs.readdir(dir, { withFileTypes: true });

        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);

            // Skip excluded directories
            const relativePath = path.relative(this.projectRoot, fullPath);
            if (this.excludePatterns.some(pattern => pattern.test(relativePath))) {
                continue;
            }

            if (entry.isDirectory()) {
                files.push(...(await this.getAllFiles(fullPath, extensions)));
            } else if (entry.isFile() && extensions.some(ext => entry.name.endsWith(ext))) {
                files.push(fullPath);
            }
        }

        return files;
    }

    private async analyzeFile(filePath: string): Promise<DebtItem[]> {
        const items: DebtItem[] = [];

        try {
            const content = await fs.readFile(filePath, 'utf-8');
            const lines = content.split('\n');

            for (const pattern of this.patterns) {
                let match: RegExpExecArray | null;

                // Reset regex state for global patterns
                pattern.pattern.lastIndex = 0;

                while ((match = pattern.pattern.exec(content)) !== null) {
                    // Find line and column
                    const beforeMatch = content.substring(0, match.index);
                    const lineNumber = beforeMatch.split('\n').length;
                    const lineStart = beforeMatch.lastIndexOf('\n') + 1;
                    const column = match.index - lineStart + 1;

                    // Get context (the line where the match was found)
                    const context = lines[lineNumber - 1]?.trim() || '';

                    // Skip false positives for certain patterns
                    if (this.isValidMatch(pattern, match, context, filePath)) {
                        items.push({
                            file: path.relative(this.projectRoot, filePath),
                            line: lineNumber,
                            column,
                            pattern: pattern.name,
                            severity: pattern.severity,
                            category: pattern.category,
                            description: pattern.description,
                            suggestion: pattern.suggestion,
                            context: context.substring(0, 100) // Limit context length
                        });
                    }

                    // Prevent infinite loops with non-global patterns
                    if (!pattern.pattern.global) {
                        break;
                    }
                }
            }
        } catch (error) {
            console.warn(
                `Warning: Could not analyze file ${filePath}:`,
                error instanceof Error ? error.message : 'Unknown error'
            );
        }

        return items;
    }

    private isValidMatch(
        pattern: DebtPattern,
        match: RegExpExecArray,
        context: string,
        filePath: string
    ): boolean {
        // Skip certain false positives
        switch (pattern.name) {
            case 'Magic Numbers':
                // Skip version numbers, common constants, etc.
                return !/(version|port|timeout|delay|width|height|size)/i.test(context);

            case 'Any Type Usage':
                // Skip ECS patterns and constructor types
                if (/new\s*\(.*args:\s*any\[\]/.test(context) || /constructor.*any/.test(context)) {
                    return false;
                }
                return true;

            case 'Console Statements':
                // Skip if in test files, development tools, debug/config files
                if (/test|spec|\.test\.|\.spec\.|development|debug|config|Debug/i.test(context)) {
                    return false;
                }
                // Skip console statements in specific file types
                if (/config|debug|development|example|demo/i.test(filePath)) {
                    return false;
                }
                return true;

            case 'Deep Nesting':
                // Skip configuration objects, interfaces, and type definitions
                if (context.includes(':') && (context.includes('{') || context.includes(';'))) {
                    return false; // Likely a config object or interface property
                }
                if (/^[\s]*[\w]+:\s*[\w\[\{]/.test(context)) {
                    return false; // Object property definition
                }
                if (/interface|type|export/.test(context)) {
                    return false; // Type definitions
                }
                // Skip deep nesting in configuration files
                if (/config|types|interfaces|\.d\.ts$/i.test(filePath)) {
                    return false;
                }
                return true;

            case 'Long Parameter Lists':
                // Skip function type definitions and interfaces
                if (/interface|type|declare/i.test(context)) {
                    return false;
                }
                // Skip generated or example files
                if (/generated|example|demo|\.d\.ts$/i.test(filePath)) {
                    return false;
                }
                return true;

            case 'Missing Function Documentation':
                // Skip test functions, private functions, and very simple functions
                if (/test|spec|private|_/i.test(context) || context.length < 50) {
                    return false;
                }
                return true;

            case 'Unused Imports':
                // This would need more sophisticated analysis to determine if import is actually used
                // For now, we'll be permissive and only flag obvious cases
                return false; // Disable this check for now as it needs more sophisticated analysis

            default:
                return true;
        }
    }

    private generateRecommendations(items: DebtItem[]): string[] {
        const recommendations: string[] = [];
        const severityCounts = items.reduce(
            (acc, item) => {
                acc[item.severity] = (acc[item.severity] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>
        );

        if (severityCounts.critical > 0) {
            recommendations.push(
                `🚨 CRITICAL: Address ${severityCounts.critical} critical security/quality issues immediately`
            );
        }

        if (severityCounts.high > 0) {
            recommendations.push(
                `🔴 HIGH: Fix ${severityCounts.high} high-priority issues before next release`
            );
        }

        if (severityCounts.medium > 5) {
            recommendations.push(
                `🟡 MEDIUM: Consider refactoring to address ${severityCounts.medium} medium-priority issues`
            );
        }

        if (severityCounts.low > 10) {
            recommendations.push(
                `🟢 LOW: Schedule cleanup for ${severityCounts.low} low-priority maintenance items`
            );
        }

        if (items.length === 0) {
            recommendations.push('🎉 Excellent! No technical debt patterns detected');
        } else if (items.length < 10) {
            recommendations.push('✅ Good code quality - manageable amount of technical debt');
        } else if (items.length < 25) {
            recommendations.push(
                '⚠️ Moderate technical debt - consider addressing in upcoming sprints'
            );
        } else {
            recommendations.push('🔴 High technical debt - prioritize cleanup efforts');
        }

        return recommendations;
    }

    private calculateProjectHealth(
        items: DebtItem[]
    ): 'excellent' | 'good' | 'needs-attention' | 'critical' {
        const criticalCount = items.filter(i => i.severity === 'critical').length;
        const highCount = items.filter(i => i.severity === 'high').length;
        const totalCount = items.length;

        if (criticalCount > 0) return 'critical';
        if (highCount > 3 || totalCount > 50) return 'needs-attention';
        if (totalCount > 20) return 'good';
        return 'excellent';
    }

    async generateReport(): Promise<DebtReport> {
        console.log('🔍 Scanning for technical debt patterns...');

        const files = await this.getAllFiles(this.projectRoot);
        console.log(`📁 Found ${files.length} files to analyze`);

        const allItems: DebtItem[] = [];

        for (const file of files) {
            const items = await this.analyzeFile(file);
            allItems.push(...items);
        }

        // Calculate summary statistics
        const bySeverity = allItems.reduce(
            (acc, item) => {
                acc[item.severity] = (acc[item.severity] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>
        );

        const byCategory = allItems.reduce(
            (acc, item) => {
                acc[item.category] = (acc[item.category] || 0) + 1;
                return acc;
            },
            {} as Record<string, number>
        );

        const report: DebtReport = {
            timestamp: new Date().toISOString(),
            summary: {
                totalItems: allItems.length,
                bySeverity,
                byCategory,
                filesScanned: files.length,
                projectHealth: this.calculateProjectHealth(allItems)
            },
            items: allItems.sort((a, b) => {
                // Sort by severity (critical > high > medium > low)
                const severityOrder = { critical: 4, high: 3, medium: 2, low: 1 };
                return severityOrder[b.severity] - severityOrder[a.severity];
            }),
            recommendations: this.generateRecommendations(allItems)
        };

        return report;
    }

    async run(): Promise<void> {
        try {
            const report = await this.generateReport();

            console.log('\n' + '='.repeat(60));
            console.log('🏗️ TECHNICAL DEBT ANALYSIS REPORT');
            console.log('='.repeat(60));
            console.log(`📅 Generated: ${new Date(report.timestamp).toLocaleString()}`);
            console.log(`📊 Found ${report.summary.totalItems} technical debt items`);
            console.log(`📁 Scanned ${report.summary.filesScanned} files`);
            console.log(`🎯 Project Health: ${report.summary.projectHealth.toUpperCase()}`);
            console.log('');

            // Severity breakdown
            console.log('📈 SEVERITY BREAKDOWN:');
            const severityEmojis = { critical: '🚨', high: '🔴', medium: '🟡', low: '🟢' };
            for (const [severity, count] of Object.entries(report.summary.bySeverity)) {
                const emoji = severityEmojis[severity as keyof typeof severityEmojis] || '📌';
                console.log(`   ${emoji} ${severity.toUpperCase()}: ${count}`);
            }
            console.log('');

            // Category breakdown
            console.log('🗂️ CATEGORY BREAKDOWN:');
            for (const [category, count] of Object.entries(report.summary.byCategory)) {
                console.log(`   📌 ${category}: ${count}`);
            }
            console.log('');

            // Recommendations
            console.log('💡 RECOMMENDATIONS:');
            for (const recommendation of report.recommendations) {
                console.log(`   ${recommendation}`);
            }
            console.log('');

            // Top issues (first 10)
            if (report.items.length > 0) {
                console.log('🔍 TOP ISSUES TO ADDRESS:');
                const topItems = report.items.slice(0, 10);
                for (const item of topItems) {
                    const severityEmoji = severityEmojis[item.severity] || '📌';
                    console.log(`   ${severityEmoji} ${item.file}:${item.line} - ${item.pattern}`);
                    console.log(`      💬 ${item.description}`);
                    console.log(`      💡 ${item.suggestion}`);
                    console.log(`      📝 Context: ${item.context}`);
                    console.log('');
                }

                if (report.items.length > 10) {
                    console.log(`   ... and ${report.items.length - 10} more items`);
                    console.log('');
                }
            }

            console.log('='.repeat(60));

            // Write detailed JSON report
            const reportPath = path.join(this.projectRoot, 'technical-debt-report.json');
            await fs.writeFile(reportPath, JSON.stringify(report, null, 2));
            console.log(`📄 Detailed report saved to: ${reportPath}`);

            // Exit with appropriate code based on health
            const exitCode = report.summary.projectHealth === 'critical' ? 1 : 0;
            process.exit(exitCode);
        } catch (error) {
            console.error('❌ Technical debt analysis failed:', error);
            process.exit(1);
        }
    }
}

// Run if called directly
if (import.meta.url === `file://${process.argv[1]}`) {
    const tracker = new TechnicalDebtTracker();
    tracker.run();
}

export { TechnicalDebtTracker, type DebtReport, type DebtItem };
