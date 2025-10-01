import { DomainError } from "./DomainError";

export type Result<T> = { success: true; value: T } | { success: false; error: DomainError };