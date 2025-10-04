import Toast from "react-native-toast-message";
import { useCallback, useEffect, useRef } from "react";
import { ActivityIndicator, FlatList, Pressable, Text, View } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { toUIErrorMessage } from "../errorMessages"
import type { BottomTabScreenProps } from "@react-navigation/bottom-tabs";
import type { CompositeScreenProps } from "@react-navigation/native";
import type { NativeStackScreenProps } from "@react-navigation/native-stack";
import type { RootStackParamsList, TabParamList } from "../../AppNavigator";
import type { Location } from "../../domain/entities/LocationEntities";
import type { PreviewWeatherLocation } from "./useSavedVM";
import { useServices, useUseCases } from "../../di/ServicesProvider";
import { useSavedVM, UseSavedVMDeps_new, UseSavedVMDeps_old } from "./useSavedVM";
import styles from "./SavedScreen.styles";


type SavedScreenProps = CompositeScreenProps<
  BottomTabScreenProps<TabParamList, "SavedMain">,
  NativeStackScreenProps<RootStackParamsList>
>;


export default function SavedScreen({ navigation }: SavedScreenProps) {
  const deps_old: UseSavedVMDeps_old = useServices();
  const deps_new: UseSavedVMDeps_new  = useUseCases();
  const { loading, error, savedLocationsWeather, refreshData } = useSavedVM(deps_old, deps_new);
  const isFirstFocus = useRef(true);

  // Show error toast when error changes
  useEffect(() => {
    if (error) {
      Toast.show({
        type: "error",
        text1: "Error",
        text2: toUIErrorMessage(error),
        position: "bottom",
        visibilityTime: 2000
      });
    }
  }, [error]);

  // Initial data load
  useEffect(() => {
    refreshData();
  }, [refreshData]);

  useFocusEffect(
    useCallback(() => {
      if (isFirstFocus.current) {
        isFirstFocus.current = false;
        return;
      }
      refreshData();
    }, [refreshData])
  );

  // Navigate to Weather screen on location select
  const handleSelect = useCallback((location: Location) => {
    navigation.navigate("Weather", {
      name: location.name ?? "Ubicación guardada",
      coordinates: location.coordinates,
    });
  }, [navigation]);


  // Render each location item
  const renderLocation = useCallback(({ item }: { item: PreviewWeatherLocation }) => {
    return (
      <Pressable
        accessibilityRole="button"
        onPress={() => handleSelect(item.location)}
        style={styles.location_card}
      >
        <Text style={styles.location_title}>{item.location.name ?? "Ubicación guardada"}</Text>
        <View style={styles.weather_container}>
          <Text style={styles.location_weather_icon}>{item.currentWeather.icon}</Text>
          <Text style={styles.location_temp}>{Math.round(item.currentWeather.tempC)}°</Text>
        </View>
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
        <View style={styles.empty_list}>
          <Text style={styles.error_text}>{"No se pudieron cargar las ubicaciones guardadas"}</Text>
        </View>
      ) : savedLocationsWeather.length === 0 ? (
        <View style={styles.empty_list}>
          <Text style={styles.empty_list_text}>Todavía no tienes ubicaciones guardadas.</Text>
          <Text style={styles.empty_list_subtext}>
            Busca una ubicación y toca el icono de marcador para guardarla.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedLocationsWeather}
          keyExtractor={(item) => `${item.location.coordinates.lat},${item.location.coordinates.lon}`}
          renderItem={renderLocation}
          contentContainerStyle={styles.locations_list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </View>
  );
}
