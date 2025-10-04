import { Coordinates } from "../entities/LocationEntities";
import { Result } from "../errors/Result.ts";


export interface LocationProvider {
  getCurrentPosition(opts?: {
    timeoutMs?: number;
    highAccuracy?: boolean;
    maximumAgeMs?: number;
  }): Promise<Result<Coordinates>>;
}