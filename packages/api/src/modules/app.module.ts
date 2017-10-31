import { Module } from '@nestjs/common';
import { MixesModule } from './mixes/mixes.module';

@Module({
    modules: [MixesModule],
})
export class ApplicationModule {}
