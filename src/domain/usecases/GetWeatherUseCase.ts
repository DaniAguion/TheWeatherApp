import type { WeatherInfo } from "../entities/WeatherEntities";
import type { WeatherService } from "../interfaces/WeatherService";
import type { Location } from "../entities/LocationEntities";
import type { CacheWeatherService } from "../interfaces/CacheWeatherService";
import { normalizeLocation } from "../helpers/LocationHelper";
import { Result } from "../errors/Result";


export class GetWeatherUseCase {
  constructor(private readonly weatherService: WeatherService, private cacheWeatherService: CacheWeatherService) {} 

  async execute(location: Location): Promise<Result<WeatherInfo>> {
    const normalizedLocation = normalizeLocation(location);
    // First, try to get the weather info from the cache
    const cachedWeather = await this.cacheWeatherService.getWeatherInfo(normalizedLocation.coordinates);
    if (cachedWeather) {
      return { success: true, value: cachedWeather };
    }
    
    // If not in cache, fetch from the weather service and store in cache
    const fetchedWeatherResult = await this.weatherService.getWeather(location.coordinates);

    if (fetchedWeatherResult.success) {
      await this.cacheWeatherService.storageWeatherInfo(normalizedLocation.coordinates, fetchedWeatherResult.value);
    }
    return fetchedWeatherResult;
  }
}