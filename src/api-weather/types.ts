export type Current = {
  dt: number;
  tempC: number;
  windKmh: number;
  humidity?: number;
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
