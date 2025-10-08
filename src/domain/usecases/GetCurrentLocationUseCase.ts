import type { Location } from "../entities/LocationEntities.ts";
import { Result } from "../errors/Result.ts";
import { LocationProvider } from "../interfaces/LocationProvider.ts";

export class GetCurrentLocationUseCase {
  constructor(private readonly locationProvider: LocationProvider) {} 

  async execute(): Promise<Result<Location>> {
    const locationResult = await this.locationProvider.getCurrentPosition();
    if (locationResult.success) {
      return { success: true, value: { coordinates: locationResult.value } as Location };
    } else {
      return { success: false, error: locationResult.error };
    }
  }
}