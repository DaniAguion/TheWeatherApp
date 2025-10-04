import { useCallback, useEffect, useRef, useState } from "react";
import { GetCurrentWeatherUseCase } from "../../domain/usecases/GetCurrentWeatherUseCase";
import { GetSavedLocationUseCase } from "../../domain/usecases/GetSavedLocationsUseCase";
import { DomainError } from "../../domain/errors/DomainError";
import type { Location } from "../../domain/entities/LocationEntities";
import type { Current } from "../../domain/entities/WeatherEntities";


export type PreviewWeatherLocation = {
  location: Location;
  currentWeather: Current;
};

export type UseSavedVMDeps = {
    getSavedLocationUseCase: GetSavedLocationUseCase,
    getCurrentWeatherUseCase: GetCurrentWeatherUseCase,
};

type VMState = {
  loading: boolean;
  error: DomainError | null;
  savedLocationsWeather: PreviewWeatherLocation[];
};

type VMFunctions = {
  refreshData: () => Promise<void>;
};

export function useSavedVM({ getSavedLocationUseCase, getCurrentWeatherUseCase} : UseSavedVMDeps ): VMState & VMFunctions {
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
      const loadSavedResult = await getSavedLocationUseCase.execute();
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
        await getCurrentWeatherUseCase.execute(location.coordinates).then(result => {
            if (result.success) {
              savedLocationWeather.push({
                  location,
                  currentWeather: result.value,
                });
            } else {
              // If there's an error fetching weather must still continue with other locations
              // Don't repeat the error for each location
              if (error != null) {
              console.warn(`Failed to fetch weather for saved location ${location.name}:`, result.error);
              setError(result.error);
              }
            }
        });
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
  }, []);



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
