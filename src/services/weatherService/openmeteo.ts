import { WeatherInfo as WeatherInfo } from "./types";
import { Current, CurrentDto }  from "./types";
import { Hour, HourlyDto }  from "./types";
import { Day, DailyDto }  from "./types";
import { currentDtoToEntity, hourlyDtoToEntity, dailyDtoToEntity } from "./mappers";


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

// Type for the complete response from Open-Meteo API
type OpenMeteoResponse = {
  current: CurrentDto;
  hourly: HourlyDto;
  daily: DailyDto;
};


// Function to fetch all weather data: current, hourly and daily
export async function fetchAllWeatherInfo(lat: number, lon: number): Promise<WeatherInfo> {
  const basicUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto`;
  const url = basicUrl + currentOptions + hourlyOptions + dailyOptions;
  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = (await response.json()) as OpenMeteoResponse;

  const current: Current = currentDtoToEntity(data.current);
  const hours: Hour[] = hourlyDtoToEntity(data.hourly);
  const days: Day[] = dailyDtoToEntity(data.daily);

  return { current, hours, days };
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