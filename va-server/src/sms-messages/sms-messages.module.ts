import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SMSMessage } from 'src/entities/sms-message.entity';
import { PhoneNumbersModule } from 'src/phone-numbers/phone-numbers.module';
import { SMSMessagesResolver } from './sms-messages.resolver';
import { SMSMessagesService } from './sms-messages.service';

@Module({
  imports: [TypeOrmModule.forFeature([SMSMessage]), PhoneNumbersModule],
  providers: [SMSMessagesResolver, SMSMessagesService],
  exports: [SMSMessagesService]
})
export class SMSMessagesModule { }
