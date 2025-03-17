import { z } from 'zod';

export const FileSchema = z.object({
  mimetype: z.enum(['image/jpeg', 'image/png', 'image/gif', 'image/webp']),
  size: z.number().max(5 * 1024 * 1024, 'Файл слишком большой (макс. 5MB)'),
});
