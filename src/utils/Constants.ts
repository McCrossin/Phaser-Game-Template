// Game Constants
export const GAME_CONSTANTS = {
  // Performance
  TARGET_FPS: 60,
  UPDATE_INTERVAL: 100, // ms
  
  // World
  WORLD_WIDTH: 2048,
  WORLD_HEIGHT: 2048,
  TILE_SIZE: 32,
  
  // Probe
  MAX_PROBES: 10,
  PROBE_SPEED: 200, // pixels per second
  
  // Energy System (kW units)
  POWER_LEVELS: {
    IDLE: 0.1,
    SCANNING: 0.3,
    MINING: 2.5,
    DRILLING: 6.0,
    MANUFACTURING: 15.0
  },
  
  // Solar Panel Tiers (kW output)
  SOLAR_PANELS: {
    BASIC: 5,
    IMPROVED: 10,
    ADVANCED: 25
  },
  
  // Weather Multipliers
  WEATHER_MULTIPLIERS: {
    CLEAR: 1.0,
    CLOUDY: 0.5,
    STORM: 0.25
  },
  
  // Equipment
  EQUIPMENT_SLOTS: 4,
  
  // Circuit Tiers
  CIRCUIT_TIERS: {
    BASIC: {
      name: '28nm',
      powerRequired: 15, // kW
      fabricationTime: 300 // seconds
    },
    ADVANCED: {
      name: '14nm', 
      powerRequired: 20, // kW
      fabricationTime: 600 // seconds
    },
    QUANTUM: {
      name: '7nm',
      powerRequired: 25, // kW
      fabricationTime: 1200 // seconds
    }
  }
} as const;

// Color Palette
export const COLORS = {
  // Primary colors
  PRIMARY_GREEN: '#00ff88',
  SECONDARY_GREEN: '#88ffaa',
  ACCENT_BLUE: '#4488ff',
  
  // UI colors
  BACKGROUND_DARK: '#040218',
  BACKGROUND_MEDIUM: '#0a0a1a', 
  BACKGROUND_LIGHT: '#1a0a2e',
  
  // Status colors
  SUCCESS: '#00ff00',
  WARNING: '#ffaa00',
  ERROR: '#ff4444',
  INFO: '#4488ff',
  
  // Resource colors
  ENERGY: '#ffff00',
  MATERIAL: '#888888',
  RARE_MATERIAL: '#ff88ff'
} as const;

// Input key mappings
export const INPUT_KEYS = {
  MOVE_UP: ['W', 'ARROW_UP'],
  MOVE_DOWN: ['S', 'ARROW_DOWN'],
  MOVE_LEFT: ['A', 'ARROW_LEFT'],
  MOVE_RIGHT: ['D', 'ARROW_RIGHT'],
  
  INTERACT: ['E', 'SPACE'],
  MENU: ['ESC', 'TAB'],
  INVENTORY: ['I'],
  MAP: ['M'],
  
  // Development keys
  DEBUG_TOGGLE: ['F3'],
  PERFORMANCE_OVERLAY: ['F4'],
  RELOAD: ['F5']
} as const;
