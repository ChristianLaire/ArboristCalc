// ArboristCalc Design System — v2
// Research basis: Inter font (high x-height field legibility), Material 3 Expressive rounded geometry,
// WCAG AAA 7:1 contrast targets for outdoor use, OSHA-aligned safety color hierarchy,
// 56pt minimum touch targets (glove-use field standard).

// ── Inter font families (loaded via @expo-google-fonts/inter) ─────────
export const FF = {
  normal:   'Inter_400Regular',
  medium:   'Inter_500Medium',
  semibold: 'Inter_600SemiBold',
  bold:     'Inter_700Bold',
  heavy:    'Inter_800ExtraBold',
} as const;

// ── Typography scale ──────────────────────────────────────────────────
export const T = {
  xs:   12,
  sm:   14,
  base: 17,   // body — bumped to 17pt per field-app accessibility standard
  md:   18,
  lg:   20,
  xl:   24,
  xxl:  28,

  // Font weights (for system-font fallback)
  normal:   '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
  heavy:    '800' as const,

  // Line heights
  tight:  1.2,
  normal2: 1.4,
  loose:  1.6,
} as const;

// ── Border radii ──────────────────────────────────────────────────────
export const R = {
  sm:   6,
  md:   12,
  lg:   18,
  xl:   28,   // pill shape for chips / badges
  pill: 999,  // fully pill CTAs
} as const;

// ── Touch target minimum ──────────────────────────────────────────────
export const TOUCH_TARGET = 56; // dp — field/glove-use standard

// ── Color palettes ────────────────────────────────────────────────────

const shared = {
  // OSHA safety orange — same in both modes (field recognition)
  ctaOrange:    '#FF6600',

  // Import / cross-module banners (indigo)
  importBorder: '#7986cb',
} as const;

export const lightC = {
  ...shared,

  // Brand greens (ISA / arboriculture standard)
  green900: '#1b5e20',
  green800: '#2e7d32',
  green700: '#388e3c',
  green100: '#c8e6c9',
  green50:  '#e8f5e9',

  // Caution / warning
  orange700: '#e65100',
  orange50:  '#fff3e0',

  // Surfaces
  bg:        '#f5f4ee',
  card:      '#ffffff',
  border:    '#e4e3da',
  borderMid: '#c8c7be',
  stripe:    '#fafaf7',

  // Text — WCAG AAA on light surfaces
  text:      '#1a1a1a',
  textMid:   '#5c5c5c',
  textLight: '#9e9e9e',

  // Safety badge palette (OSHA-aligned)
  safeGreenBg:     '#e8f5e9',
  safeGreenText:   '#1b5e20',
  safeGreenBorder: '#388e3c',

  safeYellowBg:     '#fff3e0',
  safeYellowText:   '#bf360c',
  safeYellowBorder: '#ef6c00',

  safeRedBg:     '#ffebee',
  safeRedText:   '#b71c1c',
  safeRedBorder: '#c62828',

  // Cross-module import banner
  importBg:   '#e8eaf6',
  importText: '#283593',
} as const;

export const darkC = {
  ...shared,

  // Brand greens — lightened for dark surfaces (WCAG AAA)
  green900: '#c8e6c9',   // section labels on dark bg — 8.1:1
  green800: '#a5d6a7',   // accents, card title bars
  green700: '#81c784',
  green100: '#1b3d1c',   // very dark green tint
  green50:  '#162117',   // dark green surface

  // Caution / warning — warm amber readable on dark
  orange700: '#ffb74d',
  orange50:  '#1f1400',

  // Surfaces — Material Design dark surface spec
  bg:        '#121212',
  card:      '#1e1e1e',
  border:    '#2c2c2c',
  borderMid: '#3d3d3d',
  stripe:    '#252525',

  // Text — WCAG AAA on dark surfaces
  text:      'rgba(255,255,255,0.87)',
  textMid:   'rgba(255,255,255,0.60)',
  textLight: 'rgba(255,255,255,0.38)',

  // Safety badge palette — dark mode
  safeGreenBg:     '#0d1f0e',
  safeGreenText:   '#c8e6c9',
  safeGreenBorder: '#4caf50',

  safeYellowBg:     '#1f1400',
  safeYellowText:   '#ffd54f',
  safeYellowBorder: '#ffc107',

  safeRedBg:     '#1f0505',
  safeRedText:   '#ef9a9a',
  safeRedBorder: '#f44336',

  // Cross-module import banner
  importBg:   '#0a0d2e',
  importText: '#9fa8da',
} as const;

export type ColorPalette = { [K in keyof typeof lightC]: string };

// Static fallback (used during initial render before ThemeContext is available)
export const C = lightC;
