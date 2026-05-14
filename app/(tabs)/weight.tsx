import { useState, useEffect, useRef, useMemo } from 'react';
import { View, Text, ScrollView, StyleSheet, Modal, TextInput, Alert, Share } from 'react-native';
import { SegmentedButtons } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import NumericInput from '@/components/NumericInput';
import ResultCard from '@/components/ResultCard';
import SafetyBadge from '@/components/SafetyBadge';
import LegalBanner from '@/components/LegalBanner';
import PressableFeedback from '@/components/PressableFeedback';
import { SPECIES, Species, Condition, Category, getByCategory } from '@/data/species';
import { calcLogWeight } from '@/math/weight';
import { planRiggingSections } from '@/math/sections';
import { leafWeightLbs } from '@/math/environmental';
import { STATE_TO_REGION, SPECIES_REGIONS, REGION_LABELS, Region } from '@/data/speciesRanges';
import { FF, T, R, TOUCH_TARGET, ColorPalette } from '@/theme';
import { useColors } from '@/context/ThemeContext';
import { useAutosave, loadAutosaved } from '@/hooks/useAutosave';

type WeightSave = { mode: 'log'|'tree'; category: Category; speciesName: string; condition: Condition; dSmall: string; dLarge: string; length: string; dbh: string; height: string; inLeaf: boolean; numSections: number; maxSectionWeight: string };

const CONDITIONS: { label: string; value: Condition }[] = [
  { label: 'Green', value: 'green' },
  { label: 'Air-dry', value: 'airDry' },
  { label: 'Kiln-dry', value: 'kilnDry' },
];

const CUSTOM_KEY = 'arborist_custom_species';
interface CustomSpecies extends Species { isCustom: true; }

function makeStyles(C: ColorPalette) {
  return StyleSheet.create({
    screen:    { backgroundColor: C.bg },
    container: { padding: 16, paddingBottom: 56 },
    sectionLabel: { fontSize: T.base, fontFamily: FF.bold, color: C.green900, marginTop: 20, marginBottom: 8 },
    segment:      { marginBottom: 8 },

    regionBanner: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      backgroundColor: C.green50, borderRadius: R.md, padding: 13, marginBottom: 16,
      borderLeftWidth: 4, borderLeftColor: C.green800,
    },
    regionBannerText: { fontSize: T.sm, fontFamily: FF.bold, color: C.green900, flex: 1 },
    regionToggleBtn:  { paddingHorizontal: 12, paddingVertical: 6, borderRadius: R.pill, backgroundColor: 'rgba(0,0,0,0.06)' },
    regionToggleText: { fontSize: T.sm, fontFamily: FF.bold, color: C.ctaOrange },

    speciesHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
    addBtn:     { backgroundColor: C.green50, borderRadius: R.pill, paddingHorizontal: 16, paddingVertical: 8, borderWidth: 1.5, borderColor: C.green100 },
    addBtnText: { fontSize: T.sm, fontFamily: FF.bold, color: C.green900 },

    chipRow:    { flexDirection: 'row', marginBottom: 6 },
    chipWrapper: { flexDirection: 'row', alignItems: 'flex-start', marginRight: 8, marginBottom: 8 },
    chip:       { paddingHorizontal: 16, paddingVertical: 10, borderRadius: R.pill, backgroundColor: C.card, borderWidth: 1.5, borderColor: C.border },
    chipActive: { backgroundColor: C.green900, borderColor: C.green900 },
    chipCustom: { backgroundColor: C.importBg, borderColor: C.importBorder },
    chipText:       { fontSize: T.sm, fontFamily: FF.semibold, color: C.textMid },
    chipTextActive: { color: '#fff', fontFamily: FF.bold },
    chipDelete:     { marginLeft: -8, marginTop: -4, backgroundColor: '#ef5350', borderRadius: 10, width: 20, height: 20, alignItems: 'center', justifyContent: 'center' },
    chipDeleteText: { color: '#fff', fontSize: 10, fontFamily: FF.heavy, lineHeight: 20 },

    noteBox:  { backgroundColor: C.green50, borderRadius: R.md, padding: 12, marginBottom: 6, borderLeftWidth: 4, borderLeftColor: C.green800 },
    noteText: { fontSize: T.sm, fontFamily: FF.normal, color: C.green900, lineHeight: 20 },

    sendBtn:     { marginTop: 12, backgroundColor: C.ctaOrange, borderRadius: R.pill, paddingVertical: 0, minHeight: TOUCH_TARGET, alignItems: 'center', justifyContent: 'center', elevation: 3, shadowColor: '#000', shadowOpacity: 0.15, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6 },
    sendBtnText: { color: '#fff', fontFamily: FF.bold, fontSize: T.md, letterSpacing: 0.3 },
    shareBtn:     { marginTop: 10, backgroundColor: C.card, borderRadius: R.pill, paddingVertical: 0, minHeight: TOUCH_TARGET, alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: C.border },
    shareBtnText: { color: C.green900, fontFamily: FF.semibold, fontSize: T.base },

    // ── Rigging section planner ───────────────────────────────────
    planCard:         { backgroundColor: C.card, borderRadius: R.md, marginTop: 16, borderWidth: 1, borderColor: C.border, overflow: 'hidden', elevation: 3, shadowColor: '#000', shadowOpacity: 0.09, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8 },
    planTitleRow:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingTop: 14, paddingBottom: 12, borderBottomWidth: 1, borderBottomColor: C.border },
    planTitleBar:     { width: 4, height: 20, backgroundColor: C.ctaOrange, borderRadius: 2, marginRight: 10 },
    planTitle:        { fontSize: T.md, fontFamily: FF.heavy, color: C.green900, flex: 1 },
    planSummary:      { fontSize: T.sm, fontFamily: FF.normal, color: C.textMid, padding: 12, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.stripe },
    planCountRow:     { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 16, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: C.border, gap: 8 },
    planCountLabel:   { fontSize: T.sm, fontFamily: FF.bold, color: C.green900, marginRight: 4 },
    planCountChip:    { paddingHorizontal: 14, paddingVertical: 8, borderRadius: R.pill, backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.border },
    planCountChipActive: { backgroundColor: C.green900, borderColor: C.green900 },
    planCountChipText:       { fontSize: T.sm, fontFamily: FF.semibold, color: C.textMid },
    planCountChipTextActive: { color: '#fff', fontFamily: FF.bold },

    planRow:       { flexDirection: 'row', alignItems: 'center', paddingVertical: 13, paddingHorizontal: 14, borderBottomWidth: 1, borderBottomColor: C.border },
    planRowAlt:    { backgroundColor: C.stripe },
    planRowLast:   { borderBottomWidth: 0 },
    planDot:       { width: 10, height: 10, borderRadius: 5, marginRight: 12, marginTop: 2 },
    planDotGreen:  { backgroundColor: C.safeGreenText },
    planDotRed:    { backgroundColor: C.safeRedText },
    planDotGray:   { backgroundColor: C.border },
    planLeft:      { flex: 1 },
    planSectionNum:    { fontSize: T.sm, fontFamily: FF.heavy, color: C.text },
    planSectionDetail: { fontSize: 12, fontFamily: FF.normal, color: C.textMid, marginTop: 2 },
    planRight:      { alignItems: 'flex-end' },
    planWeight:     { fontSize: T.base, fontFamily: FF.heavy, color: C.text, fontVariant: ['tabular-nums'] },
    planWeightOver: { color: C.safeRedText },
    planStatus:     { fontSize: 12, fontFamily: FF.semibold, marginTop: 2 },
    planStatusOk:   { color: C.safeGreenText },
    planStatusOver: { color: C.safeRedText },
    planStatusNone: { color: C.textLight },

    modalOverlay: { flex: 1, backgroundColor: 'rgba(0,0,0,0.6)', justifyContent: 'flex-end' },
    modalCard:    { backgroundColor: C.card, borderTopLeftRadius: R.lg, borderTopRightRadius: R.lg, padding: 22, paddingBottom: 40 },
    modalTitle:   { fontSize: T.lg, fontFamily: FF.heavy, color: C.text, marginBottom: 16 },
    modalLabel:   { fontSize: T.sm, fontFamily: FF.bold, color: C.green900, marginTop: 14, marginBottom: 6 },
    modalInput:   { borderWidth: 1.5, borderColor: C.borderMid, borderRadius: R.md, paddingHorizontal: 14, paddingVertical: 0, minHeight: TOUCH_TARGET, fontSize: T.base, fontFamily: FF.medium, color: C.text, backgroundColor: C.stripe },
    modalInputMulti: { height: 80, textAlignVertical: 'top', paddingVertical: 12 },
    modalButtons:    { flexDirection: 'row', marginTop: 22, gap: 12 },
    modalCancel: { flex: 1, borderRadius: R.pill, minHeight: TOUCH_TARGET, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.border },
    modalCancelText: { fontSize: T.base, fontFamily: FF.bold, color: C.textMid },
    modalSave:    { flex: 1, borderRadius: R.pill, minHeight: TOUCH_TARGET, alignItems: 'center', justifyContent: 'center', backgroundColor: C.green900 },
    modalSaveText: { fontSize: T.base, fontFamily: FF.bold, color: '#fff' },
  });
}

export default function WeightScreen() {
  useKeepAwake();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const [mode, setMode]           = useState<'log' | 'tree'>('log');
  const [category, setCategory]   = useState<Category>('Hardwood');
  const [species, setSpecies]     = useState<Species>(SPECIES[0]);
  const [condition, setCondition] = useState<Condition>('green');
  const [dSmall, setDSmall] = useState('');
  const [dLarge, setDLarge] = useState('');
  const [length, setLength] = useState('');
  const [dbh, setDbh]       = useState('');
  const [height, setHeight] = useState('');
  const [inLeaf, setInLeaf] = useState(true);

  const [numSections, setNumSections]       = useState(4);
  const [maxSectionWeight, setMaxSectionWeight] = useState('');

  const [detectedState, setDetectedState]   = useState<string | null>(null);
  const [detectedRegion, setDetectedRegion] = useState<Region | null>(null);
  const [showAll, setShowAll]               = useState(false);
  const [customSpecies, setCustomSpecies]   = useState<CustomSpecies[]>([]);
  const [modalVisible, setModalVisible]     = useState(false);
  const [newName, setNewName]               = useState('');
  const [newCategory, setNewCategory]       = useState<Category>('Hardwood');
  const [newGreenDensity, setNewGreenDensity] = useState('');
  const [newMor, setNewMor]                 = useState('');
  const [newNotes, setNewNotes]             = useState('');

  useEffect(() => { loadRegionAndCustom(); }, []);

  async function loadRegionAndCustom() {
    const saved = await loadAutosaved<WeightSave>('autosave_weight');
    if (saved) {
      if (saved.mode)      setMode(saved.mode);
      if (saved.condition) setCondition(saved.condition);
      if (saved.dSmall)    setDSmall(saved.dSmall);
      if (saved.dLarge)    setDLarge(saved.dLarge);
      if (saved.length)    setLength(saved.length);
      if (saved.dbh)       setDbh(saved.dbh);
      if (saved.height)    setHeight(saved.height);
      setInLeaf(saved.inLeaf ?? true);
      if (saved.numSections)    setNumSections(saved.numSections);
      if (saved.maxSectionWeight) setMaxSectionWeight(saved.maxSectionWeight);
      if (saved.category)  setCategory(saved.category);
      const found = SPECIES.find(s => s.name === saved.speciesName);
      if (found) setSpecies(found);
    }
    const state = await AsyncStorage.getItem('arborist_detected_state');
    if (state) {
      setDetectedState(state);
      if (STATE_TO_REGION[state]) setDetectedRegion(STATE_TO_REGION[state] as Region);
    }
    const raw = await AsyncStorage.getItem(CUSTOM_KEY);
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
  }

  async function saveCustomSpecies(updated: CustomSpecies[]) {
    setCustomSpecies(updated);
    await AsyncStorage.setItem(CUSTOM_KEY, JSON.stringify(updated));
  }

  function addCustomSpecies() {
    const density = parseFloat(newGreenDensity), mor = parseFloat(newMor);
    if (!newName.trim())                { Alert.alert('Name required'); return; }
    if (isNaN(density) || density <= 0) { Alert.alert('Enter a valid green density (lbs/ft³)'); return; }
    if (isNaN(mor) || mor <= 0)         { Alert.alert('Enter a valid MOR (psi)'); return; }
    saveCustomSpecies([...customSpecies, { name: newName.trim(), category: newCategory, greenLbsPerFt3: density, airDryLbsPerFt3: Math.round(density * 0.65), kilnDryLbsPerFt3: Math.round(density * 0.60), morPsi: mor, notes: newNotes.trim() || undefined, isCustom: true }]);
    setNewName(''); setNewGreenDensity(''); setNewMor(''); setNewNotes('');
    setModalVisible(false);
  }

  function removeCustomSpecies(name: string) {
    Alert.alert('Remove Species', `Remove "${name}" from custom list?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Remove', style: 'destructive', onPress: () => {
        const updated = customSpecies.filter(s => s.name !== name);
        if (species.name === name) setSpecies(SPECIES[0]);
        saveCustomSpecies(updated);
      }},
    ]);
  }

  const baseFiltered   = getByCategory(category);
  const regionFiltered = (detectedRegion && !showAll) ? baseFiltered.filter(s => { const r = SPECIES_REGIONS[s.name]; return r ? r.includes(detectedRegion) : true; }) : baseFiltered;
  const customFiltered = customSpecies.filter(s => s.category === category);
  const displaySpecies: Species[] = [...regionFiltered, ...customFiltered];

  const result = (() => {
    try {
      if (mode === 'log') {
        const s = parseFloat(dSmall), l = parseFloat(dLarge), n = parseFloat(length);
        if (!s || !l || !n) return null;
        return calcLogWeight({ mode, species, condition, diameterSmallIn: s, diameterLargeIn: l, lengthFt: n });
      } else {
        const d = parseFloat(dbh), h = parseFloat(height);
        if (!d || !h) return null;
        return calcLogWeight({ mode, species, condition, dbhIn: d, heightFt: h });
      }
    } catch { return null; }
  })();

  const sendToRigging = async () => {
    if (!result) return;
    await AsyncStorage.setItem('crossModule_weightLbs', result.weightLbs.toFixed(0));
  };

  const handleCategoryChange = (cat: Category) => { setCategory(cat); setSpecies(getByCategory(cat)[0]); };

  useAutosave('autosave_weight', { mode, category, speciesName: species.name, condition, dSmall, dLarge, length, dbh, height, inLeaf, numSections, maxSectionWeight } satisfies WeightSave);

  const shareResult = async (totalWt: number) => {
    const condLabel = CONDITIONS.find(c => c.value === condition)?.label ?? condition;
    await Share.share({ message: `ArboristCalc — Weight Estimate\nSpecies: ${species.name} (${condLabel})\nTotal Weight: ${totalWt.toFixed(0)} lbs\nVolume: ${result?.volumeFt3.toFixed(2)} ft³\nGenerated by ArboristCalc` });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.screen}>
      <LegalBanner stateCode={detectedState} />

      {detectedRegion && (
        <View style={styles.regionBanner}>
          <Text style={styles.regionBannerText}>📍 {REGION_LABELS[detectedRegion]}</Text>
          <PressableFeedback style={styles.regionToggleBtn} onPress={() => setShowAll(v => !v)} haptic="selection" scaleTarget={0.92}>
            <Text style={styles.regionToggleText}>{showAll ? 'Show Regional' : 'Show All'}</Text>
          </PressableFeedback>
        </View>
      )}

      <Text style={styles.sectionLabel}>Mode</Text>
      <SegmentedButtons value={mode} onValueChange={v => setMode(v as 'log' | 'tree')} buttons={[{ value: 'log', label: 'Log Section' }, { value: 'tree', label: 'Whole Tree' }]} style={styles.segment} />

      <Text style={styles.sectionLabel}>Category</Text>
      <SegmentedButtons value={category} onValueChange={v => handleCategoryChange(v as Category)} buttons={[{ value: 'Hardwood', label: 'Hardwood' }, { value: 'Softwood', label: 'Softwood' }]} style={styles.segment} />

      <View style={styles.speciesHeader}>
        <Text style={styles.sectionLabel}>Species{detectedRegion && !showAll ? ` (${displaySpecies.length - customFiltered.length} regional)` : ''}</Text>
        <PressableFeedback style={styles.addBtn} onPress={() => setModalVisible(true)} haptic="light">
          <Text style={styles.addBtnText}>+ Custom</Text>
        </PressableFeedback>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
        {displaySpecies.map(s => {
          const isCustom = 'isCustom' in s, isActive = species.name === s.name;
          return (
            <View key={s.name} style={styles.chipWrapper}>
              <PressableFeedback style={[styles.chip, isActive && styles.chipActive, isCustom && !isActive && styles.chipCustom]} onPress={() => setSpecies(s)} haptic="selection">
                <Text style={[styles.chipText, isActive && styles.chipTextActive]}>{s.name}</Text>
              </PressableFeedback>
              {isCustom && (
                <PressableFeedback style={styles.chipDelete} onPress={() => removeCustomSpecies(s.name)} haptic="medium" scaleTarget={0.88}>
                  <Text style={styles.chipDeleteText}>✕</Text>
                </PressableFeedback>
              )}
            </View>
          );
        })}
      </ScrollView>

      {species.notes && <View style={styles.noteBox}><Text style={styles.noteText}>{species.notes}</Text></View>}

      <Text style={styles.sectionLabel}>Condition</Text>
      <SegmentedButtons value={condition} onValueChange={v => setCondition(v as Condition)} buttons={CONDITIONS.map(c => ({ value: c.value, label: c.label }))} style={styles.segment} />

      {mode === 'log' ? (
        <>
          <NumericInput label="Small-end Diameter" unit="in" value={dSmall} onChangeText={setDSmall} />
          <NumericInput label="Large-end Diameter" unit="in" value={dLarge} onChangeText={setDLarge} />
          <NumericInput label="Length" unit="ft" value={length} onChangeText={setLength} />
        </>
      ) : (
        <>
          <NumericInput label="DBH (Diameter at Breast Height)" unit="in" value={dbh} onChangeText={setDbh} />
          <NumericInput label="Tree Height" unit="ft" value={height} onChangeText={setHeight} />
          <Text style={styles.sectionLabel}>Leaf / Needle Status</Text>
          <SegmentedButtons value={inLeaf ? 'yes' : 'no'} onValueChange={v => setInLeaf(v === 'yes')} buttons={[{ value: 'yes', label: species.category === 'Softwood' ? 'Has Needles' : 'In Leaf' }, { value: 'no', label: species.category === 'Softwood' ? 'No Needles' : 'Dormant' }]} style={styles.segment} />
        </>
      )}

      {result && (() => {
        const leafWt  = mode === 'tree' ? leafWeightLbs(result.weightLbs, species.category === 'Hardwood', inLeaf) : 0;
        const totalWt = result.weightLbs + leafWt;
        const condLabel = CONDITIONS.find(c => c.value === condition)?.label ?? '';
        return (
          <>
            <ResultCard
              title="Weight Estimate"
              hero={{ value: `${Math.round(totalWt).toLocaleString()} lbs`, sublabel: `${species.name} · ${condLabel}`, level: 'green' }}
              rows={[
                { label: 'Volume',      value: `${result.volumeFt3.toFixed(2)} ft³` },
                { label: 'Stem Weight', value: `${result.weightLbs.toFixed(0)} lbs` },
                ...(leafWt > 0 ? [{ label: mode === 'tree' && species.category === 'Softwood' ? 'Needle Weight (~0.8%)' : 'Leaf Weight (~1.3%)', value: `${leafWt.toFixed(0)} lbs` }] : []),
                { label: 'Density', value: `${species.greenLbsPerFt3} lbs/ft³ (green)` },
              ]}
            />
            <SafetyBadge level="green" message={`${Math.round(totalWt).toLocaleString()} lbs — tap to send to Rigging`} />
            <PressableFeedback style={styles.sendBtn} onPress={sendToRigging} haptic="medium">
              <Text style={styles.sendBtnText}>→  Use in Rigging Calculator</Text>
            </PressableFeedback>
            <PressableFeedback style={styles.shareBtn} onPress={() => shareResult(totalWt)} haptic="light">
              <Text style={styles.shareBtnText}>↑  Share Result</Text>
            </PressableFeedback>

            {/* Rigging Section Planner — tree mode only */}
            {mode === 'tree' && (() => {
              const maxLbs = parseFloat(maxSectionWeight);
              const hasMax = !isNaN(maxLbs) && maxLbs > 0;
              const sections = planRiggingSections(totalWt, parseFloat(dbh), parseFloat(height), numSections, hasMax ? maxLbs : null);
              const heaviest = Math.max(...sections.map(s => s.weightLbs));
              const overCount = sections.filter(s => s.exceedsMax).length;
              return (
                <View style={styles.planCard}>
                  <View style={styles.planTitleRow}>
                    <View style={styles.planTitleBar} />
                    <Text style={styles.planTitle}>Rigging Section Plan</Text>
                  </View>

                  <Text style={styles.planSummary}>
                    {numSections} sections · {(parseFloat(height) / numSections).toFixed(1)} ft each · heaviest piece ~{heaviest.toLocaleString()} lbs
                    {hasMax && overCount > 0 ? `  ·  ${overCount} section${overCount > 1 ? 's' : ''} exceed limit` : ''}
                    {hasMax && overCount === 0 ? '  ·  all within limit' : ''}
                  </Text>

                  <NumericInput
                    label="Max Rigging Load (WLL ÷ SF)"
                    unit="lbs"
                    value={maxSectionWeight}
                    onChangeText={setMaxSectionWeight}
                    placeholder="Optional — for safety check"
                  />

                  <View style={styles.planCountRow}>
                    <Text style={styles.planCountLabel}>Sections:</Text>
                    {[3, 4, 5, 6, 8].map(n => (
                      <PressableFeedback
                        key={n}
                        style={[styles.planCountChip, numSections === n && styles.planCountChipActive]}
                        onPress={() => setNumSections(n)}
                        haptic="selection"
                        scaleTarget={0.9}
                      >
                        <Text style={[styles.planCountChipText, numSections === n && styles.planCountChipTextActive]}>{n}</Text>
                      </PressableFeedback>
                    ))}
                  </View>

                  {sections.map((s, i) => {
                    const dotStyle = !hasMax ? styles.planDotGray : s.exceedsMax ? styles.planDotRed : styles.planDotGreen;
                    const isLast = i === sections.length - 1;
                    const label = s.sectionNumber === 1 ? 'Top piece' : isLast ? `Section ${s.sectionNumber} (butt)` : `Section ${s.sectionNumber}`;
                    const cutLabel = isLast ? `Cut at ground level` : `Cut at ${s.cutHeightFt} ft · ~${s.diameterAtCutIn}" dia at cut`;
                    return (
                      <View key={s.sectionNumber} style={[styles.planRow, i % 2 === 1 && styles.planRowAlt, isLast && styles.planRowLast]}>
                        <View style={[styles.planDot, dotStyle]} />
                        <View style={styles.planLeft}>
                          <Text style={styles.planSectionNum}>{label}</Text>
                          <Text style={styles.planSectionDetail}>{cutLabel}</Text>
                        </View>
                        <View style={styles.planRight}>
                          <Text style={[styles.planWeight, s.exceedsMax && styles.planWeightOver]}>
                            {s.weightLbs.toLocaleString()} lbs
                          </Text>
                          <Text style={[styles.planStatus, !hasMax ? styles.planStatusNone : s.exceedsMax ? styles.planStatusOver : styles.planStatusOk]}>
                            {!hasMax ? `${s.sectionLengthFt} ft` : s.exceedsMax ? '✕ Exceeds' : '✓ Safe'}
                          </Text>
                        </View>
                      </View>
                    );
                  })}
                </View>
              );
            })()}
          </>
        );
      })()}

      <Modal visible={modalVisible} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalCard}>
            <Text style={styles.modalTitle}>Add Custom Species</Text>
            <Text style={styles.modalLabel}>Species Name</Text>
            <TextInput style={styles.modalInput} value={newName} onChangeText={setNewName} placeholder="e.g. Blue Gum Eucalyptus" placeholderTextColor={C.textLight} />
            <Text style={styles.modalLabel}>Category</Text>
            <SegmentedButtons value={newCategory} onValueChange={v => setNewCategory(v as Category)} buttons={[{ value: 'Hardwood', label: 'Hardwood' }, { value: 'Softwood', label: 'Softwood' }]} style={styles.segment} />
            <Text style={styles.modalLabel}>Green Density (lbs/ft³)</Text>
            <TextInput style={styles.modalInput} value={newGreenDensity} onChangeText={setNewGreenDensity} keyboardType="decimal-pad" placeholder="e.g. 62" placeholderTextColor={C.textLight} />
            <Text style={styles.modalLabel}>Green MOR (psi)</Text>
            <TextInput style={styles.modalInput} value={newMor} onChangeText={setNewMor} keyboardType="decimal-pad" placeholder="e.g. 8000" placeholderTextColor={C.textLight} />
            <Text style={styles.modalLabel}>Notes (optional)</Text>
            <TextInput style={[styles.modalInput, styles.modalInputMulti]} value={newNotes} onChangeText={setNewNotes} placeholder="Field notes, habitat, hazards…" placeholderTextColor={C.textLight} multiline />
            <View style={styles.modalButtons}>
              <PressableFeedback style={styles.modalCancel} onPress={() => setModalVisible(false)} haptic="light"><Text style={styles.modalCancelText}>Cancel</Text></PressableFeedback>
              <PressableFeedback style={styles.modalSave} onPress={addCustomSpecies} haptic="medium"><Text style={styles.modalSaveText}>Add Species</Text></PressableFeedback>
            </View>
          </View>
        </View>
      </Modal>
    </ScrollView>
  );
}
