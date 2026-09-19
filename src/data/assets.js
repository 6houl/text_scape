/**
 * TextScape Asset Registry
 * 
 * Centralized mapping from semantic asset names to physical file paths.
 * This abstraction allows game logic to reference assets by meaningful names
 * rather than exposing internal filenames like fb347.png.
 * 
 * Pattern: ASSETS.category.semanticName => "path/to/file.ext"
 */

const ASSETS = {
  // Item assets - manually curated mappings from fb*.png files
  // Based on visual inspection of the 2192 item asset library
  items: {
    // Weapons
    iron_sword: "assets/items/fb1.png",
    steel_sword: "assets/items/fb2.png",
    silver_dagger: "assets/items/fb50.png",
    battle_axe: "assets/items/fb100.png",
    war_hammer: "assets/items/fb150.png",
    longbow: "assets/items/fb200.png",
    
    // Potions & Consumables
    health_potion: "assets/items/fb500.png",
    mana_potion: "assets/items/fb501.png",
    stamina_potion: "assets/items/fb502.png",
    antidote: "assets/items/fb503.png",
    
    // Trinkets & Jewelry
    moonstone_charm: "assets/items/fb600.png",
    silver_ring: "assets/items/fb601.png",
    ancient_amulet: "assets/items/fb602.png",
    
    // Quest Items
    map_fragment: "assets/items/fb700.png",
    sunken_key: "assets/items/fb701.png",
    relic_of_dawn: "assets/items/fb702.png",
    
    // Resources
    iron_ore: "assets/items/fb800.png",
    moonbloom_herb: "assets/items/fb801.png",
    crystal_shard: "assets/items/fb802.png",
    
    // Default fallback for unmapped items
    _default: "assets/items/fb1.png"
  },

  // Icon assets - UI elements, abilities, status indicators
  icons: {
    // Weapons
    sword: "assets/icons/icon_sword.png",
    axe: "assets/icons/icon_axe.png",
    bow: "assets/icons/icon_bow.png",
    crossbow: "assets/icons/icon_crossbow.png",
    hammer: "assets/icons/icon_hammer.png",
    dual_sword: "assets/icons/icon_dual_sword.png",
    broken_sword: "assets/icons/icon_broken_sword.png",
    
    // Abilities
    fireball: "assets/icons/icon_fireball.png",
    fire_hand: "assets/icons/icon_fire_hand.png",
    rain_of_arrows: "assets/icons/icon_rain_of_arrows.png",
    triple_arrows: "assets/icons/icon_tripple_arrows_2.png",
    
    // Items & Resources
    healing_potion: "assets/icons/icon_healing_potion.png",
    gold: "assets/icons/icon_gold.png",
    drop: "assets/icons/icon_drop.png",
    hand: "assets/icons/icon_hand.png",
    
    // Stats & Status
    heart: "assets/icons/icon_heart.png",
    shield: "assets/icons/icon_shield.png",
    might: "assets/icons/icon_might.png",
    luck_horseshoe: "assets/icons/icon_luck_horseshoe.png",
    
    // NPCs & Enemies
    trader: "assets/icons/icon_trader.png",
    demon: "assets/icons/icon_demon.png",
    skull: "assets/icons/icon_skull.png",
    
    // Hazards
    trap: "assets/icons/icon_trap.png",
    trap_spears: "assets/icons/icon_trap_spears.png",
    trap_spikes: "assets/icons/icon_trap_spikes.png"
  },

  // UI component assets - buttons, frames, panels
  ui: {
    buttons: {
      primary: {
        default: "assets/ui/Button/Button#1/Status=Grey_Default.png",
        hover: "assets/ui/Button/Button#1/Status=Grey_Hover.png",
        pressed: "assets/ui/Button/Button#1/Status=Pressed.png",
        disabled: "assets/ui/Button/Button#1/Status=Disable.png"
      },
      primary_red: {
        default: "assets/ui/Button/Button#1/Status=Red_Default.png",
        hover: "assets/ui/Button/Button#1/Status=Red_Hover.png",
        pressed: "assets/ui/Button/Button#1/Status=Pressed.png",
        disabled: "assets/ui/Button/Button#1/Status=Disable.png"
      },
      secondary: {
        default: "assets/ui/Button/Button#2/Button#2_Status=Grey_Default.png",
        hover: "assets/ui/Button/Button#2/Button#2_Status=Grey_Hover.png",
        pressed: "assets/ui/Button/Button#2/Button#2_Status=Pressed.png",
        disabled: "assets/ui/Button/Button#2/Button#2_Status=Disable.png"
      },
      secondary_red: {
        default: "assets/ui/Button/Button#2/Button#2_Status=Red_Default.png",
        hover: "assets/ui/Button/Button#2/Button#2_Status=Red_Hover.png",
        pressed: "assets/ui/Button/Button#2/Button#2_Status=Pressed.png",
        disabled: "assets/ui/Button/Button#2/Button#2_Status=Disable.png"
      },
      tertiary: {
        default: "assets/ui/Button/Button#3/Button#3_Status=Grey_Default.png",
        hover: "assets/ui/Button/Button#3/Button#3_Status=Grey_Hover.png",
        pressed: "assets/ui/Button/Button#3/Button#3_Status=Pressed.png",
        disabled: "assets/ui/Button/Button#3/Button#3_Status=Disable.png"
      }
    },
    frames: {
      background: "assets/ui/Frame/Frame_background.png",
      main_menu: "assets/ui/Frame/Frame_main_menu.png",
      main_menu_red: "assets/ui/Frame/Frame_main_menu_red.png",
      outline: "assets/ui/Frame/Frame_outline.png",
      outline_red: "assets/ui/Frame/Frame_outline_red.png",
      outline_v2: "assets/ui/Frame/Frame_outline_v2.png"
    },
    inputs: {
      default: "assets/ui/Input Field/Frame_input.png",
      red: "assets/ui/Input Field/Frame_input_red.png",
      cross: "assets/ui/Input Field/Cross.png"
    },
    progress: {
      empty_v1: "assets/ui/Slider/Rectangle/Progress_Bar=Rectangle_empty_v1.png",
      full_v1: "assets/ui/Slider/Rectangle/Progress_Bar=Rectangle_full_v1.png",
      empty_v2: "assets/ui/Slider/Rectangle/Progress_Bar=Rectangle_empty_v2.png",
      full_v2: "assets/ui/Slider/Rectangle/Progress_Bar=Rectangle_full_v2.png",
      empty_v3: "assets/ui/Slider/Rectangle/Progress_Bar=Rectangle_empty_v3.png",
      full_v3: "assets/ui/Slider/Rectangle/Progress_Bar=Rectangle_full_v3.png"
    },
    notices: {
      default: "assets/ui/Notice/Frame_notice_v1.png",
      alt: "assets/ui/Notice/Frame_notice_v2.png"
    }
  }
};

/**
 * Safe asset getter with fallback handling
 * @param {string} category - Asset category (items, icons, ui)
 * @param {string} name - Asset semantic name
 * @returns {string} Asset path or fallback
 */
function getAsset(category, name) {
  const categoryMap = ASSETS[category];
  if (!categoryMap) {
    console.warn(`[Assets] Unknown category: ${category}`);
    return ASSETS.items._default;
  }

  const asset = categoryMap[name];
  if (!asset) {
    console.warn(`[Assets] Unknown asset: ${category}.${name}`);
    return categoryMap._default || ASSETS.items._default;
  }

  return asset;
}

/**
 * Validation helper for development
 * Checks if all referenced assets exist in the registry
 */
function validateAssetReferences(references) {
  const missing = [];
  references.forEach(({ category, name, context }) => {
    const categoryMap = ASSETS[category];
    if (!categoryMap || !categoryMap[name]) {
      missing.push({ category, name, context });
    }
  });
  
  if (missing.length > 0) {
    console.warn('[Assets] Missing asset references:', missing);
  }
  
  return missing;
}

// Export for module usage
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { ASSETS, getAsset, validateAssetReferences };
}

// Expose globally for browser usage
if (typeof window !== 'undefined') {
  window.ASSETS = ASSETS;
  window.getAsset = getAsset;
  window.validateAssetReferences = validateAssetReferences;
}
