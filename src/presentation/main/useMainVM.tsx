import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { UserPreferencesService } from "../../domain/ports/UserPreferencesService";
import type { Coordinates, Location } from "../../domain/entities/LocationEntities";


export type UseMainVMDeps = {
    userPreferencesService: UserPreferencesService;
};

type VMState = {
    loading: boolean;
    error: string | null;
    usingCurrentLocation: boolean;
    currentLocation: Location | null;
    favouriteLocation: Location;
};

type VMFunctions = {
    handleSelectCurrent: () => void;
    handleSelectFavourite: () => void;
};

export function useMainVM( deps: UseMainVMDeps ) : VMState & VMFunctions {
    const { userPreferencesService } = deps;

    const [state, setState] = useState<VMState>({
        loading: true,
        error: null,
        usingCurrentLocation: false,
        currentLocation: null,
        favouriteLocation: { name: "Favorita", coordinates: { lat: 0, lon: 0 } },
    });

    const mounted = useRef(true);

    const {
        coords,
        loading: loadingLocation,
        error: locationError,
        refresh: refreshCurrent
    } = useCurrentLocation({ enabled: state.usingCurrentLocation });


    // Get the preferences of the user when the component is mounted
    useEffect(() => {
        mounted.current = true;
        (async () => {
            try {
                const prefs = await userPreferencesService.loadPreferences();
                if (!mounted.current) return;
                const usingCurrent = !!prefs.useCurrentLocation;
                const favourite = prefs.favouriteLocation;
                setState(st => ({ ...st, 
                    loading: false, 
                    error: null,
                    usingCurrentLocation: usingCurrent,
                    favouriteLocation: favourite,
                }));
            } catch (err) {
                if (!mounted.current) return;
                setState(st => ({ ...st, 
                    loading: false, 
                    error: "Error cargando las preferencias de usuario" 
                }));
            }
        })();
        return () => { mounted.current = false; };
    }, [userPreferencesService]);


    // Update state when location or usingCurrentLocation changes
    useEffect(() => {
        if (!state.usingCurrentLocation) return;
        if (coords) setState(st => ({ ...st,
            currentLocation: { coordinates: coords },
            error: null
        }));
        else if (locationError) setState(st => ({ ...st, error: locationError }));
    }, [state.usingCurrentLocation, coords, locationError]);


    // Select favourite location
    const handleSelectFavourite = useCallback(async () => {
        if (!state.usingCurrentLocation) return;

        if (!state.favouriteLocation) {
            setState(st => ({ ...st, error: "No hay ubicación favorita" }));
            return;
        }

        setState(st => ({ ...st,
             error: null, 
             usingCurrentLocation: false, 
             favouriteLocation: st.favouriteLocation
        }));
        try {
            await userPreferencesService.savePreferences({ useCurrentLocation: false });
        } catch {
            setState(st => ({ ...st,
                usingCurrentLocation: true,
                error: "No se pudo activar la ubicación favorita" 
            }));
        }
    }, [state.usingCurrentLocation, state.favouriteLocation, userPreferencesService]);


    // Select current location
    const handleSelectCurrent = useCallback(async () => {
        if (state.usingCurrentLocation) return;

        setState(st => ({ ...st,
            error: null, 
            usingCurrentLocation: true
        }));

        try {
            await userPreferencesService.savePreferences({ useCurrentLocation: true });
            await refreshCurrent();
        } catch {
            setState(st => ({ ...st,
                usingCurrentLocation: false,
                favouriteLocation: state.favouriteLocation,
                error: "No se pudo activar la ubicación actual",
            }));
        }
    }, [state.usingCurrentLocation, userPreferencesService, refreshCurrent]);
    
    const loading = state.loading || loadingLocation;

    return {
        loading,
        error: state.error,
        usingCurrentLocation: state.usingCurrentLocation,
        currentLocation: state.currentLocation,
        favouriteLocation: state.favouriteLocation,
        handleSelectCurrent,
        handleSelectFavourite,
    };
}
   
