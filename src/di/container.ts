import { WeatherService } from "../domain/ports/WeatherService";
import { ReverseGeoService } from "../domain/ports/ReverseGeoService";
import { UserStoreService } from "../domain/ports/UserStoreService";
import { OpenMeteoWeatherService } from "../data/weather/OpenMeteoWeatherService";
import { NominatimReverseGeoService } from "../data/geocoding/NominatimReverseGeoService";
import { UserStoreServiceImpl } from "../data/storage/UserStoreServiceImpl";

export type Services = {
  weatherService: WeatherService;
  reverseGeoService: ReverseGeoService;
  userStoreService: UserStoreService;
};

// Factory function to create and provide services
export function createServices(): Services {
  const weatherService = new OpenMeteoWeatherService();
  const reverseGeoService = new NominatimReverseGeoService();
  const userStoreService = new UserStoreServiceImpl();
  return { weatherService, reverseGeoService, userStoreService };
}
