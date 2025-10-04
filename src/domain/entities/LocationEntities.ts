export type Coordinates = {
  lat: number;
  lon: number;
};

export type Location = {
  name?: string;
  administration?: string;
  country?: string;
  coordinates: Coordinates;
};

export type LocationSuggestion = {
  id: string;
  name: string;
  country?: string;
  admin1?: string;
  coordinates: Coordinates;
};

