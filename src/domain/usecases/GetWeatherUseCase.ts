import type { Coordinates } from "../entities/LocationEntities";
import type { WeatherInfo } from "../entities/WeatherEntities";
import type { WeatherService } from "../ports/WeatherService";
import type { CacheWeatherService } from "../ports/CacheWeatherService";
import { Result } from "../errors/Result";

export class GetWeatherUseCase {
  constructor(private readonly weatherService: WeatherService, private cacheWeatherService: CacheWeatherService) {} 

  async execute(coords: Coordinates): Promise<Result<WeatherInfo>> {
    // First, try to get the weather info from the cache
    const cachedWeather = await this.cacheWeatherService.getWeatherInfo(coords);
    if (cachedWeather) {
      return { success: true, value: cachedWeather };
    }
    
    // If not in cache, fetch from the weather service and store in cache
    const fetchedWeatherResult = await this.weatherService.getWeather(coords);

    if (fetchedWeatherResult.success) {
      await this.cacheWeatherService.storageWeatherInfo(coords, fetchedWeatherResult.value);
    }
    return fetchedWeatherResult;
  }
}