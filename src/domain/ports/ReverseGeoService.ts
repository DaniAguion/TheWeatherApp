import { Coordinates } from "../entities";
import { Result } from "../errors/Result";

export interface ReverseGeoService {
  getLocationName(coordinates: Coordinates): Promise<Result<string>>;
}