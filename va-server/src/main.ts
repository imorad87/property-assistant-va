import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';


const logger = new Logger('Server');

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: [
      'debug',
      'error',
      'log',
      'warn'
    ],
    cors: true
  });
  const config = app.get(ConfigService);
  await app.listen(config.get('PORT'), async () => {
    logger.log(`Server is running on ${await app.getUrl()}`)
  });
}
bootstrap();
