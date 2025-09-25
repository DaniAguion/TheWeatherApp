import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../AppNavigator";
import { useServices } from "../../di/ServicesProvider";
import WeatherScreen from "../weather/WeatherScreen";
import { useMainVM, UseMainVMDeps } from "./useMainVM";
import styles from "./MainScreen.styles";

type Props = NativeStackScreenProps<HomeStackParamList>;


export default function MainScreen({ navigation, route }: Props) {
  const deps: UseMainVMDeps = useServices();
  const {
    loading,
    error,
    usingCurrentLocation,
    location,
    favouriteLocationName,
    handleSelectCurrent,
    handleSelectFavourite,
  } = useMainVM(deps);


  return (
    <View style={styles.screen_container}>
      <View style={styles.selector_container}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleSelectCurrent}
          disabled={usingCurrentLocation}
          style={[
            styles.selector_button,
            styles.selector_button_left,
            usingCurrentLocation && styles.selector_button_active,
          ]}
        >
          <Text
            style={[
              styles.selector_button_text,
              usingCurrentLocation && styles.selector_button_text_active,
            ]}
          >
            Mi ubicación
          </Text>
        </TouchableOpacity>

        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleSelectFavourite}
          disabled={!usingCurrentLocation}
          style={[
            styles.selector_button,
            styles.selector_button_right,
            !usingCurrentLocation && styles.selector_button_active,
          ]}
        >
          <Text
            style={[
              styles.selector_button_text,
              !usingCurrentLocation && styles.selector_button_text_active,
            ]}
          >
            {favouriteLocationName}
          </Text>
        </TouchableOpacity>
      </View>

      {error ? <Text style={styles.error_text}>{error}</Text> : null}

      <View style={styles.content_container}>
        {loading ? (
          <View style={styles.state_container}>
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View style={styles.state_container}>
            <Text style={styles.error_text}>{error}</Text>
          </View>
        ) : !location ? (
          <View style={styles.state_container}>
            <Text style={styles.error_text}>No ha sido posible obtener la localización</Text>
          </View>
        ) : (
          <WeatherScreen
            navigation={navigation}
            route={{ params: { name: location.name, coordinates: location.coordinates } }}
          />
        )}
      </View>
    </View>
  );
}