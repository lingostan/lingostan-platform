import { Tabs } from 'expo-router';
import React from 'react';
import { Platform } from 'react-native';

import { HapticTab } from '@/components/HapticTab';
import { IconSymbol } from '@/components/ui/IconSymbol';
import TabBarBackground from '@/components/ui/TabBarBackground';
import { Colors } from '@/constants/Colors';
import { useColorScheme } from '@/hooks/useColorScheme';
import AuthGuard from '@/components/AuthGuard';
import '../../global.css';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthGuard>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: Colors[colorScheme ?? 'light'].tint,
          headerShown: false,
          tabBarButton: HapticTab,
          tabBarBackground: TabBarBackground,
          tabBarStyle: Platform.select({
            ios: {
              // Use a transparent background on iOS to show the blur effect
              position: 'absolute',
            },
            default: {},
          }),
        }}
      >
        <Tabs.Screen
          name="dashboard"
          options={{
            title: 'Главная',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="house.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="alphabet"
          options={{
            title: 'Словарь',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="book.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="statistics"
          options={{
            title: 'Статистика',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="chart.bar.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="profile"
          options={{
            title: 'Профиль',
            tabBarIcon: ({ color }) => (
              <IconSymbol size={28} name="person.fill" color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="quiz"
          options={{
            href: null, // Hide from tab bar
          }}
        />
        <Tabs.Screen
          name="__quiz"
          options={{
            href: null, // Hide from tab bar
          }}
        />
      </Tabs>
    </AuthGuard>
  );
}
