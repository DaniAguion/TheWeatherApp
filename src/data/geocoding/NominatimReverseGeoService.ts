import type { ReverseGeoService } from "../../domain/ports/ReverseGeoService";
import type { NominatimResponse } from "./dto";
import { getCached, setCached } from "../storage/cache";
import { Coordinates } from "../../domain/entities";


export class NominatimReverseGeoService implements ReverseGeoService {

  async getLocationName({ lat, lon }: Coordinates): Promise<string | null> {
    // Check cache first
    const ttl = 10 * 60 * 1000; // Location valid for 10 minutes
    const cacheKey = `locationName:${lat.toFixed(3)},${lon.toFixed(3)}`;
    const cached = await getCached<string>(cacheKey, ttl);
    if (cached) return cached;

    // Fetch from Nominatim API if not in cache or expired
    const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=10&format=jsonv2`;
    const response = await fetch(url, {
      headers: { "User-Agent": "TheWeatherApp" },
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = (await response.json()) as NominatimResponse;
    await setCached(cacheKey, data.name);
    return data.name || null;
  }

}
