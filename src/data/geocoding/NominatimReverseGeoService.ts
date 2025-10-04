import type { ReverseGeoService } from "../../domain/ports/ReverseGeoService";
import type { NominatimResponse } from "./dto";
import { getCached, setCached } from "../cache/cache";
import { Coordinates } from "../../domain/entities/LocationEntities";
import type { Result } from "../../domain/errors/Result";
import { DomainError } from "../../domain/errors/DomainError";

export class NominatimReverseGeoService implements ReverseGeoService {

  async getLocationName({ lat, lon }: Coordinates): Promise<Result<string>> {
    // Check cache first
    const cacheKey = `locationName:${lat.toFixed(3)},${lon.toFixed(3)}`;
    const cached = await getCached<string>(cacheKey);
    if (cached) return { success: true, value: cached };

    // Fetch from API if not in cache or expired
    try {
      const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=10&format=jsonv2`;
      const response = await fetch(url, { headers: { "User-Agent": "TheWeatherApp" } });
      if (!response) return {success:false, error: DomainError.network(new Error("No response from geolocation server."))};
      if (!response.ok) return {success:false, error: DomainError.network(new Error("Error http: " + response.status))};
      
      const data = (await response.json()) as NominatimResponse;
      if (!data.name || typeof data.name !== "string") {
        return { success:false, error: DomainError.invalidData(new Error("Invalid data from geolocation server."))};
      }
      await setCached(cacheKey, data.name);
      return { success: true, value: data.name};
    } catch (e) {
      console.error("[NominatimReverseGeoService] Error loading location name:", e);
      return { success:false, error: DomainError.unknown(e)};
    }
  }
}
