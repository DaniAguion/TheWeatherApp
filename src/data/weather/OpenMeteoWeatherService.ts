import type { WeatherService } from "../../domain/ports/WeatherService";
import { OpenMeteoResponse }  from "./dto";
import { getCached, setCached } from "../storage/cache";
import { WeatherInfo, Current, Hour, Day } from "../../domain/entities/WeatherEntities";
import type { Coordinates } from "../../domain/entities/LocationEntities";
import { currentDtoToEntity, hourlyDtoToEntity, dailyDtoToEntity } from "./mappers";
import { Result } from "../../domain/errors/Result";
import { DataError } from "../../domain/errors/DataError";


export class OpenMeteoWeatherService implements WeatherService {

  async getWeather({ lat, lon }: Coordinates): Promise<Result<WeatherInfo>> {
    // Check cache first
    const ttl = 10 * 60 * 1000; // Weather data valid for 10 min
    const cacheKey = `openmeteo:${lat.toFixed(3)},${lon.toFixed(3)}`;
    const cached = await getCached<WeatherInfo>(cacheKey, ttl);
    if (cached) return { success: true, value: cached };

    // Fetch from API if not in cache or expired
    try {
      const base = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto`;
      const url = base + currentOptions + hourlyOptions + dailyOptions;
      const response = await fetch(url);
      if (!response) return {success:false, error: DataError.network(new Error("No response from geolocation server"))};
      if (!response.ok) return {success:false, error: DataError.http(response.status)};

      
      const data = (await response.json()) as OpenMeteoResponse;
      const current: Current = currentDtoToEntity(data.current);
      const hours: Hour[] = hourlyDtoToEntity(data.hourly);
      const days: Day[] = dailyDtoToEntity(data.daily);

      try {
        await setCached(cacheKey, {
          current: current,
          hours: hours,
          days: days
        });
      } catch (error) {
        console.warn("Failed to cache weather data:", error);
      }
      return { success: true, value: { current, hours, days }};

    } catch (error) {
      return { success:false, error: DataError.unknown(error)};
    }
  }
}

// Parameters to request from Open-Meteo API
const params = {
  "current": [
    "temperature_2m", 
    "relative_humidity_2m", 
    "is_day",
    "wind_speed_10m", 
    "precipitation", 
    "weather_code"
  ],
  "hourly": [
    "temperature_2m",
    "relative_humidity_2m", 
    "wind_speed_10m",
    "uv_index",
    "precipitation",
    "precipitation_probability",
    "weather_code"
  ],
  "daily": [
    "temperature_2m_max", 
    "temperature_2m_min",
    "wind_speed_10m_max",
    "uv_index_max",
    "sunrise",
    "sunset",
    "precipitation_sum",
    "precipitation_probability_max",
    "cloud_cover_mean",
    "weather_code"
  ],
};

// Querry parameters for Open-Meteo API
const currentOptions = `&current=${params.current.join(",")}`;
const hourlyOptions = `&hourly=${params.hourly.join(",")}`;
const dailyOptions = `&daily=${params.daily.join(",")}`;