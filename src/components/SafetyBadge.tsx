import { View, Text, StyleSheet } from 'react-native';
import { C, T, R } from '@/theme';

export type SafetyLevel = 'green' | 'yellow' | 'red';

interface Props {
  level: SafetyLevel;
  message: string;
}

const CONFIG: Record<SafetyLevel, { bg: string; text: string; bar: string; icon: string }> = {
  green:  { bg: C.safeGreenBg,  text: C.safeGreenText,  bar: C.safeGreenBorder,  icon: '✓' },
  yellow: { bg: C.safeYellowBg, text: C.safeYellowText, bar: C.safeYellowBorder, icon: '⚠' },
  red:    { bg: C.safeRedBg,    text: C.safeRedText,     bar: C.safeRedBorder,    icon: '✕' },
};

export default function SafetyBadge({ level, message }: Props) {
  const c = CONFIG[level];
  return (
    <View style={[styles.badge, { backgroundColor: c.bg }]}>
      <View style={[styles.bar, { backgroundColor: c.bar }]} />
      <Text style={[styles.icon, { color: c.bar }]}>{c.icon}</Text>
      <Text style={[styles.text, { color: c.text }]}>{message}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: R.md,
    marginTop: 10,
    overflow: 'hidden',
    elevation: 1,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 3,
  },
  bar: {
    width: 5,
    alignSelf: 'stretch',
  },
  icon: {
    fontSize: T.md,
    fontWeight: T.heavy,
    marginHorizontal: 12,
  },
  text: {
    fontSize: T.base,
    fontWeight: T.bold,
    flex: 1,
    paddingVertical: 13,
    paddingRight: 14,
    lineHeight: 21,
  },
});
