import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";
import { LocationPermission, type LocStatus as Status } from "../infraestructure/LocationPermission";
import { DomainError } from "../domain/errors/DomainError";
import type { Coordinates } from "../domain/entities/LocationEntities";

type Coords = { coordinates: Coordinates; accuracy?: number };

type UseCurrentLocationOptions = {
  enabled?: boolean;
  highAccuracy?: boolean;
  timeoutMs?: number;
  maximumAgeMs?: number;
};


export function useCurrentLocation({
  enabled = true,
  highAccuracy = true,
  timeoutMs = 7000,
  maximumAgeMs = 15000,
}: UseCurrentLocationOptions = {}) {
  const [coordinates, setCoordinates] = useState<Coordinates | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<DomainError | null>(null);
  const mounted = useRef(false);

  const ensurePermission = useCallback(async (): Promise<boolean> => {
    // First, check if location services are enabled
    let servicesAvailable = true;
    try {
      servicesAvailable = await LocationPermission.isLocationEnabled();
    } catch (err) {
      // On some iOS versions might be rejected, fall back to system platform default.
      servicesAvailable = Platform.OS === "ios";
    }
    if (!servicesAvailable) {
      if (mounted.current) {
        setLoading(false);
        setError(DomainError.locationUnavailable());
      }
      return false;
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
      } catch (requestError: any) {
        if (mounted.current) {
          setLoading(false);
          setError(DomainError.locationPermission(requestError.message));
        }
        return false;
      }
    }
    // Re-check status after request
    if (status.state !== "granted") {
      if (mounted.current) {
        setLoading(false);
        setError(DomainError.locationPermission());
      }
      return false;
    }
    return true;
  }, []);



  // Fetch current location
  const getCurrentLocation = useCallback(async () => {
    if (!enabled || !mounted.current) return;

    setLoading(true);
    setError(null);

    try {
      const authorized = await ensurePermission();
      if (!authorized) {
        if (mounted.current) setCoordinates(null);
        return;
      }

      await new Promise<void>((resolve) => {
        Geolocation.getCurrentPosition(
          (pos) => {
            if (!mounted.current) return resolve();
            const fresh: Coords = {
              coordinates: { lat: pos.coords.latitude, lon: pos.coords.longitude },
              accuracy: pos.coords.accuracy,
            };
            setCoordinates(fresh.coordinates);
            resolve();
          },
          () => {
            if (!mounted.current) return resolve();
            setError(DomainError.locationUnavailable());
            resolve();
          },
          {
            enableHighAccuracy: highAccuracy,
            timeout: timeoutMs,
            maximumAge: maximumAgeMs,
            forceRequestLocation: true,
            showLocationDialog: true,
          }
        );
      });
    } catch {
      if (mounted.current) setError(DomainError.locationUnavailable());
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [enabled, ensurePermission]);


  // Refresh function to manually trigger location fetch
  const refresh = useCallback(() => {
    if (enabled) {
      void getCurrentLocation();
    } else {
      setCoordinates(null);
      setLoading(false);
      setError(null);
    }
  }, [enabled, getCurrentLocation]);


  // Effect to fetch location on mount and when 'enabled' changes
  useEffect(() => {
    mounted.current = true;
    if (enabled) {
      void getCurrentLocation();
    } else {
      setCoordinates(null);
      setLoading(false);
      setError(null);
    }
    return () => {
      mounted.current = false;
    };
  }, [enabled, getCurrentLocation]);



  return { coords: coordinates, loading, error, refresh };
}
