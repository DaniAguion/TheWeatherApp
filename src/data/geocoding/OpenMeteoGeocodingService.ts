import { OpenMeteoGeocodingResponse }  from "./dto";
import { locationSuggestionDtoToEntity } from "./mappers";
import type { GeocodingService } from "../../domain/ports/GeocodingService";
import type { Location } from "../../domain/entities/LocationEntities";
import type { Result } from "../../domain/errors/Result";
import { DomainError } from "../../domain/errors/DomainError";
 
export class OpenMeteoGeocodingService implements GeocodingService {
    
 // Search for locations using Open-Meteo Geocoding API
  async searchLocations(query: string): Promise<Result<Location[]>> {
    const trimmed = query.trim();
    if (!trimmed) return { success: true, value: [] };
    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=es&format=json`;

    try {
      const response = await fetch(url);
      if (!response) return {success:false, error: DomainError.network(new Error("No response from locations service."))};
      if (!response.ok) return {success:false, error: DomainError.network(new Error("Error http: " + response.status))};

      const data = (await response.json()) as OpenMeteoGeocodingResponse;
      if (data.results === undefined) return { success: true, value: [] };
      if (!Array.isArray(data.results)) return { success: false, error: DomainError.invalidData(new Error("Malformed geocoding response")) };

      const locations: Location[] = data.results
        .filter(entry => entry != null)
        .map(locationSuggestionDtoToEntity);

      return { success: true, value: locations };
    } catch (e) {
      console.error("[OpenMeteoGeocodingService] Error fetching locations.", e);
      return { success:false, error: DomainError.unknown(e)};
    }
  }
}