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
    const { storageService } = deps;

    // Fetch weather data when lat/lon changes
    useEffect(() => { fetchWeather() }, [coordinates]);


    // Fetch favourite and saved status when coordinates change
    useEffect(() => {
        let cancelled = false;
        (async () => {
        try {
            const fav = await storageService.loadFavouriteLocation();
            if (!cancelled) {
                setIsFavourite(fav.coordinates.lat === coordinates.lat && fav.coordinates.lon === coordinates.lon);
            }
            const saved = await storageService.loadSavedLocations();
            if (!cancelled) {
                setIsSaved(
                    saved.some(l => l.coordinates.lat === coordinates.lat && l.coordinates.lon === coordinates.lon)
                );
            }
        } catch(err) {
            console.log("Failed to get weather from location:", err);
        }
        })();
        return () => { cancelled = true; };
    }, [coordinates, storageService]);



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


    const toggleFavourite = useCallback(async () => {
        const location = { coordinates, name: locationName ?? "Unknown" };
        try {
            if (!isFavourite) {
                const res = await storageService.removeFavouriteLocation(location);
                if (res.success) setIsFavourite(false);
            } else {
                const res = await storageService.storeFavouriteLocation(location);
                if (res.success) setIsFavourite(true);
            }
        } catch (e) {
            console.log("toggleFavourite failed:", e);
        }
    }, [isFavourite, locationName, coordinates, storageService]);


    const toggleSaved = useCallback(async () => {
        const location = { coordinates, name: locationName ?? "Unknown" };
        try {
            if (isSaved) {
                const res = await storageService.removeSaveLocation(location);
                if (res.success) setIsSaved(false);
            } else {
                const res = await storageService.storeSavedLocation(location);
                if (res.success) setIsSaved(true);
            }
        } catch (e) {
            console.log("toggleSaved failed:", e);
        }
    }, [isSaved, locationName, coordinates, storageService]);

    
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
