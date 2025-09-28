import type { UserPreferences } from "../entities/UserPreferences.ts";
import type { Location } from "../entities/LocationEntities.ts";
import type { Result } from "../errors/Result.ts";

export interface StorageService {
    loadPreferences(): Promise<UserPreferences>;
    storePreferences(prefs: UserPreferences): Promise<Result<void>>;
    loadFavouriteLocation(): Promise<Location>;
    loadSavedLocations(): Promise<Location[]>;
    storeLocationAsFavourite(location: Location): Promise<Result<void>>;
    storeLocationAsSaved(location: Location): Promise<Result<void>>;
    removeFavouriteLocation(location: Location): Promise<Result<void>>;
    removeLocationFromSaved(location: Location): Promise<Result<void>>;
}
