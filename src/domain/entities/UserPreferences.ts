import type { Location } from "../entities/LocationEntities";

export interface UserPreferences {
    useCurrentLocation: boolean;
    selectedLocation: Location;
}