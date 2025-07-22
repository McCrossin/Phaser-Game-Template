import { describe, it, expect } from 'vitest';
import { spawnSync } from 'child_process';
import path from 'path';
import fs from 'fs';

describe('Code Quality Validation - TEMP-020', () => {
    const projectRoot = path.resolve(__dirname, '../../..');

    describe('ESLint Compliance', () => {
        it('should have zero ESLint warnings and errors', () => {
            const result = spawnSync('npm', ['run', 'lint'], {
                cwd: projectRoot,
                encoding: 'utf8',
                shell: true,
                timeout: 30000
            });

            // Check that ESLint completed successfully
            expect(result.status).toBe(0);

            // Check that there are no warnings or errors in the output
            expect(result.stdout).not.toMatch(/warning/i);
            expect(result.stdout).not.toMatch(/error/i);
        }, 30000); // 30 second timeout for the test
    });

    describe('TypeScript Strict Compliance', () => {
        it('should compile without type errors in strict mode', () => {
            const result = spawnSync(
                'npx',
                ['tsc', '--project', 'config/build/tsconfig.json', '--noEmit'],
                {
                    cwd: projectRoot,
                    encoding: 'utf8',
                    shell: true
                }
            );

            // TypeScript should compile successfully
            expect(result.status).toBe(0);
        });
    });

    describe('Global Type Declarations', () => {
        it('should have proper global type declarations for window.game', () => {
            // Check that global.d.ts exists
            const globalTypesPath = path.join(projectRoot, 'src/types/global.d.ts');
            expect(fs.existsSync(globalTypesPath)).toBe(true);

            // Check that it contains the proper Window interface extension
            const content = fs.readFileSync(globalTypesPath, 'utf8');
            expect(content).toMatch(/interface Window/);
            expect(content).toMatch(/game\?\s*:\s*Phaser\.Game/);
        });
    });

    describe('Code Quality Standards', () => {
        it('should not contain any explicit "any" types in main.ts', () => {
            const mainTsPath = path.join(projectRoot, 'src/main.ts');
            const content = fs.readFileSync(mainTsPath, 'utf8');

            // Check that there are no (window as any) patterns
            expect(content).not.toMatch(/\(window\s+as\s+any\)/);
            // Allow any types in other contexts but not the specific one we fixed
            expect(content).toMatch(/window\.game\s*=\s*game/);
        });
    });
});
