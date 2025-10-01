export type DomainErrorKind =
  | "STORAGE_UNAVAILABLE"
  | "LOCATION_PERMISSION_DENIED"
  | "LOCATION_UNAVAILABLE"
  | "NETWORK"
  | "INVALID_DATA"
  | "UNKNOWN";

export class DomainError extends Error {
  readonly kind: DomainErrorKind;
  readonly cause?: unknown;

  private constructor(kind: DomainErrorKind, cause?: unknown) {
    super(kind);
    this.kind = kind;
    this.cause = cause;
  }

  static storage(cause?: unknown) {
    return new DomainError("STORAGE_UNAVAILABLE", cause);
  }

  static locationPermission(cause?: unknown) {
    return new DomainError("LOCATION_PERMISSION_DENIED", { cause });
  }

  static locationUnavailable(cause?: unknown) {
    return new DomainError("LOCATION_UNAVAILABLE", { cause });
  }

  static network(cause?: unknown) {
    return new DomainError("NETWORK", { cause });
  }

  static invalidData(cause?: unknown) {
    return new DomainError("INVALID_DATA", { cause });
  }

  static unknown(cause?: unknown) {
    return new DomainError("UNKNOWN", { cause });
  }
}

export function isDomainError(error: unknown): error is DomainError {
  return error instanceof DomainError;
}
