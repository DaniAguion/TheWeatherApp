import AsyncStorage from "@react-native-async-storage/async-storage";

export async function setCached<T>(key: string, data: T) {
  await AsyncStorage.setItem(key, JSON.stringify({ ts: Date.now(), data }));
}

export async function getCached<T>(key: string, ttlMs: number): Promise<T | null> {
  const raw = await AsyncStorage.getItem(key);
  if (!raw) return null;
  const { ts, data } = JSON.parse(raw);
  return (Date.now() - ts) < ttlMs ? (data as T) : null;
}