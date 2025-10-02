import type { UserPreferences } from "../entities/UserPreferences.ts";
import type { Location } from "../entities/LocationEntities.ts";
import type { Result } from "../errors/Result.ts";

export interface StorageService {
    loadPreferences(): Promise<Result<UserPreferences>>;
    storePreferences(prefs: UserPreferences): Promise<Result<void>>;
    loadFavouriteLocation(): Promise<Result<Location>>;
    storeFavouriteLocation(location: Location): Promise<Result<void>>;
    removeFavouriteLocation(location: Location): Promise<Result<void>>;
    loadSavedLocations(): Promise<Result<Location[]>>;
    storeSavedLocation(location: Location): Promise<Result<void>>;
    removeSaveLocation(location: Location): Promise<Result<void>>;
}
