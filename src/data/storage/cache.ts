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