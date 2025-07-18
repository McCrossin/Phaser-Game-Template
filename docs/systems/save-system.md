# Save System Design Document

## Overview
The Save System provides reliable game state persistence with support for multiple save slots, automatic saving, and cloud synchronization. It must handle complex game states efficiently while maintaining data integrity.

## Save Data Structure

### Core Save Components
- **Meta Data**:
  - Save slot ID (1-3 minimum)
  - Creation timestamp
  - Last modified timestamp
  - Play time
  - Game version
  - Save name (user-defined)
  - Screenshot thumbnail

### Game State Data
- **World State**:
  - Seed for procedural generation
  - Explored areas map
  - Resource depletion states
  - Environmental changes
  - Weather patterns
  - Day/night cycle position

- **Probe States**:
  - Position and rotation
  - Equipment loadout (4 slots)
  - Resource inventory
  - Health/integrity
  - Power levels
  - Active probe ID

- **Base Infrastructure**:
  - Building positions and types
  - Power grid connections
  - Storage contents
  - Manufacturing queues
  - Automation settings

- **Progress Data**:
  - Discovered recipes
  - Unlocked technologies
  - Completed objectives
  - Achievement progress
  - Statistics (resources gathered, etc.)

## Save/Load Operations

### Save Process
1. **Validation**: Check data integrity
2. **Serialization**: Convert game objects to JSON
3. **Compression**: GZIP compression for size
4. **Encryption**: Basic obfuscation
5. **Storage**: Write to LocalStorage/IndexedDB
6. **Verification**: Confirm write success

### Load Process
1. **File Reading**: Retrieve save data
2. **Decompression**: Unpack GZIP data
3. **Validation**: Schema and version check
4. **Deserialization**: Reconstruct game objects
5. **World Generation**: Recreate procedural world
6. **State Application**: Apply saved states
7. **Verification**: Confirm load success

## Auto-Save System

### Trigger Conditions
- **Time-based**: Every 60 seconds during gameplay
- **Event-based**:
  - After major accomplishments
  - Before risky operations
  - On pause menu open
  - Before scene transitions

### Auto-Save Settings
- **Frequency**: User-configurable (30s-5min)
- **Slot Rotation**: Keep last 3 auto-saves
- **Performance Mode**: Reduce frequency on low-end systems
- **Notification**: Subtle UI indicator

## Save Slot Management

### Slot Features
- **Manual Saves**: Minimum 3 slots
- **Auto-Save Slots**: Separate from manual
- **Quick Save**: Single-button save/load
- **Cloud Saves**: Steam Cloud integration

### Slot Information Display
- **Preview Data**:
  - Screenshot thumbnail
  - Location name
  - Play time
  - Last saved date
  - Progress percentage

### Slot Operations
- **Create New**: Start fresh save
- **Overwrite**: Warning confirmation
- **Delete**: Two-step confirmation
- **Export/Import**: Share saves
- **Compare**: View differences

## Data Integrity

### Validation Systems
- **Schema Validation**: Ensure data structure
- **Checksum**: Detect corruption
- **Version Compatibility**: Handle updates
- **Recovery Mode**: Attempt repair

### Error Handling
- **Corruption Detection**: CRC checks
- **Partial Recovery**: Save what's valid
- **Rollback**: Previous save backup
- **Error Reporting**: User-friendly messages

## Performance Optimization

### Saving Performance
- **Incremental Saves**: Only changed data
- **Background Threading**: Web Workers
- **Chunked Writing**: Prevent blocking
- **Memory Management**: Clear old references

### Loading Performance
- **Progressive Loading**: Priority systems first
- **Lazy Initialization**: Load as needed
- **Asset Preloading**: Parallel asset loads
- **Scene Preparation**: Pre-warm systems

### Storage Optimization
- **Compression**: 60-70% size reduction
- **Delta Saves**: Store only changes
- **Binary Format**: For large worlds
- **Pruning**: Remove outdated data

## Cloud Save Integration

### Synchronization
- **Conflict Resolution**: Newer save wins
- **Merge Strategy**: For different devices
- **Bandwidth Limits**: Throttle uploads
- **Offline Support**: Queue for later

### Platform Integration
- **Steam Cloud**: Via Steamworks API
- **Browser Sync**: For web version
- **Cross-Platform**: Universal format
- **Privacy**: Encrypted transfers

## Save File Format

### JSON Structure
```json
{
  "version": "1.0.0",
  "meta": {
    "slot": 1,
    "name": "First Colony",
    "created": "2024-01-15T10:30:00Z",
    "modified": "2024-01-15T14:22:00Z",
    "playtime": 12840,
    "thumbnail": "base64_image_data"
  },
  "world": {
    "seed": 12345,
    "time": 45600,
    "weather": "clear",
    "exploredChunks": [[0,0], [0,1], [1,0]]
  },
  "probes": [{
    "id": "probe_001",
    "position": {"x": 1024, "y": 768},
    "equipment": ["mining_laser_mk2", "scanner", null, null],
    "inventory": {"iron": 50, "silicon": 30},
    "power": {"current": 45, "max": 50}
  }],
  "progress": {
    "recipes": ["metal_sheet", "wire_coil"],
    "objectives": ["tutorial_complete", "first_solar"],
    "stats": {
      "resourcesGathered": 1250,
      "probesBuilt": 2
    }
  }
}
```

## Migration System

### Version Handling
- **Compatibility Table**: Supported versions
- **Migration Scripts**: Update old saves
- **Backup Creation**: Before migration
- **Rollback Option**: If migration fails

### Update Strategies
- **Additive**: New fields get defaults
- **Transformative**: Convert data formats
- **Destructive**: Warning before loss
- **Selective**: User chooses what to keep

## UI Integration

### Save Menu
- **Layout**: Grid of save slots
- **Quick Actions**: Save/Load buttons
- **Details Panel**: Expanded information
- **Management Tools**: Delete, export, rename

### In-Game Indicators
- **Auto-Save Icon**: Spinning indicator
- **Save Reminder**: If not saved recently
- **Quick Save Toast**: Confirmation message
- **Error Notifications**: Clear problem description

## Security Considerations

### Anti-Cheat
- **Checksum Validation**: Detect tampering
- **Timestamp Verification**: Prevent time manipulation
- **Resource Validation**: Realistic values only
- **Achievement Lock**: Protect progression

### Privacy
- **Local Storage**: No personal data
- **Cloud Encryption**: Secure transfers
- **Anonymous Stats**: Opt-in telemetry
- **GDPR Compliance**: Data management rights

## Technical Implementation

### Save Manager Class
```typescript
class SaveManager {
  private slots: SaveSlot[];
  private autoSaveTimer: Timer;
  private currentSlot: number;
  
  async save(slotId: number): Promise<boolean>;
  async load(slotId: number): Promise<GameState>;
  async autoSave(): Promise<void>;
  async deleteSave(slotId: number): Promise<boolean>;
  async exportSave(slotId: number): Promise<string>;
  async importSave(data: string): Promise<boolean>;
  
  validateSave(data: SaveData): ValidationResult;
  compressSave(data: SaveData): Uint8Array;
  decompressSave(compressed: Uint8Array): SaveData;
}
```

### Save Data Interface
```typescript
interface SaveData {
  version: string;
  meta: SaveMetadata;
  world: WorldState;
  probes: ProbeState[];
  buildings: BuildingState[];
  progress: ProgressData;
  settings: GameSettings;
}

interface SaveMetadata {
  slot: number;
  name: string;
  created: Date;
  modified: Date;
  playtime: number;
  thumbnail?: string;
  checksum: string;
}
```