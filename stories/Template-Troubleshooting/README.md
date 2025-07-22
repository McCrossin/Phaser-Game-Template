# Production Game Troubleshooting Stories Epic

**Epic ID**: TRBL-TROUBLESHOOT  
**Priority**: Critical  
**Type**: Production Support/Troubleshooting

## Purpose

This epic contains **PRODUCTION-READY TROUBLESHOOTING STORIES** designed for repeated use when debugging issues in any game project. These stories are **NEVER TO BE EDITED** and serve as standardized troubleshooting procedures.

## 🚨 CRITICAL USAGE INSTRUCTIONS

### For AI Agents and Developers:

1. **🔒 NEVER EDIT THESE STORIES** - They are production procedures meant for repeated use across projects
2. **📚 REFERENCE IMPLEMENTATION STORIES** - When troubleshooting a broken feature, reference the original implementation story alongside these troubleshooting stories
3. **✅ FOLLOW EXACTLY** - These procedures have been tested and validated across multiple projects
4. **🎯 CONTEXT AWARENESS** - If a feature implementation broke something, you need BOTH:
    - The original feature implementation story (for context of what was changed)
    - The appropriate troubleshooting story from this epic (for systematic debugging)
5. **⚠️ MAKE FIXES IN IMPLEMENTATION STORIES ONLY** - Any code changes or fixes should be made based on findings from troubleshooting, but the troubleshooting stories themselves must remain unchanged

## Story Categories

### Code Quality & Compilation Troubleshooting

- **TRBL-001**: TypeScript Compilation Errors Troubleshooting

### Testing System Troubleshooting

- **TRBL-002**: Unit Test Failures Troubleshooting
- **TRBL-003**: E2E Test Failures Troubleshooting

### Build & Performance Troubleshooting

- **TRBL-004**: Vite Build Failures Troubleshooting
- **TRBL-005**: Performance Testing Pipeline Troubleshooting

### CI/CD Pipeline Troubleshooting

- **TRBL-006**: GitHub Actions CI Pipeline Failure Troubleshooting

## How to Use These Stories

1. **Identify the failing system** (compilation, tests, build, CI/CD)
2. **Select the appropriate troubleshooting story** based on your issue type
3. **Follow the systematic debugging steps** exactly as written
4. **If debugging a feature implementation**, also reference the original feature story for context
5. **Apply ALL fixes in the original implementation story** - never modify these troubleshooting procedures
6. **Report results** following the story's validation criteria

These stories are designed to be run repeatedly whenever issues arise in their respective systems.

## Available Troubleshooting Stories

### Code Quality & Compilation (TRBL-001)

- **TRBL-001**: TypeScript Compilation Errors Troubleshooting

### Testing Systems (TRBL-002 to TRBL-003)

- **TRBL-002**: Unit Test Failures Troubleshooting
- **TRBL-003**: E2E Test Failures Troubleshooting

### Build & Performance (TRBL-004 to TRBL-005)

- **TRBL-004**: Vite Build Failures Troubleshooting
- **TRBL-005**: Performance Testing Pipeline Troubleshooting

### CI/CD Pipeline (TRBL-006)

- **TRBL-006**: GitHub Actions CI Pipeline Failure Troubleshooting
