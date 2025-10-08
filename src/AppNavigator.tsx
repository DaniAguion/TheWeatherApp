// src/AppNavigator.tsx
import * as React from "react";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useColorScheme } from "react-native";
import { NavigationContainer} from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { PersonalizedDarkTheme, PersonalizedLigthTheme } from "./presentation/Themes";

import type { WeatherScreenParams } from "./presentation/weather/WeatherScreen";
import type { HourlyScreenParams } from "./presentation/hourly/HourlyScreen";
import type { DailyScreenParams } from "./presentation/daily/DailyScreen";


import WeatherScreen from "./presentation/weather/WeatherScreen";
import HourlyScreen from "./presentation/hourly/HourlyScreen";
import DailyScreen from "./presentation/daily/DailyScreen";
import MainScreen from "./presentation/main/MainScreen";
import ExploreScreen from "./presentation/explore/ExploreScreen";
import SavedScreen from "./presentation/saved/SavedScreen";


export type RootStackParamsList = {
  Tabs: undefined;
  Weather: WeatherScreenParams;
  NextHours: HourlyScreenParams;
  NextDays: DailyScreenParams;
};

export type TabParamList = {
  HomeMain: undefined;
  ExploreMain: undefined;
  SavedMain: undefined;
};

const RootStack = createNativeStackNavigator<RootStackParamsList>();
const Tab = createBottomTabNavigator<TabParamList>();

function TabsNavigator() {
  
  return (
    <Tab.Navigator
      initialRouteName="HomeMain"
      backBehavior="history"
      screenOptions={({ route }) => {
        const ICON_SIZE = 24;
        return {
          tabBarStyle: { paddingTop: 6, paddingBottom: 6 },
            tabBarLabelStyle: { fontSize: 14, fontWeight: "600" },
          tabBarActiveTintColor: "#1273de",
          tabBarInactiveTintColor: "#7a7a7a",
          tabBarIcon: ({ color, focused }) => {
            let name: string;
            switch (route.name) {
              case "ExploreMain":
                name = focused ? "compass" : "compass-outline";
                break;
              case "HomeMain":
                name = focused ? "sunny" : "sunny-outline";
                break;
              case "SavedMain":
                name = focused ? "bookmark" : "bookmark-outline";
                break;
              default:
                name = "ellipse";
            }
            return <Ionicons name={name as any} size={ICON_SIZE} color={color} />;
          },
        };
      }}
    >
      <Tab.Screen
        name="ExploreMain"
        component={ExploreScreen}
        options={{
          title: "Explorar",
          headerTitleAlign: "center",
        }}
      />
      <Tab.Screen
        name="HomeMain"
        component={MainScreen}
        options={{
          title: "Principal",
          headerTitleAlign: "center"
        }}
      />
      <Tab.Screen
        name="SavedMain"
        component={SavedScreen}
        options={{
          title: "Guardado",
          headerTitleAlign: "center"
        }}
      />
    </Tab.Navigator>
  );
}


export default function AppNavigator() {
  const scheme = useColorScheme();
  return (
    <NavigationContainer theme={scheme === "dark" ? PersonalizedDarkTheme : PersonalizedLigthTheme}>
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
