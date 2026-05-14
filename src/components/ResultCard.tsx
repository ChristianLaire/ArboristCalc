import { useRef, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { FF, T, R, ColorPalette } from '@/theme';
import { useColors } from '@/context/ThemeContext';

interface Row {
  label: string;
  value: string;
}

interface Props {
  title: string;
  rows: Row[];
}

function makeStyles(C: ColorPalette) {
  return StyleSheet.create({
    card: {
      backgroundColor: C.card,
      borderRadius: R.md,
      marginTop: 16,
      borderWidth: 1,
      borderColor: C.border,
      overflow: 'hidden',
      elevation: 3,
      shadowColor: '#000',
      shadowOpacity: 0.09,
      shadowOffset: { width: 0, height: 2 },
      shadowRadius: 8,
    },
    titleRow: {
      flexDirection: 'row',
      alignItems: 'center',
      paddingHorizontal: 16,
      paddingTop: 14,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: C.border,
    },
    titleBar: {
      width: 4,
      height: 20,
      backgroundColor: C.green800,
      borderRadius: 2,
      marginRight: 10,
    },
    title: {
      fontSize: T.md,
      fontFamily: FF.heavy,
      color: C.green900,
      flex: 1,
    },
    row: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      paddingVertical: 12,
      paddingHorizontal: 16,
    },
    rowAlt: {
      backgroundColor: C.stripe,
    },
    rowLabel: {
      fontSize: T.base,
      fontFamily: FF.normal,
      color: C.textMid,
      flex: 1,
    },
    rowValue: {
      fontSize: T.base,
      fontFamily: FF.bold,
      color: C.text,
      textAlign: 'right',
      marginLeft: 12,
    },
  });
}

export default function ResultCard({ title, rows }: Props) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  const opacity    = useRef(new Animated.Value(0)).current;
  const translateY = useRef(new Animated.Value(14)).current;

  useEffect(() => {
    Animated.parallel([
      Animated.timing(opacity, {
        toValue: 1, duration: 260, useNativeDriver: true,
      }),
      Animated.spring(translateY, {
        toValue: 0, tension: 280, friction: 26, useNativeDriver: true,
      }),
    ]).start();
  }, []);

  return (
    <Animated.View style={{ opacity, transform: [{ translateY }] }}>
      <View style={styles.card}>
        <View style={styles.titleRow}>
          <View style={styles.titleBar} />
          <Text style={styles.title}>{title}</Text>
        </View>
        {rows.map((row, i) => (
          <View key={i} style={[styles.row, i % 2 === 1 && styles.rowAlt]}>
            <Text style={styles.rowLabel}>{row.label}</Text>
            <Text style={styles.rowValue}>{row.value}</Text>
          </View>
        ))}
      </View>
    </Animated.View>
  );
}
