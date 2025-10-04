import { StorageService } from "../domain/ports/StorageService";
import { OpenMeteoWeatherService } from "../data/weather/OpenMeteoWeatherService";
import { OpenMeteoGeocodingService } from "../data/geocoding/OpenMeteoGeocodingService";
import { NominatimReverseGeoService } from "../data/reverse-geocoding/NominatimReverseGeoService";
import { StorageServiceImpl } from "../data/storage/StorageServiceImpl";
import { CacheWeatherServiceImpl } from "../data/cache/CacheWeatherServiceImpl";
import { GetWeatherUseCase } from "../domain/usecases/GetWeatherUseCase";
import { GetCurrentWeatherUseCase } from "../domain/usecases/GetCurrentWeatherUseCase";
import { GetLocationNameUseCase } from "../domain/usecases/GetLocationNameUseCase";
import { SearchLocationUseCase } from "../domain/usecases/SearchLocationsUseCase";
import { GetSavedLocationUseCase } from "../domain/usecases/GetSavedLocationsUseCase";
import { GetLocationStatusUseCase } from "../domain/usecases/GetLocationStatusUseCase";
import { ToggleFavouriteUseCase } from "../domain/usecases/ToggleFavouriteUseCase";
import { ToggleSavedUseCase } from "../domain/usecases/ToggleSavedUseCase";

export type Services = {
  storageService: StorageService;
};

export type UseCases = {
  getWeatherUseCase: GetWeatherUseCase;
  getCurrentWeatherUseCase: GetCurrentWeatherUseCase;
  getLocationNameUseCase: GetLocationNameUseCase;
  searchLocationUseCase: SearchLocationUseCase;
  getSavedLocationUseCase: GetSavedLocationUseCase;
  getLocationStatusUseCase: GetLocationStatusUseCase;
  toggleFavouriteUseCase: ToggleFavouriteUseCase;
  toggleSavedUseCase: ToggleSavedUseCase;
};

export type Dependencies = {
  services: Services;
  useCases: UseCases;
};

// Factory function to create and provide services
export function createDepedencies(): Dependencies {
  const weatherService = new OpenMeteoWeatherService();
  const reverseGeoService = new NominatimReverseGeoService();
  const geocodingService = new OpenMeteoGeocodingService();
  const storageService = new StorageServiceImpl();
  const cacheWeatherService = new CacheWeatherServiceImpl();

  const services: Services = { storageService };
  const useCases: UseCases = {
    getWeatherUseCase: new GetWeatherUseCase(weatherService, cacheWeatherService),
    getCurrentWeatherUseCase: new GetCurrentWeatherUseCase(weatherService, cacheWeatherService),
    getLocationNameUseCase: new GetLocationNameUseCase(reverseGeoService, cacheWeatherService),
    searchLocationUseCase: new SearchLocationUseCase(geocodingService),
    getSavedLocationUseCase: new GetSavedLocationUseCase(storageService),
    getLocationStatusUseCase: new GetLocationStatusUseCase(storageService),
    toggleFavouriteUseCase: new ToggleFavouriteUseCase(storageService),
    toggleSavedUseCase: new ToggleSavedUseCase(storageService),
  };

  return { services, useCases };
}