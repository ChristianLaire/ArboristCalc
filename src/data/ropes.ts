export type RopeType = 'Climb' | 'Rigging' | 'Lanyard';

export interface Rope {
  id: string;
  name: string;
  diameterIn: number;
  mbsLbs: number;
  wllLbs: number;
  type: RopeType;
  custom?: boolean;
}

export const DEFAULT_ROPES: Rope[] = [
  { id: 'r1', name: 'Yale Poison Ivy 1/2"',        diameterIn: 0.5,  mbsLbs: 7200, wllLbs: 720, type: 'Climb' },
  { id: 'r2', name: 'Samson Stable Braid 1/2"',    diameterIn: 0.5,  mbsLbs: 6800, wllLbs: 680, type: 'Climb' },
  { id: 'r3', name: 'Teufelberger SIRIUS 11.7mm',  diameterIn: 0.46, mbsLbs: 7870, wllLbs: 787, type: 'Climb' },
  { id: 'r4', name: 'Petzl Grillon 12mm',           diameterIn: 0.47, mbsLbs: 4500, wllLbs: 450, type: 'Lanyard' },
  { id: 'r5', name: 'Generic 3/4" Bull Rope',       diameterIn: 0.75, mbsLbs: 9000, wllLbs: 900, type: 'Rigging' },
  { id: 'r6', name: 'Generic 1/2" Rigging Line',    diameterIn: 0.5,  mbsLbs: 6600, wllLbs: 660, type: 'Rigging' },
];

export function wllFromMbs(mbsLbs: number): number {
  return Math.round(mbsLbs / 10);
}
