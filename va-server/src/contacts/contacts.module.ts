import { Module } from '@nestjs/common';
import { ContactsService } from './contacts.service';
import { ContactsResolver } from './contacts.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Contact } from '../entities/contact.entity';
import { PropertyResolver } from './properties/property.resolver';
import { PropertiesService } from './properties/propert.service';
import { Property } from '../entities/property.entity';
import { SMSMessage } from 'src/entities/sms-message.entity';
import { InitialMessagesModule } from 'src/initial-messages/initial-messages.module';
import { PhoneNumber } from 'src/entities/phone-number.entity';

@Module({
  imports: [
    TypeOrmModule.forFeature([
      Contact,
      Property,
      SMSMessage,
      PhoneNumber
    ]),
    InitialMessagesModule
  ],
  providers: [
    ContactsService,
    ContactsResolver,
    PropertyResolver,
    PropertiesService,
  ],
  exports: [ContactsService, PropertiesService]
})
export class ContactsModule { }
