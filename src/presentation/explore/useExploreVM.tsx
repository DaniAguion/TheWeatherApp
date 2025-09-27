import { useCallback, useEffect, useRef, useState } from "react";
import type { Location } from "../../domain/entities/LocationEntities";
import { DataError } from "../../domain/errors/DataError";
import type { WeatherService } from "../../domain/ports/WeatherService";

export type UseExploreVMDeps = {
  weatherService: WeatherService;
};

type VMState = {
  query: string;
  loading: boolean;
  error: string | null;
  results: Location[];
};

type VMFunctions = {
  setQuery: (value: string) => void;
  handleSearch: () => Promise<void>;
  clearResults: () => void;
  resetSearch: () => void;
};

function getErrorMessage(error: Error): string {
  if (error instanceof DataError) {
    switch (error.kind) {
      case "data.network":
        return "Error de red al buscar ubicaciones";
      case "data.http":
        return `Error ${error.status ?? ""} buscando ubicaciones`;
      case "data.invalidData":
        return "Respuesta inesperada del servicio de ubicaciones";
      default:
        return "No se pudo buscar ubicaciones";
    }
  }
  return error.message || "No se pudo buscar ubicaciones";
}

export function useExploreVM({ weatherService }: UseExploreVMDeps): VMState & VMFunctions {
  const [query, setQueryState] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<Location[]>([]);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  const setQuery = useCallback((value: string) => {
    setQueryState(value);
  }, []);

  const clearResults = useCallback(() => {
    setResults([]);
    setError(null);
  }, []);

  const resetSearch = useCallback(() => {
    setQueryState("");
    setResults([]);
    setError(null);
    setLoading(false);
  }, []);

  const handleSearch = useCallback(async () => {
    const trimmed = query.trim();
    if (!trimmed) {
      clearResults();
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const outcome = await weatherService.searchLocations(trimmed);
      if (!mounted.current) return;

      if (outcome.success) {
        setResults(outcome.value);
        setError(null);
      } else {
        setResults([]);
        setError(getErrorMessage(outcome.error));
      }
    } catch (err) {
      if (!mounted.current) return;

      setResults([]);
      const message = err instanceof Error ? getErrorMessage(err) : "No se pudo buscar ubicaciones";
      setError(message);
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
