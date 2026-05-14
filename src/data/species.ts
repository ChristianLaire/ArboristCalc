export interface Species {
  name: string;
  greenLbsPerFt3: number;
  airDryLbsPerFt3: number;
  kilnDryLbsPerFt3: number;
  morPsi: number; // Modulus of Rupture
}

export const SPECIES: Species[] = [
  { name: 'White Oak',        greenLbsPerFt3: 62, airDryLbsPerFt3: 47, kilnDryLbsPerFt3: 44, morPsi: 8500 },
  { name: 'Red Oak',          greenLbsPerFt3: 59, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 8000 },
  { name: 'Sugar Maple',      greenLbsPerFt3: 58, airDryLbsPerFt3: 45, kilnDryLbsPerFt3: 42, morPsi: 8600 },
  { name: 'Ash',              greenLbsPerFt3: 55, airDryLbsPerFt3: 41, kilnDryLbsPerFt3: 38, morPsi: 7400 },
  { name: 'Hickory',          greenLbsPerFt3: 63, airDryLbsPerFt3: 50, kilnDryLbsPerFt3: 47, morPsi: 12000 },
  { name: 'Walnut',           greenLbsPerFt3: 52, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 7600 },
  { name: 'Elm',              greenLbsPerFt3: 54, airDryLbsPerFt3: 39, kilnDryLbsPerFt3: 36, morPsi: 6900 },
  { name: 'White Pine',       greenLbsPerFt3: 50, airDryLbsPerFt3: 25, kilnDryLbsPerFt3: 22, morPsi: 5500 },
  { name: 'Ponderosa Pine',   greenLbsPerFt3: 51, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 6200 },
  { name: 'Eastern Red Cedar',greenLbsPerFt3: 48, airDryLbsPerFt3: 33, kilnDryLbsPerFt3: 30, morPsi: 6000 },
];

export type Condition = 'green' | 'airDry' | 'kilnDry';

export function getDensity(species: Species, condition: Condition): number {
  if (condition === 'green') return species.greenLbsPerFt3;
  if (condition === 'airDry') return species.airDryLbsPerFt3;
  return species.kilnDryLbsPerFt3;
}
