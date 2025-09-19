import { fetchLocatioName } from "./nominatim";
import { getCached, setCached } from "../storage/cache";

export async function getLocationName(lat: number, lon: number): Promise<string> {
  const key = `location:${lat.toFixed(3)},${lon.toFixed(3)}`;
  const ttl = 20 * 60 * 1000; // 20 min
  const cached = await getCached<string>(key, ttl);
  if (cached) return cached;
  const data = await fetchLocatioName(lat, lon);
  await setCached(key, data);
  return data;
}