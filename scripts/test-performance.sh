#!/bin/bash
# Performance Testing Script for New Eden Project
# Ensures clean environment and proper build before running tests

set -e

echo "🔧 Setting up performance test environment..."

# Kill any existing preview servers
echo "📦 Cleaning up existing processes..."
pkill -f "vite preview" || true
sleep 2

# Ensure we have a fresh build
echo "🏗️  Building application..."
npm run build

# Give time for any cleanup
sleep 1

# Run performance tests
echo "🚀 Running performance tests..."
npx playwright test --project=performance --config testing/config/playwright.config.ts --timeout=180000

echo "✅ Performance tests completed!"
