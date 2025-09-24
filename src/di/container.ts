import { WeatherService } from "../domain/ports/WeatherService";
import { ReverseGeoService } from "../domain/ports/ReverseGeoService";
import { UserPreferencesService } from "../domain/ports/UserPreferencesService";
import { OpenMeteoWeatherService } from "../data/weather/OpenMeteoWeatherService";
import { NominatimReverseGeoService } from "../data/geocoding/NominatimReverseGeoService";
import { UserPreferencesServiceImpl } from "../data/preferences/UserPrefsServiceImpl";

export type Services = {
  weatherService: WeatherService;
  reverseGeoService: ReverseGeoService;
  userPreferencesService: UserPreferencesService;
};

// Factory function to create and provide services
export function createServices(): Services {
  const weatherService = new OpenMeteoWeatherService();
  const reverseGeoService = new NominatimReverseGeoService();
  const userPreferencesService = new UserPreferencesServiceImpl();
  return { weatherService, reverseGeoService, userPreferencesService };
}
