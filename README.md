# TextScape

A dark fantasy text-driven MMORPG prototype built with vanilla JavaScript.

## Overview

TextScape is a browser-based role-playing game where exploration, combat, and progression happen primarily through text and player choice, supported by pixel art and a dark fantasy interface.

## Features

- **Connected World**: Navigate through an 11-location graph-based world
- **Turn-based Combat**: Dungeon encounters with boss fights
- **Inventory System**: Collect, use, and manage items with pixel art icons
- **Quest Tracking**: Active quest system with objectives and rewards
- **Character Progression**: Stats, equipment, and gold management
- **Command Interface**: Text commands for power users
- **Persistent Save System**: LocalStorage-based character saves with schema migration
- **Dark Fantasy UI**: Restrained, atmospheric interface designed for text-first gameplay

## Getting Started

### Run Locally

1. Open `index.html` in a modern web browser
2. No build process or dependencies required
3. Game saves automatically to browser LocalStorage

### Developer Asset Browser

Open `dev-asset-browser.html` to visually browse the 2192 item assets and create custom mappings.

## How to Play

### UI Navigation
- **Left Panel**: World exploration, quests, and dungeons
- **Center Panel**: Current location, descriptions, and actions
- **Right Panel**: Character stats, inventory, and equipment
- **Bottom Panel**: Chat/command input and messages

### Commands
- `help` - Show available commands
- `look` - Examine current location
- `move [direction]` - Travel (north/south/east/west)
- `inventory` - View your items
- `stats` - View character statistics
- `quests` - View active quests
- `attack` - Attack enemy in combat
- `use [item]` - Use an item
- `potion` - Quickly use a potion
- `save` - Manually save progress
- `reset` - Reset character (starts fresh)

### Starting Your Adventure
1. Begin in Moonwatch Town
2. Explore locations by clicking exits or using travel commands
3. Accept quests from the quest panel
4. Enter dungeons to fight bosses
5. Collect items and gold
6. Manage your inventory in the right panel

## Project Structure

```
textscape/
├── index.html              # Main game page
├── styles.css              # Dark fantasy styling
├── app.js                  # Application initialization
├── db.js                   # Save/load system
├── src/
│   ├── data/              # Game definitions
│   │   ├── assets.js      # Asset registry
│   │   ├── world.js       # Location graph
│   │   ├── items.js       # Item definitions
│   │   └── enemies.js     # Enemy definitions
│   ├── systems/           # Game logic
│   │   ├── travel.js      # World navigation
│   │   ├── inventory.js   # Inventory management
│   │   └── combat.js      # Combat encounters
│   ├── ui/                # Rendering
│   │   ├── components.js  # UI components
│   │   └── renderer.js    # Scene rendering
│   └── core/              # State & coordination
│       ├── state.js       # State management
│       └── commands.js    # Command parser
├── assets/                # Game artwork
│   ├── items/            # 2192 pixel art items
│   ├── icons/            # UI icons
│   └── ui/               # Interface components
└── docs/                 # Documentation
    ├── ARCHITECTURE.md   # System design
    ├── WORLD.md          # World structure
    ├── ASSETS.md         # Asset management
    └── ROADMAP.md        # Development plan
```

## Development

### Adding New Locations
1. Edit `src/data/world.js`
2. Add location definition with ID, name, description, exits
3. Connect via exits from existing locations
4. Refresh game to validate

### Adding New Items
1. Map asset in `src/data/assets.js`
2. Create definition in `src/data/items.js`
3. Item automatically available in game

### Adding New Enemies
1. Define enemy in `src/data/enemies.js`
2. Add enemy ID to location's `enemies` array
3. Combat system handles the rest

See `docs/` folder for detailed architecture and guidelines.

## Browser Compatibility

- **Recommended**: Modern Chrome, Firefox, Edge, Safari
- **Required**: ES6 support, LocalStorage, CSS Grid
- **Note**: No transpilation or polyfills included

## License

Assets are purchased/approved for TextScape. Code structure is for the TextScape project.

## Phase 1 Complete

This represents the foundational architecture for TextScape:
- ✓ Data-driven design
- ✓ Graph-based world
- ✓ Preserved gameplay
- ✓ Dark fantasy UI
- ✓ Save migration
- ✓ Developer tools

See `docs/ROADMAP.md` for Phase 2 plans.

---

**Welcome to TextScape. The wilds await.**
