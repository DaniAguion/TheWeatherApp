import { useEffect, useState, useMemo, useCallback, use } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { GetWeatherUseCase } from "../../domain/usecases/GetWeatherUseCase";
import { GetLocationNameUseCase } from "../../domain/usecases/GetLocationNameUseCase";
import { GetLocationStatusUseCase } from "../../domain/usecases/GetLocationStatusUseCase";
import { ToggleFavouriteUseCase } from "../../domain/usecases/ToggleFavouriteUseCase";
import { ToggleSavedUseCase } from "../../domain/usecases/ToggleSavedUseCase";
import type { Current, Hour, Day } from "../../domain/entities/WeatherEntities";
import type { Coordinates } from "../../domain/entities/LocationEntities";
import { DomainError } from "../../domain/errors/DomainError";
import type { Location } from "../../domain/entities/LocationEntities";


export type UseWeatherVMDeps = {
    getWeatherUseCase: GetWeatherUseCase;
    getLocationNameUseCase: GetLocationNameUseCase;
    getLocationStatusUseCase: GetLocationStatusUseCase;
    toggleFavouriteUseCase: ToggleFavouriteUseCase;
    toggleSavedUseCase: ToggleSavedUseCase;
};

type VMState = {
    loading: boolean;
    error: DomainError | null;
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
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<DomainError | null>(null);
    const [locationName, setLocationName] = useState<string | null>(routeLocationName ?? null);
    const [current, setCurrent] = useState<Current | null>(null);
    const [hours, setHours] = useState<Hour[] | null>(null);
    const [days, setDays] = useState<Day[] | null>(null);
    const [isFavourite, setIsFavourite] = useState(false);
    const [isSaved, setIsSaved] = useState(false);
    const { 
        getWeatherUseCase,
        getLocationNameUseCase,
        getLocationStatusUseCase,
        toggleFavouriteUseCase,
        toggleSavedUseCase
     } = deps;

    // Fetch weather data when lat/lon changes
    useEffect(() => { fetchWeather()}, [coordinates]);


    // Fetch favourite and saved status
    const refreshPersistedStatus = async () => {
        try {
            const location = { coordinates, name: locationName ?? "Unknown" } as Location;
            const getStatusResult = await getLocationStatusUseCase.execute(location);
            if (getStatusResult.success) {
                setIsFavourite(getStatusResult.value.isFavourite);
                setIsSaved(getStatusResult.value.isSaved);
            } else {
                setError(getStatusResult.error);
            }
        } catch (err) {
            console.log("Failed to refresh persisted status:", err);
        }
    };


    // Refresh persisted status when screen is focused
    useFocusEffect(
        useCallback(() => {
            refreshPersistedStatus();
        }, [refreshPersistedStatus])
    );


    // Function to fetch location and weather data
    const fetchWeather = useCallback(async () => {
        setLoading(true);
        setError(null);
        if (routeLocationName) {
            setLocationName(routeLocationName);
        } else {
            const locationName = await getLocationNameUseCase.execute({coordinates} as Location);
            setLocationName(locationName);
        }
        await getWeatherUseCase.execute({coordinates} as Location).then(result => {
            if (result.success) {
                setCurrent(result.value.current);
                setHours(result.value.hours ?? []);
                setDays(result.value.days ?? []);
            } else {
                setError(result.error);
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
            const res = await toggleFavouriteUseCase.execute(location);
            if (res.success) {
                refreshPersistedStatus();
            } else {
                setError(res.error);
            }
        } catch (e) {
            console.log("toggleFavourite failed:", e);
        }
    }, [isFavourite, locationName, coordinates]);


    const toggleSaved = useCallback(async () => {
        const location = { coordinates, name: locationName ?? "Unknown" };
        try {
           const res = await toggleSavedUseCase.execute(location);
            if (res.success) {
                refreshPersistedStatus();
            } else {
                setError(res.error);
            }
        } catch (e) {
            console.log("toggleSaved failed:", e);
        }
    }, [isSaved, locationName, coordinates]);

    
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
