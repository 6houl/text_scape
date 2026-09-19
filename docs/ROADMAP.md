# TextScape Development Roadmap

## Phase 1: Foundation ✓ COMPLETED

### Goals
Establish dark fantasy UI, connected world architecture, data-driven systems, and preserved gameplay.

### Completed Work

#### Architecture
- ✓ Modular system architecture (data/systems/ui/core)
- ✓ Centralized asset registry with semantic naming
- ✓ Graph-based world model with exit validation
- ✓ Separated item definitions from inventory instances
- ✓ Schema versioning and save migration (v1 → v2)
- ✓ Result pattern for system actions
- ✓ Development validation on startup

#### Data Layer
- ✓ Asset registry (`assets.js`)
- ✓ World graph with 11 connected locations (`world.js`)
- ✓ Item definitions system (`items.js`)
- ✓ Enemy definitions (`enemies.js`)
- ✓ Location types and danger levels

#### Systems Layer
- ✓ Travel system with exit validation (`travel.js`)
- ✓ Inventory management with stacking (`inventory.js`)
- ✓ Combat system with rewards (`combat.js`)
- ✓ Command parser routing to systems (`commands.js`)

#### UI Layer
- ✓ Four-region layout (left/center/right/bottom)
- ✓ Scene renderer with exploration/combat modes (`renderer.js`)
- ✓ Reusable component library (`components.js`)
- ✓ Tab-based character panel (Character/Inventory/Skills)
- ✓ Graphical inventory with real artwork
- ✓ Context menu for inventory actions
- ✓ Chat system with channel tabs
- ✓ Exit buttons for travel
- ✓ Equipment slot display

#### Styling
- ✓ Dark fantasy color palette
- ✓ Text-first center panel design
- ✓ Pixel-perfect image rendering
- ✓ Responsive layout (desktop-first)
- ✓ Restrained UI without emoji

#### Preserved Gameplay
- ✓ Character stats and progression
- ✓ Inventory management (use/sell/delete)
- ✓ Quest tracking
- ✓ Dungeon combat with boss encounters
- ✓ Potion usage and healing
- ✓ Gold and rewards
- ✓ Save/load system
- ✓ Command interface

#### Documentation
- ✓ ARCHITECTURE.md (system ownership)
- ✓ WORLD.md (location graph, travel)
- ✓ ASSETS.md (asset registry conventions)
- ✓ ROADMAP.md (this file)

#### Developer Tools
- ✓ Asset browser for inspecting 2192 item images
- ✓ World graph validation
- ✓ Asset reference validation

### Technical Debt
1. Only ~20 of 2192 item assets mapped (rest available)
2. Equipment system displays slots but no equip/unequip logic
3. NPCs and interactables render names but have no interaction
4. Social nav (Party/Guild) visible but disabled
5. Skills tab exists but empty
6. Enemy encounters hardcoded to dungeons only
7. No actual portraits/images for characters
8. Combat damage formula could use balancing
9. No resource gathering implementation yet
10. Quest completion doesn't check actual conditions

---

## Phase 2: Core Gameplay Loop (RECOMMENDED NEXT)

### Goals
Complete the exploration → combat → rewards → progression cycle with meaningful player choice.

### Priority Features

#### 1. Enemy Encounters in Wilderness
- Random encounters in dangerous locations
- Enemy definitions per location
- Flee/escape mechanics
- Turn-based combat refinement

#### 2. Resource Gathering
- Harvestable resources at locations (herbs, ore, crystals)
- Add to inventory when gathered
- Respawn timers or limited quantities
- Required for crafting (Phase 3)

#### 3. Quest System Completion
- Quest objectives tracking (kill X, gather Y, reach Z)
- Quest turn-in at NPCs
- Quest rewards (items, gold, XP)
- Quest chains and prerequisites

#### 4. Equipment System
- Equip/unequip items to equipment slots
- Stat bonuses from equipped items
- Weapon requirements (strength, level)
- Weapon damage applies in combat

#### 5. Experience and Leveling
- XP from combat victories
- Level-up system
- Stat increases on level-up
- Level requirements for equipment/locations

#### 6. Loot Drops
- Enemies drop items on defeat
- Rarity-based drop tables
- Gold drops from enemies
- Automatic pickup or choice

### Secondary Features

#### 7. NPC Interactions
- Dialogue system
- NPC portraits/artwork
- Vendor NPCs (buy/sell interface)
- Quest-giving NPCs

#### 8. Status Effects
- Buffs/debuffs in combat
- Poison, burning, frozen
- Duration and tick damage
- Status icons in UI

#### 9. More Locations
- Expand to 20-30 locations
- Connect existing regions
- Add 2-3 new regions
- Mini-dungeons and hidden areas

#### 10. Character Classes
- Class-specific abilities
- Class progression paths
- Class equipment restrictions

---

## Phase 3: Depth & Systems

### Crafting & Professions
- Crafting stations (forge, alchemy table)
- Recipes and requirements
- Profession skill levels
- Gathering professions (herbalism, mining)
- Crafting professions (blacksmithing, alchemy)

### Advanced Combat
- Abilities and skills
- Cooldowns and resource costs
- Combo system
- Elemental damage types
- Critical hits and dodge

### Economy
- Vendor prices fluctuate
- Player-driven economy foundations
- Rare items and auction house prep
- Currency types (gold, special currencies)

### World Events
- Timed events at locations
- World bosses
- Seasonal events
- Dynamic weather effects

---

## Phase 4: Social & Multiplayer Foundation

### Party System
- Form parties with other players
- Shared quest progress
- Party chat
- Loot distribution rules

### Guild System
- Create/join guilds
- Guild chat
- Guild bank/storage
- Guild ranks and permissions

### Real-time Updates
- WebSocket connection
- Player position updates
- Combat synchronization
- Chat synchronization

### Server Architecture
- Node.js/Express server
- MongoDB/PostgreSQL persistence
- Authentication system
- API for game actions

---

## Phase 5: Content & Polish

### Expanded World
- 100+ locations
- 10+ regions
- Multiple dungeon types
- Raid dungeons (group content)

### Advanced Quests
- Branching quest paths
- Moral choices
- Reputation systems
- Epic quest chains

### Character Customization
- Character portraits
- Cosmetic items
- Titles and achievements
- Character biography/roleplay tools

### UI Enhancements
- Minimap
- Quest tracker
- Damage numbers
- Combat log filtering
- Keybindings

---

## Phase 6: Endgame & Retention

### PvP
- Dueling system
- Arena battles
- PvP zones
- Leaderboards

### Endgame Content
- Legendary items
- Mythic dungeons
- Progressive difficulty scaling
- Weekly challenges

### Player Housing
- Personal instances
- Decoration system
- Storage expansion
- Social spaces

### Live Service
- Regular content updates
- Seasonal events
- Community tools
- Moderation systems

---

## Immediate Next Steps (Start Phase 2)

1. **Enemy Encounters** (highest priority)
   - Add enemy spawn definitions to locations
   - Random encounter system when exploring
   - Combat UI improvements for readability

2. **Equipment Functionality**
   - Implement equip/unequip logic
   - Apply weapon damage in combat
   - Show equipped items in character panel

3. **Quest Completion Logic**
   - Track quest objectives
   - Check completion conditions
   - Award rewards on turn-in

4. **Resource Gathering**
   - Click interactables to gather
   - Add resources to inventory
   - Display gathering opportunities in scene

5. **XP and Leveling**
   - Award XP from combat
   - Level-up modal/notification
   - Stat allocation or automatic progression

These five features form a complete core gameplay loop and should be prioritized before expanding into new systems.

---

## Long-term Vision

TextScape aims to become a persistent, text-driven MMORPG that:
- Feels like a graphical MMO but plays through text and choice
- Supports hundreds of concurrent players
- Has deep progression and customization
- Encourages social interaction and cooperation
- Maintains a dark fantasy atmosphere
- Runs in the browser without downloads
- Respects player time and agency

The foundation built in Phase 1 supports this vision while keeping the current scope manageable.
