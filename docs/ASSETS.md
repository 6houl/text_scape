# TextScape Asset Management

## Asset Registry System

TextScape uses a centralized asset registry to map semantic names to physical file paths. This abstraction allows game logic to reference assets without knowing internal filenames.

## Asset Categories

### Items (`ASSETS.items`)
2192 pixel art item assets from the Fantasy Battle collection.

**Naming Pattern**: `fb1.png` through `fb2192.png`

**Current Mappings**:
```javascript
iron_sword: "assets/items/fb1.png"
steel_sword: "assets/items/fb2.png"
health_potion: "assets/items/fb500.png"
mana_potion: "assets/items/fb501.png"
moonstone_charm: "assets/items/fb600.png"
map_fragment: "assets/items/fb700.png"
// ... etc
```

**Fallback**: `_default` points to fb1.png for unmapped items

### Icons (`ASSETS.icons`)
25 UI icons for weapons, abilities, stats, NPCs, and game elements.

**Examples**:
```javascript
sword: "assets/icons/icon_sword.png"
healing_potion: "assets/icons/icon_healing_potion.png"
gold: "assets/icons/icon_gold.png"
trader: "assets/icons/icon_trader.png"
```

### UI Components (`ASSETS.ui`)
Button states, frames, panels, input fields.

**Structure**:
```javascript
ui: {
  buttons: {
    grey_default: "assets/ui/Button/Button#1/Status=Grey_Default.png",
    grey_hover: "assets/ui/Button/Button#1/Status=Grey_Hover.png",
    // ... more states
  },
  frames: {
    background: "assets/ui/Frame/Frame_background.png",
    outline: "assets/ui/Frame/Frame_outline.png",
    // ... more frames
  }
}
```

## Usage in Game Code

### Item Definitions
```javascript
// In src/data/items.js
iron_sword: {
  id: 'iron_sword',
  name: 'Iron Sword',
  icon: 'iron_sword',  // ← Semantic reference
  // ... other properties
}
```

### Asset Resolution
```javascript
// At render time
const itemDef = getItemDefinition('iron_sword');
const iconPath = getAsset('items', itemDef.icon);
// Result: "assets/items/fb1.png"

imgElement.src = iconPath;
```

## Benefits

1. **Decoupling**: Game logic doesn't know about fb347.png
2. **Flexibility**: Assets can be reorganized without code changes
3. **Fallbacks**: Missing assets degrade gracefully
4. **Validation**: Asset references can be validated at startup
5. **Semantics**: `iron_sword` is more meaningful than `fb347`

## Adding New Assets

### New Item
1. Place asset file in `assets/items/`
2. Add mapping to `src/data/assets.js`:
```javascript
ASSETS.items.my_new_item = "assets/items/fb1234.png";
```
3. Create item definition in `src/data/items.js`:
```javascript
my_new_item: {
  id: 'my_new_item',
  icon: 'my_new_item',  // References the asset
  // ... properties
}
```

### New Icon
1. Place asset file in `assets/icons/`
2. Add mapping to `src/data/assets.js`:
```javascript
ASSETS.icons.my_icon = "assets/icons/icon_my_icon.png";
```
3. Reference in code:
```javascript
getAsset('icons', 'my_icon')
```

## Asset Browser Tool

A developer tool `dev-asset-browser.html` is included to visually inspect the 2192 item assets.

**Features**:
- Grid view of all assets
- Search/filter by filename
- Select items and assign semantic names
- Export JSON mapping

**Usage**:
1. Open `dev-asset-browser.html` in browser
2. Browse/search assets
3. Click to select items
4. Assign semantic names
5. Export JSON mapping
6. Integrate into `assets.js`

## Asset Guidelines

### Image Rendering
Pixel art assets use:
```css
image-rendering: pixelated;
image-rendering: crisp-edges;
```

This preserves sharp pixel edges at various scales.

### Recommended Sizes
- **Inventory icons**: 32x32px display (assets may be larger)
- **Equipment icons**: 24x24px display
- **UI icons**: 16x16px to 24x24px

### Missing Assets
If an asset reference fails:
1. `getAsset()` logs a warning to console
2. Returns fallback asset
3. Game continues without crash

### Asset Validation
On startup in development mode:
```javascript
validateItemAssets();
```

Checks all item definitions have valid asset mappings.

## Current Asset Inventory

### Items
- **Total**: 2192 assets
- **Mapped**: ~20 (initial Phase 1 set)
- **Unmapped**: 2172 (available for expansion)

### Icons
- **Total**: 25 icons
- **Categories**: Weapons (7), Abilities (4), Items (4), NPCs (3), Stats (4), Traps (3)

### UI Components
- **Buttons**: 3 variations × 6 states = 18 assets
- **Frames**: 6 frame types
- **Additional**: Input fields, sliders, toggles, layouts

## Future Asset Needs

### Creatures/Enemies
- Enemy portraits (currently text-only)
- Boss art
- NPC portraits

### Environment
- Location illustrations
- Weather effects
- Ambient overlays

### Abilities/Effects
- Skill icons
- Status effect icons
- Particle effects

### UI
- Panel decorations
- Separators
- Badges/markers
- Progress bars

## Asset File Organization

Current structure:
```
assets/
├── items/          (2192 files: fb1.png - fb2192.png)
├── icons/          (25 files: icon_*.png)
└── ui/
    ├── Button/
    ├── Frame/
    ├── Icon/
    ├── Input Field/
    ├── Layout/
    ├── Notice/
    ├── Slider/
    └── Toggle/
```

**Do not reorganize** the items/ directory without updating all mappings.

## Performance Considerations

### Lazy Loading
Currently all assets loaded on-demand by browser.

Future optimization:
- Preload critical assets
- Sprite sheet consolidation
- Lazy load rarely-used assets

### Caching
Browser caches assets automatically.

For multiplayer:
- Asset registry can be cached client-side
- Only definitions fetched from server

## Licensing & Attribution

Assets are purchased/approved for TextScape.

When using external asset packs:
1. Verify license permits game use
2. Document attribution if required
3. Keep license files in assets/ folder
