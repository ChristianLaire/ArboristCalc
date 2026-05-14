import type { SafetyLevel } from '@/components/SafetyBadge';

// --- Sub-mode A: Sling angle ---

export interface SlingInput {
  loadLbs: number;
  includedAngleDeg: number;
}

export interface SlingResult {
  tensionPerLegLbs: number;
  level: SafetyLevel;
  message: string;
}

export function calcSlingTension(input: SlingInput): SlingResult {
  const angleRad = (input.includedAngleDeg * Math.PI) / 180;
  const tensionPerLegLbs = input.loadLbs / (2 * Math.cos(angleRad / 2));
  const { includedAngleDeg } = input;

  let level: SafetyLevel;
  let message: string;
  if (includedAngleDeg < 90) {
    level = 'green';
    message = `Safe sling angle (${includedAngleDeg.toFixed(0)}°)`;
  } else if (includedAngleDeg <= 120) {
    level = 'yellow';
    message = `Caution — wide sling angle (${includedAngleDeg.toFixed(0)}°)`;
  } else {
    level = 'red';
    message = `DANGEROUS — sling angle too wide (${includedAngleDeg.toFixed(0)}°)`;
  }

  return { tensionPerLegLbs, level, message };
}

// --- Sub-mode B: Mechanical Advantage ---

export type MaSystem = '2:1' | '3:1' | '4:1';

const MA_SHEAVES: Record<MaSystem, number> = { '2:1': 1, '3:1': 2, '4:1': 3 };
const MA_THEORETICAL: Record<MaSystem, number> = { '2:1': 2, '3:1': 3, '4:1': 4 };

export interface MaInput {
  loadLbs: number;
  system: MaSystem;
  sheaveEfficiency?: number; // default 0.85
}

export interface MaResult {
  actualMa: number;
  haulingForceLbs: number;
  level: SafetyLevel;
  message: string;
}

export function calcMechanicalAdvantage(input: MaInput): MaResult {
  const eff = input.sheaveEfficiency ?? 0.85;
  const sheaves = MA_SHEAVES[input.system];
  const theoretical = MA_THEORETICAL[input.system];
  const actualMa = theoretical * eff ** sheaves;
  const haulingForceLbs = input.loadLbs / actualMa;
  const ratio = haulingForceLbs / input.loadLbs;

  let level: SafetyLevel;
  let message: string;
  if (ratio < 0.4) {
    level = 'green';
    message = `Good mechanical advantage — ${actualMa.toFixed(2)}:1 actual`;
  } else if (ratio < 0.6) {
    level = 'yellow';
    message = `Moderate effort required — ${actualMa.toFixed(2)}:1 actual`;
  } else {
    level = 'red';
    message = `High hauling force — consider more purchase`;
  }

  return { actualMa, haulingForceLbs, level, message };
}
