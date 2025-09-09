// src/AppNavigator.tsx
import * as React from "react";
import { Text } from "react-native";
import { NavigationContainer, DefaultTheme } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WeatherScreen from "./screens/weather/WeatherScreen";
import HourlyScreen from "./screens/hourlyScreen/HourlyScreen";
import DailyScreen from "./screens/dailyScreen/DailyScreen";
import FavoritesScreen from "./screens/FavoritesScreen";
import SettingsScreen from "./screens/SettingsScreen";

// ----- Home Stack (Ahora -> Pronóstico)
type HomeStackParamList = {
  Tiempo: { name?: string; lat: number; lon: number } | undefined;
  Proximas_Horas: { hours: any[]; title?: string };
  Pronostico_Dias: { days: any[]; title?: string };
};

const HomeStack = createNativeStackNavigator<HomeStackParamList>();

function HomeStackNavigator() {
  return (
    <HomeStack.Navigator>
      <HomeStack.Screen
        name="Tiempo"
        component={WeatherScreen}
        options={{ title: "Tiempo" }}
      />
      <HomeStack.Screen
        name="Proximas_Horas"
        component={HourlyScreen}
        options={({ route }) => ({
          title: route.params?.title ?? "Próximas horas",
        })}
      />
      <HomeStack.Screen
        name="Pronostico_Dias"
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

  return (
    <NavigationContainer>
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
