import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ContactsModule } from 'src/contacts/contacts.module';
import { SMSMessage } from '../entities/sms-message.entity';
import { PhoneNumbersModule } from '../phone-numbers/phone-numbers.module';
import { SMSMessagesResolver } from './sms-messages.resolver';
import { SMSMessagesService } from './sms-messages.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([SMSMessage]),
    PhoneNumbersModule,
    ContactsModule
  ],
  providers: [
    SMSMessagesResolver,
    SMSMessagesService
  ],
  exports: [
    SMSMessagesService
  ]
})
export class SMSMessagesModule { }
