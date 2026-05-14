import { useMemo } from 'react';
import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { FF, T, R, TOUCH_TARGET, ColorPalette } from '@/theme';
import { useColors } from '@/context/ThemeContext';

interface Props {
  label: string;
  value: string;
  onChangeText: (val: string) => void;
  unit?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
}

function makeStyles(C: ColorPalette) {
  return StyleSheet.create({
    wrapper: {
      marginBottom: 14,
    },
    label: {
      fontSize: T.base,
      fontFamily: FF.bold,
      color: C.green900,
      marginBottom: 6,
      letterSpacing: 0.1,
    },
    unit: {
      fontSize: T.sm,
      fontFamily: FF.normal,
      color: C.textMid,
    },
    input: {
      borderWidth: 1.5,
      borderColor: C.borderMid,
      borderRadius: R.md,
      paddingHorizontal: 16,
      paddingVertical: 0,
      minHeight: TOUCH_TARGET,
      fontSize: T.md,
      fontFamily: FF.medium,
      color: C.text,
      backgroundColor: C.stripe,
    },
  });
}

export default function NumericInput({ label, value, onChangeText, unit, placeholder, keyboardType = 'decimal-pad' }: Props) {
  const C = useColors();
  const styles = useMemo(() => makeStyles(C), [C]);

  return (
    <View style={styles.wrapper}>
      <Text style={styles.label}>
        {label}
        {unit ? <Text style={styles.unit}> ({unit})</Text> : null}
      </Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        keyboardType={keyboardType}
        placeholder={placeholder ?? '0'}
        placeholderTextColor={C.textLight}
      />
    </View>
  );
}
