import { Species, Condition, getDensity } from '@/data/species';

export interface LogWeightInput {
  mode: 'log' | 'tree';
  species: Species;
  condition: Condition;
  // log mode
  diameterSmallIn?: number;
  diameterLargeIn?: number;
  lengthFt?: number;
  // tree mode
  dbhIn?: number;
  heightFt?: number;
  formFactor?: number;
}

export interface WeightResult {
  volumeFt3: number;
  weightLbs: number;
}

export function calcLogWeight(input: LogWeightInput): WeightResult {
  const density = getDensity(input.species, input.condition);
  let volumeFt3: number;

  if (input.mode === 'log') {
    // Smalian's formula: V = (π/2) × L × (r_small² + r_large²)
    const rSmallFt = (input.diameterSmallIn ?? 0) / 2 / 12;
    const rLargeFt = (input.diameterLargeIn ?? 0) / 2 / 12;
    const lengthFt = input.lengthFt ?? 0;
    volumeFt3 = (Math.PI / 2) * lengthFt * (rSmallFt ** 2 + rLargeFt ** 2);
  } else {
    // Whole-tree: V = π × (DBH/2)² × height × form_factor
    const rFt = (input.dbhIn ?? 0) / 2 / 12;
    const heightFt = input.heightFt ?? 0;
    const ff = input.formFactor ?? 0.55;
    volumeFt3 = Math.PI * rFt ** 2 * heightFt * ff;
  }

  return { volumeFt3, weightLbs: volumeFt3 * density };
}
