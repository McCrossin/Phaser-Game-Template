// Core Game Types
export interface GameConfig {
    readonly WORLD_WIDTH: number;
    readonly WORLD_HEIGHT: number;
    readonly TILE_SIZE: number;
    readonly TARGET_FPS: number;
    readonly MAX_PROBES: number;
    readonly UPDATE_INTERVAL: number; // milliseconds
}

// Energy System Types
export interface EnergyState {
    readonly current: number; // kWh
    readonly capacity: number; // kWh
    readonly generation: number; // kW
    readonly consumption: number; // kW
}

export enum WeatherType {
    CLEAR = 'CLEAR',
    CLOUDY = 'CLOUDY',
    STORM = 'STORM'
}

// Equipment System Types
export interface EquipmentSlot {
    readonly id: number;
    readonly equipment: Equipment | null;
    readonly isActive: boolean;
}

export interface Equipment {
    readonly id: string;
    readonly name: string;
    readonly type: EquipmentType;
    readonly powerConsumption: number; // kW
    readonly slotRequirement: 1 | 2; // number of slots
    readonly environmentCompatibility: EnvironmentType[];
    readonly efficiency: number; // 0.0 to 1.0
}

export enum EquipmentType {
    SCANNER = 'SCANNER',
    MINING_LASER = 'MINING_LASER',
    DRILL = 'DRILL',
    SOLAR_PANEL = 'SOLAR_PANEL',
    BATTERY = 'BATTERY',
    FABRICATOR = 'FABRICATOR',
    CHEMICAL_PROCESSOR = 'CHEMICAL_PROCESSOR'
}

export enum EnvironmentType {
    VACUUM = 'VACUUM',
    ATMOSPHERIC = 'ATMOSPHERIC',
    CORROSIVE = 'CORROSIVE',
    HIGH_RADIATION = 'HIGH_RADIATION',
    EXTREME_TEMPERATURE = 'EXTREME_TEMPERATURE'
}

// Resource System Types
export interface Resource {
    readonly element: ChemicalElement;
    readonly quantity: number;
    readonly purity: number; // 0.0 to 1.0
    readonly discovered: boolean;
}

export interface ChemicalElement {
    readonly symbol: string;
    readonly name: string;
    readonly atomicNumber: number;
    readonly category: ElementCategory;
    readonly rarity: ResourceRarity;
}

export enum ElementCategory {
    ALKALI_METAL = 'ALKALI_METAL',
    ALKALINE_EARTH = 'ALKALINE_EARTH',
    TRANSITION_METAL = 'TRANSITION_METAL',
    POST_TRANSITION_METAL = 'POST_TRANSITION_METAL',
    METALLOID = 'METALLOID',
    NONMETAL = 'NONMETAL',
    HALOGEN = 'HALOGEN',
    NOBLE_GAS = 'NOBLE_GAS',
    LANTHANIDE = 'LANTHANIDE',
    ACTINIDE = 'ACTINIDE'
}

export enum ResourceRarity {
    ABUNDANT = 'ABUNDANT',
    COMMON = 'COMMON',
    UNCOMMON = 'UNCOMMON',
    RARE = 'RARE',
    VERY_RARE = 'VERY_RARE',
    EXOTIC = 'EXOTIC'
}

// Probe System Types
export interface ProbeState {
    readonly id: string;
    readonly position: Vector2D;
    readonly equipmentBay: EquipmentSlot[];
    readonly energyState: EnergyState;
    readonly movementSpeed: number; // tiles per second
    readonly isActive: boolean;
    readonly currentTask: ProbeTask | null;
}

export interface ProbeTask {
    readonly type: TaskType;
    readonly target: Vector2D;
    readonly duration: number; // seconds
    readonly energyRequired: number; // kWh
}

export enum TaskType {
    MOVE = 'MOVE',
    SCAN = 'SCAN',
    MINE = 'MINE',
    FABRICATE = 'FABRICATE',
    PLACE_EQUIPMENT = 'PLACE_EQUIPMENT',
    COLLECT_RESOURCE = 'COLLECT_RESOURCE'
}

// Circuit Technology Types
export interface Circuit {
    readonly tier: CircuitTier;
    readonly name: string;
    readonly fabricationTime: number; // seconds
    readonly powerRequired: number; // kW
    readonly materialsRequired: MaterialRequirement[];
    readonly capabilities: string[];
}

export enum CircuitTier {
    BASIC = 'BASIC', // 28nm - Tutorial phase
    ADVANCED = 'ADVANCED', // 14nm - Early game
    QUANTUM = 'QUANTUM' // 7nm - Mid game
}

export interface MaterialRequirement {
    readonly element: ChemicalElement;
    readonly quantity: number;
    readonly purityRequired: number;
}

// World Generation Types
export interface WorldTile {
    readonly position: Vector2D;
    readonly terrain: TerrainType;
    readonly resources: Resource[];
    readonly environment: EnvironmentType;
    readonly hazardLevel: number; // 0.0 to 1.0
    readonly discovered: boolean;
}

export enum TerrainType {
    PLAINS = 'PLAINS',
    MOUNTAINS = 'MOUNTAINS',
    CRATER = 'CRATER',
    VOLCANIC = 'VOLCANIC',
    ICE = 'ICE',
    CRYSTAL = 'CRYSTAL'
}

// Save System Types
export interface SaveData {
    readonly version: string;
    readonly timestamp: number;
    readonly probes: ProbeState[];
    readonly world: WorldState;
    readonly progress: ProgressState;
    readonly settings: GameSettings;
}

export interface WorldState {
    readonly seed: string;
    readonly discoveredTiles: Vector2D[];
    readonly placedEquipment: PlacedEquipment[];
    readonly globalResources: Resource[];
}

export interface PlacedEquipment {
    readonly equipment: Equipment;
    readonly position: Vector2D;
    readonly ownerId: string; // probe ID
}

export interface ProgressState {
    readonly tutorialComplete: boolean;
    readonly firstReplicationAchieved: boolean;
    readonly circuitsUnlocked: CircuitTier[];
    readonly elementsDiscovered: ChemicalElement[];
    readonly achievementsUnlocked: string[];
}

export interface GameSettings {
    readonly difficulty: DifficultyLevel;
    readonly autoSave: boolean;
    readonly performanceMode: boolean;
    readonly accessibilityOptions: AccessibilityOptions;
}

export enum DifficultyLevel {
    EXPLORER = 'EXPLORER',
    ENGINEER = 'ENGINEER',
    SCIENTIST = 'SCIENTIST'
}

export interface AccessibilityOptions {
    readonly colorBlindSupport: boolean;
    readonly highContrast: boolean;
    readonly textSize: number;
    readonly soundEnabled: boolean;
}

// Utility Types
export interface Vector2D {
    readonly x: number;
    readonly y: number;
}

export interface Rectangle {
    readonly x: number;
    readonly y: number;
    readonly width: number;
    readonly height: number;
}

// Performance Monitoring Types
export interface PerformanceMetrics {
    readonly fps: number;
    readonly memoryUsage: number; // MB
    readonly updateTime: number; // ms
    readonly renderTime: number; // ms
    readonly entityCount: number;
}

// Event System Types
export interface GameEvent {
    readonly type: string;
    readonly data: unknown;
    readonly timestamp: number;
}

export type EventHandler<T = unknown> = (data: T) => void;

// Component System Types (ECS)
export interface Component {
    readonly type: string;
}

export interface Entity {
    readonly id: string;
    readonly components: Map<string, Component>;
}

export interface System {
    readonly name: string;
    update(deltaTime: number, entities: Entity[]): void;
}
