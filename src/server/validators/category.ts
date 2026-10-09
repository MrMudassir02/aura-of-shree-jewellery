import { z } from "zod";

export const createCategorySchema = z.object({
  name: z.string().trim().min(2).max(80),

  slug: z
    .string()
    .trim()
    .min(2)
    .max(80)
    .regex(
      /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
      "Slug must contain only lowercase letters, numbers, and hyphens"
    ),

  description: z.string().trim().max(500).optional(),

  imageUrl: z.string().url().optional(),

  isActive: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();
