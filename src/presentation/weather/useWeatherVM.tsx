import { useEffect, useState, useMemo, useCallback } from "react";
import { WeatherService } from "../../domain/ports/WeatherService";
import { ReverseGeoService } from "../../domain/ports/ReverseGeoService";
import { StorageService } from "../../domain/ports/StorageService";
import type { Current, Hour, Day } from "../../domain/entities/WeatherEntities";
import type { Coordinates } from "../../domain/entities/LocationEntities";
import { toUIErrorMessage } from "../errorMessages";

export type UseWeatherVMDeps = {
    weatherService: WeatherService;
    reverseGeoService: ReverseGeoService;
    storageService: StorageService;
};

type VMState = {
    loading: boolean;
    error: string | null;
    locationName: string | null;
    current: Current | null;
    next24h: Hour[] | null;
    next72h: Hour[] | null;
    days: Day[] | null;
    isFavourite: boolean;
    isSaved: boolean;
};

type VMFunctions = {
    fetchWeather: () => void;
    toggleFavourite: () => void;
    toggleSaved: () => void;
};

export function useWeatherVM(
    coordinates: Coordinates,
    deps: UseWeatherVMDeps,
    routeLocationName?: string,
) : VMState & VMFunctions {
    const { weatherService, reverseGeoService } = deps;
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [locationName, setLocationName] = useState<string | null>(routeLocationName ?? null);
    const [current, setCurrent] = useState<Current | null>(null);
    const [hours, setHours] = useState<Hour[] | null>(null);
    const [days, setDays] = useState<Day[] | null>(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [isSaved, setIsSaved] = useState(false);

    // Fetch weather data when lat/lon changes
    useEffect(() => { fetchWeather() }, [coordinates]);

    // Function to fetch location and weather data
    const fetchWeather = useCallback(async () => {
        setLoading(true);
        setError(null);
        if (routeLocationName) {
            setLocationName(routeLocationName);
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
    }, [coordinates, routeLocationName]);


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


    //
    // TO DO: Implement favourite and saved logic
    //
    const toggleFavourite = useCallback(() => {
        // Placeholder
        const newValue = !isFavourite;
        setIsFavourite(newValue);
    }, [, ]);

    const toggleSaved = useCallback(() => {
        // Placeholder
        const newValue = !isSaved;
        setIsSaved(newValue);
    }, [, ]);



    
    return { 
        loading, 
        error, 
        locationName, 
        current, 
        next24h, 
        next72h, 
        days, 
        isFavourite,
        isSaved,
        fetchWeather,
        toggleFavourite,
        toggleSaved
    };
}
