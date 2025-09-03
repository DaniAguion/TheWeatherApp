import {Current, CurrentDto} from "./types";

export function currentDtoToEntity(dto: CurrentDto, weatherDesc: string, icon: string): Current {
  return {
    dateTime: Date.parse(dto.time) / 1000,
    tempC: dto.temperature_2m,
    humidity: dto.relative_humidity_2m,
    apparentTempC: dto.apparent_temperature,
    isDay: dto.is_day,
    windSpeedKmh: dto.wind_speed_10m,
    windDirDeg: dto.wind_direction_10m,
    precipitationMm: dto.precipitation,
    rainMm: dto.rain,
    weather_desc: weatherDesc,
    icon: icon,
    cloudCoverPerc: dto.cloud_cover,
  };
}