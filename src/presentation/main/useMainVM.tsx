import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { DomainError } from "../../domain/errors/DomainError";
import { GetPreferencesUseCase } from "../../domain/usecases/GetPreferencesUseCase";
import { ToggleMainSwitchUseCase } from "../../domain/usecases/ToggleMainSwitchUseCase";
import { GetFavouriteUseCase } from "../../domain/usecases/GetFavouriteUseCase";
import { GetCurrentLocationUseCase } from "../../domain/usecases/GetCurrentLocationUseCase";
import type { Location } from "../../domain/entities/LocationEntities";


export type UseMainVMDeps = {
    getPreferencesUseCase: GetPreferencesUseCase;
    toggleMainSwitchUseCase: ToggleMainSwitchUseCase;
    getFavouriteUseCase: GetFavouriteUseCase;
    getCurrentLocationUseCase: GetCurrentLocationUseCase;
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
        getFavouriteUseCase,
        getCurrentLocationUseCase
    } = deps;

    const [state, setState] = useState<VMState>({
        loading: true,
        error: null,
        usingCurrentLocation: false,
        currentLocation: null,
        favouriteLocation: { name: "Favorita", coordinates: { lat: 0, lon: 0 } },
    });


    // Load current location
    const loadCurrentLocation = useCallback(async () => {
        if (!state.usingCurrentLocation) return;
        setState(st => ({ ...st, loading: true }));
        const res = await getCurrentLocationUseCase.execute();
        if (res.success) {
            setState(st => ({
                ...st,
                currentLocation: res.value,
                loading: false,
                error: null
            }));
        } else {
            setState(st => ({ ...st, loading:false, error: res.error }));
        }
    }, [state.usingCurrentLocation, getCurrentLocationUseCase]);



    // Load current location when usingCurrentLocation changes to true
    useEffect(() => {
        if (state.usingCurrentLocation) {
            loadCurrentLocation();
        }
    }, [state.usingCurrentLocation, loadCurrentLocation]);



    // Get the preferences of the user when the component is mounted
    const loadPreferences = useCallback(async () => {
        try {
            setState(st => ({ ...st, loading: true }));
            const res = await getPreferencesUseCase.execute();
            if (res.success) {
                setState(st => ({
                    ...st,
                    usingCurrentLocation: res.value.useCurrentLocation,
                    loading: false,
                    error: null
                }));
            } else {
                setState(st => ({ ...st, loading:false, error: res.error }));
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
                    loading: false,
                    error: null,
                }));
            } else {
                setState(st => ({ ...st, loading:false, error: res.error }));
            }
        } catch {
            setState(st => ({
                ...st,
                loading: false,
                error: DomainError.storage("No se pudieron obtener las preferencias.")
            }));
        }
    }, [getFavouriteUseCase]);
    

    
    // Refresh main function to reload preferences and favourite location
    const refreshMain = useCallback(async () => {
        await Promise.all([loadPreferences(), loadFavouriteLocation()]);
    }, [loadPreferences, loadFavouriteLocation]);



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


    // Handle refresh location if using current location
    const refreshLocation = useCallback(async () => {
        if (state.usingCurrentLocation) {
            await loadCurrentLocation();
        } else {
            await loadFavouriteLocation();
        }
    }, [state.usingCurrentLocation]);
    

    return {
        loading: state.loading,
        error: state.error,
        usingCurrentLocation: state.usingCurrentLocation,
        currentLocation: state.currentLocation,
        favouriteLocation: state.favouriteLocation,
        toggleMainSwitch,
        refreshMain,
        refreshLocation
    };
}
   
