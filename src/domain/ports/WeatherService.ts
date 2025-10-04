import type { WeatherInfo, Current } from "../entities/WeatherEntities";
import type { Coordinates, Location } from "../entities/LocationEntities";
import { Result } from "../errors/Result";

export interface WeatherService {

  getWeather(coordinates: Coordinates): Promise<Result<WeatherInfo>>;

  getCurrentWeather_old({ lat, lon }: Coordinates): Promise<Result<Current>>

  getCurrentWeather_new({ lat, lon }: Coordinates): Promise<Result<Current>>
  
  searchLocations(query: string): Promise<Result<Location[]>>;
}
