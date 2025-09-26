import { DataErrorKind, isDataError } from "../domain/errors/DataError";

const dataErrorMessages: Record<DataErrorKind, string> = {
  "data.invalidData": "Los datos recibidos no son correctos.",
  "data.http": "Error externo:",
  "data.network": "No se ha podido establecer conexión.",
  "data.unknown": "Ha ocurrido un error inesperado.",
};

export function toUIErrorMessage(error: unknown): string {
  if (isDataError(error)) {
    if (error.kind === "data.http" && typeof error.status === "number") {
      return `${dataErrorMessages[error.kind]} HTTP ${error.status}`;
    }
    return dataErrorMessages[error.kind];
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return dataErrorMessages["data.unknown"];
}
