import { z } from "zod";

export const bookingSchema = z.object({
  tourId: z.string().min(1, "ID тура обязателен"),
  customer: z.object({
    name: z.string().min(2, "Имя должно содержать минимум 2 символа"),
    phone: z.string().regex(/^\+?[0-9\s\-()]{10,}$/, "Неверный формат телефона"),
    email: z.string().email("Неверный формат email").optional().or(z.literal("")),
    telegram: z.string().optional(),
  }),
  details: z.object({
    startDate: z.string(),
    endDate: z.string(),
    days: z.number().min(1),
    persons: z.number().min(1, "Минимум 1 человек"),
  }),
  comment: z.string().optional(),
});

export type BookingInput = z.infer<typeof bookingSchema>;
