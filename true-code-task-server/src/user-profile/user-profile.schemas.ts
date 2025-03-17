import { z } from 'zod';

export const UserProfileSchema = z.object({
  login: z.string().min(3, 'Логин должен содержать минимум 3 символа'),
  firstname: z.string().optional(),
  lastname: z.string().optional(),
  info: z.string().optional(),
  email: z.string().email('Некорректный email').optional(),
  phone: z
    .string()
    .regex(/^\+?[1-9]\d{1,14}$/, 'Некорректный номер телефона')
    .optional(),
  fileId: z.string().uuid('Некорректный fileId').optional(),
});

export type UserProfileDto = z.infer<typeof UserProfileSchema>;
