// Primary sources:
//   Density & MOR:        USDA Forest Products Laboratory — Wood Handbook (2021) Tables 4-3a/4-3b
//   Decay resistance:     USDA Wood Handbook (2021) Table 4-4 (heartwood ratings)
//   CODIT ratings:        Shigo, A.L. — A New Tree Biology (1986); Tree Decay: An Expanded Concept (1979)
//   Form factors:         Silvics of North America, USDA Agriculture Handbook 654 (1990)
//   Branch failure risk:  ISA Tree Risk Assessment Manual (2nd ed, 2017); Matheny & Clark (1994)
//   Operational notes:    Harris, Clark & Matheny — Arboriculture (4th ed); Dirr — Manual of Woody Landscape Plants
//   Species marked (*) use interpolated values where direct table data is unavailable.

export type Category = 'Hardwood' | 'Softwood';

export interface Species {
  name: string;
  category: Category;
  greenLbsPerFt3: number;
  airDryLbsPerFt3: number;
  kilnDryLbsPerFt3: number;
  morPsi: number;                          // Green MOR (psi) — USDA Wood Handbook Table 4-3
  formFactor?: number;                     // Whole-tree volume form factor; default 0.55 if omitted (Silvics of NA)
  codit?: 'strong' | 'moderate' | 'weak'; // Compartmentalization of Decay in Trees (Shigo)
  decayResistance?: 'resistant' | 'moderate' | 'susceptible'; // Heartwood only — USDA WH Table 4-4
  branchRisk?: 'low' | 'moderate' | 'high'; // Sudden Limb Failure tendency — ISA TRAM
  notes?: string;
}

export const SPECIES: Species[] = [

  // ════════════════════════════════════════════════════════════════
  // HARDWOODS
  // ════════════════════════════════════════════════════════════════

  // ── Oaks: White Oak Group ────────────────────────────────────────

  { name: 'White Oak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 47, kilnDryLbsPerFt3: 44, morPsi: 7400,
    formFactor: 0.52, codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Premier tie-in species. Tyloses in vessels actively seal decay columns (Shigo CODIT: strong). Heartwood resistant to decay — historic shipbuilding timber. Ring-porous; dense crown. Open-grown form is spreading, wide-crowned.' },

  { name: 'Bur Oak',
    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 7200,
    formFactor: 0.52, codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Extreme fire and drought resistance. Thick corky bark (2–4") insulates cambium. Tyloses seal wounds — strong compartmentalizer. Great Plains and Midwest staple. Deep taproot system.' },

  { name: 'Chestnut Oak',
    category: 'Hardwood', greenLbsPerFt3: 63, airDryLbsPerFt3: 47, kilnDryLbsPerFt3: 44, morPsi: 8300,
    codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Heaviest of the white oak group. Deeply furrowed bark on rocky ridges. Strong compartmentalization; resistant heartwood. Excellent long-term rigging anchor if structurally sound.' },

  { name: 'Post Oak',
    category: 'Hardwood', greenLbsPerFt3: 64, airDryLbsPerFt3: 52, kilnDryLbsPerFt3: 49, morPsi: 9100,
    formFactor: 0.52, codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Very rot-resistant white oak — heartwood lasts decades in soil (fence posts). Cross-shaped leaf lobes. Dry upland sites. Strong compartmentalizer; excellent rigging anchor.' },

  { name: 'Swamp White Oak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 48, kilnDryLbsPerFt3: 45, morPsi: 8300,
    codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Two-toned bark peels on upper branches. Strong CODIT response — tyloses seal vessels rapidly. Riparian bottomland; tolerates periodic inundation. Reliable rigging anchor.' },

  { name: 'Overcup Oak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 52, kilnDryLbsPerFt3: 49, morPsi: 7600,
    codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Acorn nearly enclosed by cap. SE bottomland species; tolerates prolonged flooding. White oak group: strong compartmentalization, resistant heartwood.' },

  { name: 'Oregon White Oak',
    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 8000,
    formFactor: 0.52, codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Only native oak in Pacific NW. Fire-adapted savanna species with thick bark. Strong compartmentalization; resistant heartwood. Often develops large spreading crown — good anchor.' },

  { name: 'Gambel Oak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 8200,
    codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Shrub to small tree in Rocky Mountain foothills. Often multi-stem from clonal root system. White oak group properties: resistant heartwood. Rarely a large rigging anchor due to size.' },

  // ── Oaks: Red Oak Group ───────────────────────────────────────────

  { name: 'Northern Red Oak',
    category: 'Hardwood', greenLbsPerFt3: 59, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 6800,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Fast-growing; good rigging wood but lacks tyloses (red oak group) — decay advances more readily than white oak after wounding. Assess older wounds carefully. Urban and forest dominant.' },

  { name: 'Pin Oak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 7000,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Very common urban street tree. Persistent dead lower branches (pin-like stubs) are a reliable field ID and decay entry point indicator. Red oak group: susceptible heartwood. Iron chlorosis common on alkaline soils.' },

  { name: 'Scarlet Oak',
    category: 'Hardwood', greenLbsPerFt3: 60, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 7900,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Brilliant scarlet fall color; deeply cut leaf sinuses. Red oak group: no tyloses. Often confused with Pin Oak in the field — deep sinuses nearly to midrib separate them.' },

  { name: 'Black Oak',
    category: 'Hardwood', greenLbsPerFt3: 61, airDryLbsPerFt3: 45, kilnDryLbsPerFt3: 42, morPsi: 6900,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Yellow-orange inner bark (quercitron tannin) is definitive ID. Widespread eastern red oak. Acorns ripen in second year. Susceptible heartwood — inspect wound columns carefully.' },

  { name: 'Water Oak',
    category: 'Hardwood', greenLbsPerFt3: 61, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 6600,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Variable leaf shapes on same tree — a reliable field ID. Common SE urban tree with shallow root system. Red oak group: susceptible heartwood. Shallow roots mean anchor assessment should include buttress.' },

  { name: 'Willow Oak',
    category: 'Hardwood', greenLbsPerFt3: 64, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 6900,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Narrow willow-like leaves; very atypical for an oak. Popular SE street tree. Dense, heavy wood but susceptible heartwood — check for internal decay in large specimens.' },

  { name: 'Shumard Oak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 45, kilnDryLbsPerFt3: 42, morPsi: 7600,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'low',
    notes: 'Large red oak of SE bottomlands. Excellent fall color. Good rigging species — strong wood and well-formed crown. Red oak group susceptible heartwood; still reliable when structurally sound.' },

  { name: 'Cherrybark Oak',
    category: 'Hardwood', greenLbsPerFt3: 64, airDryLbsPerFt3: 50, kilnDryLbsPerFt3: 47, morPsi: 10400,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'low',
    notes: 'Strongest common red oak — MOR nearly matches some white oaks. Cherry-like scaly bark. SE bottomlands. Susceptible heartwood despite high strength; structural sound trees make excellent rigging anchors.' },

  { name: 'Nuttall Oak',
    category: 'Hardwood', greenLbsPerFt3: 60, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 6700,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Bottomland red oak; Mississippi River valley. Very similar to Pin Oak in the field — geographic range is best separator. Fast-growing; red oak group susceptible heartwood.' },

  // ── Oaks: Western & Evergreen ────────────────────────────────────

  { name: 'Live Oak',
    category: 'Hardwood', greenLbsPerFt3: 75, airDryLbsPerFt3: 55, kilnDryLbsPerFt3: 52, morPsi: 9600,
    formFactor: 0.50, codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Heaviest native US oak. Evergreen. Historic naval shipbuilding timber (USS Constitution). Wide horizontal branching — inspect for included bark in codominant stems. SE coastal native; exceptional anchor.' },

  { name: 'California Black Oak',
    category: 'Hardwood', greenLbsPerFt3: 56, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 7200,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Dominant foothill oak in Sierra Nevada and Coast Ranges. Acorns critical wildlife food (Quercus kelloggii). Good rigging wood when sound. Red oak group: susceptible heartwood.' },

  { name: 'Canyon Live Oak',
    category: 'Hardwood', greenLbsPerFt3: 64, airDryLbsPerFt3: 55, kilnDryLbsPerFt3: 52, morPsi: 9100,
    codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Hardest CA oak; evergreen. Rocky canyon and mountain habitat. Called "iron oak" by early settlers — extremely tough. White-oak-like properties: strong CODIT, resistant heartwood. Excellent anchor.' },

  { name: 'Valley Oak',
    category: 'Hardwood', greenLbsPerFt3: 56, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 7400,
    formFactor: 0.52, codit: 'strong', decayResistance: 'moderate', branchRisk: 'low',
    notes: 'Largest western oak; iconic CA savanna species. Long drooping branches with pendulous tips. Deep taproot. Strong compartmentalization; heartwood moderately resistant. Majestic open-grown form.' },

  { name: 'Tanoak',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 49, kilnDryLbsPerFt3: 46, morPsi: 9600,
    codit: 'moderate', decayResistance: 'moderate', branchRisk: 'moderate',
    notes: 'Oak relative (Notholithocarpus densiflorus); not a true oak. Devastated by Sudden Oak Death (Phytophthora ramorum) — assess health carefully before any work. Pacific Coast forests.' },

  // ── Maples ───────────────────────────────────────────────────────

  { name: 'Sugar Maple',
    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 45, kilnDryLbsPerFt3: 42, morPsi: 7400,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Premier tie-in maple. Hard maple — the lumber standard. Moderate CODIT; wound columns stay contained but heartwood is susceptible. Sap taps and old pruning stubs can be decay entry points.' },

  { name: 'Red Maple',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 6500,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Most abundant tree in eastern North America. Fast growth = lower density than Sugar Maple. Moderate CODIT; susceptible heartwood. Check codominant stems for included bark — common in urban specimens.' },

  { name: 'Silver Maple',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 33, kilnDryLbsPerFt3: 30, morPsi: 5600,
    formFactor: 0.60, codit: 'weak', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Weak compartmentalization (Shigo) — decay columns spread rapidly after any wound. High SLF risk (Sudden Limb Failure) especially in summer heat. Codominant stems with included bark are common. Always use elevated safety factors and inspect thoroughly before rigging.' },

  { name: 'Black Maple',
    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 6500,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Nearly identical to Sugar Maple in the field — droopier leaves and hairy leaf undersides separate them. Often grows alongside Sugar Maple. Similar structural characteristics; moderate CODIT.' },

  { name: 'Bigleaf Maple',
    category: 'Hardwood', greenLbsPerFt3: 48, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 5700,
    formFactor: 0.58, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Largest native maple; leaves to 12". Documented for Sudden Limb Failure (SLF) — unexplained summer branch drop with no visible defect. Mosses and epiphytes mask decay on trunk. Inspect large branches carefully before rigging.' },

  { name: 'Box Elder',
    category: 'Hardwood', greenLbsPerFt3: 44, airDryLbsPerFt3: 30, kilnDryLbsPerFt3: 27, morPsi: 4400,
    codit: 'weak', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Only maple with compound leaves. Weakest maple — NOT suitable as rigging anchor. Weak compartmentalization; decay spreads rapidly from wounds. Riparian groves, often multi-stem and leaning. High branch failure risk.' },

  { name: 'Norway Maple',
    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 42, kilnDryLbsPerFt3: 39, morPsi: 7000,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Non-native; invasive in NE US forests. Milky sap when petiole is snapped — definitive ID from native maples. Similar wood strength to Sugar Maple. Moderate CODIT; susceptible heartwood.' },

  // ── Hickories ────────────────────────────────────────────────────

  { name: 'Shagbark Hickory',
    category: 'Hardwood', greenLbsPerFt3: 63, airDryLbsPerFt3: 50, kilnDryLbsPerFt3: 47, morPsi: 9200,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'low',
    notes: 'Classic shaggy plated bark. Exceptional shock resistance — historically used for tool handles, wheel spokes, drum sticks. Despite susceptible heartwood, tough interlocked wood resists splitting. Excellent rigging anchor when sound.' },

  { name: 'Shellbark Hickory',
    category: 'Hardwood', greenLbsPerFt3: 63, airDryLbsPerFt3: 50, kilnDryLbsPerFt3: 47, morPsi: 9200,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'low',
    notes: 'Very similar to Shagbark; larger leaflets (7 vs 5) and largest hickory nuts. Bottomland sites. Equal rigging strength to Shagbark. Susceptible heartwood — inspect wound history.' },

  { name: 'Mockernut Hickory',
    category: 'Hardwood', greenLbsPerFt3: 65, airDryLbsPerFt3: 51, kilnDryLbsPerFt3: 48, morPsi: 9300,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'low',
    notes: 'Heaviest of the hickories. Thick shell around small nut ("mockernut"). Upland dry sites. Exceptionally tough wood — excellent anchor species. Susceptible heartwood; inspect older trees.' },

  { name: 'Pignut Hickory',
    category: 'Hardwood', greenLbsPerFt3: 60, airDryLbsPerFt3: 49, kilnDryLbsPerFt3: 46, morPsi: 7800,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'low',
    notes: 'Smooth gray bark — distinct from Shagbark in the field. Upland sites. Strong and impact-resistant. Moderate CODIT; susceptible heartwood but good structural performance.' },

  { name: 'Bitternut Hickory',
    category: 'Hardwood', greenLbsPerFt3: 56, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 7800,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Sulfur-yellow buds are definitive field ID in winter. Bottomland to upland; broadest ecological range of any hickory. Bitter nut not eaten by most wildlife. Susceptible heartwood.' },

  { name: 'Water Hickory',
    category: 'Hardwood', greenLbsPerFt3: 61, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 7500,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'SE swamp and bottomland hickory. Compressed, winged nut husk. Tolerates prolonged flooding. Susceptible heartwood — buttress and root zone may show decay in flood-stressed trees.' },

  { name: 'Pecan',
    category: 'Hardwood', greenLbsPerFt3: 62, airDryLbsPerFt3: 47, kilnDryLbsPerFt3: 44, morPsi: 11000,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'low',
    notes: 'Hickory genus (Carya illinoinensis). Highest MOR of any hickory in the USDA table. Common SE nut orchard tree. Susceptible heartwood; check for pecan scab (Venturia effusa) and associated decay.' },

  // ── Ashes ────────────────────────────────────────────────────────

  { name: 'White Ash',
    category: 'Hardwood', greenLbsPerFt3: 46, airDryLbsPerFt3: 41, kilnDryLbsPerFt3: 38, morPsi: 6200,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Emerald Ash Borer (EAB) mortality is near-total in affected regions. Dead ash fails in unpredictable ways — epicormic sprouts on trunk indicate crown dieback. ALWAYS assess for internal decay and structural integrity before any rigging. Susceptible heartwood; moderate CODIT.' },

  { name: 'Green Ash',
    category: 'Hardwood', greenLbsPerFt3: 47, airDryLbsPerFt3: 40, kilnDryLbsPerFt3: 37, morPsi: 7100,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Most widely planted shade tree in North America — now decimated by EAB. High sudden branch failure risk in EAB-affected or recently dead trees. Assess all structural components critically; susceptible heartwood throughout.' },

  { name: 'Black Ash',
    category: 'Hardwood', greenLbsPerFt3: 45, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 5700,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Wetland ash; used in traditional Wabanaki basket-making (wood separates along growth rings). Lower strength than White/Green ash. EAB threatens; assess health before work. Susceptible heartwood.' },

  { name: 'Blue Ash',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 8600,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Strongest native ash. Square (4-sided) twigs are definitive field ID. Ozark Plateau and limestone glades. Inner bark turns blue in water. Shows some EAB resistance in some populations.' },

  { name: 'Oregon Ash',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 6300,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Only native ash in Pacific NW. Riparian sites; flood tolerant. Similar appearance to White Ash. EAB expanding westward — monitor health. Susceptible heartwood; riparian moisture can accelerate decay.' },

  // ── Birches ───────────────────────────────────────────────────────

  { name: 'Yellow Birch',
    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 8800,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Strongest birch. Golden-bronze peeling bark; wintergreen scent in crushed twigs. NE forests. Bronze Birch Borer can stress trees — inspect for dieback and associated decay. Susceptible heartwood.' },

  { name: 'Sweet Birch',
    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 47, kilnDryLbsPerFt3: 44, morPsi: 9400,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Highest MOR of any birch. Strong wintergreen/winterberry scent when twig is scratched — definitive field ID. Dark scaly bark on mature trees. Good rigging species when structurally sound.' },

  { name: 'Paper Birch',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 6400,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'White peeling bark. Short-lived pioneer species — trunk often hollow or decayed by maturity. Moderate strength but confirm stem integrity before rigging. Bronze Birch Borer accelerates decline.' },

  { name: 'River Birch',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 37, kilnDryLbsPerFt3: 34, morPsi: 7400,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Salmon to cinnamon flaking bark. Heat and flood tolerant — most southerly native birch. Common urban planting (especially multi-stem). Check codominant stems for included bark in multi-stem forms.' },

  { name: 'Gray Birch',
    category: 'Hardwood', greenLbsPerFt3: 46, airDryLbsPerFt3: 35, kilnDryLbsPerFt3: 32, morPsi: 5600,
    codit: 'weak', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Chalky white bark with dark triangular marks at branch bases. Short-lived NE pioneer. Often multi-stem clumps; inner stems frequently dead or decayed. Weak CODIT; not a reliable rigging anchor.' },

  // ── Hornbeams & Hophornbeam ───────────────────────────────────────

  { name: 'American Hornbeam',
    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 45, kilnDryLbsPerFt3: 42, morPsi: 7700,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'low',
    notes: 'Muscle-like fluted bark ("musclewood" or "blue beech"). Very dense understory tree — small bole rarely large enough for rigging anchor. Well-formed crown; low branch failure risk.' },

  { name: 'Eastern Hophornbeam',
    category: 'Hardwood', greenLbsPerFt3: 63, airDryLbsPerFt3: 51, kilnDryLbsPerFt3: 48, morPsi: 9000,
    codit: 'moderate', decayResistance: 'moderate', branchRisk: 'low',
    notes: 'Called "ironwood." Shreddy bark resembling hop seed clusters. Extremely hard — one of the densest eastern trees. Small understory; rarely rigging anchor. Moderate heartwood resistance; tough wood resists fungal penetration.' },

  // ── Locusts ───────────────────────────────────────────────────────

  { name: 'Black Locust',
    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 48, kilnDryLbsPerFt3: 45, morPsi: 16600,
    codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Highest MOR of any common NA hardwood. Exceptional decay resistance — fence posts documented for 100+ years in soil. Among the strongest compartmentalizers (Shigo). Paired thorns — PPE essential for all operations. Excellent rigging anchor when sound.' },

  { name: 'Honey Locust',
    category: 'Hardwood', greenLbsPerFt3: 60, airDryLbsPerFt3: 42, kilnDryLbsPerFt3: 39, morPsi: 10700,
    codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Extremely hard and durable. Large branched trunk thorns on wild forms (thornless cultivars common in urban settings). Strong compartmentalization; resistant heartwood. Excellent long-term anchor.' },

  { name: 'Kentucky Coffeetree',
    category: 'Hardwood', greenLbsPerFt3: 56, airDryLbsPerFt3: 43, kilnDryLbsPerFt3: 40, morPsi: 6400,
    codit: 'moderate', decayResistance: 'moderate', branchRisk: 'low',
    notes: 'Scaly ridged bark; large bipinnately compound leaves — one of the last to leaf out in spring. Very rot-resistant heartwood. Good urban tree — drought tolerant. Leaves, pods, and seeds toxic — wear gloves when handling debris.' },

  // ── Beech, Chestnut & Relatives ──────────────────────────────────

  { name: 'American Beech',
    category: 'Hardwood', greenLbsPerFt3: 54, airDryLbsPerFt3: 45, kilnDryLbsPerFt3: 42, morPsi: 8600,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Smooth gray bark wounds close slowly — cuts and carvings persist for life and provide decay pathways. Beech leaf disease (Neonectria + Litylenchus) emerging threat to populations. Moderate CODIT; susceptible heartwood. Check carved/wounded boles carefully.' },

  { name: 'American Chestnut',
    category: 'Hardwood', greenLbsPerFt3: 53, airDryLbsPerFt3: 30, kilnDryLbsPerFt3: 27, morPsi: 5300,
    codit: 'weak', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Functionally extinct from chestnut blight (Cryphonectria parasitica, introduced 1904). Root sprouts resprout but die back to blight cankers before maturity. Any specimens encountered are compromised structurally.' },

  // ── Walnuts & Cherry ─────────────────────────────────────────────

  { name: 'Black Walnut',
    category: 'Hardwood', greenLbsPerFt3: 58, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 7600,
    formFactor: 0.53, codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Strong compartmentalization (Shigo); resistant heartwood — boards recovered from buried logs are still sound. Juglone root exudate toxic to many plants (inform property owners). Wide open-grown crown; high-value timber — assess tree value before removing.' },

  { name: 'Black Cherry',
    category: 'Hardwood', greenLbsPerFt3: 45, airDryLbsPerFt3: 35, kilnDryLbsPerFt3: 32, morPsi: 8000,
    codit: 'moderate', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Exceptional MOR-to-weight ratio. Scaly dark bark with horizontal lenticels on mature trees. Resistant heartwood. Leaves/seeds contain cyanogenic glycosides — wilted leaves especially toxic to livestock.' },

  { name: 'Butternut',
    category: 'Hardwood', greenLbsPerFt3: 46, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 4700,
    codit: 'weak', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Lowest strength in the walnut family. Butternut Canker (Ophiognomonia clavigignenti) has devastated native populations — most standing butternuts show canker-induced structural compromise. Weak CODIT; do not use as rigging anchor without thorough inspection.' },

  // ── Elms & Hackberry ─────────────────────────────────────────────

  { name: 'American Elm',
    category: 'Hardwood', greenLbsPerFt3: 54, airDryLbsPerFt3: 39, kilnDryLbsPerFt3: 36, morPsi: 5600,
    formFactor: 0.58, codit: 'weak', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Interlocked grain resists splitting — good wood but weak CODIT means Dutch Elm Disease (Ophiostoma novo-ulmi) progresses rapidly and decay follows. Vase-shaped crown. Most urban specimens are diseased or dead; assess structural integrity critically before any work.' },

  { name: 'Slippery Elm',
    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 7200,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Stronger than American Elm. Mucilaginous (slippery) inner bark — traditional medicinal use. More DED-resistant than American Elm; better compartmentalization. Rough sandpaper-textured leaves.' },

  { name: 'Rock Elm',
    category: 'Hardwood', greenLbsPerFt3: 56, airDryLbsPerFt3: 44, kilnDryLbsPerFt3: 41, morPsi: 9800,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'low',
    notes: 'Strongest elm; corky-winged twigs are definitive field ID. Limited range (Great Lakes); historically used in ship construction. Good rigging wood when structurally sound. Moderate CODIT.' },

  { name: 'Winged Elm',
    category: 'Hardwood', greenLbsPerFt3: 57, airDryLbsPerFt3: 46, kilnDryLbsPerFt3: 43, morPsi: 7600,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Corky wing ridges on twigs are diagnostic. SE small to medium tree on drier sites than other elms. Moderate compartmentalization; susceptible heartwood. Good structural wood when sound.' },

  { name: 'Hackberry',
    category: 'Hardwood', greenLbsPerFt3: 53, airDryLbsPerFt3: 37, kilnDryLbsPerFt3: 34, morPsi: 7100,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Corky warty bark is definitive field ID. Witches broom (Eriophyid mite + powdery mildew complex) is very common but cosmetic. Moderate compartmentalization; assess older wounds for decay penetration.' },

  // ── Poplars & Aspens ─────────────────────────────────────────────

  { name: 'Quaking Aspen',
    category: 'Hardwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 26, kilnDryLbsPerFt3: 24, morPsi: 4300,
    codit: 'weak', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Most widely distributed North American tree. Clonal colonies — all stems share one root system. Heartrot fungus (Phellinus tremulae) is nearly universal in mature trees; most large aspens are hollow. Weak compartmentalization. NOT a reliable rigging anchor.' },

  { name: 'Bigtooth Aspen',
    category: 'Hardwood', greenLbsPerFt3: 43, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4000,
    codit: 'weak', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Larger leaf teeth than Quaking Aspen. NE and Great Lakes pioneer after disturbance. Clonal. Weak compartmentalization; heartrot nearly universal in older trees. High branch and stem failure risk.' },

  { name: 'Eastern Cottonwood',
    category: 'Hardwood', greenLbsPerFt3: 49, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4400,
    formFactor: 0.53, codit: 'weak', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Extremely fast-growing but very weak wood. Internal decay (heartrot) almost universal in mature specimens. Cottony seeds (early summer) = field ID. Prone to catastrophic stem and branch failure in wind or heat. NOT suitable as rigging anchor without exceptional inspection.' },

  { name: 'Black Cottonwood',
    category: 'Hardwood', greenLbsPerFt3: 38, airDryLbsPerFt3: 24, kilnDryLbsPerFt3: 22, morPsi: 3900,
    formFactor: 0.53, codit: 'weak', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Largest western cottonwood; Pacific NW riparian giant. Balsam-scented buds in spring. Very weak wood; weak CODIT — decay spreads rapidly. Most large trees are substantially hollow. Use extreme caution; not a safe rigging anchor.' },

  // ── Magnolias ────────────────────────────────────────────────────

  { name: 'Southern Magnolia',
    category: 'Hardwood', greenLbsPerFt3: 52, airDryLbsPerFt3: 33, kilnDryLbsPerFt3: 30, morPsi: 6800,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Evergreen broadleaf with large waxy leaves. SE US native. Rope bark protection important — thin bark. Moderate CODIT; susceptible heartwood. Large root plate; buttress for anchoring. Generally good structural form.' },

  { name: 'Cucumber Tree',
    category: 'Hardwood', greenLbsPerFt3: 52, airDryLbsPerFt3: 33, kilnDryLbsPerFt3: 30, morPsi: 6800,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Largest native magnolia. Cucumber-shaped green fruit clusters in summer. Appalachian forest species. Straight bole; similar wood properties to Southern Magnolia. Moderate CODIT.' },

  { name: 'Yellow Poplar',
    category: 'Hardwood', greenLbsPerFt3: 38, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 26, morPsi: 5600,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'low',
    notes: 'Tallest eastern hardwood despite low density. Fast-growing with straight clear bole; tulip-shaped flowers. Moderate CODIT; susceptible heartwood. Poplar weevil and Liriodendron aphid can weaken trees. Low branch failure risk in healthy specimens.' },

  // ── Willows ───────────────────────────────────────────────────────

  { name: 'Black Willow',
    category: 'Hardwood', greenLbsPerFt3: 53, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 26, morPsi: 4000,
    formFactor: 0.53, codit: 'weak', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Largest native willow; riparian and wet sites. Weak compartmentalization — extensive internal decay is the norm, not the exception, in large specimens. Very flexible but structurally unreliable. NOT suitable as rigging anchor. Leaning stems common.' },

  // ── Miscellaneous Hardwoods ──────────────────────────────────────

  { name: 'Osage Orange',
    category: 'Hardwood', greenLbsPerFt3: 64, airDryLbsPerFt3: 54, kilnDryLbsPerFt3: 51, morPsi: 16700,
    codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Densest and strongest common NA hardwood. Exceptional decay resistance — documented 100+ year posts. Among strongest compartmentalizers. Milky sap; thorns on wild forms — full PPE. "Bodark" or hedge apple. Exceptional rigging anchor.' },

  { name: 'Sweetgum',
    category: 'Hardwood', greenLbsPerFt3: 51, airDryLbsPerFt3: 37, kilnDryLbsPerFt3: 34, morPsi: 6300,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Star-shaped leaves; corky-ridged twigs; spiky gumball seed pods. Interlocked grain resists splitting. Common SE and lower Midwest species. Moderate CODIT; susceptible heartwood. Corky ridges on twigs often confused with Winged Elm.' },

  { name: 'American Sycamore',
    category: 'Hardwood', greenLbsPerFt3: 52, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 5200,
    formFactor: 0.56, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Mottled white/gray/green bark that exfoliates in patches — unmistakable field ID. Massive crown spread; riparian corridor dominant. Interlocked grain. Sycamore canker (Apiognomonia veneta) is common cosmetic disease. Inspect for internal decay in large specimens.' },

  { name: 'American Basswood',
    category: 'Hardwood', greenLbsPerFt3: 42, airDryLbsPerFt3: 26, kilnDryLbsPerFt3: 23, morPsi: 4300,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Softest common hardwood. Honeybees favor the nectar — important pollinator tree. High green-to-dry weight loss; lighter when dry. Often multi-stem. Susceptible heartwood; inspect for decay in any wound areas.' },

  { name: 'Black Tupelo',
    category: 'Hardwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 35, kilnDryLbsPerFt3: 32, morPsi: 5800,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'low',
    notes: 'Black Gum. Brilliant scarlet fall color. Interlocked grain resists splitting — difficulty processing is a field cue. Riparian to upland. Moderate CODIT; susceptible heartwood. Low branch failure risk; generally sound structure.' },

  { name: 'Persimmon',
    category: 'Hardwood', greenLbsPerFt3: 67, airDryLbsPerFt3: 52, kilnDryLbsPerFt3: 50, morPsi: 8900,
    codit: 'strong', decayResistance: 'moderate', branchRisk: 'low',
    notes: 'Heaviest common eastern hardwood after Live Oak. Distinctive block-pattern bark (alligator skin). Orange edible fruit after frost. Strong compartmentalization; moderate heartwood resistance. Small tree — rarely a large rigging anchor.' },

  { name: 'Sassafras',
    category: 'Hardwood', greenLbsPerFt3: 40, airDryLbsPerFt3: 31, kilnDryLbsPerFt3: 28, morPsi: 5700,
    codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Three distinct leaf shapes on same tree — mitten, tri-lobed, unlobed. Root bark aromatic (safrole). Resistant heartwood; strong CODIT for a pioneer species. Often multi-stem clonal colonies.' },

  { name: 'Northern Catalpa',
    category: 'Hardwood', greenLbsPerFt3: 36, airDryLbsPerFt3: 26, kilnDryLbsPerFt3: 23, morPsi: 6400,
    codit: 'moderate', decayResistance: 'resistant', branchRisk: 'moderate',
    notes: 'Exceptional decay resistance despite low density — historically used for fence posts. Heart-shaped leaves; long bean-like pods; showy white flowers. Moderate CODIT. Relatively weak wood — do not rely on MOR alone; assess structural form carefully.' },

  { name: 'American Holly',
    category: 'Hardwood', greenLbsPerFt3: 66, airDryLbsPerFt3: 40, kilnDryLbsPerFt3: 37, morPsi: 6100,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'low',
    notes: 'Only native evergreen broadleaf in the NE US. Dense, heavy wood. Spiny leaves — long sleeves and gloves recommended. Small tree; rarely a rigging anchor. Moderate CODIT; susceptible heartwood.' },

  { name: 'Red Alder',
    category: 'Hardwood', greenLbsPerFt3: 46, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 26, morPsi: 6500,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Most important commercial hardwood in Pacific NW. Fixes nitrogen via Frankia root nodules — enriches soil. Short-lived; heartrot common in older trees. Coastal riparian groves. Susceptible heartwood; inspect large specimens.' },

  { name: 'Yellow Buckeye',
    category: 'Hardwood', greenLbsPerFt3: 43, airDryLbsPerFt3: 25, kilnDryLbsPerFt3: 22, morPsi: 4700,
    codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Palmate compound leaves (5 leaflets); spiny seed husks. Appalachian forest. Toxic seeds, bark, and leaves (Aescin glycosides) — wear gloves handling debris. Weak wood; susceptible heartwood. Not recommended as rigging anchor.' },

  // ════════════════════════════════════════════════════════════════
  // SOFTWOODS
  // ════════════════════════════════════════════════════════════════

  // ── Pines: Eastern & Southern ────────────────────────────────────

  { name: 'Eastern White Pine',
    category: 'Softwood', greenLbsPerFt3: 36, airDryLbsPerFt3: 25, kilnDryLbsPerFt3: 22, morPsi: 4000,
    formFactor: 0.45, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Softest common eastern pine. 5 needles per bundle — definitive ID. Historically tallest eastern tree (>200 ft). White Pine Blister Rust (Cronartium ribicola) can girdle stems. Susceptible heartwood; resin helps exclude some decay. Conical form factor.' },

  { name: 'Red Pine',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 26, morPsi: 5600,
    formFactor: 0.48, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Orange-red bark in upper crown — reliable field ID. Widely planted in northern states. Paired needles. Plantation dominant; Diplodia tip blight and Armillaria root rot common in stressed stands.' },

  { name: 'Loblolly Pine',
    category: 'Softwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 31, kilnDryLbsPerFt3: 28, morPsi: 7300,
    formFactor: 0.50, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Dominant plantation pine of southeastern US. High resin content — sticky pitch wells under bark (field ID cue). Fusiform rust and Southern Pine Beetle are key mortality agents. High MOR for a pine; good rigging anchor when sound.' },

  { name: 'Longleaf Pine',
    category: 'Softwood', greenLbsPerFt3: 55, airDryLbsPerFt3: 41, kilnDryLbsPerFt3: 38, morPsi: 8500,
    formFactor: 0.48, codit: 'moderate', decayResistance: 'moderate', branchRisk: 'low',
    notes: 'Strongest native pine. Old-growth nearly gone; fire-adapted ecosystem. Needles up to 18" in bundles of 3. Moderate heartwood decay resistance (resin-saturated). Excellent rigging anchor when mature; deep taproot for stability.' },

  { name: 'Slash Pine',
    category: 'Softwood', greenLbsPerFt3: 55, airDryLbsPerFt3: 38, kilnDryLbsPerFt3: 35, morPsi: 7800,
    formFactor: 0.48, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Fast-growing SE plantation pine. High resin content. Needles 2-3 per bundle, 8-12" long. Turpentine production historically. Fusiform rust causes spindle-shaped galls that structurally weaken stems.' },

  { name: 'Shortleaf Pine',
    category: 'Softwood', greenLbsPerFt3: 45, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 6800,
    formFactor: 0.48, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Widest natural range of any southern pine. Paired needles; small cones with prickles. Drought tolerant. Can regenerate from epicormic buds after fire or cutting. Susceptible heartwood; check base for Annosum root rot in plantation settings.' },

  { name: 'Virginia Pine',
    category: 'Softwood', greenLbsPerFt3: 46, airDryLbsPerFt3: 33, kilnDryLbsPerFt3: 30, morPsi: 6200,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Scrub pine of SE uplands and mountain slopes. Often crooked, irregular form — confirm structure before rigging. Persistent dead branches common. Commonly used as Christmas trees. Susceptible heartwood.' },

  { name: 'Pitch Pine',
    category: 'Softwood', greenLbsPerFt3: 55, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 6400,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'moderate', branchRisk: 'moderate',
    notes: 'Extremely resinous — historically mined for tar, pitch, and turpentine. Needles 3 per bundle; persistent cones. NE coastal plains and Pine Barrens. Moderate heartwood resistance from resin impregnation. Fire-adapted with thick bark.' },

  { name: 'Jack Pine',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 27, morPsi: 4700,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Northernmost North American pine. Serotinous cones require fire heat to open. Kirtland\'s Warbler depends on young Jack Pine stands. Susceptible heartwood; often gnarly form in open-grown conditions.' },

  // ── Pines: Western ────────────────────────────────────────────────

  { name: 'Ponderosa Pine',
    category: 'Softwood', greenLbsPerFt3: 51, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4600,
    formFactor: 0.45, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Dominant western pine over vast range. Vanilla/butterscotch scent in bark crevices on warm days — reliable field ID. 3-needle bundles; long-lived. Mountain Pine Beetle (MPB) is primary mortality agent. Susceptible heartwood; inspect for Heterobasidion root disease at base.' },

  { name: 'Lodgepole Pine',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 27, morPsi: 4500,
    formFactor: 0.48, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Thin straight trunk; historically used for tipi poles. Serotinous cones open in fire. Mountain Pine Beetle (MPB) has killed hundreds of millions across the West — assess health carefully. Susceptible heartwood. Straight form is an asset for rigging if structurally sound.' },

  { name: 'Jeffrey Pine',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4400,
    formFactor: 0.46, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Vanilla-scented bark like Ponderosa Pine but found at higher elevations. Prickles point inward on cone ("gentle Jeffrey"). CA/NV/OR high-elevation. Susceptible heartwood; similar operational considerations to Ponderosa.' },

  { name: 'Sugar Pine',
    category: 'Softwood', greenLbsPerFt3: 35, airDryLbsPerFt3: 25, kilnDryLbsPerFt3: 23, morPsi: 4300,
    formFactor: 0.48, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'World\'s largest pine species by combined height and volume. Cones up to 20". White Pine Blister Rust (Cronartium ribicola) is an existential threat. Low-density wood; susceptible heartwood. Confirm structural integrity before rigging large specimens.' },

  { name: 'Western White Pine',
    category: 'Softwood', greenLbsPerFt3: 36, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 4700,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: '5 needles per bundle. Pacific NW; formerly dominant until White Pine Blister Rust (Cronartium ribicola) spread after 1910. Susceptible heartwood. Inspect for rust cankers on stems.' },

  { name: 'Pinyon Pine',
    category: 'Softwood', greenLbsPerFt3: 40, airDryLbsPerFt3: 34, kilnDryLbsPerFt3: 31, morPsi: 6200,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'moderate', branchRisk: 'moderate',
    notes: 'SW woodland; produces edible pine nuts (seeds). Drought-tolerant; fire-adapted. Short stature rarely provides a large rigging anchor. Moderate heartwood resistance from heavy resin content. IPS beetle mortality during drought periods.' },

  // ── Spruces ───────────────────────────────────────────────────────

  { name: 'Sitka Spruce',
    category: 'Softwood', greenLbsPerFt3: 33, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 5700,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Best strength-to-weight of any conifer — used in WWI/WWII aircraft frames and instrument soundboards. Coastal Pacific NW; requires maritime fog. Susceptible heartwood; Sitka spruce weevil damages terminal leaders of young trees. Impressive MOR for low density.' },

  { name: 'White Spruce',
    category: 'Softwood', greenLbsPerFt3: 34, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 4500,
    formFactor: 0.45, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Widespread boreal dominant. Skunk-like odor when needles or bark is crushed — reliable field ID. Shallow roots on wet sites = high windthrow risk; inspect root zone and lean. Spruce budworm can cause severe defoliation and mortality.' },

  { name: 'Red Spruce',
    category: 'Softwood', greenLbsPerFt3: 34, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 5200,
    formFactor: 0.45, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'NE mountain spruce; sensitive to acid rain — high-elevation populations declined significantly. Guitar and violin soundboard wood of choice (Adirondack spruce). Reddish-brown scaly bark. Spruce budworm target.' },

  { name: 'Black Spruce',
    category: 'Softwood', greenLbsPerFt3: 36, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 5000,
    formFactor: 0.43, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Boreal bog and muskeg dominant; grows in standing water. Distinctive clubs of dense foliage at crown top. Very slow-growing in peat; small diameter rarely provides rigging anchor. Susceptible heartwood.' },

  { name: 'Blue Spruce',
    category: 'Softwood', greenLbsPerFt3: 38, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4800,
    formFactor: 0.45, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Waxy blue-white needles with distinctive sharp prickle. Native to Rocky Mountain streambanks; widely planted nationwide as ornamental. Rhizosphaera needle cast is widespread on planted specimens. Susceptible heartwood.' },

  { name: 'Engelmann Spruce',
    category: 'Softwood', greenLbsPerFt3: 33, airDryLbsPerFt3: 23, kilnDryLbsPerFt3: 21, morPsi: 4000,
    formFactor: 0.45, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'High-elevation Rocky Mountain and Pacific NW spruce. Flexible, low-density wood. Skunk smell when bruised — like White Spruce. Spruce beetle has caused massive die-offs in warmer years. Susceptible heartwood.' },

  { name: 'Norway Spruce',
    category: 'Softwood', greenLbsPerFt3: 34, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 4500,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Non-native plantation and ornamental. Pendulous branch tips (weeping secondary branches) are definitive field ID. Common holiday/Christmas tree. Similar properties to White Spruce. Spruce budworm and Cytospora canker common.' },

  // ── True Firs (Abies) ─────────────────────────────────────────────

  { name: 'Balsam Fir',
    category: 'Softwood', greenLbsPerFt3: 45, airDryLbsPerFt3: 25, kilnDryLbsPerFt3: 22, morPsi: 3900,
    formFactor: 0.45, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Classic Christmas tree aroma from resin blisters on bark. NE and Great Lakes boreal. Spruce budworm is primary mortality agent — whole stands can die in outbreaks. Lowest MOR of any fir; susceptible heartwood. Shallow roots = windthrow risk.' },

  { name: 'White Fir',
    category: 'Softwood', greenLbsPerFt3: 37, airDryLbsPerFt3: 26, kilnDryLbsPerFt3: 23, morPsi: 4400,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Silver-blue foliage; needles curve upward. West Coast and Rocky Mountains. Bark turns pale gray and corky on old trees. Balsam Woolly Adelgid (BWA) can kill trees. Susceptible heartwood; check for Armillaria root disease at base.' },

  { name: 'Grand Fir',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 4900,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Flat sprays of needles in two distinct lengths (long and short alternating). Pacific NW lowlands. Strong citrus scent when crushed. Susceptible heartwood; Heterobasidion root disease common in managed stands.' },

  { name: 'Red Fir',
    category: 'Softwood', greenLbsPerFt3: 47, airDryLbsPerFt3: 31, kilnDryLbsPerFt3: 28, morPsi: 5800,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Sierra Nevada high-elevation dominant (6,000–9,000 ft). Reddish-brown furrowed bark on mature trees. Dense stands in heavy snowpack zones. Susceptible heartwood. Often develops large diameter — good rigging anchor if structurally sound.' },

  { name: 'Noble Fir',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 5900,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Largest of the true firs. Cascades and Olympics. Premium Christmas wreath and tree source due to stiff branches. Long-lived. Susceptible heartwood; Armillaria root disease common in older stands.' },

  { name: 'Subalpine Fir',
    category: 'Softwood', greenLbsPerFt3: 38, airDryLbsPerFt3: 24, kilnDryLbsPerFt3: 21, morPsi: 3600,
    formFactor: 0.43, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'high',
    notes: 'Spire-like crown adapted for heavy snowpack. Treeline species; extreme weather exposure causes wind and snow damage. Weakest fir; susceptible heartwood. High windsnap risk at high elevations. Not recommended as rigging anchor in exposed settings.' },

  { name: 'Pacific Silver Fir',
    category: 'Softwood', greenLbsPerFt3: 43, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 5200,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Silver-white bark on mature trees. Pacific NW mid-elevation forests. Important timber species. Balsam Woolly Adelgid (BWA) increasingly threatening Pacific silver fir stands. Susceptible heartwood.' },

  // ── Douglas-Fir & Hemlock ────────────────────────────────────────

  { name: 'Douglas Fir',
    category: 'Softwood', greenLbsPerFt3: 37, airDryLbsPerFt3: 30, kilnDryLbsPerFt3: 27, morPsi: 7700,
    formFactor: 0.48, codit: 'moderate', decayResistance: 'moderate', branchRisk: 'low',
    notes: 'Highest MOR among common conifers. Dominant timber species in Pacific NW. Mouse-tail cone bracts (3-pronged) are diagnostic. Moderate heartwood resistance — old-growth timber is durable. Excellent rigging anchor; deep root system provides good wind firmness.' },

  { name: 'Eastern Hemlock',
    category: 'Softwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 5400,
    formFactor: 0.48, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Green density drops dramatically on drying — heaviest eastern hemlock is the green stem. Hemlock Woolly Adelgid (HWA) is a critical mortality threat; inspect crowns for white cottony masses on undersides of twigs. Susceptible heartwood; declining trees have compromised structure.' },

  { name: 'Western Hemlock',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 26, morPsi: 6200,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'Stronger than Eastern Hemlock. Drooping terminal leader tip — definitive field ID at a distance. Pacific NW timber dominant. Susceptible heartwood; Heterobasidion root disease common. Check for butt rot in old-growth specimens.' },

  { name: 'Mountain Hemlock',
    category: 'Softwood', greenLbsPerFt3: 41, airDryLbsPerFt3: 31, kilnDryLbsPerFt3: 28, morPsi: 6100,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'susceptible', branchRisk: 'moderate',
    notes: 'High-elevation Pacific NW and AK. Bluish-green needles radiate all around twig — unlike Western Hemlock. Heavy snowpack adapted; can survive burial under winter snow. Susceptible heartwood.' },

  // ── Larches ───────────────────────────────────────────────────────

  { name: 'Western Larch',
    category: 'Softwood', greenLbsPerFt3: 48, airDryLbsPerFt3: 36, kilnDryLbsPerFt3: 33, morPsi: 7700,
    formFactor: 0.48, codit: 'strong', decayResistance: 'moderate', branchRisk: 'low',
    notes: 'Deciduous conifer — needles in clusters turn gold and drop in fall. One of the strongest western conifers. Thick bark (to 6") is highly fire-resistant. Strong compartmentalization for a conifer; moderate heartwood resistance. Excellent rigging anchor.' },

  { name: 'Tamarack',
    category: 'Softwood', greenLbsPerFt3: 47, airDryLbsPerFt3: 36, kilnDryLbsPerFt3: 33, morPsi: 6400,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'moderate', branchRisk: 'moderate',
    notes: 'Eastern larch; deciduous conifer — needles in tufts turn gold in fall. Boreal bogs and cold swamps. Larch sawfly can cause heavy defoliation. Moderate heartwood resistance. Small bole diameter in boreal conditions; good wood when structurally sound.' },

  // ── Cedars & Cypress ─────────────────────────────────────────────

  { name: 'Western Red Cedar',
    category: 'Softwood', greenLbsPerFt3: 30, airDryLbsPerFt3: 23, kilnDryLbsPerFt3: 20, morPsi: 4900,
    formFactor: 0.42, codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Very low density but exceptional heartwood decay resistance — Thujaplicin compounds inhibit fungi. Strongly tapered bole (low form factor). Pacific NW old-growth icon; culturally critical species. Strong compartmentalization. Shingles, siding, and totems rely on heartwood durability.' },

  { name: 'Northern White Cedar',
    category: 'Softwood', greenLbsPerFt3: 28, airDryLbsPerFt3: 22, kilnDryLbsPerFt3: 19, morPsi: 3800,
    formFactor: 0.47, codit: 'moderate', decayResistance: 'resistant', branchRisk: 'moderate',
    notes: 'Arborvitae — "tree of life." Lightest commercial eastern softwood. Excellent heartwood decay resistance despite low density. Heavy deer browse limits regeneration in overpopulated areas. Weak MOR — assess structural form carefully before rigging.' },

  { name: 'Eastern Red Cedar',
    category: 'Softwood', greenLbsPerFt3: 48, airDryLbsPerFt3: 33, kilnDryLbsPerFt3: 30, morPsi: 4600,
    formFactor: 0.47, codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Actually a juniper (Juniperus virginiana). Aromatic reddish heartwood — cedar chests, pencils, fence posts. Very rot-resistant; documented fence posts lasting 30+ years. Strong compartmentalization. Dense crown; important wildlife tree (Cedar Waxwing host).' },

  { name: 'Incense Cedar',
    category: 'Softwood', greenLbsPerFt3: 45, airDryLbsPerFt3: 27, kilnDryLbsPerFt3: 24, morPsi: 5200,
    formFactor: 0.48, codit: 'moderate', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Pencil cedar — pencils historically made from this wood (replaced Eastern Red Cedar). CA and OR foothills. Aromatic flat sprays; irregular fluted bole. Resistant heartwood. Polyporus (heartrot) can hollow large trees — inspect with sounding mallet.' },

  { name: 'Alaska Yellow Cedar',
    category: 'Softwood', greenLbsPerFt3: 38, airDryLbsPerFt3: 31, kilnDryLbsPerFt3: 28, morPsi: 6100,
    formFactor: 0.46, codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Drooping foliage and branches; slow-growing high-elevation AK/BC species. Exceptional heartwood decay resistance — very resistant (USDA WH). Climate-driven decline (Alaska Yellow Cedar Decline) from loss of insulating snowpack. Strong CODIT.' },

  { name: 'Port Orford Cedar',
    category: 'Softwood', greenLbsPerFt3: 36, airDryLbsPerFt3: 29, kilnDryLbsPerFt3: 26, morPsi: 6200,
    formFactor: 0.47, codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Very limited coastal OR/CA range. Extremely rot-resistant. Targeted by Phytophthora lateralis (Port Orford Cedar Root Disease) — spread via equipment, water, boots. Decontaminate all tools and boots before entering stands. Strong CODIT; resistant heartwood.' },

  { name: 'Atlantic White Cedar',
    category: 'Softwood', greenLbsPerFt3: 28, airDryLbsPerFt3: 23, kilnDryLbsPerFt3: 20, morPsi: 4400,
    formFactor: 0.45, codit: 'moderate', decayResistance: 'resistant', branchRisk: 'moderate',
    notes: 'Coastal swamps and bogs from ME to FL. Very decay-resistant heartwood — ancient logs found in NJ peat bogs are still usable. Rare; most old-growth was logged for boat planking. Low-density wood; assess form carefully.' },

  { name: 'Bald Cypress',
    category: 'Softwood', greenLbsPerFt3: 50, airDryLbsPerFt3: 32, kilnDryLbsPerFt3: 29, morPsi: 6600,
    formFactor: 0.45, codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: '"Wood eternal" — heartwood one of the most decay-resistant in North America (old growth). Pneumatophore knee roots in swamps provide gas exchange. Strong compartmentalization. SE riparian icon. Note: second-growth timber is considerably less resistant than old-growth heartwood.' },

  // ── Redwoods & Sequoias ────────────────────────────────────────────

  { name: 'Coast Redwood',
    category: 'Softwood', greenLbsPerFt3: 32, airDryLbsPerFt3: 26, kilnDryLbsPerFt3: 23, morPsi: 5500,
    formFactor: 0.40, codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Tallest living trees on Earth (>380 ft). Fibrous bark up to 12" thick — excellent fire resistance. Tannin (polyphenol) and Sequirin compounds provide heartwood decay resistance. Strong CODIT. Strongly conical form factor (0.40). Fog-belt CA/OR habitat.' },

  { name: 'Giant Sequoia',
    category: 'Softwood', greenLbsPerFt3: 44, airDryLbsPerFt3: 28, kilnDryLbsPerFt3: 25, morPsi: 4800,
    formFactor: 0.45, codit: 'strong', decayResistance: 'resistant', branchRisk: 'low',
    notes: 'Largest tree by volume on Earth (>52,000 ft³). Up to 3,200 years old. Fire-adapted spongy bark to 3 ft thick. Tannin-rich heartwood extremely resistant to decay. Strong CODIT. Sierra Nevada only; protected in national parks and forests.' },

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
