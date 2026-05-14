import { useEffect, useState, useMemo } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3LightTheme, MD3DarkTheme } from 'react-native-paper';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useFonts, Inter_400Regular, Inter_500Medium, Inter_600SemiBold, Inter_700Bold, Inter_800ExtraBold } from '@expo-google-fonts/inter';
import { ThemeProvider, useTheme } from '@/context/ThemeContext';
import { FF, T, R, TOUCH_TARGET, ColorPalette, lightC } from '@/theme';

const DISCLAIMER_KEY = 'disclaimer_accepted';

function makeStyles(C: ColorPalette) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.7)',
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
      width: 56,
      height: 56,
      borderRadius: 28,
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
      fontFamily: FF.heavy,
      color: C.text,
      textAlign: 'center',
      letterSpacing: 0.2,
    },
    body: {
      fontSize: T.base,
      fontFamily: FF.normal,
      color: C.textMid,
      lineHeight: T.base * 1.5,
      textAlign: 'center',
    },
    button: {
      backgroundColor: C.green900,
      borderRadius: R.pill,
      paddingVertical: 0,
      minHeight: TOUCH_TARGET,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 4,
    },
    buttonText: {
      color: '#fff',
      fontFamily: FF.bold,
      fontSize: T.base,
      letterSpacing: 0.3,
    },
  });
}

function AppContent() {
  const { colors: C, isDark } = useTheme();
  const styles = useMemo(() => makeStyles(C), [C]);
  const [showDisclaimer, setShowDisclaimer] = useState(false);

  useEffect(() => {
    AsyncStorage.getItem(DISCLAIMER_KEY).then(val => {
      if (!val) setShowDisclaimer(true);
    });
  }, []);

  const acceptDisclaimer = () => {
    AsyncStorage.setItem(DISCLAIMER_KEY, 'true');
    setShowDisclaimer(false);
  };

  const paperTheme = isDark
    ? { ...MD3DarkTheme,  colors: { ...MD3DarkTheme.colors,  primary: C.green800, secondaryContainer: C.green100, onSecondaryContainer: C.green900 } }
    : { ...MD3LightTheme, colors: { ...MD3LightTheme.colors, primary: C.green800, secondaryContainer: C.green50,  onSecondaryContainer: C.green900 } };

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

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Inter_400Regular,
    Inter_500Medium,
    Inter_600SemiBold,
    Inter_700Bold,
    Inter_800ExtraBold,
  });

  // Render immediately — system font fallback while Inter loads, then re-renders
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}
