import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { FF, T } from '@/theme';
import { useTheme } from '@/context/ThemeContext';

export default function TabLayout() {
  const { colors: C, isDark } = useTheme();

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: isDark ? 'rgba(255,255,255,0.40)' : 'rgba(255,255,255,0.45)',
        tabBarStyle: {
          backgroundColor: isDark ? '#0a3d0e' : C.green900,
          borderTopWidth: 0,
          elevation: 10,
          shadowColor: '#000',
          shadowOpacity: 0.22,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 8,
          height: 64,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: T.xs,
          fontFamily: FF.semibold,
          letterSpacing: 0.2,
        },
        headerStyle: { backgroundColor: isDark ? '#0a3d0e' : C.green900 },
        headerTintColor: '#fff',
        headerTitleStyle: { fontFamily: FF.heavy, fontSize: T.lg, letterSpacing: 0.3 },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="weight"
        options={{
          title: 'Weight',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="weight" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="rigging"
        options={{
          title: 'Rigging',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="link-variant" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="tension"
        options={{
          title: 'Tension / MA',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="arrow-expand-horizontal" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="anchor"
        options={{
          title: 'Anchor',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="tree" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="conditions"
        options={{
          title: 'Conditions',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="weather-partly-cloudy" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
