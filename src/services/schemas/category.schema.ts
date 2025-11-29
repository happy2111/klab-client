// src/services/schemas/category.schema.ts
import { z } from "zod";

// === Создание категории ===
export const createCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  slug: z.string().min(1, "Slug is required"),
});

export type CreateCategoryDto = z.infer<typeof createCategorySchema>;

// === Обновление категории ===
export const updateCategorySchema = createCategorySchema.partial();

export type UpdateCategoryDto = z.infer<typeof updateCategorySchema>;
