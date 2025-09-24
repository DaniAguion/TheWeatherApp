import { useEffect, useState, useMemo, useCallback } from "react";
import { WeatherService } from "../../domain/ports/WeatherService";
import { ReverseGeoService } from "../../domain/ports/ReverseGeoService";
import type { Current, Hour, Day } from "../../domain/entities/WeatherEntities";
import type { Coordinates } from "../../domain/entities/LocationEntities";
import { toUIErrorMessage } from "../errorMessages";

export type UseWeatherVMDeps = {
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
        if (fallbackName) {
                setLocationName(fallbackName);
        } else {
            await reverseGeoService.getLocationName(coordinates).then(result => {
                if (result.success) {
                    setLocationName(result.value);
                } else {
                    setLocationName("")
                }
            });
        };
        await weatherService.getWeather(coordinates).then(result => {
            if (result.success) {
                    setCurrent(result.value.current);
                    setHours(result.value.hours ?? []);
                    setDays(result.value.days ?? []);
            } else {
                console.log("Failed to get weather from location:", result.error);
                setError(toUIErrorMessage(result.error));
            }
        });
        setLoading(false);
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
