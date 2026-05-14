// All density and MOR values sourced from USDA Forest Products Laboratory
// Wood Handbook (2021 edition), Table 4-3.
// Green MOR is used for anchor calculations — conservative and appropriate
// for evaluating living trees in the field.

export type Category = 'Hardwood' | 'Softwood';

export interface Species {
  name: string;
  category: Category;
  greenLbsPerFt3: number;
  airDryLbsPerFt3: number;
  kilnDryLbsPerFt3: number;
  morPsi: number; // Green MOR (psi) — USDA Wood Handbook Table 4-3
  notes?: string;
}

export const SPECIES: Species[] = [
  // ── HARDWOODS ────────────────────────────────────────────────────────────

  // Oaks
  { name: 'White Oak',       category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 47, kilnDryLbsPerFt3: 44, morPsi: 7400,
    notes: 'Premium tie-in wood. Ring-porous; resists decay. Common urban canopy tree.' },
  { name: 'Northern Red Oak',category: 'Hardwood', greenLbsPerFt3: 59, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 6800,
    notes: 'Fast-growing. Weaker than White Oak but still excellent for rigging.' },
  { name: 'Bur Oak',         category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 7200,
    notes: 'Extremely fire- and drought-resistant. Thick, corky bark. Great Plains staple.' },
  { name: 'Chestnut Oak',    category: 'Hardwood', greenLbsPerFt3: 63, airDryLbsPerFt3: 47, kilnDryLbsPerFt3: 44, morPsi: 8300,
    notes: 'Heaviest of the white oak group. Deeply furrowed bark; common on rocky slopes.' },
  { name: 'Pin Oak',         category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 7000,
    notes: 'Very common urban street tree. Persistent dead branches (pin-like) are a hazard ID cue.' },
  { name: 'Scarlet Oak',     category: 'Hardwood', greenLbsPerFt3: 60, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 7900,
    notes: 'Brilliant fall color. Deep sinuses in leaves. Often confused with Pin Oak.' },

  // Maples
  { name: 'Sugar Maple',     category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 45, kilnDryLbsPerFt3: 42, morPsi: 7400,
    notes: 'One of the strongest maples. Excellent tie-in species. Sap source for syrup.' },
  { name: 'Red Maple',       category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 6500,
    notes: 'Most abundant tree in eastern North America. Faster growth = lower density than Sugar Maple.' },
  { name: 'Silver Maple',    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 33, kilnDryLbsPerFt3: 30, morPsi: 5600,
    notes: 'Weak wood; prone to storm damage and branch failure. Use extra caution for rigging.' },
  { name: 'Black Maple',     category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 6500,
    notes: 'Nearly identical to Sugar Maple. Often grows alongside it in mixed stands.' },

  // Hickories
  { name: 'Shagbark Hickory',category: 'Hardwood', greenLbsPerFt3: 63, airDryLbsPerFt3: 50, kilnDryLbsPerFt3: 47, morPsi: 9200,
    notes: 'Highest MOR of common North American species. Exceptional shock resistance.' },
  { name: 'Pignut Hickory',  category: 'Hardwood', greenLbsPerFt3: 60, airDryLbsPerFt3: 49, kilnDryLbsPerFt3: 46, morPsi: 7800,
    notes: 'Similar strength to Shagbark. Smooth gray bark distinguishes it in the field.' },
  { name: 'Pecan',           category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 47, kilnDryLbsPerFt3: 44, morPsi: 11000,
    notes: 'Hickory genus. Exceptionally strong. Common in southeastern US. Prone to wind-throw.' },

  // Ashes
  { name: 'White Ash',       category: 'Hardwood', greenLbsPerFt3: 46, airDryLbsPerFt3: 41, kilnDryLbsPerFt3: 38, morPsi: 6200,
    notes: 'Critical EAB (Emerald Ash Borer) mortality — assess for structural decay before rigging.' },
  { name: 'Green Ash',       category: 'Hardwood', greenLbsPerFt3: 47, airDryLbsPerFt3: 40, kilnDryLbsPerFt3: 37, morPsi: 7100,
    notes: 'Widely planted street tree now decimated by EAB. High failure risk in urban settings.' },
  { name: 'Black Ash',       category: 'Hardwood', greenLbsPerFt3: 45, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 5700,
    notes: 'Wetland species. Used in traditional basket-making. Lower MOR than White/Green Ash.' },

  // Locusts
  { name: 'Black Locust',    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 48, kilnDryLbsPerFt3: 45, morPsi: 16600,
    notes: 'Highest MOR of any common NA hardwood. Exceptional rot resistance. Sharp thorns — PPE critical.' },
  { name: 'Honey Locust',    category: 'Hardwood', greenLbsPerFt3: 60, airDryLbsPerFt3: 42, kilnDryLbsPerFt3: 39, morPsi: 10700,
    notes: 'Extremely hard and durable. Large branched thorns on trunk. Common urban tree.' },

  // Birches & Beech
  { name: 'American Beech',  category: 'Hardwood', greenLbsPerFt3: 54, airDryLbsPerFt3: 45, kilnDryLbsPerFt3: 42, morPsi: 8600,
    notes: 'Smooth gray bark; wounds close slowly — minimize attachment injuries. Beech Leaf Disease emerging threat.' },
  { name: 'Yellow Birch',    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 8800,
    notes: 'Strongest of the birches. Golden-bronze peeling bark. Common in northeastern forests.' },
  { name: 'Paper Birch',     category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 6400,
    notes: 'Short-lived pioneer species. White peeling bark. Moderate strength — confirm stem integrity.' },

  // Walnuts & Cherry
  { name: 'Black Walnut',    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 7600,
    notes: 'High green-to-dry shrinkage. Juglone root toxin. Often open-grown with wide crown.' },
  { name: 'Black Cherry',    category: 'Hardwood', greenLbsPerFt3: 45, airDryLbsPerFt3: 35, kilnDryLbsPerFt3: 32, morPsi: 8000,
    notes: 'Moderate density but high MOR relative to weight. Scaly dark bark on mature trees.' },
  { name: 'Butternut',       category: 'Hardwood', greenLbsPerFt3: 46, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 4700,
    notes: 'Lowest strength in walnut family. Butternut Canker has devastated populations.' },

  // Elms & Hackberry
  { name: 'American Elm',    category: 'Hardwood', greenLbsPerFt3: 54, airDryLbsPerFt3: 39, kilnDryLbsPerFt3: 36, morPsi: 5600,
    notes: 'Interlocked grain resists splitting — good rigging wood. Dutch Elm Disease is primary threat.' },
  { name: 'Slippery Elm',    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 7200,
    notes: 'Stronger than American Elm. Mucilaginous inner bark. More DED-resistant.' },
  { name: 'Hackberry',       category: 'Hardwood', greenLbsPerFt3: 53, airDryLbsPerFt3: 37, kilnDryLbsPerFt3: 34, morPsi: 7100,
    notes: 'Corky warty bark. Witches broom (Eriophyid mite) common but cosmetic. Tough wood.' },

  // Others
  { name: 'Osage Orange',    category: 'Hardwood', greenLbsPerFt3: 64, airDryLbsPerFt3: 54, kilnDryLbsPerFt3: 51, morPsi: 16700,
    notes: 'Densest & strongest common NA hardwood. Exceptional rot resistance. Hedge apple/bodark.' },
  { name: 'Sweetgum',        category: 'Hardwood', greenLbsPerFt3: 51, airDryLbsPerFt3: 37, kilnDryLbsPerFt3: 34, morPsi: 6300,
    notes: 'Star-shaped leaves; spiky gumball seed pods. Interlocked grain. Common southeastern species.' },
  { name: 'Yellow Poplar',   category: 'Hardwood', greenLbsPerFt3: 38, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 26, morPsi: 5600,
    notes: 'Tallest eastern hardwood despite low density. Fast-growing. Tulip-shaped flowers.' },
  { name: 'American Sycamore',category:'Hardwood', greenLbsPerFt3: 52, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 5200,
    notes: 'Mottled white/gray/brown bark. Large crown spread. Common in riparian zones.' },
  { name: 'American Basswood',category:'Hardwood', greenLbsPerFt3: 42, airDryLbsPerFt3: 26, kilnDryLbsPerFt3: 23, morPsi: 4300,
    notes: 'Softest common hardwood. High green-to-dry weight loss. Often multi-stem.' },
  { name: 'Black Tupelo',    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 35, kilnDryLbsPerFt3: 32, morPsi: 5800,
    notes: 'Black Gum. Brilliant scarlet fall color. Interlocked grain; resists splitting.' },
  { name: 'Eastern Cottonwood',category:'Hardwood',greenLbsPerFt3: 49, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4400,
    notes: 'Extremely fast-growing but weak. Cottonwood seeds (early summer) identify species. Prone to failure.' },

  // ── SOFTWOODS ────────────────────────────────────────────────────────────

  { name: 'Douglas Fir',     category: 'Softwood', greenLbsPerFt3: 37, airDryLbsPerFt3: 30, kilnDryLbsPerFt3: 27, morPsi: 7700,
    notes: 'Highest MOR among common conifers. Dominant timber species in Pacific Northwest.' },
  { name: 'Sitka Spruce',    category: 'Softwood', greenLbsPerFt3: 33, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 5700,
    notes: 'Best strength-to-weight ratio of any conifer. Coastal species. Used in aircraft frames.' },
  { name: 'White Spruce',    category: 'Softwood', greenLbsPerFt3: 34, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 4500,
    notes: 'Widespread boreal species. Shallow roots; susceptible to windthrow on wet sites.' },
  { name: 'Eastern Hemlock', category: 'Softwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 5400,
    notes: 'High green density drops dramatically on drying. Woolly Adelgid is critical threat.' },
  { name: 'Western Hemlock', category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 26, morPsi: 6200,
    notes: 'Stronger than Eastern Hemlock. Drooping leader tip is field ID marker.' },
  { name: 'Loblolly Pine',   category: 'Softwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 31, kilnDryLbsPerFt3: 28, morPsi: 7300,
    notes: 'Dominant plantation pine of southeastern US. High resin content — sticky sap wells.' },
  { name: 'Longleaf Pine',   category: 'Softwood', greenLbsPerFt3: 55, airDryLbsPerFt3: 41, kilnDryLbsPerFt3: 38, morPsi: 8500,
    notes: 'Strongest native pine. Old-growth nearly gone. Fire-adapted; long needles in bundles of 3.' },
  { name: 'Shortleaf Pine',  category: 'Softwood', greenLbsPerFt3: 45, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 6800,
    notes: 'Wide natural range. More flexible than Longleaf. Paired needles and small cones.' },
  { name: 'Red Pine',        category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 26, morPsi: 5600,
    notes: 'Orange-red bark in upper crown. Commonly planted in northern states. Paired needles.' },
  { name: 'Eastern White Pine',category:'Softwood',greenLbsPerFt3: 36, airDryLbsPerFt3: 25, kilnDryLbsPerFt3: 22, morPsi: 4000,
    notes: 'Softest common eastern pine. 5 needles per bundle. Tallest tree in eastern North America.' },
  { name: 'Ponderosa Pine',  category: 'Softwood', greenLbsPerFt3: 51, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4600,
    notes: 'Dominant western pine. Vanilla/butterscotch scent in bark crevices. Long 3-needle bundles.' },
  { name: 'Western Larch',   category: 'Softwood', greenLbsPerFt3: 48, airDryLbsPerFt3: 36, kilnDryLbsPerFt3: 33, morPsi: 7700,
    notes: 'Deciduous conifer — drops needles in fall. One of the strongest western conifers.' },
  { name: 'Bald Cypress',    category: 'Softwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 32, kilnDryLbsPerFt3: 29, morPsi: 6600,
    notes: 'Exceptional decay resistance. Knee root structures. Common in southeastern swamps.' },
  { name: 'Eastern Red Cedar',category:'Softwood', greenLbsPerFt3: 48, airDryLbsPerFt3: 33, kilnDryLbsPerFt3: 30, morPsi: 4600,
    notes: 'Actually a juniper. Aromatic reddish heartwood. Very rot-resistant. Dense branching.' },
  { name: 'Western Red Cedar',category:'Softwood', greenLbsPerFt3: 30, airDryLbsPerFt3: 23, kilnDryLbsPerFt3: 20, morPsi: 4900,
    notes: 'Very low density but exceptional decay resistance. Pacific Northwest old-growth icon.' },
  { name: 'Coast Redwood',   category: 'Softwood', greenLbsPerFt3: 32, airDryLbsPerFt3: 26, kilnDryLbsPerFt3: 23, morPsi: 5500,
    notes: 'Tallest living trees on Earth. Fibrous bark up to 12" thick. Tannin-based decay resistance.' },
];

export type Condition = 'green' | 'airDry' | 'kilnDry';

export function getDensity(species: Species, condition: Condition): number {
  if (condition === 'green') return species.greenLbsPerFt3;
  if (condition === 'airDry') return species.airDryLbsPerFt3;
  return species.kilnDryLbsPerFt3;
}

export function getByCategory(category: Category): Species[] {
  return SPECIES.filter(s => s.category === category);
}
