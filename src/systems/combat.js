/**
 * TextScape Combat System
 * 
 * Handles turn-based combat encounters.
 */

const CombatSystem = (() => {
  /**
   * Enter a dungeon and initiate combat
   * @param {object} state - Game state
   * @param {string} dungeonLocationId - Dungeon location ID
   * @returns {object} Result { success, messages, combatState }
   */
  function enterDungeon(state, dungeonLocationId) {
    if (state.combat && state.combat.active) {
      return {
        success: false,
        messages: [`You are already fighting ${state.combat.enemy.name}!`],
        combatState: state.combat
      };
    }

    const location = getLocation(dungeonLocationId);
    if (!location || location.type !== LOCATION_TYPES.DUNGEON) {
      return {
        success: false,
        messages: ['That is not a dungeon.'],
        combatState: null
      };
    }

    // Find enemy in dungeon
    const enemyId = location.enemies ? location.enemies[0] : null;
    if (!enemyId) {
      return {
        success: false,
        messages: ['This dungeon has no enemies.'],
        combatState: null
      };
    }

    const enemyDef = getEnemyDefinition(enemyId);
    if (!enemyDef) {
      return {
        success: false,
        messages: ['Enemy definition not found.'],
        combatState: null
      };
    }

    // Create combat state
    const combatState = {
      active: true,
      locationId: dungeonLocationId,
      enemy: {
        id: enemyDef.id,
        name: enemyDef.name,
        health: enemyDef.maxHealth,
        maxHealth: enemyDef.maxHealth,
        damage: enemyDef.damage
      },
      rewardGold: enemyDef.rewardGold,
      rewardItem: enemyDef.rewardItem
    };

    return {
      success: true,
      messages: [`You enter ${location.name}. ${enemyDef.name} attacks!`],
      combatState
    };
  }

  /**
   * Player attacks enemy
   * @param {object} state - Game state
   * @returns {object} Result { success, messages, combatState, victory, defeat }
   */
  function attack(state) {
    if (!state.combat || !state.combat.active) {
      return {
        success: false,
        messages: ['You are not in combat.'],
        combatState: null,
        victory: false,
        defeat: false
      };
    }

    const player = state.player;
    const enemy = state.combat.enemy;
    const messages = [];

    // Calculate player damage
    const baseDamage = 18;
    const strBonus = player.stats.STR || 0;
    const agiBonus = Math.floor((player.stats.AGI || 0) / 4);
    const playerDamage = baseDamage + strBonus + agiBonus;

    // Player attacks
    enemy.health -= playerDamage;
    messages.push(`You hit ${enemy.name} for ${playerDamage} damage.`);

    // Check if enemy defeated
    if (enemy.health <= 0) {
      const rewards = {
        gold: state.combat.rewardGold || 0,
        itemId: state.combat.rewardItem
      };

      messages.push(`Victory! You defeated ${enemy.name}.`);
      
      if (rewards.gold > 0) {
        player.gold += rewards.gold;
        messages.push(`You found ${rewards.gold} gold.`);
      }

      if (rewards.itemId) {
        const itemDef = getItemDefinition(rewards.itemId);
        if (itemDef) {
          messages.push(`You claimed ${itemDef.name}!`);
        }
      }

      return {
        success: true,
        messages,
        combatState: { ...state.combat, active: false },
        victory: true,
        defeat: false,
        rewards
      };
    }

    // Enemy attacks back
    const enemyDamage = enemy.damage + Math.floor(Math.random() * 5);
    player.health -= enemyDamage;
    messages.push(`${enemy.name} hits you for ${enemyDamage} damage.`);

    // Check if player defeated
    if (player.health <= 0) {
      player.health = player.maxHealth; // Respawn
      messages.push(`${enemy.name} defeated you. You wake up in Moonwatch Town.`);

      return {
        success: true,
        messages,
        combatState: { ...state.combat, active: false },
        victory: false,
        defeat: true
      };
    }

    // Combat continues
    return {
      success: true,
      messages,
      combatState: state.combat,
      victory: false,
      defeat: false
    };
  }

  /**
   * Flee from combat
   * @param {object} state - Game state
   * @returns {object} Result { success, messages }
   */
  function flee(state) {
    if (!state.combat || !state.combat.active) {
      return {
        success: false,
        messages: ['You are not in combat.']
      };
    }

    const messages = [`You flee from ${state.combat.enemy.name}.`];
    
    return {
      success: true,
      messages,
      combatState: { ...state.combat, active: false }
    };
  }

  return {
    enterDungeon,
    attack,
    flee
  };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CombatSystem;
}

// Expose globally
if (typeof window !== 'undefined') {
  window.CombatSystem = CombatSystem;
}
