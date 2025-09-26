import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserPreferences } from "../../domain/entities/UserPreferences";
import type { UserPreferencesService } from "../../domain/ports/UserPreferencesService";
import type { Result } from "../../domain/errors/Result";
import { DataError } from "../../domain/errors/DataError";

const STORAGE_KEY = "userPreferences";

const DEFAULT : UserPreferences  = {
  useCurrentLocation: false,
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
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw) as UserPreferences;
        if (parsed && validLocation(parsed.favouriteLocation)) {
          return {
            useCurrentLocation: !!parsed.useCurrentLocation,
            favouriteLocation: parsed.favouriteLocation,
          };
        } 
      }
      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT));
      console.warn("[UserPrefs] No valid preferences found, using default.");
      return DEFAULT;
    } catch (e) {
      console.error("[UserPrefs] Error loading preferences:", e);
    }
    return DEFAULT;
  }


  // Save preferences
  async savePreferences(prefs: Partial<UserPreferences>): Promise<Result<void>> {
    try {
      if (prefs.favouriteLocation && !validLocation(prefs.favouriteLocation)) {
        console.error("[UserPrefs] Invalid location format:", prefs.favouriteLocation);
        return {
          success: false,
          error: DataError.invalidData(new Error("Invalid selectedLocation")),
        };
      }

      let base: UserPreferences = DEFAULT;
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        base = {
            useCurrentLocation: !!parsed.useCurrentLocation,
            favouriteLocation: parsed.favouriteLocation,
        };
      }

      const merged: UserPreferences = {
        useCurrentLocation: prefs.useCurrentLocation !== undefined ?
          prefs.useCurrentLocation : base.useCurrentLocation,
        favouriteLocation: (prefs.favouriteLocation && (validLocation(prefs.favouriteLocation))) ?
          prefs.favouriteLocation : base.favouriteLocation,
      };

      await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(merged));
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error saving preferences:", e);
      return { success: false, error: DataError.unknown(e) };
    }
  }


  // Clear all preferences
  async clearPreferences(): Promise<Result<void>> {
    try {
      await AsyncStorage.removeItem(STORAGE_KEY);
      await this.savePreferences(DEFAULT);
      return { success: true, value: undefined };
    } catch (e) {
      console.error("[UserPrefs] Error clearing preferences:", e);
      return { success: false, error: DataError.unknown(e) };
    }
  }
}