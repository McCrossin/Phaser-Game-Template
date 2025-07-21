# Troubleshooting Guide

Common issues and solutions for the Phaser Game Template setup and development.

## Quick Diagnostic Commands

Run these commands to gather information when reporting issues:

```bash
# System information
node --version
npm --version
git --version

# Project health check
npm run health

# Dependency verification
npm list --depth=0

# Clear caches if needed
npm cache clean --force
```

## Installation Issues

### 1. Node.js Version Problems

**Problem:** Template requires Node.js 18+ but you have an older version.

```bash
# Check current version
node --version
```

**Solutions:**

**Option A: Using Node Version Manager (Recommended)**
```bash
# Install nvm (Linux/macOS)
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash

# Install nvm (Windows - use nvm-windows)
# Download from: https://github.com/coreybutler/nvm-windows

# Install and use Node 18
nvm install 18
nvm use 18
```

**Option B: Direct Installation**
- Download from [nodejs.org](https://nodejs.org/)
- Install the LTS version (18.x or higher)

### 2. npm Installation Failures

**Problem:** `npm install` fails with permission errors.

**Linux/macOS Solution:**
```bash
# Fix npm permissions
mkdir ~/.npm-global
npm config set prefix '~/.npm-global'
echo 'export PATH=~/.npm-global/bin:$PATH' >> ~/.bashrc
source ~/.bashrc
```

**Windows Solution:**
```bash
# Run as Administrator or use Chocolatey
choco install nodejs
```

### 3. Package Installation Timeout

**Problem:** Installation hangs or times out.

**Solutions:**
```bash
# Increase timeout
npm install --timeout=60000

# Use different registry
npm install --registry https://registry.npmjs.org/

# Clear cache and retry
npm cache clean --force
rm -rf node_modules package-lock.json
npm install
```

### 4. Git Clone Issues

**Problem:** Cannot clone repository.

**Solutions:**
```bash
# Use HTTPS instead of SSH
git clone https://github.com/username/repo.git

# Check Git configuration
git config --global user.name "Your Name"
git config --global user.email "your.email@example.com"

# Handle authentication
git config --global credential.helper store
```

## Development Server Issues

### 1. Port Already in Use

**Problem:** `npm run dev` fails with "Port 5173 already in use".

**Solutions:**
```bash
# Use different port
npm run dev -- --port 3001

# Kill process using port (Linux/macOS)
lsof -ti:5173 | xargs kill -9

# Kill process using port (Windows)
netstat -ano | findstr :5173
taskkill /PID <PID> /F
```

### 2. Hot Reload Not Working

**Problem:** Changes don't automatically update in browser.

**Solutions:**
```bash
# Check if files are being watched
# Restart dev server
npm run dev

# Clear browser cache
# Ctrl+Shift+R (hard refresh)

# Check file system permissions
chmod -R 755 src/
```

### 3. Module Resolution Errors

**Problem:** TypeScript can't find modules.

**Solutions:**
```bash
# Restart TypeScript server (VS Code)
# Ctrl+Shift+P > "TypeScript: Restart TS Server"

# Check tsconfig.json paths
cat tsconfig.json

# Reinstall dependencies
rm -rf node_modules package-lock.json
npm install
```

## Build Issues

### 1. Build Fails with TypeScript Errors

**Problem:** `npm run build` fails with type errors.

**Solutions:**
```bash
# Check for type errors
npm run type-check

# Fix common issues
# 1. Check import statements
# 2. Verify exported types
# 3. Update @types packages

# Skip type checking temporarily (not recommended)
npm run build -- --skip-type-check
```

### 2. Out of Memory During Build

**Problem:** Build process runs out of memory.

**Solutions:**
```bash
# Increase Node.js memory limit
export NODE_OPTIONS="--max-old-space-size=4096"
npm run build

# Windows
set NODE_OPTIONS=--max-old-space-size=4096
npm run build

# Reduce bundle size
# Check vite.config.ts for optimization options
```

### 3. Asset Loading Issues

**Problem:** Images or other assets don't load in production build.

**Solutions:**
```bash
# Check asset paths (should be relative to public/)
# assets/image.png -> /assets/image.png in code

# Verify build output
npm run build
cd dist
python -m http.server 8000
# Test at http://localhost:8000
```

## Testing Issues

### 1. Tests Fail to Run

**Problem:** `npm run test` doesn't start or crashes.

**Solutions:**
```bash
# Check test configuration
cat vitest.config.ts

# Run tests in different modes
npm run test:unit
npm run test:e2e

# Debug test issues
npm run test -- --reporter=verbose
```

### 2. E2E Tests Fail

**Problem:** Playwright tests fail to run or find elements.

**Solutions:**
```bash
# Install Playwright browsers
npx playwright install

# Run with headed mode for debugging
npm run test:e2e -- --headed

# Update selectors in test files
# Check if game loads properly
```

### 3. Performance Tests Fail

**Problem:** Performance benchmarks don't meet targets.

**Solutions:**
```bash
# Run performance analysis
npm run test:performance

# Check for performance bottlenecks
npm run health

# Optimize game configuration
# Check GameConfig.ts settings
```

## IDE and Editor Issues

### 1. VS Code TypeScript Errors

**Problem:** Red squiggly lines everywhere in VS Code.

**Solutions:**
```bash
# Restart TypeScript server
# Ctrl+Shift+P > "TypeScript: Restart TS Server"

# Check workspace TypeScript version
# Ctrl+Shift+P > "TypeScript: Select TypeScript Version"
# Choose "Use Workspace Version"

# Verify VS Code extensions
code --list-extensions | grep typescript
```

### 2. IntelliSense Not Working

**Problem:** Auto-completion and suggestions don't work.

**Solutions:**
```bash
# Reload VS Code window
# Ctrl+Shift+P > "Developer: Reload Window"

# Check if TypeScript service is running
# Look for TypeScript indicator in status bar

# Verify project structure
ls -la tsconfig.json package.json
```

### 3. Debugging Issues

**Problem:** Can't set breakpoints or debug doesn't work.

**Solutions:**
```json
// .vscode/launch.json
{
  "version": "0.2.0",
  "configurations": [
    {
      "type": "chrome",
      "request": "launch",
      "name": "Debug Game",
      "url": "http://localhost:5173",
      "webRoot": "${workspaceFolder}/src",
      "sourceMaps": true
    }
  ]
}
```

## Performance Issues

### 1. Slow Development Server

**Problem:** Dev server takes too long to start or respond.

**Solutions:**
```bash
# Check system resources
# Task Manager (Windows) or Activity Monitor (macOS) or htop (Linux)

# Exclude node_modules from antivirus
# Add project folder to antivirus exclusions

# Use SSD if available
# Move project to faster storage
```

### 2. High Memory Usage

**Problem:** Development environment uses too much memory.

**Solutions:**
```bash
# Close unnecessary applications
# Limit Chrome tabs during development

# Increase system virtual memory
# Check swap space (Linux/macOS)
free -h

# Optimize VS Code
# Disable unnecessary extensions
```

### 3. Slow Game Performance

**Problem:** Game runs slowly during development.

**Solutions:**
```bash
# Check browser developer tools
# Performance tab for profiling

# Optimize game configuration
# Edit src/config/GameConfig.ts
# Reduce physics complexity
# Lower render resolution
```

## Environment-Specific Issues

### Windows-Specific

```bash
# PowerShell execution policy
Set-ExecutionPolicy -ExecutionPolicy RemoteSigned -Scope CurrentUser

# Windows Defender exclusions
# Add project folder to Windows Defender exclusions

# Line ending issues
git config --global core.autocrlf true
```

### macOS-Specific

```bash
# Xcode Command Line Tools
xcode-select --install

# Homebrew permissions
sudo chown -R $(whoami) $(brew --prefix)/*

# Python/node-gyp issues
python3 --version
```

### Linux-Specific

```bash
# Build tools
sudo apt-get install build-essential

# File system limits
echo fs.inotify.max_user_watches=524288 | sudo tee -a /etc/sysctl.conf
sudo sysctl -p

# Permission issues
sudo chown -R $USER:$USER ~/.npm
```

## Advanced Troubleshooting

### 1. Complete Environment Reset

If all else fails, reset your development environment:

```bash
# 1. Remove all project files
rm -rf node_modules package-lock.json

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall dependencies
npm install

# 4. Restart development server
npm run dev
```

### 2. Dependency Conflicts

**Problem:** Package version conflicts.

```bash
# Check for duplicate dependencies
npm ls

# Resolve peer dependency issues
npm install --legacy-peer-deps

# Use exact versions
npm install --save-exact
```

### 3. Network/Proxy Issues

**Problem:** Corporate firewall or proxy blocks npm.

```bash
# Configure npm proxy
npm config set proxy http://proxy-server:port
npm config set https-proxy http://proxy-server:port

# Use corporate registry
npm config set registry http://internal-registry

# Bypass SSL (not recommended for production)
npm config set strict-ssl false
```

## Getting Additional Help

### 1. Diagnostic Information Collection

When reporting issues, include:

```bash
# System information
npm run health > diagnostic-info.txt

# Environment details
echo "Node: $(node --version)" >> diagnostic-info.txt
echo "npm: $(npm --version)" >> diagnostic-info.txt
echo "OS: $(uname -a)" >> diagnostic-info.txt

# Package information
npm list --depth=0 >> diagnostic-info.txt
```

### 2. Log Files

Check these locations for detailed error logs:

- **npm logs**: `~/.npm/_logs/`
- **VS Code logs**: Help → Toggle Developer Tools → Console
- **Browser console**: F12 → Console tab
- **Build logs**: Terminal output from `npm run build`

### 3. Community Resources

- **GitHub Issues**: Check existing issues in the template repository
- **Stack Overflow**: Search for "Phaser 3 TypeScript Vite" issues
- **Phaser Community**: [phaser.discourse.group](https://phaser.discourse.group/)
- **Discord**: Phaser community Discord server

### 4. Professional Support

For complex issues or custom requirements:

- **Consultancy**: Consider hiring Phaser/TypeScript developers
- **Training**: Official Phaser training resources
- **Documentation**: [phaser.io/tutorials](https://phaser.io/tutorials)

---

**Still having issues?** 

1. 📋 Create a [GitHub issue](../../issues/new) with diagnostic information
2. 💬 Ask in the [Phaser community](https://phaser.discourse.group/)
3. 📧 Contact the template maintainers with reproduction steps

**Quick Links:**
- [Requirements](requirements.md) - Verify system requirements
- [Setup Guide](detailed-setup.md) - Complete installation guide
- [Feature Overview](../features/overview.md) - Learn about template features
