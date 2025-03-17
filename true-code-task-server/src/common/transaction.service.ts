import { Inject, Injectable, InternalServerErrorException } from '@nestjs/common';
import { DataSource } from 'typeorm';

@Injectable()
export class TransactionService {
  constructor(@Inject('DATA_SOURCE') private readonly dataSource: DataSource) {}

  async runInTransaction<T>(operation: (queryRunner) => Promise<T>): Promise<T> {
    const queryRunner = this.dataSource.createQueryRunner();
    await queryRunner.connect();
    await queryRunner.startTransaction();

    try {
      const result = await operation(queryRunner);
      await queryRunner.commitTransaction();
      return result;
    } catch (error) {
      await queryRunner.rollbackTransaction();

      throw new InternalServerErrorException('Database operation failed');
    } finally {
      await queryRunner.release();
    }
  }
}
