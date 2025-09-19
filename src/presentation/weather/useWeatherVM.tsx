import { useEffect, useState, useMemo, useCallback } from "react";
import { getWeather } from "../../data/weatherService/index";
import { getLocationName } from "../../data/locationService/fetchLocationName";
import type { Current, Hour, Day, WeatherInfo } from "../../domain/entities";

export function useWeatherVM(lat: number, lon: number, fallbackName?: string) {
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [locationName, setLocationName] = useState<string | null>(fallbackName ?? null);
    const [current, setCurrent] = useState<Current | null>(null);
    const [hours, setHours] = useState<Hour[] | null>(null);
    const [days, setDays] = useState<Day[] | null>(null);

    // Fetch weather data when lat/lon changes
    useEffect(() => { fetchData() }, [lat, lon]);

    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const [locationName, weatherData] = await Promise.all([
                getLocationName(lat, lon).catch(() => null),
                getWeather(lat, lon),
            ]);
            setLocationName(locationName ?? fallbackName ?? null);
            setCurrent(weatherData.current);
            setHours(weatherData.hours ?? []);
            setDays(weatherData.days ?? []);
        } catch (e: any) {
            setError(e?.message ?? "Error cargando el clima");
        } finally {
            setLoading(false);
        }
    }, [lat, lon, fallbackName]);

    const next24h = useMemo<Hour[]>(() => {
        if (!current || !hours) return [];
        const now = current.dateTime;
        const in24h = now + 24 * 3600_000;
        return hours.filter(h => h.dateTime > now && h.dateTime < in24h);
    }, [current, hours]);

    const next72h = useMemo<Hour[]>(() => {
        if (!current || !hours) return [];
        const now = current.dateTime;
        const in72h = now + 72 * 3600_000;
        return hours.filter(h => h.dateTime > now && h.dateTime < in72h);
    }, [current, hours]);

    return { loading, error, locationName, current, next24h, next72h, days, refetch: fetchData };
}