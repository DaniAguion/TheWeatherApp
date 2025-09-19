import React, { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, Platform, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import WeatherScreen from "../weatherScreen/WeatherScreen";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { HomeStackParamList } from "../../AppNavigator";
import styles from "./MyWeatherScreen.styles";
import { useSelectedLocation, DEFAULT_SELECTED_LOCATION } from "../../hooks/useSelectedLocation";
import { LocationPermission } from "../../native/LocationPermission";

type Props = NativeStackScreenProps<HomeStackParamList, "MyWeather">;

export default function MyWeatherScreen({ navigation, route }: Props) {
  const {
    selectedLocation,
    savedLocation,
    usingCurrentLocation,
    loading: selectedLoading,
    error: selectedError,
    clearSelectedLocation,
    saveSelectedLocation,
  } = useSelectedLocation();
  const shouldUseCurrentLocation = !selectedLoading && usingCurrentLocation;
  const { coords, loading, error, refresh } = useCurrentLocation({ enabled: shouldUseCurrentLocation });
  const isFirstFocus = useRef(true);
  const isUsingCurrentLocation = usingCurrentLocation;

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
    if (!shouldUseCurrentLocation) return;
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
  }, [shouldUseCurrentLocation]);

  const fallback = savedLocation ?? DEFAULT_SELECTED_LOCATION;
  const params = route?.params;
  const lat = selectedLocation?.lat ?? coords?.lat ?? fallback.lat;
  const lon = selectedLocation?.lon ?? coords?.lon ?? fallback.lon;
  const name = selectedLocation?.name ?? (coords ? "Ubicación" : fallback.name);
  const savedLocationName = savedLocation?.name ?? DEFAULT_SELECTED_LOCATION.name;
  const buttonsDisabled = selectedLoading;

  let content: React.ReactNode;

  if (!params && selectedLoading && usingCurrentLocation) {
    content = (
      <View style={styles.state_container}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (!params && shouldUseCurrentLocation && loading && !coords) {
    content = (
      <View style={styles.state_container}>
        <ActivityIndicator size="large" />
      </View>
    );
  } else if (!params && shouldUseCurrentLocation && error && !coords) {
    content = (
      <View style={styles.state_container}>
        <Text style={styles.error_text}>No es posible obtener la ubicación actual</Text>
      </View>
    );
  } else {
    content = (
      <WeatherScreen
        navigation={navigation}
        route={{ params: { name, lat, lon } }}
      />
    );
  }

  return (
    <View style={styles.screen_container}>
      <View style={styles.selector_container}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleSelectCurrent}
          disabled={isUsingCurrentLocation || buttonsDisabled}
          style={[
            styles.selector_button,
            styles.selector_button_left,
            isUsingCurrentLocation && styles.selector_button_active,
          ]}
        >
          <Text
            style={[
              styles.selector_button_text,
              isUsingCurrentLocation && styles.selector_button_text_active,
            ]}
          >
            Mi ubicación
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleSelectSaved}
          disabled={!isUsingCurrentLocation || buttonsDisabled}
          style={[
            styles.selector_button,
            styles.selector_button_right,
            !isUsingCurrentLocation && styles.selector_button_active,
          ]}
        >
          <Text
            style={[
              styles.selector_button_text,
              !isUsingCurrentLocation && styles.selector_button_text_active,
            ]}
          >
            {savedLocationName}
          </Text>
        </TouchableOpacity>
      </View>
      {selectedError ? <Text style={styles.error_text}>{selectedError}</Text> : null}
      <View style={styles.content_container}>
        {content}
      </View>
    </View>
  );
}
