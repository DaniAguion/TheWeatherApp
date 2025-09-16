import { useEffect, useRef, useState } from "react";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Geolocation from "react-native-geolocation-service";
import { LocationPermission } from "../native/LocationPermission";

type Coords = { lat: number; lon: number; accuracy?: number };

const LAST_LOCATION_KEY = "lastLocation";

export function useCurrentLocation(defaultLocation: Coords | null = null) {
  const [coords, setCoords] = useState<Coords | null>(defaultLocation);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const mounted = useRef(true);

  useEffect(() => {
    mounted.current = true;
    (async () => {
      try {
        // Read last known location from storage to show something quickly
        const cached = await AsyncStorage.getItem(LAST_LOCATION_KEY);
        if (cached && mounted.current && !coords) {
          const c = JSON.parse(cached) as Coords;
          setCoords(c);
        }

        // Check location permission and request if not granted
        const services = await LocationPermission.isLocationEnabled();
        if (!services) {
          setError("Servicios de ubicación desactivados");
          setLoading(false);
          return;
        }

        let status = await LocationPermission.checkStatus();
        if (status.state !== "granted") {
          status = await LocationPermission.requestWhenInUse();
        }
        if (status.state !== "granted") {
          setError("Permiso de ubicación no concedido");
          setLoading(false);
          return;
        }

        // Get current location and save it
        await new Promise<void>((resolve) => {
          Geolocation.getCurrentPosition(
            async (pos) => {
              if (!mounted.current) return resolve();
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
    })();

    return () => {
      mounted.current = false;
    };
  }, []);

  return { coords, loading, error };
}
