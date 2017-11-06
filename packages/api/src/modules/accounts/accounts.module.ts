import { Module } from '@nestjs/common';
import { AccountsController } from './accounts.controller';
import { AccountsService } from './accounts.service';
import { accountsProviders } from './accounts.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  modules: [DatabaseModule],
  controllers: [AccountsController],
  components: [
    AccountsService,
    ...accountsProviders,
  ],
})
export class AccountsModule {}
