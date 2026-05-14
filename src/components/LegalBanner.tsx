import { useMemo, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { FF, T, R, ColorPalette } from '@/theme';
import { useColors } from '@/context/ThemeContext';
import { getStateLegal, getEffectiveSFs, ANSI_Z133, OSHAType } from '@/data/stateLegality';

interface Props {
  stateCode: string | null;
}

const OSHA_LABEL: Record<OSHAType, string> = {
  'federal':           'Federal OSHA',
  'state-plan':        'State-Plan OSHA',
  'state-plan-public': 'State Plan (public sector)',
};

function makeStyles(C: ColorPalette) {
  return StyleSheet.create({
    container: {
      borderRadius: R.md,
      borderLeftWidth: 4,
      borderLeftColor: C.green800,
      backgroundColor: C.green50,
      marginBottom: 16,
      overflow: 'hidden',
    },
    header: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingHorizontal: 14,
      paddingVertical: 11,
    },
    headerLeft: {
      flexDirection: 'row',
      alignItems: 'center',
      flex: 1,
    },
    pin: {
      fontSize: T.sm,
      marginRight: 6,
    },
    headerTitle: {
      fontSize: T.sm,
      fontFamily: FF.bold,
      color: C.green900,
      flex: 1,
    },
    chevron: {
      fontSize: T.sm,
      fontFamily: FF.bold,
      color: C.green800,
      marginLeft: 8,
    },
    body: {
      paddingHorizontal: 14,
      paddingBottom: 14,
      gap: 8,
    },
    row: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
    },
    rowDot: {
      fontSize: T.xs,
      color: C.green800,
      marginTop: 3,
    },
    rowText: {
      fontSize: T.xs + 1,
      fontFamily: FF.normal,
      color: C.green900,
      lineHeight: 19,
      flex: 1,
    },
    badge: {
      alignSelf: 'flex-start',
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: R.xl,
      marginBottom: 4,
    },
    badgeText: {
      fontSize: T.xs,
      fontFamily: FF.semibold,
    },
    divider: {
      height: 1,
      backgroundColor: C.border,
      marginVertical: 4,
    },
    licenseWarning: {
      borderRadius: R.md,
      backgroundColor: C.safeYellowBg,
      borderLeftWidth: 3,
      borderLeftColor: C.safeYellowBorder,
      padding: 10,
    },
    licenseText: {
      fontSize: T.xs + 1,
      fontFamily: FF.bold,
      color: C.safeYellowText,
      lineHeight: 18,
    },
    sfOverride: {
      borderRadius: R.md,
      backgroundColor: C.safeRedBg,
      borderLeftWidth: 3,
      borderLeftColor: C.safeRedBorder,
      padding: 10,
    },
    sfText: {
      fontSize: T.xs + 1,
      fontFamily: FF.bold,
      color: C.safeRedText,
      lineHeight: 18,
    },
  });
}

export default function LegalBanner({ stateCode }: Props) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);
  const [expanded, setExpanded] = useState(false);

  if (!stateCode) return null;
  const legal = getStateLegal(stateCode);
  if (!legal) return null;

  const sfs = getEffectiveSFs(stateCode);
  const hasRiggingOverride   = sfs.sfRigging   !== ANSI_Z133.sfRigging;
  const hasLifeSafetyOverride = sfs.sfLifeSafety !== ANSI_Z133.sfLifeSafety;
  const hasSFOverride = hasRiggingOverride || hasLifeSafetyOverride;

  const oshaBg   = legal.oshaType === 'state-plan' || legal.oshaType === 'state-plan-public'
    ? { backgroundColor: C.importBg }
    : { backgroundColor: C.stripe };
  const oshaText = legal.oshaType === 'state-plan' || legal.oshaType === 'state-plan-public'
    ? { color: C.importText }
    : { color: C.textMid };

  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.header} onPress={() => setExpanded(v => !v)} activeOpacity={0.7}>
        <View style={styles.headerLeft}>
          <Text style={styles.pin}>📋</Text>
          <Text style={styles.headerTitle}>
            {legal.name} — Regulatory Summary{hasSFOverride ? ' ⚠' : ''}
          </Text>
        </View>
        <Text style={styles.chevron}>{expanded ? '▲' : '▼'}</Text>
      </TouchableOpacity>

      {expanded && (
        <View style={styles.body}>
          {/* OSHA type badge */}
          <View style={[styles.badge, oshaBg]}>
            <Text style={[styles.badgeText, oshaText]}>{OSHA_LABEL[legal.oshaType]}</Text>
          </View>

          {/* License warning */}
          {legal.licenseRequired && (
            <View style={styles.licenseWarning}>
              <Text style={styles.licenseText}>
                ⚠  State license required for commercial arborist work
                {legal.licenseNote ? `\n${legal.licenseNote}` : ''}
                {legal.licenseRef  ? `\n${legal.licenseRef}` : ''}
              </Text>
            </View>
          )}

          {/* Safety factor overrides */}
          {hasSFOverride && (
            <View style={styles.sfOverride}>
              <Text style={styles.sfText}>
                State SF override — higher than ANSI Z133 baseline:{'\n'}
                {hasRiggingOverride    ? `Rigging: ${sfs.sfRigging}× (ANSI: ${ANSI_Z133.sfRigging}×)\n` : ''}
                {hasLifeSafetyOverride ? `Life safety: ${sfs.sfLifeSafety}× (ANSI: ${ANSI_Z133.sfLifeSafety}×)` : ''}
              </Text>
            </View>
          )}

          {/* Key notes */}
          {legal.notes.length > 0 && (
            <>
              <View style={styles.divider} />
              {legal.notes.map((note, i) => (
                <View key={i} style={styles.row}>
                  <Text style={styles.rowDot}>•</Text>
                  <Text style={styles.rowText}>{note}</Text>
                </View>
              ))}
            </>
          )}

          {/* Primary reference */}
          <View style={styles.row}>
            <Text style={styles.rowDot}>📖</Text>
            <Text style={[styles.rowText, { color: C.textMid }]}>{legal.primaryRef}</Text>
          </View>
        </View>
      )}
    </View>
  );
}
