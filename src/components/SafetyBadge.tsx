import { useMemo } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { FF, T, R, ColorPalette } from '@/theme';
import { useColors } from '@/context/ThemeContext';

export type SafetyLevel = 'green' | 'yellow' | 'red';

interface Props {
  level: SafetyLevel;
  message: string;
}

function makeStyles(C: ColorPalette) {
  const CONFIG = {
    green:  { bg: C.safeGreenBg,  text: C.safeGreenText,  bar: C.safeGreenBorder,  icon: '✓' },
    yellow: { bg: C.safeYellowBg, text: C.safeYellowText, bar: C.safeYellowBorder, icon: '⚠' },
    red:    { bg: C.safeRedBg,    text: C.safeRedText,     bar: C.safeRedBorder,    icon: '✕' },
  } as const;
  return { CONFIG, base: StyleSheet.create({
    badge: {
      flexDirection: 'row',
      alignItems: 'center',
      borderRadius: R.md,
      marginTop: 12,
      overflow: 'hidden',
      elevation: 1,
      shadowColor: '#000',
      shadowOpacity: 0.05,
      shadowOffset: { width: 0, height: 1 },
      shadowRadius: 4,
    },
    bar: {
      width: 5,
      alignSelf: 'stretch',
    },
    icon: {
      fontSize: T.md,
      fontFamily: FF.heavy,
      marginHorizontal: 12,
    },
    text: {
      fontSize: T.base,
      fontFamily: FF.bold,
      flex: 1,
      paddingVertical: 15,
      paddingRight: 14,
      lineHeight: T.base * 1.4,
    },
  })};
}

export default function SafetyBadge({ level, message }: Props) {
  const C = useColors();
  const { CONFIG, base } = useMemo(() => makeStyles(C), [C]);
  const c = CONFIG[level];

  return (
    <View style={[base.badge, { backgroundColor: c.bg }]}>
      <View style={[base.bar, { backgroundColor: c.bar }]} />
      <Text style={[base.icon, { color: c.bar }]}>{c.icon}</Text>
      <Text style={[base.text, { color: c.text }]}>{message}</Text>
    </View>
  );
}
