// Types for Nominatim API responses
export type NominatimAddress = {
  city?: string;
  state?: string;
  "ISO3166-2-lvl4"?: string;
  country: string;
  country_code: string;
  [key: string]: string | undefined;
};

export type NominatimResponse = {
  place_id: number;
  licence: string;
  osm_type: "node" | "way" | "relation";
  osm_id: number;
  lat: string;
  lon: string;
  category: string;
  type: string;
  place_rank: number;
  importance: number;
  addresstype: string;
  name: string;
  display_name: string;
  address: NominatimAddress;
  boundingbox: [string, string, string, string];
};