import type { UserPreferences } from "../entities/UserPreferences.ts";
import type { Location } from "../entities/LocationEntities.ts";
import type { Result } from "../errors/Result.ts";

export interface UserPreferencesService {
    loadPreferences(): Promise<UserPreferences>;
    savePreferences(prefs: UserPreferences): Promise<Result<void>>;
    loadFavouriteLocation(): Promise<Location>;
    saveLocationAsFavourite(location: Location): Promise<Result<void>>;
    saveLocationAsSaved(location: Location): Promise<Result<void>>;
}
