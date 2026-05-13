import { Tabs } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#2e7d32',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: { backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#e0e0e0' },
        headerStyle: { backgroundColor: '#2e7d32' },
        headerTintColor: '#fff',
        headerTitleStyle: { fontWeight: '700' },
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
    </Tabs>
  );
}
