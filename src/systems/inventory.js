/**
 * TextScape Inventory System
 * 
 * Manages player inventory operations using item definition references.
 */

const InventorySystem = (() => {
  /**
   * Add an item to inventory
   * @param {array} inventory - Player inventory array
   * @param {string} itemId - Item definition ID
   * @param {number} quantity - Quantity to add
   * @returns {object} Result { success, messages, inventory }
   */
  function addItem(inventory, itemId, quantity = 1) {
    const itemDef = getItemDefinition(itemId);
    if (!itemDef) {
      return {
        success: false,
        messages: [`Unknown item: ${itemId}`],
        inventory
      };
    }

    // Check if item is stackable and already in inventory
    if (itemDef.stackable) {
      const existing = inventory.find(inv => inv.itemId === itemId);
      if (existing) {
        const maxStack = itemDef.maxStack || 99;
        const newQuantity = Math.min(existing.quantity + quantity, maxStack);
        existing.quantity = newQuantity;
        
        return {
          success: true,
          messages: [`Added ${quantity}x ${itemDef.name} to your inventory.`],
          inventory
        };
      }
    }

    // Add new item instance
    inventory.push(createInventoryInstance(itemId, quantity));
    
    return {
      success: true,
      messages: [`Added ${itemDef.name} to your inventory.`],
      inventory
    };
  }

  /**
   * Remove an item from inventory
   * @param {array} inventory - Player inventory array
   * @param {number} index - Inventory slot index
   * @param {number} quantity - Quantity to remove (default all)
   * @returns {object} Result { success, messages, inventory, removedItem }
   */
  function removeItem(inventory, index, quantity = null) {
    if (index < 0 || index >= inventory.length) {
      return {
        success: false,
        messages: ['Invalid inventory slot.'],
        inventory,
        removedItem: null
      };
    }

    const invItem = inventory[index];
    const itemDef = getItemDefinition(invItem.itemId);
    
    if (!itemDef) {
      return {
        success: false,
        messages: ['Item definition not found.'],
        inventory,
        removedItem: null
      };
    }

    const removeQuantity = quantity === null ? invItem.quantity : Math.min(quantity, invItem.quantity);

    if (removeQuantity >= invItem.quantity) {
      // Remove entire stack
      inventory.splice(index, 1);
      return {
        success: true,
        messages: [`Removed ${itemDef.name}.`],
        inventory,
        removedItem: { itemId: invItem.itemId, quantity: removeQuantity }
      };
    } else {
      // Reduce stack
      invItem.quantity -= removeQuantity;
      return {
        success: true,
        messages: [`Removed ${removeQuantity}x ${itemDef.name}.`],
        inventory,
        removedItem: { itemId: invItem.itemId, quantity: removeQuantity }
      };
    }
  }

  /**
   * Use a consumable item
   * @param {array} inventory - Player inventory array
   * @param {number} index - Inventory slot index
   * @param {object} player - Player state object
   * @returns {object} Result { success, messages, inventory, effects }
   */
  function useItem(inventory, index, player) {
    if (index < 0 || index >= inventory.length) {
      return {
        success: false,
        messages: ['Invalid inventory slot.'],
        inventory,
        effects: null
      };
    }

    const invItem = inventory[index];
    const itemDef = getItemDefinition(invItem.itemId);

    if (!itemDef) {
      return {
        success: false,
        messages: ['Item definition not found.'],
        inventory,
        effects: null
      };
    }

    // Check if item is usable
    if (itemDef.type !== ITEM_TYPES.POTION) {
      return {
        success: false,
        messages: [`${itemDef.name} cannot be used.`],
        inventory,
        effects: null
      };
    }

    // Apply item effect
    const effects = {};
    if (itemDef.useEffect) {
      if (itemDef.useEffect.type === 'heal') {
        const healed = Math.min(itemDef.useEffect.amount, player.maxHealth - player.health);
        player.health += healed;
        effects.healthRestored = healed;
      } else if (itemDef.useEffect.type === 'mana') {
        const restored = Math.min(itemDef.useEffect.amount, player.maxMana - player.mana);
        player.mana += restored;
        effects.manaRestored = restored;
      }
    }

    // Consume one from stack
    invItem.quantity -= 1;
    if (invItem.quantity <= 0) {
      inventory.splice(index, 1);
    }

    return {
      success: true,
      messages: [`You used ${itemDef.name}.`],
      inventory,
      effects
    };
  }

  /**
   * Get enriched inventory (instances with definitions)
   * @param {array} inventory - Player inventory array
   * @returns {array} Enriched inventory items
   */
  function getEnrichedInventory(inventory) {
    return inventory.map(invItem => {
      const itemDef = getItemDefinition(invItem.itemId);
      return {
        ...invItem,
        definition: itemDef
      };
    });
  }

  return {
    addItem,
    removeItem,
    useItem,
    getEnrichedInventory
  };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = InventorySystem;
}

// Expose globally
if (typeof window !== 'undefined') {
  window.InventorySystem = InventorySystem;
}
