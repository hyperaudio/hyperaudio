import { Module, NestModule, MiddlewaresConsumer, RequestMethod } from '@nestjs/common';
import { MixesModule } from './mixes/mixes.module';
import { CorsMiddleware } from './middleware/cors.middleware';
import { OrgsMiddleware } from './middleware/organisations.middleware';


@Module({
    modules: [MixesModule],
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
