# Hotwire TV Everywhere Chrome Extension

## Context
As a Hotwire cable customer, accessing TV Everywhere streaming requires navigating to individual network websites and authenticating each time. This Chrome extension provides a single popup with all 90+ available channels, letting you search, filter by platform, save favorites, and open any channel's web stream in one click.

## Project Setup
- **Stack**: React 18 + Vite + TypeScript
- **No external UI library** — custom lightweight CSS for fast popup load times

## Architecture

```
htve
├── manifest.json            # Chrome Extension Manifest V3
├── vite.config.ts           # Vite config targeting Chrome extension output
├── package.json
├── tsconfig.json
├── public/
│   └── icons/               # Extension icons (16, 48, 128px)
└── src/
    ├── popup/
    │   ├── index.html        # Popup entry HTML
    │   ├── main.tsx          # React mount point
    │   ├── App.tsx           # Main app component
    │   ├── components/
    │   │   ├── SearchBar.tsx      # Text search input
    │   │   ├── PlatformFilter.tsx # iOS / Android / Web toggle buttons
    │   │   ├── ChannelList.tsx    # Scrollable channel list
    │   │   └── ChannelCard.tsx    # Individual channel row (name, desc, platforms, fav star)
    │   └── styles/
    │       └── popup.css         # All styles
    ├── data/
    │   └── channels.ts       # Static channel data array with URLs
    └── utils/
        ├── favorites.ts      # Read/write favorites to chrome.storage.local
        └── filter.ts         # Search + platform filtering logic
```

## Implementation Steps

### Step 1: Project scaffolding
- Initialize project with `bun create vite` (React + TypeScript template)
- Configure `vite.config.ts` for Chrome extension build output (`dist/` folder)
- Create `manifest.json` (Manifest V3) with:
  - `action.default_popup` pointing to popup HTML
  - `permissions: ["storage"]` for favorites persistence
  - Extension name, description, icons

### Step 2: Channel data (`src/data/channels.ts`)
- Create a typed array of all 90+ channels from the Hotwire list
- Each entry:
  ```ts
  interface Channel {
    name: string;
    description: string;
    platforms: { ios: boolean; android: boolean; web: boolean };
    webUrl: string;       // Direct link to the channel's streaming site
    logoUrl?: string;     // Optional: network logo
  }
  ```
- Research and populate the correct streaming URLs for each channel (e.g., `https://www.aetv.com/watch`, `https://abc.com/watch`, `https://www.hbomax.com`, etc.)

### Step 3: Favorites utility (`src/utils/favorites.ts`)
- `getFavorites(): Promise<string[]>` — reads favorite channel names from `chrome.storage.local`
- `toggleFavorite(channelName: string): Promise<string[]>` — adds/removes and returns updated list
- Favorites stored as a simple JSON array of channel name strings

### Step 4: Filter utility (`src/utils/filter.ts`)
- `filterChannels(channels, { query, platforms, favorites, showFavoritesFirst })`
- Text search: case-insensitive match on channel name and description
- Platform filter: show only channels available on selected platform(s)
- Favorites sort: pinned favorites appear at the top of results

### Step 5: UI Components

**App.tsx** — Main state manager:
- State: `query`, `activePlatforms`, `favorites`, `channels`
- Load favorites from storage on mount
- Apply filters on state change, pass filtered list to ChannelList

**SearchBar.tsx**:
- Text input with search icon, debounced onChange (150ms)
- Clear button when text is present

**PlatformFilter.tsx**:
- Three toggle buttons: iOS | Android | Web
- Multi-select (can filter by multiple platforms simultaneously)
- Visual active/inactive state

**ChannelCard.tsx**:
- Clickable row that opens `webUrl` in a new tab via `chrome.tabs.create()`
- Shows: channel name, short description (truncated), platform availability dots/icons, favorite star toggle
- Star click calls `toggleFavorite()` and updates parent state

**ChannelList.tsx**:
- Virtualized or simple scrollable list (popup is ~400x600px)
- Shows "No channels found" empty state
- Favorites section at top (if any), then alphabetical

### Step 6: Styling (`src/styles/popup.css`)
- Popup dimensions: 400px wide × 600px tall
- Clean, modern design with Hotwire-inspired color palette
- Fixed search bar + filters at top, scrollable channel list below
- Smooth hover/active states on channel cards
- Star icon animation on favorite toggle

### Step 7: Build & load into Chrome
- `bun run build` outputs to `dist/`
- Load unpacked extension from `dist/` in `chrome://extensions`
- Test all features: search, platform filter, favorites persistence, channel link opening

## Key Streaming URLs to Map
Each channel's `webUrl` will point to its TV Everywhere authentication page. Common patterns:
- Networks with their own apps: direct to their watch page (e.g., `https://watch.hbomax.com`)
- Networks using provider auth: URL includes TVE login flow
- Some networks (C-SPAN, Disney) are web-only — those go to their website directly

## Verification / Testing
1. `bun run build` completes without errors
2. Load unpacked extension in Chrome → icon appears in toolbar
3. Click icon → popup opens with all channels listed
4. Type in search → channels filter in real-time
5. Click platform filters → only matching channels show
6. Click star on a channel → it persists after closing/reopening popup
7. Click a channel → correct streaming website opens in new tab
8. Favorites appear at the top of the list
