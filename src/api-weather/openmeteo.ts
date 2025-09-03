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
  if (code === 1) return "🌤️"; // Mainly clear
  if (code === 2) return "🌤️"; // Partly cloudy
  if (code === 3) return "☁️"; // Cloudy
  if (code === 45) return "🌫️"; // Foggy
  if (code === 48) return "🌫️"; // Rime Fog
  if (code === 51) return "🌦️"; // Light Drizzle
  if (code === 53) return "🌦️"; // Drizzle
  if (code === 55) return "🌦️"; // Heavy Drizzle
  if (code === 56) return "🌧️"; // Light Freezing Drizzle
  if (code === 57) return "🌧️"; // Freezing Drizzle
  if (code === 61) return "🌧️"; // Light Rain
  if (code === 63) return "🌧️"; // Rain
  if (code === 65) return "🌧️"; // Heavy Rain
  if (code === 66) return "🌨️"; // Light Freezing Rain
  if (code === 67) return "🌨️"; // Freezing Rain
  if (code === 71) return "❄️"; // Light Snow
  if (code === 73) return "❄️"; // Snow
  if (code === 75) return "❄️"; // Heavy Snow
  if (code === 77) return "❄️"; // Snow Grains
  if (code === 80) return "🌧️"; // Light Showers
  if (code === 81) return "🌧️"; // Showers
  if (code === 82) return "🌧️"; // Heavy Showers
  if (code === 85) return "❄️"; // Light Snow Showers
  if (code === 86) return "❄️"; // Heavy Snow Showers
  if (code === 95) return "⛈️"; // Thunderstorm
  if (code === 96) return "⛈️"; // Thunderstorm with slight hail
  if (code === 99) return "⛈️"; // Thunderstorm with heavy hail
  return "🌡️";
};

const weatherCodeToDesc = (code: number): string => {
  if (code === 0) return "Cielo despejado";
  if (code === 1) return "Mayormente despejado";
  if (code === 2) return "Parcialmente nublado";
  if (code === 3) return "Nublado";
  if (code === 45) return "Niebla";
  if (code === 48) return "Niebla con escarcha";
  if (code === 51) return "Llovizna ligera";
  if (code === 53) return "Llovizna";
  if (code === 55) return "Llovizna intensa";
  if (code === 56) return "Llovizna helada ligera";
  if (code === 57) return "Llovizna helada";
  if (code === 61) return "Lluvia ligera";
  if (code === 63) return "Lluvia";
  if (code === 65) return "Lluvia intensa";
  if (code === 66) return "Lluvia helada ligera";
  if (code === 67) return "Lluvia helada";
  if (code === 71) return "Nieve ligera";
  if (code === 73) return "Nieve";
  if (code === 75) return "Nieve intensa";
  if (code === 77) return "Granos de nieve";
  if (code === 80) return "Chubascos ligeros";
  if (code === 81) return "Chubascos";
  if (code === 82) return "Chubascos intensos";
  if (code === 85) return "Chubascos de nieve ligera";
  if (code === 86) return "Chubascos de nieve intensa";
  if (code === 95) return "Tormenta";
  if (code === 96) return "Tormenta con granizo leve";
  if (code === 99) return "Tormenta con granizo fuerte";
  return "Desconocido";
};


export async function fetchWeatherPack(lat: number, lon: number): Promise<WeatherPack> {
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


  const current: Current = currentDtoToEntity(
    data.current, 
    weatherCodeToDesc(data.current.weather_code),
    weatherCodeToIcon(data.current.weather_code)
  );


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