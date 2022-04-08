import { Module } from '@nestjs/common';
import { MobileAppEventsModule } from 'src/mobile-app-events/mobile-app-events.module';
import { SMSMessagesModule } from 'src/sms-messages/sms-messages.module';
import { ScheduledTasksService } from './scheduled-tasks.service';

@Module({
  imports: [SMSMessagesModule, MobileAppEventsModule],
  providers: [ScheduledTasksService]
})
export class ScheduledTasksModule { }
