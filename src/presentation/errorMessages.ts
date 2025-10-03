import { DomainErrorKind, isDomainError } from "../domain/errors/DomainError";

const dataErrorMessages: Record<DomainErrorKind, string> = {
  "STORAGE_UNAVAILABLE": "Ha ocurrido un error al acceder a la información.",
  "LOCATION_PERMISSION_DENIED": "Permiso de ubicación denegado. \n Otorge permiso para acceder a la ubicación.",
  "LOCATION_UNAVAILABLE": "No se pudo obtener la ubicación.",
  "NETWORK": "Error de red. Por favor, verifica tu conexión a internet.",
  "INVALID_DATA": "Los datos no son válidos.",
  "UNKNOWN": "Ha ocurrido un error inesperado.",
};

export function toUIErrorMessage(error: unknown): string {
  if (isDomainError(error)) {
    return dataErrorMessages[error.kind];
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return dataErrorMessages["UNKNOWN"];
}
