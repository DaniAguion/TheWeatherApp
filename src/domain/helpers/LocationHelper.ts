import { Location, Coordinates } from "../entities/LocationEntities";


// Check if location has valid coordinates
export function isValidLocation(loc: Location): Boolean {
  const coord = loc.coordinates;
  return (
    Number.isFinite(coord.lat) &&
    Number.isFinite(coord.lon) &&
    coord.lat >= -90 && coord.lat <= 90 &&
    coord.lon >= -180 && coord.lon <= 180
  );
}


// Normalize location by rounding coordinates to one decimal place
export function normalizeLocation(loc: Location): Location {
  const coord = loc.coordinates;
  const isValidCoordinates = (
    Number.isFinite(coord.lat) &&
    Number.isFinite(coord.lon) &&
    coord.lat >= -90 && coord.lat <= 90 &&
    coord.lon >= -180 && coord.lon <= 180
  );

  if (!isValidCoordinates) {
    throw new Error("Invalid coordinates");
  }

  const normalizeCoordinates : Coordinates = {
    lat: Math.round(coord.lat * 10) / 10,
    lon: Math.round(coord.lon * 10) / 10,
  }

  return {
    ...loc,
    coordinates: normalizeCoordinates,
  };
}

// Check if two locations are the same based on their coordinates
// or names (if coordinates are close enough)
export function sameLocation(a: Location, b: Location): boolean {
  if (!a || !b) {
    return false;
  }
  return (
    (a.coordinates.lat === b.coordinates.lat && a.coordinates.lon === b.coordinates.lon) ||
    (typeof a.name === "string" && typeof b.name === "string" && a.name == b.name &&
      Math.abs(a.coordinates.lat - b.coordinates.lat) <= 1 && Math.abs(a.coordinates.lon - b.coordinates.lon) <= 1)
  );
}