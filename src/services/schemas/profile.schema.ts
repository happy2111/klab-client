import { z } from "zod";

export const updateProfileSchema = z.object({
  name: z.string().min(1, 'Имя обязательно').optional(),
  phone: z.string().optional(),
  email: z.string().email('Некорректный формат email').optional(),
}).refine(data => data.name || data.phone || data.email, {
  message: 'Хотя бы одно поле должно быть заполнено для обновления',
  path: ['name'], // Указывает, где отображать ошибку
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(6, 'Текущий пароль должен содержать минимум 6 символов'),
  newPassword: z.string().min(6, 'Новый пароль должен содержать минимум 6 символов'),
});


export const userProfileSchema = z.object({
  id: z.string(),
  email: z.string().email(),
  phone: z.string().nullable(),
  name: z.string().nullable(),
  role: z.enum(['ADMIN', 'SELLER', 'CLIENT']),
  products: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    description: z.string().nullable(),
    photo: z.string().nullable(),
    stock: z.string().nullable(),
    isActive: z.boolean(),
    createdAt: z.string(),
    updatedAt: z.string(),
  })),
  createdAt: z.string(),
  updatedAt: z.string(),
});

export type UpdateProfileDto = z.infer<typeof updateProfileSchema>;
export type ChangePasswordDto = z.infer<typeof changePasswordSchema>;
export type UserProfile = z.infer<typeof userProfileSchema>;