#!/bin/bash

# Template Directory Structure Cleanup Script
# This script reorganizes the Phaser Game Template for clean template usage

set -e

echo "🧹 Starting Template Directory Structure Cleanup..."

# Create backup directory for safety
BACKUP_DIR="./backup-$(date +%Y%m%d-%H%M%S)"
mkdir -p "$BACKUP_DIR"

echo "📦 Creating backup at $BACKUP_DIR..."

# Backup files that will be moved or removed
cp -r "TODO Lists" "$BACKUP_DIR/" 2>/dev/null || true
cp -r "Reports" "$BACKUP_DIR/" 2>/dev/null || true
cp -r "research" "$BACKUP_DIR/" 2>/dev/null || true
cp "AI notes.md" "$BACKUP_DIR/" 2>/dev/null || true
cp "DEVELOPER_RECOMMENDATIONS.md" "$BACKUP_DIR/" 2>/dev/null || true
cp "DOCUMENTATION_CHANGELOG.md" "$BACKUP_DIR/" 2>/dev/null || true
cp "README-NEW-EDEN-BACKUP.md" "$BACKUP_DIR/" 2>/dev/null || true
cp "README-TEMPLATE.md" "$BACKUP_DIR/" 2>/dev/null || true

echo "🗂️  Cleaning up TODO Lists directory..."

# Keep only template-relevant TODO files
mkdir -p "docs/setup/todo"
mv "TODO Lists/PRE-DEVELOPMENT-TODO.md" "docs/setup/todo/template-setup-todo.md" 2>/dev/null || true

# Remove project-specific TODO files
rm -rf "TODO Lists"

echo "📚 Cleaning up documentation structure..."

# Remove development-specific documentation folders
rm -rf "docs/technical" 2>/dev/null || true
rm -rf "docs/systems" 2>/dev/null || true
rm -rf "docs/research" 2>/dev/null || true
rm -rf "docs/issues" 2>/dev/null || true
rm -rf "docs/epics" 2>/dev/null || true
rm -rf "docs/stories" 2>/dev/null || true
rm -rf "docs/world-design" 2>/dev/null || true
rm -rf "docs/business-strategy.md" 2>/dev/null || true
rm -rf "docs/market-research.md" 2>/dev/null || true

# Move development-specific files to appropriate locations
mkdir -p "docs/development"
mv "docs/brownfield-architecture.md" "docs/development/" 2>/dev/null || true
mv "docs/implementation-architecture.md" "docs/development/" 2>/dev/null || true

echo "🗄️  Organizing root directory..."

# Move development notes to docs
mkdir -p "docs/development/notes"
mv "AI notes.md" "docs/development/notes/" 2>/dev/null || true
mv "DEVELOPER_RECOMMENDATIONS.md" "docs/development/" 2>/dev/null || true
mv "DOCUMENTATION_CHANGELOG.md" "docs/development/" 2>/dev/null || true

# Move reports to docs
mkdir -p "docs/reports"
mv "Reports/QA-REVIEW-FINDINGS-AND-TODO.md" "docs/reports/" 2>/dev/null || true
mv "Reports/TECHNICAL_FEASIBILITY_ANALYSIS.md" "docs/reports/" 2>/dev/null || true
rm -rf "Reports" 2>/dev/null || true

# Move research to docs
mv "research" "docs/" 2>/dev/null || true

# Clean up redundant README files
rm -f "README-NEW-EDEN-BACKUP.md" 2>/dev/null || true
rm -f "README-TEMPLATE.md" 2>/dev/null || true

# Remove empty files/directories
rm -f "blank" 2>/dev/null || true

echo "📋 Creating template structure configuration..."

cat > "config/template-structure.json" << 'EOF'
{
  "templateStructure": {
    "core": {
      "src": ["src/", "assets/", "index.html"],
      "config": ["config/", "environments/"],
      "build": ["package.json", "vite-plugins/"]
    },
    "development": {
      "tools": ["tools/", "scripts/"],
      "testing": ["testing/"],
      "ci": [".github/", ".husky/"]
    },
    "documentation": {
      "essential": ["README.md", "docs/setup/", "docs/examples/"],
      "development": ["docs/development/", "docs/api/"]
    },
    "template": {
      "maxRootFiles": 15,
      "requiredDirectories": ["src", "assets", "config", "docs"],
      "optionalDirectories": ["scripts", "tools", "testing"]
    }
  }
}
EOF

echo "✅ Template directory structure cleanup completed!"
echo "📁 Backup created at: $BACKUP_DIR"
echo ""
echo "Next steps:"
echo "1. Update file path references in configuration files"
echo "2. Test build process with new structure"
echo "3. Update documentation with new structure"
