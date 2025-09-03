import { WeatherPack, Current, CurrentDto, Day, Hour } from "./types";
import { currentDtoToEntity } from "./mappers";

type OpenMeteoResponse = {
  current: CurrentDto;
  hourly: {
    time: string[];
    temperature_2m: number[];
    weather_code: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
};

const weatherCodeToIcon = (code: number): string => {
  if (code === 0) return "☀️"; // Clear sky
  if ([1, 2].includes(code)) return "⛅"; // Mainly clear / partly cloudy
  if (code === 3) return "☁️"; // Overcast
  if (code >= 45 && code <= 48) return "🌫️"; // Fog
  if (code >= 51 && code <= 67) return "🌦️"; // Drizzle / Rain
  if (code >= 71 && code <= 77) return "❄️"; // Snow
  if (code >= 80 && code <= 82) return "🌧️"; // Showers
  if (code >= 95) return "⛈️"; // Thunderstorm
  return "🌡️";
};

export async function fetchWeatherPack(lat: number, lon: number): Promise<WeatherPack> {
    const params = {
    "current": [
      "temperature_2m", 
      "relative_humidity_2m", 
      "apparent_temperature", 
      "is_day", 
      "wind_speed_10m", 
      "wind_direction_10m", 
      "precipitation", 
      "rain", 
      "weather_code", 
      "cloud_cover"
    ],
    "hourly": [
      "temperature_2m", 
      "weather_code"
    ],
    "daily": [
      "temperature_2m_max", 
      "temperature_2m_min", 
      "weather_code"
    ],
  };


  const basicUrl = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&timezone=auto`;
  const currentOptions = `&current=${params.current.join(",")}`;
  const hourlyOptions = `&hourly=${params.hourly.join(",")}`;
  const dailyOptions = `&daily=${params.daily.join(",")}`;
  const url = basicUrl + hourlyOptions + currentOptions + dailyOptions;


  const response = await fetch(url);
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = (await response.json()) as OpenMeteoResponse;


  const current: Current = currentDtoToEntity(data.current, weatherCodeToIcon(data.current.weather_code));


  const hours: Hour[] = data.hourly.time.map((t, i) => ({
    dt: Date.parse(t) / 1000,
    tempC: data.hourly.temperature_2m[i],
    icon: weatherCodeToIcon(data.hourly.weather_code[i]),
  }));

  
  const days: Day[] = data.daily.time.map((d, i) => {
    const date = d;
    const dailyHours = hours.filter(
      (h) => new Date(h.dt * 1000).toISOString().slice(0, 10) === date
    );
    return {
      date,
      minC: data.daily.temperature_2m_min[i],
      maxC: data.daily.temperature_2m_max[i],
      icon: weatherCodeToIcon(data.daily.weather_code[i]),
      hours: dailyHours,
    };
  });

  return { current, days };
}