/**
 * TextScape UI Components
 * 
 * Reusable UI component builders.
 */

const UIComponents = (() => {
  /**
   * Create a tooltip element with improved styling
   * PRIORITY 4 & 5: Better tooltips for inventory
   */
  function createTooltip(item) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    
    const title = document.createElement('div');
    title.className = 'tooltip-title';
    title.textContent = item.name;
    
    const rarity = document.createElement('div');
    rarity.className = `tooltip-rarity ${item.rarity}`;
    rarity.textContent = item.rarity;
    
    const desc = document.createElement('div');
    desc.className = 'tooltip-description';
    desc.textContent = item.description;
    
    const stats = document.createElement('div');
    stats.className = 'tooltip-stats';
    stats.innerHTML = `Value: <span class="tooltip-value">${item.value}g</span>`;
    
    tooltip.appendChild(title);
    tooltip.appendChild(rarity);
    tooltip.appendChild(desc);
    tooltip.appendChild(stats);
    
    document.body.appendChild(tooltip);
    return tooltip;
  }

  function showTooltip(tooltip, event) {
    tooltip.style.display = 'block';
    positionTooltip(tooltip, event);
  }

  function hideTooltip(tooltip) {
    tooltip.style.display = 'none';
  }

  function positionTooltip(tooltip, event) {
    const x = event.clientX + 14;
    const y = event.clientY + 14;
    
    // Keep tooltip within viewport
    const rect = tooltip.getBoundingClientRect();
    const viewportWidth = window.innerWidth;
    const viewportHeight = window.innerHeight;
    
    let finalX = x;
    let finalY = y;
    
    if (x + rect.width > viewportWidth) {
      finalX = event.clientX - rect.width - 14;
    }
    
    if (y + rect.height > viewportHeight) {
      finalY = event.clientY - rect.height - 14;
    }
    
    tooltip.style.left = `${finalX}px`;
    tooltip.style.top = `${finalY}px`;
  }

  /**
   * Create an inventory slot element
   * PRIORITY 4: Icon-first design, no names in slots
   */
  function createInventorySlot(invItem, index) {
    const slot = document.createElement('button');
    slot.type = 'button';
    slot.className = 'inventory-slot';
    slot.draggable = true;
    slot.dataset.index = index;

    if (invItem) {
      const itemDef = getItemDefinition(invItem.itemId);
      if (itemDef) {
        slot.dataset.rarity = itemDef.rarity;

        const iconPath = getAsset('items', itemDef.icon);
        const icon = document.createElement('img');
        icon.src = iconPath;
        icon.alt = itemDef.name;
        icon.className = 'item-icon';
        slot.appendChild(icon);

        // Show quantity if > 1
        if (invItem.quantity > 1) {
          const qty = document.createElement('span');
          qty.className = 'item-quantity';
          qty.textContent = invItem.quantity;
          slot.appendChild(qty);
        }
        
        // Create tooltip on hover
        let tooltip = null;
        slot.addEventListener('mouseenter', (e) => {
          tooltip = createTooltip(itemDef);
          showTooltip(tooltip, e);
        });
        
        slot.addEventListener('mousemove', (e) => {
          if (tooltip) positionTooltip(tooltip, e);
        });
        
        slot.addEventListener('mouseleave', () => {
          if (tooltip) {
            hideTooltip(tooltip);
            tooltip.remove();
            tooltip = null;
          }
        });
      }
    } else {
      slot.classList.add('empty');
    }

    return slot;
  }

  /**
   * Create an action button
   */
  function createActionButton(text, callback) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'action-button';
    button.textContent = text;
    button.onclick = callback;
    return button;
  }

  /**
   * Create a stat bar
   */
  function createStatBar(label, current, max, type = 'health') {
    const container = document.createElement('div');
    container.className = 'bar-group';

    const labelEl = document.createElement('span');
    labelEl.textContent = label;

    const bar = document.createElement('div');
    bar.className = 'bar';

    const fill = document.createElement('div');
    fill.className = `fill ${type}`;
    fill.style.width = `${(current / max) * 100}%`;

    const text = document.createElement('small');
    text.textContent = `${current} / ${max}`;

    bar.appendChild(fill);
    container.appendChild(labelEl);
    container.appendChild(bar);
    container.appendChild(text);

    return container;
  }

  /**
   * Create an exit button for travel
   */
  function createExitButton(direction, destinationName, callback) {
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'exit-button';
    
    const dirSymbol = {
      north: '↑',
      south: '↓',
      east: '→',
      west: '←',
      up: '⤴',
      down: '⤵'
    }[direction] || '→';

    button.innerHTML = `<span class="dir">${dirSymbol} ${direction.toUpperCase()}</span><span class="dest">${destinationName}</span>`;
    button.onclick = callback;
    
    return button;
  }

  /**
   * Create NPC/interactable list item
   * PRIORITY 7: Use actual icon assets for NPCs
   */
  function createInteractableItem(name, type = 'npc', iconKey = null) {
    const item = document.createElement('div');
    item.className = `interactable-item ${type}`;
    
    const iconEl = document.createElement('span');
    iconEl.className = 'icon';
    
    // PRIORITY 7: Map NPCs to appropriate icons
    if (type === 'npc' && iconKey) {
      // Use actual icon asset if provided
      const img = document.createElement('img');
      img.className = 'icon';
      img.src = getAsset('icons', iconKey);
      img.alt = name;
      item.appendChild(img);
    } else if (type === 'npc') {
      // Generic NPC icon
      iconEl.textContent = '👤';
      item.appendChild(iconEl);
    } else {
      // Point of interest
      iconEl.textContent = '⚙';
      item.appendChild(iconEl);
    }
    
    const text = document.createElement('span');
    text.textContent = name;
    
    item.appendChild(text);
    
    return item;
  }

  return {
    createTooltip,
    showTooltip,
    hideTooltip,
    positionTooltip,
    createInventorySlot,
    createActionButton,
    createStatBar,
    createExitButton,
    createInteractableItem
  };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = UIComponents;
}

// Expose globally
if (typeof window !== 'undefined') {
  window.UIComponents = UIComponents;
}
