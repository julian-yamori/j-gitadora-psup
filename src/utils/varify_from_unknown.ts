export function verifyNumFromUnknown(value: unknown): number {
  if (typeof value !== "number" || Number.isNaN(value)) {
    throw Error("faield to verify number");
  }
  return value;
}

export function verifyNumOptFromUnknown(value: unknown): number | undefined {
  if (value === undefined) return undefined;
  return verifyNumFromUnknown(value);
}

export function verifyStrFromUnknown(value: unknown): string {
  if (typeof value !== "string") {
    throw Error("faield to verify string");
  }
  return value;
}

export function verifyStrOptFromUnknown(value: unknown): string | undefined {
  if (value === undefined) return undefined;
  return verifyStrFromUnknown(value);
}

export function verifyBoolFromUnknown(value: unknown): boolean {
  if (typeof value !== "boolean") {
    throw Error("faield to verify boolean");
  }
  return value;
}

export function verifyBoolOptFromUnknown(value: unknown): boolean | undefined {
  if (value === undefined) return undefined;
  return verifyBoolFromUnknown(value);
}

export function verifyObjectFromUnknown(value: unknown): object {
  if (value === null || typeof value !== "object") {
    throw Error("faield to verify object");
  }

  return value;
}
