import { useCallback, useEffect, useRef, useState } from "react";
import type { Location } from "../../domain/entities/LocationEntities";
import { DomainError } from "../../domain/errors/DomainError";
import type { WeatherService } from "../../domain/ports/WeatherService";

export type UseExploreVMDeps = {
  weatherService: WeatherService;
};

type VMState = {
  query: string;
  loading: boolean;
  error: DomainError | null;
  results: Location[];
};

type VMFunctions = {
  setQuery: (value: string) => void;
  handleSearch: () => Promise<void>;
  clearResults: () => void;
  resetSearch: () => void;
};


export function useExploreVM({ weatherService }: UseExploreVMDeps): VMState & VMFunctions {
  const [query, setQueryState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<DomainError | null>(null);
  const [results, setResults] = useState<Location[]>([]);
  const mounted = useRef(true);


  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);


  // Function to update the search query
  const setQuery = useCallback((value: string) => {
    setQueryState(value);
  }, []);


  // Function to clear results and error
  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);


  // Function to reset the entire search screen data
  // Used in the Explore Screen to reset the screen the user changes the tab
  const resetSearch = useCallback(() => {
    setQueryState("");
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);



  // Function to perform the search
  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      clearResults();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const searchLocationsResult = await weatherService.searchLocations(trimmed);
      if (!mounted.current) return;

      if (searchLocationsResult.success) {
        setResults(searchLocationsResult.value);
        setError(null);
      } else {
        setResults([]);
        setError(searchLocationsResult.error);
      }
    } catch (err) {
      if (!mounted.current) return;

      setResults([]);
      //setError(message);
    } finally {
      if (!mounted.current) return;
      setLoading(false);
    }
  }, [query, weatherService, clearResults]);



  return {
    query,
    loading,
    error,
    results,
    setQuery,
    handleSearch,
    clearResults,
    resetSearch
  };
}
