import type { StorageService } from "../interfaces/StorageService";
import type { Location } from "../entities/LocationEntities";
import { DomainError } from "../errors/DomainError";
import { Result } from "../errors/Result";
import { isValidLocation, normalizeLocation, sameLocation } from "../helpers/LocationHelper";
import { DEFAULT_FAVOURITE } from "../../data/storage/StorageServiceImpl";

export class ToggleFavouriteUseCase {
  constructor(private readonly storageService: StorageService) {} 

  async execute(location: Location): Promise<Result<void>> {
    try {
      if (!isValidLocation(location)) return { success: false, error: DomainError.invalidData() };
      
      const normalizedLocation = normalizeLocation(location);

      const loadResult = await this.storageService.loadFavouriteLocation();
      if (loadResult.success) {
        // If location is the default favourite, don't do anything
        if (sameLocation(normalizedLocation, DEFAULT_FAVOURITE)) {
          return { success: true, value: undefined };
        }
        // If location is already the favourite, remove it
        if (sameLocation(loadResult.value, normalizedLocation)) {
          return await this.storageService.removeFavouriteLocation();
        } else {
          return await this.storageService.storeFavouriteLocation(normalizedLocation);
        }
      } else {
        return { success: false, error: loadResult.error };
      }
    } catch (error) {
      return { success: false, error: DomainError.unknown(error) };
    }
  }
}