export type NumericInput = number | string;

export const toNumber = (value: NumericInput | undefined | null): number =>
  Number(value ?? 0) || 0;
