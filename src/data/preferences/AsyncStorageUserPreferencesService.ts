import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserPreferencesService } from "../../domain/ports/UserPreferencesService";
import type { UserPreferences } from "../../domain/entities/UserPreferences";
import type { Location } from "../../domain/entities/LocationEntities";

const STORAGE_KEY = "selectedLocation";
const STORAGE_VERSION = 1;
const CURRENT_SENTINEL = "__CURRENT_LOCATION__";

type StoredPreferences = {
  version: number;
  savedLocation: Location;
  useCurrent: boolean;
};

export const DEFAULT_SELECTED_LOCATION: Location = {
  name: "Madrid",
  coordinates: { lat: 40.4168, lon: -3.7038 },
};

export const DEFAULT_USER_PREFERENCES: UserPreferences = {
  useCurrentLocation: false,
  selectedLocation: DEFAULT_SELECTED_LOCATION,
};

const DEFAULT_LOCATION_NAME = DEFAULT_SELECTED_LOCATION.name ?? "";

function cloneLocation(location: Location): Location {
  return {
    name: location.name,
    coordinates: {
      lat: location.coordinates.lat,
      lon: location.coordinates.lon,
    },
  };
}

function defaultLocation(): Location {
  return cloneLocation(DEFAULT_USER_PREFERENCES.selectedLocation);
}

function defaultPreferences(): UserPreferences {
  return {
    useCurrentLocation: DEFAULT_USER_PREFERENCES.useCurrentLocation,
    selectedLocation: defaultLocation(),
  };
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === "number" && Number.isFinite(value);
}

function toFiniteNumber(value: unknown): number | null {
  if (isFiniteNumber(value)) return value;
  if (typeof value === "string" && value.trim().length > 0) {
    const parsed = Number(value);
    if (Number.isFinite(parsed)) return parsed;
  }
  return null;
}

function sanitizeLocation(candidate: unknown): Location | null {
  if (!candidate || typeof candidate !== "object") return null;
  const maybe = candidate as Record<string, any>;
  const latCandidate = maybe.coordinates?.lat ?? maybe.coordinates?.latitude ?? maybe.lat ?? maybe.latitude;
  const lonCandidate = maybe.coordinates?.lon ?? maybe.coordinates?.lng ?? maybe.coordinates?.longitude ?? maybe.lon ?? maybe.longitude;

  const lat = toFiniteNumber(latCandidate);
  const lon = toFiniteNumber(lonCandidate);
  if (lat === null || lon === null) return null;

  const rawName = maybe.name ?? maybe.label ?? maybe.title;
  const name = typeof rawName === "string" && rawName.trim().length > 0
    ? rawName.trim()
    : DEFAULT_LOCATION_NAME;

  return {
    name,
    coordinates: { lat, lon },
  };
}

function isStoredPreferences(value: unknown): value is StoredPreferences {
  if (!value || typeof value !== "object") return false;
  const maybe = value as Partial<StoredPreferences>;
  return (
    !!maybe &&
    Object.prototype.hasOwnProperty.call(maybe, "savedLocation") &&
    Object.prototype.hasOwnProperty.call(maybe, "useCurrent")
  );
}

function locationsMatch(a: Location, b: Location): boolean {
  return (
    (a.name ?? "") === (b.name ?? "") &&
    a.coordinates.lat === b.coordinates.lat &&
    a.coordinates.lon === b.coordinates.lon
  );
}

function createPreferences(location: Location, useCurrent: boolean): UserPreferences {
  return {
    useCurrentLocation: Boolean(useCurrent),
    selectedLocation: cloneLocation(location),
  };
}

export class AsyncStorageUserPreferencesService implements UserPreferencesService {

  async load(): Promise<UserPreferences> {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) {
        const fallback = defaultPreferences();
        await this.persist(fallback);
        return fallback;
      }

      if (raw === CURRENT_SENTINEL) {
        const fallback = createPreferences(defaultLocation(), true);
        await this.persist(fallback);
        return fallback;
      }

      try {
        const parsed = JSON.parse(raw);
        if (isStoredPreferences(parsed)) {
          const normalized = sanitizeLocation(parsed.savedLocation);
          if (normalized) {
            const prefs = createPreferences(normalized, Boolean(parsed.useCurrent));
            if (parsed.version !== STORAGE_VERSION || !locationsMatch(parsed.savedLocation, normalized)) {
              await this.persist(prefs);
            }
            return prefs;
          }
        }

        const normalized = sanitizeLocation(parsed);
        if (normalized) {
          const prefs = createPreferences(normalized, false);
          await this.persist(prefs);
          return prefs;
        }
      } catch (parseError) {
        console.warn("AsyncStorageUserPreferencesService.load parse error:", parseError);
      }
    } catch (error) {
      console.warn("AsyncStorageUserPreferencesService.load failed:", error);
    }

    const fallback = defaultPreferences();
    try {
      await this.persist(fallback);
    } catch (persistError) {
      console.warn("AsyncStorageUserPreferencesService.persist fallback failed:", persistError);
    }
    return fallback;
  }

  async save(prefs: UserPreferences): Promise<void> {
    await this.persist(prefs);
  }

  async clearPreferences(): Promise<void> {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }

  private async persist(prefs: UserPreferences): Promise<void> {
    const location = sanitizeLocation(prefs.selectedLocation) ?? defaultLocation();
    const payload: StoredPreferences = {
      version: STORAGE_VERSION,
      savedLocation: cloneLocation(location),
      useCurrent: Boolean(prefs.useCurrentLocation),
    };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }
}
