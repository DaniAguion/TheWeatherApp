import { useEffect, useState, useCallback } from "react";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { UserPreferencesService } from "../../domain/ports/UserPreferencesService";
import type { Coordinates, Location } from "../../domain/entities/LocationEntities";


export type UseMainVMDeps = {
    userPreferencesService: UserPreferencesService;
};

type VMState = {
    loading: boolean;
    error?: string | null;
    usingCurrentLocation: boolean;
    location: Location | null;
    favouriteLocationName: string;
};

type VMFunctions = {
    handleSelectCurrent: () => void;
    handleSelectFavourite: () => void;
};

export function useMainVM(
    deps: UseMainVMDeps,
) : VMState & VMFunctions {
    const { userPreferencesService } = deps;
    const [ usingCurrentLocation, setUsingCurrentLocation ] = useState <boolean>(false);
    const [ favouriteLocation, setFavouriteLocation ] = useState <Location | null>(null);
    const [ location, setLocation ] = useState <Location | null>(null);
    const [ loadingPreferences, setLoadingPreferences] = useState(true);
    const [ error, setError ] = useState<string | null>(null);

    const {
        coords,
        loading: loadingLocation,
        error: locationError,
        refresh: refreshCurrent
    } = useCurrentLocation({ enabled: usingCurrentLocation });

    // Hook to get the preferences of the user
    useEffect(() => {
        let mounted = true;
        (async () => {
            try {
                const prefs = await userPreferencesService.loadPreferences();
                if (!mounted) return;
                setUsingCurrentLocation(prefs.useCurrentLocation);
                setFavouriteLocation(prefs.favouriteLocation);
                setError(null);
                if (!prefs.useCurrentLocation) {
                    setLocation(prefs.favouriteLocation);
                } else {
                    if (coords) {
                        setLocation({ coordinates: coords });
                    }
                }
            } catch (err) {
                if (!mounted) return;
                setError("Error cargando las preferencias de usuario");
            } finally {
                if (!mounted) return;
                setLoadingPreferences(false);
            }
        })();
        return () => { mounted = false; };
    }, []);


    // Actualizar location cuando cambian coords (modo actual)
    useEffect(() => {
        if (usingCurrentLocation) {
            if (coords) {
                setLocation({ coordinates: coords });
            } else if (locationError) {
                setError(locationError);
            }
        }
    }, [usingCurrentLocation, coords, locationError]);


    // Handlers
    const handleSelectCurrent = useCallback(async () => {
        if (usingCurrentLocation) return;
        setError(null);
        setUsingCurrentLocation(true);
        setLocation(prev => prev && prev.name === "Mi ubicación" ? prev : null);
        try {
        await userPreferencesService.savePreferences({ useCurrentLocation: true });
        refreshCurrent();
        } catch {
        setUsingCurrentLocation(false);
        if (favouriteLocation) setLocation(favouriteLocation);
        setError("No se pudo activar la ubicación actual");
        }
    }, [usingCurrentLocation, userPreferencesService, favouriteLocation, refreshCurrent]);


    const handleSelectFavourite = useCallback(async () => {
        if (!usingCurrentLocation) return;
        if (!favouriteLocation) {
        setError("No hay ubicación favorita");
        return;
        }
        setError(null);
        setUsingCurrentLocation(false);
        setLocation(favouriteLocation);
        try {
        await userPreferencesService.savePreferences({ useCurrentLocation: false });
        } catch {
        // Revertir
        setUsingCurrentLocation(true);
        setLocation(prev => prev?.name === "Mi ubicación" ? prev : null);
        setError("No se pudo activar la ubicación favorita");
        }
    }, [usingCurrentLocation, favouriteLocation, userPreferencesService]);

    const loading = loadingPreferences || loadingLocation;
    const favouriteLocationName = favouriteLocation?.name?.trim() || "Favorita";

    return {
        loading,
        error,
        usingCurrentLocation,
        location,
        favouriteLocationName,
        handleSelectCurrent,
        handleSelectFavourite,
    };
}
   
