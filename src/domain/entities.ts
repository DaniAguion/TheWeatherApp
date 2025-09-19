export type Current = {
  dateTime: number;
  tempC: number;
  humidity: number;
  windSpeedKmh: number;
  precipitationMm: number;
  weather_desc: string;
  icon: string;
};


export type Hour = {
  dateTime: number;
  tempC: number;
  humidity: number;
  windSpeedKmh: number;
  uvIndex: number;
  precipitationMm: number;
  precipitationProb: number;
  weather_desc: string;
  icon: string;
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

export type Location = {
  name?: string;
  lat: number;
  lon: number;
};