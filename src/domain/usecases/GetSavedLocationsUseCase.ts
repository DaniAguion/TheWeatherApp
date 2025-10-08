import type { StorageService } from "../interfaces/StorageService";
import type { Location } from "../entities/LocationEntities";
import { Result } from "../errors/Result";


export class GetSavedLocationUseCase {
  constructor(private readonly storageService: StorageService) {} 

  async execute(): Promise<Result<Location[]>> {
    return await this.storageService.loadSavedLocations();
  }
}