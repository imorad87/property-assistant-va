import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ContactsModule } from 'src/contacts/contacts.module';
import { ChatbotModule } from '../chatbot/chatbot.module';
import { PhoneNumbersModule } from '../phone-numbers/phone-numbers.module';
import { SMSMessagesModule } from '../sms-messages/sms-messages.module';
import { MessagesQueueHandler } from './messages-queue-handler';
import { MessagesUpdateHandler } from './messages-update-handler';
import { MobileAppEventsGateway } from './mobile-app-events.gateway';

@Module({
    imports: [
        ContactsModule,
        ChatbotModule,
        SMSMessagesModule,
        PhoneNumbersModule,
        BullModule.registerQueue({
            name: 'message-update',
        }),
    ],
    providers: [
        MobileAppEventsGateway,
        MessagesQueueHandler,
        MessagesUpdateHandler,
    ],
    exports: [
        MobileAppEventsGateway,
        MessagesQueueHandler
    ]
})
export class MobileAppEventsModule { }
