import type { IWeatherService } from "../../domain/ports";
import { OpenMeteoResponse }  from "./dto";
import { getCached, setCached } from "../localStorage/cache";
import { WeatherInfo, Current, Hour, Day } from "../../domain/entities";
import { currentDtoToEntity, hourlyDtoToEntity, dailyDtoToEntity } from "./mappers";


export class WeatherService implements IWeatherService {
  constructor(private baseUrl = "https://api.open-meteo.com/v1/forecast") {}

  async getWeather({ lat, lon }: { lat: number; lon: number }): Promise<WeatherInfo> {
    // Check cache first
    const ttl = 20 * 60 * 1000; // 20 min
    const cacheKey = `openmeteo:${lat.toFixed(3)},${lon.toFixed(3)}`;
    const cached = await getCached<WeatherInfo>(cacheKey, ttl);
    if (cached) return cached;

    // Fetch from API if not in cache or expired
    const base = `${this.baseUrl}?latitude=${lat}&longitude=${lon}&timezone=auto`;
    const url = base + currentOptions + hourlyOptions + dailyOptions;
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const data = (await response.json()) as OpenMeteoResponse;

    const current: Current = currentDtoToEntity(data.current);
    const hours: Hour[] = hourlyDtoToEntity(data.hourly);
    const days: Day[] = dailyDtoToEntity(data.daily);

    return { current, hours, days };
  }
}

// Function to fetch only the current weather data
export async function fetchCurrentWeather(lat: number, lon: number): Promise<Current> {
  const basicUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto`;
  const url = basicUrl + currentOptions;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = (await response.json()) as OpenMeteoResponse;

  return currentDtoToEntity(data.current);
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