import type { WeatherInfo } from "../entities";

export interface WeatherService {
  getWeather(params: { lat: number; lon: number }): Promise<WeatherInfo>;
}