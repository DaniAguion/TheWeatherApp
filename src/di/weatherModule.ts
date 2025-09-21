import { WeatherService } from "../data/weatherService/weatherService";
import { IWeatherService } from "../domain/ports";

export type WeatherModule = {
  weatherService: IWeatherService;
};

export function makeWeatherModule(): WeatherModule {
  const weatherService = new WeatherService();
  return { weatherService};
}
