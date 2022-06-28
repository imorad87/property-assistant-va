import { InjectQueue } from '@nestjs/bull';
import { Injectable, Logger } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import Bull, { Queue } from 'bull';
import { SMSMessage } from 'src/entities/sms-message.entity';
import { MobileAppEventsGateway } from 'src/mobile-app-events/mobile-app-events.gateway';
import { SMSMessagesService } from '../sms-messages/sms-messages.service';

@Injectable()
export class ScheduledTasksService {

    private logger = new Logger(ScheduledTasksService.name);

    constructor(
        @InjectQueue('mobile') private readonly mobileQueue: Queue,
        private messageService: SMSMessagesService,
        private scheduleRegistry: SchedulerRegistry,
        private mae: MobileAppEventsGateway
    ) { }

    @Cron(CronExpression.EVERY_30_SECONDS, { name: 'getScheduledMessages' })
    async getScheduledMessages() {

        const scheduledMessages = await this.messageService.getScheduledMessages();

        this.logger.log(`Numbers Of Messages To Send: ${scheduledMessages.length}`);

        const jobs = [];

        for (const message of scheduledMessages) {
            const match = (await this.mobileQueue.getJobs(['paused', 'active', 'delayed', 'waiting'])).find(job => {
                const jobData: SMSMessage = job.data;
                return jobData.id == message.id;
            });

            if (match) {
                continue;
            }
            jobs.push({
                data: message,
                name: 'new-message',
                opts: {
                    lifo: true
                }
            });
        }

        await this.mobileQueue.addBulk(jobs);
    }
}
