import type { WeatherInfo, Coordinates } from "../entities";

export interface WeatherService {
  getWeather(coordinates: Coordinates): Promise<WeatherInfo>;
}