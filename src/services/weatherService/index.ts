import { fetchAllWeatherInfo } from "./openmeteo";
import { WeatherInfo } from "./types";
import { getCached, setCached } from "../localStorage/cache";

export async function getWeather(lat: number, lon: number): Promise<WeatherInfo> {
  const key = `openmeteo:${lat.toFixed(3)},${lon.toFixed(3)}`;
  const ttl = 20 * 60 * 1000; // 20 min
  const cached = await getCached<WeatherInfo>(key, ttl);
  if (cached) return cached;
  const data = await fetchAllWeatherInfo(lat, lon);
  await setCached(key, data);
  return data;
}