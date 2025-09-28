import { useCallback, useEffect, useRef, useState } from "react";
import type { Location } from "../../domain/entities/LocationEntities";
import type { StorageService } from "../../domain/ports/StorageService";

export type UseSavedVMDeps = {
  storageService: StorageService;
};

type VMState = {
  loading: boolean;
  error: string | null;
  savedLocations: Location[];
};

type VMFunctions = {
  refreshSavedLocations: () => Promise<void>;
};

export function useSavedVM({ storageService }: UseSavedVMDeps): VMState & VMFunctions {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [savedLocations, setSavedLocations] = useState<Location[]>([]);
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
      const locations = await storageService.loadSavedLocations();
      if (!mounted.current) return;
      setSavedLocations(locations);
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

  const refreshSavedLocations = useCallback(async () => {
    await loadSavedLocations();
  }, [loadSavedLocations]);

  return {
    loading,
    error,
    savedLocations,
    refreshSavedLocations,
  };
}
