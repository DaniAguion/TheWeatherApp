import type { UserPreferences } from "../entities/UserPreferences.ts";

export interface UserPreferencesService {
    load(): Promise<UserPreferences>;
    save(prefs: UserPreferences): Promise<void>;
    clearPreferences(): Promise<void>;
}
