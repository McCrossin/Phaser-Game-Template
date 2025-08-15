# Story: E2E Test Failures Troubleshooting

**ID**: TRBL-003  
**Epic**: Production Troubleshooting  
**Priority**: High  
**Estimated Points**: 3  
**Dependencies**: None  
**Type**: Production Troubleshooting Story

## 🚨 CRITICAL PRODUCTION TROUBLESHOOTING STORY NOTICE

**🔒 THIS IS A PRODUCTION TROUBLESHOOTING STORY - NEVER EDIT 🔒**

This story is designed for **REPEATED USE** across game projects when End-to-End (E2E) tests fail. Follow the procedures exactly as written.

**⚠️ CRITICAL RULE**: If you're troubleshooting a feature implementation that broke E2E tests:

1. Use THIS story for systematic debugging procedures
2. Reference the ORIGINAL feature implementation story for context
3. Make ALL fixes and updates in the ORIGINAL feature story - NEVER edit this troubleshooting story
4. Keep this story clean and unchanged for future troubleshooting sessions

## Description

Systematic troubleshooting procedure for End-to-End test failures in game projects using Playwright. This includes browser automation issues, element selection problems, timing issues, and game-specific E2E test scenarios.

### Player Experience Goal

Ensure the complete game workflow functions correctly from a user perspective across different browsers and devices.

### Technical Overview

Diagnose and resolve E2E test failures using Playwright testing framework, browser debugging tools, and game-specific testing strategies.

## Acceptance Criteria

### Functional Requirements

- [ ] All E2E tests execute and complete successfully
- [ ] Game loads correctly in test browsers
- [ ] User interactions are properly simulated
- [ ] Game state changes are correctly validated
- [ ] Cross-browser compatibility is maintained

### Technical Requirements

- [ ] Playwright tests run without browser crashes
- [ ] Element selectors work reliably
- [ ] Test timing and waits are properly configured
- [ ] Screenshots and test artifacts are generated
- [ ] Test reports show detailed failure information

### Game Design Requirements

- [ ] Game mechanics are validated through E2E scenarios
- [ ] User journey flows work correctly
- [ ] Game performance meets expectations in test environment
- [ ] Game responsiveness is validated across devices

## Technical Specifications

### Architecture Context

E2E tests validate the complete game experience by automating browser interactions. These tests ensure the game works correctly from the player's perspective and catch integration issues.

### Files to Create/Modify

- `tests/e2e/performance.spec.ts`: E2E performance tests
- `tests/e2e/debug-game.spec.ts`: Game debugging E2E tests
- `tests/e2e/performance/game-performance.test.ts`: Detailed performance E2E tests
- `tests/config/playwright.config.ts`: Playwright configuration
- `tests/fixtures/gameTestUtils.ts`: E2E test utilities
- `tests/helpers/performance-helpers.ts`: Performance testing helpers

### Key Classes and Interfaces

```typescript
interface E2ETestResult {
    passed: boolean;
    failed: number;
    total: number;
    duration: number;
    browser: string;
    screenshots: string[];
}

interface E2ETestConfig {
    browsers: string[];
    headless: boolean;
    timeout: number;
    retries: number;
    baseURL: string;
}

interface GameTestScenario {
    name: string;
    steps: TestStep[];
    expected: ExpectedResult[];
    performance: PerformanceMetrics;
}
```

### Integration Points

- **Playwright Framework**: Browser automation and testing
- **Game Application**: Running game instance for testing
- **Browser Engines**: Chromium, Firefox, WebKit
- **Development Server**: Local game server for testing
- **CI Environment**: Automated E2E test execution

### Performance Requirements

- E2E tests complete within 10 minutes
- Individual test scenarios under 2 minutes
- Game loads within 5 seconds during tests
- Browser automation responds within 30 seconds

## Implementation Tasks

### 1. Analyze E2E Test Failure Output

**Estimated Time**: 45 minutes

Review E2E test failure results to understand specific failures and context.

**Technical Details**:

```bash
# Run E2E tests with detailed output
npm run test:e2e

# Run specific failing test
npm run test:e2e -- --grep="failing test name"

# Run with debug mode
npm run test:e2e -- --debug

# Generate test report
npm run test:e2e -- --reporter=html
```

**Failure Analysis**:

- Check test execution logs and screenshots
- Review browser console errors
- Analyze element selector failures
- Identify timing and synchronization issues

### 2. Categorize E2E Test Failures

**Estimated Time**: 30 minutes

Classify the type of E2E failure to apply appropriate debugging approach.

**Technical Details**:

**Browser Loading Issues**:

- Game fails to load in test browser
- JavaScript errors prevent game initialization
- Asset loading failures in test environment

**Element Selection Failures**:

- Selectors don't match game elements
- Dynamic content not properly waited for
- Game UI elements not rendered when expected

**Timing and Synchronization Issues**:

- Tests run too fast for game to respond
- Async operations not properly awaited
- Game state changes not synchronized with tests

**Game Logic Issues**:

- Game behaves differently in test environment
- Game state doesn't match test expectations
- User interactions don't produce expected results

### 3. Debug Browser Environment

**Estimated Time**: 1 hour

Analyze the browser environment where tests are failing.

**Technical Details**:

**Run Tests in Headed Mode**:

```bash
# Run tests with visible browser
npm run test:e2e -- --headed

# Run with slow motion for debugging
npm run test:e2e -- --headed --slow-mo=1000

# Debug specific test interactively
npm run test:e2e -- --debug --grep="specific test"
```

**Check Browser Console**:

```typescript
// In test files, capture console logs
test('game loads correctly', async ({ page }) => {
    page.on('console', msg => console.log('Browser:', msg.text()));
    page.on('pageerror', err => console.log('Page error:', err.message));

    await page.goto('/');
    // Test steps
});
```

**Analyze Screenshots**:

```typescript
// Take screenshots at failure points
test('game interaction', async ({ page }) => {
    await page.goto('/');
    await page.screenshot({ path: 'before-interaction.png' });

    await page.click('#game-button');
    await page.screenshot({ path: 'after-interaction.png' });
});
```

### 4. Fix Element Selection Issues

**Estimated Time**: 1 hour

Resolve problems with finding and interacting with game elements.

**Technical Details**:

**Update Selectors**:

```typescript
// Before: Fragile selector
await page.click('.button-123');

// After: Robust selector
await page.click('[data-testid="start-game-button"]');

// Use multiple selector strategies
const gameCanvas = page.locator('canvas').or(page.locator('#game-canvas'));
```

**Add Proper Waits**:

```typescript
// Wait for game to load
await page.waitForSelector('canvas', { timeout: 10000 });

// Wait for game state
await page.waitForFunction(() => {
    return window.game && window.game.scene.isActive('GameScene');
});

// Wait for specific game elements
await page.waitForSelector('[data-testid="player-sprite"]');
```

**Handle Dynamic Content**:

```typescript
// Wait for game initialization
await page.waitForLoadState('networkidle');
await page.waitForFunction(() => window.gameReady === true);

// Wait for animations to complete
await page.waitForTimeout(1000); // Use sparingly
await page.waitForFunction(() => !document.querySelector('.loading'));
```

### 5. Resolve Timing and Synchronization Issues

**Estimated Time**: 1.5 hours

Fix test timing issues and ensure proper synchronization with game state.

**Technical Details**:

**Game State Synchronization**:

```typescript
// Add game state helpers in the game code
window.gameTestHelpers = {
    isSceneActive: sceneName => game.scene.isActive(sceneName),
    getGameState: () => game.registry.get('gameState'),
    waitForGameReady: () =>
        new Promise(resolve => {
            if (game.scene.isActive('GameScene')) {
                resolve();
            } else {
                game.events.once('scene-ready', resolve);
            }
        })
};

// Use in tests
await page.waitForFunction(() => {
    return window.gameTestHelpers?.isSceneActive('GameScene');
});
```

**Async Operation Handling**:

```typescript
// Wait for game operations to complete
test('game saves correctly', async ({ page }) => {
    await page.click('[data-testid="save-button"]');

    // Wait for save operation
    await page.waitForFunction(() => {
        return window.gameTestHelpers?.getGameState()?.lastSaved;
    });

    // Verify save
    const saveIndicator = page.locator('[data-testid="save-complete"]');
    await expect(saveIndicator).toBeVisible();
});
```

### 6. Update Test Configuration

**Estimated Time**: 30 minutes

Adjust Playwright configuration to resolve environment-specific issues.

**Technical Details**:

**Update playwright.config.ts**:

```typescript
export default defineConfig({
    testDir: './tests/e2e',
    timeout: 30000,
    retries: 2,
    workers: 1, // Reduce parallelism if needed

    use: {
        baseURL: 'http://localhost:5173',
        headless: true,
        screenshot: 'only-on-failure',
        video: 'retain-on-failure',
        trace: 'retain-on-failure'
    },

    projects: [
        {
            name: 'chromium',
            use: { ...devices['Desktop Chrome'] }
        },
        {
            name: 'firefox',
            use: { ...devices['Desktop Firefox'] }
        }
    ]
});
```

### 7. Validate E2E Test Fixes

**Estimated Time**: 45 minutes

Ensure all E2E tests pass consistently across browsers.

**Technical Details**:

```bash
# Run complete E2E test suite
npm run test:e2e

# Run tests multiple times to check stability
for i in {1..3}; do npm run test:e2e; done

# Test on different browsers
npm run test:e2e -- --project=chromium
npm run test:e2e -- --project=firefox

# Run in CI-like environment
npm run validate
```

## Game Design Context

### GDD References

- **User Experience Flows**: E2E tests validate complete player journeys
- **Game Mechanics**: Test key game mechanics through user interactions
- **Performance Standards**: Validate game performs acceptably for players

### Balance Parameters

```typescript
const E2E_TEST_CONFIGURATION = {
    timeout: {
        page: 30000, // 30 seconds page timeout
        test: 120000, // 2 minutes per test
        element: 10000 // 10 seconds element timeout
    },
    performance: {
        loadTime: 5000, // 5 seconds max load time
        fps: 55, // Minimum 55 FPS in E2E tests
        memory: 256 // 256MB max memory usage
    },
    retries: 2, // Retry failed tests twice
    workers: 1 // Single worker for game tests
};
```

### Visual/Audio Requirements

- **Test Artifacts**: Screenshots and videos of test failures
- **Game Visuals**: Visual validation of game rendering
- **User Interface**: UI element interaction validation

## Testing Requirements

### Unit Tests

- E2E test utility validation
- Test helper function tests
- Playwright configuration validation

### Integration Tests

- **Browser Integration**: Test game works in different browsers
- **Server Integration**: Verify development server works with tests
- **Game Integration**: Ensure test utilities integrate with game code

### Performance Tests

- **Load Performance**: Game loads quickly in test environment
- **Runtime Performance**: Game maintains performance during E2E tests
- **Test Execution Performance**: E2E tests complete within time limits

### Gameplay Testing

- [ ] Complete game user journeys work correctly
- [ ] Game mechanics function as expected in browser environment
- [ ] User interface responds correctly to interactions
- [ ] Game state persists correctly through user actions
- [ ] Performance remains acceptable during automated testing

## Dependencies

### Prerequisite Stories

- None - This is a standalone troubleshooting procedure

### System Dependencies

- **Playwright**: E2E testing framework
- **Game Application**: Running game instance
- **Development Server**: Vite dev server
- **Browsers**: Chromium, Firefox, WebKit

### Asset Dependencies

- **Test Game Build**: Compiled game for testing
- **Test Configuration**: Playwright and test setup files
- **Test Data**: Mock data and test scenarios

## Definition of Done

- [ ] All E2E test failures identified and categorized
- [ ] Root cause of failures determined
- [ ] Browser environment issues resolved
- [ ] Element selection and timing issues fixed
- [ ] All E2E tests pass consistently
- [ ] Tests work across target browsers
- [ ] Test artifacts (screenshots, videos) are generated
- [ ] Test execution time within acceptable limits
- [ ] CI pipeline E2E tests return to green
- [ ] Test stability validated with multiple runs

## E2E Test Troubleshooting Quick Reference

### Common E2E Failures and Solutions

1. **Element Not Found**

    ```typescript
    // Use robust selectors
    await page.locator('[data-testid="element"]').click();

    // Add proper waits
    await page.waitForSelector('[data-testid="element"]');
    ```

2. **Timing Issues**

    ```typescript
    // Wait for game state
    await page.waitForFunction(() => window.gameReady);

    // Use page.waitForLoadState()
    await page.waitForLoadState('networkidle');
    ```

3. **Game Loading Failures**

    ```typescript
    // Check for JavaScript errors
    page.on('pageerror', err => console.log(err));

    // Verify game initialization
    await page.waitForFunction(() => window.game);
    ```

4. **Browser Environment Issues**

    ```bash
    # Run in headed mode for debugging
    npm run test:e2e -- --headed --debug

    # Check browser console
    # Use page.on('console', ...)
    ```

5. **Test Flakiness**

    ```typescript
    // Add proper retries in config
    retries: 2;

    // Use stable selectors
    // Add appropriate waits
    ```

### E2E Debugging Commands

```bash
# Run E2E tests
npm run test:e2e

# Run with debug mode
npm run test:e2e -- --debug

# Run specific test
npm run test:e2e -- --grep="test name"

# Run in headed mode
npm run test:e2e -- --headed

# Generate HTML report
npm run test:e2e -- --reporter=html

# Run on specific browser
npm run test:e2e -- --project=chromium
```

## 🔒 CRITICAL REMINDER

**NEVER EDIT THIS TROUBLESHOOTING STORY**

This is a production troubleshooting procedure designed for repeated use. If troubleshooting a feature implementation that broke E2E tests:

1. ✅ **Use this story** for systematic debugging steps
2. ✅ **Reference the original feature story** for context of what was changed
3. ✅ **Make all fixes in the original feature story** based on findings here
4. ❌ **Never modify this troubleshooting story** - keep it clean for future use

Remember: The goal is to identify issues using this systematic approach, then apply fixes in the appropriate implementation stories.
