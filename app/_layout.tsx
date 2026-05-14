import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme } from 'react-native-paper';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { C, T, R } from '@/theme';

const DISCLAIMER_KEY = 'disclaimer_accepted';

const paperTheme = {
  ...MD3LightTheme,
  colors: {
    ...MD3LightTheme.colors,
    primary: C.green800,
    secondaryContainer: C.green50,
    onSecondaryContainer: C.green900,
  },
};

export default function RootLayout() {
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(DISCLAIMER_KEY).then((val) => {
      if (!val) setShowDisclaimer(true);
    });
  }, []);

  const acceptDisclaimer = () => {
    AsyncStorage.setItem(DISCLAIMER_KEY, 'true');
    setShowDisclaimer(false);
  };

  return (
    <PaperProvider theme={paperTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <Modal visible={showDisclaimer} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <View style={styles.iconRow}>
              <View style={styles.iconCircle}>
                <Text style={styles.iconText}>⚠</Text>
              </View>
            </View>
            <Text style={styles.title}>Safety Notice</Text>
            <Text style={styles.body}>
              Results are mathematical estimates only. Field conditions, wood defects, hardware
              wear, and dynamic variables affect actual loads. Always apply professional judgment
              and comply with ANSI Z133. This tool does not replace ISA-certified training.
            </Text>
            <TouchableOpacity style={styles.button} onPress={acceptDisclaimer}>
              <Text style={styles.buttonText}>I understand — continue</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.65)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: C.card,
    borderRadius: R.lg,
    padding: 28,
    gap: 14,
    maxWidth: 440,
    width: '100%',
  },
  iconRow: {
    alignItems: 'center',
    marginBottom: 4,
  },
  iconCircle: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: C.safeYellowBg,
    borderWidth: 2,
    borderColor: C.safeYellowBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: T.xl,
    color: C.orange700,
  },
  title: {
    fontSize: T.xl,
    fontWeight: T.heavy,
    color: C.text,
    textAlign: 'center',
    letterSpacing: 0.2,
  },
  body: {
    fontSize: T.base,
    color: C.textMid,
    lineHeight: 23,
    textAlign: 'center',
  },
  button: {
    backgroundColor: C.green900,
    borderRadius: R.md,
    paddingVertical: 14,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonText: {
    color: '#fff',
    fontWeight: T.bold,
    fontSize: T.base,
    letterSpacing: 0.3,
  },
});
