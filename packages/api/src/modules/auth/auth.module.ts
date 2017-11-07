import * as passport from 'passport';
import {
  Module,
  NestModule,
  MiddlewaresConsumer,
  RequestMethod,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { JwtStrategy } from './passport/jwt.strategy';
import { AuthController } from './auth.controller';

@Module({
  components: [
    AuthService,
    JwtStrategy,
  ],
  controllers: [AuthController],
})

export class AuthModule implements NestModule {
  public configure(consumer: MiddlewaresConsumer) {
    consumer
      .apply(passport.authenticate('jwt', { session: false }))
      .forRoutes(
        { path: '/media', method: RequestMethod.POST },
        { path: '/media/*', method: RequestMethod.DELETE },
        { path: '/media/*', method: RequestMethod.PUT },

        { path: '/mixes', method: RequestMethod.POST },
        { path: '/mixes/*', method: RequestMethod.DELETE },
        { path: '/mixes/*', method: RequestMethod.PUT },

        { path: '/transcripts', method: RequestMethod.POST },
        { path: '/transcripts/*', method: RequestMethod.DELETE },
        { path: '/transcripts/*', method: RequestMethod.PUT },

        { path: '/accounts', method: RequestMethod.POST },
        { path: '/accounts/*', method: RequestMethod.DELETE },
        { path: '/accounts/*', method: RequestMethod.PUT },
      );

  }
}
