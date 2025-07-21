#!/usr/bin/env node
/**
 * Template Setup Automation
 * Automatically configures a new project created from the Phaser Game Template
 */

import { execSync } from 'child_process';
import { readFileSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';
import readline from 'readline';

class TemplateSetup {
    constructor() {
        this.projectRoot = process.cwd();
        this.rl = readline.createInterface({
            input: process.stdin,
            output: process.stdout
        });
    }

    async promptUser(question) {
        return new Promise(resolve => {
            this.rl.question(question, answer => {
                resolve(answer.trim());
            });
        });
    }

    log(message, type = 'info') {
        const timestamp = new Date().toISOString().slice(0, 19);
        const symbols = {
            info: 'ℹ️',
            success: '✅',
            warning: '⚠️',
            error: '❌'
        };
        console.log(`[${timestamp}] ${symbols[type]} ${message}`);
    }

    async setupNewProject() {
        this.log('🚀 Starting Phaser Game Template Setup...');

        try {
            // Get project information from user
            const projectName = await this.promptUser(
                'Enter your project name (e.g., my-awesome-game): '
            );
            const gameTitle = await this.promptUser(
                'Enter your game title (e.g., My Awesome Game): '
            );
            const author = await this.promptUser('Enter author name: ');
            const description = await this.promptUser('Enter project description: ');

            // Validate inputs
            if (!projectName || !gameTitle || !author) {
                throw new Error('Project name, game title, and author are required');
            }

            // Update project configuration
            await this.updatePackageJson(projectName, gameTitle, author, description);
            await this.updateGameConfiguration(gameTitle);
            await this.updateDocumentation(projectName, gameTitle, author);
            await this.initializeGitRepository();
            await this.installDependencies();
            await this.runInitialBuild();

            this.log('🎉 Template setup complete!', 'success');
            this.log(`Next steps:`, 'info');
            this.log(`  1. Run 'npm run dev' to start development server`, 'info');
            this.log(`  2. Run 'npm run test' to verify everything works`, 'info');
            this.log(`  3. Open http://localhost:5173 to see your game`, 'info');
        } catch (error) {
            this.log(`Setup failed: ${error.message}`, 'error');
            process.exit(1);
        } finally {
            this.rl.close();
        }
    }

    async updatePackageJson(projectName, gameTitle, author, description) {
        this.log('Updating package.json...');

        const packageJsonPath = join(this.projectRoot, 'package.json');
        const packageJson = JSON.parse(readFileSync(packageJsonPath, 'utf8'));

        // Update package.json fields
        packageJson.name = projectName.toLowerCase().replace(/\s+/g, '-');
        packageJson.description =
            description || `${gameTitle} - A Phaser 3 game built with TypeScript`;
        packageJson.author = author;
        packageJson.version = '0.1.0';

        // Update repository information to point to new project
        packageJson.repository = {
            type: 'git',
            url: `git+https://github.com/${author}/${projectName}.git`
        };

        packageJson.bugs = {
            url: `https://github.com/${author}/${projectName}/issues`
        };

        packageJson.homepage = `https://github.com/${author}/${projectName}#readme`;

        writeFileSync(packageJsonPath, JSON.stringify(packageJson, null, 4));
        this.log('Package.json updated successfully', 'success');
    }

    async updateGameConfiguration(gameTitle) {
        this.log('Updating game configuration...');

        // Update main game configuration
        const configPath = join(this.projectRoot, 'src', 'config', 'game.config.ts');
        if (existsSync(configPath)) {
            let configContent = readFileSync(configPath, 'utf8');

            // Update game title in config
            configContent = configContent.replace(/title:\s*['"].*?['"]/g, `title: '${gameTitle}'`);

            writeFileSync(configPath, configContent);
            this.log('Game configuration updated', 'success');
        }

        // Update HTML title
        const indexPath = join(this.projectRoot, 'index.html');
        if (existsSync(indexPath)) {
            let htmlContent = readFileSync(indexPath, 'utf8');
            htmlContent = htmlContent.replace(
                /<title>.*?<\/title>/g,
                `<title>${gameTitle}</title>`
            );
            writeFileSync(indexPath, htmlContent);
            this.log('HTML title updated', 'success');
        }
    }

    async updateDocumentation(projectName, gameTitle, author) {
        this.log('Updating documentation...');

        const readmePath = join(this.projectRoot, 'README.md');
        if (existsSync(readmePath)) {
            let readmeContent = readFileSync(readmePath, 'utf8');

            // Replace template placeholders
            readmeContent = readmeContent
                .replace(/# Phaser Game Template/g, `# ${gameTitle}`)
                .replace(
                    /Professional 2D Phaser game template/g,
                    `${gameTitle} - A professional Phaser 3 game`
                )
                .replace(/Template Author/g, author)
                .replace(/phaser-game-template/g, projectName.toLowerCase().replace(/\s+/g, '-'));

            writeFileSync(readmePath, readmeContent);
            this.log('README.md updated', 'success');
        }
    }

    async initializeGitRepository() {
        this.log('Initializing git repository...');

        try {
            // Check if already a git repository
            if (!existsSync(join(this.projectRoot, '.git'))) {
                execSync('git init', { cwd: this.projectRoot, stdio: 'pipe' });
                this.log('Git repository initialized', 'success');
            } else {
                this.log('Git repository already exists', 'info');
            }

            // Set up initial commit
            execSync('git add .', { cwd: this.projectRoot, stdio: 'pipe' });
            execSync('git commit -m "Initial commit from Phaser Game Template"', {
                cwd: this.projectRoot,
                stdio: 'pipe'
            });
            this.log('Initial commit created', 'success');
        } catch (error) {
            this.log('Git initialization had issues (non-critical)', 'warning');
        }
    }

    async installDependencies() {
        this.log('Installing dependencies...');

        try {
            execSync('npm install', {
                cwd: this.projectRoot,
                stdio: 'inherit'
            });
            this.log('Dependencies installed successfully', 'success');
        } catch (error) {
            throw new Error('Failed to install dependencies');
        }
    }

    async runInitialBuild() {
        this.log('Running initial build to verify setup...');

        try {
            execSync('npm run build', {
                cwd: this.projectRoot,
                stdio: 'pipe'
            });
            this.log('Initial build successful', 'success');
        } catch (error) {
            this.log('Build failed - check configuration', 'warning');
            this.log('You may need to run "npm run build" manually', 'info');
        }
    }
}

// CLI interface
const args = process.argv.slice(2);

if (args.includes('--help') || args.includes('-h')) {
    console.log(`
🎮 Phaser Game Template Setup

Usage:
  node setup-template.js [options]

Options:
  --help, -h     Show this help message
  --automated    Run with default values (for CI)

Interactive mode (default):
  The script will prompt you for project information and configure
  the template for your new game project.

Example:
  node setup-template.js
    `);
    process.exit(0);
}

if (args.includes('--automated')) {
    console.log('Automated setup mode not implemented yet');
    process.exit(1);
} else {
    // Interactive setup
    const setup = new TemplateSetup();
    setup.setupNewProject().catch(error => {
        console.error('Setup failed:', error.message);
        process.exit(1);
    });
}
