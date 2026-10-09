import { z } from "zod";

const imageSchema = z.object({
  url: z.string().url(),
  publicId: z.string().min(1),
});

export const createProductSchema = z.object({
  name: z.string().trim().min(2).max(150),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(150)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  description: z.string().trim().min(10).max(3000),

  category: z.string().min(1),

  price: z.number().nonnegative(),

  compareAtPrice: z.number().nonnegative().optional(),

  stock: z.number().int().nonnegative(),

  sku: z.string().trim().min(1).max(50),

  images: z.array(imageSchema).min(1),

  isFeatured: z.boolean().optional(),
});

export const updateProductSchema = createProductSchema.partial();

export const productQuerySchema = z.object({
  category: z.string().optional(),

  featured: z
    .enum(["true", "false"])
    .transform((value) => value === "true")
    .optional(),

  limit: z.coerce.number().int().min(1).max(50).default(20),

  skip: z.coerce.number().int().min(0).default(0),
});
