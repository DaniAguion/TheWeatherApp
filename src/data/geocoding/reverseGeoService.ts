import type { IReverseGeoService } from "../../domain/ports";
import type { NominatimResponse } from "./dto";
import { getCached, setCached } from "../storage/cache";


export class ReverseGeoService implements IReverseGeoService {

  async getLocationName({ lat, lon }: { lat: number; lon: number }): Promise<string> {
    // Check cache first
    const ttl = 10 * 60 * 1000; // Location valid for 10 minutes
    const cacheKey = `location:${lat.toFixed(3)},${lon.toFixed(3)}`;
    const cached = await getCached<string>(cacheKey, ttl);
    if (cached) return cached;

    // Fetch from Nominatim API if not in cache or expired
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=10&format=jsonv2`;
    const response = await fetch(url, {
      headers: { "User-Agent": "TheWeatherApp" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = (await response.json()) as NominatimResponse;
    await setCached(cacheKey, data);
    return data.name || "Desconocido";
  }

}
