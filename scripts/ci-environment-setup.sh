#!/bin/bash

# CI Environment Setup Script for GitHub Actions
# Prepares environment for reliable performance monitoring
# Handles CI-specific configurations and optimizations

set -euo pipefail

# Check if performance tests are disabled
SKIP_PERFORMANCE_SETUP="${SKIP_PERFORMANCE_SETUP:-false}"

if [[ "$SKIP_PERFORMANCE_SETUP" == "true" ]]; then
    echo "🚫 Performance test setup skipped (SKIP_PERFORMANCE_SETUP=true)"
    echo "✅ CI environment setup completed (performance tests disabled)"
    exit 0
fi

# Color output functions
red() { echo -e "\033[31m$*\033[0m"; }
green() { echo -e "\033[32m$*\033[0m"; }
yellow() { echo -e "\033[33m$*\033[0m"; }
blue() { echo -e "\033[34m$*\033[0m"; }

# Environment detection
IS_CI="${CI:-false}"
IS_GITHUB_ACTIONS="${GITHUB_ACTIONS:-false}"
RUNNER_OS="${RUNNER_OS:-unknown}"

log_info() {
    blue "ℹ️  $*"
}

log_success() {
    green "✅ $*"
}

log_warning() {
    yellow "⚠️  $*"
}

log_error() {
    red "❌ $*"
}

# Main setup function
setup_ci_environment() {
    log_info "Setting up CI environment for performance monitoring..."
    
    # Environment information
    log_info "Environment Detection:"
    echo "  CI: $IS_CI"
    echo "  GitHub Actions: $IS_GITHUB_ACTIONS" 
    echo "  Runner OS: $RUNNER_OS"
    echo "  Node Version: $(node --version 2>/dev/null || echo 'Not available')"
    echo "  NPM Version: $(npm --version 2>/dev/null || echo 'Not available')"
    
    # Set CI-specific environment variables
    if [[ "$IS_CI" == "true" ]]; then
        export NODE_ENV=production
        export PLAYWRIGHT_SKIP_BROWSER_DOWNLOAD=0
        export PLAYWRIGHT_BROWSERS_PATH=/ms-playwright
        
        # GitHub Actions specific optimizations
        if [[ "$IS_GITHUB_ACTIONS" == "true" ]]; then
            log_info "Applying GitHub Actions optimizations..."
            
            # Set memory limits for Node.js to prevent OOM
            export NODE_OPTIONS="--max-old-space-size=4096"
            
            # Optimize npm for CI
            export NPM_CONFIG_AUDIT=false
            export NPM_CONFIG_FUND=false
            export NPM_CONFIG_UPDATE_NOTIFIER=false
            
            # Set performance monitoring specific variables
            export PERFORMANCE_CI_MODE=true
            export PLAYWRIGHT_TIMEOUT_MULTIPLIER=2
            
            log_success "GitHub Actions environment configured"
        fi
        
        log_success "CI environment variables set"
    else
        log_info "Local development environment detected"
        export PERFORMANCE_CI_MODE=false
    fi
}

# Browser setup for performance testing
setup_browsers() {
    log_info "Setting up browsers for performance testing..."
    
    if [[ "$IS_CI" == "true" ]]; then
        # Install browsers with system dependencies for CI
        log_info "Installing Playwright browsers with system dependencies..."
        
        if command -v npx >/dev/null 2>&1; then
            # Set Playwright home directory to a writable location
            export PLAYWRIGHT_BROWSERS_PATH="${HOME}/.cache/ms-playwright"
            mkdir -p "${PLAYWRIGHT_BROWSERS_PATH}"
            
            # Install Chromium only for CI to save time and space
            log_info "Installing Chromium browser to ${PLAYWRIGHT_BROWSERS_PATH}..."
            if npx playwright install chromium; then
                log_success "Chromium browser installed successfully"
            else
                log_error "Failed to install Chromium browser"
                return 1
            fi
            
            # Install system dependencies
            log_info "Installing system dependencies..."
            if npx playwright install-deps chromium 2>/dev/null; then
                log_success "Browser dependencies installed successfully"
            else
                log_warning "Browser dependency installation had warnings (this may be normal in CI)"
            fi
            
            log_success "Browsers installed for CI environment"
        else
            log_error "npx not available, cannot install browsers"
            return 1
        fi
    else
        log_info "Local environment: Browsers should be installed manually if needed"
        log_info "Run: npx playwright install chromium"
    fi
}

# Performance monitoring configuration
setup_performance_config() {
    log_info "Configuring performance monitoring settings..."
    
    # Create performance configuration if it doesn't exist
    if [[ ! -f "config/ci-performance-thresholds.json" ]]; then
        log_warning "Performance configuration not found, using defaults"
        return 0
    fi
    
    # Validate configuration file
    if command -v node >/dev/null 2>&1; then
        if node -e "JSON.parse(require('fs').readFileSync('config/ci-performance-thresholds.json', 'utf8'))" 2>/dev/null; then
            log_success "Performance configuration validated"
        else
            log_error "Performance configuration is invalid JSON"
            return 1
        fi
    fi
    
    # Set timeout multipliers for CI
    if [[ "$IS_CI" == "true" ]]; then
        export PERFORMANCE_TIMEOUT_MULTIPLIER=2.0
        export PERFORMANCE_RETRY_ATTEMPTS=3
        export PERFORMANCE_BACKOFF_DELAY=2000
        
        log_success "CI performance timeouts configured"
    fi
}

# Memory and resource optimization
optimize_resources() {
    log_info "Optimizing system resources for performance testing..."
    
    if [[ "$IS_CI" == "true" ]]; then
        # Set memory limits and garbage collection settings
        export NODE_OPTIONS="${NODE_OPTIONS:-} --max-old-space-size=4096 --optimize-for-size"
        
        # Set npm cache cleanup
        if command -v npm >/dev/null 2>&1; then
            npm cache clean --force 2>/dev/null || log_warning "npm cache clean failed"
        fi
        
        # Set Git configuration for CI
        git config --global advice.detachedHead false 2>/dev/null || true
        
        log_success "Resource optimization applied for CI"
    else
        log_info "Local environment: Using default resource settings"
    fi
}

# Artifact setup
setup_artifacts() {
    log_info "Setting up artifact directories..."
    
    # Create directories for test results and reports
    mkdir -p test-results
    mkdir -p playwright-report
    mkdir -p coverage
    
    # Set permissions
    chmod 755 test-results playwright-report coverage 2>/dev/null || true
    
    # Clean old artifacts in CI to save space
    if [[ "$IS_CI" == "true" ]]; then
        # Remove old results but keep structure
        find test-results -name "*.json" -mtime +1 -delete 2>/dev/null || true
        find playwright-report -name "*.html" -mtime +1 -delete 2>/dev/null || true
        
        log_success "Artifact directories prepared and cleaned"
    else
        log_success "Artifact directories prepared"
    fi
}

# Error handling and logging setup
setup_error_handling() {
    log_info "Setting up error handling and logging..."
    
    # Create error log file
    export PERFORMANCE_ERROR_LOG="performance-errors.log"
    touch "$PERFORMANCE_ERROR_LOG"
    
    # Set error handling options
    export PERFORMANCE_FAIL_FAST=false
    export PERFORMANCE_VERBOSE_ERRORS=true
    
    if [[ "$IS_CI" == "true" ]]; then
        # More verbose logging in CI for debugging
        export DEBUG="playwright:*" 2>/dev/null || true
        export PERFORMANCE_LOG_LEVEL="info"
        
        log_success "CI error handling and logging configured"
    else
        export PERFORMANCE_LOG_LEVEL="warn"
        log_success "Local error handling configured"
    fi
}

# Network optimization for CI
setup_network_optimization() {
    if [[ "$IS_CI" == "true" ]]; then
        log_info "Applying network optimizations for CI..."
        
        # Set npm registry and timeouts
        export NPM_CONFIG_REGISTRY="https://registry.npmjs.org/"
        export NPM_CONFIG_TIMEOUT=60000
        export NPM_CONFIG_FETCH_TIMEOUT=60000
        
        # Set Git timeout
        git config --global http.timeout 60 2>/dev/null || true
        
        log_success "Network optimizations applied"
    fi
}

# Health check
health_check() {
    log_info "Running environment health check..."
    
    local errors=0
    
    # Check Node.js
    if ! command -v node >/dev/null 2>&1; then
        log_error "Node.js not found"
        ((errors++))
    else
        log_success "Node.js available: $(node --version)"
    fi
    
    # Check npm
    if ! command -v npm >/dev/null 2>&1; then
        log_error "npm not found"
        ((errors++))
    else
        log_success "npm available: $(npm --version)"
    fi
    
    # Check package.json
    if [[ ! -f "package.json" ]]; then
        log_error "package.json not found"
        ((errors++))
    else
        log_success "package.json found"
    fi
    
    # Check if dependencies are installed
    if [[ ! -d "node_modules" ]]; then
        log_warning "node_modules not found, dependencies may need to be installed"
    else
        log_success "node_modules directory found"
    fi
    
    # Check disk space in CI
    if [[ "$IS_CI" == "true" ]]; then
        local available_space
        available_space=$(df . | awk 'NR==2 {print $4}')
        if [[ "$available_space" -lt 1048576 ]]; then  # Less than 1GB
            log_warning "Low disk space: $(df -h . | awk 'NR==2 {print $4}') available"
        else
            log_success "Sufficient disk space available"
        fi
    fi
    
    if [[ $errors -eq 0 ]]; then
        log_success "Environment health check passed"
        return 0
    else
        log_error "Environment health check failed with $errors errors"
        return 1
    fi
}

# Main execution
main() {
    echo "🚀 CI Environment Setup for Performance Monitoring"
    echo "=================================================="
    
    # Run setup steps
    setup_ci_environment
    setup_browsers
    setup_performance_config
    optimize_resources
    setup_artifacts
    setup_error_handling
    setup_network_optimization
    
    # Final health check
    if health_check; then
        echo ""
        log_success "CI environment setup completed successfully!"
        echo ""
        log_info "Environment is ready for performance monitoring"
        
        # Output environment summary
        echo "Environment Summary:"
        echo "  Mode: $([ "$IS_CI" == "true" ] && echo "CI" || echo "Local")"
        echo "  Node: $(node --version 2>/dev/null || echo 'N/A')"
        echo "  Platform: $(uname -s 2>/dev/null || echo 'Unknown')"
        echo "  Memory Limit: ${NODE_OPTIONS:-default}"
        echo "  Performance Config: $([ -f "config/ci-performance-thresholds.json" ] && echo "✓" || echo "✗")"
        
        exit 0
    else
        echo ""
        log_error "CI environment setup failed!"
        exit 1
    fi
}

# Script entry point
if [[ "${BASH_SOURCE[0]}" == "${0}" ]]; then
    main "$@"
fi
