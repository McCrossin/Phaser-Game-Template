/**
 * Save Game Compatibility Test
 * Validates that save files remain compatible across versions
 */

import { describe, it, expect, vi } from 'vitest';
import { SaveGameManager } from '../../../src/systems/SaveGameManager';

describe('Save Game Compatibility', () => {
    it('should load v0.1.0 save files', async () => {
        const saveManager = new SaveGameManager();

        // Mock save data from v0.1.0
        const v010SaveData = {
            version: '0.1.0',
            player: {
                resources: { energy: 100, materials: 50 },
                research: [],
                probes: []
            },
            world: {
                discovered: [],
                structures: []
            },
            timestamp: Date.now()
        };

        // Should successfully migrate and load
        const gameState = await saveManager.loadGame(v010SaveData);
        expect(gameState).toBeDefined();
        expect(gameState.version).toBe('0.1.0'); // Current version
    });

    it('should handle missing save data fields gracefully', async () => {
        const saveManager = new SaveGameManager();

        // Incomplete save data (missing fields)
        const incompleteSave = {
            version: '0.0.1',
            player: {
                resources: { energy: 100 }
                // Missing materials, research, probes
            }
            // Missing world data
        };

        const gameState = await saveManager.loadGame(incompleteSave);
        expect(gameState).toBeDefined();
        expect(gameState.player.resources.materials).toBe(0); // Default value
    });

    it('should validate save file integrity', async () => {
        const saveManager = new SaveGameManager();

        // Corrupted save data
        const corruptedSave = {
            version: '0.1.0',
            player: null, // Corrupted
            world: { discovered: 'invalid' } // Wrong type
        };

        await expect(saveManager.loadGame(corruptedSave)).rejects.toThrow(
            'Invalid save file format'
        );
    });

    it('should create backup before migration', async () => {
        const saveManager = new SaveGameManager();
        const oldSave = {
            version: '0.0.1',
            player: { resources: { energy: 50 } }
        };

        const backupSpy = vi.spyOn(saveManager, 'createBackup');
        await saveManager.loadGame(oldSave);

        expect(backupSpy).toHaveBeenCalledWith(oldSave);
    });
});
