import { useCallback } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";

import type { TabParamList, RootStackParamsList } from "../../AppNavigator";
import { useServices } from "../../di/ServicesProvider";
import type { Location } from "../../domain/entities/LocationEntities";
import { useExploreVM, UseExploreVMDeps } from "./useExploreVM";
import styles from "./ExploreScreen.styles";

export type ExploreScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "ExploreMain">,
  NativeStackScreenProps<RootStackParamsList>
>;

export default function FavoriteScreen({ navigation }: ExploreScreenProps) {
  const deps: UseExploreVMDeps = useServices();
  const {
    query,
    loading,
    error,
    results,
    setQuery,
    handleSearch,
  } = useExploreVM(deps);

  const handleSelect = useCallback((suggestion: Location) => {
    navigation.navigate("Weather", {
      name: suggestion.name,
      coordinates: suggestion.coordinates,
    });
  }, [navigation]);

  const renderSuggestion = useCallback(({ item } : { item: Location }) => (
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
    <View style={styles.screen_container}>
      <View style={styles.header_container}>
        <Text style={styles.header_title}>Explorar otras ubicaciones</Text>
        <Text style={styles.header_desc}>
          Consulta el clima en otras partes del mundo.
        </Text>
      </View>
      <View style={styles.finder_contaner}>
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
        <Pressable onPress={handleSearch} style={styles.findButton}>
          <Text style={styles.findButtonText}>Buscar</Text>
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
