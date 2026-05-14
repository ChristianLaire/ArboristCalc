import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useColorScheme } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { lightC, darkC, ColorPalette } from '@/theme';

export type ThemeMode = 'auto' | 'light' | 'dark';

interface ThemeContextValue {
  colors: ColorPalette;
  isDark: boolean;
  mode: ThemeMode;
  setMode: (m: ThemeMode) => void;
}

const ThemeContext = createContext<ThemeContextValue>({
  colors: lightC,
  isDark: false,
  mode: 'auto',
  setMode: () => {},
});

export function ThemeProvider({ children }: { children: ReactNode }) {
  const system = useColorScheme();
  const [mode, setModeState] = useState<ThemeMode>('auto');

  useEffect(() => {
    AsyncStorage.getItem('arborist_theme_mode').then(v => {
      if (v === 'light' || v === 'dark' || v === 'auto') setModeState(v);
    });
  }, []);

  const setMode = (m: ThemeMode) => {
    setModeState(m);
    AsyncStorage.setItem('arborist_theme_mode', m);
  };

  const isDark = mode === 'dark' || (mode === 'auto' && system === 'dark');
  const colors = isDark ? darkC : lightC;

  return (
    <ThemeContext.Provider value={{ colors, isDark, mode, setMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export const useTheme = () => useContext(ThemeContext);
export const useColors = () => useContext(ThemeContext).colors;
