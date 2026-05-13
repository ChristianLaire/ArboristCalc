import { useEffect, useState } from 'react';
import { Stack } from 'expo-router';
import { PaperProvider, MD3DarkTheme, MD3LightTheme } from 'react-native-paper';
import { Modal, View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DISCLAIMER_KEY = 'disclaimer_accepted';

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
    <PaperProvider theme={MD3LightTheme}>
      <Stack screenOptions={{ headerShown: false }} />
      <Modal visible={showDisclaimer} transparent animationType="fade">
        <View style={styles.overlay}>
          <View style={styles.modal}>
            <Text style={styles.title}>Safety Notice</Text>
            <Text style={styles.body}>
              Results are mathematical estimates only. Field conditions, wood defects, hardware wear,
              and dynamic variables affect actual loads. Always apply professional judgment and comply
              with ANSI Z133. This tool does not replace ISA-certified training.
            </Text>
            <TouchableOpacity style={styles.button} onPress={acceptDisclaimer}>
              <Text style={styles.buttonText}>I understand — don't show again</Text>
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
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modal: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 24,
    gap: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1a1a1a',
  },
  body: {
    fontSize: 14,
    color: '#444',
    lineHeight: 22,
  },
  button: {
    backgroundColor: '#2e7d32',
    borderRadius: 8,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});
