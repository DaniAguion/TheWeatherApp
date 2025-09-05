import type {Current, CurrentDto} from "./types";
import type { Hour, HourlyDto } from "./types";
import type { Day, DailyDto } from "./types";
import { weatherCodeToDesc, weatherCodeToIcon } from "./weatherCodeMapper";


// Function to convert CurrentDto to Current entity
export function currentDtoToEntity(dto: CurrentDto): Current {
  return {
    dateTime: Date.parse(dto.time),
    tempC: dto.temperature_2m,
    humidity: dto.relative_humidity_2m,
    windSpeedKmh: dto.wind_speed_10m,
    precipitationMm: dto.precipitation,
    weather_desc: weatherCodeToDesc(dto.weather_code),
    icon: weatherCodeToIcon(dto.weather_code),
  };
}


// Function to convert HourlyDto to an array of Hour entities
export function hourlyDtoToEntity(dto: HourlyDto): Hour[] {
    const length = Math.min(
    dto.time.length,
    dto.temperature_2m.length,
    dto.relative_humidity_2m.length,
    dto.wind_speed_10m.length,
    dto.precipitation.length,
    dto.precipitation_probability.length,
    dto.weather_code.length
  );
  
  return dto.time.slice(0, length).map((t, i) => ({
    dateTime: new Date(t).getTime(),
    tempC: dto.temperature_2m?.[i] ?? null,
    humidity: dto.relative_humidity_2m?.[i] ?? null,
    windSpeedKmh: dto.wind_speed_10m?.[i] ?? null,
    precipitationMm: dto.precipitation?.[i] ?? null,
    precipitationProb: dto.precipitation_probability?.[i] ?? null,
    weather_desc: weatherCodeToDesc(dto.weather_code?.[i]) || "Desconocido",
    icon: weatherCodeToIcon(dto.weather_code?.[i]) || "❓"
  }));
}


  // Function to convert DailyDto to an array of Days entities
export function dailyDtoToEntity(dto: DailyDto): Day[] {
    const length = Math.min(
    dto.time.length,
    dto.temperature_2m_max.length,
    dto.temperature_2m_min.length,
    dto.wind_speed_10m_max.length,
    dto.uv_index_max.length,
    dto.sunrise.length,
    dto.sunset.length,
    dto.precipitation_sum.length,
    dto.precipitation_probability_max.length,
    dto.weather_code.length
  );

  return dto.time.slice(0, length).map((t, i) => ({
    dateTime: new Date(t).getTime(),
    minC: dto.temperature_2m_min?.[i] ?? null,
    maxC: dto.temperature_2m_max?.[i] ?? null,
    windSpeedKmh: dto.wind_speed_10m_max?.[i] ?? null,
    uvIndex: dto.uv_index_max?.[i] ?? null,
    sunrise: new Date(dto.sunrise?.[i]).getTime(),
    sunset: new Date(dto.sunset?.[i]).getTime(),
    precipitationMm: dto.precipitation_sum?.[i] ?? null,
    precipitationProb: dto.precipitation_probability_max?.[i] ?? null,
    weather_desc: weatherCodeToDesc(dto.weather_code?.[i]) || "Desconocido",
    icon: weatherCodeToIcon(dto.weather_code?.[i]) || "❓"
  }));
}
