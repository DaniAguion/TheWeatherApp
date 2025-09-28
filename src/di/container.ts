import { WeatherService } from "../domain/ports/WeatherService";
import { ReverseGeoService } from "../domain/ports/ReverseGeoService";
import { StorageService } from "../domain/ports/StorageService";
import { OpenMeteoWeatherService } from "../data/weather/OpenMeteoWeatherService";
import { NominatimReverseGeoService } from "../data/geocoding/NominatimReverseGeoService";
import { StorageServiceImpl } from "../data/storage/StorageServiceImpl";

export type Services = {
  weatherService: WeatherService;
  reverseGeoService: ReverseGeoService;
  storageService: StorageService;
};

// Factory function to create and provide services
export function createServices(): Services {
  const weatherService = new OpenMeteoWeatherService();
  const reverseGeoService = new NominatimReverseGeoService();
  const storageService = new StorageServiceImpl();
  return { weatherService, reverseGeoService, storageService };
}
