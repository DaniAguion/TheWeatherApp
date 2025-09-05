// src/AppNavigator.tsx
import * as React from "react";
import { Text } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import TodayScreen from "./screens/TodayScreen";
import MainScreen from "./screens/main/MainScreen";
import ForecastScreen from "./screens/ForecastScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import SettingsScreen from "./screens/SettingsScreen";

// ----- Home Stack (Ahora -> Pronóstico)
type HomeStackParamList = {
  Inicio: { name?: string; lat: number; lon: number } | undefined;
  Pronóstico: { days: any[]; title?: string };
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Inicio"
        component={MainScreen}
        options={{ title: "Inicio" }}
      />
      <HomeStack.Screen
        name="Pronóstico"
        component={ForecastScreen}
        options={({ route }) => ({
          title: route.params?.title ?? "Pronóstico",
        })}
      />
    </HomeStack.Navigator>
  );
}


type RootTabParamList = {
  Inicio: undefined;
  Favoritos: undefined;
  Ajustes: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {

  return (
    <NavigationContainer>
      <Tab.Navigator
        initialRouteName="Principal"
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: { fontSize: 12 },
        }}
      >
        <Tab.Screen
          name="Favoritos"
          component={FavoritesScreen}
          options={{
            tabBarIcon: () => <Text>⭐</Text>,
          }}
        />
        <Tab.Screen
          name="Principal"
          component={HomeStackNavigator}
          options={{
            tabBarLabel: "Principal",
            tabBarIcon: () => <Text>🌤️</Text>,
          }}
        />
        <Tab.Screen
          name="Ajustes"
          component={SettingsScreen}
          options={{
            tabBarIcon: () => <Text>⚙️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
