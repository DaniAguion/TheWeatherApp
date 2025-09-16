import React from "react";
import { ActivityIndicator, Text, View } from "react-native";
import WeatherScreen from "../weatherScreen/WeatherScreen";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList, PlaceParams } from "../../AppNavigator"
import styles from "./MyWeatherScreen.styles";

const DEFAULT_LOCATION = { name: "Madrid", lat: 40.4168, lon: -3.7038 };

type Props = NativeStackScreenProps<HomeStackParamList, "MyWeather">;

export default function MyWeatherScreen({ navigation, route } : Props) {
  const { coords, loading, error } = useCurrentLocation();

  // If there is no prefixed location, use current location or default
  const lat = route?.params?.lat ?? coords?.lat ?? DEFAULT_LOCATION.lat;
  const lon = route?.params?.lon ?? coords?.lon ?? DEFAULT_LOCATION.lon;
  const name = route?.params?.name ?? (coords ? "Mi ubicación" : DEFAULT_LOCATION.name);
  
  if (!route?.params && loading && !coords) {
    return (
      <View style={styles.main_container}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  // Show error message if location permission is denied and no coordinates available
  // In this case, show weather for default location
  if (error && !coords) {
    return (
      <View style={styles.main_container}>
        <Text style={styles.error_text}>Mostrando ubicación por defecto</Text>
        <WeatherScreen
          navigation={navigation}
          route={{ params: { name, lat, lon } }}
        />
        </View>
      );
    }


  // Render WeatherScreen with the prefixed location or the current location
  return (
    <WeatherScreen
      navigation={navigation}
      route={{ params: { name, lat, lon } }}
    />
  );
}
