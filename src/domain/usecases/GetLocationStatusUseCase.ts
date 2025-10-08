import type { StorageService } from "../interfaces/StorageService";
import type { Location } from "../entities/LocationEntities";
import type { LocationStatus } from "../entities/UserPreferences";
import { Result } from "../errors/Result";
import { DomainError } from "../errors/DomainError";
import { sameLocation } from "../helpers/LocationHelper";


export class GetLocationStatusUseCase {
  constructor(private readonly storageService: StorageService) {} 

  async execute(location: Location): Promise<Result<LocationStatus>> {
    try {
      const [favouriteResult, savedResult] = await Promise.all([
        this.storageService.loadFavouriteLocation(),
        this.storageService.loadSavedLocations()
      ]);
      if (!favouriteResult.success) {
        return { success: false, error: favouriteResult.error };
      }
      if (!savedResult.success) {
        return { success: false, error: savedResult.error };
      }
      const isFavourite = sameLocation(favouriteResult.value, location);
      const isSaved = savedResult.value.some(savedLoc => sameLocation(savedLoc, location));
      return { success: true, value: { isFavourite, isSaved } };
    } catch (error) {
      return { success: false, error: DomainError.unknown(error) };
    }
  }
}