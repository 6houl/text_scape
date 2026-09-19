const TextScapeDB = (() => {
  const STORAGE_KEY = "textscape_local_character_v2";
  const CURRENT_SCHEMA_VERSION = 2;

  function createDefaultCharacter() {
    return {
      schemaVersion: CURRENT_SCHEMA_VERSION,
      id: "hero-aster",
      name: "Aster",
      className: "Ranger",
      level: 18,
      xp: 0,
      gold: 220,
      health: 780,
      maxHealth: 1000,
      mana: 310,
      maxMana: 500,
      stamina: 440,
      maxStamina: 500,
      currentLocation: "moonwatch_town",
      equipment: {
        head: null,
        neck: null,
        chest: null,
        hands: null,
        legs: null,
        feet: null,
        mainHand: null,
        offHand: null,
        ring1: null,
        ring2: null,
        trinket: null
      },
      inventory: [
        { itemId: "iron_sword", quantity: 1 },
        { itemId: "moonstone_charm", quantity: 1 },
        { itemId: "healing_potion", quantity: 3 },
        { itemId: "map_fragment", quantity: 1 },
        { itemId: "sunken_key", quantity: 1 }
      ],
      stats: {
        STR: 36,
        AGI: 46,
        INT: 52,
        VIT: 41,
        Luck: 18,
      },
      quests: [
        {
          id: "moonbloom_herbs",
          title: "Gather Moonbloom",
          description: "Collect herbs in the Ancient Forest for the apothecary.",
          status: "active",
          reward: "Herbalist's Charm",
          targetLocationId: "ruined_shrine"
        },
        {
          id: "relic_recovery",
          title: "Recover the Sunken Relic",
          description: "Enter the Gloom Den and defeat the Wraithfang.",
          status: "available",
          reward: "Relic of Dawn",
          targetLocationId: "gloom_den"
        },
      ],
      combat: null,
      combatStats: {
        wins: 0,
        losses: 0,
      },
    };
  }

  /**
   * Migrate old save format to current schema
   */
  function migrateCharacter(saved) {
    const version = saved.schemaVersion || 1;

    // Migrate from v1 to v2
    if (version === 1) {
      console.log('[DB] Migrating save from v1 to v2');

      // Map old location names to new IDs
      const locationMap = {
        "Moonwatch Town": "moonwatch_town",
        "Ancient Forest": "blackwood_edge",
        "Sunken Cavern": "trade_road",
        "Ember Ridge": "ember_ridge",
        "Crystal Pass": "crystal_pass",
        "Gloom Den": "gloom_den",
        "Echo Vault": "gloom_den",
        "Frost Maw": "gloom_den",
        "Scarlet Keep": "gloom_den"
      };

      saved.currentLocation = locationMap[saved.location] || "moonwatch_town";
      delete saved.location;
      delete saved.currentDungeon;

      // Migrate inventory from old string format to new reference format
      if (Array.isArray(saved.inventory)) {
        saved.inventory = saved.inventory.map(item => {
          if (typeof item === 'string') {
            // Parse legacy string format
            const potionMatch = item.match(/Healing Potion x(\d+)/i);
            if (potionMatch) {
              return { itemId: 'healing_potion', quantity: parseInt(potionMatch[1]) };
            }

            const itemMap = {
              "Iron Sword": "iron_sword",
              "Moonstone Charm": "moonstone_charm",
              "Healing Potion": "healing_potion",
              "Map Fragment": "map_fragment",
              "Sunken Key": "sunken_key",
              "Relic of Dawn": "relic_of_dawn"
            };

            const itemId = itemMap[item] || "iron_sword";
            return { itemId, quantity: 1 };
          } else if (item.id) {
            // Legacy object format with id instead of itemId
            return { itemId: item.id, quantity: item.quantity || 1 };
          } else if (item.itemId) {
            // Already in correct format
            return item;
          }
          return { itemId: "iron_sword", quantity: 1 };
        });
      }

      // Add equipment slots if missing
      if (!saved.equipment) {
        saved.equipment = {
          head: null, neck: null, chest: null, hands: null, legs: null, feet: null,
          mainHand: null, offHand: null, ring1: null, ring2: null, trinket: null
        };
      }

      // Initialize combat state
      if (!saved.combat) {
        saved.combat = null;
      }

      saved.schemaVersion = 2;
    }

    return saved;
  }

  function loadCharacter() {
    try {
      // Try loading from v2 key first
      let raw = localStorage.getItem(STORAGE_KEY);
      
      // Fall back to v1 key for migration
      if (!raw) {
        raw = localStorage.getItem("textscape_local_character_v1");
        if (raw) {
          console.log('[DB] Found v1 save, will migrate');
        }
      }
      
      if (!raw) return createDefaultCharacter();

      let parsed = JSON.parse(raw);
      
      // Migrate if needed
      if (!parsed.schemaVersion || parsed.schemaVersion < CURRENT_SCHEMA_VERSION) {
        parsed = migrateCharacter(parsed);
        // Save migrated version immediately
        saveCharacter(parsed);
      }

      const base = createDefaultCharacter();
      return {
        ...base,
        ...parsed,
        stats: { ...base.stats, ...(parsed.stats || {}) },
        equipment: { ...base.equipment, ...(parsed.equipment || {}) },
        inventory: Array.isArray(parsed.inventory) ? parsed.inventory : base.inventory,
        quests: Array.isArray(parsed.quests) ? parsed.quests : base.quests,
        combat: parsed.combat || null,
        combatStats: { ...base.combatStats, ...(parsed.combatStats || {}) },
      };
    } catch (error) {
      console.warn("[DB] Failed to load saved character, using default state.", error);
      return createDefaultCharacter();
    }
  }

  function saveCharacter(character) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(character));
    return character;
  }

  function resetCharacter() {
    const fresh = createDefaultCharacter();
    saveCharacter(fresh);
    return fresh;
  }

  return {
    createDefaultCharacter,
    loadCharacter,
    saveCharacter,
    resetCharacter,
  };
})();

if (typeof window !== "undefined") {
  window.TextScapeDB = TextScapeDB;
}
