import { useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
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

  const opacity    = useRef(new Animated.Value(0)).current;
  const translateX = useRef(new Animated.Value(-10)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: 220, useNativeDriver: true,
      }),
      Animated.spring(translateX, {
        toValue: 0, tension: 300, friction: 24, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateX }] }}>
      <View style={[base.badge, { backgroundColor: c.bg }]}>
        <View style={[base.bar, { backgroundColor: c.bar }]} />
        <Text style={[base.icon, { color: c.bar }]}>{c.icon}</Text>
        <Text style={[base.text, { color: c.text }]}>{message}</Text>
      </View>
    </Animated.View>
  );
}
