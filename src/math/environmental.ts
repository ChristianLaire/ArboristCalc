// Sources:
// Heat Index: NWS Steadman (1979) regression equation
// Frozen wood: Gerhards (1982) USDA FPL Research Paper FPL 422
// Leaf biomass: Chojnacky, Heath & Jenkins (2014) Forestry 87(1):129-151
// Daylight: Spencer (1971) solar declination + Meeus hour angle

import type { SafetyLevel } from '@/components/SafetyBadge';

// ─── Heat Index ───────────────────────────────────────────────────────────────

export interface HeatResult {
  heatIndex: number;
  displayTemp: number; // what to show — heatIndex if >= 80°F, else raw temp
  level: SafetyLevel;
  label: string;
  action: string;
}

export function calcHeatIndex(tempF: number, rhPercent: number): number {
  // NWS formula valid only for T >= 80°F
  if (tempF < 80) return tempF;
  const T = tempF;
  const R = rhPercent;
  return (
    -42.379 +
    2.04901523 * T +
    10.14333127 * R -
    0.22475541 * T * R -
    0.00683783 * T ** 2 -
    0.05481717 * R ** 2 +
    0.00122874 * T ** 2 * R +
    0.00085282 * T * R ** 2 -
    0.00000199 * T ** 2 * R ** 2
  );
}

export function assessHeat(tempF: number, rhPercent: number): HeatResult {
  const hi = calcHeatIndex(tempF, rhPercent);
  const display = tempF < 80 ? tempF : hi;

  if (display < 80) {
    return { heatIndex: hi, displayTemp: display, level: 'green', label: 'Low Risk',
      action: 'Standard precautions. Stay hydrated.' };
  }
  if (display < 91) {
    return { heatIndex: hi, displayTemp: display, level: 'green', label: 'Caution',
      action: 'Provide water, rest breaks, and shade. Monitor new workers.' };
  }
  if (display < 103) {
    return { heatIndex: hi, displayTemp: display, level: 'yellow', label: 'Extreme Caution',
      action: 'OSHA: 15 min rest/hr minimum. Buddy system. Watch for heat cramps and exhaustion.' };
  }
  if (display < 115) {
    return { heatIndex: hi, displayTemp: display, level: 'red', label: 'Danger',
      action: 'OSHA: Mandatory work-rest cycles. Reduce physical demands. Consider rescheduling.' };
  }
  return { heatIndex: hi, displayTemp: display, level: 'red', label: 'Extreme Danger',
    action: 'OSHA: Stop non-essential work. Buddy system mandatory. Medical oversight required.' };
}

// ─── Frozen Wood MOR Correction (Gerhards 1982, green/high-MC wood) ──────────
// At 28% MC (green wood), frozen wood gains up to 110% MOR at deep freeze.
// Conservative field-safe multipliers for standing green timber:

export function frozenWoodFactor(tempF: number): number {
  if (tempF >= 33) return 1.00; // unfrozen — no correction
  if (tempF >= 20)  return 1.20; // surface sapwood freezing
  if (tempF >= 0)   return 1.40; // wood column substantially frozen
  if (tempF >= -20) return 1.60;
  return 1.80;                   // deep freeze — very conservative upper bound
}

export function frozenWoodLabel(tempF: number): string {
  if (tempF >= 33) return 'No correction (above freezing)';
  if (tempF >= 20)  return `+20% MOR — surface freeze (${tempF}°F)`;
  if (tempF >= 0)   return `+40% MOR — wood column frozen (${tempF}°F)`;
  if (tempF >= -20) return `+60% MOR — deep freeze (${tempF}°F)`;
  return `+80% MOR — extreme cold (${tempF}°F)`;
}

// ─── Leaf Weight (Chojnacky et al. 2014 + peer-reviewed biomass research) ────
// Leaf biomass ≈ 1.3% of total aboveground biomass for deciduous hardwoods
// Needle biomass ≈ 0.8% for conifers (needles lighter relative to stem mass)

export function leafWeightLbs(
  treeWeightLbs: number,
  isDeciduous: boolean,
  inLeaf: boolean,
): number {
  if (!inLeaf) return 0;
  return treeWeightLbs * (isDeciduous ? 0.013 : 0.008);
}

// ─── Daylight Hours (Spencer 1971 declination + Meeus hour angle) ─────────────

export interface DaylightResult {
  sunriseLocal: string;   // "6:42 AM"
  sunsetLocal: string;    // "7:58 PM"
  daylightHours: number;
  workingHours: number;   // daylight minus 30 min each end for setup/breakdown
  polarDay: boolean;
  polarNight: boolean;
}

function formatSolarHour(h: number): string {
  const totalMin = Math.round(h * 60);
  const hrs = Math.floor(totalMin / 60) % 24;
  const mins = totalMin % 60;
  const ampm = hrs < 12 ? 'AM' : 'PM';
  const display = hrs === 0 ? 12 : hrs > 12 ? hrs - 12 : hrs;
  return `${display}:${mins.toString().padStart(2, '0')} ${ampm}`;
}

export function calcDaylight(latitudeDeg: number, dayOfYear: number): DaylightResult {
  const toRad = (d: number) => (d * Math.PI) / 180;

  // Spencer (1971) solar declination
  const gamma = (2 * Math.PI * (dayOfYear - 1)) / 365;
  const decl =
    0.006918 -
    0.399912 * Math.cos(gamma) +
    0.070257 * Math.sin(gamma) -
    0.006758 * Math.cos(2 * gamma) +
    0.000907 * Math.sin(2 * gamma) -
    0.002697 * Math.cos(3 * gamma) +
    0.00148  * Math.sin(3 * gamma);

  const lat = toRad(latitudeDeg);
  // 90.833° zenith: 90° + 0.833° for atmospheric refraction + solar disk radius
  const cosH =
    (Math.cos(toRad(90.833)) - Math.sin(lat) * Math.sin(decl)) /
    (Math.cos(lat) * Math.cos(decl));

  if (cosH <= -1) {
    return { sunriseLocal: '—', sunsetLocal: '—', daylightHours: 24, workingHours: 24, polarDay: true, polarNight: false };
  }
  if (cosH >= 1) {
    return { sunriseLocal: '—', sunsetLocal: '—', daylightHours: 0, workingHours: 0, polarDay: false, polarNight: true };
  }

  const hourAngleDeg = (Math.acos(cosH) * 180) / Math.PI;
  const daylightHours = (2 * hourAngleDeg) / 15;
  const sunriseHour = 12 - hourAngleDeg / 15;
  const sunsetHour  = 12 + hourAngleDeg / 15;

  return {
    sunriseLocal: formatSolarHour(sunriseHour),
    sunsetLocal:  formatSolarHour(sunsetHour),
    daylightHours,
    workingHours: Math.max(0, daylightHours - 1),
    polarDay: false,
    polarNight: false,
  };
}

// Day-of-year from month/day (1-based, no leap year correction needed for this precision)
export function dayOfYear(month: number, day: number): number {
  const days = [0,31,59,90,120,151,181,212,243,273,304,334];
  return days[month - 1] + day;
}
