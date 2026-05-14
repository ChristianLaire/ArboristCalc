import { View, Text, TextInput, StyleSheet, KeyboardTypeOptions } from 'react-native';
import { C, T, R } from '@/theme';

interface Props {
  label: string;
  value: string;
  onChangeText: (val: string) => void;
  unit?: string;
  placeholder?: string;
  keyboardType?: KeyboardTypeOptions;
}

export default function NumericInput({ label, value, onChangeText, unit, placeholder, keyboardType = 'decimal-pad' }: Props) {
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

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 14,
  },
  label: {
    fontSize: T.base,
    fontWeight: T.bold,
    color: C.green900,
    marginBottom: 5,
    letterSpacing: 0.1,
  },
  unit: {
    fontSize: T.sm,
    fontWeight: T.normal,
    color: C.textMid,
  },
  input: {
    borderWidth: 1.5,
    borderColor: C.borderMid,
    borderRadius: R.md,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: T.md,
    color: C.text,
    backgroundColor: C.stripe,
  },
});
