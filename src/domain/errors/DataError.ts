export type DataErrorKind =
  | "data.http"
  | "data.network"
  | "data.unknown";

export class DataError extends Error {
  readonly kind: DataErrorKind;
  readonly status?: number;

  private constructor(kind: DataErrorKind, options?: { cause?: unknown; status?: number }) {
    super(kind);
    this.kind = kind;
    this.status = options?.status;
    if (options?.cause !== undefined) {
      (this as any).cause = options.cause;
    }
  }

  static http(status: number) {
    return new DataError("data.http", { status });
  }

  static network(cause?: unknown) {
    return new DataError("data.network", { cause });
  }

  static unknown(cause?: unknown) {
    return new DataError("data.unknown", { cause });
  }
}

export function isDataError(error: unknown): error is DataError {
  return error instanceof DataError;
}
