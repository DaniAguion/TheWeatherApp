import type { UserPreferences } from "../entities/UserPreferences.ts";
import type { Location } from "../entities/LocationEntities.ts";
import type { Result } from "../errors/Result.ts";

export interface StorageService {
    loadPreferences(): Promise<UserPreferences>;
    storePreferences(prefs: UserPreferences): Promise<Result<void>>;
    loadFavouriteLocation(): Promise<Location>;
    storeLocationAsFavourite(location: Location): Promise<Result<void>>;
    storeLocationAsSaved(location: Location): Promise<Result<void>>;
}
