import type { Location } from "../entities/LocationEntities";

export interface UserPreferences {
    useCurrentLocation: boolean;
}

export interface UserLocations {
    savedLocations: Location[];
    favouriteLocation: Location;
}