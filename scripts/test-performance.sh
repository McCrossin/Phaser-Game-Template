#!/bin/bash
# Performance Testing Script for New Eden Project
# Ensures clean environment and proper build before running tests

set -e

echo "🔧 Setting up performance test environment..."
echo "📋 Arguments received: $@"

# Parse arguments
EXTRA_ARGS=""
while [[ $# -gt 0 ]]; do
    case $1 in
        --timeout=*)
            TIMEOUT="${1#*=}"
            echo "⏱️  Custom timeout: $TIMEOUT"
            shift
            ;;
        *)
            EXTRA_ARGS="$EXTRA_ARGS $1"
            shift
            ;;
    esac
done

# Detect CI environment
if [ "$CI" = "true" ]; then
    echo "🏗️ Running in CI environment"
    export CI=true
    DEFAULT_TIMEOUT=300000
else
    echo "🏠 Running in local environment"
    DEFAULT_TIMEOUT=180000
fi

# Use custom timeout or default
FINAL_TIMEOUT=${TIMEOUT:-$DEFAULT_TIMEOUT}
echo "⏱️  Using timeout: $FINAL_TIMEOUT ms"

# Kill any existing preview servers
echo "📦 Cleaning up existing processes..."
pkill -f "vite preview" || true
pkill -f "playwright" || true
sleep 2

# Ensure we have a fresh build
echo "🏗️  Building application..."
npm run build

# Give time for any cleanup
sleep 1

# Health check function
check_server_health() {
    local url=$1
    local max_attempts=30
    local attempt=1
    
    echo "🔍 Checking server health at $url..."
    
    while [ $attempt -le $max_attempts ]; do
        if curl -sf "$url" > /dev/null 2>&1; then
            echo "✅ Server is responding (attempt $attempt)"
            
            # Additional check: verify content
            local response=$(curl -s "$url" | head -10)
            if echo "$response" | grep -q "html\|HTML"; then
                echo "✅ Server serving HTML content"
                return 0
            else
                echo "⚠️  Server responding but not serving HTML"
                echo "Response preview: $response"
            fi
        fi
        echo "⏳ Waiting for server... (attempt $attempt/$max_attempts)"
        sleep 2
        attempt=$((attempt + 1))
    done
    
    echo "❌ Server failed to respond after $max_attempts attempts"
    
    # Debug information
    echo "🔍 Debug information:"
    echo "- Checking if port 4173 is in use:"
    netstat -tlnp | grep 4173 || echo "  Port 4173 not found"
    echo "- Checking dist directory:"
    ls -la dist/ || echo "  No dist directory found"
    echo "- Checking for index.html:"
    find . -name "index.html" -type f | head -5
    
    return 1
}

# Run performance tests
echo "🚀 Running performance tests..."
if [ "$CI" = "true" ]; then
    # CI environment with manual server management and CI config
    echo "🚀 Starting preview server in background..."
    npm run preview &
    SERVER_PID=$!
    
    # Check if server is healthy
    if check_server_health "http://localhost:4173"; then
        # Run tests with CI config
        npx playwright test --project=performance --config testing/config/playwright-ci.config.ts --timeout=$FINAL_TIMEOUT --retries=2 $EXTRA_ARGS
        TEST_RESULT=$?
    else
        echo "❌ Server health check failed"
        TEST_RESULT=1
    fi
    
    # Stop server
    echo "🛑 Stopping preview server..."
    kill $SERVER_PID || true
    
    if [ $TEST_RESULT -eq 0 ]; then
        echo "✅ Performance tests completed successfully!"
    else
        echo "❌ Performance tests failed!"
        exit $TEST_RESULT
    fi
else
    # Local environment with integrated webServer
    npx playwright test --project=performance --config testing/config/playwright.config.ts --timeout=$FINAL_TIMEOUT $EXTRA_ARGS
    echo "✅ Performance tests completed!"
fi
