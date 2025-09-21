import { WeatherService } from "../data/weather/weatherService";
import { ReverseGeoService } from "../data/geocoding/reverseGeoService";
import { IWeatherService, IReverseGeoService } from "../domain/ports";

export type WeatherModule = {
  weatherService: IWeatherService;
  reverseGeoService: IReverseGeoService;
};

export function makeWeatherModule(): WeatherModule {
  const weatherService = new WeatherService();
  const reverseGeoService = new ReverseGeoService();
  return { weatherService, reverseGeoService };
}
