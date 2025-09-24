import React, { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import WeatherScreen from "../weather/WeatherScreen";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { useSelectedLocation, DEFAULT_SELECTED_LOCATION } from "../../hooks/useSelectedLocation";
import { LocationPermission } from "../../infraestructure/LocationPermission";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../AppNavigator";
import styles from "./MainScreen.styles";


type Props = NativeStackScreenProps<HomeStackParamList>;

export default function MainScreen({ navigation, route }: Props) {

  const {
    selectedLocation,
    savedLocation,
    usingCurrentLocation,
    loading: loadingSelected,
    error: errorSelected,
    clearSelectedLocation,
    saveSelectedLocation,
  } = useSelectedLocation();

  const { 
    coords: currentCoords, 
    loading: loadingCurrent, 
    error: errorCurrent, refresh 
  } = useCurrentLocation();

  const isFirstFocus = useRef(true);
  const selectedButtonText = savedLocation?.name ?? "Favorita";

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      if (usingCurrentLocation) refresh();
    }, [refresh, usingCurrentLocation])
  );


  const handleSelectCurrent = useCallback(() => {
    (async () => {
      if (Platform.OS === "ios") {
        try {
          const status = await LocationPermission.checkStatus();
          if (status.state !== "granted") {
            await LocationPermission.requestWhenInUse();
          }
        } catch (_err) {
          /* noop */
        }
      }
      try {
        await clearSelectedLocation();
      } catch (_err) {
        /* noop */
      }
    })().catch(() => {});
  }, [clearSelectedLocation]);

  const handleSelectSaved = useCallback(() => {
    const target = savedLocation ?? DEFAULT_SELECTED_LOCATION;
    saveSelectedLocation(target).catch(() => {});
  }, [saveSelectedLocation, savedLocation]);

  useEffect(() => {
    if (Platform.OS !== "ios") return;
    (async () => {
      try {
        const status = await LocationPermission.checkStatus();
        if (status.state !== "granted") {
          await LocationPermission.requestWhenInUse();
        }
      } catch (_err) {
        // Ignore and let the hooks handle state.
      }
    })();
  }, []);


  // Determine variables for WeatherScreen depending button selection
  const coords = usingCurrentLocation? currentCoords : selectedLocation?.coordinates;
  const locationName = usingCurrentLocation? undefined : selectedLocation?.name;
  const loading = usingCurrentLocation? loadingCurrent : loadingSelected;
  const error = usingCurrentLocation? errorCurrent : errorSelected;

  let content: React.ReactNode;

  if (loading){
    content = (
      <View style={styles.state_container}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (error || !coords) {
    content = (
      <View style={styles.state_container}>
        <Text style={styles.error_text}>No es posible obtener la ubicación actual</Text>
      </View>
    );
  } else {
    content = (
      <WeatherScreen
        navigation={navigation}
        route={{ params: { name: locationName, coordinates: coords} }}
      />
    );
  }

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
          onPress={handleSelectSaved}
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
            {selectedButtonText}
          </Text>
        </TouchableOpacity>
      </View>
      {errorSelected ? <Text style={styles.error_text}>{errorSelected}</Text> : null}
      <View style={styles.content_container}>
        {content}
      </View>
    </View>
  );
}
