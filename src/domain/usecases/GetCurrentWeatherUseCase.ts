import type { Coordinates } from "../entities/LocationEntities";
import type { Current } from "../entities/WeatherEntities";
import type { WeatherService } from "../ports/WeatherService";
import type { CacheWeatherService } from "../ports/CacheWeatherService";
import { Result } from "../errors/Result";

// Use case to get current weather, first checking cache then falling back to weather service
export class GetCurrentWeatherUseCase {
  constructor(private readonly weatherService: WeatherService, private cacheWeatherService: CacheWeatherService) {} 

  async execute(coords: Coordinates): Promise<Result<Current>> {
    // First, try to get the weather info from the cache
    const cachedWeather = await this.cacheWeatherService.getCurrentWeather(coords);
    if (cachedWeather) {
      return { success: true, value: cachedWeather };
    }
    
    // If not in cache, fetch from the weather service and store in cache
    const fetchedWeatherResult = await this.weatherService.getCurrentWeather(coords);

    if (fetchedWeatherResult.success) {
      await this.cacheWeatherService.storageCurrentWeather(coords, fetchedWeatherResult.value);
    }
    return fetchedWeatherResult;
  }
}