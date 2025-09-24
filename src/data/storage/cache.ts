import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setCached<T>(key: string, data: T) {
  await AsyncStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
}

export async function getCached<T>(key: string, ttlMs: number): Promise<T | null> {
  const item = await AsyncStorage.getItem(key);
  if (!item) return null;
  try {
    const { ts, data } = JSON.parse(item);
    if (Date.now() - ts < ttlMs) return data as T;
    // If expired, remove from cache
    await AsyncStorage.removeItem(key);
    return null;
  } catch {
    // If parsing fails, remove corrupted cache entry
    await AsyncStorage.removeItem(key);
    return null;
  }
}



const TTL_RULES: Record<string, number> = {
  "weatherInfo:": 30 * 60 * 1000,   // 30 min
  "locationName:": 10 * 60 * 1000,  // 10 min
};


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