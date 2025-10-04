import type { Coordinates } from "../entities/LocationEntities";
import type { ReverseGeoService } from "../ports/ReverseGeoService";
import type { CacheWeatherService } from "../ports/CacheWeatherService";
import { Result } from "../errors/Result";

export class GetLocationNameUseCase {
  constructor(private readonly reverseGeoService: ReverseGeoService, private cacheWeatherService: CacheWeatherService) {} 

  async execute(coords: Coordinates): Promise<string> {
    // First check cache
    const cached = await this.cacheWeatherService.getLocationName(coords);
    if (cached) return cached;

    // If not in cache, fetch from service
    const result = await this.reverseGeoService.getLocationName(coords);
    if (result.success) {
      await this.cacheWeatherService.storageLocationName(coords, result.value);
      return result.value;
    } else {
      return "";
    }
  }
}