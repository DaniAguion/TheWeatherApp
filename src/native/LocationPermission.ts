import { NativeModules, Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";

export type PermissionState = "granted" | "denied" | "blocked";

export type AccuracyAuth = "full" | "reduced" | "unknown";

export type Status = {
  state: PermissionState;
  accuracy: AccuracyAuth;
  scope: "whenInUse" | "always" | "none";
};

const { RNLocationPermission } = NativeModules;

if (!RNLocationPermission) {
  throw new Error("RNLocationPermission no vinculado (iOS/Android).");
}

export const LocationPermission = {
  checkStatus(): Promise<Status> {
    return RNLocationPermission.checkStatus();
  },
  async requestWhenInUse(): Promise<Status> {
    if (Platform.OS === "ios") {
      const outcome = await Geolocation.requestAuthorization("whenInUse");

      if (outcome === "disabled" || outcome === "restricted") {
        return {
          state: "blocked",
          accuracy: "unknown",
          scope: "none",
        };
      }

      try {
        const status = await RNLocationPermission.checkStatus();
        // The native module already maps the OS authorization into our Status shape.
        return status;
      } catch (_err) {
        return {
          state: outcome === "granted" ? "granted" : "denied",
          accuracy: outcome === "granted" ? "full" : "unknown",
          scope: outcome === "granted" ? "whenInUse" : "none",
        };
      }
    }

    return RNLocationPermission.requestWhenInUse();
  },
  requestBackground(): Promise<Status> {
    return RNLocationPermission.requestBackground();
  },
  isLocationEnabled(): Promise<boolean> {
    return RNLocationPermission.isLocationEnabled();
  },
  openSettings(): Promise<void> {
    return RNLocationPermission.openSettings();
  },
};
