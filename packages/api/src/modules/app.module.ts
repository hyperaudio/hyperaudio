import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { MixesModule } from './mixes/mixes.module';
import { MediaModule } from './media/media.module';
import { TranscriptsModule } from './transcripts/transcripts.module';
import { AccountsModule } from './accounts/accounts.module';
import { CorsMiddleware } from './middleware/cors.middleware';
import { OrgsMiddleware } from './middleware/organisations.middleware';
import { AuthModule } from './auth/auth.module';

@Module({
    modules: [AuthModule, MixesModule, MediaModule, TranscriptsModule, AccountsModule],
})
export class ApplicationModule {
  configure(consumer: MiddlewaresConsumer): void {

    consumer.apply(CorsMiddleware).forRoutes({
      path: '/*'
    });

    consumer.apply(OrgsMiddleware).forRoutes({
      path: '/*'
    });
  }
}
