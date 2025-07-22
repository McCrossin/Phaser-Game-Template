import { describe, it, expect, beforeEach } from 'vitest';
import { removePathSafely, log } from '../../tools/development/script-runner';
import { mkdirSync, rmSync, writeFileSync, existsSync } from 'fs';
import { join } from 'path';

describe('TypeScript Migration - Script Runner', () => {
    const testDir = join(process.cwd(), 'test-temp');
    const testFile = join(testDir, 'test.txt');

    beforeEach(() => {
        // Clean up any existing test directory
        if (existsSync(testDir)) {
            rmSync(testDir, { recursive: true, force: true });
        }
    });

    it('should have proper TypeScript types for script functions', () => {
        // Test that log function accepts proper types
        expect(() => log('info', 'Test message')).not.toThrow();
        expect(() => log('success', 'Success message')).not.toThrow();
        expect(() => log('warning', 'Warning message')).not.toThrow();
        expect(() => log('error', 'Error message')).not.toThrow();
    });

    it('should safely remove paths with TypeScript type safety', () => {
        // Create test directory and file
        mkdirSync(testDir, { recursive: true });
        writeFileSync(testFile, 'test content');

        // Verify file exists
        expect(existsSync(testFile)).toBe(true);

        // Test removePathSafely with proper TypeScript types
        const result = removePathSafely(testFile, 'Test file', { dryRun: false });
        expect(result).toBe(true);
        expect(existsSync(testFile)).toBe(false);
    });

    it('should handle dry run mode correctly', () => {
        mkdirSync(testDir, { recursive: true });
        writeFileSync(testFile, 'test content');

        const result = removePathSafely(testFile, 'Test file', { dryRun: true });
        expect(result).toBe(true);
        expect(existsSync(testFile)).toBe(true); // Should still exist in dry run
    });
});
