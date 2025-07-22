import { describe, it, expect } from 'vitest';
import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

/**
 * Template Cleanup Validation Tests
 * Ensures the template is completely generic and free of game-specific references
 */
describe('Template Content Cleanup', () => {
    const projectRoot = path.resolve(__dirname, '../..');

    it('should have no New-Eden references in source code', () => {
        try {
            // Search for New-Eden references in source files
            const result = execSync(
                'grep -r --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=testing --exclude="*.md" --exclude="cleanup-game-references.sh" "New-Eden\\|new-eden\\|NEW_EDEN" .',
                { cwd: projectRoot, encoding: 'utf8' }
            );

            // If grep finds matches, it will return them, which should fail the test
            expect(result.trim()).toBe('');
        } catch (error: any) {
            // grep returns exit code 1 when no matches are found, which is what we want
            if (error.status === 1) {
                // No matches found - test passes
                expect(true).toBe(true);
            } else {
                // Some other error occurred
                throw error;
            }
        }
    });

    it('should have template variables configuration', () => {
        const templateVarsPath = path.join(projectRoot, 'config', 'template-variables.json');
        expect(fs.existsSync(templateVarsPath)).toBe(true);

        const templateVars = JSON.parse(fs.readFileSync(templateVarsPath, 'utf8'));
        expect(templateVars).toHaveProperty('template');
        expect(templateVars).toHaveProperty('game');
        expect(templateVars).toHaveProperty('developer');
        expect(templateVars).toHaveProperty('replacements');
    });

    it('should have cleanup script available', () => {
        const cleanupScriptPath = path.join(projectRoot, 'scripts', 'cleanup-game-references.sh');
        expect(fs.existsSync(cleanupScriptPath)).toBe(true);

        // Check if script is executable
        const stats = fs.statSync(cleanupScriptPath);
        expect(stats.mode & parseInt('111', 8)).toBeGreaterThan(0); // Check execute permissions
    });

    it('should have generic package.json configuration', () => {
        const packageJsonPath = path.join(projectRoot, 'package.json');
        expect(fs.existsSync(packageJsonPath)).toBe(true);

        const packageJson = JSON.parse(fs.readFileSync(packageJsonPath, 'utf8'));
        expect(packageJson.name).toBe('phaser-game-template');
        expect(packageJson.name).not.toContain('new-eden');
        expect(packageJson.name).not.toContain('New-Eden');
    });

    it('should not have New-Eden backup files', () => {
        const backupFiles = ['README-NEW-EDEN-BACKUP.md', 'backup-*/README-NEW-EDEN-BACKUP.md'];

        backupFiles.forEach(pattern => {
            try {
                const result = execSync(`find . -name "${pattern}" -type f`, {
                    cwd: projectRoot,
                    encoding: 'utf8'
                });
                expect(result.trim()).toBe('');
            } catch (error: any) {
                // find returns exit code 1 when no matches are found, which is what we want
                if (error.status !== 1) {
                    throw error;
                }
            }
        });
    });

    it('should have generic template structure', () => {
        // Check that essential template files exist
        const essentialFiles = [
            'package.json',
            'index.html',
            'src/main.ts',
            'config/template-variables.json'
        ];

        essentialFiles.forEach(file => {
            const filePath = path.join(projectRoot, file);
            expect(fs.existsSync(filePath)).toBe(true);
        });
    });

    it('should support easy customization through template variables', () => {
        const templateVarsPath = path.join(projectRoot, 'config', 'template-variables.json');
        const templateVars = JSON.parse(fs.readFileSync(templateVarsPath, 'utf8'));

        // Verify template variables provide clear customization points
        expect(templateVars.game.name).toBe('YourGame');
        expect(templateVars.game.title).toBe('Your Game Title');
        expect(templateVars.developer.name).toBe('Your Name');
        expect(templateVars.template.name).toBe('phaser-game-template');
    });
});
