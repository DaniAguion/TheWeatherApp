import { Coordinates } from "../entities";

export interface ReverseGeoService {
  getLocationName(coordinates: Coordinates): Promise<string | null>;
}