import type { WeatherInfo } from "../entities/WeatherEntities";
import type { Coordinates, Location } from "../entities/LocationEntities";
import { Result } from "../errors/Result";

export interface WeatherService {
  getWeather(coordinates: Coordinates): Promise<Result<WeatherInfo>>;
  searchLocations(query: string): Promise<Result<Location[]>>;
}
