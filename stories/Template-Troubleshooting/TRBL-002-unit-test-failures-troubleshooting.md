# Story: Unit Test Failures Troubleshooting

**ID**: TRBL-002  
**Epic**: Production Troubleshooting  
**Priority**: High  
**Estimated Points**: 2  
**Dependencies**: None  
**Type**: Production Troubleshooting Story

## 🚨 CRITICAL PRODUCTION TROUBLESHOOTING STORY NOTICE

**🔒 THIS IS A PRODUCTION TROUBLESHOOTING STORY - NEVER EDIT 🔒**

This story is designed for **REPEATED USE** across game projects when unit tests fail. Follow the procedures exactly as written.

**⚠️ CRITICAL RULE**: If you're troubleshooting a feature implementation that broke unit tests:

1. Use THIS story for systematic debugging procedures
2. Reference the ORIGINAL feature implementation story for context
3. Make ALL fixes and updates in the ORIGINAL feature story - NEVER edit this troubleshooting story
4. Keep this story clean and unchanged for future troubleshooting sessions

## Description

Systematic troubleshooting procedure for unit test failures in game projects. This includes test timeouts, assertion failures, mocking issues, and TypeScript compilation errors in tests.

### Player Experience Goal

Maintain reliable automated testing that ensures game functionality works correctly and prevents regressions.

### Technical Overview

Diagnose and resolve unit test failures using Vitest test framework, analyzing test output, and fixing test logic or implementation issues.

## Acceptance Criteria

### Functional Requirements

- [ ] All unit tests pass consistently
- [ ] Test failures are identified and categorized
- [ ] Root cause of test failures is determined
- [ ] Appropriate fixes are implemented
- [ ] Test coverage maintains or improves

### Technical Requirements

- [ ] Vitest test runner executes without errors
- [ ] All test assertions pass as expected
- [ ] Test mocks and stubs function correctly
- [ ] TypeScript compilation succeeds for test files
- [ ] Test execution completes within timeout limits

### Game Design Requirements

- [ ] Game logic tests validate game mechanics correctly
- [ ] Component tests ensure game objects behave as designed
- [ ] System tests verify game architecture integrity

## Technical Specifications

### Architecture Context

Unit tests validate individual components, systems, and utilities in isolation. Test failures indicate issues in game logic, component behavior, or test setup/configuration.

### Files to Create/Modify

- `tests/unit/**/*.test.ts`: Individual unit test files
- `tests/setup.ts`: Test environment setup
- `tests/config/vitest.config.ts`: Vitest configuration
- `tests/fixtures/gameTestUtils.ts`: Test utilities and helpers
- `tests/helpers/performance-helpers.ts`: Performance testing helpers
- `src/**/*.ts`: Source code files with test issues

### Key Classes and Interfaces

```typescript
interface TestResult {
    passed: boolean;
    failed: number;
    total: number;
    duration: number;
    coverage: CoverageReport;
}

interface TestFailure {
    testName: string;
    filePath: string;
    error: string;
    expected: any;
    actual: any;
    stack: string;
}

interface TestConfiguration {
    timeout: number;
    environment: 'node' | 'jsdom' | 'happy-dom';
    setupFiles: string[];
    coverage: boolean;
}
```

### Integration Points

- **Vitest Test Framework**: Test execution and reporting
- **TypeScript Compiler**: Test file compilation
- **Game Components**: Units under test
- **Test Utilities**: Mocking and helper functions
- **CI Pipeline**: Automated test execution

### Performance Requirements

- Unit tests complete within 5 minutes
- Individual test execution under 10 seconds
- Test setup and teardown under 1 second
- Memory usage for test suite under 1GB

## Implementation Tasks

### 1. Analyze Test Failure Output

**Estimated Time**: 30 minutes

Review the test failure output to understand the specific failures and their context.

**Technical Details**:

```bash
# Run tests with verbose output
npm run test:run -- --reporter=verbose

# Run specific failing test
npm run test:run -- --grep="failing test name"

# Run tests with coverage to see what's not tested
npm run test:coverage
```

**Failure Analysis**:

- Identify which specific tests are failing
- Note the error messages and stack traces
- Check if failures are consistent or intermittent
- Determine if failures are related to each other

### 2. Categorize Test Failures

**Estimated Time**: 15 minutes

Classify the type of test failure to apply appropriate debugging approach.

**Technical Details**:

**Assertion Failures**:

- Expected vs actual value mismatches
- Logic errors in test expectations
- Changes in implementation behavior

**Timeout Failures**:

- Tests taking longer than configured timeout
- Infinite loops or blocking operations
- Async operations not properly handled

**Setup/Teardown Issues**:

- Test environment not properly initialized
- Resources not cleaned up between tests
- Mock configuration problems

**Compilation Errors**:

- TypeScript type errors in test files
- Import/export issues
- Missing dependencies

### 3. Reproduce Failures Locally

**Estimated Time**: 30 minutes

Run the failing tests locally to enable detailed debugging.

**Technical Details**:

```bash
# Run tests in watch mode for immediate feedback
npm run test:watch

# Run specific test file
npm run test:run tests/unit/specific-file.test.ts

# Run tests with debug output
npm run test:run -- --debug

# Run with different configurations
npm run test:run -- --reporter=verbose --timeout=30000
```

### 4. Debug Test Logic and Implementation

**Estimated Time**: 1-2 hours

Analyze the failing tests to determine if the issue is in the test logic or the implementation.

**Technical Details**:

**For Assertion Failures**:

```typescript
// Add debug logging to understand actual values
describe('Component Test', () => {
    it('should behave correctly', () => {
        const result = component.method();
        console.log('Actual result:', result);
        expect(result).toBe(expectedValue);
    });
});

// Verify test setup
beforeEach(() => {
    console.log('Test setup complete');
    // Ensure clean state
});
```

**For Async Test Issues**:

```typescript
// Ensure proper async handling
it('should handle async operations', async () => {
    const promise = component.asyncMethod();
    await expect(promise).resolves.toBe(expectedValue);
});

// Use proper timeouts
it('should complete within timeout', { timeout: 10000 }, async () => {
    await longRunningOperation();
});
```

**For Mock Issues**:

```typescript
// Verify mock setup
const mockFunction = vi.fn();
mockFunction.mockReturnValue(expectedValue);

// Check mock calls
expect(mockFunction).toHaveBeenCalledWith(expectedArgs);
expect(mockFunction).toHaveBeenCalledTimes(1);
```

### 5. Fix Test Issues

**Estimated Time**: 1-2 hours

Implement appropriate fixes based on the failure analysis.

**Technical Details**:

**Update Test Logic**:

```typescript
// Fix incorrect assertions
expect(result).toBe(correctExpectedValue);

// Update test data for changed requirements
const testData = {
    // Updated to match new implementation
    property: newExpectedValue
};
```

**Fix Implementation Issues**:

```typescript
// Correct implementation bugs found by tests
export class GameComponent {
    method(): ReturnType {
        // Fixed implementation
        return correctValue;
    }
}
```

**Update Test Configuration**:

```typescript
// vitest.config.ts adjustments
export default defineConfig({
    test: {
        timeout: 10000, // Increase if needed
        environment: 'jsdom', // Correct environment
        setupFiles: ['./tests/setup.ts']
    }
});
```

### 6. Validate Test Fixes

**Estimated Time**: 30 minutes

Ensure all tests pass and no new issues are introduced.

**Technical Details**:

```bash
# Run full test suite
npm run test:run

# Verify test coverage hasn't decreased
npm run test:coverage

# Run tests multiple times to check for flakiness
for i in {1..5}; do npm run test:run; done

# Run in CI-like environment
npm run validate
```

## Game Design Context

### GDD References

- **Component Specifications**: Test validation of game component behaviors
- **System Requirements**: Verify game systems work as designed
- **Gameplay Mechanics**: Ensure game logic tests match design intent

### Balance Parameters

```typescript
const TEST_CONFIGURATION = {
    timeout: {
        unit: 10000, // 10 seconds per unit test
        integration: 30000, // 30 seconds for integration tests
        suite: 300000 // 5 minutes for entire suite
    },
    coverage: {
        statements: 80, // 80% statement coverage
        branches: 70, // 70% branch coverage
        functions: 80, // 80% function coverage
        lines: 80 // 80% line coverage
    }
};
```

### Visual/Audio Requirements

- **Test Output**: Clear, readable test failure messages
- **Coverage Reports**: Visual coverage reporting for developers

## Testing Requirements

### Unit Tests

- `tests/unit/ECSTest.ts`: Entity Component System tests
- `tests/unit/Utils.test.ts`: Utility function tests
- `tests/unit/config/GameConfig.test.ts`: Game configuration tests
- `tests/unit/systems/`: System-specific unit tests

### Integration Tests

- **Test Framework Integration**: Vitest with TypeScript and game components
- **Mock Integration**: Game object mocking and stubbing
- **Environment Integration**: Test environment setup and teardown

### Performance Tests

- **Test Execution Speed**: Unit tests complete quickly
- **Memory Usage**: Tests don't consume excessive memory
- **Coverage Performance**: Coverage collection doesn't slow tests significantly

### Gameplay Testing

- [ ] Game logic tests accurately reflect game behavior
- [ ] Component tests validate game object functionality
- [ ] System tests ensure proper game architecture
- [ ] Utility tests confirm helper functions work correctly

## Dependencies

### Prerequisite Stories

- None - This is a standalone troubleshooting procedure

### System Dependencies

- **Vitest**: Testing framework
- **TypeScript**: Compilation and type checking
- **Node.js**: Test execution environment
- **Game Components**: Source code under test

### Asset Dependencies

- **Test Data**: Mock data and fixtures for tests
- **Test Utilities**: Helper functions and testing utilities
- **Configuration Files**: Vitest and TypeScript test configuration

## Definition of Done

- [ ] All unit test failures identified and categorized
- [ ] Root cause of failures determined
- [ ] Appropriate fixes implemented (test logic or source code)
- [ ] All unit tests pass consistently
- [ ] Test coverage maintained or improved
- [ ] No new test failures introduced
- [ ] Tests run within acceptable time limits
- [ ] CI pipeline unit tests return to green
- [ ] Test fixes validated locally and in CI
- [ ] Test maintenance notes documented

## Unit Test Troubleshooting Quick Reference

### Common Test Failures and Solutions

1. **Assertion Failures**

    ```typescript
    // Check actual vs expected values
    console.log('Expected:', expected, 'Actual:', actual);

    // Verify test setup
    beforeEach(() => {
        // Reset state properly
    });
    ```

2. **Async Test Issues**

    ```typescript
    // Use proper async/await patterns
    it('should handle async', async () => {
        await expect(asyncFunction()).resolves.toBe(value);
    });
    ```

3. **Mock Problems**

    ```typescript
    // Reset mocks between tests
    afterEach(() => {
        vi.clearAllMocks();
    });
    ```

4. **Timeout Issues**

    ```typescript
    // Increase timeout for slow tests
    it('slow test', { timeout: 20000 }, () => {
        // Test implementation
    });
    ```

5. **TypeScript Errors**

    ```bash
    # Check TypeScript configuration
    npm run typecheck

    # Verify test file imports
    ```

### Test Debugging Commands

```bash
# Run failing tests with verbose output
npm run test:run -- --reporter=verbose

# Run specific test file
npm run test:run tests/unit/failing-test.test.ts

# Run tests in watch mode
npm run test:watch

# Debug with coverage
npm run test:coverage

# Run tests with specific grep pattern
npm run test:run -- --grep="test pattern"

# Check test configuration
cat tests/config/vitest.config.ts
```

## 🔒 CRITICAL REMINDER

**NEVER EDIT THIS TROUBLESHOOTING STORY**

This is a production troubleshooting procedure designed for repeated use. If troubleshooting a feature implementation that broke unit tests:

1. ✅ **Use this story** for systematic debugging steps
2. ✅ **Reference the original feature story** for context of what was changed
3. ✅ **Make all fixes in the original feature story** based on findings here
4. ❌ **Never modify this troubleshooting story** - keep it clean for future use

Remember: The goal is to identify issues using this systematic approach, then apply fixes in the appropriate implementation stories.
