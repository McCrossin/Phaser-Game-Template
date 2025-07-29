# Advanced Testing Features

This directory contains optional advanced testing features for comprehensive game validation. These tests are not required for basic game development but provide additional quality assurance for complex projects.

## Available Test Types

### E2E Tests (`e2e/`)

- **Purpose**: End-to-end game functionality testing
- **When to use**: For comprehensive user journey validation
- **Setup**: Requires Playwright installation
- **Command**: `npm run test:e2e` (when configured)

### Visual Regression Tests

- **Purpose**: Detect visual changes in game rendering
- **When to use**: When visual consistency is critical
- **Setup**: Requires additional configuration
- **Command**: `npm run test:visual` (when configured)

### Performance Benchmarks

- **Purpose**: Detailed performance analysis beyond basic FPS monitoring
- **When to use**: For performance optimization and regression detection
- **Setup**: Requires performance monitoring tools
- **Command**: `npm run test:performance` (when configured)

## Enabling Advanced Testing

To enable these features, you'll need to:

1. Install additional dependencies
2. Configure test runners
3. Update scripts in package.json

See individual test directories for specific setup instructions.

## Core vs Advanced Testing

**Core Testing** (always enabled):

- Unit tests for game logic
- Basic integration tests
- Essential functionality validation

**Advanced Testing** (optional):

- Visual regression testing
- Performance benchmarking
- Complex E2E scenarios
- Cross-browser compatibility testing

Choose advanced testing based on your project's complexity and quality requirements.
