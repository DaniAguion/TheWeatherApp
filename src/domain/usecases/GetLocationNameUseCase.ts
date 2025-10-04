import type { ReverseGeoService } from "../ports/ReverseGeoService";
import type { CacheWeatherService } from "../ports/CacheWeatherService";
import type { Location } from "../entities/LocationEntities";
import { normalizeLocation } from "../helpers/LocationHelper";

export class GetLocationNameUseCase {
  constructor(private readonly reverseGeoService: ReverseGeoService, private cacheWeatherService: CacheWeatherService) {} 

  async execute(location: Location): Promise<string> {
    const normalizedLocation = normalizeLocation(location);
    // First check cache
    const cached = await this.cacheWeatherService.getLocationName(normalizedLocation.coordinates);
    if (cached) return cached;

    // If not in cache, fetch from service
    const result = await this.reverseGeoService.getLocationName(location.coordinates);
    if (result.success) {
      await this.cacheWeatherService.storageLocationName(normalizedLocation.coordinates, result.value);
      return result.value;
    } else {
      return "";
    }
  }
}