// src/AppNavigator.tsx
import * as React from "react";
import { Text, useColorScheme } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme, NavigatorScreenParams } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import type { WeatherScreenParams } from "./presentation/weather/WeatherScreen";
import type { HourlyScreenParams } from "./presentation/hourly/HourlyScreen";
import type { DailyScreenParams } from "./presentation/daily/DailyScreen";


import WeatherScreen from "./presentation/weather/WeatherScreen";
import HourlyScreen from "./presentation/hourly/HourlyScreen";
import DailyScreen from "./presentation/daily/DailyScreen";
import MainScreen from "./presentation/main/MainScreen";
import FavoriteScreen from "./presentation/favorite/FavoriteScreen";
import SettingsScreen from "./presentation/SettingsScreen";


export type HomeStackParamList = {
  MainScreen: undefined;
  Weather: WeatherScreenParams;
  NextHours: HourlyScreenParams;
  NextDays: DailyScreenParams;
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="MainScreen"
        component={MainScreen}
        options={{ title: "Principal" }}
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

export type RootTabParamList = {
  Home: NavigatorScreenParams<HomeStackParamList>;
  Favorites: undefined;
  Settings: undefined;
};

const Tab = createBottomTabNavigator<RootTabParamList>();

export default function AppNavigator() {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <Tab.Navigator
        initialRouteName="Home"
        screenOptions={{
          headerShown: false,
          tabBarLabelStyle: { fontSize: 12 },
        }}
      >
        <Tab.Screen
          name="Favorites"
          component={FavoriteScreen}
          options={{
            tabBarIcon: () => <Text>⭐</Text>,
          }}
        />
        <Tab.Screen
          name="Home"
          component={HomeStackNavigator}
          options={{
            tabBarLabel: "Principal",
            tabBarIcon: () => <Text>🌤️</Text>,
          }}
        />
        <Tab.Screen
          name="Settings"
          component={SettingsScreen}
          options={{
            tabBarIcon: () => <Text>⚙️</Text>,
          }}
        />
      </Tab.Navigator>
    </NavigationContainer>
  );
}
