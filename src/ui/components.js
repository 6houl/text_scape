/**
 * TextScape UI Components
 * 
 * Reusable UI component builders.
 */

const UIComponents = (() => {
  /**
   * Create a tooltip element
   */
  function createTooltip(text, targetElement) {
    const tooltip = document.createElement('div');
    tooltip.className = 'tooltip';
    tooltip.textContent = text;
    tooltip.style.cssText = `
      position: fixed;
      display: none;
      background: rgba(10, 16, 22, 0.95);
      border: 1px solid #f0c46e;
      padding: 8px 12px;
      border-radius: 6px;
      font-size: 0.8rem;
      color: #e7eff8;
      pointer-events: none;
      z-index: 1000;
      max-width: 250px;
      line-height: 1.4;
    `;

    document.body.appendChild(tooltip);

    targetElement.addEventListener('mouseenter', (e) => {
      tooltip.style.display = 'block';
      positionTooltip(tooltip, e);
    });

    targetElement.addEventListener('mousemove', (e) => {
      positionTooltip(tooltip, e);
    });

    targetElement.addEventListener('mouseleave', () => {
      tooltip.style.display = 'none';
    });

    return tooltip;
  }

  function positionTooltip(tooltip, event) {
    const x = event.clientX + 12;
    const y = event.clientY + 12;
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;
  }

  /**
   * Create an inventory slot element
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
        slot.title = `${itemDef.name}: ${itemDef.description}\nValue: ${itemDef.value}g`;

        const iconPath = getAsset('items', itemDef.icon);
        const icon = document.createElement('img');
        icon.src = iconPath;
        icon.alt = itemDef.name;
        icon.className = 'item-icon';

        const name = document.createElement('span');
        name.className = 'item-name';
        name.textContent = invItem.quantity > 1 ? `${itemDef.name} x${invItem.quantity}` : itemDef.name;

        slot.appendChild(icon);
        slot.appendChild(name);
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
   */
  function createInteractableItem(name, type = 'npc') {
    const item = document.createElement('div');
    item.className = `interactable-item ${type}`;
    
    const icon = document.createElement('span');
    icon.className = 'icon';
    icon.textContent = type === 'npc' ? '👤' : '⚙';
    
    const text = document.createElement('span');
    text.textContent = name;
    
    item.appendChild(icon);
    item.appendChild(text);
    
    return item;
  }

  return {
    createTooltip,
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
