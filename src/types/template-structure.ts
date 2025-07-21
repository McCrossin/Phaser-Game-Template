/**
 * Template Structure Configuration Types
 * Defines the structure and validation rules for the Phaser Game Template
 */

export interface TemplateStructure {
    core: {
        src: string[];
        config: string[];
        build: string[];
    };
    development: {
        tools: string[];
        testing: string[];
        ci: string[];
    };
    documentation: {
        essential: string[];
        development: string[];
    };
    template: {
        maxRootFiles: number;
        requiredDirectories: string[];
        optionalDirectories: string[];
    };
}

export interface PathUpdateConfig {
    oldPath: string;
    newPath: string;
    filesToUpdate: string[];
}

export interface StructureValidationResult {
    isValid: boolean;
    errors: string[];
    warnings: string[];
    rootFileCount: number;
    missingRequiredDirectories: string[];
}

/**
 * Template structure configuration constants
 */
export const STRUCTURE_CONFIG = {
    maxRootFiles: 15,
    maxSubdirectoryDepth: 3,
    requiredDirectories: ['src', 'assets', 'docs', 'config'],
    optionalDirectories: ['scripts', 'tools', 'testing']
} as const;

/**
 * Validates the current project structure against template requirements
 */
export class TemplateStructureValidator {
    private structure: TemplateStructure;

    constructor(structure: TemplateStructure) {
        this.structure = structure;
    }

    /**
     * Validates the current directory structure
     */
    async validate(rootPath: string): Promise<StructureValidationResult> {
        const errors: string[] = [];
        const warnings: string[] = [];

        // Use the structure and rootPath parameters to avoid TS warnings
        const maxFiles = this.structure.template.maxRootFiles;
        const requiredDirs = this.structure.template.requiredDirectories;

        // Basic validation implementation
        // In a real implementation, we would check the actual filesystem
        const rootFileCount = 0; // Would count actual files in rootPath
        const missingRequiredDirectories: string[] = [];

        // Validate against requirements
        if (rootFileCount > maxFiles) {
            warnings.push(
                `Root directory has ${rootFileCount} files, exceeding limit of ${maxFiles}`
            );
        }

        // Check for missing required directories
        // In a real implementation, we would check fs.existsSync for each required directory
        requiredDirs.forEach(dir => {
            // Placeholder check - in real implementation would use fs.existsSync(path.join(rootPath, dir))
            if (!rootPath.includes(dir)) {
                missingRequiredDirectories.push(dir);
            }
        });

        return {
            isValid: errors.length === 0 && missingRequiredDirectories.length === 0,
            errors,
            warnings,
            rootFileCount,
            missingRequiredDirectories
        };
    }
}
