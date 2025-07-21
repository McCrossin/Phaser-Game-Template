# Cache Cleanup Script for Phaser Game Template (PowerShell)
# Removes all cached files, build artifacts, and temporary files for clean template state

param(
    [switch]$Backup,
    [switch]$DryRun,
    [switch]$Help
)

# Script configuration
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$ProjectRoot = Split-Path -Parent $ScriptDir
$BackupEnabled = $Backup.IsPresent
$DryRunMode = $DryRun.IsPresent

# Show help
if ($Help) {
    Write-Host "Usage: .\cleanup-cache.ps1 [options]"
    Write-Host "Options:"
    Write-Host "  -Backup     Create backup before cleanup"
    Write-Host "  -DryRun     Show what would be deleted without deleting"
    Write-Host "  -Help       Show this help message"
    exit 0
}

# Function to write colored output
function Write-Log {
    param(
        [string]$Level,
        [string]$Message
    )
    
    switch ($Level) {
        "Info" { 
            Write-Host "ℹ️  $Message" -ForegroundColor Blue 
        }
        "Success" { 
            Write-Host "✅ $Message" -ForegroundColor Green 
        }
        "Warning" { 
            Write-Host "⚠️  $Message" -ForegroundColor Yellow 
        }
        "Error" { 
            Write-Host "❌ $Message" -ForegroundColor Red 
        }
    }
}

# Function to safely remove directory or file
function Remove-SafelyWithInfo {
    param(
        [string]$Path,
        [string]$Description
    )
    
    $FullPath = Join-Path $ProjectRoot $Path
    
    if (-not (Test-Path $FullPath)) {
        Write-Log "Info" "$Description`: Not found, skipping"
        return $true
    }
    
    $Size = "unknown"
    try {
        if (Test-Path $FullPath -PathType Container) {
            $SizeBytes = (Get-ChildItem $FullPath -Recurse -Force | Measure-Object -Property Length -Sum).Sum
            $Size = [math]::Round($SizeBytes / 1MB, 2).ToString() + " MB"
        } elseif (Test-Path $FullPath -PathType Leaf) {
            $SizeBytes = (Get-Item $FullPath).Length
            $Size = [math]::Round($SizeBytes / 1KB, 2).ToString() + " KB"
        }
    } catch {
        $Size = "unknown"
    }
    
    if ($DryRunMode) {
        Write-Log "Warning" "[DRY RUN] Would remove $Description ($Size): $FullPath"
        return $true
    }
    
    Write-Log "Info" "Removing $Description ($Size): $FullPath"
    
    try {
        if (Test-Path $FullPath -PathType Container) {
            Remove-Item $FullPath -Recurse -Force
        } else {
            Remove-Item $FullPath -Force
        }
        Write-Log "Success" "Successfully removed $Description"
        return $true
    } catch {
        Write-Log "Error" "Failed to remove $Description`: $($_.Exception.Message)"
        return $false
    }
}

# Function to create backup
function New-Backup {
    if ($BackupEnabled -and -not $DryRunMode) {
        $BackupDir = Join-Path $ProjectRoot "backup-$(Get-Date -Format 'yyyyMMdd-HHmmss')"
        Write-Log "Info" "Creating backup at $BackupDir"
        
        try {
            New-Item -ItemType Directory -Path $BackupDir -Force | Out-Null
            
            # Backup important cache/build directories
            $NodeModules = Join-Path $ProjectRoot "node_modules"
            $Dist = Join-Path $ProjectRoot "dist"
            $PackageLock = Join-Path $ProjectRoot "package-lock.json"
            
            if (Test-Path $NodeModules) {
                Copy-Item $NodeModules -Destination $BackupDir -Recurse -Force
            }
            if (Test-Path $Dist) {
                Copy-Item $Dist -Destination $BackupDir -Recurse -Force
            }
            if (Test-Path $PackageLock) {
                Copy-Item $PackageLock -Destination $BackupDir -Force
            }
            
            Write-Log "Success" "Backup created at $BackupDir"
        } catch {
            Write-Log "Error" "Failed to create backup: $($_.Exception.Message)"
        }
    }
}

# Function to check disk space
function Get-DiskSpace {
    param([string]$Label)
    
    try {
        $Drive = Split-Path $ProjectRoot -Qualifier
        $Disk = Get-WmiObject -Class Win32_LogicalDisk -Filter "DeviceID='$Drive'"
        $FreeSpaceGB = [math]::Round($Disk.FreeSpace / 1GB, 2)
        Write-Log "Info" "Available disk space $Label`: $FreeSpaceGB GB"
    } catch {
        Write-Log "Warning" "Could not determine disk space"
    }
}

# Main cleanup function
function Start-Cleanup {
    Write-Log "Info" "Starting cache cleanup for Phaser Game Template"
    Write-Log "Info" "Project root: $ProjectRoot"
    
    if ($DryRunMode) {
        Write-Log "Warning" "DRY RUN MODE - No files will be deleted"
    }
    
    # Change to project root
    Set-Location $ProjectRoot
    
    # Check initial disk space
    Get-DiskSpace "before cleanup"
    
    # Create backup if requested
    New-Backup
    
    # Safety check - ensure we're in the right directory
    if (-not (Test-Path "package.json")) {
        Write-Log "Error" "package.json not found. Are you in the correct project directory?"
        exit 1
    }
    
    Write-Log "Info" "Starting cleanup process..."
    
    # 1. Remove node_modules and package manager caches
    Write-Log "Info" "=== Cleaning Package Manager Cache ==="
    Remove-SafelyWithInfo "node_modules" "Node.js dependencies"
    Remove-SafelyWithInfo "package-lock.json" "NPM lock file"
    Remove-SafelyWithInfo "yarn.lock" "Yarn lock file"
    Remove-SafelyWithInfo ".pnpm-store" "PNPM store"
    
    # Clear npm cache
    if (-not $DryRunMode) {
        Write-Log "Info" "Clearing npm cache..."
        try {
            & npm cache clean --force 2>$null
        } catch {
            Write-Log "Warning" "NPM cache clean failed (non-critical)"
        }
    }
    
    # 2. Remove build artifacts
    Write-Log "Info" "=== Cleaning Build Artifacts ==="
    Remove-SafelyWithInfo "dist" "Build output directory"
    Remove-SafelyWithInfo "build" "Build directory"
    Remove-SafelyWithInfo ".tsbuildinfo" "TypeScript build info"
    
    # 3. Remove test artifacts and coverage
    Write-Log "Info" "=== Cleaning Test Artifacts ==="
    Remove-SafelyWithInfo "coverage" "Test coverage reports"
    Remove-SafelyWithInfo "test-results" "Test results"
    Remove-SafelyWithInfo "playwright-report" "Playwright test reports"
    Remove-SafelyWithInfo ".nyc_output" "NYC coverage output"
    Remove-SafelyWithInfo "junit.xml" "JUnit test results"
    
    # 4. Remove IDE and tool caches
    Write-Log "Info" "=== Cleaning IDE and Tool Caches ==="
    Remove-SafelyWithInfo ".eslintcache" "ESLint cache"
    Remove-SafelyWithInfo ".prettiercache" "Prettier cache"
    Remove-SafelyWithInfo ".swc" "SWC cache"
    Remove-SafelyWithInfo ".next" "Next.js cache"
    Remove-SafelyWithInfo ".cache" "General cache directory"
    
    # 5. Remove Vite and build tool caches
    Write-Log "Info" "=== Cleaning Build Tool Caches ==="
    Remove-SafelyWithInfo ".vite" "Vite cache"
    
    # 6. Remove OS and temporary files
    Write-Log "Info" "=== Cleaning OS and Temporary Files ==="
    Remove-SafelyWithInfo "Thumbs.db" "Windows thumbnail cache"
    Remove-SafelyWithInfo "desktop.ini" "Windows desktop config"
    
    # Find and remove additional patterns
    if (-not $DryRunMode) {
        # Remove *.tsbuildinfo files recursively
        try {
            Get-ChildItem -Path $ProjectRoot -Filter "*.tsbuildinfo" -Recurse | Remove-Item -Force
        } catch {
            # Silent fail - these may not exist
        }
        
        # Remove *.log files recursively (excluding node_modules)
        try {
            Get-ChildItem -Path $ProjectRoot -Filter "*.log" -Recurse | Where-Object { $_.FullName -notlike "*node_modules*" } | Remove-Item -Force
        } catch {
            # Silent fail - these may not exist
        }
    }
    
    # Check final disk space
    Get-DiskSpace "after cleanup"
    
    # Git status check
    if (-not $DryRunMode) {
        Write-Log "Info" "=== Git Status Check ==="
        if (Get-Command git -ErrorAction SilentlyContinue) {
            if (Test-Path ".git") {
                try {
                    $GitStatus = & git status --porcelain 2>$null | Select-Object -First 10
                    if ($GitStatus) {
                        Write-Log "Info" "Git working directory has changes"
                    } else {
                        Write-Log "Success" "Git working directory is clean"
                    }
                } catch {
                    Write-Log "Warning" "Git status check failed"
                }
            } else {
                Write-Log "Info" "Not a git repository"
            }
        } else {
            Write-Log "Info" "Git not available"
        }
    }
    
    if ($DryRunMode) {
        Write-Log "Info" "DRY RUN COMPLETE - No files were actually deleted"
        Write-Log "Info" "Run without -DryRun to perform actual cleanup"
    } else {
        Write-Log "Success" "Cache cleanup completed successfully!"
        Write-Log "Info" "Next steps:"
        Write-Log "Info" "1. Run 'npm install' to reinstall dependencies"
        Write-Log "Info" "2. Run 'npm run build' to verify build works"
        Write-Log "Info" "3. Run test suite to ensure functionality"
    }
}

# Error handling
try {
    Start-Cleanup
} catch {
    Write-Log "Error" "Script failed: $($_.Exception.Message)"
    exit 1
}
