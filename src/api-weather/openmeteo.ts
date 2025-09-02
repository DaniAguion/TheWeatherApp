import { WeatherPack, Current, Day, Hour } from "./types";

type OpenMeteoResponse = {
  current: {
    time: string;
    temperature_2m: number;
    wind_speed_10m: number;
  };
  hourly: {
    time: string[];
    temperature_2m: number[];
    weathercode: number[];
  };
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weathercode: number[];
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
  const url = `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,wind_speed_10m&hourly=temperature_2m,weathercode&daily=temperature_2m_max,temperature_2m_min,weathercode&timezone=auto`;

  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = (await res.json()) as OpenMeteoResponse;


  const current: Current = {
    dt: Date.parse(data.current.time) / 1000,
    tempC: data.current.temperature_2m,
    windKmh: data.current.wind_speed_10m,
    icon: weatherCodeToIcon(data.hourly.weathercode[0]),
  };

 
  const hours: Hour[] = data.hourly.time.map((t, i) => ({
    dt: Date.parse(t) / 1000,
    tempC: data.hourly.temperature_2m[i],
    icon: weatherCodeToIcon(data.hourly.weathercode[i]),
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
      icon: weatherCodeToIcon(data.daily.weathercode[i]),
      hours: dailyHours,
    };
  });

  return { current, days };
}