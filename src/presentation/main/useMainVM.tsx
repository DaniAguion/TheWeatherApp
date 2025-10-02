import { useEffect, useState, useCallback, useRef, useMemo } from "react";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { StorageService } from "../../domain/ports/StorageService";
import { DomainError } from "../../domain/errors/DomainError";
import type { Location } from "../../domain/entities/LocationEntities";



export type UseMainVMDeps = {
    storageService: StorageService;
};

type VMState = {
    loading: boolean;
    error: DomainError | null;
    usingCurrentLocation: boolean;
    currentLocation: Location | null;
    favouriteLocation: Location;
};

type VMFunctions = {
    handleSelectCurrent: () => void;
    handleSelectFavourite: () => void;
    refreshPreferences: () => Promise<void>;
    refreshLocation: () => Promise<void>;
};

export function useMainVM( deps: UseMainVMDeps ) : VMState & VMFunctions {
    const { storageService: StorageService } = deps;

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
        refresh: refreshCurrent
    } = useCurrentLocation({ enabled: state.usingCurrentLocation });


    // Get the preferences of the user when the component is mounted
    const loadPreferences = useCallback(async () => {
        try {
            const loadPreferencesResult = await StorageService.loadPreferences();
            if (loadPreferencesResult.success) {
                setState(st => ({ ...st, usingCurrentLocation: loadPreferencesResult.value.useCurrentLocation,}));
            } else {
                setState(st => ({ ...st, error: loadPreferencesResult.error}));
            }
            const loadFavouriteResult = await StorageService.loadFavouriteLocation();
            if (loadFavouriteResult.success) {
                setState(st => ({ ...st, favouriteLocation: loadFavouriteResult.value, loading: false }));
            } else {
                setState(st => ({ ...st, error: loadFavouriteResult.error, loading: false }));
            }
        } catch {
        setState(st => ({
            ...st,
            loading: false,
            error: DomainError.storage("No se pudieron obtener las preferencias.")
        }));
        }
    }, [StorageService]);


    useEffect(() => {
        loadPreferences();
    }, [loadPreferences, state.usingCurrentLocation]);


    const refreshPreferences = useCallback(async () => {
        await loadPreferences();
    }, [loadPreferences]);


    // Update state when location or usingCurrentLocation changes
    useEffect(() => {
        if (!state.usingCurrentLocation) return;
        if (coords) setState(st => ({ ...st,
            currentLocation: { coordinates: coords },
            error: null
        }));
        else if (locationError) setState(st => ({ ...st, error: DomainError.locationUnavailable() }));
    }, [state.usingCurrentLocation, coords, locationError]);


    // Select favourite location
    const handleSelectFavourite = useCallback(async () => {
        if (!state.usingCurrentLocation) return;

        setState(st => ({ ...st,
             error: null, 
             usingCurrentLocation: false, 
             favouriteLocation: st.favouriteLocation
        }));
        try {
            await StorageService.storePreferences({ useCurrentLocation: false });
        } catch {
            setState(st => ({ ...st,
                usingCurrentLocation: true,
                error: DomainError.storage("No se pudo guardar la preferencia.")
            }));
        }
    }, [state.usingCurrentLocation, state.favouriteLocation, StorageService]);


    // Select current location
    const handleSelectCurrent = useCallback(async () => {
        if (state.usingCurrentLocation) return;

        setState(st => ({ ...st,
            error: null, 
            usingCurrentLocation: true
        }));

        try {
            await StorageService.storePreferences({ useCurrentLocation: true });
            await refreshCurrent();
        } catch {
            setState(st => ({ ...st,
                usingCurrentLocation: false,
                favouriteLocation: state.favouriteLocation,
                error: DomainError.storage("No se pudo guardar la preferencia."),
            }));
        }
    }, [state.usingCurrentLocation, StorageService, refreshCurrent]);


    // Handle refresh location if using current location
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
        handleSelectCurrent,
        handleSelectFavourite,
        refreshPreferences,
        refreshLocation
    };
}
   
