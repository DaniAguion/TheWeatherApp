import { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, Button, ScrollView, RefreshControl, FlatList } from "react-native";
import { getWeather } from "../../api-weather/index";
import type { WeatherInfo } from "../../api-weather/types";
import { useFocusEffect } from "@react-navigation/native";
import styles from "./MainScreen.styles";

type Props = {
  navigation: any;
  route: { params?: { name?: string; lat: number; lon: number } };
};

// Emplear Madrid como ubicación por defecto si no se obtiene la ubicación actual
const DEFAULT_LOCATION = { name: "Madrid", lat: 40.4168, lon: -3.7038 };

export default function MainScreen({ navigation, route }: Props) {
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
      <View style={styles.next_container}>
        <Text style={styles.next_title}>Próximas horas</Text>
          <FlatList
            data={next24h}
            keyExtractor={(h) => String(h.dateTime)}
            horizontal
            showsHorizontalScrollIndicator={false}
            renderItem={({ item }) => (
              <View style={styles.hour_column}>
                <Text style={styles.hourly_time}>{new Date(item.dateTime).getHours()}:00</Text>
                <Text style={styles.hourly_icon}>{item.icon}</Text>
                <Text style={styles.hourly_temp}>{Math.round(item.tempC)}°</Text>
              </View>
            )}
          />
      </View>
      <View style={styles.next_container}>
        <Text style={styles.next_title}>Próximos 7 días</Text>
        <FlatList
          data={data.days}
          keyExtractor={(d) => String(d.dateTime)}
          horizontal
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <View style={styles.daily_column}>
              <Text style={styles.daily_time}>{new Date(item.dateTime).toLocaleDateString("es-ES", { weekday: "short" })}</Text>
              <Text style={styles.daily_icon}>{item.icon}</Text>
              <Text style={styles.daily_max_temp}>{Math.round(item.maxC)}°</Text>
              <Text style={styles.daily_min_temp}>{Math.round(item.minC)}°</Text>
            </View>
          )}
        />
      </View>
    </ScrollView>
  );
}
