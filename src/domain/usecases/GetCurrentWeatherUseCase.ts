import type { Location } from "../entities/LocationEntities";
import type { Current } from "../entities/WeatherEntities";
import type { WeatherService } from "../interfaces/WeatherService";
import type { CacheWeatherService } from "../interfaces/CacheWeatherService";
import { Result } from "../errors/Result";
import { normalizeLocation } from "../helpers/LocationHelper";

// Use case to get current weather, first checking cache then falling back to weather service
export class GetCurrentWeatherUseCase {
  constructor(private readonly weatherService: WeatherService, private cacheWeatherService: CacheWeatherService) {} 

  async execute(location: Location): Promise<Result<Current>> {
    const normalizedLocation = normalizeLocation(location);
    // First, try to get the weather info from the cache
    const cachedWeather = await this.cacheWeatherService.getCurrentWeather(normalizedLocation.coordinates);
    if (cachedWeather) {
      return { success: true, value: cachedWeather };
    }
    
    // If not in cache, fetch from the weather service and store in cache
    const fetchedWeatherResult = await this.weatherService.getCurrentWeather(location.coordinates);

    if (fetchedWeatherResult.success) {
      await this.cacheWeatherService.storageCurrentWeather(normalizedLocation.coordinates, fetchedWeatherResult.value);
    }
    return fetchedWeatherResult;
  }
}