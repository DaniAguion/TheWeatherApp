import { useEffect, useState, useMemo, useCallback } from "react";
import { WeatherService } from "../../domain/ports/WeatherService";
import { ReverseGeoService } from "../../domain/ports/ReverseGeoService";
import type { Current, Hour, Day, Coordinates } from "../../domain/entities";

type UseWeatherVMDeps = {
    weatherService: WeatherService;
    reverseGeoService:  ReverseGeoService;
};

export function useWeatherVM(
    coordinates: Coordinates,
    deps: UseWeatherVMDeps,
    fallbackName?: string,
) {
    const { weatherService, reverseGeoService } = deps;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [locationName, setLocationName] = useState<string | null>(fallbackName ?? null);
    const [current, setCurrent] = useState<Current | null>(null);
    const [hours, setHours] = useState<Hour[] | null>(null);
    const [days, setDays] = useState<Day[] | null>(null);

    // Fetch weather data when lat/lon changes
    useEffect(() => { fetchData() }, [coordinates]);

    // Function to fetch location and weather data
    const fetchData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const locationName = fallbackName ?? await reverseGeoService.getLocationName(coordinates);
            const weatherData = await weatherService.getWeather(coordinates);
            setLocationName(locationName);
            setCurrent(weatherData.current);
            setHours(weatherData.hours ?? []);
            setDays(weatherData.days ?? []);
        } catch (e: any) {
            setError(e?.message ?? "Error cargando el clima");
        } finally {
            setLoading(false);
        }
    }, [coordinates, fallbackName]);


    // Memorized next 24h and 72h forecasts
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

    return { 
        loading, 
        error, 
        locationName, 
        current, 
        next24h, 
        next72h, 
        days, 
        refetch: fetchData };
}