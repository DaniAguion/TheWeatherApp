export interface ReverseGeoService {
  getLocationName(params: { lat: number; lon: number}): Promise<string>;
}