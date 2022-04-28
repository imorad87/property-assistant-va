import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { MobileAppEventsModule } from 'src/mobile-app-events/mobile-app-events.module';
import { SMSMessagesModule } from 'src/sms-messages/sms-messages.module';
import { ScheduledTasksService } from './scheduled-tasks.service';

@Module({
  imports: [
    SMSMessagesModule,
    MobileAppEventsModule,
    BullModule.registerQueue({
      name: 'mobile',
      limiter: {
        max: 1,
        duration: 5000
      }
   }),
    
  ],
  providers: [ScheduledTasksService]
})
export class ScheduledTasksModule { }
