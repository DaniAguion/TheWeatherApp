import { Coordinates } from "../entities/LocationEntities";
import { Result } from "../errors/Result";

export interface ReverseGeoService {
  getLocationName(coordinates: Coordinates): Promise<Result<string>>;
}