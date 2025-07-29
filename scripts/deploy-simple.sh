#!/bin/bash

# Simple Game Deployment Script
# Builds and deploys the game to specified environment

set -e

# Configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
DIST_DIR="$PROJECT_ROOT/dist"

# Default values
ENVIRONMENT="${1:-staging}"
SKIP_BUILD="${2:-false}"

echo "🎮 Simple Game Deployment"
echo "=========================="
echo "Environment: $ENVIRONMENT"
echo "Project: $(basename "$PROJECT_ROOT")"
echo "Skip Build: $SKIP_BUILD"
echo ""

# Validate environment
case "$ENVIRONMENT" in
    "development"|"staging"|"production")
        echo "✅ Valid environment: $ENVIRONMENT"
        ;;
    *)
        echo "❌ Invalid environment: $ENVIRONMENT"
        echo "Valid options: development, staging, production"
        exit 1
        ;;
esac

# Change to project directory
cd "$PROJECT_ROOT"

# Build the game (unless skipped)
if [ "$SKIP_BUILD" != "true" ]; then
    echo "🔨 Building game for $ENVIRONMENT..."
    
    # Set environment
    export NODE_ENV="$ENVIRONMENT"
    
    # Install dependencies if needed
    if [ ! -d "node_modules" ] || [ "package.json" -nt "node_modules" ]; then
        echo "📦 Installing dependencies..."
        npm ci --prefer-offline --no-audit --no-fund
    fi
    
    # Build the game
    npm run build
    
    echo "✅ Build completed successfully!"
else
    echo "⏭️  Skipping build (using existing dist/)"
fi

# Verify build exists
if [ ! -d "$DIST_DIR" ]; then
    echo "❌ Build directory not found: $DIST_DIR"
    echo "Run without skip-build or build manually first"
    exit 1
fi

# Show build info
echo ""
echo "📊 Build Information:"
echo "   📁 Build size: $(du -sh "$DIST_DIR" | cut -f1)"
echo "   📋 Files: $(find "$DIST_DIR" -type f | wc -l)"
echo "   🎯 Main bundle: $(find "$DIST_DIR" -name "*.js" -exec du -sh {} \; | head -1)"

# Simple deployment options
echo ""
echo "🚀 Deployment Options:"
echo "   1. GitHub Pages (automatic via GitHub Actions)"
echo "   2. Copy to local server directory"
echo "   3. Upload via SCP/SFTP"
echo "   4. Docker container"

echo ""
echo "✅ Game ready for deployment!"
echo "   📁 Built files: $DIST_DIR"
echo "   🌍 Environment: $ENVIRONMENT"

# Optional: Open build in browser for quick testing
if command -v open &> /dev/null && [ "$ENVIRONMENT" = "development" ]; then
    echo ""
    echo "🌐 Opening in browser for testing..."
    open "$DIST_DIR/index.html"
elif command -v xdg-open &> /dev/null && [ "$ENVIRONMENT" = "development" ]; then
    echo ""
    echo "🌐 Opening in browser for testing..."
    xdg-open "$DIST_DIR/index.html"
fi

echo ""
echo "🎉 Deployment preparation complete!"
