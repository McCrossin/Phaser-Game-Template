# 🎮 Using the Phaser Game Template

This guide explains how to create a new game project from the Phaser Game Template and get started with development.

## 🚀 Quick Start Options

### Option 1: GitHub Template (Recommended)

1. **Use Template Button**
    - Go to [McCrossin/Phaser-Game-Template](https://github.com/McCrossin/Phaser-Game-Template)
    - Click the green **"Use this template"** button
    - Select **"Create a new repository"**
    - Choose your repository name and settings
    - Click **"Create repository from template"**

2. **Clone Your New Repository**

    ```bash
    git clone https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
    cd YOUR-REPO-NAME
    ```

3. **Set Up Your Project**

    ```bash
    # Run the automated setup script
    node setup-template.js

    # Or install dependencies manually
    npm install
    ```

4. **Verify Setup**

    ```bash
    # Run verification script
    ./verify-template-setup.sh

    # Start development
    npm run dev
    ```

### Option 2: Manual Clone

1. **Clone the Template**

    ```bash
    git clone https://github.com/McCrossin/Phaser-Game-Template.git my-new-game
    cd my-new-game
    ```

2. **Remove Template Git History** (Optional)

    ```bash
    rm -rf .git
    git init
    git add .
    git commit -m "Initial commit from Phaser Game Template"
    ```

3. **Set Up Your Project**

    ```bash
    # Run the setup script for guided configuration
    node setup-template.js
    ```

4. **Connect to Your Repository**
    ```bash
    git remote add origin https://github.com/YOUR-USERNAME/YOUR-REPO-NAME.git
    git push -u origin main
    ```

## 🛠️ Template Features

### What's Included

- **🎮 Phaser 3** - Latest version with TypeScript support
- **⚡ Vite** - Fast development server and build tool
- **🔧 TypeScript** - Full type safety and modern JavaScript features
- **🧪 Testing** - Vitest for unit tests, Playwright for E2E tests
- **📝 Code Quality** - ESLint, Prettier, and Husky git hooks
- **🚀 CI/CD** - GitHub Actions workflows for testing and deployment
- **📊 Monitoring** - Health checks and performance monitoring
- **🐳 Docker** - Containerization for consistent deployments
- **📚 Documentation** - Auto-generated docs with TypeDoc

### Project Structure

```
your-game/
├── src/                    # Game source code
│   ├── scenes/            # Phaser scenes
│   ├── systems/           # Game systems (ECS pattern)
│   ├── components/        # Reusable components
│   ├── config/            # Game configuration
│   └── utils/             # Utility functions
├── assets/                # Game assets (images, audio, etc.)
├── testing/               # Test files and configuration
├── docs/                  # Documentation
├── tools/                 # Build and deployment tools
└── config/                # Build and development configuration
```

## 📝 Customization Guide

### 1. Update Project Information

The setup script will help you configure:

- Project name and description
- Game title
- Author information
- Repository URLs

### 2. Configure Your Game

Edit key configuration files:

**Game Configuration** (`src/config/game.config.ts`):

```typescript
export const gameConfig: Phaser.Types.Core.GameConfig = {
    title: 'Your Game Title',
    width: 1024,
    height: 768
    // ... other settings
};
```

**Package Information** (`package.json`):

```json
{
    "name": "your-game-name",
    "description": "Your game description",
    "author": "Your Name"
}
```

### 3. Customize Assets

- Replace template assets in the `assets/` directory
- Update asset loading in your scenes
- Modify the asset processing pipeline if needed

### 4. Configure CI/CD

The template includes GitHub Actions workflows:

- `.github/workflows/ci.yml` - Continuous integration
- `.github/workflows/deploy-staging.yml` - Staging deployment
- `.github/workflows/deploy-production.yml` - Production deployment

Update environment variables and secrets in your GitHub repository settings.

## 🧪 Development Workflow

### Available Commands

```bash
# Development
npm run dev                 # Start development server
npm run build              # Build for production
npm run preview            # Preview production build

# Testing
npm test                   # Run all tests
npm run test:watch         # Run tests in watch mode
npm run test:coverage      # Run tests with coverage
npm run test:e2e          # Run end-to-end tests

# Code Quality
npm run lint              # Check code with ESLint
npm run lint:fix          # Fix ESLint issues
npm run format            # Format code with Prettier
npm run typecheck         # Check TypeScript types

# Health & Monitoring
npm run health:check      # Run health checks
npm run health:report     # Generate health report
npm run performance:check # Check performance metrics

# Documentation
npm run docs              # Generate documentation
```

### Development Guidelines

1. **Follow TypeScript Best Practices**
    - Use strict type checking
    - Prefer interfaces over types for object shapes
    - Use proper access modifiers

2. **Write Tests**
    - Unit tests for game logic
    - Integration tests for complex interactions
    - E2E tests for critical user flows

3. **Code Quality**
    - Run linting before commits (automated with Husky)
    - Follow consistent formatting
    - Write meaningful commit messages

4. **Performance**
    - Target 60 FPS for smooth gameplay
    - Monitor bundle size and loading times
    - Use the built-in performance monitoring tools

## 🚀 Deployment Options

### Staging Deployment

Automatic deployment to staging on every push to main:

```bash
git push origin main  # Triggers staging deployment
```

### Production Deployment

Create a release to deploy to production:

```bash
git tag v1.0.0
git push origin v1.0.0  # Triggers production deployment
```

### Manual Deployment

```bash
npm run build
npm run deploy:staging     # Deploy to staging
npm run deploy:production  # Deploy to production
```

## 🔧 Troubleshooting

### Common Issues

**Build Fails**

```bash
# Check TypeScript errors
npm run typecheck

# Check for linting issues
npm run lint

# Verify all tests pass
npm test
```

**Dependencies Issues**

```bash
# Clear cache and reinstall
rm -rf node_modules package-lock.json
npm install
```

**Git Hooks Not Working**

```bash
# Reinstall Husky
npm run prepare
```

### Getting Help

1. **Check the Health Report**

    ```bash
    npm run health:report
    ```

2. **Run Template Verification**

    ```bash
    ./verify-template-setup.sh
    ```

3. **Review Documentation**
    - Check the `docs/` directory for detailed guides
    - Run `npm run docs` to generate API documentation

4. **Community Support**
    - Open an issue in the template repository
    - Check existing issues for solutions

## 🎯 Next Steps

After setting up your project:

1. **Plan Your Game**
    - Define your game concept and mechanics
    - Create a basic game design document
    - Set up your development milestones

2. **Start Development**
    - Create your first scene
    - Add basic game mechanics
    - Implement your game loop

3. **Set Up Monitoring**
    - Configure error tracking
    - Set up performance monitoring
    - Plan your testing strategy

4. **Prepare for Production**
    - Configure deployment environments
    - Set up monitoring and analytics
    - Plan your release strategy

## 📚 Additional Resources

- [Phaser 3 Documentation](https://photonstorm.github.io/phaser3-docs/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Vite Documentation](https://vitejs.dev/guide/)
- [Game Development Best Practices](./docs/development/best-practices.md)

Happy game development! 🎮✨
