import { WeatherService } from "../domain/ports/WeatherService";
import { ReverseGeoService } from "../domain/ports/ReverseGeoService";
import { OpenMeteoWeatherService } from "../data/weather/OpenMeteoWeatherService";
import { NominatimReverseGeoService } from "../data/geocoding/NominatimReverseGeoService";

export type WeatherModule = {
  weatherService: WeatherService;
  reverseGeoService: ReverseGeoService;
};

export function makeWeatherModule(): WeatherModule {
  const weatherService = new OpenMeteoWeatherService();
  const reverseGeoService = new NominatimReverseGeoService();
  return { weatherService, reverseGeoService };
}
