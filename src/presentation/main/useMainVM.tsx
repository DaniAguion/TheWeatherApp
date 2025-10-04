import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { DomainError } from "../../domain/errors/DomainError";
import { GetPreferencesUseCase } from "../../domain/usecases/GetPreferencesUseCase";
import { ToggleMainSwitchUseCase } from "../../domain/usecases/ToggleMainSwitchUseCase";
import { GetFavouriteUseCase } from "../../domain/usecases/GetFavouriteUseCase";
import type { Location } from "../../domain/entities/LocationEntities";


export type UseMainVMDeps = {
    getPreferencesUseCase: GetPreferencesUseCase;
    toggleMainSwitchUseCase: ToggleMainSwitchUseCase;
    getFavouriteUseCase: GetFavouriteUseCase;
};

type VMState = {
    loading: boolean;
    error: DomainError | null;
    usingCurrentLocation: boolean;
    currentLocation: Location | null;
    favouriteLocation: Location;
};

type VMFunctions = {
    toggleMainSwitch: () => Promise<void>;
    refreshMain: () => Promise<void>;
    refreshLocation: () => Promise<void>;
};

export function useMainVM( deps: UseMainVMDeps ) : VMState & VMFunctions {
    const { 
        getPreferencesUseCase, 
        toggleMainSwitchUseCase, 
        getFavouriteUseCase 
    } = deps;

    const [state, setState] = useState<VMState>({
        loading: true,
        error: null,
        usingCurrentLocation: false,
        currentLocation: null,
        favouriteLocation: { name: "Favorita", coordinates: { lat: 0, lon: 0 } },
    });

    const {
        coords,
        loading: loadingLocation,
        error: locationError,
        refresh: refreshCurrent,
    } = useCurrentLocation({ enabled: state.usingCurrentLocation });


    // Get the preferences of the user when the component is mounted
    const loadPreferences = useCallback(async () => {
        try {
            setState(st => ({ ...st, loading: true }));
            const res = await getPreferencesUseCase.execute();
            if (res.success) {
                setState(st => ({
                    ...st,
                    usingCurrentLocation: res.value.useCurrentLocation,
                    error: null,
                    loading: false
                }));
            } else {
                setState(st => ({ ...st, error: res.error, loading: false }));
            }
        } catch {
            setState(st => ({
                ...st,
                loading: false,
                error: DomainError.storage("No se pudieron obtener las preferencias.")
            }));
        }
    }, [getPreferencesUseCase]);


     const loadFavouriteLocation = useCallback(async () => {
        try {
            setState(st => ({ ...st, loading: true }));
            const res = await getFavouriteUseCase.execute();
            if (res.success) {
                setState(st => ({
                    ...st,
                    favouriteLocation: res.value,
                    error: null,
                    loading: false
                }));
            } else {
                setState(st => ({ ...st, error: res.error, loading: false }));
            }
        } catch {
            setState(st => ({
                ...st,
                loading: false,
                error: DomainError.storage("No se pudieron obtener las preferencias.")
            }));
        }
    }, [getFavouriteUseCase]);

    
     const refreshMain = useCallback(async () => {
        await Promise.all([loadPreferences(), loadFavouriteLocation()]);
    }, [loadPreferences, loadFavouriteLocation]);


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
    const toggleMainSwitch = useCallback(async () => {
        try {
            const toggleResult = await toggleMainSwitchUseCase.execute();
            if (toggleResult.success) {
                await loadPreferences();
                await loadFavouriteLocation();
            } else {
                setState(st => ({ ...st,
                    error: toggleResult.error
                }));
            }
        } catch {
            setState(st => ({ ...st,
                error: DomainError.storage("No se ha podido guardar la preferencia.")
            }));
        }
    }, [state.usingCurrentLocation, state.favouriteLocation]);


    // Handle refresh location if using current locationA
    const refreshLocation = useCallback(async () => {
        if (!state.usingCurrentLocation) return;
        await refreshCurrent();
    }, [state.usingCurrentLocation, refreshCurrent]);
    
    const loading = state.loading || loadingLocation;

    return {
        loading,
        error: state.error,
        usingCurrentLocation: state.usingCurrentLocation,
        currentLocation: state.currentLocation,
        favouriteLocation: state.favouriteLocation,
        toggleMainSwitch,
        refreshMain,
        refreshLocation
    };
}
   
