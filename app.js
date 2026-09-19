/**
 * TextScape Main Application
 * 
 * Initializes the game and wires together all systems.
 */

(function() {
  'use strict';

  // =================================================================
  // VALIDATION & INITIALIZATION
  // =================================================================

  console.log('[App] Initializing TextScape...');

  // Validate world graph integrity
  const worldValidation = validateWorldGraph();
  if (!worldValidation.valid) {
    console.error('[App] World graph has errors!', worldValidation.errors);
  }

  // Validate item assets
  validateItemAssets();

  // Load saved character data
  const savedData = TextScapeDB.loadCharacter();
  console.log('[App] Loaded character:', savedData.name);

  // Initialize game state
  GameState.initialize(savedData);

  // Setup save callback
  GameState.onSave((data) => {
    TextScapeDB.saveCharacter(data);
  });

  // =================================================================
  // UI REFERENCES
  // =================================================================

  const refs = {
    // Left panel
    worldNav: document.getElementById('world-nav'),
    adventureNav: document.getElementById('adventure-nav'),
    questPanel: document.getElementById('quest-panel'),
    questList: document.getElementById('quest-list'),
    dungeonPanel: document.getElementById('dungeon-panel'),
    dungeonList: document.getElementById('dungeon-list'),

    // Center panel
    sceneContainer: document.getElementById('scene-container'),

    // Right panel
    tabButtons: document.querySelectorAll('.tab-button'),
    tabContents: document.querySelectorAll('.tab-content'),
    characterName: document.getElementById('character-name'),
    characterClass: document.getElementById('character-class'),
    vitalBars: document.getElementById('vital-bars'),
    statList: document.getElementById('stat-list'),
    goldDisplay: document.getElementById('gold-display'),
    equipmentGrid: document.getElementById('equipment-grid'),
    inventoryGrid: document.getElementById('inventory-grid'),
    inventoryEmpty: document.getElementById('inventory-empty'),

    // Chat
    chatLog: document.getElementById('chat-log'),
    chatForm: document.getElementById('chat-form'),
    chatInput: document.getElementById('chat-input'),

    // Context menu
    inventoryMenu: document.getElementById('inventory-menu'),
    inventoryMenuTitle: document.getElementById('inventory-menu-title')
  };

  // =================================================================
  // MESSAGE SYSTEM
  // =================================================================

  function addMessage(text, type = 'system') {
    const message = document.createElement('div');
    message.className = `message ${type}`;
    message.textContent = text;
    refs.chatLog.appendChild(message);
    refs.chatLog.scrollTop = refs.chatLog.scrollHeight;
  }

  GameState.onMessage((text, type) => {
    addMessage(text, type);
  });

  // =================================================================
  // LEFT PANEL: NAVIGATION
  // =================================================================

  let currentLeftView = null;

  function setupLeftNav() {
    // World nav
    refs.worldNav.addEventListener('click', (e) => {
      if (e.target.dataset.action === 'explore') {
        currentLeftView = null;
        refs.questPanel.style.display = 'none';
        refs.dungeonPanel.style.display = 'none';
        renderScene();
      }
    });

    // Adventure nav
    refs.adventureNav.addEventListener('click', (e) => {
      const nav = e.target.dataset.nav;
      if (nav === 'quests') {
        currentLeftView = 'quests';
        refs.questPanel.style.display = 'block';
        refs.dungeonPanel.style.display = 'none';
        renderQuests();
      } else if (nav === 'dungeons') {
        currentLeftView = 'dungeons';
        refs.questPanel.style.display = 'none';
        refs.dungeonPanel.style.display = 'block';
        renderDungeons();
      }
    });
  }

  function renderQuests() {
    const state = GameState.getState();
    refs.questList.innerHTML = '';

    if (state.quests.length === 0) {
      refs.questList.innerHTML = '<p class="placeholder-text" style="padding: 20px 10px; font-size: 0.8rem;">No active quests.</p>';
      return;
    }

    state.quests.forEach((quest) => {
      const item = document.createElement('div');
      item.className = 'quest-item';
      item.innerHTML = `
        <strong>${quest.title}</strong>
        <small>${quest.status.toUpperCase()} · ${quest.reward}</small>
      `;
      refs.questList.appendChild(item);
    });
  }

  function renderDungeons() {
    refs.dungeonList.innerHTML = '';

    const dungeonLocations = Object.values(LOCATIONS).filter(loc => loc.type === LOCATION_TYPES.DUNGEON);

    dungeonLocations.forEach((dungeon) => {
      const item = document.createElement('div');
      item.className = 'dungeon-item';
      item.innerHTML = `
        <strong>${dungeon.name}</strong>
        <small>${dungeon.region || 'Unknown Region'} · Danger ${dungeon.dangerLevel}</small>
      `;
      item.onclick = () => {
        const result = CommandParser.parse(`dungeon ${dungeon.id}`);
        GameState.emitMessages(result.messages);
        if (result.success) {
          renderScene();
          renderCharacter();
        }
      };
      refs.dungeonList.appendChild(item);
    });
  }

  // =================================================================
  // CENTER PANEL: SCENE RENDERING
  // =================================================================

  function renderScene() {
    const state = GameState.getState();

    // Check if in combat
    if (state.combat && state.combat.active) {
      SceneRenderer.renderCombat(state.combat);
    } else {
      // Exploration mode
      SceneRenderer.renderExploration(state.player.currentLocation);
    }
  }

  // Setup scene renderer
  SceneRenderer.setContainer(refs.sceneContainer);

  SceneRenderer.onTravel((direction) => {
    const result = CommandParser.parse(`travel ${direction}`);
    GameState.emitMessages(result.messages);
    if (result.success) {
      renderScene();
    }
  });

  SceneRenderer.onEnterDungeon((locationId) => {
    const result = CommandParser.parse(`dungeon ${locationId}`);
    GameState.emitMessages(result.messages);
    if (result.success) {
      renderScene();
      renderCharacter();
    }
  });

  SceneRenderer.onCombatAttack(() => {
    const result = CommandParser.parse('attack');
    GameState.emitMessages(result.messages);
    renderScene();
    renderCharacter();
    renderInventory();
  });

  SceneRenderer.onCombatFlee(() => {
    const result = CommandParser.parse('flee');
    GameState.emitMessages(result.messages);
    renderScene();
  });

  // =================================================================
  // RIGHT PANEL: CHARACTER & INVENTORY
  // =================================================================

  function setupTabs() {
    refs.tabButtons.forEach(button => {
      button.addEventListener('click', () => {
        if (button.classList.contains('disabled')) return;

        const targetTab = button.dataset.tab;

        // Update buttons
        refs.tabButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');

        // Update content
        refs.tabContents.forEach(content => {
          content.classList.remove('active');
          if (content.id === `tab-${targetTab}`) {
            content.classList.add('active');
          }
        });
      });
    });
  }

  function renderCharacter() {
    const state = GameState.getState();
    const player = state.player;

    // Character info
    refs.characterName.textContent = player.name;
    refs.characterClass.textContent = `Level ${player.level} ${player.className}`;

    // Vital signs
    refs.vitalBars.innerHTML = '';
    refs.vitalBars.appendChild(UIComponents.createStatBar('Health', player.health, player.maxHealth, 'health'));
    refs.vitalBars.appendChild(UIComponents.createStatBar('Mana', player.mana, player.maxMana, 'mana'));
    refs.vitalBars.appendChild(UIComponents.createStatBar('Stamina', player.stamina, player.maxStamina, 'stamina'));

    // Gold
    refs.goldDisplay.textContent = `${player.gold}g`;

    // Stats
    refs.statList.innerHTML = '';
    Object.entries(player.stats).forEach(([key, value]) => {
      const li = document.createElement('li');
      li.innerHTML = `<span>${key}</span><strong>${value}</strong>`;
      refs.statList.appendChild(li);
    });

    // Equipment (basic display)
    renderEquipment();
  }

  function renderEquipment() {
    const state = GameState.getState();
    const equipment = state.player.equipment;

    refs.equipmentGrid.innerHTML = '';

    const slots = ['mainHand', 'offHand', 'head', 'chest', 'legs', 'feet', 'trinket', 'ring1'];

    slots.forEach(slotName => {
      const slot = document.createElement('div');
      slot.className = 'equipment-slot';
      
      const itemId = equipment[slotName];
      if (itemId) {
        slot.classList.add('equipped');
        const itemDef = getItemDefinition(itemId);
        if (itemDef) {
          const icon = document.createElement('img');
          icon.src = getAsset('items', itemDef.icon);
          icon.alt = itemDef.name;
          icon.style.width = '24px';
          icon.style.height = '24px';
          slot.appendChild(icon);
        }
      } else {
        slot.textContent = slotName.replace(/([A-Z])/g, ' $1').trim();
      }

      refs.equipmentGrid.appendChild(slot);
    });
  }

  function renderInventory() {
    const state = GameState.getState();
    const inventory = state.inventory;

    refs.inventoryGrid.innerHTML = '';
    refs.inventoryEmpty.style.display = inventory.length === 0 ? 'block' : 'none';

    inventory.forEach((invItem, index) => {
      const slot = UIComponents.createInventorySlot(invItem, index);
      
      // Context menu on click
      slot.onclick = (e) => {
        openInventoryMenu(index, e);
      };

      // Prevent default right-click
      slot.oncontextmenu = (e) => {
        e.preventDefault();
        openInventoryMenu(index, e);
      };

      // Drag and drop
      slot.draggable = true;
      slot.ondragstart = () => {
        slot.dataset.dragSource = index;
      };
      slot.ondragover = (e) => {
        e.preventDefault();
      };
      slot.ondrop = (e) => {
        e.preventDefault();
        const sourceIndex = parseInt(slot.dataset.dragSource);
        if (sourceIndex !== undefined && sourceIndex !== index) {
          // Swap items
          const temp = inventory[sourceIndex];
          inventory[sourceIndex] = inventory[index];
          inventory[index] = temp;
          GameState.setInventory(inventory);
          GameState.save();
          renderInventory();
        }
        delete slot.dataset.dragSource;
      };

      refs.inventoryGrid.appendChild(slot);
    });
  }

  // =================================================================
  // INVENTORY CONTEXT MENU
  // =================================================================

  let selectedInventoryIndex = null;

  function openInventoryMenu(index, event) {
    // PRIORITY 5: Close any open tooltips first
    const tooltips = document.querySelectorAll('.tooltip');
    tooltips.forEach(t => t.remove());
    
    selectedInventoryIndex = index;
    const state = GameState.getState();
    const invItem = state.inventory[index];
    const itemDef = getItemDefinition(invItem.itemId);

    if (!itemDef) return;

    refs.inventoryMenuTitle.textContent = itemDef.name;
    refs.inventoryMenu.style.display = 'flex';
    
    // PRIORITY 5: Position menu relative to pointer, constrain to viewport
    let x = event.clientX + 10;
    let y = event.clientY + 10;
    
    // Ensure menu renders first to get dimensions
    setTimeout(() => {
      const rect = refs.inventoryMenu.getBoundingClientRect();
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      
      // Adjust if menu would overflow right edge
      if (x + rect.width > viewportWidth) {
        x = event.clientX - rect.width - 10;
      }
      
      // Adjust if menu would overflow bottom edge
      if (y + rect.height > viewportHeight) {
        y = event.clientY - rect.height - 10;
      }
      
      refs.inventoryMenu.style.left = `${x}px`;
      refs.inventoryMenu.style.top = `${y}px`;
    }, 0);
  }

  function closeInventoryMenu() {
    selectedInventoryIndex = null;
    refs.inventoryMenu.style.display = 'none';
  }

  refs.inventoryMenu.addEventListener('click', (e) => {
    const action = e.target.dataset.inventoryAction;
    if (!action || selectedInventoryIndex === null) return;

    const state = GameState.getStateRef();

    if (action === 'use') {
      const result = InventorySystem.useItem(state.inventory, selectedInventoryIndex, state.player);
      if (result.success) {
        GameState.setInventory(result.inventory);
        GameState.save();
        renderInventory();
        renderCharacter();
        GameState.emitMessages(result.messages);
      } else {
        GameState.emitMessages(result.messages);
      }
    } else if (action === 'sell') {
      const invItem = state.inventory[selectedInventoryIndex];
      const itemDef = getItemDefinition(invItem.itemId);
      if (itemDef && confirm(`Sell ${itemDef.name} for ${itemDef.value * invItem.quantity}g?`)) {
        state.player.gold += itemDef.value * invItem.quantity;
        state.inventory.splice(selectedInventoryIndex, 1);
        GameState.save();
        renderInventory();
        renderCharacter();
        addMessage(`You sold ${itemDef.name} for ${itemDef.value * invItem.quantity}g.`);
      }
    } else if (action === 'delete') {
      const invItem = state.inventory[selectedInventoryIndex];
      const itemDef = getItemDefinition(invItem.itemId);
      if (itemDef && confirm(`Delete ${itemDef.name}?`)) {
        state.inventory.splice(selectedInventoryIndex, 1);
        GameState.save();
        renderInventory();
        addMessage(`Deleted ${itemDef.name}.`);
      }
    }

    closeInventoryMenu();
  });

  // Close menu on outside click
  window.addEventListener('click', (e) => {
    if (!e.target.closest('.inventory-slot') && !e.target.closest('.inventory-menu')) {
      closeInventoryMenu();
    }
  });

  // PRIORITY 5: Close menu with ESC key
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeInventoryMenu();
    }
  });

  // =================================================================
  // CHAT & COMMANDS
  // =================================================================

  refs.chatForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const input = refs.chatInput.value.trim();
    if (!input) return;

    // Display user input
    addMessage(input, 'player');

    // Parse and execute command
    const result = CommandParser.parse(input);
    
    // Display result messages
    GameState.emitMessages(result.messages);

    // Update UI if state changed
    renderScene();
    renderCharacter();
    renderInventory();

    // Clear input
    refs.chatInput.value = '';
  });

  // =================================================================
  // INITIAL RENDER
  // =================================================================

  setupLeftNav();
  setupTabs();
  renderScene();
  renderCharacter();
  renderInventory();

  addMessage('Welcome to TextScape. Type "help" for commands or click to explore.');

  console.log('[App] TextScape initialized successfully.');
})();
