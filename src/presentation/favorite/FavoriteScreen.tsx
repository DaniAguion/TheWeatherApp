import { useCallback, useEffect, useRef, useState } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { RootTabParamList, HomeStackParamList } from "../../AppNavigator";
import { useServices } from "../../di/ServicesProvider";
import type { Location } from "../../domain/entities/LocationEntities";
import { DataError } from "../../domain/errors/DataError";
import styles from "./FavoriteScreen.styles";

export type FavoriteScreenProps = CompositeScreenProps<
  BottomTabScreenProps<RootTabParamList, "Favorites">,
  NativeStackScreenProps<HomeStackParamList>
>;

function getErrorMessage(error: Error): string {
  if (error instanceof DataError) {
    switch (error.kind) {
      case "data.network":
        return "Error de red al buscar ubicaciones";
      case "data.http":
        return `Error ${error.status ?? ""} buscando ubicaciones`;
      case "data.invalidData":
        return "Respuesta inesperada del servicio de ubicaciones";
      default:
        return "No se pudo buscar ubicaciones";
    }
  }
  return error.message || "No se pudo buscar ubicaciones";
}

export default function FavoriteScreen({ navigation }: FavoriteScreenProps) {
  const { weatherService } = useServices();
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Location[]>([]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      setResults([]);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const outcome = await weatherService.searchLocations(trimmed);
      if (!mounted.current) return;

      if (outcome.success) {
        setResults(outcome.value);
        setError(null);
      } else {
        setResults([]);
        setError(getErrorMessage(outcome.error));
      }
    } catch (err) {
      if (!mounted.current) return;
      setResults([]);
      const message = err instanceof Error ? getErrorMessage(err) : "No se pudo buscar ubicaciones";
      setError(message);
    } finally {
      if (!mounted.current) return;
      setLoading(false);
    }
  }, [query, weatherService]);

  const handleSelect = useCallback((suggestion: Location) => {
    navigation.navigate("Home", {
      screen: "Weather",
      params: {
        name: suggestion.name,
        coordinates: suggestion.coordinates,
      },
    });
  }, [navigation]);

  const renderSuggestion = useCallback(({ item }: { item: Location }) => (
    <Pressable
      onPress={() => handleSelect(item)}
      style={styles.suggestionCard}
    >
      <Text style={styles.suggestionTitle}>{item.name}</Text>
      {(item.administration || item.country) ? (
        <Text style={styles.suggestionSubtitle}>
          {[item.administration, item.country].filter(Boolean).join(", ")}
        </Text>
      ) : null}
    </Pressable>
  ), [handleSelect]);

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Buscar ubicaciones</Text>
      <Text style={styles.description}>
        Encuentra una ciudad y consulta su pronóstico con un toque.
      </Text>

      <View style={styles.formRow}>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="Ej. Madrid"
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
          onSubmitEditing={handleSearch}
          style={styles.input}
        />
        <Pressable onPress={handleSearch} style={styles.submitButton}>
          <Text style={styles.submitButtonText}>Buscar</Text>
        </Pressable>
      </View>

      {error ? <Text style={styles.errorText}>{error}</Text> : null}
      {loading ? <ActivityIndicator style={styles.loadingIndicator} /> : null}

      <Text style={styles.resultsTitle}>Resultados</Text>
      <FlatList
        data={results}
        keyExtractor={(item) => item.coordinates.lat + "," + item.coordinates.lon}
        renderItem={renderSuggestion}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={!loading && !error ? (
          <Text style={styles.emptyText}>
            Sin resultados. Prueba con otra ciudad.
          </Text>
        ) : null}
      />
    </View>
  );
}
