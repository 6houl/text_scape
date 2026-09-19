/**
 * TextScape Command Parser
 * 
 * Routes text commands to appropriate game systems.
 */

const CommandParser = (() => {
  /**
   * Parse and execute a command
   * @param {string} input - Raw command input
   * @returns {object} Result { success, messages }
   */
  function parse(input) {
    const trimmed = input.trim();
    if (!trimmed) {
      return { success: false, messages: ['Enter a command.'] };
    }

    const [command, ...args] = trimmed.split(/\s+/);
    const target = args.join(' ');
    const state = GameState.getStateRef();

    // Help command
    if (command === 'help') {
      return {
        success: true,
        messages: [
          'Commands: look, move [direction/location], inventory, stats, quests, attack, potion, use [item], dungeon [name], save, reset'
        ]
      };
    }

    // Look / Examine
    if (command === 'look' || command === 'examine') {
      const location = getLocation(state.player.currentLocation);
      if (!location) {
        return { success: false, messages: ['Invalid location.'] };
      }

      const exits = Object.entries(location.exits || {})
        .map(([dir, dest]) => {
          const destLoc = getLocation(dest);
          return `${dir} → ${destLoc ? destLoc.name : dest}`;
        })
        .join(', ');

      return {
        success: true,
        messages: [
          `${location.description}`,
          exits ? `Exits: ${exits}` : 'No exits.'
        ]
      };
    }

    // Stats
    if (command === 'stats') {
      const p = state.player;
      return {
        success: true,
        messages: [
          `${p.name} - Level ${p.level} ${p.className}`,
          `Health: ${p.health}/${p.maxHealth} | Mana: ${p.mana}/${p.maxMana} | Gold: ${p.gold}g`,
          `STR: ${p.stats.STR} | AGI: ${p.stats.AGI} | INT: ${p.stats.INT} | VIT: ${p.stats.VIT} | Luck: ${p.stats.Luck}`
        ]
      };
    }

    // Inventory
    if (command === 'inventory' || command === 'inv') {
      const enriched = InventorySystem.getEnrichedInventory(state.inventory);
      if (enriched.length === 0) {
        return { success: true, messages: ['Your inventory is empty.'] };
      }

      const items = enriched.map(inv => {
        const def = inv.definition;
        return def ? `${def.name}${inv.quantity > 1 ? ` x${inv.quantity}` : ''}` : 'Unknown item';
      }).join(', ');

      return { success: true, messages: [items] };
    }

    // Quests
    if (command === 'quests') {
      if (state.quests.length === 0) {
        return { success: true, messages: ['No active quests.'] };
      }

      const questList = state.quests.map(q =>
        `${q.title} [${q.status.toUpperCase()}] - ${q.description}`
      ).join(' | ');

      return { success: true, messages: [questList] };
    }

    // Travel / Move
    if (command === 'travel' || command === 'move' || command === 'go') {
      if (!target) {
        return { success: false, messages: ['Travel where? Specify a direction or location.'] };
      }

      const result = TravelSystem.travel(state, target);
      if (result.success) {
        GameState.setLocation(result.newLocation);
        GameState.save();
      }
      return result;
    }

    // Combat - Attack
    if (command === 'attack' || command === 'fight') {
      const result = CombatSystem.attack(state);
      
      if (result.success) {
        // Apply combat result to state
        if (result.victory) {
          GameState.setCombat(null);
          if (result.rewards) {
            if (result.rewards.itemId) {
              const addResult = InventorySystem.addItem(state.inventory, result.rewards.itemId, 1);
              GameState.setInventory(addResult.inventory);
            }
          }
          state.combatStats.wins += 1;

          // Update related quest
          const relatedQuest = state.quests.find(q => q.id === 'relic_recovery');
          if (relatedQuest) {
            GameState.updateQuest('relic_recovery', { status: 'completed' });
          }
        } else if (result.defeat) {
          GameState.setCombat(null);
          GameState.setLocation('moonwatch_town');
          state.combatStats.losses += 1;
        } else {
          GameState.setCombat(result.combatState);
        }
        
        GameState.save();
      }

      return result;
    }

    // Combat - Flee
    if (command === 'flee' || command === 'run') {
      const result = CombatSystem.flee(state);
      if (result.success) {
        GameState.setCombat(null);
        GameState.save();
      }
      return result;
    }

    // Dungeon
    if (command === 'dungeon' || command === 'enter') {
      if (!target) {
        return { success: false, messages: ['Enter which dungeon?'] };
      }

      // Try to match dungeon by name
      const dungeonLocations = Object.values(LOCATIONS).filter(loc => loc.type === LOCATION_TYPES.DUNGEON);
      const match = dungeonLocations.find(loc => 
        loc.name.toLowerCase().includes(target.toLowerCase()) ||
        loc.id === target.toLowerCase()
      );

      if (!match) {
        return { success: false, messages: [`Dungeon not found: ${target}`] };
      }

      const result = CombatSystem.enterDungeon(state, match.id);
      if (result.success) {
        GameState.setCombat(result.combatState);
        GameState.setLocation(match.id);
        GameState.save();
      }
      return result;
    }

    // Use item / Potion
    if (command === 'use' || command === 'potion') {
      let itemIndex = -1;

      if (command === 'potion' || target.toLowerCase().includes('potion')) {
        // Find first potion
        itemIndex = state.inventory.findIndex(inv => {
          const def = getItemDefinition(inv.itemId);
          return def && def.type === ITEM_TYPES.POTION;
        });
      } else if (target) {
        // Try to find item by name
        itemIndex = state.inventory.findIndex(inv => {
          const def = getItemDefinition(inv.itemId);
          return def && def.name.toLowerCase().includes(target.toLowerCase());
        });
      }

      if (itemIndex < 0) {
        return { success: false, messages: ['Item not found in inventory.'] };
      }

      const result = InventorySystem.useItem(state.inventory, itemIndex, state.player);
      if (result.success) {
        GameState.setInventory(result.inventory);
        GameState.save();
      }
      return result;
    }

    // Save
    if (command === 'save') {
      GameState.save();
      return { success: true, messages: ['Progress saved.'] };
    }

    // Reset
    if (command === 'reset') {
      if (typeof TextScapeDB !== 'undefined') {
        TextScapeDB.resetCharacter();
        window.location.reload();
        return { success: true, messages: ['Resetting...'] };
      }
      return { success: false, messages: ['Cannot reset.'] };
    }

    // Unknown command
    return {
      success: false,
      messages: [`Unknown command: ${command}. Type 'help' for commands.`]
    };
  }

  return {
    parse
  };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = CommandParser;
}

// Expose globally
if (typeof window !== 'undefined') {
  window.CommandParser = CommandParser;
}
