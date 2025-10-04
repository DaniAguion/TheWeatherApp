import { WeatherService } from "../domain/ports/WeatherService";
import { ReverseGeoService } from "../domain/ports/ReverseGeoService";
import { StorageService } from "../domain/ports/StorageService";
import { CacheWeatherService } from "../domain/ports/CacheWeatherService";
import { OpenMeteoWeatherService } from "../data/weather/OpenMeteoWeatherService";
import { NominatimReverseGeoService } from "../data/geocoding/NominatimReverseGeoService";
import { StorageServiceImpl } from "../data/storage/StorageServiceImpl";
import { CacheWeatherServiceImpl } from "../data/cache/CacheWeatherServiceImpl";
import { GetWeatherUseCase } from "../domain/usecases/GetWeatherUseCase";


export type Services = {
  weatherService: WeatherService;
  reverseGeoService: ReverseGeoService;
  storageService: StorageService;
  cacheWeatherService?: CacheWeatherService;
};

export type UseCases = {
  getWeatherUseCase: GetWeatherUseCase;
};

export type Dependencies = {
  services: Services;
  useCases: UseCases;
};

// Factory function to create and provide services
export function createDepedencies(): Dependencies {
  const weatherService = new OpenMeteoWeatherService();
  const reverseGeoService = new NominatimReverseGeoService();
  const storageService = new StorageServiceImpl();
  const cacheWeatherService = new CacheWeatherServiceImpl();

  const services: Services = { weatherService, reverseGeoService, storageService };
  const useCases: UseCases = {
    getWeatherUseCase: new GetWeatherUseCase(weatherService, cacheWeatherService),
  };

  return { services, useCases };
}