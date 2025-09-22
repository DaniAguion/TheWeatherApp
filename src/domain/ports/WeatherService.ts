import type { WeatherInfo } from "../entities/WeatherEntities";
import type { Coordinates } from "../entities/LocationEntities";
import { Result } from "../errors/Result";

export interface WeatherService {
  getWeather(coordinates: Coordinates): Promise<Result<WeatherInfo>>;
}