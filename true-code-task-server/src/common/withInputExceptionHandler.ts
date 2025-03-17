import { Response } from 'express';
import { ZodError } from 'zod';
import { HttpStatus } from '@nestjs/common';

export async function withInputExceptionHandler<T>(operation: () => Promise<T>, res: Response): Promise<T> {
  try {
    return await operation();
  } catch (e) {
    if (e instanceof ZodError) {
      res.status(HttpStatus.BAD_REQUEST).json({ ...e, message: 'Ошибка параметров запроса' });
    }
    throw e;
  }
}
