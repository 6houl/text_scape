/**
 * TextScape Scene Renderer
 * 
 * Renders different scene types in the center gameplay area.
 */

const SceneRenderer = (() => {
  let containerElement = null;

  function setContainer(element) {
    containerElement = element;
  }

  /**
   * Render exploration scene
   */
  function renderExploration(locationId) {
    if (!containerElement) return;

    const location = getLocation(locationId);
    if (!location) {
      containerElement.innerHTML = '<p class="error">Location not found.</p>';
      return;
    }

    const scene = document.createElement('div');
    scene.className = 'exploration-scene';

    // Header with breadcrumb
    const header = document.createElement('div');
    header.className = 'scene-header';
    
    const breadcrumb = document.createElement('div');
    breadcrumb.className = 'breadcrumb';
    breadcrumb.textContent = getLocationBreadcrumb(locationId);
    
    const locationName = document.createElement('h2');
    locationName.className = 'location-name';
    locationName.textContent = location.name;
    
    header.appendChild(breadcrumb);
    header.appendChild(locationName);

    // Description
    const description = document.createElement('p');
    description.className = 'location-description';
    description.textContent = location.description;

    scene.appendChild(header);
    scene.appendChild(description);

    // NPCs
    if (location.npcs && location.npcs.length > 0) {
      const npcsSection = createSection('Nearby', location.npcs.map(npc =>
        UIComponents.createInteractableItem(formatNpcName(npc), 'npc')
      ));
      scene.appendChild(npcsSection);
    }

    // Interactables
    if (location.interactables && location.interactables.length > 0) {
      const interactablesSection = createSection('Points of Interest', location.interactables.map(item =>
        UIComponents.createInteractableItem(formatInteractableName(item), 'interactable')
      ));
      scene.appendChild(interactablesSection);
    }

    // Exits
    if (location.exits && Object.keys(location.exits).length > 0) {
      const exitsSection = document.createElement('div');
      exitsSection.className = 'scene-section exits-section';
      
      const title = document.createElement('h3');
      title.textContent = 'Exits';
      exitsSection.appendChild(title);

      const exitsList = document.createElement('div');
      exitsList.className = 'exits-list';

      Object.entries(location.exits).forEach(([direction, destId]) => {
        const dest = getLocation(destId);
        if (dest) {
          const button = UIComponents.createExitButton(direction, dest.name, () => {
            handleTravel(direction);
          });
          exitsList.appendChild(button);
        }
      });

      exitsSection.appendChild(exitsList);
      scene.appendChild(exitsSection);
    }

    // Dungeon entrance action
    if (location.type === LOCATION_TYPES.DUNGEON) {
      const actions = document.createElement('div');
      actions.className = 'scene-actions';
      
      const enterButton = UIComponents.createActionButton('Enter Dungeon', () => {
        handleEnterDungeon(locationId);
      });
      
      actions.appendChild(enterButton);
      scene.appendChild(actions);
    }

    containerElement.innerHTML = '';
    containerElement.appendChild(scene);
  }

  /**
   * Render combat scene
   */
  function renderCombat(combatState) {
    if (!containerElement || !combatState) return;

    const scene = document.createElement('div');
    scene.className = 'combat-scene';

    // Combat header
    const header = document.createElement('div');
    header.className = 'combat-header';
    
    const title = document.createElement('h2');
    title.textContent = `Battle: ${combatState.enemy.name}`;
    title.className = 'combat-title';
    
    header.appendChild(title);

    // Enemy info
    const enemyInfo = document.createElement('div');
    enemyInfo.className = 'enemy-info';
    
    const enemyName = document.createElement('div');
    enemyName.className = 'enemy-name';
    enemyName.textContent = combatState.enemy.name;
    
    const enemyHealthBar = UIComponents.createStatBar(
      'Enemy Health',
      combatState.enemy.health,
      combatState.enemy.maxHealth,
      'health'
    );
    
    enemyInfo.appendChild(enemyName);
    enemyInfo.appendChild(enemyHealthBar);

    // Combat actions
    const actions = document.createElement('div');
    actions.className = 'combat-actions';
    
    const attackButton = UIComponents.createActionButton('Attack', handleCombatAttack);
    const fleeButton = UIComponents.createActionButton('Flee', handleCombatFlee);
    
    actions.appendChild(attackButton);
    actions.appendChild(fleeButton);

    scene.appendChild(header);
    scene.appendChild(enemyInfo);
    scene.appendChild(actions);

    containerElement.innerHTML = '';
    containerElement.appendChild(scene);
  }

  /**
   * Create a generic scene section
   */
  function createSection(title, items) {
    const section = document.createElement('div');
    section.className = 'scene-section';
    
    const titleEl = document.createElement('h3');
    titleEl.textContent = title;
    section.appendChild(titleEl);

    const list = document.createElement('div');
    list.className = 'section-list';
    items.forEach(item => list.appendChild(item));
    
    section.appendChild(list);
    return section;
  }

  // Helper formatters
  function formatNpcName(npcId) {
    return npcId.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  function formatInteractableName(interactableId) {
    return interactableId.split('_').map(word => 
      word.charAt(0).toUpperCase() + word.slice(1)
    ).join(' ');
  }

  // Event handlers (to be connected to game systems)
  let onTravelCallback = null;
  let onEnterDungeonCallback = null;
  let onCombatAttackCallback = null;
  let onCombatFleeCallback = null;

  function onTravel(callback) {
    onTravelCallback = callback;
  }

  function onEnterDungeon(callback) {
    onEnterDungeonCallback = callback;
  }

  function onCombatAttack(callback) {
    onCombatAttackCallback = callback;
  }

  function onCombatFlee(callback) {
    onCombatFleeCallback = callback;
  }

  function handleTravel(direction) {
    if (onTravelCallback) onTravelCallback(direction);
  }

  function handleEnterDungeon(locationId) {
    if (onEnterDungeonCallback) onEnterDungeonCallback(locationId);
  }

  function handleCombatAttack() {
    if (onCombatAttackCallback) onCombatAttackCallback();
  }

  function handleCombatFlee() {
    if (onCombatFleeCallback) onCombatFleeCallback();
  }

  return {
    setContainer,
    renderExploration,
    renderCombat,
    onTravel,
    onEnterDungeon,
    onCombatAttack,
    onCombatFlee
  };
})();

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SceneRenderer;
}

// Expose globally
if (typeof window !== 'undefined') {
  window.SceneRenderer = SceneRenderer;
}
