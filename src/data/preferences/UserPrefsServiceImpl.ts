import AsyncStorage from "@react-native-async-storage/async-storage";
import type { UserPreferences } from "../../domain/entities/UserPreferences";

const STORAGE_KEY = "selectedLocation";

const DEFAULT : UserPreferences  = {
  useCurrentLocation: false,
  selectedLocation: { name: "Madrid", coordinates: { lat: 40.4168, lon: -3.7038 } },
};

type storedUserPreferences = {
  savedLocation: { name: string; coordinates: { lat: number; lon: number } };
  useCurrent: boolean;
};

const isFiniteNum = (n: unknown): n is number => typeof n === "number" && Number.isFinite(n);
const validLoc = (x: any) =>
  x && typeof x.name === "string" &&
  isFiniteNum(x.coordinates?.lat) && isFiniteNum(x.coordinates?.lon);

export class UserPreferencesServiceImpl {
  async load() {
    try {
      const raw = await AsyncStorage.getItem(STORAGE_KEY);
      if (!raw) return DEFAULT;
      const parsed = JSON.parse(raw) as storedUserPreferences;
      if (parsed && validLoc(parsed.savedLocation)) {
        return {
          useCurrentLocation: !!parsed.useCurrent,
          selectedLocation: parsed.savedLocation,
        };
      }
    } catch (_) {}
    return DEFAULT;
  }

  async save(prefs: { useCurrentLocation: boolean; selectedLocation: { name: string; coordinates: { lat: number; lon: number } } }) {
    const { selectedLocation } = prefs;
    if (!validLoc(selectedLocation)) throw new Error("Invalid location");
    const payload: storedUserPreferences = { savedLocation: selectedLocation, useCurrent: !!prefs.useCurrentLocation };
    await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(payload));
  }

  async clearPreferences() {
    await AsyncStorage.removeItem(STORAGE_KEY);
  }
}
