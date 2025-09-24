import { WeatherService } from "../domain/ports/WeatherService";
import { ReverseGeoService } from "../domain/ports/ReverseGeoService";
import { OpenMeteoWeatherService } from "../data/weather/OpenMeteoWeatherService";
import { NominatimReverseGeoService } from "../data/geocoding/NominatimReverseGeoService";

export type Services = {
  weatherService: WeatherService;
  reverseGeoService: ReverseGeoService;
};

// Factory function to create and provide services
export function createServices(): Services {
  const weatherService = new OpenMeteoWeatherService();
  const reverseGeoService = new NominatimReverseGeoService();
  return { weatherService, reverseGeoService };
}
