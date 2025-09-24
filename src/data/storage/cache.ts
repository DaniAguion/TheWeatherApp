import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setCached<T>(key: string, data: T) {
  await AsyncStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
}

export async function getCached<T>(key: string, ttlMs: number): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  try {
    const { ts, data } = JSON.parse(raw);
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