import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { C, T } from '@/theme';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#ffffff',
        tabBarInactiveTintColor: 'rgba(255,255,255,0.45)',
        tabBarStyle: {
          backgroundColor: C.green900,
          borderTopWidth: 0,
          elevation: 8,
          shadowColor: '#000',
          shadowOpacity: 0.18,
          shadowOffset: { width: 0, height: -2 },
          shadowRadius: 6,
          height: 62,
          paddingBottom: 8,
        },
        tabBarLabelStyle: {
          fontSize: T.xs + 1,
          fontWeight: T.semibold,
          letterSpacing: 0.2,
        },
        headerStyle: { backgroundColor: C.green900 },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: T.heavy, fontSize: T.lg, letterSpacing: 0.3 },
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
