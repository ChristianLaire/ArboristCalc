import type { SafetyLevel } from '@/components/SafetyBadge';

export interface RiggingInput {
  staticLoadLbs: number;
  impactFactor: number;  // default 2.0
  ropeAngleDeg: number;  // included angle at redirect block
  wllLbs: number;
}

export interface RiggingResult {
  dynamicLoadLbs: number;
  blockForceLbs: number;
  sparLoadLbs: number;
  percentWll: number;
  level: SafetyLevel;
  message: string;
}

export function calcRigging(input: RiggingInput): RiggingResult {
  const dynamicLoadLbs = input.staticLoadLbs * input.impactFactor;
  const angleRad = (input.ropeAngleDeg * Math.PI) / 180;
  const blockForceLbs = 2 * dynamicLoadLbs * Math.cos(angleRad / 2);
  const sparLoadLbs = dynamicLoadLbs + blockForceLbs;
  const percentWll = (dynamicLoadLbs / input.wllLbs) * 100;

  let level: SafetyLevel;
  let message: string;
  if (percentWll < 50) {
    level = 'green';
    message = `Within safe range (${percentWll.toFixed(0)}% of WLL)`;
  } else if (percentWll <= 80) {
    level = 'yellow';
    message = `Caution — approaching limit (${percentWll.toFixed(0)}% of WLL)`;
  } else {
    level = 'red';
    message = `EXCEEDS SAFE WORKING LIMIT (${percentWll.toFixed(0)}% of WLL)`;
  }

  return { dynamicLoadLbs, blockForceLbs, sparLoadLbs, percentWll, level, message };
}
