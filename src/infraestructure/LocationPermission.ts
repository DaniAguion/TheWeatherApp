import { NativeModules, NativeEventEmitter, Platform } from "react-native";

type PermissionState = 
  | "granted" // User granted permission
  | "denied" // In ios, user denied permission; in Android, permission denied but can ask again
  | "blocked" // Denied and cannot ask again
  | "prompt"; // Not determined yet (iOS only)

type Scope = "whenInUse" | "always" | "none";

type Accuracy = "full" | "reduced" | "unknown";

export type LocStatus = {
  state: PermissionState;
  scope: Scope;
  accuracy: Accuracy;
  locationEnabled: boolean;
};

type NativeModuleType = {
  checkStatus(): Promise<LocStatus>;
  requestWhenInUse(): Promise<LocStatus>;
  requestAlways(): Promise<LocStatus>;
  isLocationEnabled(): Promise<boolean>;
  openSettings(): Promise<boolean | void>;
};

const Native: NativeModuleType = NativeModules.RNLocationPermission;

const emitter = new NativeEventEmitter(
  Platform.OS === "ios" ? (NativeModules.RNLocationPermission as any) : undefined
);

export const LocationPermission = {
  checkStatus: () => Native.checkStatus(),
  requestWhenInUse: () => Native.requestWhenInUse(),
  isLocationEnabled: () => Native.isLocationEnabled(),
};