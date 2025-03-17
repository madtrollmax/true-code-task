import { z } from 'zod';

export const LoginSchema = z.object({
  login: z.string().min(3, 'Минимум 3 символа'),
  password: z.string().min(6, 'Минимум 6 символов'),
});
export type LoginDto = z.infer<typeof LoginSchema>;
