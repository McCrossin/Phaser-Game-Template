#!/bin/bash

# Weekly Health Report Generator
# Part of SETUP-006 Project Health & Documentation Enhancement

set -e

# Configuration
REPORT_DIR="reports/health"
TIMESTAMP=$(date '+%Y-%m-%d_%H-%M-%S')
REPORT_FILE="${REPORT_DIR}/health-report-${TIMESTAMP}.md"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo -e "${BLUE}📊 Generating Weekly Health Report...${NC}"

# Create reports directory if it doesn't exist
mkdir -p "$REPORT_DIR"

# Initialize report file
cat > "$REPORT_FILE" << EOF
# 📊 Project Health Report

**Generated**: $(date)  
**Environment**: $(if [ "$CI" = "true" ]; then echo "CI"; else echo "Local Development"; fi)  
**Branch**: $(git branch --show-current 2>/dev/null || echo "unknown")  
**Commit**: $(git rev-parse --short HEAD 2>/dev/null || echo "unknown")  

---

EOF

echo -e "${YELLOW}� Compiling monitoring tools...${NC}"

# Compile TypeScript monitoring tools
npx tsc tools/monitoring/health-check.ts --outDir tools/monitoring/compiled --target es2022 --module node16 --moduleResolution node16 --allowSyntheticDefaultImports --esModuleInterop
npx tsc tools/monitoring/technical-debt-tracker.ts --outDir tools/monitoring/compiled --target es2022 --module node16 --moduleResolution node16 --allowSyntheticDefaultImports --esModuleInterop

echo -e "${YELLOW}�🔍 Running framework health check...${NC}"

# Run health check and capture output
if node tools/monitoring/compiled/health-check.js > health-check-temp.txt 2>&1; then
    HEALTH_STATUS="✅ Passed"
    HEALTH_EXIT_CODE=0
    echo -e "${GREEN}✅ Health check passed${NC}"
else
    HEALTH_STATUS="❌ Failed"
    HEALTH_EXIT_CODE=$?
    echo -e "${RED}❌ Health check failed with exit code $HEALTH_EXIT_CODE${NC}"
fi

# Add health check results to report
cat >> "$REPORT_FILE" << EOF
## 🔍 Framework Health Check

**Status**: $HEALTH_STATUS

\`\`\`
$(cat health-check-temp.txt)
\`\`\`

EOF

echo -e "${YELLOW}🏗️ Running technical debt scan...${NC}"

# Run technical debt scan and capture output
if node tools/monitoring/compiled/technical-debt-tracker.js > debt-scan-temp.txt 2>&1; then
    DEBT_STATUS="✅ Acceptable"
    DEBT_EXIT_CODE=0
    echo -e "${GREEN}✅ Technical debt scan completed${NC}"
else
    DEBT_STATUS="⚠️ Needs Attention"
    DEBT_EXIT_CODE=$?
    echo -e "${YELLOW}⚠️ Technical debt scan flagged issues${NC}"
fi

# Add technical debt results to report
cat >> "$REPORT_FILE" << EOF
## 🏗️ Technical Debt Analysis

**Status**: $DEBT_STATUS

\`\`\`
$(cat debt-scan-temp.txt)
\`\`\`

EOF

echo -e "${YELLOW}⚡ Checking performance metrics...${NC}"

# Check if performance results exist
PERF_STATUS="ℹ️ Not Available"
if [ -f "performance-results.json" ]; then
    PERF_STATUS="📊 Available"
    echo -e "${GREEN}📊 Performance results found${NC}"
    
    cat >> "$REPORT_FILE" << EOF
## ⚡ Performance Metrics

**Status**: $PERF_STATUS

### Current Performance Results
\`\`\`json
$(cat performance-results.json)
\`\`\`

EOF
else
    echo -e "${YELLOW}ℹ️ No performance results found${NC}"
    
    cat >> "$REPORT_FILE" << EOF
## ⚡ Performance Metrics

**Status**: $PERF_STATUS

Performance baseline data not available. Run performance tests to generate baseline metrics.

EOF
fi

echo -e "${YELLOW}📦 Checking project metrics...${NC}"

# Get project statistics
TOTAL_FILES=$(find src -name "*.ts" -o -name "*.js" | wc -l)
TOTAL_TESTS=$(find testing -name "*.test.ts" -o -name "*.test.js" | wc -l 2>/dev/null || echo "0")
PACKAGE_JSON_EXISTS=$([ -f "package.json" ] && echo "✅" || echo "❌")

# Check bundle size if dist exists
BUNDLE_SIZE="Not built"
if [ -d "dist" ]; then
    BUNDLE_SIZE=$(du -sh dist 2>/dev/null | cut -f1 || echo "Unknown")
fi

# Add project metrics to report
cat >> "$REPORT_FILE" << EOF
## 📦 Project Metrics

### Code Statistics
- **Source Files**: $TOTAL_FILES TypeScript/JavaScript files
- **Test Files**: $TOTAL_TESTS test files
- **Bundle Size**: $BUNDLE_SIZE
- **Package.json**: $PACKAGE_JSON_EXISTS

### Git Statistics
- **Branch**: $(git branch --show-current 2>/dev/null || echo "unknown")
- **Commits**: $(git rev-list --count HEAD 2>/dev/null || echo "unknown")
- **Last Commit**: $(git log -1 --format="%h - %s (%cr)" 2>/dev/null || echo "unknown")

### Dependencies
- **Production**: $(jq -r '.dependencies | length' package.json 2>/dev/null || echo "unknown")
- **Development**: $(jq -r '.devDependencies | length' package.json 2>/dev/null || echo "unknown")

EOF

echo -e "${YELLOW}📈 Generating health trends...${NC}"

# Calculate overall health score
OVERALL_SCORE="Unknown"
if [ $HEALTH_EXIT_CODE -eq 0 ] && [ $DEBT_EXIT_CODE -eq 0 ]; then
    OVERALL_SCORE="85-95 (Estimated Good)"
    TREND_COLOR=$GREEN
    TREND_ICON="📈"
elif [ $HEALTH_EXIT_CODE -eq 0 ] || [ $DEBT_EXIT_CODE -eq 0 ]; then
    OVERALL_SCORE="60-75 (Estimated Warning)"
    TREND_COLOR=$YELLOW
    TREND_ICON="📊"
else
    OVERALL_SCORE="30-50 (Estimated Critical)"
    TREND_COLOR=$RED
    TREND_ICON="📉"
fi

echo -e "${TREND_COLOR}${TREND_ICON} Overall health score: $OVERALL_SCORE${NC}"

# Add trends section to report
cat >> "$REPORT_FILE" << EOF
## 📈 Health Trends

### Overall Assessment
- **Health Score**: $OVERALL_SCORE
- **Framework Health**: $HEALTH_STATUS
- **Technical Debt**: $DEBT_STATUS
- **Performance Data**: $PERF_STATUS

### Recommendations
EOF

# Generate recommendations based on results
if [ $HEALTH_EXIT_CODE -ne 0 ]; then
    cat >> "$REPORT_FILE" << EOF
- 🚨 **Framework Health Issues**: Review health check output and address critical issues
EOF
fi

if [ $DEBT_EXIT_CODE -ne 0 ]; then
    cat >> "$REPORT_FILE" << EOF
- ⚠️ **Technical Debt Attention**: Review technical debt report and prioritize high-severity items
EOF
fi

if [ ! -f "performance-results.json" ]; then
    cat >> "$REPORT_FILE" << EOF
- 📊 **Performance Baseline**: Run performance tests to establish baseline metrics
EOF
fi

cat >> "$REPORT_FILE" << EOF
- 📋 **Regular Monitoring**: Continue weekly health checks to track trends
- 🔧 **Preventive Maintenance**: Address issues early to prevent accumulation

### Next Review
- **Scheduled**: Next week (automatic)
- **Manual**: Run \`./scripts/generate-health-report.sh\` as needed

---

*This report was generated automatically by the health monitoring system.*  
*Report saved to: \`$REPORT_FILE\`*
EOF

# Clean up temporary files
rm -f health-check-temp.txt debt-scan-temp.txt

echo -e "${GREEN}✅ Health report generated successfully!${NC}"
echo -e "${BLUE}📄 Report saved to: $REPORT_FILE${NC}"

# Display summary
echo -e "\n${BLUE}📊 Health Report Summary:${NC}"
echo -e "  Framework Health: $HEALTH_STATUS"
echo -e "  Technical Debt: $DEBT_STATUS"
echo -e "  Performance Data: $PERF_STATUS"
echo -e "  Overall Score: $OVERALL_SCORE"

# Copy to latest report for easy access
cp "$REPORT_FILE" "${REPORT_DIR}/latest-health-report.md"
echo -e "${BLUE}📄 Latest report link: ${REPORT_DIR}/latest-health-report.md${NC}"

# Exit with appropriate code
if [ $HEALTH_EXIT_CODE -ne 0 ] || [ $DEBT_EXIT_CODE -ne 0 ]; then
    echo -e "\n${YELLOW}⚠️ Health monitoring detected issues. Review the report for details.${NC}"
    exit 1
else
    echo -e "\n${GREEN}🎉 All health checks passed! Project is in good health.${NC}"
    exit 0
fi
