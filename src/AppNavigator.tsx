// src/AppNavigator.tsx
import * as React from "react";
import { Text, useColorScheme } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { WeatherScreenParams } from "./presentation/weather/WeatherScreen";
import type { HourlyScreenParams } from "./presentation/hourly/HourlyScreen";
import type { DailyScreenParams } from "./presentation/daily/DailyScreen";


import WeatherScreen from "./presentation/weather/WeatherScreen";
import HourlyScreen from "./presentation/hourly/HourlyScreen";
import DailyScreen from "./presentation/daily/DailyScreen";
import MyWeatherScreen from "./presentation/myweather/MyWeatherScreen";
import FavoritesScreen from "./presentation/FavoritesScreen";
import SettingsScreen from "./presentation/SettingsScreen";


export type HomeStackParamList = {
  MyWeather: undefined;
  Weather: WeatherScreenParams;
  NextHours: HourlyScreenParams;
  NextDays: DailyScreenParams;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="MyWeather"
        component={MyWeatherScreen}
        options={{ title: "Mi Tiempo" }}
      />
      <HomeStack.Screen
        name="Weather"
        component={WeatherScreen}
        options={{ title: "Tiempo" }}
      />
      <HomeStack.Screen
        name="NextHours"
        component={HourlyScreen}
        options={({ route }) => ({ title: route.params.title })}
      />
      <HomeStack.Screen
        name="NextDays"
        component={DailyScreen}
        options={({ route }) => ({ title: route.params.title })}
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
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        initialRouteName="Inicio"
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
          name="Inicio"
          component={HomeStackNavigator}
          options={{
            tabBarLabel: "Inicio",
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
