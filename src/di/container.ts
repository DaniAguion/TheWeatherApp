import { WeatherService } from "../domain/ports/WeatherService";
import { StorageService } from "../domain/ports/StorageService";
import { OpenMeteoWeatherService } from "../data/weather/OpenMeteoWeatherService";
import { NominatimReverseGeoService } from "../data/geocoding/NominatimReverseGeoService";
import { StorageServiceImpl } from "../data/storage/StorageServiceImpl";
import { CacheWeatherServiceImpl } from "../data/cache/CacheWeatherServiceImpl";
import { GetWeatherUseCase } from "../domain/usecases/GetWeatherUseCase";
import { GetCurrentWeatherUseCase } from "../domain/usecases/GetCurrentWeatherUseCase";
import { GetLocationNameUseCase } from "../domain/usecases/GetLocationNameUseCase";


export type Services = {
  weatherService: WeatherService;
  storageService: StorageService;
};

export type UseCases = {
  getWeatherUseCase: GetWeatherUseCase;
  getCurrentWeatherUseCase: GetCurrentWeatherUseCase;
  getLocationNameUseCase: GetLocationNameUseCase;
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

  const services: Services = { weatherService, storageService };
  const useCases: UseCases = {
    getWeatherUseCase: new GetWeatherUseCase(weatherService, cacheWeatherService),
    getCurrentWeatherUseCase: new GetCurrentWeatherUseCase(weatherService, cacheWeatherService),
    getLocationNameUseCase: new GetLocationNameUseCase(reverseGeoService, cacheWeatherService),
  };

  return { services, useCases };
}