import { z } from 'zod';

import { WithId } from 'src/common';

export const CommentBaseSchema = z.object({
  author: z.string().optional(),
  message: z.string().min(1, 'Неверно задано или отстутствует поле message'),
  publish_at: z.coerce.date().optional(),
  fileIds: z.array(z.string()).optional(),
});

export const CommentIdSchema = z.coerce
  .number({ message: 'Некорретный id комментария' })
  .positive('Некорретный id комментария');

export const CommentsQuerySchema = z.object({
  page: z.coerce.number().min(0, 'Некорректный номер страницы').optional().default(0),
  size: z.coerce.number().min(1, 'Некорректное количество записей').optional().default(3),
  sortField: z.enum(['publish_at'], { message: 'Неверное поле сортировки' }).optional(),
  sortDirection: z
    .string()
    .optional()
    .default('ASC')
    .transform((val) => val.toUpperCase())
    .pipe(z.enum(['ASC', 'DESC'], { message: 'Неверное направление сортировки' })),
});

export type CommentBaseDto = z.infer<typeof CommentBaseSchema>;
export type CommentDto = WithId<CommentBaseDto>;
export type CommentsQueryDto = z.infer<typeof CommentsQuerySchema>;
