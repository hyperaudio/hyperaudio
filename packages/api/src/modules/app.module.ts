import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { MixesModule } from './mixes/mixes.module';
import { MediaModule } from './media/media.module';
import { TranscriptsModule } from './transcripts/transcripts.module';
import { AccountsModule } from './accounts/accounts.module';
import { CorsMiddleware } from './middleware/cors.middleware';
import { OrgsMiddleware } from './middleware/organisation.middleware';
import { AuthMiddleware } from './middleware/auth.middleware';
import { AuthModule } from './auth/auth.module';
import { RootController } from './root/root.controller';

@Module({
  modules: [AuthModule, MixesModule, MediaModule, TranscriptsModule, AccountsModule],
  controllers: [RootController]
})
export class ApplicationModule {
  configure(consumer: MiddlewaresConsumer): void {

    consumer.apply(CorsMiddleware).forRoutes({
      path: '/*'
    });

    consumer.apply(OrgsMiddleware).forRoutes({
      path: '/*'
    });

    consumer.apply(AuthMiddleware).forRoutes({
      path: '/*'
    });

  }
}
