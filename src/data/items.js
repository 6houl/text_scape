/**
 * TextScape Item Definitions
 * 
 * Immutable item templates that define all items in the game.
 * Player inventory references these by ID and stores only instance data (quantity, etc).
 * 
 * IDs are permanent database identifiers - never change them.
 */

const ITEM_TYPES = {
  WEAPON: 'weapon',
  ARMOR: 'armor',
  TRINKET: 'trinket',
  POTION: 'potion',
  RESOURCE: 'resource',
  QUEST: 'quest',
  KEY: 'key',
  MISC: 'misc'
};

const ITEM_RARITY = {
  COMMON: 'common',
  UNCOMMON: 'uncommon',
  RARE: 'rare',
  EPIC: 'epic',
  LEGENDARY: 'legendary'
};

/**
 * Master item definitions
 * Each item MUST have: id, name, icon (semantic asset name), type, description, value
 * Optional: rarity, stackable, maxStack, equipSlot
 */
const ITEMS = {
  // Weapons
  iron_sword: {
    id: 'iron_sword',
    name: 'Iron Sword',
    icon: 'iron_sword',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.COMMON,
    description: 'A balanced iron blade.',
    value: 24,
    stackable: false,
    equipSlot: 'mainHand'
  },

  steel_sword: {
    id: 'steel_sword',
    name: 'Steel Sword',
    icon: 'steel_sword',
    type: ITEM_TYPES.WEAPON,
    rarity: ITEM_RARITY.UNCOMMON,
    description: 'Forged steel, sharp and reliable.',
    value: 45,
    stackable: false,
    equipSlot: 'mainHand'
  },

  // Trinkets & Jewelry
  moonstone_charm: {
    id: 'moonstone_charm',
    name: 'Moonstone Charm',
    icon: 'moonstone_charm',
    type: ITEM_TYPES.TRINKET,
    rarity: ITEM_RARITY.RARE,
    description: 'A charm humming with lunar energy.',
    value: 18,
    stackable: false,
    equipSlot: 'trinket'
  },

  // Potions
  healing_potion: {
    id: 'healing_potion',
    name: 'Healing Potion',
    icon: 'health_potion',
    type: ITEM_TYPES.POTION,
    rarity: ITEM_RARITY.COMMON,
    description: 'Restores 120 health.',
    value: 12,
    stackable: true,
    maxStack: 99,
    useEffect: { type: 'heal', amount: 120 }
  },

  mana_potion: {
    id: 'mana_potion',
    name: 'Mana Potion',
    icon: 'mana_potion',
    type: ITEM_TYPES.POTION,
    rarity: ITEM_RARITY.COMMON,
    description: 'Restores 80 mana.',
    value: 10,
    stackable: true,
    maxStack: 99,
    useEffect: { type: 'mana', amount: 80 }
  },

  // Quest Items
  map_fragment: {
    id: 'map_fragment',
    name: 'Map Fragment',
    icon: 'map_fragment',
    type: ITEM_TYPES.QUEST,
    rarity: ITEM_RARITY.UNCOMMON,
    description: 'A torn piece of a world map.',
    value: 8,
    stackable: false
  },

  sunken_key: {
    id: 'sunken_key',
    name: 'Sunken Key',
    icon: 'sunken_key',
    type: ITEM_TYPES.KEY,
    rarity: ITEM_RARITY.RARE,
    description: 'Opens a hidden lock.',
    value: 14,
    stackable: false
  },

  relic_of_dawn: {
    id: 'relic_of_dawn',
    name: 'Relic of Dawn',
    icon: 'relic_of_dawn',
    type: ITEM_TYPES.QUEST,
    rarity: ITEM_RARITY.EPIC,
    description: 'A dungeon victory reward.',
    value: 35,
    stackable: false
  },

  // Resources
  moonbloom_herb: {
    id: 'moonbloom_herb',
    name: 'Moonbloom Herb',
    icon: 'moonbloom_herb',
    type: ITEM_TYPES.RESOURCE,
    rarity: ITEM_RARITY.COMMON,
    description: 'A luminous herb found in ancient forests.',
    value: 5,
    stackable: true,
    maxStack: 99
  }
};

/**
 * Get item definition by ID
 * @param {string} itemId - Item identifier
 * @returns {object|null} Item definition or null
 */
function getItemDefinition(itemId) {
  const item = ITEMS[itemId];
  if (!item) {
    console.warn(`[Items] Unknown item ID: ${itemId}`);
    return null;
  }
  return { ...item }; // Return a copy to prevent mutation
}

/**
 * Create a player inventory instance from an item ID
 * @param {string} itemId - Item identifier
 * @param {number} quantity - Stack quantity (default 1)
 * @returns {object|null} Inventory instance or null
 */
function createInventoryInstance(itemId, quantity = 1) {
  const itemDef = getItemDefinition(itemId);
  if (!itemDef) return null;

  return {
    itemId: itemId,
    quantity: quantity
  };
}

/**
 * Validate all item definitions have required asset mappings
 */
function validateItemAssets() {
  const references = [];
  Object.values(ITEMS).forEach(item => {
    references.push({
      category: 'items',
      name: item.icon,
      context: `Item: ${item.id}`
    });
  });
  
  if (typeof validateAssetReferences === 'function') {
    return validateAssetReferences(references);
  }
  return [];
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = {
    ITEM_TYPES,
    ITEM_RARITY,
    ITEMS,
    getItemDefinition,
    createInventoryInstance,
    validateItemAssets
  };
}

// Expose globally for browser usage
if (typeof window !== 'undefined') {
  window.ITEM_TYPES = ITEM_TYPES;
  window.ITEM_RARITY = ITEM_RARITY;
  window.ITEMS = ITEMS;
  window.getItemDefinition = getItemDefinition;
  window.createInventoryInstance = createInventoryInstance;
  window.validateItemAssets = validateItemAssets;
}
