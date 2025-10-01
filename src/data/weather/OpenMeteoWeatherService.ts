import type { WeatherService } from "../../domain/ports/WeatherService";
import { OpenMeteoResponse, OpenMeteoGeocodingResponse }  from "./dto";
import { getCached, setCached } from "../storage/cache";
import { WeatherInfo, Current, Hour, Day } from "../../domain/entities/WeatherEntities";
import type { Coordinates, Location } from "../../domain/entities/LocationEntities";
import { currentDtoToEntity, hourlyDtoToEntity, dailyDtoToEntity, locationSuggestionDtoToEntity } from "./mappers";
import type { Result } from "../../domain/errors/Result";
import { DomainError } from "../../domain/errors/DomainError";


export class OpenMeteoWeatherService implements WeatherService {

  async getWeather({ lat, lon }: Coordinates): Promise<Result<WeatherInfo>> {
    // Check cache first
    const cacheKey = `weatherInfo:${lat.toFixed(3)},${lon.toFixed(3)}`;
    const cached = await getCached<WeatherInfo>(cacheKey);
    if (cached) return { success: true, value: cached };

    // Fetch from API if not in cache or expired
    try {
      const baseUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto`;
      const apiRequestUrl = baseUrl + currentOptions + hourlyOptions + dailyOptions;
      const response = await fetch(apiRequestUrl);
      if (!response) return {success:false, error: DomainError.network(new Error("No response from weather service."))};
      if (!response.ok) return {success:false, error: DomainError.network(new Error("Error http: " + response.status))};

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

    } catch (e) {
      console.error("[OpenMeteoWeatherService] Error fetching weather data.", e);
      return { success:false, error: DomainError.unknown(e)};
    }
  }



  // Fetch only current weather data for preview purposes
  async getCurrentWeather({ lat, lon }: Coordinates): Promise<Result<Current>> {
    // Check cache first
    const cacheKey = `weatherInfo:preview:${lat.toFixed(3)},${lon.toFixed(3)}`;
    const cached = await getCached<Current>(cacheKey);
    if (cached) return { success: true, value: cached };

    // Fetch from API if not in cache or expired
    try {
      const baseUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto`;
      const apiRequestUrl = baseUrl + currentOptions;
      const response = await fetch(apiRequestUrl);
      if (!response) return {success:false, error: DomainError.network(new Error("No response from weather service."))};
      if (!response.ok) return {success:false, error: DomainError.network(new Error("Error http: " + response.status))};

      const data = (await response.json()) as OpenMeteoResponse;
      const current: Current = currentDtoToEntity(data.current);

      try {
        await setCached(cacheKey, current);
      } catch (error) {
        console.warn("Failed to cache weather data:", error);
      }
      return { success: true, value: current};

    } catch (e) {
      console.error("[OpenMeteoWeatherService] Error fetching weather data.", e);
      return { success:false, error: DomainError.unknown(e)};
    }
  }



  // Search for locations using Open-Meteo Geocoding API
  async searchLocations(query: string): Promise<Result<Location[]>> {
    const trimmed = query.trim();
    if (!trimmed) return { success: true, value: [] };

    const url = `https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(trimmed)}&count=10&language=es&format=json`;

    try {
      const response = await fetch(url);
      if (!response) return {success:false, error: DomainError.network(new Error("No response from locations service."))};
      if (!response.ok) return {success:false, error: DomainError.network(new Error("Error http: " + response.status))};

      const data = (await response.json()) as OpenMeteoGeocodingResponse;
 
      if (data.results === undefined) return { success: true, value: [] };
      if (!Array.isArray(data.results)) return { success: false, error: DomainError.invalidData(new Error("Malformed geocoding response")) };

      const locations: Location[] = data.results
        .filter(entry => entry != null)
        .map(locationSuggestionDtoToEntity);

      return { success: true, value: locations };
    } catch (e) {
      console.error("[OpenMeteoWeatherService] Error fetching locations.", e);
      return { success:false, error: DomainError.unknown(e)};
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
