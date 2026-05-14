# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run web        # Run in browser (localhost:8081)
npm run start      # Expo dev server — press w for web, i for iOS simulator
npm run ios        # iOS simulator
npm run android    # Android emulator
```

When adding new packages, use `npx expo install <package>` rather than `npm install` — it pins the SDK-compatible version automatically. If there are peer dependency conflicts, append `--` then pass `--legacy-peer-deps` to npm.

## Architecture

This is an **Expo Router** app (file-based routing). The entry point is `app/index.tsx`, which immediately redirects to `/(tabs)/weight`.

### Routing

All screens live under `app/(tabs)/`. Each file is a tab:
- `weight.tsx` — Module 1: Tree/Log Weight estimation
- `rigging.tsx` — Module 2: Rigging load calculations
- `tension.tsx` — Module 3: Rope tension / mechanical advantage
- `anchor.tsx` — Module 4: Anchor point strength

Tab icons use `MaterialCommunityIcons` from `@expo/vector-icons`. The tab bar and header styles are defined once in `app/(tabs)/_layout.tsx`.

### Layout & Theming

`app/_layout.tsx` wraps the entire app in `PaperProvider` (react-native-paper MD3 light theme) and shows a one-time safety disclaimer modal using `AsyncStorage` to track acceptance. Brand green is `#2e7d32` throughout.

### Shared Components (`src/components/`)

Imported via the `@/*` path alias (maps to `src/`):

- **`NumericInput`** — labeled text input with `keyboardType="decimal-pad"`, accepts `label`, `value`, `onChangeText`, optional `unit` and `placeholder`
- **`ResultCard`** — displays a titled list of `{ label, value }` rows in a card
- **`SafetyBadge`** — color-coded status badge with `level: 'green' | 'yellow' | 'red'` and a message string

Each calculator tab follows the same pattern: local state for inputs → derived calculation → `ResultCard` for results → `SafetyBadge` for safety status.

### Data Persistence

`AsyncStorage` is used only for the disclaimer flag (`disclaimer_accepted`). Calculator inputs are not persisted between sessions yet.

## Design Conventions

Brand green: `#2e7d32`. Background: `#fafafa`. Card borders: `#e0e0e0`. Safety levels: green `#e8f5e9` / yellow `#fff8e1` / red `#ffebee`. All border-radius is 8–12px. Typography: 13–20px, weight 600–700 for labels/titles.

> **For future Claude sessions:** After any task involving UI layout, component design, color/theme decisions, or screen architecture — update this **Design Conventions** section with the new decision, then save or update a memory file in `~/.claude/projects/-Users-christianlaire-Projects/memory/` capturing what was decided and why. Cross-reference the memory entry with this file so both stay in sync.
