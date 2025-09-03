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
  isDay: boolean;
  windSpeedKmh: number;
  precipitationMm: number;
  weather_desc: string;
  icon: string;
};

export type Hour = {
  dt: number;
  tempC: number;
  icon: string;
};

export type Day = {
  date: string;
  minC: number;
  maxC: number;
  icon: string;
  hours: Hour[];
};

export type WeatherPack = {
  current: Current;
  days: Day[];
};
