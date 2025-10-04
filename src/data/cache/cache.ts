import AsyncStorage from "@react-native-async-storage/async-storage";

// All TTL are managed in miliseconds
const DEFAULT_TTL: number = 10 * 60 * 1000; // 10 min in miliseconds
const TTL_RULES: Record<string, number> = {
  "weatherInfo:": 30 * 60 * 1000,
  "currentWeather:": 30 * 60 * 1000,
  "locationName:": 10 * 60 * 1000,
};

// Obtain TTL based on key prefix rules
function obtainTtl(key: string): number {
  for (const prefixe of Object.keys(TTL_RULES)) {
    if (key.startsWith(prefixe) && prefixe.length > 0) {
      return TTL_RULES[prefixe];
    }
  }
  return DEFAULT_TTL;
}


// Function to set cache data.
export async function setCached<T>(key: string, data: T) {
  try {
    await AsyncStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
  } catch (e) {
    console.warn("setCached failed:", e);
  }
}


// Function to get cache data from key. Return data only if its not expired.
export async function getCached<T>(key: string): Promise<T | null> {
  try {
    const item = await AsyncStorage.getItem(key);
    if (!item) return null;
    const { data, ts } = JSON.parse(item);
    const ttlMs = obtainTtl(key);
    if (Date.now() - ts < ttlMs) return data as T;
    // If expired, remove from cache
    await AsyncStorage.removeItem(key);
    return null;
  } catch {
    // If parsing fails, remove corrupted cache entry
    try {
      await AsyncStorage.removeItem(key);
    } catch {
      console.warn("getCached failed to remove corrupted cache entry:", key);
    }
    return null;
  }
}


// Clean cache entries that are expired based on TTL_RULES
export async function clearExpiredCache(now: number = Date.now()): Promise<void> {
  try {
    const keys = await AsyncStorage.getAllKeys();
    const targetPrefixes = Object.keys(TTL_RULES);
    const candidateKeys = keys.filter(k => targetPrefixes.some(p => k.startsWith(p)));
    if (candidateKeys.length === 0) return;
    const entries = await AsyncStorage.multiGet(candidateKeys);
    const toRemove: string[] = [];
    for (const [key, value] of entries) {
      if (!value) {
        toRemove.push(key);
        continue;
      }
      try {
        const parsed = JSON.parse(value);
        const ts = parsed?.ts;
        if (typeof ts !== "number") {
          toRemove.push(key);
          continue;
        }
        const prefix = targetPrefixes.find(p => key.startsWith(p))!;
        const ttl = TTL_RULES[prefix];
        if (now - ts >= ttl) {
          toRemove.push(key);
        }
      } catch {
        toRemove.push(key);
      }
    }
    if (toRemove.length) {
      await AsyncStorage.multiRemove(toRemove);
    }
  } catch (e) {
    console.warn("clearExpiredCache failed:", e);
  }
}