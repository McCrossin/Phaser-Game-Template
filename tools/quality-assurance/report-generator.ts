#!/usr/bin/env npx tsx
/**
 * Report Generator - Professional audit report generation system
 * Creates comprehensive audit reports in multiple formats
 */

import { existsSync, writeFileSync, mkdirSync } from 'fs';
import { join, dirname } from 'path';
import { fileURLToPath } from 'url';
import type { AuditReport, AuditResult, PrioritizedRecommendation } from './template-auditor.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const PROJECT_ROOT = join(__dirname, '../..');

export interface ReportGenerationOptions {
    formats: ('html' | 'json' | 'markdown' | 'console')[];
    outputDir: string;
    includeDetails: boolean;
    includeRecommendations: boolean;
    includeCharts: boolean;
}

export class ReportGenerator {
    private options: ReportGenerationOptions;

    constructor(options?: Partial<ReportGenerationOptions>) {
        this.options = {
            formats: ['html', 'json', 'markdown'],
            outputDir: join(PROJECT_ROOT, 'reports/quality-assurance'),
            includeDetails: true,
            includeRecommendations: true,
            includeCharts: true,
            ...options
        };
    }

    async generateReport(report: AuditReport): Promise<string[]> {
        this.log('📊 Generating audit reports...', 'info');

        // Ensure output directory exists
        if (!existsSync(this.options.outputDir)) {
            mkdirSync(this.options.outputDir, { recursive: true });
        }

        const generatedFiles: string[] = [];
        const timestamp = report.timestamp.toISOString().replace(/[:.]/g, '-').split('T')[0];
        const baseFilename = `template-audit-${timestamp}`;

        // Generate each requested format
        for (const format of this.options.formats) {
            try {
                const filename = await this.generateFormatReport(report, format, baseFilename);
                generatedFiles.push(filename);
                this.log(`✅ Generated ${format.toUpperCase()} report: ${filename}`, 'success');
            } catch (error) {
                this.log(
                    `❌ Failed to generate ${format} report: ${(error as Error).message}`,
                    'error'
                );
            }
        }

        return generatedFiles;
    }

    private async generateFormatReport(
        report: AuditReport,
        format: string,
        baseFilename: string
    ): Promise<string> {
        switch (format) {
            case 'html':
                return this.generateHtmlReport(report, `${baseFilename}.html`);
            case 'json':
                return this.generateJsonReport(report, `${baseFilename}.json`);
            case 'markdown':
                return this.generateMarkdownReport(report, `${baseFilename}.md`);
            case 'console':
                return this.generateConsoleReport(report);
            default:
                throw new Error(`Unsupported format: ${format}`);
        }
    }

    private generateHtmlReport(report: AuditReport, filename: string): string {
        const filePath = join(this.options.outputDir, filename);

        const html = `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Template Quality Audit Report</title>
    <style>
        ${this.getHtmlStyles()}
    </style>
</head>
<body>
    <div class="container">
        <header class="header">
            <h1>🎮 Phaser Game Template Quality Audit</h1>
            <div class="report-meta">
                <span class="timestamp">Generated: ${report.timestamp.toLocaleString()}</span>
                <span class="status ${report.passed ? 'passed' : 'failed'}">
                    ${report.passed ? '✅ PASSED' : '❌ FAILED'}
                </span>
            </div>
        </header>

        <section class="summary">
            <h2>📊 Executive Summary</h2>
            <div class="score-card">
                <div class="overall-score">
                    <div class="score-circle">
                        <span class="score-number">${report.percentage.toFixed(1)}%</span>
                        <span class="score-label">Overall Quality</span>
                    </div>
                </div>
                <div class="summary-stats">
                    <div class="stat">
                        <span class="stat-value">${report.summary.categoriesPassed}</span>
                        <span class="stat-label">Categories Passed</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${report.summary.totalCategories}</span>
                        <span class="stat-label">Total Categories</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${report.summary.criticalIssues}</span>
                        <span class="stat-label">Critical Issues</span>
                    </div>
                    <div class="stat">
                        <span class="stat-value">${(report.summary.executionTime / 1000).toFixed(1)}s</span>
                        <span class="stat-label">Execution Time</span>
                    </div>
                </div>
            </div>
        </section>

        <section class="categories">
            <h2>📋 Category Results</h2>
            ${this.generateCategoryResultsHtml(report.categoryResults)}
        </section>

        ${this.options.includeRecommendations ? this.generateRecommendationsHtml(report.recommendations) : ''}

        <footer class="footer">
            <p>Generated by Phaser Game Template Quality Assurance System</p>
            <p>Report ID: ${filename}</p>
        </footer>
    </div>
</body>
</html>`;

        writeFileSync(filePath, html);
        return filename;
    }

    private generateJsonReport(report: AuditReport, filename: string): string {
        const filePath = join(this.options.outputDir, filename);
        writeFileSync(filePath, JSON.stringify(report, null, 2));
        return filename;
    }

    private generateMarkdownReport(report: AuditReport, filename: string): string {
        const filePath = join(this.options.outputDir, filename);

        const markdown = `# 🎮 Phaser Game Template Quality Audit Report

**Generated:** ${report.timestamp.toLocaleString()}  
**Status:** ${report.passed ? '✅ PASSED' : '❌ FAILED'}  
**Overall Score:** ${report.percentage.toFixed(1)}%

## 📊 Executive Summary

| Metric | Value |
|--------|-------|
| Overall Quality Score | ${report.percentage.toFixed(1)}% |
| Categories Passed | ${report.summary.categoriesPassed}/${report.summary.totalCategories} |
| Critical Issues | ${report.summary.criticalIssues} |
| Warnings | ${report.summary.warnings} |
| Execution Time | ${(report.summary.executionTime / 1000).toFixed(1)}s |

## 📋 Category Results

${this.generateCategoryResultsMarkdown(report.categoryResults)}

${this.options.includeRecommendations ? this.generateRecommendationsMarkdown(report.recommendations) : ''}

## 📈 Quality Trend

${this.getQualityLevelDescription(report.percentage)}

---

*Generated by Phaser Game Template Quality Assurance System*  
*Report ID: ${filename}*
`;

        writeFileSync(filePath, markdown);
        return filename;
    }

    private generateConsoleReport(report: AuditReport): string {
        console.log('\n' + '='.repeat(80));
        console.log('🎮 PHASER GAME TEMPLATE QUALITY AUDIT REPORT');
        console.log('='.repeat(80));

        console.log(`\n📊 EXECUTIVE SUMMARY`);
        console.log(`Generated: ${report.timestamp.toLocaleString()}`);
        console.log(`Status: ${report.passed ? '✅ PASSED' : '❌ FAILED'}`);
        console.log(`Overall Score: ${report.percentage.toFixed(1)}%`);
        console.log(
            `Categories Passed: ${report.summary.categoriesPassed}/${report.summary.totalCategories}`
        );
        console.log(`Critical Issues: ${report.summary.criticalIssues}`);
        console.log(`Execution Time: ${(report.summary.executionTime / 1000).toFixed(1)}s`);

        console.log(`\n📋 CATEGORY RESULTS`);
        for (const result of report.categoryResults) {
            const status = result.passed ? '✅' : '❌';
            console.log(
                `${status} ${result.category}: ${result.percentage.toFixed(1)}% (${result.score}/${result.maxScore})`
            );

            if (this.options.includeDetails && result.findings.length > 0) {
                for (const finding of result.findings.slice(0, 3)) {
                    const icon =
                        finding.type === 'error' ? '❌' : finding.type === 'warning' ? '⚠️' : 'ℹ️';
                    console.log(`  ${icon} ${finding.message}`);
                }
                if (result.findings.length > 3) {
                    console.log(`  ... and ${result.findings.length - 3} more issues`);
                }
            }
        }

        if (this.options.includeRecommendations && report.recommendations.length > 0) {
            console.log(`\n🔧 TOP RECOMMENDATIONS`);
            for (const rec of report.recommendations.slice(0, 5)) {
                console.log(`${rec.priority.toUpperCase()}: ${rec.description}`);
                console.log(`  Action: ${rec.action}`);
                console.log(`  Effort: ${rec.effort}, Impact: ${rec.impact}`);
                console.log('');
            }
        }

        console.log('='.repeat(80));
        return 'console-output';
    }

    private generateCategoryResultsHtml(results: AuditResult[]): string {
        return results
            .map(
                result => `
            <div class="category-result ${result.passed ? 'passed' : 'failed'}">
                <div class="category-header">
                    <h3>${result.passed ? '✅' : '❌'} ${result.category}</h3>
                    <div class="category-score">
                        <span class="score">${result.percentage.toFixed(1)}%</span>
                        <span class="details">(${result.score}/${result.maxScore})</span>
                    </div>
                </div>
                ${
                    this.options.includeDetails && result.findings.length > 0
                        ? `
                    <div class="findings">
                        <h4>Findings:</h4>
                        <ul>
                            ${result.findings
                                .map(
                                    finding => `
                                <li class="${finding.type} ${finding.severity}">
                                    <span class="finding-icon">${this.getFindingIcon(finding.type)}</span>
                                    ${finding.message}
                                    ${finding.file ? `<span class="file-ref">${finding.file}</span>` : ''}
                                </li>
                            `
                                )
                                .join('')}
                        </ul>
                    </div>
                `
                        : ''
                }
            </div>
        `
            )
            .join('');
    }

    private generateCategoryResultsMarkdown(results: AuditResult[]): string {
        return results
            .map(
                result => `
### ${result.passed ? '✅' : '❌'} ${result.category}

**Score:** ${result.percentage.toFixed(1)}% (${result.score}/${result.maxScore})

${
    this.options.includeDetails && result.findings.length > 0
        ? `
**Findings:**
${result.findings
    .map(
        finding =>
            `- ${this.getFindingIcon(finding.type)} **${finding.severity.toUpperCase()}**: ${finding.message}${finding.file ? ` (${finding.file})` : ''}`
    )
    .join('\n')}
`
        : ''
}
        `
            )
            .join('\n');
    }

    private generateRecommendationsHtml(recommendations: PrioritizedRecommendation[]): string {
        if (recommendations.length === 0) return '';

        return `
        <section class="recommendations">
            <h2>🔧 Prioritized Recommendations</h2>
            <div class="recommendation-list">
                ${recommendations
                    .slice(0, 10)
                    .map(
                        (rec, index) => `
                    <div class="recommendation ${rec.priority}">
                        <div class="rec-header">
                            <span class="rec-number">${index + 1}</span>
                            <span class="rec-title">${rec.description}</span>
                            <span class="rec-priority ${rec.priority}">${rec.priority.toUpperCase()}</span>
                        </div>
                        <div class="rec-details">
                            <p><strong>Action:</strong> ${rec.action}</p>
                            <div class="rec-meta">
                                <span class="effort">Effort: ${rec.effort}</span>
                                <span class="impact">Impact: ${rec.impact}</span>
                                <span class="time">Est. ${rec.implementationTime}h</span>
                            </div>
                        </div>
                    </div>
                `
                    )
                    .join('')}
            </div>
        </section>`;
    }

    private generateRecommendationsMarkdown(recommendations: PrioritizedRecommendation[]): string {
        if (recommendations.length === 0) return '';

        return `
## 🔧 Prioritized Recommendations

${recommendations
    .slice(0, 10)
    .map(
        (rec, index) => `
### ${index + 1}. ${rec.description} (${rec.priority.toUpperCase()} Priority)

**Action:** ${rec.action}  
**Effort:** ${rec.effort} | **Impact:** ${rec.impact} | **Est. Time:** ${rec.implementationTime}h
`
    )
    .join('\n')}`;
    }

    private getQualityLevelDescription(percentage: number): string {
        if (percentage >= 96) {
            return '🌟 **Excellent Quality** - This template exceeds industry standards and demonstrates best practices.';
        } else if (percentage >= 92) {
            return '✨ **Professional Quality** - This template meets professional development standards.';
        } else if (percentage >= 88) {
            return '👍 **Acceptable Quality** - This template meets minimum quality requirements.';
        } else {
            return '⚠️ **Needs Improvement** - This template requires significant quality improvements before use.';
        }
    }

    private getFindingIcon(type: string): string {
        switch (type) {
            case 'error':
                return '❌';
            case 'warning':
                return '⚠️';
            case 'info':
                return 'ℹ️';
            default:
                return '•';
        }
    }

    private getHtmlStyles(): string {
        return `
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f7fa;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
        }

        .header {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 30px;
            text-align: center;
        }

        .header h1 {
            color: #2c3e50;
            margin-bottom: 15px;
            font-size: 2.5em;
        }

        .report-meta {
            display: flex;
            justify-content: center;
            gap: 20px;
            align-items: center;
        }

        .status.passed { color: #27ae60; font-weight: bold; }
        .status.failed { color: #e74c3c; font-weight: bold; }

        .summary {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }

        .score-card {
            display: flex;
            align-items: center;
            gap: 40px;
        }

        .overall-score {
            flex-shrink: 0;
        }

        .score-circle {
            width: 120px;
            height: 120px;
            border-radius: 50%;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;
            color: white;
        }

        .score-number {
            font-size: 1.8em;
            font-weight: bold;
        }

        .score-label {
            font-size: 0.8em;
            opacity: 0.9;
        }

        .summary-stats {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
            gap: 20px;
            flex: 1;
        }

        .stat {
            text-align: center;
            padding: 15px;
            background: #f8f9fa;
            border-radius: 8px;
        }

        .stat-value {
            display: block;
            font-size: 1.5em;
            font-weight: bold;
            color: #2c3e50;
        }

        .stat-label {
            font-size: 0.9em;
            color: #666;
        }

        .categories {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }

        .category-result {
            border: 1px solid #e1e8ed;
            border-radius: 8px;
            margin-bottom: 20px;
            overflow: hidden;
        }

        .category-result.passed {
            border-left: 4px solid #27ae60;
        }

        .category-result.failed {
            border-left: 4px solid #e74c3c;
        }

        .category-header {
            display: flex;
            justify-content: space-between;
            align-items: center;
            padding: 20px;
            background: #f8f9fa;
        }

        .category-header h3 {
            color: #2c3e50;
            margin: 0;
        }

        .category-score {
            text-align: right;
        }

        .score {
            font-size: 1.2em;
            font-weight: bold;
            color: #2c3e50;
        }

        .details {
            color: #666;
            font-size: 0.9em;
        }

        .findings {
            padding: 20px;
            border-top: 1px solid #e1e8ed;
        }

        .findings h4 {
            margin-bottom: 10px;
            color: #2c3e50;
        }

        .findings ul {
            list-style: none;
        }

        .findings li {
            padding: 8px 0;
            border-bottom: 1px solid #f0f0f0;
        }

        .findings li:last-child {
            border-bottom: none;
        }

        .finding-icon {
            margin-right: 8px;
        }

        .file-ref {
            color: #666;
            font-size: 0.9em;
            margin-left: 10px;
        }

        .recommendations {
            background: white;
            padding: 30px;
            border-radius: 12px;
            box-shadow: 0 2px 8px rgba(0,0,0,0.1);
            margin-bottom: 30px;
        }

        .recommendation {
            border: 1px solid #e1e8ed;
            border-radius: 8px;
            margin-bottom: 15px;
            overflow: hidden;
        }

        .recommendation.high {
            border-left: 4px solid #e74c3c;
        }

        .recommendation.medium {
            border-left: 4px solid #f39c12;
        }

        .recommendation.low {
            border-left: 4px solid #3498db;
        }

        .rec-header {
            display: flex;
            align-items: center;
            gap: 15px;
            padding: 15px 20px;
            background: #f8f9fa;
        }

        .rec-number {
            background: #2c3e50;
            color: white;
            width: 24px;
            height: 24px;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 0.9em;
            font-weight: bold;
        }

        .rec-title {
            flex: 1;
            font-weight: 600;
            color: #2c3e50;
        }

        .rec-priority {
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 0.8em;
            font-weight: bold;
            text-transform: uppercase;
        }

        .rec-priority.high {
            background: #e74c3c;
            color: white;
        }

        .rec-priority.medium {
            background: #f39c12;
            color: white;
        }

        .rec-priority.low {
            background: #3498db;
            color: white;
        }

        .rec-details {
            padding: 20px;
        }

        .rec-meta {
            display: flex;
            gap: 20px;
            margin-top: 10px;
            font-size: 0.9em;
            color: #666;
        }

        .footer {
            text-align: center;
            padding: 30px;
            color: #666;
            border-top: 1px solid #e1e8ed;
            margin-top: 30px;
        }

        h2 {
            color: #2c3e50;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #3498db;
        }

        @media (max-width: 768px) {
            .container {
                padding: 10px;
            }
            
            .score-card {
                flex-direction: column;
                text-align: center;
            }
            
            .summary-stats {
                grid-template-columns: repeat(2, 1fr);
            }
            
            .rec-header {
                flex-wrap: wrap;
            }
        }
        `;
    }

    private log(message: string, type: 'info' | 'success' | 'warning' | 'error' = 'info'): void {
        const colors = {
            info: '\x1b[36m', // Cyan
            success: '\x1b[32m', // Green
            warning: '\x1b[33m', // Yellow
            error: '\x1b[31m', // Red
            reset: '\x1b[0m' // Reset
        };

        const prefix = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };

        const timestamp = new Date().toISOString().substr(11, 8);
        console.log(`${colors[type]}${prefix[type]} [${timestamp}] ${message}${colors.reset}`);
    }
}
