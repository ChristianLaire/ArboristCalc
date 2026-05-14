import type { Species } from './species';

export type Region =
  | 'NE'   // New England + Mid-Atlantic (ME NH VT MA RI CT NY NJ PA MD DE WV)
  | 'SE'   // Southeast (VA NC SC GA FL AL MS TN KY AR)
  | 'MW'   // Midwest (OH IN IL MI WI MN IA MO)
  | 'SC'   // South Central (TX OK LA)
  | 'GP'   // Great Plains (ND SD NE KS)
  | 'MT'   // Mountain West (MT ID WY CO UT NV)
  | 'SW'   // Southwest (AZ NM)
  | 'PNW'  // Pacific Northwest (WA OR)
  | 'CA'   // California
  | 'AK'   // Alaska
  | 'HI';  // Hawaii

export const REGION_LABELS: Record<Region, string> = {
  NE:  'Northeast / Mid-Atlantic',
  SE:  'Southeast',
  MW:  'Midwest',
  SC:  'South Central',
  GP:  'Great Plains',
  MT:  'Mountain West',
  SW:  'Southwest',
  PNW: 'Pacific Northwest',
  CA:  'California',
  AK:  'Alaska',
  HI:  'Hawaii',
};

export const STATE_TO_REGION: Record<string, Region> = {
  // Northeast & Mid-Atlantic
  ME: 'NE', NH: 'NE', VT: 'NE', MA: 'NE', RI: 'NE', CT: 'NE',
  NY: 'NE', NJ: 'NE', PA: 'NE', MD: 'NE', DE: 'NE', WV: 'NE',
  // Southeast
  VA: 'SE', NC: 'SE', SC: 'SE', GA: 'SE', FL: 'SE',
  AL: 'SE', MS: 'SE', TN: 'SE', KY: 'SE', AR: 'SE',
  // Midwest
  OH: 'MW', IN: 'MW', IL: 'MW', MI: 'MW',
  WI: 'MW', MN: 'MW', IA: 'MW', MO: 'MW',
  // South Central
  TX: 'SC', OK: 'SC', LA: 'SC',
  // Great Plains
  ND: 'GP', SD: 'GP', NE: 'GP', KS: 'GP',
  // Mountain West
  MT: 'MT', ID: 'MT', WY: 'MT', CO: 'MT', UT: 'MT', NV: 'MT',
  // Southwest
  AZ: 'SW', NM: 'SW',
  // Pacific Northwest
  WA: 'PNW', OR: 'PNW',
  // California
  CA: 'CA',
  // Alaska
  AK: 'AK',
  // Hawaii
  HI: 'HI',
};

// Native / commonly encountered range per species.
// Sources: USDA PLANTS Database, Burns & Honkala Silvics of North America (1990),
// Elias Trees of North America, Little Forest Atlas of the US.
export const SPECIES_REGIONS: Record<string, Region[]> = {

  // ── Oaks: White Oak Group ──────────────────────────────────────────
  'White Oak':        ['NE', 'SE', 'MW', 'SC'],
  'Bur Oak':          ['NE', 'SE', 'MW', 'SC', 'GP'],
  'Chestnut Oak':     ['NE', 'SE'],
  'Post Oak':         ['NE', 'SE', 'MW', 'SC', 'GP'],
  'Swamp White Oak':  ['NE', 'SE', 'MW'],
  'Overcup Oak':      ['SE', 'SC'],
  'Oregon White Oak': ['PNW'],
  'Gambel Oak':       ['MT', 'SW'],

  // ── Oaks: Red Oak Group ───────────────────────────────────────────
  'Northern Red Oak': ['NE', 'SE', 'MW'],
  'Pin Oak':          ['NE', 'SE', 'MW'],
  'Scarlet Oak':      ['NE', 'SE'],
  'Black Oak':        ['NE', 'SE', 'MW'],
  'Water Oak':        ['SE', 'SC'],
  'Willow Oak':       ['SE', 'SC'],
  'Shumard Oak':      ['SE', 'SC', 'MW'],
  'Cherrybark Oak':   ['SE', 'SC'],
  'Nuttall Oak':      ['SE', 'SC'],

  // ── Oaks: Western & Evergreen ────────────────────────────────────
  'Live Oak':            ['SE', 'SC'],
  'California Black Oak': ['CA'],
  'Canyon Live Oak':     ['CA', 'SW', 'PNW'],
  'Valley Oak':          ['CA'],
  'Tanoak':              ['CA', 'PNW'],

  // ── Maples ───────────────────────────────────────────────────────
  'Sugar Maple':   ['NE', 'SE', 'MW'],
  'Red Maple':     ['NE', 'SE', 'MW', 'SC'],
  'Silver Maple':  ['NE', 'SE', 'MW'],
  'Black Maple':   ['NE', 'MW'],
  'Bigleaf Maple': ['PNW', 'CA'],
  'Box Elder':     ['NE', 'SE', 'MW', 'SC', 'GP', 'MT', 'SW'],
  'Norway Maple':  ['NE'],

  // ── Hickories ────────────────────────────────────────────────────
  'Shagbark Hickory':  ['NE', 'SE', 'MW'],
  'Shellbark Hickory': ['NE', 'SE', 'MW'],
  'Mockernut Hickory': ['NE', 'SE', 'MW'],
  'Pignut Hickory':    ['NE', 'SE', 'MW'],
  'Bitternut Hickory': ['NE', 'SE', 'MW'],
  'Water Hickory':     ['SE', 'SC'],
  'Pecan':             ['SE', 'SC'],

  // ── Ashes ────────────────────────────────────────────────────────
  'White Ash':  ['NE', 'SE', 'MW'],
  'Green Ash':  ['NE', 'SE', 'MW', 'SC', 'GP'],
  'Black Ash':  ['NE', 'MW'],
  'Blue Ash':   ['NE', 'SE', 'MW'],
  'Oregon Ash': ['PNW'],

  // ── Birches ───────────────────────────────────────────────────────
  'Yellow Birch': ['NE', 'SE', 'MW'],
  'Sweet Birch':  ['NE', 'SE'],
  'Paper Birch':  ['NE', 'MW', 'AK'],
  'River Birch':  ['NE', 'SE', 'MW'],
  'Gray Birch':   ['NE'],

  // ── Hornbeams & Hophornbeam ──────────────────────────────────────
  'American Hornbeam':   ['NE', 'SE', 'MW'],
  'Eastern Hophornbeam': ['NE', 'SE', 'MW'],

  // ── Locusts ───────────────────────────────────────────────────────
  'Black Locust':      ['NE', 'SE', 'MW'],
  'Honey Locust':      ['NE', 'SE', 'MW', 'SC'],
  'Kentucky Coffeetree': ['NE', 'SE', 'MW'],

  // ── Beech & Chestnut ─────────────────────────────────────────────
  'American Beech':    ['NE', 'SE', 'MW'],
  'American Chestnut': ['NE', 'SE'],

  // ── Walnuts & Cherry ─────────────────────────────────────────────
  'Black Walnut': ['NE', 'SE', 'MW'],
  'Black Cherry': ['NE', 'SE', 'MW'],
  'Butternut':    ['NE', 'SE', 'MW'],

  // ── Elms & Hackberry ─────────────────────────────────────────────
  'American Elm': ['NE', 'SE', 'MW', 'SC', 'GP'],
  'Slippery Elm': ['NE', 'SE', 'MW'],
  'Rock Elm':     ['NE', 'MW'],
  'Winged Elm':   ['SE'],
  'Hackberry':    ['NE', 'SE', 'MW', 'SC', 'GP'],

  // ── Poplars & Aspens ─────────────────────────────────────────────
  'Quaking Aspen':    ['NE', 'MW', 'MT', 'GP', 'PNW', 'CA', 'AK'],
  'Bigtooth Aspen':   ['NE', 'MW'],
  'Eastern Cottonwood': ['NE', 'SE', 'MW', 'SC', 'GP'],
  'Black Cottonwood': ['PNW', 'MT', 'CA', 'AK'],

  // ── Magnolias ────────────────────────────────────────────────────
  'Southern Magnolia': ['SE', 'SC'],
  'Cucumber Tree':     ['SE', 'NE'],
  'Yellow Poplar':     ['NE', 'SE', 'MW'],

  // ── Willows ───────────────────────────────────────────────────────
  'Black Willow': ['NE', 'SE', 'MW', 'SC', 'GP'],

  // ── Misc Hardwoods ───────────────────────────────────────────────
  'Osage Orange':      ['SC', 'SE', 'MW'],
  'Sweetgum':          ['SE', 'SC', 'NE'],
  'American Sycamore': ['NE', 'SE', 'MW', 'SC'],
  'American Basswood': ['NE', 'SE', 'MW'],
  'Black Tupelo':      ['NE', 'SE', 'MW', 'SC'],
  'Persimmon':         ['SE', 'SC', 'NE', 'MW'],
  'Sassafras':         ['NE', 'SE', 'MW'],
  'Northern Catalpa':  ['NE', 'SE', 'MW', 'SC'],
  'American Holly':    ['NE', 'SE'],
  'Red Alder':         ['PNW', 'CA'],
  'Yellow Buckeye':    ['SE', 'NE'],

  // ── Pines: Eastern & Southern ────────────────────────────────────
  'Eastern White Pine': ['NE', 'SE', 'MW'],
  'Red Pine':           ['NE', 'MW'],
  'Loblolly Pine':      ['SE', 'SC'],
  'Longleaf Pine':      ['SE', 'SC'],
  'Slash Pine':         ['SE', 'SC'],
  'Shortleaf Pine':     ['SE', 'SC', 'NE', 'MW'],
  'Virginia Pine':      ['SE', 'NE'],
  'Pitch Pine':         ['NE', 'SE'],
  'Jack Pine':          ['NE', 'MW'],

  // ── Pines: Western ────────────────────────────────────────────────
  'Ponderosa Pine':   ['MT', 'SW', 'PNW', 'CA'],
  'Lodgepole Pine':   ['MT', 'PNW', 'CA', 'AK'],
  'Jeffrey Pine':     ['CA', 'MT'],
  'Sugar Pine':       ['CA', 'PNW'],
  'Western White Pine': ['PNW', 'MT', 'CA'],
  'Pinyon Pine':      ['SW', 'MT'],

  // ── Spruces ───────────────────────────────────────────────────────
  'Sitka Spruce':     ['PNW', 'AK'],
  'White Spruce':     ['NE', 'MW', 'AK'],
  'Red Spruce':       ['NE'],
  'Black Spruce':     ['NE', 'MW', 'AK'],
  'Blue Spruce':      ['MT', 'SW'],
  'Engelmann Spruce': ['MT', 'PNW'],
  'Norway Spruce':    ['NE'],

  // ── True Firs ─────────────────────────────────────────────────────
  'Balsam Fir':      ['NE', 'MW'],
  'White Fir':       ['CA', 'PNW', 'MT', 'SW'],
  'Grand Fir':       ['PNW', 'MT'],
  'Red Fir':         ['CA'],
  'Noble Fir':       ['PNW'],
  'Subalpine Fir':   ['MT', 'PNW', 'AK'],
  'Pacific Silver Fir': ['PNW'],

  // ── Douglas-Fir & Hemlock ────────────────────────────────────────
  'Douglas Fir':      ['PNW', 'MT', 'CA'],
  'Eastern Hemlock':  ['NE', 'SE', 'MW'],
  'Western Hemlock':  ['PNW', 'AK'],
  'Mountain Hemlock': ['PNW', 'AK', 'MT'],

  // ── Larches ───────────────────────────────────────────────────────
  'Western Larch': ['MT', 'PNW'],
  'Tamarack':      ['NE', 'MW', 'AK'],

  // ── Cedars & Cypress ─────────────────────────────────────────────
  'Western Red Cedar':    ['PNW', 'MT', 'AK'],
  'Northern White Cedar': ['NE', 'MW'],
  'Eastern Red Cedar':    ['NE', 'SE', 'MW', 'SC', 'GP'],
  'Incense Cedar':        ['CA', 'PNW'],
  'Alaska Yellow Cedar':  ['PNW', 'AK'],
  'Port Orford Cedar':    ['PNW'],
  'Atlantic White Cedar': ['NE', 'SE'],
  'Bald Cypress':         ['SE', 'SC'],

  // ── Redwoods & Sequoias ───────────────────────────────────────────
  'Coast Redwood': ['CA'],
  'Giant Sequoia': ['CA'],
};

export function getRegionLabel(region: Region): string {
  return REGION_LABELS[region];
}

export function getSpeciesForRegion(region: Region, allSpecies: Species[]): Species[] {
  return allSpecies.filter(s => {
    const regions = SPECIES_REGIONS[s.name];
    return regions ? regions.includes(region) : true;
  });
}
