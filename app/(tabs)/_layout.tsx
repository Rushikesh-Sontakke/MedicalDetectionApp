import React from 'react';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import { Tabs } from 'expo-router';

function TabBarIcon(props: {
  name: React.ComponentProps<typeof FontAwesome>['name'];
  color: string;
}) {
  return <FontAwesome size={28} style={{ marginBottom: -3 }} {...props} />;
}

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: '#472601',
        tabBarInactiveTintColor: '#666',
        headerStyle: {
          backgroundColor: '#472601',
        },
        headerTintColor: '#fff',
        headerTitleStyle: {
          fontWeight: 'bold',
        },
      }}>
      <Tabs.Screen
        name="index"
        options={{
          title: 'Medical Detection APP',
          tabBarIcon: ({ color }) => <TabBarIcon name="camera" color={color} />,
          headerShown: false, // to hide the header
          tabBarStyle: { display: 'none' }, // to hide the footer bar
        }}
      />
    </Tabs>
  );
}
