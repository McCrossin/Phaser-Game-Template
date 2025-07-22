import { vi } from 'vitest';

// Mock console methods to capture output during testing
const originalConsole = { ...console };
let consoleLogs: string[] = [];

global.console = {
    ...originalConsole,
    log: vi.fn((...args) => {
        consoleLogs.push(args.join(' '));
        originalConsole.log(...args);
    }),
    warn: vi.fn((...args) => {
        consoleLogs.push('WARN: ' + args.join(' '));
        originalConsole.warn(...args);
    }),
    error: vi.fn((...args) => {
        consoleLogs.push('ERROR: ' + args.join(' '));
        originalConsole.error(...args);
    })
};

// Helper to access captured console output
export const getConsoleLogs = () => [...consoleLogs];
export const clearConsoleLogs = () => {
    consoleLogs = [];
};

// Mock file system for validation tests
vi.mock('fs/promises', () => ({
    access: vi.fn(),
    readFile: vi.fn(),
    writeFile: vi.fn(),
    readdir: vi.fn(),
    stat: vi.fn()
}));

// Mock child_process for validation tests
vi.mock('child_process', () => ({
    execSync: vi.fn()
}));
