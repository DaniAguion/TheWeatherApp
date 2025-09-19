// Code to interact with Nominatim API for reverse geocoding

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


// Function to fetch the location name using Nominatim reverse geocoding
export async function fetchLocatioName(lat: number, lon: number): Promise<string> {
  const url = `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&zoom=10&format=jsonv2`;
  const response = await fetch(url, {headers: {"User-Agent": "MyWeatherApp/1.0 (myemail@example.com)"}
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  const data = (await response.json()) as NominatimResponse;
  console.log("Nominatim data:", data);
  return data.name;
}