import { NativeModules, NativeEventEmitter, Platform } from "react-native";

type PermissionState = "granted" | "denied" | "blocked" | "prompt";
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
  requestAlways: () => Native.requestAlways(),
  isLocationEnabled: () => Native.isLocationEnabled(),
  openSettings: () => Native.openSettings(),
  addAccuracyListener(cb: (a: Accuracy) => void) {
    if (Platform.OS !== "ios") return () => {};
    const sub = emitter.addListener("accuracyChanged", (e: { accuracy: Accuracy }) => cb(e.accuracy));
    return () => sub.remove();
  },
};