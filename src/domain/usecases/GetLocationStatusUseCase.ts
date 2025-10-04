import type { StorageService } from "../ports/StorageService";
import type { Location } from "../entities/LocationEntities";
import type { LocationStatus } from "../entities/UserPreferences";
import { Result } from "../errors/Result";
import { DomainError } from "../errors/DomainError";


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

      const favouriteLocation = favouriteResult.value;
      const savedLocations = savedResult.value;

      const isFavourite = favouriteLocation 
        ? (favouriteLocation.coordinates.lat === location.coordinates.lat &&
           favouriteLocation.coordinates.lon === location.coordinates.lon)
        : false;

      const isSaved = savedLocations.some(savedLoc => 
        savedLoc.coordinates.lat === location.coordinates.lat &&
        savedLoc.coordinates.lon === location.coordinates.lon
      );

      return { success: true, value: { isFavourite, isSaved } };
    } catch (error) {
      return { success: false, error: DomainError.unknown(error) };
    }
  }
}