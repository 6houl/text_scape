/**
 * TextScape State Management
 * 
 * Central game state and state mutation functions.
 */

const GameState = (() => {
  let state = null;
  let saveCallback = null;
  let messageCallback = null;

  /**
   * Initialize game state from saved data
   * @param {object} savedData - Data from TextScapeDB
   */
  function initialize(savedData) {
    state = {
      player: {
        id: savedData.id,
        name: savedData.name,
        className: savedData.className,
        level: savedData.level,
        xp: savedData.xp || 0,
        health: savedData.health,
        maxHealth: savedData.maxHealth,
        mana: savedData.mana,
        maxMana: savedData.maxMana,
        stamina: savedData.stamina,
        maxStamina: savedData.maxStamina,
        gold: savedData.gold,
        stats: savedData.stats,
        currentLocation: savedData.currentLocation,
        equipment: savedData.equipment
      },
      inventory: savedData.inventory || [],
      quests: savedData.quests || [],
      combat: savedData.combat || null,
      combatStats: savedData.combatStats || { wins: 0, losses: 0 }
    };

    // Validate current location
    if (!getLocation(state.player.currentLocation)) {
      console.warn('[State] Invalid starting location, defaulting to moonwatch_town');
      state.player.currentLocation = 'moonwatch_town';
    }

    return state;
  }

  /**
   * Get current state (readonly copy)
   */
  function getState() {
    return state ? JSON.parse(JSON.stringify(state)) : null;
  }

  /**
   * Get mutable state reference (use carefully)
   */
  function getStateRef() {
    return state;
  }

  /**
   * Register save callback
   */
  function onSave(callback) {
    saveCallback = callback;
  }

  /**
   * Register message callback
   */
  function onMessage(callback) {
    messageCallback = callback;
  }

  /**
   * Emit messages to UI
   */
  function emitMessages(messages, type = 'system') {
    if (messageCallback && Array.isArray(messages)) {
      messages.forEach(msg => messageCallback(msg, type));
    }
  }

  /**
   * Save current state
   */
  function save() {
    if (saveCallback && state) {
      const saveData = {
        schemaVersion: 2,
        ...state.player,
        inventory: state.inventory,
        quests: state.quests,
        combat: state.combat,
        combatStats: state.combatStats
      };
      saveCallback(saveData);
    }
  }

  /**
   * Update player location
   */
  function setLocation(locationId) {
    if (state) {
      state.player.currentLocation = locationId;
    }
  }

  /**
   * Update player stats
   */
  function updatePlayer(updates) {
    if (state) {
      Object.assign(state.player, updates);
    }
  }

  /**
   * Update inventory
   */
  function setInventory(newInventory) {
    if (state) {
      state.inventory = newInventory;
    }
  }

  /**
   * Update combat state
   */
  function setCombat(combatState) {
    if (state) {
      state.combat = combatState;
    }
  }

  /**
   * Update quest
   */
  function updateQuest(questId, updates) {
    if (state) {
      const quest = state.quests.find(q => q.id === questId);
      if (quest) {
        Object.assign(quest, updates);
      }
    }
  }

  return {
    initialize,
    getState,
    getStateRef,
    onSave,
    onMessage,
    emitMessages,
    save,
    setLocation,
    updatePlayer,
    setInventory,
    setCombat,
    updateQuest
  };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = GameState;
}

// Expose globally
if (typeof window !== 'undefined') {
  window.GameState = GameState;
}
