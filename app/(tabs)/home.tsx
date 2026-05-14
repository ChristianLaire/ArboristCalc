import { useState, useMemo, useCallback } from 'react';
import { View, Text, ScrollView, StyleSheet, Share, Animated } from 'react-native';
import { useRouter } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as Haptics from 'expo-haptics';
import { useKeepAwake } from 'expo-keep-awake';
import PressableFeedback from '@/components/PressableFeedback';
import { FF, T, R, TOUCH_TARGET, ColorPalette } from '@/theme';
import { useColors } from '@/context/ThemeContext';

// ── ISA TRAM + ANSI Z133 pre-climb checklist ──────────────────────
interface CheckItem { id: string; label: string; detail: string; }

const CHECKLIST: CheckItem[] = [
  { id: 'ground',    label: 'Ground Hazards Assessed',    detail: 'Traffic, slopes, soft ground, underground utilities, drop zones' },
  { id: 'aerial',    label: 'Aerial Hazards Identified',  detail: 'Power lines, dead wood, structural defects, clearances' },
  { id: 'target',    label: 'Target Zone Clear',           detail: 'Drop zone secured — no bystanders, vehicles, or structures in path' },
  { id: 'tree',      label: 'Tree Integrity Assessed',    detail: 'Visible decay, lean, root damage, recent trauma, species CODIT' },
  { id: 'anchor',    label: 'Anchor Points Inspected',    detail: 'Tie-in and rigging points identified, diameter checked, decay assessed' },
  { id: 'equip',     label: 'Equipment Inspected',        detail: 'All PPE, climbing system, carabiners, ropes — per ANSI Z133 §5' },
  { id: 'plan',      label: 'Work Plan Communicated',     detail: 'All crew briefed — roles, hand signals or radio established' },
  { id: 'emergency', label: 'Emergency Plan Established', detail: 'Emergency contacts confirmed, nearest hospital route known' },
  { id: 'firstaid',  label: 'First Aid Kit On Site',      detail: 'Kit accessible; team knows location and incident reporting procedure' },
  { id: 'weather',   label: 'Weather Conditions Acceptable', detail: 'No lightning within 10 mi, wind within acceptable limits, no ice' },
];

// ── Module card definitions ───────────────────────────────────────
const MODULES = [
  { name: 'Weight',   route: '/(tabs)/weight',   icon: 'weight'                   as const, accent: '#2e7d32', desc: 'Log section & whole-tree mass' },
  { name: 'Rigging',  route: '/(tabs)/rigging',  icon: 'link-variant'             as const, accent: '#e65100', desc: 'Dynamic load & WLL comparison' },
  { name: 'Tension',  route: '/(tabs)/tension',  icon: 'arrow-expand-horizontal'  as const, accent: '#006064', desc: 'Sling angle & mechanical advantage' },
  { name: 'Anchor',   route: '/(tabs)/anchor',   icon: 'tree'                     as const, accent: '#1565c0', desc: 'Anchor point stem strength' },
];

function greeting(): string {
  const h = new Date().getHours();
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  return 'Good evening';
}

function dayLabel(): string {
  return new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' });
}

function makeStyles(C: ColorPalette) {
  return StyleSheet.create({
    screen:    { backgroundColor: C.bg },
    container: { padding: 16, paddingBottom: 56 },

    // ── Header ────────────────────────────────────────────────────
    headerCard: {
      backgroundColor: C.green900,
      borderRadius: R.md,
      padding: 20,
      marginBottom: 16,
      elevation: 4,
      shadowColor: '#000', shadowOpacity: 0.18, shadowOffset: { width: 0, height: 3 }, shadowRadius: 8,
    },
    headerGreeting: { fontSize: T.sm, fontFamily: FF.medium, color: 'rgba(255,255,255,0.7)', marginBottom: 4 },
    headerTitle:    { fontSize: 26, fontFamily: FF.heavy, color: '#ffffff', letterSpacing: -0.5 },
    headerDate:     { fontSize: T.sm, fontFamily: FF.normal, color: 'rgba(255,255,255,0.6)', marginTop: 6 },
    headerLeaf:     { position: 'absolute', right: 18, top: 14, opacity: 0.15 },

    // ── Module grid ───────────────────────────────────────────────
    gridRow:   { flexDirection: 'row', gap: 12, marginBottom: 12 },
    moduleCard: {
      flex: 1, backgroundColor: C.card, borderRadius: R.md, overflow: 'hidden',
      elevation: 3, shadowColor: '#000', shadowOpacity: 0.10, shadowOffset: { width: 0, height: 2 }, shadowRadius: 6,
      borderWidth: 1, borderColor: C.border,
    },
    moduleAccent: { height: 5, width: '100%' },
    moduleBody:   { padding: 14 },
    moduleName:   { fontSize: T.base, fontFamily: FF.heavy, color: C.text, marginTop: 10, marginBottom: 4 },
    moduleDesc:   { fontSize: T.xs, fontFamily: FF.normal, color: C.textMid, lineHeight: 16 },
    moduleArrow:  { position: 'absolute', bottom: 10, right: 12 },

    // ── Section label ─────────────────────────────────────────────
    sectionLabel: { fontSize: T.base, fontFamily: FF.heavy, color: C.green900, marginTop: 8, marginBottom: 12 },

    // ── Checklist card ────────────────────────────────────────────
    checkCard: {
      backgroundColor: C.card, borderRadius: R.md, overflow: 'hidden',
      elevation: 3, shadowColor: '#000', shadowOpacity: 0.09, shadowOffset: { width: 0, height: 2 }, shadowRadius: 8,
      borderWidth: 1, borderColor: C.border, marginBottom: 12,
    },
    checkHeader: {
      flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
      padding: 14, borderBottomWidth: 1, borderBottomColor: C.border, backgroundColor: C.stripe,
    },
    checkHeaderLeft:  { flex: 1 },
    checkHeaderTitle: { fontSize: T.md, fontFamily: FF.heavy, color: C.green900 },
    checkHeaderSub:   { fontSize: T.xs, fontFamily: FF.normal, color: C.textMid, marginTop: 2 },
    progressBar:      { height: 4, backgroundColor: C.border, borderRadius: 2, marginTop: 8, overflow: 'hidden' },
    progressFill:     { height: 4, backgroundColor: C.green900, borderRadius: 2 },

    checkItem: {
      flexDirection: 'row', alignItems: 'flex-start',
      paddingVertical: 13, paddingHorizontal: 14,
      borderBottomWidth: 1, borderBottomColor: C.border, minHeight: TOUCH_TARGET,
    },
    checkItemLast:    { borderBottomWidth: 0 },
    checkItemChecked: { backgroundColor: C.safeGreenBg },
    checkBox: {
      width: 24, height: 24, borderRadius: 6, borderWidth: 2,
      borderColor: C.border, alignItems: 'center', justifyContent: 'center',
      marginRight: 12, marginTop: 1, backgroundColor: C.bg,
    },
    checkBoxChecked: { backgroundColor: C.green900, borderColor: C.green900 },
    checkLabel:       { fontSize: T.sm, fontFamily: FF.semibold, color: C.text, flex: 1 },
    checkLabelDone:   { color: C.textMid, textDecorationLine: 'line-through' },
    checkDetail:      { fontSize: T.xs, fontFamily: FF.normal, color: C.textLight, marginTop: 2, flex: 1 },

    checkActions: { flexDirection: 'row', gap: 10, padding: 14, borderTopWidth: 1, borderTopColor: C.border },
    clearBtn:   { flex: 1, borderRadius: R.pill, minHeight: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: C.bg, borderWidth: 1.5, borderColor: C.border },
    clearText:  { fontSize: T.sm, fontFamily: FF.semibold, color: C.textMid },
    reportBtn:  { flex: 2, borderRadius: R.pill, minHeight: 44, alignItems: 'center', justifyContent: 'center', backgroundColor: C.green900 },
    reportText: { fontSize: T.sm, fontFamily: FF.bold, color: '#fff' },
    reportBtnDisabled: { backgroundColor: C.border },
  });
}

export default function HomeScreen() {
  useKeepAwake();
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const router = useRouter();

  const [checked, setChecked] = useState<Record<string, boolean>>({});

  const toggle = useCallback((id: string) => {
    Haptics.selectionAsync();
    setChecked(prev => ({ ...prev, [id]: !prev[id] }));
  }, []);

  const checkedCount = Object.values(checked).filter(Boolean).length;
  const allClear = checkedCount === CHECKLIST.length;
  const progressPct = checkedCount / CHECKLIST.length;

  const shareReport = async () => {
    const ts = new Date().toLocaleString('en-US', { dateStyle: 'medium', timeStyle: 'short' });
    const items = CHECKLIST.map(i => `${checked[i.id] ? '✓' : '✗'} ${i.label}`).join('\n');
    await Share.share({
      message: `ArboristCalc — Pre-Climb Risk Assessment\n${ts}\n\n${items}\n\nStatus: ${allClear ? 'ALL CLEAR — proceed with work' : `${checkedCount}/${CHECKLIST.length} items confirmed`}\n\nGenerated by ArboristCalc`,
    });
  };

  return (
    <ScrollView contentContainerStyle={styles.container} style={styles.screen}>

      {/* ── Header card ─────────────────────────────────────────── */}
      <View style={styles.headerCard}>
        <Text style={styles.headerGreeting}>{greeting()}</Text>
        <Text style={styles.headerTitle}>ArboristCalc</Text>
        <Text style={styles.headerDate}>{dayLabel()}</Text>
        <View style={styles.headerLeaf}>
          <MaterialCommunityIcons name="tree" size={80} color="#ffffff" />
        </View>
      </View>

      {/* ── Calculator module cards ──────────────────────────────── */}
      <Text style={styles.sectionLabel}>Calculators</Text>
      <View style={styles.gridRow}>
        {MODULES.slice(0, 2).map(m => (
          <PressableFeedback key={m.name} style={styles.moduleCard} onPress={() => router.navigate(m.route as any)} haptic="selection" scaleTarget={0.96}>
            <View style={[styles.moduleAccent, { backgroundColor: m.accent }]} />
            <View style={styles.moduleBody}>
              <MaterialCommunityIcons name={m.icon} size={28} color={m.accent} />
              <Text style={styles.moduleName}>{m.name}</Text>
              <Text style={styles.moduleDesc}>{m.desc}</Text>
            </View>
            <View style={styles.moduleArrow}>
              <MaterialCommunityIcons name="chevron-right" size={16} color={C.textLight} />
            </View>
          </PressableFeedback>
        ))}
      </View>
      <View style={styles.gridRow}>
        {MODULES.slice(2, 4).map(m => (
          <PressableFeedback key={m.name} style={styles.moduleCard} onPress={() => router.navigate(m.route as any)} haptic="selection" scaleTarget={0.96}>
            <View style={[styles.moduleAccent, { backgroundColor: m.accent }]} />
            <View style={styles.moduleBody}>
              <MaterialCommunityIcons name={m.icon} size={28} color={m.accent} />
              <Text style={styles.moduleName}>{m.name}</Text>
              <Text style={styles.moduleDesc}>{m.desc}</Text>
            </View>
            <View style={styles.moduleArrow}>
              <MaterialCommunityIcons name="chevron-right" size={16} color={C.textLight} />
            </View>
          </PressableFeedback>
        ))}
      </View>

      {/* ── Pre-climb risk assessment ────────────────────────────── */}
      <Text style={styles.sectionLabel}>Pre-Climb Risk Assessment</Text>
      <View style={styles.checkCard}>

        <View style={styles.checkHeader}>
          <View style={styles.checkHeaderLeft}>
            <Text style={styles.checkHeaderTitle}>ISA / ANSI Z133 Checklist</Text>
            <Text style={styles.checkHeaderSub}>{checkedCount} of {CHECKLIST.length} confirmed{allClear ? ' — All Clear ✓' : ''}</Text>
            <View style={styles.progressBar}>
              <View style={[styles.progressFill, { width: `${progressPct * 100}%` }]} />
            </View>
          </View>
        </View>

        {CHECKLIST.map((item, i) => {
          const done = !!checked[item.id];
          return (
            <PressableFeedback
              key={item.id}
              style={[styles.checkItem, done && styles.checkItemChecked, i === CHECKLIST.length - 1 && styles.checkItemLast]}
              onPress={() => toggle(item.id)}
              haptic="none"
              scaleTarget={0.98}
            >
              <View style={[styles.checkBox, done && styles.checkBoxChecked]}>
                {done && <MaterialCommunityIcons name="check" size={14} color="#fff" />}
              </View>
              <View style={{ flex: 1 }}>
                <Text style={[styles.checkLabel, done && styles.checkLabelDone]}>{item.label}</Text>
                <Text style={styles.checkDetail}>{item.detail}</Text>
              </View>
            </PressableFeedback>
          );
        })}

        <View style={styles.checkActions}>
          <PressableFeedback style={styles.clearBtn} onPress={() => { Haptics.selectionAsync(); setChecked({}); }} haptic="none">
            <Text style={styles.clearText}>Clear</Text>
          </PressableFeedback>
          <PressableFeedback style={[styles.reportBtn, !allClear && styles.reportBtnDisabled]} onPress={shareReport} haptic="medium">
            <Text style={styles.reportText}>{allClear ? '↑ Share Report' : `${checkedCount}/${CHECKLIST.length} — Share Anyway`}</Text>
          </PressableFeedback>
        </View>
      </View>

    </ScrollView>
  );
}
