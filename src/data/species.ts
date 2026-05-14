// All density and MOR values from USDA Forest Products Laboratory
// Wood Handbook (2021 edition) Table 4-3a (Softwoods) and Table 4-3b (Hardwoods).
// Green MOR is used for anchor calculations — conservative for standing green timber.
// Species marked (*) use interpolated values where direct table data is unavailable.

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

  // ════════════════════════════════════════════════════════════════
  // HARDWOODS
  // ════════════════════════════════════════════════════════════════

  // ── Oaks: White Oak Group ────────────────────────────────────────

  { name: 'White Oak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 47, kilnDryLbsPerFt3: 44, morPsi: 7400,
    notes: 'Premium tie-in species. Ring-porous; exceptional rot resistance. Classic urban canopy and forest tree.' },

  { name: 'Bur Oak',
    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 7200,
    notes: 'Extreme fire and drought resistance. Thick corky bark. Great Plains and Midwest staple.' },

  { name: 'Chestnut Oak',
    category: 'Hardwood', greenLbsPerFt3: 63, airDryLbsPerFt3: 47, kilnDryLbsPerFt3: 44, morPsi: 8300,
    notes: 'Heaviest of the white oak group. Deeply furrowed bark; common on rocky ridges.' },

  { name: 'Post Oak',
    category: 'Hardwood', greenLbsPerFt3: 64, airDryLbsPerFt3: 52, kilnDryLbsPerFt3: 49, morPsi: 9100,
    notes: 'Very rot-resistant white oak. Cross-shaped leaf lobes. Dry upland sites. Extremely durable.' },

  { name: 'Swamp White Oak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 48, kilnDryLbsPerFt3: 45, morPsi: 8300,
    notes: 'Two-toned bark peels on upper branches. Riparian bottomland species. Strong, durable wood.' },

  { name: 'Overcup Oak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 52, kilnDryLbsPerFt3: 49, morPsi: 7600,
    notes: 'Acorn nearly enclosed by cap. SE bottomland species; tolerates prolonged flooding.' },

  { name: 'Oregon White Oak',
    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 8000,
    notes: 'Only native oak in Pacific NW. Fire-adapted savanna species. Important habitat oak.' },

  { name: 'Gambel Oak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 8200,
    notes: 'Shrub to small tree in Rocky Mountain foothills. Often multi-stem from roots.' },

  // ── Oaks: Red Oak Group ───────────────────────────────────────────

  { name: 'Northern Red Oak',
    category: 'Hardwood', greenLbsPerFt3: 59, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 6800,
    notes: 'Fast-growing. Weaker than White Oak but still excellent for rigging. Urban and forest dominant.' },

  { name: 'Pin Oak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 7000,
    notes: 'Very common urban street tree. Persistent dead lower branches (pin-like) are a hazard ID cue.' },

  { name: 'Scarlet Oak',
    category: 'Hardwood', greenLbsPerFt3: 60, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 7900,
    notes: 'Brilliant scarlet fall color. Deep leaf sinuses. Often confused with Pin Oak in the field.' },

  { name: 'Black Oak',
    category: 'Hardwood', greenLbsPerFt3: 61, airDryLbsPerFt3: 45, kilnDryLbsPerFt3: 42, morPsi: 6900,
    notes: 'Yellow inner bark (tannin-rich). Widespread eastern red oak. Acorns ripen in second year.' },

  { name: 'Water Oak',
    category: 'Hardwood', greenLbsPerFt3: 61, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 6600,
    notes: 'Variable leaf shapes on same tree — ID challenge. Common SE urban tree. Shallow roots.' },

  { name: 'Willow Oak',
    category: 'Hardwood', greenLbsPerFt3: 64, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 6900,
    notes: 'Narrow willow-like leaves; atypical for an oak. Popular SE street tree. Dense, heavy wood.' },

  { name: 'Shumard Oak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 45, kilnDryLbsPerFt3: 42, morPsi: 7600,
    notes: 'Large red oak of SE bottomlands. Excellent fall color. Good rigging species — strong wood.' },

  { name: 'Cherrybark Oak',
    category: 'Hardwood', greenLbsPerFt3: 64, airDryLbsPerFt3: 50, kilnDryLbsPerFt3: 47, morPsi: 10400,
    notes: 'Strongest common red oak — nearly matches some white oaks. Cherry-like scaly bark. SE US.' },

  { name: 'Nuttall Oak',
    category: 'Hardwood', greenLbsPerFt3: 60, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 6700,
    notes: 'Bottomland red oak; Mississippi River valley. Very similar to Pin Oak. Fast-growing.' },

  // ── Oaks: Western & Evergreen ────────────────────────────────────

  { name: 'Live Oak',
    category: 'Hardwood', greenLbsPerFt3: 75, airDryLbsPerFt3: 55, kilnDryLbsPerFt3: 52, morPsi: 9600,
    notes: 'Heaviest native US oak. Evergreen. Historic shipbuilding timber. SE coastal tree. Exceptional strength.' },

  { name: 'California Black Oak',
    category: 'Hardwood', greenLbsPerFt3: 56, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 7200,
    notes: 'Dominant foothill oak in Sierra Nevada. Acorns critical wildlife food. Good rigging wood.' },

  { name: 'Canyon Live Oak',
    category: 'Hardwood', greenLbsPerFt3: 64, airDryLbsPerFt3: 55, kilnDryLbsPerFt3: 52, morPsi: 9100,
    notes: 'Hardest CA oak; evergreen. Rocky canyon habitat. Called "iron oak" by early settlers.' },

  { name: 'Valley Oak',
    category: 'Hardwood', greenLbsPerFt3: 56, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 7400,
    notes: 'Largest western oak; iconic CA savanna tree. Long drooping branches. Deep taproot system.' },

  { name: 'Tanoak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 49, kilnDryLbsPerFt3: 46, morPsi: 9600,
    notes: 'Oak relative (Notholithocarpus); not a true oak. Devastated by sudden oak death (Phytophthora). Pacific Coast.' },

  // ── Maples ───────────────────────────────────────────────────────

  { name: 'Sugar Maple',
    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 45, kilnDryLbsPerFt3: 42, morPsi: 7400,
    notes: 'Premier tie-in maple. Hard maple lumber standard. Sap source for maple syrup.' },

  { name: 'Red Maple',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 6500,
    notes: 'Most abundant tree in eastern North America. Faster growth = lower density than Sugar Maple.' },

  { name: 'Silver Maple',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 33, kilnDryLbsPerFt3: 30, morPsi: 5600,
    notes: 'Weak wood; prone to storm damage and branch failure. Use higher safety factors for rigging.' },

  { name: 'Black Maple',
    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 6500,
    notes: 'Nearly identical to Sugar Maple in the field. Often grows alongside it in mixed stands.' },

  { name: 'Bigleaf Maple',
    category: 'Hardwood', greenLbsPerFt3: 48, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 5700,
    notes: 'Largest native maple. Pacific NW forest. Massive leaves to 12". Mosses and epiphytes common on trunk.' },

  { name: 'Box Elder',
    category: 'Hardwood', greenLbsPerFt3: 44, airDryLbsPerFt3: 30, kilnDryLbsPerFt3: 27, morPsi: 4400,
    notes: 'Only maple with compound leaves. Weakest maple — not suitable as rigging anchor. Riparian groves.' },

  { name: 'Norway Maple',
    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 42, kilnDryLbsPerFt3: 39, morPsi: 7000,
    notes: 'Non-native; invasive in NE US. Similar strength to Sugar Maple. Milky sap IDs it from native maples.' },

  // ── Hickories ────────────────────────────────────────────────────

  { name: 'Shagbark Hickory',
    category: 'Hardwood', greenLbsPerFt3: 63, airDryLbsPerFt3: 50, kilnDryLbsPerFt3: 47, morPsi: 9200,
    notes: 'Classic shaggy plated bark. Exceptional shock resistance — highest MOR of common hickories.' },

  { name: 'Shellbark Hickory',
    category: 'Hardwood', greenLbsPerFt3: 63, airDryLbsPerFt3: 50, kilnDryLbsPerFt3: 47, morPsi: 9200,
    notes: 'Very similar to Shagbark; larger leaflets and nuts. Bottomland sites. Equal rigging strength.' },

  { name: 'Mockernut Hickory',
    category: 'Hardwood', greenLbsPerFt3: 65, airDryLbsPerFt3: 51, kilnDryLbsPerFt3: 48, morPsi: 9300,
    notes: 'Heaviest of the hickories. Thick shell around small nut. Upland dry sites. Excellent anchor.' },

  { name: 'Pignut Hickory',
    category: 'Hardwood', greenLbsPerFt3: 60, airDryLbsPerFt3: 49, kilnDryLbsPerFt3: 46, morPsi: 7800,
    notes: 'Smooth gray bark — distinct from Shagbark. Upland sites. Strong and impact-resistant.' },

  { name: 'Bitternut Hickory',
    category: 'Hardwood', greenLbsPerFt3: 56, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 7800,
    notes: 'Sulfur-yellow buds are definitive field ID. Bottomland to upland. Bitter nut not eaten by wildlife.' },

  { name: 'Water Hickory',
    category: 'Hardwood', greenLbsPerFt3: 61, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 7500,
    notes: 'SE swamp and bottomland hickory. Compressed, winged nut husk. Tolerates flooding.' },

  { name: 'Pecan',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 47, kilnDryLbsPerFt3: 44, morPsi: 11000,
    notes: 'Hickory genus. Highest MOR of any hickory in the USDA table. Common SE US nut orchard tree.' },

  // ── Ashes ────────────────────────────────────────────────────────

  { name: 'White Ash',
    category: 'Hardwood', greenLbsPerFt3: 46, airDryLbsPerFt3: 41, kilnDryLbsPerFt3: 38, morPsi: 6200,
    notes: 'Critical EAB (Emerald Ash Borer) mortality — always assess for structural decay before rigging.' },

  { name: 'Green Ash',
    category: 'Hardwood', greenLbsPerFt3: 47, airDryLbsPerFt3: 40, kilnDryLbsPerFt3: 37, morPsi: 7100,
    notes: 'Widely planted; now decimated by EAB. High failure risk in urban settings. Assess carefully.' },

  { name: 'Black Ash',
    category: 'Hardwood', greenLbsPerFt3: 45, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 5700,
    notes: 'Wetland ash. Used in traditional basket-making. Lower strength than White/Green. EAB threatens.' },

  { name: 'Blue Ash',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 8600,
    notes: 'Strongest native ash. Square twigs are field ID. Ozark Plateau. Inner bark turns blue in water.' },

  { name: 'Oregon Ash',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 6300,
    notes: 'Only native ash in Pacific NW. Riparian sites. Similar appearance to White Ash. EAB spreading west.' },

  // ── Birches ───────────────────────────────────────────────────────

  { name: 'Yellow Birch',
    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 8800,
    notes: 'Strongest birch. Golden-bronze peeling bark. Wintergreen scent in crushed twigs. NE forests.' },

  { name: 'Sweet Birch',
    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 47, kilnDryLbsPerFt3: 44, morPsi: 9400,
    notes: 'Highest MOR of any birch. Strong wintergreen scent — definitive field ID. Dark scaly bark.' },

  { name: 'Paper Birch',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 6400,
    notes: 'White peeling bark. Short-lived pioneer species. Moderate strength — confirm stem integrity.' },

  { name: 'River Birch',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 37, kilnDryLbsPerFt3: 34, morPsi: 7400,
    notes: 'Pink to salmon flaking bark. Heat and flood tolerant. Common urban planting. Riparian native.' },

  { name: 'Gray Birch',
    category: 'Hardwood', greenLbsPerFt3: 46, airDryLbsPerFt3: 35, kilnDryLbsPerFt3: 32, morPsi: 5600,
    notes: 'Chalky white bark with dark triangular marks. Short-lived NE pioneer. Often multi-stem clumps.' },

  // ── Hornbeams & Hophornbeam ───────────────────────────────────────

  { name: 'American Hornbeam',
    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 45, kilnDryLbsPerFt3: 42, morPsi: 7700,
    notes: 'Muscle-like fluted bark (also "musclewood"). Very dense understory tree. Small, rarely rigging anchor.' },

  { name: 'Eastern Hophornbeam',
    category: 'Hardwood', greenLbsPerFt3: 63, airDryLbsPerFt3: 51, kilnDryLbsPerFt3: 48, morPsi: 9000,
    notes: 'Called "ironwood." Shreddy bark resembling hops. Extremely hard; one of the densest eastern trees.' },

  // ── Locusts ───────────────────────────────────────────────────────

  { name: 'Black Locust',
    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 48, kilnDryLbsPerFt3: 45, morPsi: 16600,
    notes: 'Highest MOR of any common NA hardwood. Exceptional rot resistance. Paired thorns — PPE critical.' },

  { name: 'Honey Locust',
    category: 'Hardwood', greenLbsPerFt3: 60, airDryLbsPerFt3: 42, kilnDryLbsPerFt3: 39, morPsi: 10700,
    notes: 'Extremely hard and durable. Large branched trunk thorns. Common thornless cultivars in urban settings.' },

  { name: 'Kentucky Coffeetree',
    category: 'Hardwood', greenLbsPerFt3: 56, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 6400,
    notes: 'Scaly ridged bark; large compound leaves. Very rot-resistant heartwood. Good urban tree.' },

  // ── Beech, Chestnut & Relatives ──────────────────────────────────

  { name: 'American Beech',
    category: 'Hardwood', greenLbsPerFt3: 54, airDryLbsPerFt3: 45, kilnDryLbsPerFt3: 42, morPsi: 8600,
    notes: 'Smooth gray bark; wounds close slowly. Beech leaf disease emerging threat. Good rigging wood.' },

  { name: 'American Chestnut',
    category: 'Hardwood', greenLbsPerFt3: 53, airDryLbsPerFt3: 30, kilnDryLbsPerFt3: 27, morPsi: 5300,
    notes: 'Functionally extinct from chestnut blight (Cryphonectria). Stumps resprout. Historical timber giant.' },

  // ── Walnuts & Cherry ─────────────────────────────────────────────

  { name: 'Black Walnut',
    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 7600,
    notes: 'High green-to-dry shrinkage. Juglone root toxin affects nearby plants. Wide open-grown crown.' },

  { name: 'Black Cherry',
    category: 'Hardwood', greenLbsPerFt3: 45, airDryLbsPerFt3: 35, kilnDryLbsPerFt3: 32, morPsi: 8000,
    notes: 'High MOR relative to weight. Scaly dark bark with horizontal lenticels on mature trees.' },

  { name: 'Butternut',
    category: 'Hardwood', greenLbsPerFt3: 46, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 4700,
    notes: 'Lowest strength in walnut family. Butternut Canker (Ophiognomonia clavigignenti) has devastated stands.' },

  // ── Elms & Hackberry ─────────────────────────────────────────────

  { name: 'American Elm',
    category: 'Hardwood', greenLbsPerFt3: 54, airDryLbsPerFt3: 39, kilnDryLbsPerFt3: 36, morPsi: 5600,
    notes: 'Interlocked grain resists splitting — good rigging wood. Dutch Elm Disease (Ophiostoma) is primary threat.' },

  { name: 'Slippery Elm',
    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 7200,
    notes: 'Stronger than American Elm. Mucilaginous inner bark. More DED-resistant. Rough-textured leaves.' },

  { name: 'Rock Elm',
    category: 'Hardwood', greenLbsPerFt3: 56, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 9800,
    notes: 'Strongest elm; corky-winged twigs. Also called "cliff elm." Limited range; historically used in ships.' },

  { name: 'Winged Elm',
    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 7600,
    notes: 'Corky wing ridges on twigs. SE small to medium tree. Drier sites than other elms.' },

  { name: 'Hackberry',
    category: 'Hardwood', greenLbsPerFt3: 53, airDryLbsPerFt3: 37, kilnDryLbsPerFt3: 34, morPsi: 7100,
    notes: 'Corky warty bark. Witches broom (Eriophyid mite + powdery mildew) is common but cosmetic.' },

  // ── Poplars & Aspens ─────────────────────────────────────────────

  { name: 'Quaking Aspen',
    category: 'Hardwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 26, kilnDryLbsPerFt3: 24, morPsi: 4300,
    notes: 'Most widely distributed North American tree. Clonal colonies; all stems share one root system. Weak wood.' },

  { name: 'Bigtooth Aspen',
    category: 'Hardwood', greenLbsPerFt3: 43, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4000,
    notes: 'Larger teeth on leaves than Quaking Aspen. NE and Great Lakes. Pioneer after disturbance.' },

  { name: 'Eastern Cottonwood',
    category: 'Hardwood', greenLbsPerFt3: 49, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4400,
    notes: 'Extremely fast-growing but very weak. Cottony seeds (early summer) are field ID. Prone to failure.' },

  { name: 'Black Cottonwood',
    category: 'Hardwood', greenLbsPerFt3: 38, airDryLbsPerFt3: 24, kilnDryLbsPerFt3: 22, morPsi: 3900,
    notes: 'Largest western cottonwood. Pacific NW riparian giant. Balsam-scented buds. Very weak wood.' },

  // ── Magnolias ────────────────────────────────────────────────────

  { name: 'Southern Magnolia',
    category: 'Hardwood', greenLbsPerFt3: 52, airDryLbsPerFt3: 33, kilnDryLbsPerFt3: 30, morPsi: 6800,
    notes: 'Evergreen broadleaf. Large waxy leaves, showy white flowers. SE US native. Good anchor species.' },

  { name: 'Cucumber Tree',
    category: 'Hardwood', greenLbsPerFt3: 52, airDryLbsPerFt3: 33, kilnDryLbsPerFt3: 30, morPsi: 6800,
    notes: 'Largest native magnolia. Cucumber-shaped green fruit clusters. Appalachian forest species.' },

  { name: 'Yellow Poplar',
    category: 'Hardwood', greenLbsPerFt3: 38, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 26, morPsi: 5600,
    notes: 'Tallest eastern hardwood despite low density. Fast-growing. Tulip-shaped flowers. Straight bole.' },

  // ── Willows ───────────────────────────────────────────────────────

  { name: 'Black Willow',
    category: 'Hardwood', greenLbsPerFt3: 53, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 26, morPsi: 4000,
    notes: 'Largest native willow; riparian and wet sites. Very flexible but weak — poor rigging anchor. Leaning common.' },

  // ── Miscellaneous Hardwoods ──────────────────────────────────────

  { name: 'Osage Orange',
    category: 'Hardwood', greenLbsPerFt3: 64, airDryLbsPerFt3: 54, kilnDryLbsPerFt3: 51, morPsi: 16700,
    notes: 'Densest & strongest common NA hardwood. Exceptional rot resistance — centuries in soil. Bodark / hedge apple.' },

  { name: 'Sweetgum',
    category: 'Hardwood', greenLbsPerFt3: 51, airDryLbsPerFt3: 37, kilnDryLbsPerFt3: 34, morPsi: 6300,
    notes: 'Star-shaped leaves; spiky gumball seed pods. Interlocked grain. Common SE and lower Midwest species.' },

  { name: 'American Sycamore',
    category: 'Hardwood', greenLbsPerFt3: 52, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 5200,
    notes: 'Mottled white/gray/brown bark that exfoliates. Massive crown spread. Riparian corridor dominant.' },

  { name: 'American Basswood',
    category: 'Hardwood', greenLbsPerFt3: 42, airDryLbsPerFt3: 26, kilnDryLbsPerFt3: 23, morPsi: 4300,
    notes: 'Softest common hardwood. Bees prefer its nectar. High green-to-dry weight loss. Often multi-stem.' },

  { name: 'Black Tupelo',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 35, kilnDryLbsPerFt3: 32, morPsi: 5800,
    notes: 'Black Gum. Brilliant scarlet fall color. Interlocked grain resists splitting. Riparian to upland.' },

  { name: 'Persimmon',
    category: 'Hardwood', greenLbsPerFt3: 67, airDryLbsPerFt3: 52, kilnDryLbsPerFt3: 50, morPsi: 8900,
    notes: 'Heaviest common eastern hardwood after Live Oak. Block-pattern bark. Orange edible fruit after frost.' },

  { name: 'Sassafras',
    category: 'Hardwood', greenLbsPerFt3: 40, airDryLbsPerFt3: 31, kilnDryLbsPerFt3: 28, morPsi: 5700,
    notes: 'Three distinct leaf shapes on same tree. Root bark aromatic. Moderate rot resistance. Pioneer species.' },

  { name: 'Northern Catalpa',
    category: 'Hardwood', greenLbsPerFt3: 36, airDryLbsPerFt3: 26, kilnDryLbsPerFt3: 23, morPsi: 6400,
    notes: 'Exceptional rot resistance despite low density. Heart-shaped leaves, long bean-like pods. Good fence posts.' },

  { name: 'American Holly',
    category: 'Hardwood', greenLbsPerFt3: 66, airDryLbsPerFt3: 40, kilnDryLbsPerFt3: 37, morPsi: 6100,
    notes: 'Only native evergreen broadleaf in NE. Dense, heavy wood. Spiny leaves. Small tree — rarely rigging anchor.' },

  { name: 'Red Alder',
    category: 'Hardwood', greenLbsPerFt3: 46, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 26, morPsi: 6500,
    notes: 'Most important commercial hardwood in Pacific NW. Fixes nitrogen. Coastal riparian groves.' },

  { name: 'Yellow Buckeye',
    category: 'Hardwood', greenLbsPerFt3: 43, airDryLbsPerFt3: 25, kilnDryLbsPerFt3: 22, morPsi: 4700,
    notes: 'Palmate compound leaves; spiny seed husks. Appalachian forest. Toxic seeds and bark. Weak wood.' },

  // ════════════════════════════════════════════════════════════════
  // SOFTWOODS
  // ════════════════════════════════════════════════════════════════

  // ── Pines: Eastern & Southern ────────────────────────────────────

  { name: 'Eastern White Pine',
    category: 'Softwood', greenLbsPerFt3: 36, airDryLbsPerFt3: 25, kilnDryLbsPerFt3: 22, morPsi: 4000,
    notes: 'Softest common eastern pine. 5 needles per bundle. Tallest tree in eastern North America historically.' },

  { name: 'Red Pine',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 26, morPsi: 5600,
    notes: 'Orange-red bark in upper crown. Widely planted northern states. Paired needles. Plantation dominant.' },

  { name: 'Loblolly Pine',
    category: 'Softwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 31, kilnDryLbsPerFt3: 28, morPsi: 7300,
    notes: 'Dominant plantation pine of southeastern US. High resin content — sticky sap wells under bark.' },

  { name: 'Longleaf Pine',
    category: 'Softwood', greenLbsPerFt3: 55, airDryLbsPerFt3: 41, kilnDryLbsPerFt3: 38, morPsi: 8500,
    notes: 'Strongest native pine. Old-growth nearly gone. Fire-adapted; needles up to 18" in bundles of 3.' },

  { name: 'Slash Pine',
    category: 'Softwood', greenLbsPerFt3: 55, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 7800,
    notes: 'Fast-growing SE plantation pine. High resin. Needles 2-3 per bundle. Turpentine production historically.' },

  { name: 'Shortleaf Pine',
    category: 'Softwood', greenLbsPerFt3: 45, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 6800,
    notes: 'Wide natural range — most widespread southern pine. Paired needles. Small cones. Drought tolerant.' },

  { name: 'Virginia Pine',
    category: 'Softwood', greenLbsPerFt3: 46, airDryLbsPerFt3: 33, kilnDryLbsPerFt3: 30, morPsi: 6200,
    notes: 'Scrub pine of SE uplands and mountain slopes. Crooked form; often used as Christmas trees.' },

  { name: 'Pitch Pine',
    category: 'Softwood', greenLbsPerFt3: 55, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 6400,
    notes: 'Extremely resinous — historically mined for tar and turpentine. Needles 3 per bundle. NE coastal plains.' },

  { name: 'Jack Pine',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 27, morPsi: 4700,
    notes: 'Northernmost North American pine. Serotinous cones open in fire. Kirtland\'s Warbler dependent species.' },

  // ── Pines: Western ────────────────────────────────────────────────

  { name: 'Ponderosa Pine',
    category: 'Softwood', greenLbsPerFt3: 51, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4600,
    notes: 'Dominant western pine over vast range. Vanilla/butterscotch scent in bark crevices. 3-needle bundles.' },

  { name: 'Lodgepole Pine',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 27, morPsi: 4500,
    notes: 'Thin straight trunk; historically used for tipi poles. Serotinous cones. Mountain West dominant. MPB victim.' },

  { name: 'Jeffrey Pine',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4400,
    notes: 'Vanilla-scented bark like Ponderosa but at higher elevations. Prickles point inward on cone. CA/NV/OR.' },

  { name: 'Sugar Pine',
    category: 'Softwood', greenLbsPerFt3: 35, airDryLbsPerFt3: 25, kilnDryLbsPerFt3: 23, morPsi: 4300,
    notes: 'World\'s largest pine species by height and volume. Cones up to 20". Low-density, easy to work.' },

  { name: 'Western White Pine',
    category: 'Softwood', greenLbsPerFt3: 36, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 4700,
    notes: '5 needles per bundle. Pacific NW; formerly dominant until white pine blister rust (Cronartium) spread.' },

  { name: 'Pinyon Pine',
    category: 'Softwood', greenLbsPerFt3: 40, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 6200,
    notes: 'SW woodland. Produces pine nuts (edible seeds). Drought-tolerant. Short stature; rarely rigging anchor.' },

  // ── Spruces ───────────────────────────────────────────────────────

  { name: 'Sitka Spruce',
    category: 'Softwood', greenLbsPerFt3: 33, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 5700,
    notes: 'Best strength-to-weight of any conifer. Coastal Pacific NW. Used in aircraft frames and instrument tops.' },

  { name: 'White Spruce',
    category: 'Softwood', greenLbsPerFt3: 34, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 4500,
    notes: 'Widespread boreal. Shallow roots on wet sites — high windthrow risk. Skunk-like smell when bruised.' },

  { name: 'Red Spruce',
    category: 'Softwood', greenLbsPerFt3: 34, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 5200,
    notes: 'NE mountain spruce. Acid rain sensitive. Guitar and violin soundboard wood of choice. Reddish bark.' },

  { name: 'Black Spruce',
    category: 'Softwood', greenLbsPerFt3: 36, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 5000,
    notes: 'Boreal bog and muskeg dominant. Clubs of dense foliage at top. Very slow-growing in peat.' },

  { name: 'Blue Spruce',
    category: 'Softwood', greenLbsPerFt3: 38, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4800,
    notes: 'Waxy blue-white needles. Native to Rocky Mountain streams; widely planted as ornamental nationwide.' },

  { name: 'Engelmann Spruce',
    category: 'Softwood', greenLbsPerFt3: 33, airDryLbsPerFt3: 23, kilnDryLbsPerFt3: 21, morPsi: 4000,
    notes: 'High-elevation Rocky Mountain and Pacific NW spruce. Flexible low-density wood. Skunk smell when bruised.' },

  { name: 'Norway Spruce',
    category: 'Softwood', greenLbsPerFt3: 34, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 4500,
    notes: 'Non-native plantation and ornamental. Pendulous branch tips. Common holiday tree. Similar to White Spruce.' },

  // ── True Firs (Abies) ─────────────────────────────────────────────

  { name: 'Balsam Fir',
    category: 'Softwood', greenLbsPerFt3: 45, airDryLbsPerFt3: 25, kilnDryLbsPerFt3: 22, morPsi: 3900,
    notes: 'Classic Christmas tree. Resin blisters on bark. NE and Great Lakes boreal. Spruce budworm target.' },

  { name: 'White Fir',
    category: 'Softwood', greenLbsPerFt3: 37, airDryLbsPerFt3: 26, kilnDryLbsPerFt3: 23, morPsi: 4400,
    notes: 'Silver-blue foliage. West Coast and Rocky Mountains. Bark turns pale gray on old trees. Balsam woolly adelgid.' },

  { name: 'Grand Fir',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 4900,
    notes: 'Flat sprays of needles in two distinct lengths. Pacific NW lowlands. Strong citrus scent when crushed.' },

  { name: 'Red Fir',
    category: 'Softwood', greenLbsPerFt3: 47, airDryLbsPerFt3: 31, kilnDryLbsPerFt3: 28, morPsi: 5800,
    notes: 'Sierra Nevada high-elevation dominant. Reddish-brown furrowed bark. Dense stands at 6,000-9,000 ft.' },

  { name: 'Noble Fir',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 5900,
    notes: 'Largest of the true firs. Cascades and Olympics. Premium Christmas wreath and tree source. Long-lived.' },

  { name: 'Subalpine Fir',
    category: 'Softwood', greenLbsPerFt3: 38, airDryLbsPerFt3: 24, kilnDryLbsPerFt3: 21, morPsi: 3600,
    notes: 'Spire-like crown with upright purple cones. Treeline species. Weakest fir. High windsnap risk.' },

  { name: 'Pacific Silver Fir',
    category: 'Softwood', greenLbsPerFt3: 43, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 5200,
    notes: 'Silver-white bark on mature trees. Pacific NW mid-elevation. Important timber species.' },

  // ── Douglas-Fir & Hemlock ────────────────────────────────────────

  { name: 'Douglas Fir',
    category: 'Softwood', greenLbsPerFt3: 37, airDryLbsPerFt3: 30, kilnDryLbsPerFt3: 27, morPsi: 7700,
    notes: 'Highest MOR among common conifers. Dominant timber species in Pacific NW. Mouse-tail cone bracts.' },

  { name: 'Eastern Hemlock',
    category: 'Softwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 5400,
    notes: 'Green density drops dramatically on drying. Hemlock Woolly Adelgid is critical mortality threat.' },

  { name: 'Western Hemlock',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 26, morPsi: 6200,
    notes: 'Stronger than Eastern Hemlock. Drooping leader tip is definitive field ID. Pacific NW timber dominant.' },

  { name: 'Mountain Hemlock',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 31, kilnDryLbsPerFt3: 28, morPsi: 6100,
    notes: 'High-elevation Pacific NW and AK. Bluish-green needles radiate all around twig. Deep snowpack adapted.' },

  // ── Larches ───────────────────────────────────────────────────────

  { name: 'Western Larch',
    category: 'Softwood', greenLbsPerFt3: 48, airDryLbsPerFt3: 36, kilnDryLbsPerFt3: 33, morPsi: 7700,
    notes: 'Deciduous conifer — drops needles in fall. One of the strongest western conifers. Fire-resistant thick bark.' },

  { name: 'Tamarack',
    category: 'Softwood', greenLbsPerFt3: 47, airDryLbsPerFt3: 36, kilnDryLbsPerFt3: 33, morPsi: 6400,
    notes: 'Eastern larch; deciduous conifer. Needles in tufts on short shoots, turn gold in fall. Boreal bogs.' },

  // ── Cedars & Cypress ─────────────────────────────────────────────

  { name: 'Western Red Cedar',
    category: 'Softwood', greenLbsPerFt3: 30, airDryLbsPerFt3: 23, kilnDryLbsPerFt3: 20, morPsi: 4900,
    notes: 'Very low density but exceptional decay resistance. Pacific NW old-growth icon. Used in shingles and siding.' },

  { name: 'Northern White Cedar',
    category: 'Softwood', greenLbsPerFt3: 28, airDryLbsPerFt3: 22, kilnDryLbsPerFt3: 19, morPsi: 3800,
    notes: 'Arborvitae — "tree of life." Lightest commercial eastern softwood. Excellent decay resistance. Deer browse.' },

  { name: 'Eastern Red Cedar',
    category: 'Softwood', greenLbsPerFt3: 48, airDryLbsPerFt3: 33, kilnDryLbsPerFt3: 30, morPsi: 4600,
    notes: 'Actually a juniper (Juniperus virginiana). Aromatic reddish heartwood. Very rot-resistant. Dense crown.' },

  { name: 'Incense Cedar',
    category: 'Softwood', greenLbsPerFt3: 45, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 5200,
    notes: 'Pencil cedar — pencils historically made from this wood. CA and OR foothills. Aromatic flat sprays.' },

  { name: 'Alaska Yellow Cedar',
    category: 'Softwood', greenLbsPerFt3: 38, airDryLbsPerFt3: 31, kilnDryLbsPerFt3: 28, morPsi: 6100,
    notes: 'Drooping foliage; slow-growing high-elevation AK/BC. Exceptional decay resistance. Decline from warming.' },

  { name: 'Port Orford Cedar',
    category: 'Softwood', greenLbsPerFt3: 36, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 26, morPsi: 6200,
    notes: 'Very limited coastal OR/CA range. Extremely rot-resistant. Targeted by Phytophthora lateralis — no spread!' },

  { name: 'Atlantic White Cedar',
    category: 'Softwood', greenLbsPerFt3: 28, airDryLbsPerFt3: 23, kilnDryLbsPerFt3: 20, morPsi: 4400,
    notes: 'Coastal swamps and bogs from ME to FL. Very decay-resistant. Rare; most old-growth logged long ago.' },

  { name: 'Bald Cypress',
    category: 'Softwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 32, kilnDryLbsPerFt3: 29, morPsi: 6600,
    notes: 'Exceptional decay resistance — "wood eternal." Pneumatophore knee roots in swamps. SE riparian icon.' },

  // ── Redwoods & Sequoias ────────────────────────────────────────────

  { name: 'Coast Redwood',
    category: 'Softwood', greenLbsPerFt3: 32, airDryLbsPerFt3: 26, kilnDryLbsPerFt3: 23, morPsi: 5500,
    notes: 'Tallest living trees on Earth (>380 ft). Fibrous bark up to 12" thick. Tannin-based decay resistance.' },

  { name: 'Giant Sequoia',
    category: 'Softwood', greenLbsPerFt3: 44, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4800,
    notes: 'Largest tree by volume on Earth. Up to 3,200 years old. Fire-adapted spongy bark. Sierra Nevada only.' },

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
