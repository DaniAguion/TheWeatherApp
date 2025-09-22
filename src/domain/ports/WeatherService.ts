import type { WeatherInfo, Coordinates } from "../entities";
import { Result } from "../errors/Result";

export interface WeatherService {
  getWeather(coordinates: Coordinates): Promise<Result<WeatherInfo>>;
}