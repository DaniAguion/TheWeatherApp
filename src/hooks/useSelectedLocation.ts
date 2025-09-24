import { useCallback, useEffect, useState } from "react";
import type { Location } from "../domain/entities/LocationEntities";
import type { UserPreferences } from "../domain/entities/UserPreferences";
import { DEFAULT_USER_PREFERENCES, DEFAULT_SELECTED_LOCATION } from "../data/preferences/UserPrefsServiceImpl";
import { useServices } from "../di/ServicesProvider";

export { DEFAULT_SELECTED_LOCATION } from "../data/preferences/UserPrefsServiceImpl";

function cloneLocation(location: Location): Location {
  return {
    name: location.name,
    coordinates: {
      lat: location.coordinates.lat,
      lon: location.coordinates.lon,
    },
  };
}

function clonePreferences(prefs: UserPreferences): UserPreferences {
  return {
    useCurrentLocation: prefs.useCurrentLocation,
    selectedLocation: cloneLocation(prefs.selectedLocation),
  };
}

export function useSelectedLocation() {
  const { userPreferencesService } = useServices();
  const [preferences, setPreferences] = useState<UserPreferences>(() => clonePreferences(DEFAULT_USER_PREFERENCES));
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPreferences = useCallback(async (withSpinner: boolean = true) => {
    if (withSpinner) setLoading(true);
    try {
      const stored = await userPreferencesService.load();
      setPreferences(clonePreferences(stored));
      setError(null);
    } catch (e: any) {
      const message = e?.message ?? "Error cargando la ubicación guardada";
      setError(message);
      const fallback = clonePreferences(DEFAULT_USER_PREFERENCES);
      setPreferences(fallback);
      try {
        await userPreferencesService.save(fallback);
      } catch (persistError) {
        console.warn("Failed to persist fallback user preferences:", persistError);
      }
    } finally {
      if (withSpinner) setLoading(false);
    }
  }, [userPreferencesService]);

  useEffect(() => {
    void fetchPreferences(true);
  }, [fetchPreferences]);

  const saveSelectedLocation = useCallback(async (location: Location) => {
    try {
      setError(null);
      await userPreferencesService.save({
        useCurrentLocation: false,
        selectedLocation: location,
      });
      await fetchPreferences(false);
    } catch (e: any) {
      setError(e?.message ?? "Error guardando la ubicación");
      throw e;
    }
  }, [fetchPreferences, userPreferencesService]);

  const clearSelectedLocation = useCallback(async () => {
    try {
      setError(null);
      await userPreferencesService.save({
        useCurrentLocation: true,
        selectedLocation: preferences.selectedLocation,
      });
      await fetchPreferences(false);
    } catch (e: any) {
      setError(e?.message ?? "Error guardando la ubicación");
      throw e;
    }
  }, [fetchPreferences, preferences.selectedLocation, userPreferencesService]);

  const reloadSelectedLocation = useCallback(() => fetchPreferences(true), [fetchPreferences]);

  return {
    selectedLocation: preferences.useCurrentLocation ? null : preferences.selectedLocation,
    savedLocation: preferences.selectedLocation,
    usingCurrentLocation: preferences.useCurrentLocation,
    loading,
    error,
    saveSelectedLocation,
    clearSelectedLocation,
    reloadSelectedLocation,
  };
}
