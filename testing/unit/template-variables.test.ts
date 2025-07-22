import { describe, it, expect, beforeAll } from 'vitest';
import fs from 'fs';
import path from 'path';

/**
 * Template Variables System Tests
 * Validates the template variable system works correctly
 */
describe('Template Variables System', () => {
    const projectRoot = path.resolve(__dirname, '../..');
    const templateVarsPath = path.join(projectRoot, 'config', 'template-variables.json');

    let templateVars: any;

    beforeAll(() => {
        templateVars = JSON.parse(fs.readFileSync(templateVarsPath, 'utf8'));
    });

    it('should have valid template section', () => {
        expect(templateVars.template).toBeDefined();
        expect(templateVars.template.name).toBe('phaser-game-template');
        expect(templateVars.template.displayName).toBe('Phaser Game Template');
        expect(templateVars.template.description).toContain('Phaser 3');
        expect(templateVars.template.version).toMatch(/^\d+\.\d+\.\d+$/);
    });

    it('should have valid game section with placeholders', () => {
        expect(templateVars.game).toBeDefined();
        expect(templateVars.game.name).toBe('YourGame');
        expect(templateVars.game.title).toBe('Your Game Title');
        expect(templateVars.game.description).toContain('your');
        expect(templateVars.game.genre).toBe('Your Game Genre');
    });

    it('should have valid developer section with placeholders', () => {
        expect(templateVars.developer).toBeDefined();
        expect(templateVars.developer.name).toBe('Your Name');
        expect(templateVars.developer.organization).toBe('Your Organization');
        expect(templateVars.developer.email).toContain('@example.com');
        expect(templateVars.developer.website).toContain('your-website.com');
    });

    it('should have generic replacement mappings', () => {
        expect(templateVars.replacements).toBeDefined();
        expect(templateVars.replacements.vehicle).toBe('player character');
        expect(templateVars.replacements.exploration).toBe('game mechanics');
        expect(templateVars.replacements.character).toBe('player character');
        expect(templateVars.replacements.world).toBe('game world');
    });

    it('should not contain any game-specific references', () => {
        const jsonString = JSON.stringify(templateVars);

        // Check for common game-specific terms that shouldn't be in template
        const forbiddenTerms = [
            'New-Eden',
            'new-eden',
            'NEW_EDEN',
            'probe consciousness',
            'cosmic',
            'automation-strategy'
        ];

        forbiddenTerms.forEach(term => {
            expect(jsonString.toLowerCase()).not.toContain(term.toLowerCase());
        });
    });

    it('should provide clear customization guidance', () => {
        // All placeholder values should indicate they need customization
        expect(templateVars.game.name).toContain('Your');
        expect(templateVars.game.title).toContain('Your');
        expect(templateVars.game.description).toContain('your');
        expect(templateVars.developer.name).toContain('Your');
    });

    it('should have valid JSON structure', () => {
        // This test ensures the JSON is valid by attempting to parse it
        expect(() => {
            JSON.parse(fs.readFileSync(templateVarsPath, 'utf8'));
        }).not.toThrow();
    });

    it('should have all required template properties', () => {
        const requiredProperties = [
            'template.name',
            'template.displayName',
            'template.description',
            'template.version',
            'game.name',
            'game.title',
            'developer.name',
            'replacements'
        ];

        requiredProperties.forEach(prop => {
            const keys = prop.split('.');
            let obj = templateVars;
            for (const key of keys) {
                expect(obj).toHaveProperty(key);
                obj = obj[key];
            }
        });
    });
});
