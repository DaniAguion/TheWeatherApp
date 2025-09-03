import { WeatherInfo as WeatherInfo, Day } from "./types";
import { Current, CurrentDto }  from "./types";
import { Hour, HourlyDto }  from "./types";
import { currentDtoToEntity, hourlyDtoToEntity } from "./mappers";

type OpenMeteoResponse = {
  current: CurrentDto;
  hourly: HourlyDto;
  daily: {
    time: string[];
    temperature_2m_max: number[];
    temperature_2m_min: number[];
    weather_code: number[];
  };
};



export async function fetchWeatherInfo(lat: number, lon: number): Promise<WeatherInfo> {
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
      "relative_humidity_2m", 
      "wind_speed_10m",
      "precipitation",
      "precipitation_probability", 
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


  const current: Current = currentDtoToEntity(data.current);
  const hours: Hour[] = hourlyDtoToEntity(data.hourly);

  
  const days: Day[] = data.daily.time.map((d, i) => {
    const date = d;
    const dailyHours = hours.filter(
      (h) => new Date(h.dateTime * 1000).toISOString().slice(0, 10) === date
    );
    return {
      date,
      minC: data.daily.temperature_2m_min[i],
      maxC: data.daily.temperature_2m_max[i],
      icon: "",
      hours: dailyHours,
    };
  });

  return { current, days };
}