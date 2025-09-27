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

const tabBarIconFontSize = { fontSize: 24 };

function TabsNavigator() {
  return (
    <Tab.Navigator
      initialRouteName="HomeMain"
      backBehavior="history"
      screenOptions={{
        tabBarStyle: { height: 100, paddingTop: 8, paddingBottom: 8 },
        tabBarItemStyle: { paddingVertical: 4},
        tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
        tabBarIconStyle: { width: 40, height: 40},
      }}
    >
      <Tab.Screen
        name="ExploreMain"
        component={ExploreScreen}
        options={{
          title: "Explorar",
          headerTitleAlign: "center",
          tabBarIcon: () => <Text style={tabBarIconFontSize}>🧭</Text>,
        }}
      />
      <Tab.Screen
        name="HomeMain"
        component={MainScreen}
        options={{
          title: "Principal",
          headerTitleAlign: "center",
          tabBarIcon: () => <Text style={tabBarIconFontSize}>🌤️</Text>,
        
        }}
      />
      <Tab.Screen
        name="SettingsMain"
        component={SettingsScreen}
        options={{
          title: "Ajustes",
          headerTitleAlign: "center",
          tabBarIcon: () => <Text style={tabBarIconFontSize}>⚙️</Text>,
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
