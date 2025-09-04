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
  precipitation: number[];
  precipitation_probability: number[];
  weather_code: number[];
};

export type Hour = {
  dateTime: number;
  tempC: number;
  humidity: number;
  windSpeedKmh: number;
  precipitationMm: number;
  precipitationProb: number;
  weather_desc: string;
  icon: string;
};

export type Day = {
  date: string;
  minC: number;
  maxC: number;
  icon: string;
  hours: Hour[];
};

export type WeatherInfo = {
  current: Current;
  hours: Hour[];
  days: Day[];
};
