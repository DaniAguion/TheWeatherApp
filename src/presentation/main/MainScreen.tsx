import React from "react";
import { ActivityIndicator, Text, TouchableOpacity, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { RootStackParamsList, TabParamList } from "../../AppNavigator";
import { useServices } from "../../di/ServicesProvider";
import WeatherScreen from "../weather/WeatherScreen";
import { useMainVM, UseMainVMDeps } from "./useMainVM";
import styles from "./MainScreen.styles";


type MainScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "HomeMain">,
  NativeStackScreenProps<RootStackParamsList>
>;

export default function MainScreen({ navigation, route }: MainScreenProps) {
  const deps: UseMainVMDeps = useServices();
  const {
    loading,
    error,
    usingCurrentLocation,
    currentLocation,
    favouriteLocation,
    handleSelectCurrent,
    handleSelectFavourite, 
    refreshPreferences
  } = useMainVM(deps);


  // Fade in animation when data is loaded
  const opacity = useRef(new Animated.Value(0)).current;
  const runFadeIn = useCallback(() => {
    opacity.setValue(0);
    if (!loading && !error) {
      Animated.timing(opacity, {
        toValue: 1,
        duration: 500,
        easing: Easing.out(Easing.cubic),
        useNativeDriver: true,
      }).start();
    }
  }, [loading, error, opacity]);

  // Run the fade-in animation when loading, error or usingCurrentLocation changes
  useEffect(() => {
    runFadeIn();
  }, [loading, error, usingCurrentLocation]);


  // Refresh preferences when the screen is focused
  useFocusEffect(
    useCallback(() => {
      refreshPreferences();
    }, [refreshPreferences])
  );

  return (
    <Animated.View style={[styles.screen_container, { opacity }]}>
      <View style={styles.selector_container}>
        <TouchableOpacity
          accessibilityRole="button"
          onPress={handleSelectCurrent}
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
            {favouriteLocation?.name ?? "Favorita"}
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content_container}>
        {loading ? (
          <View style={styles.state_container}>
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View style={styles.state_container}>
            <Text style={styles.error_text}>{error}</Text>
          </View>
        ) : (usingCurrentLocation && currentLocation != null) ? (
          <WeatherScreen
            navigation={navigation}
            route={{ params: { 
              name: currentLocation.name, 
              coordinates: currentLocation.coordinates
            } }}
          />
        ) : (!usingCurrentLocation && favouriteLocation != null) ? (
          <WeatherScreen
            navigation={navigation}
            route={{ params: { 
              name: favouriteLocation.name, 
              coordinates: favouriteLocation.coordinates
            } }}
          />
        ) : (
          <View style={styles.state_container}>
            <Text style={styles.error_text}>No ha sido posible cargar la localización</Text>
          </View>
        )}
      </View>
    </Animated.View>
  );
}