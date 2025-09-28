import { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamsList, TabParamList } from "../../AppNavigator";
import type { Location } from "../../domain/entities/LocationEntities";
import { useServices } from "../../di/ServicesProvider";
import { useSavedVM, UseSavedVMDeps } from "./useSavedVM";
import styles from "./SavedScreen.styles";

type SavedScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "SavedMain">,
  NativeStackScreenProps<RootStackParamsList>
>;

export default function SavedScreen({ navigation }: SavedScreenProps) {
  const deps: UseSavedVMDeps = useServices();
  const { loading, error, savedLocations, refreshSavedLocations } = useSavedVM(deps);
  const isFirstFocus = useRef(true);

  useEffect(() => {
    refreshSavedLocations();
  }, [refreshSavedLocations]);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      refreshSavedLocations();
    }, [refreshSavedLocations])
  );

  const handleSelect = useCallback((location: Location) => {
    navigation.navigate("Weather", {
      name: location.name ?? "Ubicación guardada",
      coordinates: location.coordinates,
    });
  }, [navigation]);

  const renderLocation = useCallback(({ item }: { item: Location }) => {
    const metaParts = [item.administration, item.country].filter(Boolean);
    const metaLabel = metaParts.join(", ");
    const coordsLabel = `Lat: ${item.coordinates.lat.toFixed(2)}°, Lon: ${item.coordinates.lon.toFixed(2)}°`;

    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => handleSelect(item)}
        style={styles.location_card}
      >
        <Text style={styles.location_title}>{item.name ?? "Ubicación guardada"}</Text>
        {metaLabel ? (
          <Text style={styles.location_meta}>{metaLabel}</Text>
        ) : null}
        <Text style={styles.location_coords}>{coordsLabel}</Text>
      </Pressable>
    );
  }, [handleSelect]);

  return (
    <View style={styles.screen_container}>
      <View style={styles.header_container}>
        <Text style={styles.header_title}>Ubicaciones guardadas</Text>
        <Text style={styles.header_desc}>
          Accede rápidamente al clima de los lugares que guardaste.
        </Text>
      </View>

      {loading ? (
        <View style={styles.loading_container}>
          <ActivityIndicator size="large" />
        </View>
      ) : error ? (
        <View style={styles.empty_state_container}>
          <Text style={styles.error_text}>{error}</Text>
        </View>
      ) : savedLocations.length === 0 ? (
        <View style={styles.empty_state_container}>
          <Text style={styles.empty_state_text}>Todavía no tienes ubicaciones guardadas.</Text>
          <Text style={styles.empty_state_subtext}>
            Busca una ubicación y toca el icono de marcador para guardarla.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedLocations}
          keyExtractor={(item) => `${item.coordinates.lat},${item.coordinates.lon}`}
          renderItem={renderLocation}
          contentContainerStyle={styles.list_content}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
