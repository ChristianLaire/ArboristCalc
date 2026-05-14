import { useState, useEffect, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, TouchableOpacity } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import NumericInput from '@/components/NumericInput';
import ResultCard from '@/components/ResultCard';
import SafetyBadge from '@/components/SafetyBadge';
import LegalBanner from '@/components/LegalBanner';
import { SPECIES, Species, Category, getByCategory } from '@/data/species';
import { calcAnchor, DecayLevel, SafetyFactor } from '@/math/anchor';
import { frozenWoodFactor, frozenWoodLabel } from '@/math/environmental';
import { STATE_TO_REGION, SPECIES_REGIONS, REGION_LABELS, Region } from '@/data/speciesRanges';
import { FF, T, R, TOUCH_TARGET, ColorPalette } from '@/theme';
import { useColors } from '@/context/ThemeContext';
import { useAutosave, loadAutosaved } from '@/hooks/useAutosave';

type AnchorSave = { load: string; momentArm: string; actualDiameter: string; category: Category; speciesName: string; decay: DecayLevel; sf: SafetyFactor; tempF: string };

const DECAY_OPTIONS: { label: string; value: DecayLevel }[] = [
  { label: 'None', value: 'none' },
  { label: 'Minor', value: 'minor' },
  { label: 'Significant', value: 'significant' },
];

const SF_OPTIONS: { label: string; value: SafetyFactor }[] = [
  { label: 'Rigging (3×)', value: 'rigging' },
  { label: 'Life Safety (5×)', value: 'lifeSafety' },
];

interface CustomSpecies extends Species { isCustom: true; }

function makeStyles(C: ColorPalette) {
  return StyleSheet.create({
    screen:       { backgroundColor: C.bg },
    container:    { padding: 16, paddingBottom: 56 },
    sectionLabel: { fontSize: T.base, fontFamily: FF.bold, color: C.green900, marginTop: 20, marginBottom: 8 },
    segment:      { marginBottom: 8 },

    chipRow: { flexDirection: 'row', marginBottom: 4 },
    chip: {
      paddingHorizontal: 16, paddingVertical: 10, borderRadius: R.pill,
      backgroundColor: C.card, marginRight: 8, marginBottom: 8,
      borderWidth: 1.5, borderColor: C.border,
    },
    chipActive:  { backgroundColor: C.green900, borderColor: C.green900 },
    chipCustom:  { backgroundColor: C.importBg, borderColor: C.importBorder },
    chipText:    { fontSize: T.sm, fontFamily: FF.semibold, color: C.textMid },
    chipTextActive: { color: '#fff', fontFamily: FF.bold },

    importBanner: {
      backgroundColor: C.importBg, borderRadius: R.md, padding: 13,
      marginBottom: 16, borderLeftWidth: 4, borderLeftColor: C.importBorder,
    },
    importText: { fontSize: T.sm, fontFamily: FF.semibold, color: C.importText },

    regionBanner: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: C.green50, borderRadius: R.md, padding: 11, marginBottom: 11,
      borderLeftWidth: 4, borderLeftColor: C.green800,
    },
    regionBannerText: { fontSize: T.sm, fontFamily: FF.bold, color: C.green900, flex: 1 },
    regionToggle:     { fontSize: T.sm, fontFamily: FF.bold, color: C.ctaOrange, marginLeft: 8 },

    noteBox: {
      backgroundColor: C.green50, borderRadius: R.md, padding: 12,
      marginBottom: 6, borderLeftWidth: 4, borderLeftColor: C.green800,
    },
    noteBoxFrozen:  { backgroundColor: C.importBg, borderLeftColor: C.importBorder },
    noteText:       { fontSize: T.sm, fontFamily: FF.normal, color: C.green900, lineHeight: 20 },
    noteTextFrozen: { color: C.importText },
  });
}

export default function AnchorScreen() {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const [load, setLoad]                     = useState('');
  const [momentArm, setMomentArm]           = useState('1.0');
  const [actualDiameter, setActualDiameter] = useState('');
  const [category, setCategory]             = useState<Category>('Hardwood');
  const [species, setSpecies]               = useState<Species>(SPECIES[0]);
  const [decay, setDecay]                   = useState<DecayLevel>('none');
  const [sf, setSf]                         = useState<SafetyFactor>('rigging');
  const [tempF, setTempF]                   = useState('');
  const [imported, setImported]             = useState(false);

  const [detectedState, setDetectedState]   = useState<string | null>(null);
  const [detectedRegion, setDetectedRegion] = useState<Region | null>(null);
  const [showAll, setShowAll]               = useState(false);
  const [customSpecies, setCustomSpecies]   = useState<CustomSpecies[]>([]);

  const handleCategoryChange = (cat: Category) => {
    setCategory(cat);
    setSpecies(getByCategory(cat)[0]);
  };

  useEffect(() => {
    (async () => {
      const saved = await loadAutosaved<AnchorSave>('autosave_anchor');
      if (saved) {
        if (saved.momentArm)      setMomentArm(saved.momentArm);
        if (saved.actualDiameter) setActualDiameter(saved.actualDiameter);
        if (saved.decay)          setDecay(saved.decay);
        if (saved.sf)             setSf(saved.sf);
        if (saved.tempF)          setTempF(saved.tempF);
        if (saved.category)       setCategory(saved.category);
        const found = SPECIES.find(s => s.name === saved.speciesName);
        if (found)                setSpecies(found);
      }
      const crossModule = await AsyncStorage.getItem('crossModule_riggingLoadLbs');
      if (crossModule) { setLoad(crossModule); setImported(true); }
      else if (saved?.load) setLoad(saved.load);

      const state = await AsyncStorage.getItem('arborist_detected_state');
      if (state) {
        setDetectedState(state);
        if (STATE_TO_REGION[state]) setDetectedRegion(STATE_TO_REGION[state] as Region);
      }

      const raw = await AsyncStorage.getItem('arborist_custom_species');
      if (raw) {
        try {
          const custom = JSON.parse(raw);
          setCustomSpecies(custom);
          if (saved?.speciesName && !SPECIES.find(s => s.name === saved.speciesName)) {
            const found = custom.find((s: CustomSpecies) => s.name === saved.speciesName);
            if (found) setSpecies(found);
          }
        } catch {}
      }
    })();
  }, []);

  const baseFiltered = getByCategory(category);
  const regionFiltered = (detectedRegion && !showAll)
    ? baseFiltered.filter(s => {
        const regions = SPECIES_REGIONS[s.name];
        return regions ? regions.includes(detectedRegion) : true;
      })
    : baseFiltered;

  const customFiltered  = customSpecies.filter(s => s.category === category);
  const displaySpecies: Species[] = [...regionFiltered, ...customFiltered];

  const temp        = parseFloat(tempF);
  const tempFactor  = !isNaN(temp) ? frozenWoodFactor(temp) : 1.0;
  const adjustedMor = Math.round(species.morPsi * tempFactor);

  useAutosave('autosave_anchor', {
    load, momentArm, actualDiameter, category,
    speciesName: species.name, decay, sf, tempF,
  } satisfies AnchorSave);

  const result = (() => {
    try {
      const l   = parseFloat(load);
      const arm = parseFloat(momentArm);
      const dia = parseFloat(actualDiameter);
      if (!l || !arm || !dia) return null;
      return calcAnchor({ loadLbs: l, momentArmFt: arm, actualDiameterIn: dia, morPsi: adjustedMor, decay, safetyFactor: sf });
    } catch { return null; }
  })();

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.screen}>
      <LegalBanner stateCode={detectedState} />

      {imported && (
        <View style={styles.importBanner}>
          <Text style={styles.importText}>⬆  Load imported from Rigging Calculator</Text>
        </View>
      )}

      <NumericInput label="Applied Load" unit="lbs" value={load} onChangeText={setLoad} />
      <NumericInput label="Moment Arm" unit="ft" value={momentArm} onChangeText={setMomentArm} placeholder="1.0" />
      <NumericInput label="Actual Stem Diameter" unit="in" value={actualDiameter} onChangeText={setActualDiameter} />

      <Text style={styles.sectionLabel}>Air Temperature (optional)</Text>
      <NumericInput label="Temperature" unit="°F" value={tempF} onChangeText={setTempF} placeholder="Leave blank if above freezing" />
      {!isNaN(temp) && tempF !== '' && (
        <View style={[styles.noteBox, temp < 33 && styles.noteBoxFrozen]}>
          <Text style={[styles.noteText, temp < 33 && styles.noteTextFrozen]}>
            {frozenWoodLabel(temp)} — MOR adjusted to {adjustedMor.toLocaleString()} psi
          </Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>Species (for MOR)</Text>

      {detectedRegion && (
        <View style={styles.regionBanner}>
          <Text style={styles.regionBannerText}>📍 {REGION_LABELS[detectedRegion]} species</Text>
          <TouchableOpacity onPress={() => setShowAll(v => !v)}>
            <Text style={styles.regionToggle}>{showAll ? 'Show Regional' : 'Show All'}</Text>
          </TouchableOpacity>
        </View>
      )}

      <SegmentedButtons
        value={category}
        onValueChange={v => handleCategoryChange(v as Category)}
        buttons={[{ value: 'Hardwood', label: 'Hardwood' }, { value: 'Softwood', label: 'Softwood' }]}
        style={styles.segment}
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {displaySpecies.map(s => {
          const isCustom = 'isCustom' in s;
          const isActive = species.name === s.name;
          return (
            <TouchableOpacity
              key={s.name}
              style={[styles.chip, isActive && styles.chipActive, isCustom && !isActive && styles.chipCustom]}
              onPress={() => setSpecies(s)}
            >
              <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{s.name}</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {species.notes && (
        <View style={styles.noteBox}>
          <Text style={styles.noteText}>{species.notes}</Text>
        </View>
      )}

      <Text style={styles.sectionLabel}>Decay</Text>
      <SegmentedButtons
        value={decay}
        onValueChange={v => setDecay(v as DecayLevel)}
        buttons={DECAY_OPTIONS.map(d => ({ value: d.value, label: d.label }))}
        style={styles.segment}
      />

      <Text style={styles.sectionLabel}>Safety Factor</Text>
      <SegmentedButtons
        value={sf}
        onValueChange={v => setSf(v as SafetyFactor)}
        buttons={SF_OPTIONS.map(o => ({ value: o.value, label: o.label }))}
        style={styles.segment}
      />

      {result && (
        <>
          <ResultCard
            title="Anchor Rating"
            rows={[
              { label: 'Required Diameter',     value: `${result.requiredDiameterIn.toFixed(2)} in` },
              { label: 'Effective Diameter',    value: `${result.effectiveDiameterIn.toFixed(2)} in` },
              { label: 'Ratio (actual/required)', value: `${result.ratio.toFixed(2)}×` },
              { label: 'MOR used', value: `${adjustedMor.toLocaleString()} psi${tempFactor > 1 ? ` (×${tempFactor.toFixed(2)} frozen)` : ''}` },
              { label: 'Safety Factor',         value: sf === 'rigging' ? '3.0×' : '5.0×' },
            ]}
          />
          <SafetyBadge level={result.level} message={result.message} />
        </>
      )}
    </ScrollView>
  );
}
