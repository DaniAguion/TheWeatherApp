import { LocationProvider } from "../../domain/ports/LocationProvider";
import { Result } from "../../domain/errors/Result";
import { Coordinates } from "../../domain/entities/LocationEntities";

export class LocationProviderImpl implements LocationProvider {
  async getCurrentPosition(opts?: {
    highAccuracy?: boolean;
    timeoutMs?: number;
    maximumAgeMs?: number;
  }): Promise<Result<Coordinates>> {
  
  }
}