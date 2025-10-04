import { useCallback, useEffect, useRef, useState } from "react";
import { StorageService } from "../../domain/ports/StorageService";
import { WeatherService } from "../../domain/ports/WeatherService";
import { DomainError } from "../../domain/errors/DomainError";
import type { Location } from "../../domain/entities/LocationEntities";
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
  error: DomainError | null;
  savedLocationsWeather: PreviewWeatherLocation[];
};

type VMFunctions = {
  refreshData: () => Promise<void>;
};

export function useSavedVM({ storageService, weatherService }: UseSavedVMDeps): VMState & VMFunctions {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<DomainError | null>(null);
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
      let savedLocations: Location[] = [];
      const loadSavedResult = await storageService.loadSavedLocations();
      if (loadSavedResult.success) {
        savedLocations = loadSavedResult.value; 
      } else {
        setError(loadSavedResult.error);
        setLoading(false);
        return;
      }

      if (!mounted.current) return;

      const savedLocationWeather: PreviewWeatherLocation[] = [];
      for (const location of savedLocations) {
        const currentWeatherResult = await weatherService.getCurrentWeather_old(location.coordinates);
        if (currentWeatherResult.success) {
          savedLocationWeather.push({
            location,
            currentWeather: currentWeatherResult.value,
          });
        } else {
          console.warn(`Failed to fetch weather for saved location ${location.name}:`, currentWeatherResult.error);
        }
      }
      setSavedLocationsWeather(savedLocationWeather);
      setError(null);
    } catch (err) {
      if (!mounted.current) return;
      console.error("[SavedScreen] Failed to load saved locations", err);
      setError(DomainError.unknown());
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
