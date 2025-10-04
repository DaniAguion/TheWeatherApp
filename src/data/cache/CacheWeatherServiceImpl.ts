import type { CacheWeatherService } from "../../domain/ports/CacheWeatherService";
import { getCached, setCached } from "../cache/cache";
import type { Coordinates } from "../../domain/entities/LocationEntities";
import type { WeatherInfo, Current } from "../../domain/entities/WeatherEntities";


export class CacheWeatherServiceImpl implements CacheWeatherService {
    async getWeatherInfo(coordinates: Coordinates): Promise<WeatherInfo | null> {
        const cacheKey = `weatherInfo:${coordinates.lat.toFixed(3)},${coordinates.lon.toFixed(3)}`;
        return await getCached<WeatherInfo>(cacheKey);
    }  

    async storageWeatherInfo(coordinates: Coordinates, weatherInfo: WeatherInfo): Promise<void> {
        const cacheKey = `weatherInfo:${coordinates.lat.toFixed(3)},${coordinates.lon.toFixed(3)}`;
        await setCached<WeatherInfo>(cacheKey, weatherInfo);
    }

    async getCurrentWeather(coordinates: Coordinates): Promise<Current | null> {
        const cacheKey = `currentWeather:${coordinates.lat.toFixed(3)},${coordinates.lon.toFixed(3)}`;
        return await getCached<Current>(cacheKey);
    }  

    async storageCurrentWeather(coordinates: Coordinates, weatherInfo: Current): Promise<void> {
        const cacheKey = `currentWeather:${coordinates.lat.toFixed(3)},${coordinates.lon.toFixed(3)}`;
        await setCached<Current>(cacheKey, weatherInfo);
    }
}