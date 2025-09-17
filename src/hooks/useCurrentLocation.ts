import { useCallback, useEffect, useRef, useState } from "react";
import { Platform } from "react-native";
import Geolocation from "react-native-geolocation-service";
import { LocationPermission } from "../native/LocationPermission";

type Coords = { lat: number; lon: number; accuracy?: number };

type UseCurrentLocationOptions = {
  enabled?: boolean;
};

export function useCurrentLocation({ enabled = true }: UseCurrentLocationOptions = {}) {
  const [coords, setCoords] = useState<Coords | null>(null);
  const [loading, setLoading] = useState(enabled);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(false);

  const getCurrentLocation = useCallback(async () => {
    if (!enabled || !mounted.current) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const services = Platform.OS === "ios"
        ? true
        : await LocationPermission.isLocationEnabled();
      if (!services) {
        if (mounted.current) setError("Servicios de ubicación desactivados");
        return;
      }

      let status = await LocationPermission.checkStatus();
      if (status.state !== "granted") {
        status = await LocationPermission.requestWhenInUse();
      }
      if (status.state !== "granted") {
        if (mounted.current) setError("Permiso de ubicación no concedido");
        return;
      }

      await new Promise<void>((resolve) => {
        Geolocation.getCurrentPosition(
          (pos) => {
            if (!mounted.current) return resolve();
            const fresh: Coords = {
              lat: pos.coords.latitude,
              lon: pos.coords.longitude,
              accuracy: pos.coords.accuracy,
            };
            setCoords(fresh);
            resolve();
          },
          (err) => {
            if (!mounted.current) return resolve();
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
      if (mounted.current) setError(e?.message ?? "Error de ubicación");
    } finally {
      if (mounted.current) setLoading(false);
    }
  }, [enabled]);

  const refresh = useCallback(() => {
    if (!enabled) {
      setCoords(null);
      setLoading(false);
      setError(null);
      return;
    }
    void getCurrentLocation();
  }, [enabled, getCurrentLocation]);

  useEffect(() => {
    mounted.current = true;
    if (enabled) {
      void getCurrentLocation();
    } else {
      setCoords(null);
      setLoading(false);
      setError(null);
    }

    return () => {
      mounted.current = false;
    };
  }, [enabled, getCurrentLocation]);

  return { coords, loading, error, refresh };
}
