import { useCallback, useRef } from "react";
import { Platform} from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import { useCurrentLocation } from "../../hooks/useCurrentLocation";
import { useSelectedLocation, DEFAULT_SELECTED_LOCATION } from "../../hooks/useSelectedLocation";
import { UserPreferencesService } from "../../domain/ports/UserPreferencesService";
import { LocationPermission } from "../../infraestructure/LocationPermission";
import type { Coordinates } from "../../domain/entities/LocationEntities";

export type UseMainVMDeps = {
    userPreferencesService: UserPreferencesService;
};

type VMState = {
    loading: boolean;
    error?: string | null;
    usingCurrentLocation: boolean;
    coords?: Coordinates | null;
    locationName?: string;
    selectedButtonText: string;
};

type VMFunctions = {
    handleSelectCurrent: () => void;
    handleSelectSaved: () => void;
};

export function useMainVM(
    deps: UseMainVMDeps,
) : VMState & VMFunctions {
    const {
        selectedLocation,
        savedLocation,
        usingCurrentLocation,
        loading: loadingSelected,
        error: errorSelected,
        clearSelectedLocation,
        saveSelectedLocation,
    } = useSelectedLocation();

    const {
        coords: currentCoords,
        loading: loadingCurrent,
        error: errorCurrent,
        refresh,
    } = useCurrentLocation();

      const isFirstFocus = useRef(true);

       useFocusEffect(
          useCallback(() => {
            if (isFirstFocus.current) {
              isFirstFocus.current = false;
              return;
            }
            if (usingCurrentLocation) refresh();
          }, [refresh, usingCurrentLocation])
        );

    const handleSelectCurrent = useCallback(() => {
    (async () => {
        if (Platform.OS === "ios") {
        try {
            const status = await LocationPermission.checkStatus();
            if (status.state !== "granted") {
            await LocationPermission.requestWhenInUse();
            }
        } catch { /* noop */ }
        }
        try {
        await clearSelectedLocation();
        } catch { /* noop */ }
    })().catch(() => {});
    }, [clearSelectedLocation]);

    const handleSelectSaved = useCallback(() => {
    const target = savedLocation ?? DEFAULT_SELECTED_LOCATION;
    saveSelectedLocation(target).catch(() => {});
    }, [saveSelectedLocation, savedLocation]);

    const coords = usingCurrentLocation ? currentCoords : selectedLocation?.coordinates;
    const locationName = usingCurrentLocation ? undefined : selectedLocation?.name;
    const loading = usingCurrentLocation ? loadingCurrent : loadingSelected;
    const error = usingCurrentLocation ? errorCurrent : errorSelected;
    const selectedButtonText = savedLocation?.name ?? "Favorita";

    return {
        usingCurrentLocation,
        coords,
        locationName,
        loading,
        error,
        selectedButtonText,
        handleSelectCurrent,
        handleSelectSaved,
    };
}
   
