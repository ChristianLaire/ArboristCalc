// ArboristCalc Design System
// Informed by: Arborgold, iTree Tools, ArborNote, TreePlotter INVENTORY, Forest Metrix, Arb-Pro (UK).
// Key principle: outdoor-readable, high-contrast, ISA-branded forest green, OSHA-safety hierarchy.

export const C = {
  // ── Brand greens (ISA / arboriculture industry standard) ───────────
  green900: '#1b5e20',   // nav bar, primary actions, section labels
  green800: '#2e7d32',   // active chips, card titles, borders
  green700: '#388e3c',   // accent dividers
  green100: '#c8e6c9',   // light chip borders
  green50:  '#e8f5e9',   // banner / note backgrounds

  // ── Safety orange — OSHA caution / cross-module CTA ───────────────
  orange700: '#e65100',   // caution text, CTA send buttons
  orange50:  '#fff3e0',   // caution backgrounds

  // ── Neutral warm (easier outdoor readability than pure gray) ───────
  bg:        '#f5f4ee',   // page / screen background
  card:      '#ffffff',   // card surfaces
  border:    '#e4e3da',   // light dividers
  borderMid: '#c8c7be',   // input borders
  stripe:    '#fafaf7',   // alternate row tint

  // ── Text hierarchy ─────────────────────────────────────────────────
  text:      '#1a1a1a',   // primary body text
  textMid:   '#5c5c5c',   // secondary labels
  textLight: '#9e9e9e',   // hints / placeholders

  // ── Safety badge palette (OSHA-aligned) ───────────────────────────
  safeGreenBg:     '#e8f5e9',
  safeGreenText:   '#1b5e20',
  safeGreenBorder: '#388e3c',

  safeYellowBg:     '#fff3e0',
  safeYellowText:   '#e65100',
  safeYellowBorder: '#ef6c00',

  safeRedBg:     '#ffebee',
  safeRedText:   '#b71c1c',
  safeRedBorder: '#c62828',

  // ── Cross-module import banners ────────────────────────────────────
  importBg:     '#e8eaf6',
  importBorder: '#7986cb',
  importText:   '#283593',
} as const;

export const T = {
  // Font sizes — bumped up from 13→15 base for outdoor/gloved-hand use
  xs:   11,
  sm:   13,
  base: 15,
  md:   16,
  lg:   18,
  xl:   20,
  xxl:  24,

  // Font weights
  normal:   '400' as const,
  medium:   '500' as const,
  semibold: '600' as const,
  bold:     '700' as const,
  heavy:    '800' as const,
} as const;

export const R = {
  sm:  6,
  md:  10,
  lg:  14,
  xl:  20,
} as const;
