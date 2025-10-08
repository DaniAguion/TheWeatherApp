import type { StorageService } from "../interfaces/StorageService";
import { DomainError } from "../errors/DomainError";
import { Result } from "../errors/Result";


export class ToggleMainSwitchUseCase {
  constructor(private readonly storageService: StorageService) {} 

  async execute(): Promise<Result<void>> {
    try {
      const loadPreferencesResult = await this.storageService.loadPreferences();
      if (!loadPreferencesResult.success) return { success: false, error: loadPreferencesResult.error };

      const newUseCurrentLocation = !loadPreferencesResult.value.useCurrentLocation;
      const savePreferencesResult = await this.storageService.storePreferences({ useCurrentLocation: newUseCurrentLocation });
      return savePreferencesResult;
    } catch (error) {
      return { success: false, error: DomainError.unknown(error) };
    }
  }
}