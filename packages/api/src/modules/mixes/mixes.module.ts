import { Module } from '@nestjs/common';
import { MixesController } from './mixes.controller';
import { MixesService } from './mixes.service';
import { mixesProviders } from './mixes.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  modules: [DatabaseModule],
  controllers: [MixesController],
  components: [
    MixesService,
    ...mixesProviders,
  ],
})
export class MixesModule {}
