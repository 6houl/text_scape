/**
 * TextScape Enemy Definitions
 * 
 * Enemy templates for combat encounters.
 * IDs are permanent - never change them.
 */

const ENEMIES = {
  wraithfang_boss: {
    id: 'wraithfang_boss',
    name: 'Wraithfang',
    maxHealth: 120,
    damage: 8,
    rewardGold: 50,
    rewardItem: 'relic_of_dawn',
    description: 'A spectral beast with glowing eyes and dripping fangs.'
  },

  bone_archivist: {
    id: 'bone_archivist',
    name: 'Bone Archivist',
    maxHealth: 100,
    damage: 6,
    rewardGold: 40,
    rewardItem: null,
    description: 'An undead scholar guarding forgotten knowledge.'
  },

  forest_wolf: {
    id: 'forest_wolf',
    name: 'Forest Wolf',
    maxHealth: 40,
    damage: 5,
    rewardGold: 10,
    rewardItem: null,
    description: 'A hungry wolf prowling the forest.'
  },

  shadow_lurker: {
    id: 'shadow_lurker',
    name: 'Shadow Lurker',
    maxHealth: 30,
    damage: 4,
    rewardGold: 8,
    rewardItem: null,
    description: 'A creature of living darkness.'
  },

  dire_wolf: {
    id: 'dire_wolf',
    name: 'Dire Wolf',
    maxHealth: 60,
    damage: 7,
    rewardGold: 15,
    rewardItem: null,
    description: 'A massive wolf with scarred hide.'
  },

  ember_elemental: {
    id: 'ember_elemental',
    name: 'Ember Elemental',
    maxHealth: 50,
    damage: 6,
    rewardGold: 12,
    rewardItem: null,
    description: 'A being of living fire and ash.'
  }
};

function getEnemyDefinition(enemyId) {
  const enemy = ENEMIES[enemyId];
  if (!enemy) {
    console.warn(`[Enemies] Unknown enemy ID: ${enemyId}`);
    return null;
  }
  return { ...enemy };
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ENEMIES, getEnemyDefinition };
}

// Expose globally
if (typeof window !== 'undefined') {
  window.ENEMIES = ENEMIES;
  window.getEnemyDefinition = getEnemyDefinition;
}
