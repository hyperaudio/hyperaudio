import * as dotenv from 'dotenv';
import * as bodyParser from 'body-parser';
import { NestFactory } from '@nestjs/core';
import { ApplicationModule } from './modules/app.module';

async function bootstrap() {
  dotenv.config();
  const app = await NestFactory.create(ApplicationModule);
  app.use(bodyParser.json()); // TODO allow large JSON posting
  await app.listen(8080);
}
bootstrap();
