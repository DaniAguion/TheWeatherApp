import type { UserPreferences } from "../entities/UserPreferences.ts";
import type { Result } from "../errors/Result.ts";

export interface UserPreferencesService {
    loadPreferences(): Promise<UserPreferences>;
    savePreferences(prefs: UserPreferences): Promise<Result<void>>
    clearPreferences(): Promise<Result<void>>;
}
