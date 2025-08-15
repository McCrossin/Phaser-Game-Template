# Detailed Setup Guide

This guide provides comprehensive setup instructions for the Phaser Game Template, including advanced configuration options and environment-specific setup.

## System Requirements

### Minimum Requirements

- **Operating System**: Windows 10, macOS 10.15+, or Linux (Ubuntu 18.04+)
- **Node.js**: Version 18.0 or higher
- **Memory**: 4GB RAM minimum, 8GB recommended
- **Storage**: 500MB free space for template + dependencies

### Recommended Development Environment

- **IDE**: Visual Studio Code with extensions:
  - TypeScript and JavaScript Language Features
  - Phaser 3 Snippets
  - ESLint
  - Prettier
  - GitLens
- **Browser**: Chrome or Firefox with developer tools
- **Terminal**: PowerShell (Windows) or Terminal (macOS/Linux)

## Complete Installation Process

### 1. Node.js Installation

**Windows:**
```bash
# Using Chocolatey
choco install nodejs

# Or download from https://nodejs.org/
```

**macOS:**
```bash
# Using Homebrew
brew install node

# Or download from https://nodejs.org/
```

**Linux (Ubuntu/Debian):**
```bash
# Using NodeSource repository
curl -fsSL https://deb.nodesource.com/setup_18.x | sudo -E bash -
sudo apt-get install -y nodejs
```

### 2. Git Configuration

```bash
# Configure Git (if not already done)
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"
```

### 3. Template Setup

#### Option A: GitHub Template (Recommended)

1. Navigate to the template repository on GitHub
2. Click "Use this template" → "Create a new repository"
3. Configure your new repository:
   - Repository name: `my-game-project`
   - Description: Brief game description
   - Visibility: Public or Private
4. Clone your new repository:

```bash
git clone https://github.com/your-username/my-game-project.git
cd my-game-project
```

#### Option B: Fork and Clone

```bash
# Fork the repository on GitHub, then:
git clone https://github.com/your-username/phaser-game-template.git
cd phaser-game-template

# Add upstream remote for updates
git remote add upstream https://github.com/original-owner/phaser-game-template.git
```

### 4. Dependency Installation

```bash
# Install all dependencies
npm install

# Verify installation
npm list --depth=0
```

### 5. Environment Configuration

#### Development Environment

Create `.env.development` (optional):
```env
# Development-specific configuration
VITE_API_URL=http://localhost:3000
VITE_DEBUG_MODE=true
VITE_GAME_VERSION=dev
```

#### Production Environment

The template includes production configuration in `environments/production.json`:
```json
{
  "gameConfig": {
    "physics": {
      "default": "matter",
      "matter": {
        "debug": false
      }
    }
  }
}
```

### 6. IDE Setup (VS Code)

#### Recommended Extensions

Install these extensions for optimal development experience:

```bash
# Install VS Code extensions
code --install-extension ms-vscode.vscode-typescript-next
code --install-extension bradlc.vscode-tailwindcss
code --install-extension esbenp.prettier-vscode
code --install-extension dbaeumer.vscode-eslint
```

#### Workspace Settings

The template includes `.vscode/settings.json` with optimal configuration:

```json
{
  "typescript.preferences.importModuleSpecifier": "relative",
  "editor.formatOnSave": true,
  "editor.defaultFormatter": "esbenp.prettier-vscode",
  "typescript.preferences.includePackageJsonAutoImports": "on"
}
```

## Verification and Testing

### 1. Development Server Test

```bash
npm run dev
```

**Expected Results:**
- Server starts on `http://localhost:5173`
- Browser opens automatically
- Game scene loads without errors
- Hot reload works (edit and save a file)

### 2. Build Test

```bash
npm run build
```

**Expected Results:**
- Build completes without errors
- `dist/` folder created with optimized files
- Bundle size reasonable (< 5MB for template)

### 3. Testing Suite

```bash
# Run all tests
npm run test

# Run specific test types
npm run test:unit        # Unit tests only
npm run test:e2e         # End-to-end tests
npm run test:performance # Performance benchmarks
```

### 4. Code Quality Check

```bash
# Linting
npm run lint

# Formatting
npm run format

# Type checking
npm run type-check
```

## Project Customization

### 1. Package Configuration

Update `package.json` with your project details:

```json
{
  "name": "my-awesome-game",
  "description": "An awesome 2D game built with Phaser 3",
  "author": "Your Name <your.email@example.com>",
  "keywords": ["phaser", "game", "2d", "typescript"],
  "homepage": "https://your-username.github.io/my-awesome-game",
  "repository": {
    "type": "git",
    "url": "https://github.com/your-username/my-awesome-game.git"
  }
}
```

### 2. Game Configuration

Edit `src/config/GameConfig.ts`:

```typescript
export const gameConfig: Phaser.Types.Core.GameConfig = {
  title: "My Awesome Game",
  width: 1024,
  height: 768,
  // ... other configuration
};
```

### 3. HTML Metadata

Update `index.html`:

```html
<title>My Awesome Game</title>
<meta name="description" content="An awesome 2D game">
<meta property="og:title" content="My Awesome Game">
```

## Advanced Configuration

### 1. Custom Build Configuration

Modify `vite.config.ts` for specific requirements:

```typescript
export default defineConfig({
  // Custom asset handling
  assetsInclude: ['**/*.tmx', '**/*.tsx'],
  
  // Custom build options
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          phaser: ['phaser']
        }
      }
    }
  }
});
```

### 2. TypeScript Configuration

Adjust `tsconfig.json` for your preferences:

```json
{
  "compilerOptions": {
    "strict": true,
    "noImplicitAny": true,
    "paths": {
      "@/*": ["./src/*"],
      "@assets/*": ["./assets/*"]
    }
  }
}
```

### 3. CI/CD Configuration

The template includes GitHub Actions. Customize `.github/workflows/ci.yml`:

```yaml
name: CI/CD Pipeline
on:
  push:
    branches: [main, develop]
  pull_request:
    branches: [main]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      # ... customized steps
```

## Docker Setup (Optional)

For containerized development:

```bash
# Build Docker image
docker build -t my-game .

# Run in container
docker run -p 5173:5173 my-game

# Development with volume mounting
docker-compose up
```

## Troubleshooting

### Common Installation Issues

1. **Node.js Version Mismatch**
   ```bash
   # Check version
   node --version
   
   # Update if needed
   nvm install 18
   nvm use 18
   ```

2. **Permission Issues (Linux/macOS)**
   ```bash
   # Fix npm permissions
   sudo chown -R $(whoami) ~/.npm
   ```

3. **Port Already in Use**
   ```bash
   # Use different port
   npm run dev -- --port 3001
   ```

For more troubleshooting help, see [Troubleshooting Guide](troubleshooting.md).

## Next Steps

- [Feature Overview](../features/overview.md) - Learn about included features
- [Development Workflow](../development/) - Start building your game
- [Customization Guide](../customization/) - Advanced customization options
