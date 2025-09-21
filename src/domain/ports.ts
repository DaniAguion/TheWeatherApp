import type { WeatherInfo } from "./entities";


export interface IWeatherService {
  getWeather(params: { lat: number; lon: number }): Promise<WeatherInfo>;
}

export interface IReverseGeocoder {
  getLocationName(params: { lat: number; lon: number}): Promise<string | null>;
}