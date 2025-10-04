import type { StorageService } from "../ports/StorageService";
import type { Location } from "../entities/LocationEntities";
import { DomainError } from "../errors/DomainError";
import { Result } from "../errors/Result";
import { isValidLocation, normalizeLocation, sameLocation } from "../helpers/LocationHelper";

export class ToggleSavedUseCase {
  constructor(private readonly storageService: StorageService) {} 

  async execute(location: Location): Promise<Result<void>> {
    try {
      if (!isValidLocation(location)) return { success: false, error: DomainError.invalidData() };

      const normalizedLocation = normalizeLocation(location);

      const loadResult = await this.storageService.loadSavedLocations();
      if (loadResult.success) {
        const isSaved = loadResult.value.some(savedLoc => sameLocation(savedLoc, normalizedLocation));
        if (isSaved) {
          return await this.storageService.removeSavedLocation(normalizedLocation);
        } else {
          return await this.storageService.storeSavedLocation(normalizedLocation);
        }
      } else {
        return { success: false, error: loadResult.error };
      }
    } catch (error) {
      return { success: false, error: DomainError.unknown(error) };
    }
  }
}