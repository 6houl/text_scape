# TextScape Phase 1.5B Testing Guide

## Quick Start

### Option 1: Open Directly (Simplest)
1. Navigate to the project folder in File Explorer
2. Double-click `index.html`
3. Opens in your default browser

### Option 2: HTTP Server (Recommended)
```powershell
cd C:\Users\Brandon\Desktop\text_scape-main
npx http-server -p 8000
```
Then open: http://localhost:8000

## What to Test

### 1. Button Assets (PRIORITY 0-1)
- ✅ All buttons should display dark fantasy artwork (not white blocks)
- ✅ Hover over any button → artwork changes
- ✅ Click button → shows pressed state
- ✅ Check browser console for 404 errors → should be ZERO

**Test Buttons:**
- Exit buttons (North, South, etc.)
- Enter Dungeon
- Send button (chat)
- Tab buttons (Character, Inventory, Skills)
- Chat channel tabs (Local, World, Party, System)
- Context menu buttons (right-click inventory item)

### 2. Center Panel Reading Experience (PRIORITY 2, 15)
- ✅ Center panel should have dark solid interior (not busy texture)
- ✅ Location description text should not span entire width
- ✅ Text comfortable to read on 1920px display

### 3. Exits (PRIORITY 3)
- ✅ Exit buttons should be compact (not huge white bars)
- ✅ Direction shown clearly (↑ NORTH, etc.)
- ✅ Destination name visible on right
- ✅ Hover state shows artwork change

### 4. Inventory Slots (PRIORITY 4)
- ✅ Slots show item ICON prominently (40px)
- ✅ Item names NOT printed inside slots
- ✅ Quantity badge shown for stacked items (bottom-right)
- ✅ Hover shows tooltip with item details

### 5. Inventory Tooltip & Context Menu (PRIORITY 4-5)
**Tooltip:**
- Hover over inventory item
- ✅ Tooltip appears with dark frame
- ✅ Shows: item name, rarity, description, value

**Context Menu:**
- Click inventory item
- ✅ Context menu opens with dark frame
- ✅ Tooltip disappears when menu opens
- ✅ Menu stays within viewport (doesn't clip off edge)
- ✅ ESC key closes menu
- ✅ Click outside closes menu

### 6. Character Portrait (PRIORITY 6)
- ✅ Portrait box shows bow icon (not empty)
- ✅ Frame looks intentional

### 7. NPC Icons (PRIORITY 7)
In Moonwatch:
- ✅ Trader Marcus → shows trader icon (not generic silhouette)
- ✅ Innkeeper Elara → shows appropriate icon

### 8. Tabs (PRIORITY 8-9)
**Right Panel Tabs:**
- ✅ Character/Inventory/Skills use button artwork
- ✅ Active tab shows pressed state
- ✅ Hover changes artwork

**Chat Tabs:**
- ✅ Local/World/Party/System use compact button artwork
- ✅ Active tab highlighted
- ✅ Clear visual states

### 9. Chat Panel (PRIORITY 10-12)
- ✅ Chat takes less vertical space (~170px total vs previous ~200px)
- ✅ Input field has metal frame border
- ✅ Send button compact and uses red button artwork
- ✅ Send button properly sized (not huge)

### 10. Overall Visual Quality
- ✅ No white placeholder controls
- ✅ Consistent dark fantasy aesthetic
- ✅ Progress bars show weathered metal texture
- ✅ Scrollbars bronze/dark (not browser default)
- ✅ All text readable
- ✅ No distorted artwork

## Test at Multiple Resolutions

### 1920×1080 (Primary)
- Center text should be comfortably constrained
- All panels visible and functional

### 1600×900
- Layout should remain intact
- Buttons properly sized

### 1366×768
- Responsive breakpoints tested
- Chat still functional

## Browser Console Check

Open Developer Tools (F12) → Console:
- ✅ Zero 404 errors for button assets
- ✅ Zero JavaScript errors
- ✅ All assets load successfully

Check Network tab:
- ✅ All UI assets return HTTP 200
- ✅ No `/assets/ui/Button/Button` truncated requests

## Functionality Regression Test

Ensure Phase 1 features still work:
- ✅ Combat system functional
- ✅ Inventory management works
- ✅ Travel between locations
- ✅ Chat input/output
- ✅ Character stats display
- ✅ Data persists in IndexedDB

## Known Acceptable Items

- Favicon: Now shows sword emoji (no 404)
- Empty inventory slots: Intentionally faded
- Disabled tabs: Correctly show disabled artwork

## Report Issues

If you find:
1. White control blocks → Button asset not loading
2. 404 errors → Path encoding issue
3. Tooltip/menu overlap → Positioning bug
4. Distorted artwork → border-image slice needs adjustment
5. Text unreadable → Contrast/typography issue

## Phase 1.5B Success Criteria

ALL of the following must be true:
- ✅ Zero button asset 404 errors
- ✅ All buttons use actual artwork (no white blocks)
- ✅ Exits compact and readable
- ✅ Inventory slots icon-first
- ✅ Tooltips and context menu work cleanly
- ✅ Center panel calm for reading
- ✅ Chat height reduced
- ✅ Send button compact
- ✅ NPC icons appropriate
- ✅ Character portrait intentional
- ✅ No gameplay regression

## Next Step After Testing

Once validated:
**DO NOT proceed to Phase 2 gameplay development**

Await further instructions for next phase.
