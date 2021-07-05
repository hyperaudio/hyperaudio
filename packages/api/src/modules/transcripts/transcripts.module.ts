import { Module } from '@nestjs/common';
import { TranscriptsController } from './transcripts.controller';
import { TranscriptsService } from './transcripts.service';
import { transcriptsProviders } from './transcripts.providers';
import { DatabaseModule } from '../database/database.module';

@Module({
  modules: [DatabaseModule],
  controllers: [TranscriptsController],
  components: [
    TranscriptsService,
    ...transcriptsProviders,
  ],
})
export class TranscriptsModule {}
