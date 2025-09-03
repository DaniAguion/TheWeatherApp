export type CurrentDto = {
  time: string;
  interval: number;
  temperature_2m: number;
  relative_humidity_2m: number;
  apparent_temperature: number;
  is_day: boolean;
  wind_speed_10m: number;
  wind_direction_10m: number;
  precipitation: number;
  rain: number;
  weather_code: number;
  cloud_cover: number;
};


export type Current = {
  dateTime: number;
  tempC: number;
  humidity: number;
  apparentTempC: number;
  isDay: boolean;
  windSpeedKmh: number;
  windDirDeg: number;
  precipitationMm: number;
  rainMm: number;
  weather_desc: string;
  icon: string;
  cloudCoverPerc: number;
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
