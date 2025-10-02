import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserPreferences } from "../../domain/entities/UserPreferences";
import type { StorageService as StorageService } from "../../domain/ports/StorageService";
import type { Location } from "../../domain/entities/LocationEntities";
import type { Result } from "../../domain/errors/Result";
import { DomainError } from "../../domain/errors/DomainError";
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
  async loadPreferences(): Promise<Result<UserPreferences>> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.preferences);
      if (raw) {
        const parsed = JSON.parse(raw) as UserPreferences;
        return { success: true, value: {useCurrentLocation: parsed.useCurrentLocation }};
      }
      await AsyncStorage.setItem(KEYS.preferences, JSON.stringify(DEFAULT_VALUES.preferences));
      return { success: true, value: DEFAULT_VALUES.preferences };
    } catch (e) {
      console.error("[UserPrefs] Error loading preferences:", e);
      return { success: true, value: DEFAULT_VALUES.preferences };
    }
  }


  // Save preferences
  async storePreferences(prefs: UserPreferences) : Promise<Result<void>> {
    try {
      await AsyncStorage.setItem(KEYS.preferences, JSON.stringify(prefs));
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error saving preferences:", e);
      return { success: false, error: DomainError.unknown(e) };
    }
  }



  // Load favourite location
  async loadFavouriteLocation(): Promise<Result<Location>> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.favouriteLocation);
      if (raw) {
        const parsedLocation = JSON.parse(raw) as Location;
        if (parsedLocation ) return { success: true, value: parsedLocation };
      }
      await AsyncStorage.setItem(KEYS.favouriteLocation, JSON.stringify(DEFAULT_VALUES.favouriteLocation));
      return { success: true, value: DEFAULT_VALUES.favouriteLocation };
    } catch (e) {
      console.error("[UserPrefs] Error loading favourite location:", e);
      return { success: false, error: DomainError.unknown(e) };
    }
  }


  // Save a location as favourite
  async storeFavouriteLocation(location: Location): Promise<Result<void>> {
    if (!isValidLocation(location)) {
      console.error("[UserPrefs] Invalid location format:", location);
      return {
        success: false,
        error: DomainError.invalidData(new Error("Invalid location")),
      };
    }

    try {
      const normalizedLoc = normalizeLocation(location);
      await AsyncStorage.setItem(KEYS.favouriteLocation, JSON.stringify(normalizedLoc));
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error saving favourite location:", e);
      return { success: false, error: DomainError.unknown(e) };
    }
  }


  // Remove location from favourite
  async removeFavouriteLocation(location: Location): Promise<Result<void>> {
    try {
      if (sameLocation(location, DEFAULT_VALUES.favouriteLocation)) {
        return { success: false, error: DomainError.storage(new Error("Cannot remove default location")) };
      }
      await AsyncStorage.removeItem(KEYS.favouriteLocation);
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error removing favourite location:", e);
      return { success: false, error: DomainError.unknown(e) };
    }
  }


  // Load saved locations
  async loadSavedLocations(): Promise<Result<Location[]>> {
    try {
      const raw = await AsyncStorage.getItem(KEYS.savedLocations);
      if (raw) {
        const parsedLocations = JSON.parse(raw) as Location[];
        if (parsedLocations && Array.isArray(parsedLocations)) {
          return { success: true, value: parsedLocations };
        } 
      }
      await AsyncStorage.setItem(KEYS.savedLocations, JSON.stringify(DEFAULT_VALUES.savedLocations));
      return { success: true, value: DEFAULT_VALUES.savedLocations };
    } catch (e) {
      console.error("[UserPrefs] Error loading saved locations:", e);
      return { success: false, error: DomainError.unknown(e) };
    }
  }


  // Save a location to saved locations list
  async storeSavedLocation(location: Location): Promise<Result<void>> {
    if (!isValidLocation(location)) {
      console.error("[UserPrefs] Invalid location format:", location);
      return {
        success: false,
        error: DomainError.invalidData(new Error("Invalid location")),
      };
    }
    
    try {
      let savedLocations: Location[] = [];
      const loadSavedLocations = await this.loadSavedLocations()
      if (loadSavedLocations.success) {
        savedLocations = loadSavedLocations.value;
      } else {
        return { success: false, error: DomainError.unknown(new Error("Could not save location")) };
      }
      const normalizedLoc = normalizeLocation(location);
      if (savedLocations.some(l => sameLocation(l, normalizedLoc))) {
        return { success: false, error: DomainError.unknown(new Error("Location already saved")) };
      }
      const newSavedLocations = [...savedLocations, normalizedLoc];
      await AsyncStorage.setItem(KEYS.savedLocations, JSON.stringify(newSavedLocations));
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error saving location:", e);
      return { success: false, error: DomainError.unknown(e) };
    }
  }



  // Remove location from locations list
  async removeSaveLocation(location: Location): Promise<Result<void>> {
    if (!isValidLocation(location)) {
      console.error("[UserPrefs] Invalid location format:", location);
      return {
        success: false,
        error: DomainError.invalidData(new Error("Invalid location")),
      };
    }
    
    try {
      let savedLocations: Location[] = [];
      const loadSavedLocations = await this.loadSavedLocations()
      if (loadSavedLocations.success) {
        savedLocations = loadSavedLocations.value;
      } else {
        return { success: false, error: DomainError.unknown(new Error("Could not load saved locations")) };
      }
      const normalizedLoc = normalizeLocation(location);
      const newSavedLocations = savedLocations.filter(l =>!((l.coordinates.lat === normalizedLoc.coordinates.lat &&
            l.coordinates.lon === normalizedLoc.coordinates.lon)) || l.name !== normalizedLoc.name);
      await AsyncStorage.setItem(KEYS.savedLocations, JSON.stringify(newSavedLocations));
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error saving location:", e);
      return { success: false, error: DomainError.unknown(e) };
    }
  }
}