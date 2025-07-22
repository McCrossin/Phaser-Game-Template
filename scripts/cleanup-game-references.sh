#!/bin/bash

# Template Content Cleanup Script
# This script helps find and replace game-specific references with generic template content

echo "🧹 Phaser Game Template Cleanup Script"
echo "======================================="

# Function to search for potential game-specific references
search_references() {
    echo "🔍 Searching for potential game-specific references..."
    
    # Common patterns that might indicate game-specific content
    local patterns=(
        "New-Eden"
        "new-eden"
        "NEW_EDEN"
        "neweden"
        "spaceship"
        "probe"
        "cosmic"
        "universe"
        "automation"
        "space exploration"
    )
    
    for pattern in "${patterns[@]}"; do
        echo "Searching for: $pattern"
        grep -r --exclude-dir=node_modules --exclude-dir=.git --exclude="*.md" --exclude="cleanup-game-references.sh" "$pattern" . || echo "  ✅ No matches found"
    done
}

# Function to replace game-specific content with generic content
replace_content() {
    echo "🔄 Replacing game-specific content with generic placeholders..."
    
    # Read template variables
    if [ -f "config/template-variables.json" ]; then
        echo "📋 Using template variables from config/template-variables.json"
        
        # Replace spaceship references
        find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.json" \) -not -path "./node_modules/*" -not -path "./.git/*" \
            -exec sed -i 's/spaceship/playerCharacter/g' {} \;
        
        # Replace space exploration references
        find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.json" \) -not -path "./node_modules/*" -not -path "./.git/*" \
            -exec sed -i 's/space exploration/game mechanics/g' {} \;
        
        # Replace probe references
        find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.json" \) -not -path "./node_modules/*" -not -path "./.git/*" \
            -exec sed -i 's/probe/character/g' {} \;
        
        # Replace universe references
        find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.json" \) -not -path "./node_modules/*" -not -path "./.git/*" \
            -exec sed -i 's/universe/gameWorld/g' {} \;
        
        echo "✅ Content replacement completed"
    else
        echo "⚠️  Template variables file not found. Please create config/template-variables.json"
    fi
}

# Function to validate cleanup
validate_cleanup() {
    echo "🔍 Validating cleanup..."
    
    # Check for remaining New-Eden references
    local new_eden_count=$(grep -r --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=testing --exclude="*.md" --exclude="cleanup-game-references.sh" "New-Eden\|new-eden\|NEW_EDEN" . | wc -l)
    
    if [ "$new_eden_count" -eq 0 ]; then
        echo "✅ No New-Eden references found in code files"
    else
        echo "⚠️  Found $new_eden_count remaining New-Eden references"
        grep -r --exclude-dir=node_modules --exclude-dir=.git --exclude-dir=testing --exclude="*.md" --exclude="cleanup-game-references.sh" "New-Eden\|new-eden\|NEW_EDEN" .
    fi
    
    # Check template variables exist
    if [ -f "config/template-variables.json" ]; then
        echo "✅ Template variables file exists"
    else
        echo "❌ Template variables file missing"
    fi
}

# Main execution
case "${1:-help}" in
    "search")
        search_references
        ;;
    "replace")
        replace_content
        ;;
    "validate")
        validate_cleanup
        ;;
    "full")
        search_references
        echo ""
        replace_content
        echo ""
        validate_cleanup
        ;;
    "help"|*)
        echo "Usage: $0 [command]"
        echo ""
        echo "Commands:"
        echo "  search    - Search for game-specific references"
        echo "  replace   - Replace game-specific content with generic placeholders"
        echo "  validate  - Validate that cleanup is complete"
        echo "  full      - Run all steps (search, replace, validate)"
        echo "  help      - Show this help message"
        echo ""
        echo "Example: ./scripts/cleanup-game-references.sh full"
        ;;
esac

echo "🏁 Cleanup script completed"
