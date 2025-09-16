import { useEffect, useState, useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { View, Text, ActivityIndicator, Button, ScrollView, RefreshControl, FlatList } from "react-native";
import { Gesture, GestureDetector, GestureHandlerRootView } from "react-native-gesture-handler";
import { getWeather } from "../../api-weather/index";
import type { WeatherInfo, Hour } from "../../api-weather/types";
import styles from "./WeatherScreen.styles";

type Props = {
  navigation: any;
  route: { params?: { name?: string; lat: number; lon: number } };
};

// Emplear Madrid como ubicación por defecto si no se obtiene la ubicación actual
const DEFAULT_LOCATION = { name: "Madrid", lat: 40.4168, lon: -3.7038 };

export default function WeatherScreen({ navigation, route }: Props) {
  const { name, lat, lon } = route.params ?? DEFAULT_LOCATION;
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [data, setData] = useState<WeatherInfo | null>(null);

  const load = async () => {
    try {
      setError(null);
      const w = await getWeather(lat, lon);
      setData(w);
    } catch (e: any) {
      setError(e?.message ?? "Error cargando el clima");
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const listNativeGestureRef = useRef(null);
  useEffect(() => { load(); }, [lat, lon]);
  useFocusEffect(useCallback(() => {
    return () => {};
  }, []));

  const onRefresh = () => { setRefreshing(true); load(); };

  if (loading) return <ActivityIndicator style={styles.loading} />;
  if (error) return (
    <View style={styles.errorContainer}>
      <Text style={styles.errorText}>{error}</Text>
      <Button title="Reintentar" onPress={load} />
    </View>
  );
  if (!data) return null;

  const location = name ?? "Mi ubicación";

  // Filter the next 24 hours
  const now = Date.now();
  const in24h = now + 24 * 60 * 60 * 1000; // 24 hours from now in milliseconds
  const hours = data?.hours ?? [];
  const next24h = hours.filter(h => {
    const t = h.dateTime;
    return t > now && t < in24h;
  });


  const in72h = now + 72 * 60 * 60 * 1000; // 72 hours from now in milliseconds
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
        navigation.navigate("Proximas_Horas", {
          title: `${location} - Próximas horas`,
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
        navigation.navigate("Pronostico_Dias", {
          title: `${location} - Pronóstico 7 días`,
          days: data.days,
        });
      }
    });

  

  return (
    <ScrollView
      style={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View style={styles.current_container}>
        <View style={styles.current_main_group}>
          <Text style={styles.location}>{location}</Text>
          <View style={styles.current_subgroup}>
            <Text style={styles.current_temp}>{Math.round(data.current.tempC)}°</Text>
            <Text style={styles.current_icon}>{data.current.icon}</Text>
          </View>
          <Text style={styles.current_weather_desc}>{data.current.weather_desc}</Text>
        </View>
        <View style={styles.current_sec_group}>
          <Text style={styles.secondary_text}>🌫️  {Math.round(data.current.humidity)} %</Text> 
          <Text style={styles.secondary_text}>🌧️ {Math.round(data.current.precipitationMm)} mm</Text>
          <Text style={styles.secondary_text}>💨 {Math.round(data.current.windSpeedKmh)} km/h</Text>
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
                data={data.days}
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
