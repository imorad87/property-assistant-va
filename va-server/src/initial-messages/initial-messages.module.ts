import { Module } from '@nestjs/common';
import { InitialMessagesService } from './initial-messages.service';
import { InitialMessagesResolver } from './initial-messages.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InitialMessage } from '../entities/initial-message.entity';

@Module({
  imports: [TypeOrmModule.forFeature([InitialMessage])],
  providers: [InitialMessagesService, InitialMessagesResolver],
  exports: [InitialMessagesService]
})
export class InitialMessagesModule { }
