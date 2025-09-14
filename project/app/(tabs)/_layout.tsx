import { Tabs } from "expo-router";
import { Home, Plus, BarChart3, Trophy, Info } from "lucide-react-native";
import React from "react";

import Colors from "@/constants/colors";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.light.primary,
        tabBarInactiveTintColor: Colors.light.tabIconDefault,
        headerShown: true,
        tabBarStyle: {
          backgroundColor: Colors.light.card,
          borderTopColor: Colors.light.border,
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600' as const,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Home",
          tabBarIcon: ({ color, size }) => <Home color={color} size={size} />,
          headerTitle: "EcoPulse",
          headerStyle: {
            backgroundColor: Colors.light.primary,
          },
          headerTintColor: Colors.light.card,
          headerTitleStyle: {
            fontWeight: 'bold' as const,
            fontSize: 20,
          },
        }}
      />
      <Tabs.Screen
        name="log-commute"
        options={{
          title: "Log Trip",
          tabBarIcon: ({ color, size }) => <Plus color={color} size={size} />,
          headerTitle: "Log Your Commute",
          headerStyle: {
            backgroundColor: Colors.light.primary,
          },
          headerTintColor: Colors.light.card,
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: "Impact",
          tabBarIcon: ({ color, size }) => <BarChart3 color={color} size={size} />,
          headerTitle: "Community Impact",
          headerStyle: {
            backgroundColor: Colors.light.primary,
          },
          headerTintColor: Colors.light.card,
        }}
      />
      <Tabs.Screen
        name="leaderboard"
        options={{
          title: "Leaderboard",
          tabBarIcon: ({ color, size }) => <Trophy color={color} size={size} />,
          headerTitle: "Green Champions",
          headerStyle: {
            backgroundColor: Colors.light.primary,
          },
          headerTintColor: Colors.light.card,
        }}
      />
      <Tabs.Screen
        name="about"
        options={{
          title: "About",
          tabBarIcon: ({ color, size }) => <Info color={color} size={size} />,
          headerTitle: "About EcoPulse",
          headerStyle: {
            backgroundColor: Colors.light.primary,
          },
          headerTintColor: Colors.light.card,
        }}
      />
    </Tabs>
  );
}
