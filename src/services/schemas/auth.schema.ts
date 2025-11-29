import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

export type LoginDto = z.infer<typeof loginSchema>;

export const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  name: z.string().optional(),
  role: z.enum(['ADMIN', 'SELLER', 'CLIENT']).optional(),
});

export type RegisterDto = z.infer<typeof registerSchema>;
