import Toast from "react-native-toast-message";
import { useCallback, useRef, useEffect, useMemo } from "react";
import { Animated } from "react-native";
import Ionicons from "@react-native-vector-icons/ionicons";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ActivityIndicator, Button, ScrollView, FlatList, Pressable } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { toUIErrorMessage } from "../errorMessages"
import type { Location } from "../../domain/entities/LocationEntities";
import { useWeatherVM, UseWeatherVMDeps } from "./useWeatherVM";
import { useUseCases } from "../../di/ServicesProvider";
import { useColorScheme } from "react-native";
import { makeWeatherStyles } from "./WeatherScreen.styles";

export type WeatherScreenParams = Location;

type WeatherScreenProps = {
  navigation: any;
  route: { params: WeatherScreenParams };
  onFavouriteChange?: () => void;
};

export default function WeatherScreen({ navigation, route, onFavouriteChange }: WeatherScreenProps) {
  const deps: UseWeatherVMDeps = useUseCases();
  const scheme = useColorScheme();
  const styles = useMemo(() => makeWeatherStyles(scheme), [scheme]);
  const { coordinates, name } = route.params;
  const { 
    loading,
    error, 
    locationName, 
    current, 
    next24h, 
    next72h, 
    days,
    isFavourite,
    isSaved,
    fetchWeather,
    toggleFavourite,
    toggleSaved
  } = useWeatherVM(coordinates, deps, name);

  const showLocationName = locationName && locationName.length > 0;

  const favScale = useRef(new Animated.Value(1)).current;
  const savedScale = useRef(new Animated.Value(1)).current;

  // Clear view when navigating away
  useFocusEffect(useCallback(() => { return () => {} }, []));


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


  // Notify parent when favourite changes
  const prevFavRef = useRef(isFavourite);
  useEffect(() => {
    if (prevFavRef.current !== isFavourite) {
      prevFavRef.current = isFavourite;
      if (onFavouriteChange) onFavouriteChange();
    }
  }, [isFavourite, onFavouriteChange]);


  // Render loading, error
  if (loading) return (
    <View style={styles.loading_container}>
      <ActivityIndicator size="large" />
    </View>
  );

  if ((!current || !next24h || !next72h || !days)) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>No se ha podido obtener el pronóstico.</Text>
      <Button title="Reintentar" onPress={fetchWeather} />
    </View>
  );


  // Handling touch vs scroll on the 7-day forecast
  const tapHour = Gesture.Tap()
    .maxDuration(250)
    .maxDistance(10)
    .onEnd((_evt, success) => {
      if (success) {
        navigation.navigate("NextHours", {
          title: showLocationName ? `${locationName} - Próximas horas` : "Próximas horas",
          hours: next72h,
        });
      }
    });


  // Handling touch vs scroll on the 7-day forecast
  const tapDay = Gesture.Tap()
    .maxDuration(250)
    .maxDistance(10)
    .onEnd((_evt, success) => {
      if (success) {
        navigation.navigate("NextDays", {
          title: showLocationName ? `${locationName} - Pronósticos 7 días` : "Pronósticos 7 días",
          days: days,
        });
      }
    });


  const animatePressIn = (val: Animated.Value) => {
    Animated.spring(val, { toValue: 0.85, useNativeDriver: true, speed: 30, bounciness: 0 }).start();
  };
  const animatePressOut = (val: Animated.Value) => {
    Animated.spring(val, { toValue: 1, useNativeDriver: true, friction: 5 }).start();
  };

  
  // Main render
  return (
    <ScrollView style={styles.component_container}>
      <View style={styles.current_container}>
        <View style={styles.current_main_group}>
          <Text style={styles.location}>{
            showLocationName ? locationName : ""
          }</Text>
          <View style={styles.current_subgroup}>
            <Text style={styles.current_temp}>{Math.round(current.tempC)}°</Text>
            <Text style={styles.current_icon}>{current.icon}</Text>
          </View>
          <Text style={styles.current_weather_desc}>{current.weather_desc}</Text>
        </View>
        <View style={styles.current_sec_group}>
          <Text style={styles.secondary_text}>🌫️ {Math.round(current.humidity)} %</Text> 
          <Text style={styles.secondary_text}>🌧️ {Math.round(current.precipitationMm)} mm</Text>
          <Text style={styles.secondary_text}>💨 {Math.round(current.windSpeedKmh)} km/h</Text>
        </View>
      </View>
      <View style={ styles.actions_container }>
        <Animated.View style={[styles.action_button, { transform: [{ scale: favScale }] }]}>
          <Pressable
            accessibilityRole="button"
            onPress={toggleFavourite}
            onPressIn={() => animatePressIn(favScale)}
            onPressOut={() => animatePressOut(favScale)}
          >
            <Ionicons name={isFavourite ? "star" : "star-outline"} style={ styles.action_button_icon }/>
          </Pressable>
        </Animated.View>
        <Animated.View style={[styles.action_button, { transform: [{ scale: savedScale }] }]}>
          <Pressable
            accessibilityRole="button"
            onPress={toggleSaved}
            onPressIn={() => animatePressIn(savedScale)}
            onPressOut={() => animatePressOut(savedScale)}
          >
            <Ionicons name={isSaved ? "bookmark" : "bookmark-outline"} style={ styles.action_button_icon }/>
          </Pressable>
        </Animated.View>
      </View>
      <GestureHandlerRootView>
        <GestureDetector gesture={tapHour}>
          <View style={styles.days_hours_container}>
            <Text style={styles.hours_title}>Próximas horas</Text>
            <View style={styles.list_container}>
            <FlatList
              data={next24h}
              style={styles.list}
              keyExtractor={(h) => String(h.dateTime)}
              horizontal
              showsHorizontalScrollIndicator={false}
              renderItem={({ item }) => (
                <View style={styles.hour_column}>
                  <Text style={styles.hour_time}>{new Date(item.dateTime).getHours()}:00</Text>
                  <Text style={styles.hour_weather_icon}>{item.icon}</Text>
                  <Text style={styles.hour_temp}>{Math.round(item.tempC)}°</Text>
                </View>
              )}
            />
            </View>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
      <GestureHandlerRootView>
        <GestureDetector gesture={tapDay}>
          <View style={styles.days_hours_container}>
            <Text style={styles.hours_title}>Pronóstico 7 días</Text>
            <View style={styles.list_container}>
              <FlatList
                data={days}
                style={styles.list}
                horizontal
                keyExtractor={(d) => String(d.dateTime)}
                showsHorizontalScrollIndicator={false}
                renderItem={({ item }) => (
                  <View style={styles.day_column}>
                    <Text style={styles.day_time}>{new Date(item.dateTime).toLocaleDateString("es-ES", { weekday: "short" })}</Text>
                    <Text style={styles.day_weather_icon}>{item.icon}</Text>
                    <Text style={styles.day_max_temp}>{Math.round(item.maxC)}°</Text>
                    <Text style={styles.day_min_temp}>{Math.round(item.minC)}°</Text>
                  </View>
                )}
              />
            </View>
          </View>
        </GestureDetector>
      </GestureHandlerRootView>
    </ScrollView>
  );
}
