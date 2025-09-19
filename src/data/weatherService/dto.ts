// Types for current weather and forecast data from Open-Meteo API
export type CurrentDto = {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  is_day: boolean;
  wind_speed_10m: number;
  precipitation: number;
  weather_code: number;
};


// Types for the hourly forecast data from Open-Meteo API
export type HourlyDto = {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  is_day: boolean[];
  wind_speed_10m: number[];
  uv_index: number[];
  precipitation: number[];
  precipitation_probability: number[];
  weather_code: number[];
};



// Types for the daily forecast data from Open-Meteo API
export type DailyDto = {
  time: string[];
  temperature_2m_max: number[];
  temperature_2m_min: number[];
  wind_speed_10m_max: number[];
  uv_index_max: number[];
  sunrise: string[];
  sunset: string[];
  precipitation_sum: number[];
  precipitation_probability_max: number[];
  cloud_cover_mean: number[];
  weather_code: number[];
};


