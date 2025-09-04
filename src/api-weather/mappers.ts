import {Current, CurrentDto} from "./types";
import { Hour, HourlyDto } from "./types";
import { weatherCodeToDesc, weatherCodeToIcon } from "./weatherCodeMapper";

export function currentDtoToEntity(dto: CurrentDto): Current {
  return {
    dateTime: Date.parse(dto.time) / 1000,
    tempC: dto.temperature_2m,
    humidity: dto.relative_humidity_2m,
    windSpeedKmh: dto.wind_speed_10m,
    precipitationMm: dto.precipitation,
    weather_desc: weatherCodeToDesc(dto.weather_code),
    icon: weatherCodeToIcon(dto.weather_code),
  };
}


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

  console.log("Length of hourly data arrays:", length);
  console.log("Sample dateTime values:", dto.time);

  return dto.time.slice(0, length).map((t, i) => ({
    dateTime: new Date(t).getTime() / 1000,
    tempC: dto.temperature_2m?.[i] ?? null,
    humidity: dto.relative_humidity_2m?.[i] ?? null,
    windSpeedKmh: dto.wind_speed_10m?.[i] ?? null,
    precipitationMm: dto.precipitation?.[i] ?? null,
    precipitationProb: dto.precipitation_probability?.[i] ?? null,
    weather_desc: weatherCodeToDesc(dto.weather_code?.[i]) || "Desconocido",
    icon: weatherCodeToIcon(dto.weather_code?.[i]) || "❓"
  }));
}