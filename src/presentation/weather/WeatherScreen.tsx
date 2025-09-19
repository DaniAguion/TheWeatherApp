import { useCallback } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ActivityIndicator, Button, ScrollView, FlatList } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import type { Location } from "../../domain/entities";
import { useWeatherVM } from "./useWeatherVM";
import styles from "./WeatherScreen.styles";


export type WeatherScreenParams = Location;
type WeatherScreenProps = {
  navigation: any;
  route: { params: WeatherScreenParams };
};

export default function WeatherScreen({ navigation, route }: WeatherScreenProps) {
  const { lat, lon, name } = route.params;
  const { loading, error, locationName, current, next24h, next72h, days, refetch } = useWeatherVM(lat, lon, name);

  // Clear view when navigating away
  useFocusEffect(useCallback(() => { return () => {} }, []));

  // Render loading, error
  if (loading) return <ActivityIndicator style={styles.loading} />;
  if (error || !current) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <Button title="Reintentar" onPress={refetch} />
    </View>
  );


  // Handling touch vs scroll on the 7-day forecast
  const tapHour = Gesture.Tap()
    .maxDuration(250)
    .maxDistance(10)
    .onEnd((_evt, success) => {
      if (success) {
        navigation.navigate("NextHours", {
          title: locationName && locationName.trim().length > 0 ? `${locationName} - Próximas horas` : "Próximas horas",
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
          title: locationName && locationName.trim().length > 0 ? `${locationName} - Pronósticos 7 días` : "Pronósticos 7 días",
          days: days,
        });
      }
    });

  
  // Main render
  return (
    <ScrollView
      style={styles.container}
    >
      <View style={styles.current_container}>
        <View style={styles.current_main_group}>
          <Text style={styles.location}>{locationName}</Text>
          <View style={styles.current_subgroup}>
            <Text style={styles.current_temp}>{Math.round(current.tempC)}°</Text>
            <Text style={styles.current_icon}>{current.icon}</Text>
          </View>
          <Text style={styles.current_weather_desc}>{current.weather_desc}</Text>
        </View>
        <View style={styles.current_sec_group}>
          <Text style={styles.secondary_text}>🌫️  {Math.round(current.humidity)} %</Text> 
          <Text style={styles.secondary_text}>🌧️ {Math.round(current.precipitationMm)} mm</Text>
          <Text style={styles.secondary_text}>💨 {Math.round(current.windSpeedKmh)} km/h</Text>
        </View>
      </View>
      <GestureHandlerRootView>
        <GestureDetector gesture={tapHour}>
          <View style={styles.hours_container}>
            <Text style={styles.hours_title}>Próximas horas</Text>
            <FlatList
              data={next24h}
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
        </GestureDetector>
      </GestureHandlerRootView>
      <GestureHandlerRootView>
        <GestureDetector gesture={tapDay}>
          <View style={styles.hours_container}>
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
