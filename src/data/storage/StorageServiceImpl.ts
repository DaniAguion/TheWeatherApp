import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserPreferences } from "../../domain/entities/UserPreferences";
import type { StorageService as StorageService } from "../../domain/ports/StorageService";
import type { Location } from "../../domain/entities/LocationEntities";
import type { Result } from "../../domain/errors/Result";
import { DataError } from "../../domain/errors/DataError";
import { isValidLocation, normalizeLocation, sameLocation } from "../../domain/helpers/LocationHelper";


const KEYS = {
  preferences: "userPreferences",
  favouriteLocation: "favouriteLocation",
  savedLocations: "savedLocations",
};

const DEFAULT_VALUES = {
  preferences: { useCurrentLocation: false } as UserPreferences,
  favouriteLocation: { name: "Madrid", coordinates: { lat: 40.4, lon: -3.7 } } as Location,
  savedLocations: [] as Location[]
};


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
        if (parsedLocation ) return parsedLocation;
      }
      const normalizedDefault = normalizeLocation(DEFAULT_VALUES.favouriteLocation);
      await AsyncStorage.setItem(KEYS.favouriteLocation, JSON.stringify(DEFAULT_VALUES.favouriteLocation));
      return DEFAULT_VALUES.favouriteLocation;
    } catch (e) {
      console.error("[UserPrefs] Error loading favourite location:", e);
    }
    return DEFAULT_VALUES.favouriteLocation;
  }


  // Save a location as favourite
  async storeFavouriteLocation(location: Location): Promise<Result<void>> {
    if (!isValidLocation(location)) {
      console.error("[UserPrefs] Invalid location format:", location);
      return {
        success: false,
        error: DataError.invalidData(new Error("Invalid location")),
      };
    }

    try {
      const normalizedLoc = normalizeLocation(location);
      await AsyncStorage.setItem(KEYS.favouriteLocation, JSON.stringify(normalizedLoc));
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error saving favourite location:", e);
      return { success: false, error: DataError.unknown(e) };
    }
  }


  // Remove location from favourite
  async removeFavouriteLocation(location: Location): Promise<Result<void>> {
    try {
      if (sameLocation(location, DEFAULT_VALUES.favouriteLocation)) return { success: false, error: new Error("Cannot remove default location") };
      console.log("Removing favourite location:", location);
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
          return parsedLocations
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
    if (!isValidLocation(location)) {
      console.error("[UserPrefs] Invalid location format:", location);
      return {
        success: false,
        error: DataError.invalidData(new Error("Invalid location")),
      };
    }
    
    try {
      const savedLocations = await this.loadSavedLocations();
      const normalizedLoc = normalizeLocation(location);
      if (savedLocations.some(l => sameLocation(l, normalizedLoc))) {
        return { success: false, error: DataError.unknown(new Error("Location already saved")) };
      }
      const newSavedLocations = [...savedLocations, normalizedLoc];
      await AsyncStorage.setItem(KEYS.savedLocations, JSON.stringify(newSavedLocations));
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error saving location:", e);
      return { success: false, error: DataError.unknown(e) };
    }
  }



  // Remove location from locations list
  async removeSaveLocation(location: Location): Promise<Result<void>> {
    if (!isValidLocation(location)) {
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