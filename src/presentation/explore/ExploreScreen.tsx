import { useCallback } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, TextInput, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { TabParamList, RootStackParamsList } from "../../AppNavigator";
import type { Location } from "../../domain/entities/LocationEntities";
import { useServices } from "../../di/ServicesProvider";
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
    resetSearch
  } = useExploreVM(deps);

  // Clear the location finder field and the results when the user navigates away from this tab
  useFocusEffect(
    useCallback(() => {
      return () => {
        const parent = navigation.getParent();
        if (parent?.getState()?.index === 0) {
          resetSearch();
        }
      };
    }, [navigation, resetSearch])
  );

  // Navigate to the Weather screen when selecting a location
  const handleSelect = useCallback((suggestion: Location) => {
    navigation.navigate("Weather", {
      name: suggestion.name,
      coordinates: suggestion.coordinates,
    });
  }, [navigation]);

  // Render a location suggestion
  const renderSuggestion = useCallback(({ item } : { item: Location }) => (
    <Pressable
      onPress={() => handleSelect(item)}
      style={styles.location_card}
    >
      <Text style={styles.location_title}>{item.name}</Text>
      {(item.administration || item.country) ? (
        <Text style={styles.location_country}>
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
      <View style={styles.search_contaner}>
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
        <Pressable onPress={handleSearch} style={styles.search_button}>
          <Text style={styles.search_button_text}>Buscar</Text>
        </Pressable>
      </View>

      <View style={styles.results_container}>
        <Text style={styles.results_title}>Resultados</Text>
        <FlatList
          data={results}
          keyExtractor={(item) => `${item.coordinates.lat},${item.coordinates.lon}`}
          renderItem={renderSuggestion}
          contentContainerStyle={styles.results_list}
          ListEmptyComponent={
            loading ? (
              <ActivityIndicator style={styles.loading_indication} />
            ) : error ? (
              <Text style={styles.error_text}>{error}</Text>
            ) : <Text style={styles.no_result_text}>
              No se han encontrado resultados.
            </Text>}
        />
      </View>
    </View>
  );
}
