#!/bin/bash
# Template Setup Verification Script
# Verifies that a new project created from the template is properly configured

echo "🔍 Verifying Phaser Game Template Setup..."
echo "========================================"

# Colors for output
GREEN='\033[0;32m'
RED='\033[0;31m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print status
print_status() {
    if [ $1 -eq 0 ]; then
        echo -e "${GREEN}✅ $2${NC}"
    else
        echo -e "${RED}❌ $2${NC}"
    fi
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_info() {
    echo -e "ℹ️  $1"
}

# Verification counters
CHECKS_PASSED=0
CHECKS_FAILED=0

# Check if we're in a valid project directory
if [ ! -f "package.json" ]; then
    echo -e "${RED}❌ Error: package.json not found. Run this script from your project root.${NC}"
    exit 1
fi

echo ""
echo "📦 Checking Project Structure..."
echo "--------------------------------"

# Check essential files exist
essential_files=(
    "package.json"
    "index.html"
    "src/main.ts"
    "src/config/game.config.ts"
    "config/build/vite.config.ts"
    "config/build/tsconfig.json"
    ".gitignore"
    "README.md"
)

for file in "${essential_files[@]}"; do
    if [ -f "$file" ]; then
        print_status 0 "Found $file"
        ((CHECKS_PASSED++))
    else
        print_status 1 "Missing $file"
        ((CHECKS_FAILED++))
    fi
done

echo ""
echo "🔧 Checking Build System..."
echo "---------------------------"

# Check if TypeScript compiles
print_info "Running TypeScript compilation..."
if npm run typecheck > /dev/null 2>&1; then
    print_status 0 "TypeScript compilation successful"
    ((CHECKS_PASSED++))
else
    print_status 1 "TypeScript compilation failed"
    ((CHECKS_FAILED++))
fi

# Check if build works
print_info "Running build process..."
if npm run build > /dev/null 2>&1; then
    print_status 0 "Build process successful"
    ((CHECKS_PASSED++))
    
    # Check if dist folder was created
    if [ -d "dist" ]; then
        print_status 0 "Build artifacts created in dist/"
        ((CHECKS_PASSED++))
    else
        print_status 1 "Build artifacts not found"
        ((CHECKS_FAILED++))
    fi
else
    print_status 1 "Build process failed"
    ((CHECKS_FAILED++))
fi

echo ""
echo "🧪 Checking Test System..."
echo "--------------------------"

# Check if tests run
print_info "Running test suite..."
if npm run test:run > /dev/null 2>&1; then
    print_status 0 "Test suite executed successfully"
    ((CHECKS_PASSED++))
else
    print_status 1 "Test suite failed"
    ((CHECKS_FAILED++))
fi

echo ""
echo "📝 Checking Code Quality..."
echo "---------------------------"

# Check linting
print_info "Running ESLint..."
if npm run lint > /dev/null 2>&1; then
    print_status 0 "ESLint passed"
    ((CHECKS_PASSED++))
else
    print_warning "ESLint found issues (may be fixable with npm run lint:fix)"
    ((CHECKS_FAILED++))
fi

# Check formatting
print_info "Checking code formatting..."
if npm run format:check > /dev/null 2>&1; then
    print_status 0 "Code formatting is correct"
    ((CHECKS_PASSED++))
else
    print_warning "Code formatting issues found (run npm run format to fix)"
    ((CHECKS_FAILED++))
fi

echo ""
echo "🏥 Checking Health Monitoring..."
echo "--------------------------------"

# Check health monitoring system
print_info "Testing health check system..."
if npm run health:check > /dev/null 2>&1; then
    print_status 0 "Health monitoring system working"
    ((CHECKS_PASSED++))
else
    print_status 1 "Health monitoring system failed"
    ((CHECKS_FAILED++))
fi

echo ""
echo "🔗 Checking Dependencies..."
echo "---------------------------"

# Check if node_modules exists and has content
if [ -d "node_modules" ] && [ "$(ls -A node_modules)" ]; then
    print_status 0 "Dependencies installed"
    ((CHECKS_PASSED++))
else
    print_status 1 "Dependencies not installed (run npm install)"
    ((CHECKS_FAILED++))
fi

# Check for security vulnerabilities
print_info "Checking for security vulnerabilities..."
if npm audit --audit-level=high > /dev/null 2>&1; then
    print_status 0 "No high-severity security vulnerabilities found"
    ((CHECKS_PASSED++))
else
    print_warning "Security vulnerabilities found (run npm audit for details)"
fi

echo ""
echo "🚀 Checking Development Server..."
echo "---------------------------------"

# Test if development server can start (timeout after 10 seconds)
print_info "Testing development server startup..."
timeout 10s npm run dev > /dev/null 2>&1 &
DEV_PID=$!
sleep 5

if kill -0 $DEV_PID 2>/dev/null; then
    print_status 0 "Development server starts successfully"
    kill $DEV_PID 2>/dev/null || true
    ((CHECKS_PASSED++))
else
    print_status 1 "Development server failed to start"
    ((CHECKS_FAILED++))
fi

echo ""
echo "📊 Verification Summary"
echo "======================="

total_checks=$((CHECKS_PASSED + CHECKS_FAILED))
success_rate=$((CHECKS_PASSED * 100 / total_checks))

echo "Total Checks: $total_checks"
echo -e "Passed: ${GREEN}$CHECKS_PASSED${NC}"
echo -e "Failed: ${RED}$CHECKS_FAILED${NC}"
echo "Success Rate: $success_rate%"

echo ""

if [ $CHECKS_FAILED -eq 0 ]; then
    echo -e "${GREEN}🎉 All checks passed! Your template setup is complete and ready for development.${NC}"
    echo ""
    echo "Next steps:"
    echo "  1. Start development: npm run dev"
    echo "  2. Open http://localhost:5173 in your browser"
    echo "  3. Begin building your game!"
    echo ""
    exit 0
elif [ $success_rate -ge 80 ]; then
    echo -e "${YELLOW}⚠️  Setup mostly complete with minor issues. See warnings above.${NC}"
    echo ""
    echo "You can still proceed with development, but consider fixing the warnings."
    echo ""
    exit 0
else
    echo -e "${RED}❌ Setup verification failed. Please address the failed checks above.${NC}"
    echo ""
    echo "Common solutions:"
    echo "  - Run 'npm install' if dependencies are missing"
    echo "  - Run 'npm run lint:fix' to fix linting issues"
    echo "  - Run 'npm run format' to fix formatting issues"
    echo "  - Check the error messages for specific issues"
    echo ""
    exit 1
fi
