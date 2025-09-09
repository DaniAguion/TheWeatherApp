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

export type Current = {
  dateTime: number;
  tempC: number;
  humidity: number;
  windSpeedKmh: number;
  precipitationMm: number;
  weather_desc: string;
  icon: string;
};


// Types for the hourly forecast data from Open-Meteo API
export type HourlyDto = {
  time: string[];
  temperature_2m: number[];
  relative_humidity_2m: number[];
  wind_speed_10m: number[];
  uv_index: number[];
  precipitation: number[];
  precipitation_probability: number[];
  weather_code: number[];
};

export type Hour = {
  dateTime: number;
  tempC: number;
  humidity: number;
  windSpeedKmh: number;
  uv_index: number;
  precipitationMm: number;
  precipitationProb: number;
  weather_desc: string;
  icon: string;
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


export type Day = {
  dateTime: number;
  minC: number;
  maxC: number;
  windSpeedKmh: number;
  uvIndex: number;
  sunrise: number;
  sunset: number;
  precipitationMm: number;
  precipitationProb: number;
  cloudCover: number;
  weather_desc: string;
  icon: string;
};

// Combined type for all weather information
export type WeatherInfo = {
  current: Current;
  hours: Hour[];
  days: Day[];
};
