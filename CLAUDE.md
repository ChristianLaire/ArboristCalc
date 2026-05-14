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

Design system lives in `src/theme.ts`. Import `FF` (Inter font families), `T` (type scale), `R` (radii), `TOUCH_TARGET` (56), `lightC` / `darkC` (color palettes), `ColorPalette` (type).

**Dark mode:** `ThemeContext` at `src/context/ThemeContext.tsx` — `useColors()` returns the active palette, `useTheme()` returns `{ colors, isDark, mode, setMode }`. Toggle lives in the Conditions tab. Mode persists in AsyncStorage under `arborist_theme_mode`.

**Font:** Inter via `@expo-google-fonts/inter`. Font families in `FF`: `FF.normal` (Inter_400Regular), `FF.medium`, `FF.semibold`, `FF.bold`, `FF.heavy`. Loaded in `app/_layout.tsx` with `useFonts`. Use `fontFamily: FF.bold` in StyleSheet — do not pair with `fontWeight`.

**Sizes:** Body 17pt (`T.base`), small labels 14pt (`T.sm`), CTAs 18pt (`T.md`). Touch targets: `minHeight: TOUCH_TARGET` (56dp) on all interactive inputs and buttons.

**Shape:** Chips and CTAs use `borderRadius: R.pill` (999 — fully pill). Cards use `R.md` (12). Banners `R.md`.

**Colors (light):** ISA green section labels `#1b5e20`, card bg `#ffffff`, page bg `#f5f4ee`. Safety orange CTA `#FF6600` (`C.ctaOrange`) for cross-module send buttons. OSHA safety badge colors in `C.safe{Green,Yellow,Red}{Bg,Text,Border}`.

**Colors (dark):** Page `#121212`, card `#1e1e1e`, section labels `#c8e6c9` — these are lighter greens on dark surfaces for WCAG AAA.

**Component pattern:** Each component / screen calls `const C = useColors()` and `const styles = useMemo(() => makeStyles(C), [C])` where `makeStyles(C: ColorPalette)` returns a `StyleSheet.create({...})`.

**LegalBanner:** `src/components/LegalBanner.tsx` — accepts `stateCode: string | null`, reads from `stateLegality.ts`, shows OSHA type, license requirement, SF overrides, collapsible. Rendered at top of Weight, Rigging, and Anchor screens.

**Cross-module send buttons:** Use `C.ctaOrange` (`#FF6600`) background, white text, `R.pill` radius, `TOUCH_TARGET` min height — standardized across all screens.

> **For future Claude sessions:** After any task involving UI layout, component design, color/theme decisions, or screen architecture — update this **Design Conventions** section with the new decision, then save or update a memory file in `~/.claude/projects/-Users-christianlaire-Projects/memory/` capturing what was decided and why. Cross-reference the memory entry with this file so both stay in sync.
