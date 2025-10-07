import type { WeatherInfo, Current } from "../entities/WeatherEntities";
import type { Coordinates } from "../entities/LocationEntities";

export interface CacheWeatherService {

    getWeatherInfo(coordinates: Coordinates): Promise<WeatherInfo | null>;

    storageWeatherInfo(coordinates: Coordinates, weatherInfo: WeatherInfo): Promise<void>;

    getCurrentWeather(coordinates: Coordinates): Promise<Current | null>

    storageCurrentWeather(coordinates: Coordinates, weatherInfo: Current): Promise<void>

    getLocationName(coordinates: Coordinates): Promise<string | null>

    storageLocationName(coordinates: Coordinates, locationName: string): Promise<void>
}
