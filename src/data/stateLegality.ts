// Arborist regulatory reference data for all 50 US states + DC.
// Sources: OSHA state plan designations (osha.gov/stateplans), ANSI Z133-2017,
// individual state licensing board statutes, Cal/OSHA Title 8, OR-OSHA OAR 437,
// WA L&I WAC 296, and state arborist/landscape licensing acts.
//
// IMPORTANT: This data is for field reference only. Always verify current
// requirements with the applicable state agency before beginning work.
// Regulations change. This is not legal advice.

export type OSHAType =
  | 'federal'              // Federal OSHA enforces (29 CFR 1910 / 1926)
  | 'state-plan'           // State-approved plan covers private + public sector
  | 'state-plan-public';   // State plan covers public sector only; private = federal OSHA

export interface StateLegal {
  code: string;
  name: string;
  oshaType: OSHAType;
  primaryRef: string;         // Primary tree-care / rigging regulatory citation
  licenseRequired: boolean;   // Statewide license required for commercial arborist work
  licenseRef?: string;        // Enabling statute citation
  licenseNote?: string;       // What exactly is required
  // ANSI Z133-2017 baseline SFs — same in every state for arboricultural operations:
  //   sfRigging = 3 (general rigging lines and hardware per §6.5)
  //   sfLifeSafety = 5 (any connection supporting a climber per §6.5)
  //   sfClimbing = 10 (personal protective equipment / climbing lines per §6.5)
  // Noted separately only where a state imposes a higher value.
  sfRiggingOverride?: number;
  sfLifeSafetyOverride?: number;
  notes: string[];
}

// ANSI Z133-2017 national baseline — applies in all states as the industry standard.
export const ANSI_Z133 = {
  sfRigging: 3,
  sfLifeSafety: 5,
  sfClimbing: 10,
  ref: 'ANSI Z133-2017 §6.5',
};

export const STATE_LEGAL: Record<string, StateLegal> = {

  // ── Federal OSHA states ─────────────────────────────────────────────

  AL: {
    code: 'AL', name: 'Alabama', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license — ISA Certified Arborist widely accepted by clients.',
      'Federal OSHA enforces. Report injuries to OSHA Region 4 (Atlanta).',
    ],
  },

  AR: {
    code: 'AR', name: 'Arkansas', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license required.',
      'Federal OSHA enforces. Contractor license may be required by county.',
    ],
  },

  CO: {
    code: 'CO', name: 'Colorado', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license. Denver requires a city arborist license.',
      'Federal OSHA enforces. High-altitude and wildland-interface work — additional fire protocols apply.',
    ],
  },

  DC: {
    code: 'DC', name: 'District of Columbia', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Federal OSHA enforces DC workplaces.',
      'Work on public trees: DC Urban Forestry Division permit required.',
      'ISA Certified Arborist required for DC government tree contracts.',
    ],
  },

  DE: {
    code: 'DE', name: 'Delaware', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Pesticide applicator license required for tree spraying (DAPA).',
    ],
  },

  FL: {
    code: 'FL', name: 'Florida', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license for tree removal/trimming.',
      'Work within 10 ft of energized utility lines: Chapter 553 Florida Power Act clearances required.',
      'Many municipalities (Miami-Dade, Broward, etc.) require ISA Certified Arborist.',
      'Post-hurricane work surge: verify contractor license for large-scale operations.',
    ],
  },

  GA: {
    code: 'GA', name: 'Georgia', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces. OSHA Region 4 (Atlanta) covers GA.',
      'Low-voltage line clearance: Georgia Power Encroachment Policy applies.',
    ],
  },

  ID: {
    code: 'ID', name: 'Idaho', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces.',
      'Wildland-urban interface work: NWCG / NIFC protocols may apply in fire season.',
    ],
  },

  KS: {
    code: 'KS', name: 'Kansas', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces.',
    ],
  },

  LA: {
    code: 'LA', name: 'Louisiana', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: true,
    licenseRef: 'LSA-RS 37:3251 (Horticulture Commission)',
    licenseNote: 'Commercial landscape and tree care: Louisiana Horticulture Commission license required. ISA Certified Arborist credential accepted toward licensing exam.',
    notes: [
      'License administered by the Louisiana Horticulture Commission.',
      'Federal OSHA enforces. OSHA Region 6 (Dallas) covers LA.',
      'Post-hurricane debris operations: FEMA/state contractor registration required.',
    ],
  },

  MA: {
    code: 'MA', name: 'Massachusetts', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license. Many municipalities (Boston, Cambridge) require ISA cert.',
      'Federal OSHA enforces.',
      'DPU electrical clearance rules apply within 10 ft of energized lines.',
    ],
  },

  MO: {
    code: 'MO', name: 'Missouri', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces. Some municipalities require ISA certification.',
    ],
  },

  MS: {
    code: 'MS', name: 'Mississippi', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces.',
    ],
  },

  MT: {
    code: 'MT', name: 'Montana', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces.',
      'High-altitude and wildland-interface work: NWCG protocols apply in fire season.',
      'MCA 50-71 (Workers Compensation) covers tree work injuries.',
    ],
  },

  ND: {
    code: 'ND', name: 'North Dakota', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces (ND operates federal OSHA).',
    ],
  },

  NE: {
    code: 'NE', name: 'Nebraska', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces. Lincoln and Omaha may require ISA cert for city contracts.',
    ],
  },

  NH: {
    code: 'NH', name: 'New Hampshire', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces.',
      'NH RSA Title XIX Forestry Chapter 227 covers logging adjacent operations.',
    ],
  },

  OH: {
    code: 'OH', name: 'Ohio', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces.',
      'Some municipalities (Columbus, Cleveland) require ISA cert for city tree work.',
    ],
  },

  OK: {
    code: 'OK', name: 'Oklahoma', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces.',
    ],
  },

  PA: {
    code: 'PA', name: 'Pennsylvania', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license. Home Improvement Contractor registration required for residential work.',
      'Federal OSHA enforces.',
      'PECO / utility line clearance: Pennsylvania PUC clearance rules apply.',
    ],
  },

  RI: {
    code: 'RI', name: 'Rhode Island', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license. General contractor license required for commercial work.',
      'Federal OSHA enforces.',
    ],
  },

  SD: {
    code: 'SD', name: 'South Dakota', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces.',
    ],
  },

  TX: {
    code: 'TX', name: 'Texas', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license. Austin, Dallas, and other cities require ISA cert for city work.',
      'Federal OSHA enforces. OSHA Region 6 (Dallas).',
      'Electrical hazard clearances: Texas PUC Chapter 25 clearance distances apply.',
      'Pesticide applicator license: Texas Dept. of Agriculture required for chemical application.',
    ],
  },

  WI: {
    code: 'WI', name: 'Wisconsin', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces. Madison and Milwaukee may require ISA cert for city contracts.',
    ],
  },

  WV: {
    code: 'WV', name: 'West Virginia', oshaType: 'federal',
    primaryRef: '29 CFR 1910.184 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'No statewide arborist license.',
      'Federal OSHA enforces.',
    ],
  },

  // ── Full State Plan states ──────────────────────────────────────────

  AK: {
    code: 'AK', name: 'Alaska', oshaType: 'state-plan',
    primaryRef: 'AKOSH 8 AAC 61 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Alaska OSHA (AKOSH) enforces under 8 AAC 61. Must be at least as strict as federal OSHA.',
      'No statewide arborist license. General contractor license may be required (AS 08.18).',
      'Extreme cold: wood strength gains apply (Gerhards 1982) — see Anchor tab temperature correction.',
      'Wildfire risk: DNR Division of Forestry seasonal work restrictions may apply.',
    ],
  },

  AZ: {
    code: 'AZ', name: 'Arizona', oshaType: 'state-plan',
    primaryRef: 'ADOSH 23-406 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Arizona Division of Occupational Safety and Health (ADOSH) enforces under ARS 23-406.',
      'No statewide arborist license. Contractor license (ROC) required for commercial work over $1,000.',
      'High-heat: ADOSH Heat Illness Prevention rule (ARS 23-1021) — monitoring required above 95°F.',
      'Work near electrical lines: APS / SRP clearance distances apply.',
    ],
  },

  CA: {
    code: 'CA', name: 'California', oshaType: 'state-plan',
    primaryRef: 'Cal/OSHA Title 8 §3423 / CCR Title 8 §5003 / ANSI Z133-2017',
    licenseRequired: false,
    sfRiggingOverride: 5,
    licenseNote: 'No state arborist license, but C-27 Landscaping Contractor license (CSLB) required for commercial tree work over $500. Many cities and utilities require ISA Certified Arborist.',
    notes: [
      'Cal/OSHA Title 8 §3423: Tree Trimming Operations — requires written IIPP, daily equipment inspection logs.',
      'Cal/OSHA Title 8 §5003: Rigging equipment minimum 5:1 SF for hardware (more stringent than federal 3:1 for general rigging).',
      'C-27 Landscaping Contractor license (CSLB) required for commercial work over $500 (BPC §7026).',
      'Work within 10 ft of energized lines: CPUC General Order 95 clearances — utility approach distances strictly enforced.',
      'Cal/OSHA Outdoor Heat Illness Prevention: mandatory monitoring, rest, shade, and water protocols above 80°F (§3395).',
      'ISA QAL (Qualified Arborist List) required for Cal Fire and some CalTrans contracts.',
      'San Francisco, LA, San Diego, Oakland all have additional municipal tree ordinances.',
    ],
  },

  HI: {
    code: 'HI', name: 'Hawaii', oshaType: 'state-plan',
    primaryRef: 'HIOSH HAR Chapter 12-110 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Hawaii OSHA (HIOSH) enforces under HAR Chapter 12-110.',
      'No statewide arborist license. General contractor license required (HRS Chapter 444).',
      'Tropical species not covered by ANSI Z133 — use conservative SF when data is unavailable.',
      'HIOSH has same minimum SFs as federal OSHA for rigging.',
    ],
  },

  IN: {
    code: 'IN', name: 'Indiana', oshaType: 'state-plan',
    primaryRef: 'Indiana OSHA IC 22-8-1 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Indiana OSHA enforces under IC 22-8-1.',
      'No statewide arborist license. Some municipalities require ISA cert.',
      'Rigging SFs: same as federal baseline per ANSI Z133.',
    ],
  },

  IA: {
    code: 'IA', name: 'Iowa', oshaType: 'state-plan',
    primaryRef: 'Iowa OSHA Chapter 88 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Iowa OSHA enforces under Iowa Code Chapter 88.',
      'No statewide arborist license.',
      'Contractor registration required for commercial work exceeding $2,000.',
    ],
  },

  KY: {
    code: 'KY', name: 'Kentucky', oshaType: 'state-plan',
    primaryRef: 'Kentucky OSH KRS 338 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Kentucky OSHA enforces under KRS Chapter 338.',
      'No statewide arborist license.',
      'Rigging SFs: ANSI Z133 baseline applies.',
    ],
  },

  MD: {
    code: 'MD', name: 'Maryland', oshaType: 'state-plan',
    primaryRef: 'MD OSHA COMAR 09.12 / ANSI Z133-2017',
    licenseRequired: true,
    licenseRef: 'Agriculture Article §8-801 through §8-815',
    licenseNote: 'Maryland Tree Expert License required for commercial tree care, removal, and trimming. Must pass MD state exam OR hold ISA Certified Arborist + 3 years documented experience. Administered by MD Dept. of Agriculture.',
    notes: [
      'Maryland OSHA enforces under COMAR 09.12.',
      'Maryland Tree Expert License (Ag. Art. §8-801): one of the strongest state arborist licensing laws in the US.',
      'ISA Certified Arborist credential accepted as evidence of competency toward licensing.',
      'BGE / utility line clearance: MD PSC clearance requirements apply.',
      'Baltimore City has additional municipal tree removal permit requirements.',
    ],
  },

  MI: {
    code: 'MI', name: 'Michigan', oshaType: 'state-plan',
    primaryRef: 'MIOSHA Pt 1 R 408.10101 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Michigan OSHA (MIOSHA) enforces under R 408.10101 (General Industry) and R 408.40001 (Construction).',
      'No statewide arborist license. Residential Builder license may be required for combined services.',
      'MIOSHA Landscape and Grounds Maintenance standard covers tree care operations.',
    ],
  },

  MN: {
    code: 'MN', name: 'Minnesota', oshaType: 'state-plan',
    primaryRef: 'MN OSHA MN Statutes Ch. 182 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Minnesota OSHA enforces under MN Statutes Chapter 182.',
      'No statewide arborist license. Minneapolis, St. Paul, and many suburbs require ISA cert.',
      'Emerald Ash Borer (EAB) regulations: MDA quarantine rules affect ash tree disposal and movement.',
    ],
  },

  NV: {
    code: 'NV', name: 'Nevada', oshaType: 'state-plan',
    primaryRef: 'NV OSHA NRS 618 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Nevada OSHA enforces under NRS Chapter 618.',
      'No statewide arborist license. Contractor license (C-10 Landscape) required for commercial work.',
      'Extreme heat: NV OSHA Heat Illness Prevention standard applies above 90°F.',
    ],
  },

  NM: {
    code: 'NM', name: 'New Mexico', oshaType: 'state-plan',
    primaryRef: 'NM OSHA NMAC 11.5 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'New Mexico OSHA enforces under NMAC 11.5.',
      'No statewide arborist license. Contractor license required (Construction Industries Division).',
      'High-altitude and arid-climate species: some data gaps — use conservative SFs.',
    ],
  },

  NC: {
    code: 'NC', name: 'North Carolina', oshaType: 'state-plan',
    primaryRef: 'NC OSHA NC GS 95 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'NC OSHA enforces under NC GS Chapter 95.',
      'No statewide arborist license. Landscape Contractor license (NCNLGPA) may apply.',
      'Utility line clearances: Duke Energy / Dominion NC clearance policies apply.',
      'Hurricane season: additional post-storm tree emergency regulations may be enacted.',
    ],
  },

  OR: {
    code: 'OR', name: 'Oregon', oshaType: 'state-plan',
    primaryRef: 'OR-OSHA OAR 437-002-0161 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Oregon OSHA enforces dedicated Tree Trimming rule OAR 437-002-0161 — one of the most specific state tree care rules in the US.',
      'OAR 437-002-0161: personal fall arrest required when working above 4 feet (stricter than some states).',
      'Equipment must be inspected before each shift; inspection records kept on site.',
      'No statewide arborist license. CCB (Construction Contractors Board) license required for commercial work.',
      'Logging rules (OAR 437-007) may also apply if classified as logging operations.',
    ],
  },

  SC: {
    code: 'SC', name: 'South Carolina', oshaType: 'state-plan',
    primaryRef: 'SC OSHA SC Code 41-15 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'SC OSHA enforces under SC Code §41-15.',
      'No statewide arborist license. General contractor or specialty contractor license required.',
      'Coastal areas: hurricane preparedness and post-storm emergency tree operations may be regulated separately.',
    ],
  },

  TN: {
    code: 'TN', name: 'Tennessee', oshaType: 'state-plan',
    primaryRef: 'TN OSHA TCA 50-3-101 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Tennessee OSHA enforces under TCA 50-3-101.',
      'No statewide arborist license. Contractor license (Home Improvement) may be required.',
      'TVA utility line clearances: Tennessee Valley Authority has specific vegetation management rules near transmission lines.',
    ],
  },

  UT: {
    code: 'UT', name: 'Utah', oshaType: 'state-plan',
    primaryRef: 'UT OSHA UCA 34A-6 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Utah OSHA enforces under UCA 34A-6.',
      'No statewide arborist license. General building contractor license (DOPL) may be required.',
      'High-altitude: elevation affects species selection and wood properties — verify data for mountain species.',
      'Air quality: Utah DAQ restrictions may affect equipment use during inversion periods.',
    ],
  },

  VT: {
    code: 'VT', name: 'Vermont', oshaType: 'state-plan',
    primaryRef: 'VT OSHA VSA Title 21 Ch. 3 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Vermont OSHA enforces under Vermont Statutes Annotated Title 21.',
      'No statewide arborist license.',
      'Vermont Act 250: large-scale clearing operations may require land use permits.',
      'Emerald Ash Borer quarantine: VT ANR regulations on ash movement.',
    ],
  },

  VA: {
    code: 'VA', name: 'Virginia', oshaType: 'state-plan',
    primaryRef: 'VOSH 40.1-49 / ANSI Z133-2017',
    licenseRequired: true,
    licenseRef: 'Code of Virginia §54.1-1100 (DPOR)',
    licenseNote: 'Virginia Landscape Contractor or Landscape Service Contracting license required (DPOR). Arborist work falls under Class A or B Contractor license for commercial operations. ISA Certified Arborist credential widely required by Virginia localities.',
    notes: [
      'Virginia OSHA (VOSH) enforces under Code of VA §40.1-49.',
      'DPOR Class A/B/C contractor license required; arborist work classified under Landscape Service Contracting.',
      'ISA Certified Arborist required by Fairfax County, Arlington, and other Northern VA jurisdictions.',
      'Dominion Energy clearance zones: strict separation distances near transmission lines.',
      'VA urban forestry: Richmond, VA Beach, Alexandria have tree ordinances with permit requirements.',
    ],
  },

  WA: {
    code: 'WA', name: 'Washington', oshaType: 'state-plan',
    primaryRef: 'WA L&I WAC 296-155 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Washington L&I enforces under WAC 296-155 (Construction safety) or WAC 296-54 (Logging — may apply if classified as logging).',
      'No state arborist license. Contractor registration (L&I) required for all commercial tree work.',
      'WAC 296-54: If tree removal is classified as logging operations, logging-specific rules apply (higher documentation requirements).',
      'Seattle, Bellevue, and King County have significant tree ordinances — permit required for removal of certain diameter trees.',
      'Puget Sound Energy and PSE clearance distances: Washington UTC regulations on utility line proximity.',
    ],
  },

  WY: {
    code: 'WY', name: 'Wyoming', oshaType: 'state-plan',
    primaryRef: 'WY OSHA WS 27-11 / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Wyoming OSHA enforces under Wyoming Statutes 27-11.',
      'No statewide arborist license.',
      'High-altitude and extreme cold: wood strength correction applies — see Anchor tab temperature correction.',
    ],
  },

  // ── State Plan (Public Sector Only) states ─────────────────────────

  CT: {
    code: 'CT', name: 'Connecticut', oshaType: 'state-plan-public',
    primaryRef: '29 CFR 1910.184 (private) / CGS §23-61p (license) / ANSI Z133-2017',
    licenseRequired: true,
    licenseRef: 'Connecticut General Statutes §23-61p through §23-61t',
    licenseNote: 'Connecticut Arborist License required for commercial tree care. Must pass state arborist examination (CT DEEP administers). Annual renewal; CE required. CT has one of the oldest state arborist licensing programs in the US.',
    notes: [
      'Private sector: federal OSHA enforces (29 CFR 1910). Public sector: CT OSHA plan enforces.',
      'CT Arborist License (CGS §23-61p): required for any commercial arborist work for compensation.',
      'Pesticide applicator certification (CT DEEP) required for tree chemical applications.',
      'Eversource / UI utility clearances: CT PURA sets minimum approach distances.',
      'CT Tree Warden: municipalities appoint a tree warden with authority over public trees.',
    ],
  },

  IL: {
    code: 'IL', name: 'Illinois', oshaType: 'state-plan-public',
    primaryRef: '29 CFR 1910.184 (private) / 225 ILCS 715 (license) / ANSI Z133-2017',
    licenseRequired: true,
    licenseRef: '225 ILCS 715 — Illinois Arborist Licensing Act',
    licenseNote: 'Illinois Arborist License required for commercial tree trimming and removal. Must hold ISA Certified Arborist credential OR pass state licensing exam (IL Dept. of Financial & Professional Regulation). Annual renewal required.',
    notes: [
      'Private sector: federal OSHA enforces. Public sector: IL DOL state plan enforces.',
      'Illinois Arborist Licensing Act (225 ILCS 715): strong statewide licensing requirement.',
      'Chicago and suburbs have additional municipal tree ordinances.',
      'Emerald Ash Borer: Illinois Department of Agriculture quarantine rules affect wood movement.',
      'ComEd / Ameren utility clearances: ICC General Order requires minimum approach distances.',
    ],
  },

  ME: {
    code: 'ME', name: 'Maine', oshaType: 'state-plan-public',
    primaryRef: '29 CFR 1910.184 (private) / ANSI Z133-2017',
    licenseRequired: false,
    notes: [
      'Private sector: federal OSHA enforces. Public sector: Maine OSHA plan enforces.',
      'No statewide arborist license. Contractor license may be required for larger projects.',
      'Maine forestry regulations (MFRA) may apply for operations near classified waterways.',
      'Emerald Ash Borer: MFS quarantine rules on ash transport.',
    ],
  },

  NJ: {
    code: 'NJ', name: 'New Jersey', oshaType: 'state-plan-public',
    primaryRef: '29 CFR 1910.184 (private) / NJSA 13:1L-22 (license) / ANSI Z133-2017',
    licenseRequired: true,
    licenseRef: 'NJSA 13:1L-22 (Board of Tree Experts)',
    licenseNote: 'New Jersey Tree Expert License required for commercial tree care. NJ Board of Tree Experts administers. Must pass NJ state exam or hold ISA Certified Arborist with qualifying experience. New Jersey has had tree expert licensing since 1940.',
    notes: [
      'Private sector: federal OSHA enforces. Public sector: NJ DOL state plan enforces.',
      'NJ Tree Expert License (NJSA 13:1L-22): one of the oldest arborist licensing laws in the US (1940).',
      'PSE&G / JCP&L / Atlantic City Electric utility clearances: BPU rules set minimum distances.',
      'NJ tree removal permits: many municipalities require permits for trees of specified DBH.',
      'Spotted Lanternfly: NJ quarantine regulations restrict movement of wood/plant material.',
    ],
  },

  NY: {
    code: 'NY', name: 'New York', oshaType: 'state-plan-public',
    primaryRef: '29 CFR 1910.184 (private) / ANSI Z133-2017',
    licenseRequired: false,
    licenseNote: 'No statewide license, but New York City requires a separate NYC Department of Parks Arborist License (Title 56, NYC Admin. Code) for work on street trees.',
    notes: [
      'Private sector: federal OSHA enforces. Public sector: NY DOSH state plan enforces.',
      'No statewide arborist license, but NYC requires NYC DPR arborist license for street tree work.',
      'New York DEC regulates tree removal in certain sensitive areas (wetlands, floodplains).',
      'Utility clearances: Con Edison / National Grid — NYPSC clearance distances.',
      'NYC Trees: NYC Urban Forest Canopy regulations — specific permit requirements for private property trees of certain size in some boroughs.',
    ],
  },
};

// Helper function to look up state legal info
export function getStateLegal(stateCode: string): StateLegal | null {
  return STATE_LEGAL[stateCode] ?? null;
}

// Effective SFs for a given state (falls back to ANSI Z133 baseline)
export function getEffectiveSFs(stateCode: string): { sfRigging: number; sfLifeSafety: number; sfClimbing: number } {
  const s = STATE_LEGAL[stateCode];
  return {
    sfRigging:     s?.sfRiggingOverride     ?? ANSI_Z133.sfRigging,
    sfLifeSafety:  s?.sfLifeSafetyOverride  ?? ANSI_Z133.sfLifeSafety,
    sfClimbing:    ANSI_Z133.sfClimbing,
  };
}
