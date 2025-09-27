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
import MainScreen from "./presentation/main/MainScreen";
import ExploreScreen from "./presentation/explore/ExploreScreen";
import SettingsScreen from "./presentation/SettingsScreen";


export type RootStackParamsList = {
  Tabs: undefined;
  Weather: WeatherScreenParams;
  NextHours: HourlyScreenParams;
  NextDays: DailyScreenParams;
};

export type TabParamList = {
  HomeMain: undefined;
  ExploreMain: undefined;
  SettingsMain: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamsList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeMain"
      backBehavior="history"
      screenOptions={{ tabBarLabelStyle: { fontSize: 12 } }}
    >
      <Tab.Screen
        name="ExploreMain"
        component={ExploreScreen}
        options={{
          title: "Explorar",
          tabBarIcon: () => <Text>🧭</Text>,
        }}
      />
      <Tab.Screen
        name="HomeMain"
        component={MainScreen}
        options={{
          title: "Principal",
          tabBarIcon: () => <Text>🌤️</Text>,
        }}
      />
      <Tab.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{
          title: "Ajustes",
          tabBarIcon: () => <Text>⚙️</Text>,
        }}
      />
    </Tab.Navigator>
  );
}


export default function AppNavigator() {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === "dark" ? DarkTheme : DefaultTheme}>
      <RootStack.Navigator>
        <RootStack.Screen
          name="Tabs"
          component={TabsNavigator}
          options={{ headerShown: false }}
        />
        <RootStack.Screen
          name="Weather"
          component={WeatherScreen}
          options={({ route }) => ({ title: route.params.name })}
        />
        <RootStack.Screen
          name="NextHours"
          component={HourlyScreen}
          options={({ route }) => ({ title: route.params.title })}
        />
        <RootStack.Screen
          name="NextDays"
          component={DailyScreen}
          options={({ route }) => ({ title: route.params.title })}
        />
      </RootStack.Navigator>
    </NavigationContainer>
  );
}
