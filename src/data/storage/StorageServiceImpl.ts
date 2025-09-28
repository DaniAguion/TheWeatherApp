import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserPreferences } from "../../domain/entities/UserPreferences";
import type { StorageService as StorageService } from "../../domain/ports/StorageService";
import type { Location } from "../../domain/entities/LocationEntities";
import type { Result } from "../../domain/errors/Result";
import { DataError } from "../../domain/errors/DataError";


const KEYS = {
  preferences: "userPreferences",
  favouriteLocation: "favouriteLocation",
  savedLocations: "savedLocations",
};

const DEFAULT_VALUES = {
  preferences: { useCurrentLocation: false } as UserPreferences,
  favouriteLocation: { name: "Madrid", coordinates: { lat: 40.4168, lon: -3.7038 } } as Location,
  savedLocations: [] as Location[]
};

const isFiniteNum = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);

function validLocation(loc: any): boolean {
  return (
    loc &&
    typeof loc === "object" &&
    typeof loc.name === "string" &&
    isFiniteNum(loc.coordinates?.lat) &&
    isFiniteNum(loc.coordinates?.lon)
  );
}

export class StorageServiceImpl implements StorageService {

  // Load preferences
  async loadPreferences(): Promise<UserPreferences> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.preferences);
      if (raw) {
        const parsed = JSON.parse(raw) as UserPreferences;
        return { useCurrentLocation: parsed.useCurrentLocation };
      }
      await AsyncStorage.setItem(KEYS.preferences, JSON.stringify(DEFAULT_VALUES.preferences));
      console.warn("[UserPrefs] No valid preferences found, using default.");
      return DEFAULT_VALUES.preferences;
    } catch (e) {
      console.error("[UserPrefs] Error loading preferences:", e);
    }
    return DEFAULT_VALUES.preferences;
  }


  // Save preferences
  async storePreferences(prefs: UserPreferences) : Promise<Result<void>> {
    try {
      await AsyncStorage.setItem(KEYS.preferences, JSON.stringify(prefs));
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error saving preferences:", e);
      return { success: false, error: DataError.unknown(e) };
    }
  }



  // Load favourite location
  async loadFavouriteLocation(): Promise<Location> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.favouriteLocation);
      if (raw) {
        const parsedLocation = JSON.parse(raw) as Location;
        if (parsedLocation && validLocation(parsedLocation)) {
          return parsedLocation;
        } 
      }
      await AsyncStorage.setItem(KEYS.favouriteLocation, JSON.stringify(DEFAULT_VALUES.favouriteLocation));
      console.warn("[UserPrefs] No valid favourite location found, using default.");
      return DEFAULT_VALUES.favouriteLocation;
    } catch (e) {
      console.error("[UserPrefs] Error loading favourite location:", e);
    }
    return DEFAULT_VALUES.favouriteLocation;
  }


  // Save a location as favourite
  async storeFavouriteLocation(location: Location): Promise<Result<void>> {
    if (!validLocation(location)) {
      console.error("[UserPrefs] Invalid location format:", location);
      return {
        success: false,
        error: DataError.invalidData(new Error("Invalid location")),
      };
    }

    try {
      await AsyncStorage.setItem(KEYS.favouriteLocation, JSON.stringify(location));
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error saving favourite location:", e);
      return { success: false, error: DataError.unknown(e) };
    }
  }


  // Remove location from favourite
  async removeFavouriteLocation(location: Location): Promise<Result<void>> {
    try {
      await AsyncStorage.removeItem(KEYS.favouriteLocation);
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error removing favourite location:", e);
      return { success: false, error: DataError.unknown(e) };
    }
  }



  // Load saved locations
  async loadSavedLocations(): Promise<Location[]> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.savedLocations);
      if (raw) {
        const parsedLocations = JSON.parse(raw) as Location[];
        if (parsedLocations && Array.isArray(parsedLocations)) {
          return parsedLocations.filter(validLocation);
        } 
      }
      await AsyncStorage.setItem(KEYS.savedLocations, JSON.stringify(DEFAULT_VALUES.savedLocations));
      console.warn("[UserPrefs] No valid saved locations found, using default.");
      return DEFAULT_VALUES.savedLocations;
    } catch (e) {
      console.error("[UserPrefs] Error loading saved locations:", e);
    }
    return DEFAULT_VALUES.savedLocations;
  }


  // Save a location to saved locations list
  async storeSavedLocation(location: Location): Promise<Result<void>> {
    if (!validLocation(location)) {
      console.error("[UserPrefs] Invalid location format:", location);
      return {
        success: false,
        error: DataError.invalidData(new Error("Invalid location")),
      };
    }
    
    try {
      const savedLocations = await this.loadSavedLocations();
      const newSavedLocations = [...savedLocations, location];
      await AsyncStorage.setItem(KEYS.savedLocations, JSON.stringify(newSavedLocations));
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error saving location:", e);
      return { success: false, error: DataError.unknown(e) };
    }
  }



  // Remove location from locations list
  async removeSaveLocation(location: Location): Promise<Result<void>> {
    if (!validLocation(location)) {
      console.error("[UserPrefs] Invalid location format:", location);
      return {
        success: false,
        error: DataError.invalidData(new Error("Invalid location")),
      };
    }
    
    try {
      const savedLocations = await this.loadSavedLocations();
      const newSavedLocations = savedLocations.filter(l =>!((l.coordinates.lat === location.coordinates.lat &&
            l.coordinates.lon === location.coordinates.lon)) || l.name !== location.name);
      await AsyncStorage.setItem(KEYS.savedLocations, JSON.stringify(newSavedLocations));
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error saving location:", e);
      return { success: false, error: DataError.unknown(e) };
    }
  }
}