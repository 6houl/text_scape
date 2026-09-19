/**
 * TextScape World Definition
 * 
 * Immutable world structure defining all locations, their connections,
 * and static content. This is NOT player state - player progress is tracked separately.
 * 
 * Location IDs are permanent database identifiers - never change them.
 */

const LOCATION_TYPES = {
  TOWN: 'town',
  ROAD: 'road',
  WILDERNESS: 'wilderness',
  DUNGEON: 'dungeon',
  LANDMARK: 'landmark'
};

const DANGER_LEVELS = {
  SAFE: 0,
  LOW: 1,
  MODERATE: 2,
  HIGH: 3,
  DEADLY: 4
};

/**
 * World locations graph
 * Each location must have: id, name, type, description, exits
 * Optional: region, dangerLevel, npcs, enemies, interactables, resources
 */
const LOCATIONS = {
  moonwatch_town: {
    id: 'moonwatch_town',
    name: 'Moonwatch Town',
    region: 'The Ashen Reach',
    type: LOCATION_TYPES.TOWN,
    dangerLevel: DANGER_LEVELS.SAFE,
    description: 'A quiet frontier town beneath warm lanterns. Merchants call out their wares while travelers rest at the inn. The eastern gate leads to the wilds.',
    exits: {
      east: 'eastern_gate',
      south: 'trade_road'
    },
    npcs: ['trader_marcus', 'innkeeper_elara'],
    interactables: ['town_notice_board', 'merchant_stall']
  },

  eastern_gate: {
    id: 'eastern_gate',
    name: 'Eastern Gate',
    region: 'The Ashen Reach',
    type: LOCATION_TYPES.LANDMARK,
    dangerLevel: DANGER_LEVELS.SAFE,
    description: 'The weathered gate marks the edge of civilization. Guards nod as you pass. The Old King\'s Road stretches east into darkening woods.',
    exits: {
      west: 'moonwatch_town',
      east: 'old_kings_road'
    },
    npcs: ['gate_guard']
  },

  old_kings_road: {
    id: 'old_kings_road',
    name: 'Old King\'s Road',
    region: 'The Ashen Reach',
    type: LOCATION_TYPES.ROAD,
    dangerLevel: DANGER_LEVELS.LOW,
    description: 'Ancient cobblestones crack beneath moss and roots. The forest presses close on both sides. Something watches from the shadows.',
    exits: {
      west: 'eastern_gate',
      north: 'blackwood_edge',
      south: 'trade_road'
    }
  },

  blackwood_edge: {
    id: 'blackwood_edge',
    name: 'Blackwood Forest',
    region: 'The Ashen Reach',
    type: LOCATION_TYPES.WILDERNESS,
    dangerLevel: DANGER_LEVELS.MODERATE,
    description: 'Rain falls through the twisted canopy. The remains of an old wagon lie overturned beside the trail. Fresh tracks disappear into the trees.',
    exits: {
      south: 'old_kings_road',
      north: 'blackwood_depths',
      west: 'ruined_shrine'
    },
    interactables: ['abandoned_wagon'],
    enemies: ['forest_wolf', 'shadow_lurker']
  },

  blackwood_depths: {
    id: 'blackwood_depths',
    name: 'Blackwood Depths',
    region: 'The Ashen Reach',
    type: LOCATION_TYPES.WILDERNESS,
    dangerLevel: DANGER_LEVELS.HIGH,
    description: 'The canopy chokes out daylight. Ancient trees groan in the wind. A stone entrance carved with warnings leads underground.',
    exits: {
      south: 'blackwood_edge',
      down: 'gloom_den'
    },
    interactables: ['ancient_tree', 'warning_stones'],
    enemies: ['dire_wolf', 'corrupted_treant']
  },

  ruined_shrine: {
    id: 'ruined_shrine',
    name: 'Ruined Shrine',
    region: 'The Ashen Reach',
    type: LOCATION_TYPES.LANDMARK,
    dangerLevel: DANGER_LEVELS.LOW,
    description: 'Crumbling stone pillars surround a weathered altar. Moonbloom herbs grow in the cracks. The air hums with faded magic.',
    exits: {
      east: 'blackwood_edge'
    },
    interactables: ['ancient_altar'],
    resources: ['moonbloom_herb']
  },

  gloom_den: {
    id: 'gloom_den',
    name: 'Gloom Den',
    region: 'The Ashen Reach',
    type: LOCATION_TYPES.DUNGEON,
    dangerLevel: DANGER_LEVELS.HIGH,
    description: 'Darkness swallows the torchlight. Water drips from slick stone walls. The Wraithfang lurks in the depths.',
    exits: {
      up: 'blackwood_depths'
    },
    enemies: ['wraithfang_boss']
  },

  trade_road: {
    id: 'trade_road',
    name: 'Trade Road',
    region: 'The Ashen Reach',
    type: LOCATION_TYPES.ROAD,
    dangerLevel: DANGER_LEVELS.LOW,
    description: 'A well-traveled path connecting Moonwatch to the southern settlements. Wagon ruts mark the packed earth.',
    exits: {
      north: 'moonwatch_town',
      east: 'old_kings_road',
      south: 'ember_ridge'
    }
  },

  ember_ridge: {
    id: 'ember_ridge',
    name: 'Ember Ridge',
    region: 'The Scorched Expanse',
    type: LOCATION_TYPES.WILDERNESS,
    dangerLevel: DANGER_LEVELS.MODERATE,
    description: 'A glowing volcanic slope covered in ash. Heat shimmers rise from cracks in the blackened stone. Sulfur stings the air.',
    exits: {
      north: 'trade_road',
      east: 'crystal_pass'
    },
    enemies: ['ember_elemental', 'ash_wraith']
  },

  crystal_pass: {
    id: 'crystal_pass',
    name: 'Crystal Pass',
    region: 'The Scorched Expanse',
    type: LOCATION_TYPES.LANDMARK,
    dangerLevel: DANGER_LEVELS.MODERATE,
    description: 'A mountain route lined with luminous crystals. Their light casts strange shadows. The path winds higher into mist.',
    exits: {
      west: 'ember_ridge'
    },
    resources: ['crystal_shard'],
    interactables: ['crystal_formation']
  }
};

/**
 * Get location definition by ID
 * @param {string} locationId - Location identifier
 * @returns {object|null} Location definition or null
 */
function getLocation(locationId) {
  const location = LOCATIONS[locationId];
  if (!location) {
    console.warn(`[World] Unknown location ID: ${locationId}`);
    return null;
  }
  return { ...location }; // Return copy to prevent mutation
}

/**
 * Get available exits from a location
 * @param {string} locationId - Location identifier
 * @returns {object} Map of direction => destination ID
 */
function getExits(locationId) {
  const location = getLocation(locationId);
  return location ? { ...location.exits } : {};
}

/**
 * Resolve travel destination from current location and direction/target
 * @param {string} fromLocationId - Current location ID
 * @param {string} directionOrTarget - Direction (north/south/east/west/up/down) or destination name/ID
 * @returns {object} { success: boolean, destination: string|null, reason: string|null }
 */
function resolveTravel(fromLocationId, directionOrTarget) {
  const location = getLocation(fromLocationId);
  if (!location) {
    return { success: false, destination: null, reason: 'Invalid current location' };
  }

  const exits = location.exits;
  const input = directionOrTarget.toLowerCase().trim();

  // Try direct direction match
  if (exits[input]) {
    return { success: true, destination: exits[input], reason: null };
  }

  // Try matching destination by name or ID
  const destinationIds = Object.values(exits);
  for (const destId of destinationIds) {
    const destLocation = getLocation(destId);
    if (destLocation) {
      if (destId === input || destLocation.name.toLowerCase().includes(input)) {
        return { success: true, destination: destId, reason: null };
      }
    }
  }

  // No valid route found
  return { success: false, destination: null, reason: 'No path in that direction' };
}

/**
 * Get breadcrumb path for location (region > parent > location)
 * @param {string} locationId - Location identifier
 * @returns {string} Formatted breadcrumb
 */
function getLocationBreadcrumb(locationId) {
  const location = getLocation(locationId);
  if (!location) return '';

  const parts = [];
  if (location.region) parts.push(location.region);
  parts.push(location.name);
  
  return parts.join(' > ');
}

/**
 * Validate world graph integrity (development helper)
 * Checks for broken exits, orphaned locations, etc.
 */
function validateWorldGraph() {
  const errors = [];
  const warnings = [];
  const locationIds = Object.keys(LOCATIONS);

  locationIds.forEach(id => {
    const location = LOCATIONS[id];
    
    // Check exits point to valid locations
    Object.entries(location.exits || {}).forEach(([direction, targetId]) => {
      if (!LOCATIONS[targetId]) {
        errors.push(`${id}: exit ${direction} points to non-existent location ${targetId}`);
      }
    });

    // Check for orphaned locations (no incoming connections except starting location)
    if (id !== 'moonwatch_town') {
      const hasIncoming = locationIds.some(otherId => {
        const other = LOCATIONS[otherId];
        return Object.values(other.exits || {}).includes(id);
      });
      
      if (!hasIncoming) {
        warnings.push(`${id}: orphaned location (no incoming connections)`);
      }
    }
  });

  if (errors.length > 0) {
    console.error('[World] Graph validation errors:', errors);
  }
  if (warnings.length > 0) {
    console.warn('[World] Graph validation warnings:', warnings);
  }

  return { errors, warnings, valid: errors.length === 0 };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    LOCATION_TYPES,
    DANGER_LEVELS,
    LOCATIONS,
    getLocation,
    getExits,
    resolveTravel,
    getLocationBreadcrumb,
    validateWorldGraph
  };
}

// Expose globally for browser usage
if (typeof window !== 'undefined') {
  window.LOCATION_TYPES = LOCATION_TYPES;
  window.DANGER_LEVELS = DANGER_LEVELS;
  window.LOCATIONS = LOCATIONS;
  window.getLocation = getLocation;
  window.getExits = getExits;
  window.resolveTravel = resolveTravel;
  window.getLocationBreadcrumb = getLocationBreadcrumb;
  window.validateWorldGraph = validateWorldGraph;
}
