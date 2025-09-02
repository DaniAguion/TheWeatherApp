import { useEffect, useState, useCallback } from "react";
import { View, Text, ActivityIndicator, Button, ScrollView, RefreshControl } from "react-native";
import { getWeather } from "../api-weather/index";
import type { WeatherPack } from "../api-weather/types";
import { useFocusEffect } from "@react-navigation/native";

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
  const [data, setData] = useState<WeatherPack | null>(null);

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

  if (loading) return <ActivityIndicator style={{ marginTop: 40 }} />;
  if (error) return (
    <View style={{ padding: 16 }}>
      <Text style={{ marginBottom: 8 }}>{error}</Text>
      <Button title="Reintentar" onPress={load} />
    </View>
  );
  if (!data) return null;

  const title = name ?? "Mi ubicación";

  return (
    <ScrollView
      style={{ padding: 16 }}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <Text style={{ fontSize: 20, fontWeight: "600" }}>{title}</Text>
      <Text style={{ fontSize: 48, marginVertical: 4 }}>
        {Math.round(data.current.tempC)}°
      </Text>
      <Text style={{ marginBottom: 12 }}>Viento: {Math.round(data.current.windKmh)} km/h</Text>

      <Button
        title="Ver pronóstico (5–7 días)"
        onPress={() => navigation.navigate("Pronóstico", { days: data.days, title })}
      />

      <View style={{ height: 12 }} />

      <Button
        title="Añadir a Favoritos"
        onPress={() => navigation.navigate("Favoritos", { quickAdd: { name: title, lat, lon } })}
      />
    </ScrollView>
  );
}
