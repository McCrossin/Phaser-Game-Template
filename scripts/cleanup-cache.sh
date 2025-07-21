#!/bin/bash
# Cache Cleanup Script for Phaser Game Template
# Removes all cached files, build artifacts, and temporary files for clean template state

set -e

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Script configuration
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(dirname "$SCRIPT_DIR")"
BACKUP_ENABLED=false
DRY_RUN=false

# Parse command line arguments
while [[ $# -gt 0 ]]; do
    case $1 in
        --backup)
            BACKUP_ENABLED=true
            shift
            ;;
        --dry-run)
            DRY_RUN=true
            shift
            ;;
        --help)
            echo "Usage: $0 [options]"
            echo "Options:"
            echo "  --backup     Create backup before cleanup"
            echo "  --dry-run    Show what would be deleted without deleting"
            echo "  --help       Show this help message"
            exit 0
            ;;
        *)
            echo "Unknown option: $1"
            exit 1
            ;;
    esac
done

log() {
    local level=$1
    shift
    case $level in
        "info")
            echo -e "${BLUE}ℹ️  $*${NC}"
            ;;
        "success")
            echo -e "${GREEN}✅ $*${NC}"
            ;;
        "warning")
            echo -e "${YELLOW}⚠️  $*${NC}"
            ;;
        "error")
            echo -e "${RED}❌ $*${NC}"
            ;;
    esac
}

# Function to safely remove directory or file
safe_remove() {
    local target="$1"
    local description="$2"
    
    if [ ! -e "$target" ]; then
        log "info" "$description: Not found, skipping"
        return 0
    fi
    
    local size=""
    if [ -d "$target" ]; then
        size=$(du -sh "$target" 2>/dev/null | cut -f1 || echo "unknown")
    elif [ -f "$target" ]; then
        size=$(ls -lh "$target" 2>/dev/null | awk '{print $5}' || echo "unknown")
    fi
    
    if [ "$DRY_RUN" = true ]; then
        log "warning" "[DRY RUN] Would remove $description ($size): $target"
        return 0
    fi
    
    log "info" "Removing $description ($size): $target"
    rm -rf "$target"
    
    if [ $? -eq 0 ]; then
        log "success" "Successfully removed $description"
    else
        log "error" "Failed to remove $description"
        return 1
    fi
}

# Function to create backup
create_backup() {
    if [ "$BACKUP_ENABLED" = true ] && [ "$DRY_RUN" = false ]; then
        local backup_dir="$PROJECT_ROOT/backup-$(date +%Y%m%d-%H%M%S)"
        log "info" "Creating backup at $backup_dir"
        
        mkdir -p "$backup_dir"
        
        # Backup important cache/build directories
        [ -d "$PROJECT_ROOT/node_modules" ] && cp -r "$PROJECT_ROOT/node_modules" "$backup_dir/"
        [ -d "$PROJECT_ROOT/dist" ] && cp -r "$PROJECT_ROOT/dist" "$backup_dir/"
        [ -f "$PROJECT_ROOT/package-lock.json" ] && cp "$PROJECT_ROOT/package-lock.json" "$backup_dir/"
        
        log "success" "Backup created at $backup_dir"
    fi
}

# Function to check disk space before and after
check_disk_space() {
    local label="$1"
    local space=$(df -h "$PROJECT_ROOT" | awk 'NR==2 {print $4}')
    log "info" "Available disk space $label: $space"
}

# Main cleanup function
main() {
    log "info" "Starting cache cleanup for Phaser Game Template"
    log "info" "Project root: $PROJECT_ROOT"
    
    if [ "$DRY_RUN" = true ]; then
        log "warning" "DRY RUN MODE - No files will be deleted"
    fi
    
    # Change to project root
    cd "$PROJECT_ROOT"
    
    # Check initial disk space
    check_disk_space "before cleanup"
    
    # Create backup if requested
    create_backup
    
    # Safety check - ensure we're in the right directory
    if [ ! -f "package.json" ]; then
        log "error" "package.json not found. Are you in the correct project directory?"
        exit 1
    fi
    
    log "info" "Starting cleanup process..."
    
    # 1. Remove node_modules and package manager caches
    log "info" "=== Cleaning Package Manager Cache ==="
    safe_remove "node_modules" "Node.js dependencies"
    safe_remove "package-lock.json" "NPM lock file"
    safe_remove "yarn.lock" "Yarn lock file"
    safe_remove ".pnpm-store" "PNPM store"
    
    # Clear npm cache
    if [ "$DRY_RUN" = false ]; then
        log "info" "Clearing npm cache..."
        npm cache clean --force 2>/dev/null || log "warning" "NPM cache clean failed (non-critical)"
    fi
    
    # 2. Remove build artifacts
    log "info" "=== Cleaning Build Artifacts ==="
    safe_remove "dist" "Build output directory"
    safe_remove "build" "Build directory"
    safe_remove ".tsbuildinfo" "TypeScript build info"
    safe_remove "*.tsbuildinfo" "TypeScript build info files"
    
    # 3. Remove test artifacts and coverage
    log "info" "=== Cleaning Test Artifacts ==="
    safe_remove "coverage" "Test coverage reports"
    safe_remove "test-results" "Test results"
    safe_remove "playwright-report" "Playwright test reports"
    safe_remove ".nyc_output" "NYC coverage output"
    safe_remove "junit.xml" "JUnit test results"
    
    # 4. Remove IDE and tool caches
    log "info" "=== Cleaning IDE and Tool Caches ==="
    safe_remove ".vscode/.browse.vc.db*" "VS Code browse database"
    safe_remove ".vscode/settings.json.bak" "VS Code settings backup"
    safe_remove ".eslintcache" "ESLint cache"
    safe_remove ".prettiercache" "Prettier cache"
    safe_remove ".swc" "SWC cache"
    safe_remove ".next" "Next.js cache"
    safe_remove ".cache" "General cache directory"
    safe_remove "*.log" "Log files"
    
    # 5. Remove Vite and build tool caches
    log "info" "=== Cleaning Build Tool Caches ==="
    safe_remove "node_modules/.cache" "Node modules cache"
    safe_remove "node_modules/.vite" "Vite cache in node_modules"
    safe_remove ".vite" "Vite cache"
    safe_remove "vite.config.js.timestamp-*" "Vite config timestamps"
    
    # 6. Remove OS and temporary files
    log "info" "=== Cleaning OS and Temporary Files ==="
    safe_remove ".DS_Store" "macOS metadata files"
    safe_remove "Thumbs.db" "Windows thumbnail cache"
    safe_remove "desktop.ini" "Windows desktop config"
    safe_remove "*.tmp" "Temporary files"
    safe_remove "*.temp" "Temporary files"
    
    # Find and remove additional cache patterns
    if [ "$DRY_RUN" = false ]; then
        # Remove any additional .cache directories recursively
        find . -name ".cache" -type d -not -path "./node_modules/*" -exec rm -rf {} + 2>/dev/null || true
        
        # Remove any *.log files recursively
        find . -name "*.log" -type f -not -path "./node_modules/*" -delete 2>/dev/null || true
        
        # Remove any .tsbuildinfo files recursively
        find . -name "*.tsbuildinfo" -type f -delete 2>/dev/null || true
    fi
    
    # Check final disk space
    check_disk_space "after cleanup"
    
    # Git status check
    if [ "$DRY_RUN" = false ]; then
        log "info" "=== Git Status Check ==="
        if command -v git >/dev/null 2>&1 && [ -d ".git" ]; then
            git status --porcelain | head -10 || log "warning" "Git status check failed"
        else
            log "info" "Not a git repository or git not available"
        fi
    fi
    
    if [ "$DRY_RUN" = true ]; then
        log "info" "DRY RUN COMPLETE - No files were actually deleted"
        log "info" "Run without --dry-run to perform actual cleanup"
    else
        log "success" "Cache cleanup completed successfully!"
        log "info" "Next steps:"
        log "info" "1. Run 'npm install' to reinstall dependencies"
        log "info" "2. Run 'npm run build' to verify build works"
        log "info" "3. Run test suite to ensure functionality"
    fi
}

# Trap to handle script interruption
trap 'log "error" "Script interrupted"; exit 1' INT TERM

# Run main function
main "$@"
