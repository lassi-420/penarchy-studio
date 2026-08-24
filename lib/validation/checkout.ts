import { z } from "zod";

export const contactSchema = z.object({
  email: z.string().email("Enter a valid email address"),
  newsletterOptIn: z.boolean().optional(),
});

export const shippingSchema = z.object({
  fullName: z.string().min(2, "Enter your full name"),
  line1: z.string().min(3, "Enter a street address"),
  line2: z.string().optional(),
  city: z.string().min(1, "Enter a city"),
  state: z.string().optional(),
  postalCode: z.string().min(2, "Enter a postal code"),
  country: z.string().min(2, "Select a country"),
  phone: z.string().optional(),
});

export const paymentSchema = z.object({
  method: z.enum(["card", "paypal", "cod", "bank_transfer"]),
});

export type ContactValues = z.infer<typeof contactSchema>;
export type ShippingValues = z.infer<typeof shippingSchema>;
export type PaymentValues = z.infer<typeof paymentSchema>;
