import { Module } from '@nestjs/common';
import { WithTokenGuard } from './withToken.guard';
import { databaseProvider } from './database.provider';
import { TransactionService } from './transaction.service';

@Module({
  providers: [WithTokenGuard, databaseProvider, TransactionService],
  exports: [WithTokenGuard, TransactionService],
})
export class CommonModule {}
