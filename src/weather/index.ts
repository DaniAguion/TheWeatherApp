import { fetchWeatherPack } from "./openMeteo";
import { WeatherPack } from "./types";
import { getCached, setCached } from "../storage/cache";

export async function getWeather(lat: number, lon: number): Promise<WeatherPack> {
  const key = `openmeteo:${lat.toFixed(3)},${lon.toFixed(3)}`;
  const ttl = 20 * 60 * 1000; // 20 min
  const cached = await getCached<WeatherPack>(key, ttl);
  if (cached) return cached;
  const data = await fetchWeatherPack(lat, lon);
  await setCached(key, data);
  return data;
}