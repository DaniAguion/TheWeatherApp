import { WeatherService } from "../data/weatherService/weatherService";
import { ReverseGeoService } from "../data/locationService/reverseGeoService";
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
