import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geolocation from "react-native-geolocation-service";
import { LocationPermission } from "../native/LocationPermission";

type Coords = { lat: number; lon: number; accuracy?: number };

const LAST_LOCATION_KEY = "lastLocation";

export function useCurrentLocation(defaultLocation: Coords | null = null) {
  const [coords, setCoords] = useState<Coords | null>(defaultLocation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);
  const [requestId, setRequestId] = useState(0);
  const coordsRef = useRef<Coords | null>(defaultLocation);

  const refresh = useCallback(() => {
    setRequestId((prev) => prev + 1);
  }, []);

  useEffect(() => {
    mounted.current = true;
    return () => {
      mounted.current = false;
    };
  }, []);

  useEffect(() => {
    coordsRef.current = coords;
  }, [coords]);

  useEffect(() => {
    refresh();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (requestId === 0) return;

    let cancelled = false;

    const setSafeState = <T,>(setter: (value: T) => void, value: T) => {
      if (!cancelled && mounted.current) setter(value);
    };

    (async () => {
      try {
        setSafeState(setLoading, true);
        setSafeState(setError, null);

        // Read last known location from storage to show something quickly
        const cached = await AsyncStorage.getItem(LAST_LOCATION_KEY);
        if (cached && coordsRef.current == null && !cancelled && mounted.current) {
          const c = JSON.parse(cached) as Coords;
          setCoords(c);
        }

        // Check location permission and request if not granted
        const services = Platform.OS === "ios"
          ? true
          : await LocationPermission.isLocationEnabled();
        if (!services) {
          setSafeState(setError, "Servicios de ubicación desactivados");
          setSafeState(setLoading, false);
          return;
        }

        let status = await LocationPermission.checkStatus();
        if (status.state !== "granted") {
          status = await LocationPermission.requestWhenInUse();
        }
        if (status.state !== "granted") {
          setSafeState(setError, "Permiso de ubicación no concedido");
          setSafeState(setLoading, false);
          return;
        }

        // Get current location and save it
        await new Promise<void>((resolve) => {
          Geolocation.getCurrentPosition(
            async (pos) => {
              if (cancelled || !mounted.current) return resolve();
              const fresh: Coords = {
                lat: pos.coords.latitude,
                lon: pos.coords.longitude,
                accuracy: pos.coords.accuracy,
              };
              setCoords(fresh);
              await AsyncStorage.setItem(LAST_LOCATION_KEY, JSON.stringify(fresh));
              resolve();
            },
            (err) => {
              if (cancelled || !mounted.current) return resolve();
              setError(err.message || "No se pudo obtener la ubicación");
              resolve();
            },
            {
              enableHighAccuracy: true,
              timeout: 7000,
              maximumAge: 15000,
              forceRequestLocation: true,
              showLocationDialog: true,
            }
          );
        });
      } catch (e: any) {
        if (!cancelled && mounted.current) setError(e?.message ?? "Error de ubicación");
      } finally {
        if (!cancelled && mounted.current) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [requestId]);

  return { coords, loading, error, refresh };
}
