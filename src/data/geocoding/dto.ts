export type LocationSuggestionDto = {
  id?: number;
  name: string;
  country?: string;
  admin1?: string;
  latitude: number;
  longitude: number;
};


export type OpenMeteoGeocodingResponse = {
  results?: Array<LocationSuggestionDto>;
};