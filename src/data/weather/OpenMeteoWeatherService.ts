import type { WeatherService } from "../../domain/interfaces/WeatherService";
import { OpenMeteoResponse }  from "./dto";
import { WeatherInfo, Current, Hour, Day } from "../../domain/entities/WeatherEntities";
import type { Coordinates } from "../../domain/entities/LocationEntities";
import { currentDtoToEntity, hourlyDtoToEntity, dailyDtoToEntity, locationSuggestionDtoToEntity } from "./mappers";
import type { Result } from "../../domain/errors/Result";
import { DomainError } from "../../domain/errors/DomainError";


export class OpenMeteoWeatherService implements WeatherService {

  async getWeather({ lat, lon }: Coordinates): Promise<Result<WeatherInfo>> {
    try {
      const baseUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto`;
      const apiRequestUrl = baseUrl + currentOptions + hourlyOptions + dailyOptions;
      const response = await fetch(apiRequestUrl);
      if (!response) return {success:false, error: DomainError.network(new Error("No response from weather service."))};
      if (!response.ok) return {success:false, error: DomainError.network(new Error("Error http: " + response.status))};

      const data = (await response.json()) as OpenMeteoResponse;
      if (!data.current || !data.hourly || !data.daily) {
        return {success:false, error: DomainError.invalidData(new Error("Malformed weather response"))};
      }
      const current: Current = currentDtoToEntity(data.current);
      const hours: Hour[] = hourlyDtoToEntity(data.hourly);
      const days: Day[] = dailyDtoToEntity(data.daily);
      return { success: true, value: { current, hours, days }};
    } catch (e) {
      console.error("[OpenMeteoWeatherService] Error fetching weather data.", e);
      return { success:false, error: DomainError.unknown(e)};
    }
  }

  // Fetch only current weather data for preview purposes
  async getCurrentWeather({ lat, lon }: Coordinates): Promise<Result<Current>> {
    try {
      const baseUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto`;
      const apiRequestUrl = baseUrl + currentOptions;
      const response = await fetch(apiRequestUrl);
      if (!response) return {success:false, error: DomainError.network(new Error("No response from weather service."))};
      if (!response.ok) return {success:false, error: DomainError.network(new Error("Error http: " + response.status))};

      const data = (await response.json()) as OpenMeteoResponse;
      if (!data.current) return {success:false, error: DomainError.invalidData(new Error("Malformed weather response"))};
      return { success: true, value: currentDtoToEntity(data.current)};

    } catch (e) {
      console.error("[OpenMeteoWeatherService] Error fetching weather data.", e);
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
