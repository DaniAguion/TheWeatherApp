import { useEffect, useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ActivityIndicator, Button, ScrollView, FlatList } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { getWeather } from "../../data/weatherService/index";
import { getLocationName } from "../../data/locationService/fetchLocationName";
import type { WeatherInfo, Hour } from "../../domain/entities";
import { Location } from "../../domain/entities";
import styles from "./WeatherScreen.styles";


export type WeatherScreenParams = Location;
type WeatherScreenProps = {navigation: any; route: { params: WeatherScreenParams }};

export default function WeatherScreen({ navigation, route }: WeatherScreenProps) {
  const { lat, lon } = route.params;
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [weatherData, setWeatherData] = useState<WeatherInfo | null>(null);
  const [locationName, setLocationName] = useState<String | null>(null);


  // Fetch weather data when lat/lon changes
  useEffect(() => { 
    fetchData();
  }, [lat, lon]);


  // Function to fetch weather data
  const fetchData = async () => {
    try {
      setError(null);
      const locationName = await getLocationName(lat, lon);
      setLocationName(locationName ?? route.params.name ?? "Desconocido");
      const weatherData = await getWeather(lat, lon);
      setWeatherData(weatherData);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando el clima");
    } finally {
      setLoading(false);
    }
  };


  // Clear view when navigating away
  useFocusEffect(useCallback(() => {
    return () => {};
  }, []));
  

  // Render loading, error
  if (loading) return <ActivityIndicator style={styles.loading} />;
  if (error) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <Button title="Reintentar" onPress={fetchData} />
    </View>
  );
  if (!weatherData) return null;


  // Filter the next 24 hours to show in the "Next Hours" preview
  const now = weatherData?.current.dateTime;
  const in24h = now + 24 * 60 * 60 * 1000;
  const hours = weatherData?.hours ?? [];
  const next24h = hours.filter(h => {
    const t = h.dateTime;
    return t > now && t < in24h;
  });


  // Filter the next 72 hours to show in the "Next Hours" screen
  const in72h = now + 72 * 60 * 60 * 1000;
  const next72h: Hour[] = hours.filter(h => {
    const t = h.dateTime;
    return t > now && t < in72h;
  });


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
          days: weatherData.days,
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
            <Text style={styles.current_temp}>{Math.round(weatherData.current.tempC)}°</Text>
            <Text style={styles.current_icon}>{weatherData.current.icon}</Text>
          </View>
          <Text style={styles.current_weather_desc}>{weatherData.current.weather_desc}</Text>
        </View>
        <View style={styles.current_sec_group}>
          <Text style={styles.secondary_text}>🌫️  {Math.round(weatherData.current.humidity)} %</Text> 
          <Text style={styles.secondary_text}>🌧️ {Math.round(weatherData.current.precipitationMm)} mm</Text>
          <Text style={styles.secondary_text}>💨 {Math.round(weatherData.current.windSpeedKmh)} km/h</Text>
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
                data={weatherData.days}
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
