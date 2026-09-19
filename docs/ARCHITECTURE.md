# TextScape Architecture

## Overview

TextScape follows a layered architecture separating data, systems, UI, and state management.

## Directory Structure

```
src/
├── data/           # Immutable game definitions
│   ├── assets.js   # Asset registry (items/icons/ui → file paths)
│   ├── world.js    # Location graph and world data
│   ├── items.js    # Item definitions
│   └── enemies.js  # Enemy definitions
├── systems/        # Game logic & rules
│   ├── travel.js   # World navigation
│   ├── inventory.js # Inventory management
│   └── combat.js   # Combat encounters
├── ui/             # Rendering & presentation
│   ├── components.js # Reusable UI elements
│   └── renderer.js   # Scene rendering engine
└── core/           # State & coordination
    ├── state.js    # Central state management
    └── commands.js # Command parser & router
```

## Layer Responsibilities

### Data Layer (`src/data/`)

**Purpose**: Define immutable game content (locations, items, enemies).

**Key Principles**:
- Data is READ-ONLY at runtime
- IDs are permanent database identifiers
- No player state stored here
- Definitions are templates, not instances

**Files**:
- `assets.js`: Maps semantic names to physical file paths
- `world.js`: Location graph with exits, NPCs, interactables
- `items.js`: Item templates with stats, icons, properties
- `enemies.js`: Enemy templates with health, damage, rewards

### Systems Layer (`src/systems/`)

**Purpose**: Implement game rules and state mutations.

**Key Principles**:
- Systems change game state
- Systems do NOT manipulate DOM directly
- Return structured results: `{ success, messages, newState }`
- Both UI and commands invoke the same systems

**Files**:
- `travel.js`: Validates exits, resolves destinations, updates location
- `inventory.js`: Add/remove/use items, stack management
- `combat.js`: Turn-based combat, damage calculation, rewards

**Result Pattern**:
```javascript
{
  success: boolean,
  messages: string[],
  newState: object,
  additionalData: any
}
```

### UI Layer (`src/ui/`)

**Purpose**: Render game state to DOM.

**Key Principles**:
- UI displays state, does NOT contain game rules
- UI components are reusable and composable
- Scene renderer supports multiple modes (exploration, combat, dialogue)
- UI triggers system calls via callbacks

**Files**:
- `components.js`: Inventory slots, buttons, stat bars, tooltips
- `renderer.js`: Contextual scene rendering (exploration/combat/etc)

**Scene Modes**:
- Exploration: Location description, exits, NPCs, interactables
- Combat: Enemy info, health, action buttons
- (Future: Dialogue, Shop, Crafting, Quest)

### Core Layer (`src/core/`)

**Purpose**: Coordinate state and route player actions.

**Key Principles**:
- Single source of truth for player state
- Commands and UI converge on same systems
- State changes trigger save and UI updates

**Files**:
- `state.js`: GameState singleton, save/load coordination
- `commands.js`: Text command parser, routes to systems

## Data Flow

### Player Action (UI)
```
User clicks [Travel North]
  → SceneRenderer.onTravel('north')
  → TravelSystem.travel(state, 'north')
  → GameState.setLocation(newLocation)
  → GameState.save()
  → app.js renders updated scene
```

### Player Action (Command)
```
User types "move north"
  → CommandParser.parse('move north')
  → TravelSystem.travel(state, 'north')
  → GameState.setLocation(newLocation)
  → GameState.save()
  → app.js renders updated scene
```

**Result**: Both paths use the same travel system.

## State Management

### Player State Structure
```javascript
{
  player: {
    name, className, level, xp,
    health, maxHealth, mana, maxMana, stamina, maxStamina,
    gold, stats, currentLocation, equipment
  },
  inventory: [{ itemId, quantity }, ...],
  quests: [{ id, status, ... }, ...],
  combat: { active, enemy, ... } | null,
  combatStats: { wins, losses }
}
```

### World State vs Player State

**World (Immutable)**:
```javascript
LOCATIONS.moonwatch_town = {
  id, name, type, description, exits, npcs, ...
}
```

**Player (Mutable)**:
```javascript
state.player.currentLocation = 'moonwatch_town'
```

This separation allows:
- Multiple players in future multiplayer
- World updates without save corruption
- Clear ownership of data

## Asset Management

### Semantic References
Game code references items by semantic names:
```javascript
item.icon = 'iron_sword'
```

### Asset Registry
Registry maps semantics to file paths:
```javascript
ASSETS.items.iron_sword = 'assets/items/fb347.png'
```

### Benefits
- Game logic independent of filenames
- Assets can be reorganized without code changes
- Missing assets handled gracefully

## Save System

### Schema Versioning
```javascript
{
  schemaVersion: 2,
  ...playerData
}
```

### Migration
Old saves are detected and migrated:
- v1 → v2: Location names → location IDs
- v1 → v2: String inventory → reference inventory
- Future versions add migration functions

### Storage
- LocalStorage (current)
- Future: Server-side authoritative state

## Extension Points

### Adding New Scene Modes
1. Create mode renderer in `renderer.js`
2. Add mode detection in `app.js`
3. Implement mode-specific actions

### Adding New Systems
1. Create system file in `src/systems/`
2. Export system functions
3. Add command mappings in `commands.js`
4. Wire UI interactions in `app.js`

### Adding New Items
1. Add asset to `assets.js`
2. Add definition to `items.js`
3. Asset and item automatically available

### Adding New Locations
1. Add location to `world.js` LOCATIONS
2. Connect via exits from existing locations
3. Validation runs automatically on startup

## Development Validation

On startup, the game validates:
- World graph integrity (no broken exits)
- Item asset references
- Player location validity
- Schema version compatibility

Warnings/errors logged to console.

## Future Considerations

### Multiplayer
- State management designed for server authority
- Player state separable from world state
- Systems return results suitable for network transmission

### Persistence
- Schema versioning supports migration
- IDs are permanent and database-safe
- Inventory uses references, not full copies

### Scalability
- Lazy-load location details as needed
- Asset registry can be generated/cached
- Systems are stateless and composable
