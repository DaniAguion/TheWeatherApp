import { Platform } from "react-native";
import { LocationProvider } from "../../domain/ports/LocationProvider";
import { Result } from "../../domain/errors/Result";
import { Coordinates } from "../../domain/entities/LocationEntities";
import { DomainError } from "../../domain/errors/DomainError";
import { LocationPermission } from "../../native/LocationPermission";
import type { LocStatus as Status } from "../../native/LocationPermission";
import Geolocation from "react-native-geolocation-service";


export class LocationProviderImpl implements LocationProvider {
  async getCurrentPosition(opts?: {
    highAccuracy?: boolean;
    timeoutMs?: number;
    maximumAgeMs?: number;
  }): Promise<Result<Coordinates>> {
    // First, check if location services are enabled
    let servicesAvailable = true;
    try {
        servicesAvailable = await LocationPermission.isLocationEnabled();
    } catch (err) {
        // On some iOS versions might be rejected, fall back to system platform default.
        servicesAvailable = Platform.OS === "ios";
    }
    if (!servicesAvailable) {
        return { success: false, error: DomainError.locationUnavailable() };
    }

    // Check permission status and request if needed
    let status: Status;
    try {
        status = await LocationPermission.checkStatus();
    } catch {
        status = { 
        state: "denied", 
        accuracy: "unknown", 
        scope: "none", 
        locationEnabled: servicesAvailable };
    }
    if (status.state !== "granted") {
      try {
        status = await LocationPermission.requestWhenInUse();
      } catch {
        return { success: false, error: DomainError.locationPermission() };
      }
    }
    if (status.state !== "granted") {
      return { success: false, error: DomainError.locationPermission() };
    }


    const { highAccuracy = false, timeoutMs = 7000, maximumAgeMs = 120000 } = opts || {};
    try {
      const coords = await new Promise<Coordinates>((resolve, reject) => {
        Geolocation.getCurrentPosition(
          (pos) => {
            resolve({
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
            });
          },
          () => {
            reject(DomainError.locationUnavailable());
          },
          {
            enableHighAccuracy: highAccuracy,
            timeout: timeoutMs,
            maximumAge: maximumAgeMs,
            showLocationDialog: true,
          }
        );
      });
      return { success: true, value: coords };
    } catch {
      return { success: false, error: DomainError.locationUnavailable() };
    }
  }
}