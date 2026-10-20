import { z } from "zod";

export const createInvoiceSchema = (maxAmount: number) =>
  z.object({
    amount: z
      .number()
      .refine((value) => Number.isFinite(value) && value > 0, {
        message: "El monto debe ser mayor a cero.",
      })
      .refine((value) => value <= maxAmount, {
        message: "El monto no puede superar el saldo pendiente disponible.",
      }),
    detail: z
      .string()
      .max(500, "El detalle no puede superar los 500 caracteres.")
      .optional(),
  });

export type CreateInvoiceValues = z.infer<
  ReturnType<typeof createInvoiceSchema>
>;
