import { useCallback, useEffect, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import type { Location } from "../domain/entities";

type StoredLocation = Required<Pick<Location, "lat" | "lon">> & Pick<Location, "name">;

const SELECTED_LOCATION_KEY = "selectedLocation";
const CURRENT_SENTINEL = "__CURRENT_LOCATION__";
const STORAGE_VERSION = 1;

type StoredPreferences = {
  version: number;
  savedLocation: StoredLocation;
  useCurrent: boolean;
};

const DEFAULT_PREFS: StoredPreferences = {
  version: STORAGE_VERSION,
  savedLocation: { name: "Madrid", lat: 40.4168, lon: -3.7038 },
  useCurrent: false,
};

const isFiniteNumber = (value: unknown): value is number =>
  typeof value === "number" && Number.isFinite(value);

const sanitizeLocation = (candidate: unknown): StoredLocation | null => {
  if (!candidate || typeof candidate !== "object") {
    return null;
  }
  const maybe = candidate as Partial<StoredLocation> & { lat?: unknown; lon?: unknown };
  const lat = isFiniteNumber(maybe.lat) ? maybe.lat : Number(maybe.lat);
  const lon = isFiniteNumber(maybe.lon) ? maybe.lon : Number(maybe.lon);
  if (!isFiniteNumber(lat) || !isFiniteNumber(lon)) {
    return null;
  }
  const name = typeof maybe.name === "string" && maybe.name.trim().length > 0
    ? maybe.name
    : DEFAULT_PREFS.savedLocation.name;
  return { lat, lon, name };
};

const toPrefsPayload = (savedLocation: StoredLocation, useCurrent: boolean): StoredPreferences => ({
  version: STORAGE_VERSION,
  savedLocation,
  useCurrent,
});

const isStoredPreferences = (input: unknown): input is StoredPreferences => {
  if (!input || typeof input !== "object") {
    return false;
  }
  const asPrefs = input as Partial<StoredPreferences> & { savedLocation?: unknown };
  return "savedLocation" in asPrefs && "useCurrent" in asPrefs;
};

export const DEFAULT_SELECTED_LOCATION: StoredLocation = DEFAULT_PREFS.savedLocation;

export function useSelectedLocation() {
  const [savedLocation, setSavedLocation] = useState<StoredLocation>(DEFAULT_SELECTED_LOCATION);
  const [useCurrentLocation, setUseCurrentLocation] = useState(true);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const persist = useCallback(async (prefs: StoredPreferences) => {
    await AsyncStorage.setItem(SELECTED_LOCATION_KEY, JSON.stringify(prefs));
  }, []);

  const load = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);

      const raw = await AsyncStorage.getItem(SELECTED_LOCATION_KEY);
      let prefs = DEFAULT_PREFS;
      let needsPersist = false;

      if (!raw) {
        needsPersist = true;
      } else if (raw === CURRENT_SENTINEL) {
        prefs = toPrefsPayload(DEFAULT_PREFS.savedLocation, true);
        needsPersist = true;
      } else {
        try {
          const parsed = JSON.parse(raw);
          if (isStoredPreferences(parsed)) {
            const normalized = sanitizeLocation(parsed.savedLocation);
            if (normalized) {
              prefs = toPrefsPayload(normalized, Boolean(parsed.useCurrent));
              const original = parsed.savedLocation as Partial<StoredLocation> | null | undefined;
              const originalMatches =
                !!original &&
                typeof original === "object" &&
                (original as StoredLocation).lat === normalized.lat &&
                (original as StoredLocation).lon === normalized.lon &&
                (original as StoredLocation).name === normalized.name;
              needsPersist = parsed.version !== STORAGE_VERSION || !originalMatches;
            } else {
              needsPersist = true;
            }
          } else {
            const normalized = sanitizeLocation(parsed);
            if (normalized) {
              prefs = toPrefsPayload(normalized, false);
            }
            needsPersist = true;
          }
        } catch (_parseErr) {
          needsPersist = true;
        }
      }

      setSavedLocation(prefs.savedLocation);
      setUseCurrentLocation(prefs.useCurrent);

      if (needsPersist) {
        await persist(prefs);
      }
    } catch (e: any) {
      setError(e?.message ?? "Error cargando la ubicación guardada");
      const fallback = DEFAULT_PREFS;
      setSavedLocation(fallback.savedLocation);
      setUseCurrentLocation(fallback.useCurrent);
      await persist(fallback);
    } finally {
      setLoading(false);
    }
  }, [persist]);

  useEffect(() => {
    load();
  }, [load]);

  const saveSelectedLocation = useCallback(async (location: StoredLocation) => {
    try {
      setError(null);
      const normalized = sanitizeLocation(location) ?? DEFAULT_PREFS.savedLocation;
      const prefs = toPrefsPayload(normalized, false);
      setSavedLocation(normalized);
      setUseCurrentLocation(false);
      await persist(prefs);
    } catch (e: any) {
      setError(e?.message ?? "Error guardando la ubicación");
      throw e;
    }
  }, [persist]);

  const clearSelectedLocation = useCallback(async () => {
    try {
      setError(null);
      setUseCurrentLocation(true);
      const prefs = toPrefsPayload(savedLocation, true);
      await persist(prefs);
    } catch (e: any) {
      setError(e?.message ?? "Error guardando la ubicación");
      throw e;
    }
  }, [persist, savedLocation]);

  return {
    selectedLocation: useCurrentLocation ? null : savedLocation,
    savedLocation,
    usingCurrentLocation: useCurrentLocation,
    loading,
    error,
    saveSelectedLocation,
    clearSelectedLocation,
    reloadSelectedLocation: load,
  };
}
