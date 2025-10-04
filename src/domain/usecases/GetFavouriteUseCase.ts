import type { StorageService } from "../ports/StorageService.ts";
import type { Location } from "../entities/LocationEntities.ts";
import { Result } from "../errors/Result.ts";

export class GetFavouriteUseCase {
  constructor(private readonly storageService: StorageService) {} 

  async execute(): Promise<Result<Location>> {
    return await this.storageService.loadFavouriteLocation();
  }
}