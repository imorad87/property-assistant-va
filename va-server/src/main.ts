import { createBullBoard } from '@bull-board/api';
import { ExpressAdapter } from '@bull-board/express';
import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { Queue } from 'bull';
import { AppModule } from './app.module';

import { BullAdapter } from '@bull-board/api/bullAdapter'

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

  const serverAdapter = new ExpressAdapter()

  const csvQueue = app.get<Queue>('BullQueue_csv');
  const mobileQueue = app.get<Queue>('BullQueue_mobile');
  const messageUpdateQueue = app.get<Queue>('BullQueue_message-update');

  createBullBoard({
    queues: [
      new BullAdapter(csvQueue),
      new BullAdapter(mobileQueue),
      new BullAdapter(messageUpdateQueue),
    ],
    serverAdapter,

  })
  serverAdapter.setBasePath('/bull-board')

  app.use(
    '/bull-board', serverAdapter.getRouter()
  )


  await app.listen(config.get('PORT'), async () => {
    logger.log(`Server is running on ${await app.getUrl()}`)
  });
}
bootstrap();
