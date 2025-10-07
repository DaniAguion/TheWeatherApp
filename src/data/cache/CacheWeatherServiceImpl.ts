import type { CacheWeatherService } from "../../domain/interfaces/CacheWeatherService";
import { getCached, setCached } from "../cache/cache";
import type { Coordinates } from "../../domain/entities/LocationEntities";
import type { WeatherInfo, Current } from "../../domain/entities/WeatherEntities";


export class CacheWeatherServiceImpl implements CacheWeatherService {
    async getWeatherInfo(coordinates: Coordinates): Promise<WeatherInfo | null> {
        const cacheKey = `weatherInfo:${coordinates.lat},${coordinates.lon}`;
        return await getCached<WeatherInfo>(cacheKey);
    }  

    async storageWeatherInfo(coordinates: Coordinates, weatherInfo: WeatherInfo): Promise<void> {
        const cacheKey = `weatherInfo:${coordinates.lat},${coordinates.lon}`;
        await setCached<WeatherInfo>(cacheKey, weatherInfo);
    }

    async getCurrentWeather(coordinates: Coordinates): Promise<Current | null> {
        const cacheKey = `currentWeather:${coordinates.lat},${coordinates.lon}`;
        return await getCached<Current>(cacheKey);
    }  

    async storageCurrentWeather(coordinates: Coordinates, weatherInfo: Current): Promise<void> {
        const cacheKey = `currentWeather:${coordinates.lat},${coordinates.lon}`;
        await setCached<Current>(cacheKey, weatherInfo);
    }

    async getLocationName(coordinates: Coordinates): Promise<string | null> {
        const cacheKey = `locationName:${coordinates.lat},${coordinates.lon}`;
        return await getCached<string>(cacheKey);
    }  

    async storageLocationName(coordinates: Coordinates, locationName: string): Promise<void> {
        const cacheKey = `locationName:${coordinates.lat},${coordinates.lon}`;
        await setCached<string>(cacheKey, locationName);
    }
}