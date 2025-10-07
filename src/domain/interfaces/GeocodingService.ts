import type { Location } from "../entities/LocationEntities";
import { Result } from "../errors/Result";

export interface GeocodingService {
  searchLocations(query: string): Promise<Result<Location[]>>;
}
