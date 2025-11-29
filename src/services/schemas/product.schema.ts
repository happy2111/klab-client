import { z } from "zod";

export const createProductSchema = z.object({
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  photo: z.string().optional(),
  stock: z.number().optional(),
  isActive: z.boolean().optional(),
  categoryId: z.string(),
});

export const updateProductSchema = createProductSchema.partial();

export const filterProductSchema = z.object({
  categoryId: z.string().optional(),
  createdFrom: z.string().optional(),
  createdTo: z.string().optional(),
  search: z.string().optional(),
  page: z.number().optional(),
  limit: z.number().optional(),
});

export type CreateProductDto = z.infer<typeof createProductSchema>;
export type UpdateProductDto = z.infer<typeof updateProductSchema>;
export type FilterProductDto = z.infer<typeof filterProductSchema>;
