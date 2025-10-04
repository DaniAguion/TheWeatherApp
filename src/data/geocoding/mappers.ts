import type {LocationSuggestionDto} from "./dto";
import type { Location } from "../../domain/entities/LocationEntities";

// Function to convert LocationSuggestionDto to LocationSuggestion entity
export function locationSuggestionDtoToEntity(dto: LocationSuggestionDto) : Location {
  return {
    name: dto.name,
    administration: dto.admin1,
    country: dto.country,
    coordinates: { lat: dto.latitude, lon: dto.longitude }
  }
};
