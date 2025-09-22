import type { ReverseGeoService } from "../../domain/ports/ReverseGeoService";
import type { NominatimResponse } from "./dto";
import { getCached, setCached } from "../storage/cache";
import { Coordinates } from "../../domain/entities";
import { Result } from "../../domain/errors/Result";
import { DataError } from "../../domain/errors/DataError";

export class NominatimReverseGeoService implements ReverseGeoService {

  async getLocationName({ lat, lon }: Coordinates): Promise<Result<string>> {
    // Check cache first
    const ttl = 10 * 60 * 1000; // Weather data valid for 10 min
    const cacheKey = `locationName:${lat.toFixed(3)},${lon.toFixed(3)}`;
    const cached = await getCached<string>(cacheKey, ttl);
    if (cached) return { success: true, value: cached };

    // Fetch from API if not in cache or expired
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=10&format=jsonv2`;
      const response = await fetch(url, { headers: { "User-Agent": "TheWeatherApp" } });
      if (!response) return {success:false, error: DataError.network(new Error("No response from geolocation server"))};
      if (!response.ok) return {success:false, error: DataError.http(response.status)};
      
      const data = (await response.json()) as NominatimResponse;

      try { 
        await setCached(cacheKey, data.name); 
      } catch (error) {
        console.warn("Failed to cache the location name:", error);
      }
      return { success: true, value: data.name};
    } catch (error) {
      return { success:false, error: DataError.unknown(error)};
    }
  }
}
