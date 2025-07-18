# GitHub Actions Testing & Debugging Guide

## 🔍 **Issues Found & Fixed**

### **Issue 1: Docker Build Failure** 
- **Problem**: `npm run build:docker` failing in GitHub Actions
- **Root Cause**: Docker context missing TypeScript compilation step
- **Fix**: Updated Dockerfile to use standard `npm run build` command
- **File Changed**: `Dockerfile` line 15

### **Issue 2: Package Script Redundancy**
- **Problem**: Duplicate `build:docker` script causing confusion
- **Fix**: Removed redundant script, using standard `build` everywhere
- **File Changed**: `package.json`

## 🧪 **Local Testing System**

### **Quick Test (30 seconds)**
```bash
npm run test:github-actions:quick
```
**What it tests:**
- TypeScript compilation (`npm run typecheck`)
- Code linting (`npm run lint`)
- Unit tests (`npm run test:run`) 
- Build process (`npm run build`)

**This simulates the exact same commands GitHub Actions runs.**

### **Full Test Suite (5-10 minutes)**
```bash
npm run test:github-actions
```
**What it tests:**
- All quick tests above
- Docker build with same configuration as GitHub Actions
- Container registry tagging simulation
- Workflow file validation
- CI environment simulation

### **Docker-Only Test**
```bash
node scripts/test-github-actions.js --docker-only
```
**Use this when:**
- You only changed Docker-related files
- Testing container build issues specifically

## 🛠 **Workflow for Future Changes**

### **Before Pushing to GitHub:**
1. **Always run quick test first:**
   ```bash
   npm run test:github-actions:quick
   ```
   
2. **If Docker/CI changes, run full test:**
   ```bash
   npm run test:github-actions
   ```

3. **Only push if tests pass locally**

### **Interpreting Test Results:**

**✅ Success Output:**
```
🎉 All tests passed! GitHub Actions should work correctly.
```

**❌ Failure Output:**
```
💥 Some tests failed. Fix issues before pushing to GitHub.
```
*Script will list specific failures to fix*

## 🔄 **Debugging Failed Tests**

### **If TypeScript Fails:**
```bash
npm run typecheck
# Fix TypeScript errors shown
```

### **If Linting Fails:**
```bash
npm run lint:fix
# Then check remaining issues with: npm run lint
```

### **If Tests Fail:**
```bash
npm run test:run
# Fix failing unit tests
```

### **If Build Fails:**
```bash
npm run build
# Check for asset pipeline or Vite configuration issues
```

### **If Docker Fails:**
```bash
# Test Docker build manually:
docker build --platform linux/amd64 -t test-build .

# Check Dockerfile syntax and commands
# Ensure all referenced files exist
```

## 📊 **Key Files for GitHub Actions**

### **Workflow Files:**
- `.github/workflows/ci.yml` - Main CI pipeline
- `.github/workflows/deploy-staging.yml` - Staging deployment  
- `.github/workflows/deploy-production.yml` - Production deployment
- `.github/workflows/security-scan.yml` - Security scanning
- `.github/workflows/performance-advanced.yml` - Performance monitoring

### **Configuration Files:**
- `Dockerfile` - Container build configuration
- `package.json` - npm scripts and dependencies
- `vite.config.ts` - Build configuration
- `tsconfig.json` - TypeScript configuration

## 🚀 **Benefits of Local Testing**

1. **Faster Feedback**: Know issues in 30 seconds vs 5-10 minutes in GitHub
2. **Save CI Minutes**: Avoid burning GitHub Actions minutes on obvious failures
3. **Confidence**: Push knowing it will work
4. **Debugging**: Better error messages locally vs truncated CI logs

## 📝 **Next Steps**

1. **Run the quick test now to validate current fixes:**
   ```bash
   npm run test:github-actions:quick
   ```

2. **For any future changes, follow the workflow above**

3. **Consider adding this to your commit hooks:**
   ```bash
   # Add to .husky/pre-push (if desired)
   npm run test:github-actions:quick
   ```

This testing system gives you the same confidence as GitHub Actions but with immediate local feedback!
