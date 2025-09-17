import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { PlaceParams } from "../AppNavigator";

type StoredLocation = Required<Pick<PlaceParams, "lat" | "lon">> & Pick<PlaceParams, "name">;

const SELECTED_LOCATION_KEY = "selectedLocation";
const CURRENT_SENTINEL = "__CURRENT_LOCATION__";
export const DEFAULT_SELECTED_LOCATION: StoredLocation = { name: "Madrid", lat: 40.4168, lon: -3.7038 };

export function useSelectedLocation() {
  const [selectedLocation, setSelectedLocation] = useState<StoredLocation | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const raw = await AsyncStorage.getItem(SELECTED_LOCATION_KEY);
      if (!raw) {
        await AsyncStorage.setItem(SELECTED_LOCATION_KEY, JSON.stringify(DEFAULT_SELECTED_LOCATION));
        setSelectedLocation(DEFAULT_SELECTED_LOCATION);
        return;
      }

      if (raw === CURRENT_SENTINEL) {
        setSelectedLocation(null);
        return;
      }

      const parsed = JSON.parse(raw) as StoredLocation | null;
      if (parsed && typeof parsed.lat === "number" && typeof parsed.lon === "number") {
        setSelectedLocation(parsed);
      } else {
        await AsyncStorage.setItem(SELECTED_LOCATION_KEY, JSON.stringify(DEFAULT_SELECTED_LOCATION));
        setSelectedLocation(DEFAULT_SELECTED_LOCATION);
      }
    } catch (e: any) {
      setError(e?.message ?? "Error cargando la ubicación guardada");
      await AsyncStorage.setItem(SELECTED_LOCATION_KEY, JSON.stringify(DEFAULT_SELECTED_LOCATION));
      setSelectedLocation(DEFAULT_SELECTED_LOCATION);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const saveSelectedLocation = useCallback(async (location: StoredLocation | null) => {
    try {
      setError(null);
      if (location) {
        await AsyncStorage.setItem(SELECTED_LOCATION_KEY, JSON.stringify(location));
        setSelectedLocation(location);
      } else {
        await AsyncStorage.setItem(SELECTED_LOCATION_KEY, CURRENT_SENTINEL);
        setSelectedLocation(null);
      }
    } catch (e: any) {
      setError(e?.message ?? "Error guardando la ubicación");
      throw e;
    }
  }, []);

  const clearSelectedLocation = useCallback(async () => {
    await saveSelectedLocation(null);
  }, [saveSelectedLocation]);

  return {
    selectedLocation,
    loading,
    error,
    saveSelectedLocation,
    clearSelectedLocation,
    reloadSelectedLocation: load,
  };
}
