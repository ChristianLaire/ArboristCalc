/**
 * Rigging section planner — proportions a whole tree into N sections from top down.
 *
 * Weight model: cone-taper volume ratios scaled to the already-computed total weight.
 * For a cone, the fraction of total volume in section k (1 = topmost) of N equal-height sections:
 *   fraction_k = (3k² - 3k + 1) / N³
 * This sums to 1 over k=1..N, so all section weights are consistent with the total.
 *
 * Diameter taper: linear from DBH at the base to 0 at the tip (conservative — real trees
 * are fuller, so actual diameters at cut points are slightly larger than estimated).
 */

export interface RiggingSection {
  sectionNumber: number;    // 1 = topmost
  cutHeightFt: number;      // lower-cut elevation from ground (0 = ground)
  sectionLengthFt: number;
  diameterAtCutIn: number;  // estimated stem diameter at the lower cut point
  weightLbs: number;
  cumWeightLbs: number;
  exceedsMax: boolean;
}

export function planRiggingSections(
  totalWeightLbs: number,
  dbhIn: number,
  heightFt: number,
  numSections: number,
  maxSectionWeightLbs: number | null,
): RiggingSection[] {
  const N = numSections;
  const L = heightFt / N;
  const sections: RiggingSection[] = [];
  let cumWeight = 0;

  for (let k = 1; k <= N; k++) {
    const fraction = (3 * k * k - 3 * k + 1) / (N * N * N);
    const weightLbs = fraction * totalWeightLbs;
    cumWeight += weightLbs;

    const cutHeightFt = Math.max(0, heightFt * (N - k) / N);
    const diameterAtCutIn = cutHeightFt <= 0
      ? dbhIn
      : dbhIn * (heightFt - cutHeightFt) / heightFt;

    sections.push({
      sectionNumber: k,
      cutHeightFt:       Math.round(cutHeightFt * 10) / 10,
      sectionLengthFt:   Math.round(L * 10) / 10,
      diameterAtCutIn:   Math.max(0, Math.round(diameterAtCutIn * 10) / 10),
      weightLbs:         Math.round(weightLbs),
      cumWeightLbs:      Math.round(cumWeight),
      exceedsMax:        maxSectionWeightLbs !== null ? weightLbs > maxSectionWeightLbs : false,
    });
  }

  return sections;
}
