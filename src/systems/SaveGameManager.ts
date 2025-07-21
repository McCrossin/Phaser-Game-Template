/**
 * Save Game Manager - Handles save/load operations and compatibility
 */

// Basic type definitions for save game data
interface ProbeData {
    id: string;
    position: { x: number; y: number };
    status: string;
}

interface DiscoveredItem {
    id: string;
    type: string;
    location: { x: number; y: number };
}

interface StructureData {
    id: string;
    type: string;
    position: { x: number; y: number };
}

export interface SaveData {
    version: string;
    player: {
        resources: {
            energy: number;
            materials?: number;
        };
        research?: string[];
        probes?: ProbeData[];
    };
    world?: {
        discovered: DiscoveredItem[];
        structures?: StructureData[];
    };
    timestamp?: number;
}

export class SaveGameManager {
    async loadGame(saveData: unknown): Promise<SaveData> {
        // Validate save data
        if (!saveData || typeof saveData !== 'object') {
            throw new Error('Invalid save data format');
        }

        // Type guard to ensure we have the expected structure
        const data = saveData as Record<string, unknown>;

        // Validate required fields
        if (!data['player'] || data['player'] === null) {
            throw new Error('Invalid save file format');
        }

        // Create backup before migration
        this.createBackup(data);

        // Type guards for nested objects
        const playerData = data['player'] as Record<string, unknown>;
        const playerResources = (playerData?.['resources'] as Record<string, unknown>) || {};
        const worldData = (data['world'] as Record<string, unknown>) || {};

        // Migrate save data to current version
        const migratedData: SaveData = {
            version: (data['version'] as string) || '0.1.0',
            player: {
                resources: {
                    energy: (playerResources['energy'] as number) || 0,
                    materials: (playerResources['materials'] as number) || 0
                },
                research: (playerData['research'] as string[]) || [],
                probes: (playerData['probes'] as ProbeData[]) || []
            },
            world: {
                discovered: (worldData['discovered'] as DiscoveredItem[]) || [],
                structures: (worldData['structures'] as StructureData[]) || []
            },
            timestamp: (data['timestamp'] as number) || Date.now()
        };

        return migratedData;
    }

    createBackup(saveData: Record<string, unknown>): void {
        // In real implementation, this would save to backup location
        console.log('Creating backup of save data', saveData);
    }
}
