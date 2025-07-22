import { promises as fs } from 'fs';
import { join } from 'path';
import { gzipSync } from 'zlib';

interface ChunkAnalysis {
    name: string;
    size: number;
    gzipSize: number;
    modules: string[];
    recommendedSplit?: string;
}

interface BundleSizeReport {
    totalSize: number;
    totalGzipSize: number;
    chunks: ChunkAnalysis[];
    recommendations: string[];
}

export class BundleOptimizer {
    private readonly distDir: string;
    private readonly sizeThreshold: number;

    constructor(distDir = 'dist', sizeThreshold = 1000 * 1024) {
        // 1MB
        this.distDir = distDir;
        this.sizeThreshold = sizeThreshold;
    }

    async analyzeBundleSize(): Promise<BundleSizeReport> {
        const chunks = await this.analyzeChunks();
        const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
        const totalGzipSize = chunks.reduce((sum, chunk) => sum + chunk.gzipSize, 0);

        const recommendations = this.generateRecommendations(chunks);

        return {
            totalSize,
            totalGzipSize,
            chunks,
            recommendations
        };
    }

    private async analyzeChunks(): Promise<ChunkAnalysis[]> {
        const chunks: ChunkAnalysis[] = [];

        try {
            const assetsDir = join(this.distDir, 'assets');
            const files = await fs.readdir(assetsDir);

            for (const file of files) {
                if (file.endsWith('.js')) {
                    const filePath = join(assetsDir, file);
                    const content = await fs.readFile(filePath);
                    const gzipSize = gzipSync(content).length;

                    const chunkName = this.extractChunkName(file);
                    const modules = this.extractModuleNames(content.toString());

                    const recommendedSplit = this.getRecommendedSplit(chunkName, content.length);

                    chunks.push({
                        name: chunkName,
                        size: content.length,
                        gzipSize,
                        modules,
                        ...(recommendedSplit && { recommendedSplit })
                    });
                }
            }
        } catch (error) {
            console.error('Error analyzing chunks:', error);
        }

        return chunks.sort((a, b) => b.size - a.size);
    }

    private extractChunkName(filename: string): string {
        // Extract meaningful name from hash-based filename
        if (filename.includes('phaser')) return 'phaser';
        if (filename.includes('vendor')) return 'vendor';
        if (filename.includes('index')) return 'main';
        return filename.replace(/\.[a-f0-9]+\.js$/, '');
    }

    private extractModuleNames(content: string): string[] {
        const modules: string[] = [];

        // Look for common module patterns
        const modulePatterns = [
            /from\s+["']([^"']+)["']/g,
            /import\s*\(\s*["']([^"']+)["']/g,
            /require\s*\(\s*["']([^"']+)["']/g
        ];

        for (const pattern of modulePatterns) {
            let match;
            while ((match = pattern.exec(content)) !== null) {
                if (match[1] && !match[1].startsWith('.')) {
                    modules.push(match[1]);
                }
            }
        }

        return [...new Set(modules)].slice(0, 10); // Limit to top 10
    }

    private getRecommendedSplit(chunkName: string, size: number): string | undefined {
        if (size < this.sizeThreshold) return undefined;

        switch (chunkName) {
            case 'phaser':
                return 'Split Phaser into core, gameobjects, physics, and scene modules';
            case 'vendor':
                return 'Split vendor libraries by usage frequency';
            case 'main':
                return 'Move large components to dynamic imports';
            default:
                return 'Consider dynamic imports for this chunk';
        }
    }

    private generateRecommendations(chunks: ChunkAnalysis[]): string[] {
        const recommendations: string[] = [];

        const oversizedChunks = chunks.filter(chunk => chunk.size > this.sizeThreshold);

        if (oversizedChunks.length > 0) {
            recommendations.push(
                `${oversizedChunks.length} chunks exceed ${this.formatBytes(this.sizeThreshold)} limit`
            );

            for (const chunk of oversizedChunks) {
                if (chunk.recommendedSplit) {
                    recommendations.push(`${chunk.name}: ${chunk.recommendedSplit}`);
                }
            }
        }

        const totalSize = chunks.reduce((sum, chunk) => sum + chunk.size, 0);
        if (totalSize > 2 * 1024 * 1024) {
            // 2MB
            recommendations.push(
                'Consider implementing code splitting for initial load optimization'
            );
        }

        if (recommendations.length === 0) {
            recommendations.push('Bundle sizes are within optimal ranges');
        }

        return recommendations;
    }

    private formatBytes(bytes: number): string {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }

    async printReport(): Promise<void> {
        console.log('\n📊 Bundle Size Analysis Report\n');

        const report = await this.analyzeBundleSize();

        console.log(`📦 Total Bundle Size: ${this.formatBytes(report.totalSize)}`);
        console.log(`🗜️  Total Gzipped: ${this.formatBytes(report.totalGzipSize)}`);
        console.log(
            `📈 Compression Ratio: ${((1 - report.totalGzipSize / report.totalSize) * 100).toFixed(1)}%\n`
        );

        console.log('📋 Chunk Breakdown:');
        for (const chunk of report.chunks) {
            const sizeStatus = chunk.size > this.sizeThreshold ? '⚠️' : '✅';
            console.log(
                `  ${sizeStatus} ${chunk.name}: ${this.formatBytes(chunk.size)} (${this.formatBytes(chunk.gzipSize)} gzipped)`
            );

            if (chunk.modules.length > 0) {
                console.log(`     Modules: ${chunk.modules.join(', ')}`);
            }
        }

        if (report.recommendations.length > 0) {
            console.log('\n💡 Optimization Recommendations:');
            for (const recommendation of report.recommendations) {
                console.log(`  • ${recommendation}`);
            }
        }

        console.log('');
    }
}

// CLI execution
if (import.meta.url === `file://${process.argv[1]}`) {
    const analyzer = new BundleOptimizer();
    analyzer.printReport().catch(console.error);
}
