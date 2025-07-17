# Resource Management System Design

## Overview
The Resource Management System handles the collection, storage, and utilization of 118 elements from the periodic table. It provides realistic resource distribution, efficient inventory management, and meaningful progression through resource tiers.

## Resource Categories

### Tier 1: Basic Resources
- **Elements**: Iron (Fe), Silicon (Si), Carbon (C), Copper (Cu)
- **Abundance**: 30-40% of deposits
- **Extraction**: Basic mining laser, 5kW power
- **Uses**: Fundamental construction, basic circuits

### Tier 2: Specialized Resources
- **Elements**: Titanium (Ti), Lithium (Li), Aluminum (Al), Gold (Au)
- **Abundance**: 15-25% of deposits
- **Extraction**: Advanced drill, 10kW power
- **Uses**: Advanced equipment, battery systems

### Tier 3: Rare Resources
- **Elements**: Platinum (Pt), Rare Earth Elements (REE)
- **Abundance**: 5-10% of deposits
- **Extraction**: Chemical extraction, 15kW power
- **Uses**: Quantum circuits, specialized tools

### Tier 4: Exotic Resources
- **Elements**: Uranium (U), Thorium (Th), Meteorite materials
- **Abundance**: <2% of deposits
- **Extraction**: Specialized equipment, 20kW+ power
- **Uses**: Advanced power systems, warp technology

## Storage System

### Probe Storage
- **Base Capacity**: 100 units
- **Upgrade Path**: 
  - Mk1: 100 units
  - Mk2: 250 units
  - Mk3: 500 units
- **Organization**: Grid-based inventory
- **Stack Limits**: 999 per element type

### Facility Storage
- **Storage Silo**: 10,000 units capacity
- **Specialized Storage**:
  - Cryogenic: For volatile elements
  - Shielded: For radioactive materials
  - Pressurized: For gases
- **Network Access**: Linked storage facilities

## Resource Detection

### Scanner Types
- **Basic Scanner**: 50m range, identifies resource type
- **Deep Scanner**: 200m range, shows quantity
- **Spectral Analyzer**: 500m range, full composition
- **Quantum Scanner**: 1km range, predicts yields

### Discovery Mechanics
- **Surface Scanning**: Visual indicators on terrain
- **Deep Scanning**: Subsurface deposit mapping
- **Sample Analysis**: Precise composition data
- **Pattern Recognition**: AI-assisted deposit location

## Extraction Mechanics

### Mining Process
1. **Target Identification**: Scanner highlights deposits
2. **Tool Selection**: Choose appropriate extractor
3. **Extraction**: Hold tool on deposit
4. **Collection**: Resources auto-collect to inventory
5. **Depletion**: Deposits have finite resources

### Extraction Rates
- **Mining Laser**: 1 unit/second (basic ores)
- **Pneumatic Drill**: 2 units/second (hard deposits)
- **Chemical Extractor**: 0.5 units/second (pure extraction)
- **Quantum Harvester**: 5 units/second (energy intensive)

### Environmental Factors
- **Terrain Type**: Affects extraction speed
- **Weather**: Rain reduces laser efficiency
- **Temperature**: Affects chemical processes
- **Pressure**: Deep extraction challenges

## Resource Processing

### Refinement
- **Ore to Pure**: 3:1 ratio typically
- **Energy Cost**: 5kW per refinement cycle
- **Time**: 10 seconds per batch
- **Quality Levels**: 
  - Raw: Direct extraction
  - Refined: 85% purity
  - Pure: 99% purity

### Combination Recipes
- **Alloys**: Combine metals for materials
- **Compounds**: Chemical combinations
- **Circuits**: Silicon + rare elements
- **Catalysts**: Enable advanced reactions

## Resource Economy

### Value System
- **Abundance Factor**: Rarer = more valuable
- **Utility Factor**: Usefulness in recipes
- **Energy Factor**: Extraction difficulty
- **Tech Factor**: Required tech level

### Trading (Future Feature)
- **Inter-probe**: Transfer between units
- **Settlements**: Trade with colonies
- **Contracts**: Automated exchanges
- **Market**: Dynamic pricing

## Inventory Management UI

### Visual Design
- **Grid Layout**: 10x10 default view
- **Color Coding**: By element type/rarity
- **Quantity Display**: Stack numbers
- **Quick Actions**: 
  - Drop
  - Transfer
  - Use in recipe
  - Analyze

### Sorting Options
- **By Type**: Metals, non-metals, etc.
- **By Rarity**: Common to exotic
- **By Quantity**: Most to least
- **By Recent**: Last collected first

### Search and Filter
- **Name Search**: Type element name
- **Property Filter**: Conductivity, weight
- **Usage Filter**: Show recipe ingredients
- **Location Filter**: In probe vs storage

## Performance Optimization

### Data Structures
- **Sparse Arrays**: For large inventories
- **Bit Flags**: For resource properties
- **Pooled Objects**: For UI elements
- **Compressed Storage**: For save files

### Update Strategies
- **Batch Updates**: Group inventory changes
- **Dirty Flags**: Only update changed items
- **Lazy Loading**: Load visible items only
- **Predictive Caching**: Pre-load likely needs

## Balance Considerations

### Progression Curve
- **Early Game**: Abundant basics, scarce power
- **Mid Game**: Balanced variety, storage limits
- **Late Game**: Rare resource hunts, efficiency focus

### Bottlenecks
- **Storage**: Forces base building
- **Extraction Rate**: Encourages tool upgrades
- **Power**: Limits simultaneous operations
- **Rarity**: Gates advanced technology

## Technical Implementation

### Resource Data Structure
```typescript
interface Resource {
  elementId: number;        // Atomic number
  symbol: string;          // Chemical symbol
  name: string;            // Full name
  quantity: number;        // Current amount
  maxStack: number;        // Stack limit
  tier: ResourceTier;      // Rarity tier
  properties: BitFlags;    // Physical properties
}
```

### Storage Container
```typescript
interface StorageContainer {
  capacity: number;
  resources: Map<number, Resource>;
  specialization?: StorageType;
  networkId?: string;
  
  add(resource: Resource): boolean;
  remove(elementId: number, quantity: number): boolean;
  canStore(resource: Resource): boolean;
}
```