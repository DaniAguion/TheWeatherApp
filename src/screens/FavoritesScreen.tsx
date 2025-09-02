import { useEffect, useState } from "react";
import {View, Text, TextInput, FlatList, TouchableOpacity, StyleSheet, Alert, Button,} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

type City = { name: string; lat: number; lon: number; country?: string; admin1?: string };

const KEY = "favorites:cities";

async function getFavorites(): Promise<City[]> {
  const raw = await AsyncStorage.getItem(KEY);
  return raw ? JSON.parse(raw) : [];
}
async function setFavorites(list: City[]) {
  await AsyncStorage.setItem(KEY, JSON.stringify(list));
}

async function searchCityOpenMeteo(q: string): Promise<City[]> {
  const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(q)}&count=10&language=es&format=json`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  const results = (data?.results ?? []) as any[];
  return results.map(r => ({
    name: r.name,
    lat: r.latitude,
    lon: r.longitude,
    country: r.country,
    admin1: r.admin1,
  }));
}

type Props = { navigation: any; route: { params?: { quickAdd?: City } } };

export default function FavoritesScreen({ navigation, route }: Props) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<City[]>([]);
  const [favorites, setFavs] = useState<City[]>([]);
  const quickAdd = route.params?.quickAdd;

  const loadFavs = async () => { setFavs(await getFavorites()); };

  useEffect(() => { loadFavs(); }, []);

  useEffect(() => {
    // Si venimos de "Hoy" con quickAdd, lo agregamos si no existe
    (async () => {
      if (!quickAdd) return;
      const exists = favorites.some(f => f.name === quickAdd.name && f.lat === quickAdd.lat && f.lon === quickAdd.lon);
      if (!exists) {
        const updated = [...favorites, quickAdd];
        setFavs(updated);
        await setFavorites(updated);
      }
    })();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [quickAdd]);

  const onSearch = async () => {
    if (!query.trim()) return;
    try {
      const r = await searchCityOpenMeteo(query.trim());
      setResults(r);
    } catch (e: any) {
      Alert.alert("Búsqueda", e?.message ?? "Error buscando ciudades");
    }
  };

  const addFavorite = async (c: City) => {
    const exists = favorites.some(f => f.name === c.name && f.lat === c.lat && f.lon === c.lon);
    if (exists) return navigation.navigate("Hoy", c);
    const updated = [...favorites, c];
    setFavs(updated);
    await setFavorites(updated);
    navigation.navigate("Hoy", c);
  };

  const removeFavorite = async (c: City) => {
    const updated = favorites.filter(f => !(f.name === c.name && f.lat === c.lat && f.lon === c.lon));
    setFavs(updated);
    await setFavorites(updated);
  };

  return (
    <View style={{ flex: 1, padding: 16, gap: 12 }}>
      <Text style={styles.h1}>Favoritos</Text>

      <FlatList
        data={favorites}
        keyExtractor={(item) => `${item.name}:${item.lat.toFixed(3)},${item.lon.toFixed(3)}`}
        ListEmptyComponent={<Text style={{ color: "#666" }}>Aún no hay favoritos</Text>}
        renderItem={({ item }) => (
          <View style={styles.row}>
            <TouchableOpacity onPress={() => navigation.navigate("Hoy", item)} style={{ flex: 1 }}>
              <Text style={styles.city}>{item.name}{item.country ? `, ${item.country}` : ""}</Text>
              {item.admin1 ? <Text style={styles.sub}>{item.admin1}</Text> : null}
            </TouchableOpacity>
            <TouchableOpacity onPress={() => removeFavorite(item)}>
              <Text style={{ color: "#c00" }}>Eliminar</Text>
            </TouchableOpacity>
          </View>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />

      <View style={{ height: 1, backgroundColor: "#ddd", marginVertical: 4 }} />

      <Text style={styles.h2}>Añadir nueva ciudad</Text>
      <View style={{ flexDirection: "row", gap: 8 }}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Busca una ciudad (p. ej., Madrid)"
          style={styles.input}
          returnKeyType="search"
          onSubmitEditing={onSearch}
        />
        <Button title="Buscar" onPress={onSearch} />
      </View>

      <FlatList
        data={results}
        keyExtractor={(item, i) => `${item.name}:${i}`}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.row} onPress={() => addFavorite(item)}>
            <Text style={styles.city}>{item.name}{item.country ? `, ${item.country}` : ""}</Text>
            <Text style={styles.add}>Añadir</Text>
          </TouchableOpacity>
        )}
        ItemSeparatorComponent={() => <View style={{ height: 8 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  h1: { fontSize: 20, fontWeight: "700" },
  h2: { fontSize: 16, fontWeight: "600" },
  row: { paddingVertical: 8, paddingHorizontal: 4, flexDirection: "row", alignItems: "center", justifyContent: "space-between", backgroundColor: "#f7f7f7", borderRadius: 8 },
  city: { fontSize: 16, fontWeight: "600" },
  sub: { fontSize: 12, color: "#666" },
  add: { color: "#0a7" },
  input: { flex: 1, borderWidth: 1, borderColor: "#ccc", borderRadius: 8, paddingHorizontal: 12, height: 40 },
});
