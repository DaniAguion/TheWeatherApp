import { NativeModules } from "react-native";

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
  requestWhenInUse(): Promise<Status> {
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
