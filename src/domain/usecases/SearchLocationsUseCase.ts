import type { Location } from "../entities/LocationEntities";
import type { GeocodingService } from "../ports/GeocodingService";
import { Result } from "../errors/Result";

export class SearchLocationUseCase {
  constructor(private readonly geocodingService: GeocodingService) {} 

  async execute(querry: string): Promise<Result<Location[]>> {
    return await this.geocodingService.searchLocations(querry);
  }
}