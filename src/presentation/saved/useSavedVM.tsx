import { useCallback, useEffect, useRef, useState } from "react";
import type { Location } from "../../domain/entities/LocationEntities";
import type { StorageService } from "../../domain/ports/StorageService";
import { WeatherService } from "../../domain/ports/WeatherService";
import type { Current } from "../../domain/entities/WeatherEntities";


export type PreviewWeatherLocation = {
  location: Location;
  currentWeather: Current;
};

export type UseSavedVMDeps = {
  weatherService: WeatherService;
  storageService: StorageService;
};

type VMState = {
  loading: boolean;
  error: string | null;
  savedLocationsWeather: PreviewWeatherLocation[];
};

type VMFunctions = {
  refreshData: () => Promise<void>;
};

export function useSavedVM({ storageService, weatherService }: UseSavedVMDeps): VMState & VMFunctions {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedLocationsWeather, setSavedLocationsWeather] = useState<PreviewWeatherLocation[]>([]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const loadSavedLocations = useCallback(async () => {
    setLoading(true);
    try {
      const savedLocations = await storageService.loadSavedLocations();

      if (!mounted.current) return;

      const savedLocationsData: PreviewWeatherLocation[] = [];
      for (const location of savedLocations) {
        const result = await weatherService.getCurrentWeather(location.coordinates);
        if (result.success) {
          savedLocationsData.push({
            location,
            currentWeather: result.value,
          });
        } else {
          console.warn(`Failed to fetch weather for saved location ${location.name}:`, result.error);
        }
      }
      setSavedLocationsWeather(savedLocationsData);
      setError(null);
    } catch (err) {
      if (!mounted.current) return;
      console.error("[SavedScreen] Failed to load saved locations", err);
      setError("No se pudieron cargar las ubicaciones guardadas");
    } finally {
      if (!mounted.current) return;
      setLoading(false);
    }
  }, [storageService]);


  const refreshData = useCallback(async () => {
    await loadSavedLocations();
  }, [loadSavedLocations]);

  return {
    loading,
    error,
    savedLocationsWeather,
    refreshData,
  };
}
