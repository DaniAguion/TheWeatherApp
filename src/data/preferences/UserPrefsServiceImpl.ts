import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserPreferences, UserLocations } from "../../domain/entities/UserPreferences";
import type { UserPreferencesService } from "../../domain/ports/UserPreferencesService";
import type { Location } from "../../domain/entities/LocationEntities";
import type { Result } from "../../domain/errors/Result";
import { DataError } from "../../domain/errors/DataError";

const PREFERENCES_KEY = "userPreferences";
const LOCATIONS_KEY = "userLocations";

const DEFAULT_PREFERENCES : UserPreferences  = {
  useCurrentLocation: false
};

const DEFAULT_LOCATIONS : UserLocations = {
  savedLocations: [],
  favouriteLocation: { name: "Madrid", coordinates: { lat: 40.4168, lon: -3.7038 } },
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


export class UserPreferencesServiceImpl implements UserPreferencesService {

  // Load preferences
  async loadPreferences(): Promise<UserPreferences> {
    try {
      const raw = await AsyncStorage.getItem(PREFERENCES_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserPreferences;
        return { useCurrentLocation: parsed.useCurrentLocation };
      }
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(DEFAULT_PREFERENCES));
      console.warn("[UserPrefs] No valid preferences found, using default.");
      return DEFAULT_PREFERENCES;
    } catch (e) {
      console.error("[UserPrefs] Error loading preferences:", e);
    }
    return DEFAULT_PREFERENCES;
  }


  // Save preferences
  async savePreferences(prefs: UserPreferences) : Promise<Result<void>> {
    try {
      await AsyncStorage.setItem(PREFERENCES_KEY, JSON.stringify(prefs));
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error saving preferences:", e);
      return { success: false, error: DataError.unknown(e) };
    }
  }


  // Load favourite location
  async loadFavouriteLocation(): Promise<Location> {
    try {
      const raw = await AsyncStorage.getItem(LOCATIONS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserLocations;
        if (parsed && validLocation(parsed.favouriteLocation)) {
          return parsed.favouriteLocation;
        } 
      }
      await AsyncStorage.setItem(LOCATIONS_KEY, JSON.stringify(DEFAULT_LOCATIONS));
      console.warn("[UserPrefs] No valid favourite location found, using default.");
      return DEFAULT_LOCATIONS.favouriteLocation;
    } catch (e) {
      console.error("[UserPrefs] Error loading favourite location:", e);
    }
    return DEFAULT_LOCATIONS.favouriteLocation;
  }


  // Save a location as favourite
  async saveLocationAsFavourite(location: Location): Promise<Result<void>> {
    return this.saveLocation(location, undefined);
  }


  // Save a location to saved locations list
  async saveLocationAsSaved(location: Location): Promise<Result<void>> {
    return this.saveLocation(undefined, location);
  }


 // Function saves either a favourite or a saved location
  private async saveLocation(favouriteLocation?: Location, savedLocation?: Location): Promise<Result<void>> {
     try {
      if (!favouriteLocation && savedLocation) return {
         success: false, error: DataError.invalidData(new Error("No location provided")) 
      };
      
      if (favouriteLocation && !validLocation(favouriteLocation)) {
        console.error("[UserPrefs] Invalid location format:", favouriteLocation);
        return {
          success: false,
          error: DataError.invalidData(new Error("Invalid location")),
        };
      }

      if (savedLocation && !validLocation(savedLocation)) {
        console.error("[UserPrefs] Invalid location format:", savedLocation);
        return {
          success: false,
          error: DataError.invalidData(new Error("Invalid location")),
        };
      }

      let base: UserLocations = DEFAULT_LOCATIONS;
      const raw = await AsyncStorage.getItem(LOCATIONS_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserLocations;
        base = {
            savedLocations: parsed.savedLocations ?? DEFAULT_LOCATIONS.savedLocations,
            favouriteLocation: parsed.favouriteLocation ?? DEFAULT_LOCATIONS.favouriteLocation,
        };
      }

      const merged: UserLocations = {
        savedLocations: savedLocation ? [...base.savedLocations, savedLocation] : base.savedLocations,
        favouriteLocation: favouriteLocation? favouriteLocation : base.favouriteLocation,
      };

      await AsyncStorage.setItem(LOCATIONS_KEY, JSON.stringify(merged));
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error saving location:", e);
      return { success: false, error: DataError.unknown(e) };
    }
  }
}