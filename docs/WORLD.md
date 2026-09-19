# TextScape World

## World Structure

The game world is a directed graph of connected locations. Travel is restricted to valid exits.

## Current World Map

```
                    Blackwood Depths
                          |
                          ↓ (down)
                    Gloom Den [DUNGEON]


    Ruined Shrine ← → Blackwood Forest
                         ↓
                    Old King's Road
                    ↙    ↓    ↘
    Moonwatch Town   (direct)   (direct)
         ↓                 
    Trade Road ← ← ← ← (direct)
         ↓
    Ember Ridge → Crystal Pass
```

## Regions

### The Ashen Reach
- Moonwatch Town (safe town, starting location)
- Eastern Gate (landmark)
- Old King's Road (road)
- Blackwood Forest (wilderness)
- Blackwood Depths (dangerous wilderness)
- Ruined Shrine (landmark)
- Gloom Den (dungeon)
- Trade Road (road)

### The Scorched Expanse
- Ember Ridge (wilderness)
- Crystal Pass (landmark)

## Location Details

### Moonwatch Town
**ID**: `moonwatch_town`  
**Type**: Town  
**Danger**: Safe  
**Exits**: east → Eastern Gate, south → Trade Road

A quiet frontier town. Safe zone for merchants and travelers.

### Eastern Gate
**ID**: `eastern_gate`  
**Type**: Landmark  
**Danger**: Safe  
**Exits**: west → Moonwatch Town, east → Old King's Road

The edge of civilization.

### Old King's Road
**ID**: `old_kings_road`  
**Type**: Road  
**Danger**: Low  
**Exits**: west → Eastern Gate, north → Blackwood Edge, south → Trade Road

Ancient road connecting settlements. Occasional hostile encounters.

### Blackwood Forest
**ID**: `blackwood_edge`  
**Type**: Wilderness  
**Danger**: Moderate  
**Exits**: south → Old King's Road, north → Blackwood Depths, west → Ruined Shrine

Dark forest with abandoned wagon and wandering creatures.

**Enemies**: Forest Wolf, Shadow Lurker

### Blackwood Depths
**ID**: `blackwood_depths`  
**Type**: Wilderness  
**Danger**: High  
**Exits**: south → Blackwood Edge, down → Gloom Den

Deep forest with dungeon entrance.

**Enemies**: Dire Wolf, Corrupted Treant

### Ruined Shrine
**ID**: `ruined_shrine`  
**Type**: Landmark  
**Danger**: Low  
**Exits**: east → Blackwood Edge

Ancient shrine with Moonbloom herbs.

**Resources**: Moonbloom Herb  
**Quests**: Gather Moonbloom quest location

### Gloom Den
**ID**: `gloom_den`  
**Type**: Dungeon  
**Danger**: High  
**Exits**: up → Blackwood Depths

Dark dungeon with boss encounter.

**Enemy**: Wraithfang (Boss)  
**Reward**: Relic of Dawn  
**Quests**: Relic Recovery quest location

### Trade Road
**ID**: `trade_road`  
**Type**: Road  
**Danger**: Low  
**Exits**: north → Moonwatch Town, east → Old King's Road, south → Ember Ridge

Well-traveled southern trade route.

### Ember Ridge
**ID**: `ember_ridge`  
**Type**: Wilderness  
**Danger**: Moderate  
**Exits**: north → Trade Road, east → Crystal Pass

Volcanic slopes with elemental enemies.

**Enemies**: Ember Elemental, Ash Wraith

### Crystal Pass
**ID**: `crystal_pass`  
**Type**: Landmark  
**Danger**: Moderate  
**Exits**: west → Ember Ridge

Mountain pass with crystal formations.

**Resources**: Crystal Shard

## Travel Mechanics

### Valid Travel Commands

**Direction-based**:
- `travel north` / `move north` / `go north`
- Valid directions: north, south, east, west, up, down

**Destination-based**:
- `travel moonwatch` (partial name match)
- `travel moonwatch_town` (full ID)

**UI-based**:
- Click exit buttons in scene

### Travel Validation

The TravelSystem validates:
1. Current location is valid
2. Requested direction/destination exists in current location's exits
3. Destination location exists in world

Invalid travel is rejected with a message.

### Graph Integrity

On startup, the game validates:
- All exits point to existing locations
- No orphaned locations (except starting location)
- Bidirectional connections are correct

## Location Properties

### Required
- `id`: Permanent database identifier
- `name`: Display name
- `type`: town | road | wilderness | dungeon | landmark
- `description`: Atmospheric text (2-3 sentences)
- `exits`: Object mapping direction → destination ID

### Optional
- `region`: Region name for breadcrumb
- `dangerLevel`: 0 (safe) to 4 (deadly)
- `npcs`: Array of NPC IDs
- `enemies`: Array of enemy IDs
- `interactables`: Array of interactable object IDs
- `resources`: Array of harvestable resource IDs

## Adding New Locations

1. Add location definition to `src/data/world.js`
2. Assign permanent ID (snake_case)
3. Connect via exits from existing location(s)
4. Run game to validate graph integrity
5. Test travel to/from new location

Example:
```javascript
new_location: {
  id: 'new_location',
  name: 'New Location Name',
  region: 'The Ashen Reach',
  type: LOCATION_TYPES.WILDERNESS,
  dangerLevel: DANGER_LEVELS.MODERATE,
  description: 'Your description here.',
  exits: {
    west: 'existing_location'
  }
}
```

Then in `existing_location`:
```javascript
exits: {
  east: 'new_location',
  // ... other exits
}
```

## Future Expansion

### Planned Regions
- The Frozen Wastes (north)
- The Sunken Coast (southwest)
- The Crystal Peaks (northeast)
- The Shadow Vale (deep wilderness)

### Planned Location Types
- Villages (smaller safe zones)
- Camps (temporary safe zones)
- Ruins (explorable landmarks)
- Caves (mini-dungeons)
- Towers (vertical dungeons)

### Dynamic Elements
- Time-based access (night/day)
- Weather conditions
- Seasonal changes
- Quest-locked locations
- Player-built structures
