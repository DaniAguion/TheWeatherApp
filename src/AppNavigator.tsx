// src/AppNavigator.tsx
import * as React from "react";
import { Text, useColorScheme } from "react-native";
import { NavigationContainer, DefaultTheme, DarkTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";


import WeatherScreen from "./ui/weatherScreen/WeatherScreen";
import HourlyScreen from "./ui/hourlyScreen/HourlyScreen";
import DailyScreen from "./ui/dailyScreen/DailyScreen";
import MyWeatherScreen from "./ui/myWeatherScreen/MyWeatherScreen";
import FavoritesScreen from "./ui/FavoritesScreen";
import SettingsScreen from "./ui/SettingsScreen";


export type PlaceParams = { name?: string; lat: number; lon: number };

export type HomeStackParamList = {
  MyWeather: PlaceParams | undefined;
  Weather: PlaceParams | undefined;
  NextHours: { hours: any[]; title?: string };
  NextDays: { days: any[]; title?: string };
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
        options={({ route }) => ({
          title: route.params?.title ?? "Próximas horas",
        })}
      />
      <HomeStack.Screen
        name="NextDays"
        component={DailyScreen}
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
