import { z } from "zod";

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(20),
});

const shippingAddressSchema = z.object({
  fullName: z.string().trim().min(2).max(100),
  phone: z
    .string()
    .trim()
    .regex(/^[6-9]\d{9}$/, "Enter a valid Indian mobile number"),
  addressLine1: z.string().trim().min(5).max(200),
  addressLine2: z.string().trim().max(200).optional(),
  city: z.string().trim().min(2).max(100),
  state: z.string().trim().min(2).max(100),
  postalCode: z
    .string()
    .trim()
    .regex(/^\d{6}$/, "Enter a valid 6-digit postal code"),
  country: z.string().trim().min(2).max(60).default("India"),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1).max(20),
  shippingAddress: shippingAddressSchema,
});

export type CreateOrderInput = z.infer<typeof createOrderSchema>;
