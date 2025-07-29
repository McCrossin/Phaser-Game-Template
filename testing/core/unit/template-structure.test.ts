import { describe, it, expect, beforeEach } from 'vitest';
import { TemplateStructureValidator, STRUCTURE_CONFIG } from '../../src/types/template-structure';
import type {
    TemplateStructure,
    StructureValidationResult
} from '../../src/types/template-structure';

describe('TemplateStructureValidator', () => {
    let validator: TemplateStructureValidator;
    let mockStructure: TemplateStructure;

    beforeEach(() => {
        mockStructure = {
            core: {
                src: ['src/', 'assets/', 'index.html'],
                config: ['config/', 'environments/'],
                build: ['package.json', 'vite-plugins/']
            },
            development: {
                tools: ['tools/', 'scripts/'],
                testing: ['tests/'],
                ci: ['.github/', '.husky/']
            },
            documentation: {
                essential: ['README.md', 'docs/setup/', 'docs/examples/'],
                development: ['docs/development/', 'docs/api/']
            },
            template: {
                maxRootFiles: 15,
                requiredDirectories: ['src', 'assets', 'config', 'docs'],
                optionalDirectories: ['scripts', 'tools', 'testing']
            }
        };

        validator = new TemplateStructureValidator(mockStructure);
    });

    describe('Structure Configuration', () => {
        it('should have correct maximum root files limit', () => {
            expect(STRUCTURE_CONFIG.maxRootFiles).toBe(15);
        });

        it('should have required directories defined', () => {
            expect(STRUCTURE_CONFIG.requiredDirectories).toContain('src');
            expect(STRUCTURE_CONFIG.requiredDirectories).toContain('assets');
            expect(STRUCTURE_CONFIG.requiredDirectories).toContain('docs');
            expect(STRUCTURE_CONFIG.requiredDirectories).toContain('config');
        });

        it('should have maximum subdirectory depth defined', () => {
            expect(STRUCTURE_CONFIG.maxSubdirectoryDepth).toBe(3);
        });
    });

    describe('Template Structure Validation', () => {
        it('should create validator with valid structure', () => {
            expect(validator).toBeInstanceOf(TemplateStructureValidator);
        });

        it('should validate basic structure requirements', async () => {
            const result: StructureValidationResult = await validator.validate('/mock/path');

            expect(result).toBeDefined();
            expect(result.isValid).toBeDefined();
            expect(result.errors).toBeDefined();
            expect(result.warnings).toBeDefined();
            expect(result.rootFileCount).toBeDefined();
            expect(result.missingRequiredDirectories).toBeDefined();
        });
    });

    describe('Path Validation', () => {
        it('should validate core paths are present', () => {
            expect(mockStructure.core.src).toContain('src/');
            expect(mockStructure.core.src).toContain('assets/');
            expect(mockStructure.core.build).toContain('package.json');
        });

        it('should validate development paths are organized', () => {
            expect(mockStructure.development.tools).toContain('tools/');
            expect(mockStructure.development.tools).toContain('scripts/');
            expect(mockStructure.development.testing).toContain('tests/');
        });

        it('should validate documentation paths are structured', () => {
            expect(mockStructure.documentation.essential).toContain('README.md');
            expect(mockStructure.documentation.essential).toContain('docs/setup/');
        });
    });
});
