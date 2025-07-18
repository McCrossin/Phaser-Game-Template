#!/bin/bash

# Docker Build Debug Script
echo "=== Docker Build Debug ==="

echo "1. Testing npm ci..."
npm ci

echo "2. Testing TypeScript compilation..."
npx tsc --noEmit

echo "3. Testing Vite build..."
npm run build

echo "4. Testing build-info generation..."
echo '{"version":"docker-build","buildTime":"'$(date -Iseconds)'","gitCommit":"docker","gitBranch":"docker","nodeVersion":"'$(node --version)'","npmVersion":"'$(npm --version)'","environment":"production"}' > dist/build-info.json

echo "5. Checking dist directory..."
ls -la dist/

echo "=== Debug Complete ==="
