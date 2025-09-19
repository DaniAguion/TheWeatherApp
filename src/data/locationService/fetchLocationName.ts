import type { NominatimResponse } from "./types";
import { getCached, setCached } from "../localStorage/cache";

// Cache location names for 10 minutes
const LOCATION_TTL_MS = 10 * 60 * 1000;


async function fetchLocationName(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=10&format=jsonv2`;
  const response = await fetch(url, {
    headers: { "User-Agent": "TheWeatherApp" },
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = (await response.json()) as NominatimResponse;
  return data.name || "Desconocido";
}

// Function to get the location name
// It first checks the cache, and if not found or expired, it fetches from Nominatim
export async function getLocationName(lat: number, lon: number): Promise<string> {
  const key = `location:${lat.toFixed(3)},${lon.toFixed(3)}`;
  const cached = await getCached<string>(key, LOCATION_TTL_MS);
  if (cached) return cached;
  
  const data = await fetchLocationName(lat, lon);
  await setCached(key, data);
  return data;
}
