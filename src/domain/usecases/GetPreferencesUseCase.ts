import type { StorageService } from "../interfaces/StorageService";
import type { UserPreferences } from "../entities/UserPreferences.ts";
import { Result } from "../errors/Result";


export class GetPreferencesUseCase {
  constructor(private readonly storageService: StorageService) {} 

  async execute(): Promise<Result<UserPreferences>> {
    return await this.storageService.loadPreferences();
  }
}