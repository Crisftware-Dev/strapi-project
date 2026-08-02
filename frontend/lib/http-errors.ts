export const FORBIDDEN_MESSAGE = "No tiene permisos para realizar estos cambios";

export function isWriteMethod(method?: string): boolean {
  const m = (method ?? "GET").toUpperCase();
  return ["POST", "PUT", "PATCH", "DELETE"].includes(m);
}

export function isForbiddenWrite(status: number, method?: string): boolean {
  return status === 403 && isWriteMethod(method);
}
