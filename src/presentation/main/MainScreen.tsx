import Toast from "react-native-toast-message";
import React from "react";
import Ionicons from "@react-native-vector-icons/ionicons";
import { ActivityIndicator, Text, TouchableOpacity, View, Button } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCallback, useEffect, useRef } from "react";
import { Animated, Easing } from "react-native";
import { toUIErrorMessage } from "../errorMessages"
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
    refreshPreferences,
    refreshLocation
  } = useMainVM(deps);


  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: toUIErrorMessage(error),
        position: "bottom",
        visibilityTime: 2000
      });
    }
  }, [error]);


  // Fade in animation for content
  const opacity = useRef(new Animated.Value(0)).current;
  const runFadeIn = useCallback(() => {
    opacity.setValue(0);
    Animated.timing(opacity, {
      toValue: 1,
      duration: 1000,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: true,
    }).start();
  }, [loading, opacity]);

  // Run the fade-in animation when loading or usingCurrentLocation changes
  useEffect(() => {
    runFadeIn();
  }, [loading, usingCurrentLocation]);


  // Refresh preferences when the screen is focused
  useFocusEffect(
    useCallback(() => {
      refreshPreferences();
    }, [refreshPreferences])
  );

  return (
    <View style={styles.screen_container}>
      <View style={styles.selector_container}>
        <TouchableOpacity
          accessibilityRole="button"
          disabled={usingCurrentLocation}
          onPress={handleSelectCurrent}
          style={[
            styles.selector_button,
            styles.selector_button_left,
            usingCurrentLocation && styles.selector_button_active,
          ]}
        >
          <Ionicons 
            name={"location-outline"} 
            style={[
              styles.selector_button_text,
              usingCurrentLocation && styles.selector_button_text_active,
            ]}
          />
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
          disabled={!usingCurrentLocation}
          onPress={handleSelectFavourite}
          style={[
            styles.selector_button,
            styles.selector_button_right,
            !usingCurrentLocation && styles.selector_button_active,
          ]}
        >
          <Ionicons 
            name={"star-outline"}
            style={[
              styles.selector_button_text,
              !usingCurrentLocation && styles.selector_button_text_active,
            ]}></Ionicons>
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

      <Animated.View style={[styles.content_container, { opacity }]}>
        {loading ? (
          <View style={styles.state_container}>
            <ActivityIndicator size="large" />
          </View>
        ) : error ? (
          <View style={styles.state_container}>
            <Text style={styles.error_text}>No se ha podido cargar la localización</Text>
            { usingCurrentLocation ?
              <TouchableOpacity
                onPress={refreshLocation}
                style={styles.retry_button}
                accessibilityRole="button"
              >
                <Text style={styles.retry_button_text}>Reintentar</Text>
              </TouchableOpacity>
            : null }
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
            { usingCurrentLocation ?
              <TouchableOpacity
                onPress={refreshLocation}
                style={styles.retry_button}
                accessibilityRole="button"
              >
                <Text style={styles.retry_button_text}>Reintentar</Text>
              </TouchableOpacity>
            : null }
          </View>
        )}
      </Animated.View>
    </View>
  );
}