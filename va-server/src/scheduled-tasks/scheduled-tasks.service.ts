import { Injectable } from '@nestjs/common';
import { Cron, CronExpression, SchedulerRegistry } from '@nestjs/schedule';
import { SMSMessagesService } from '../sms-messages/sms-messages.service';
import { isEmpty } from 'lodash';
import { WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';
import { MobileAppEventsGateway } from 'src/mobile-app-events/mobile-app-events.gateway';
@Injectable()
export class ScheduledTasksService {

    @WebSocketServer()
    private server: Server;


    constructor(private scheduleRegistry: SchedulerRegistry, private messageService: SMSMessagesService, private mae: MobileAppEventsGateway) { }


    @Cron(CronExpression.EVERY_5_SECONDS, { name: 'getScheduledMessages' })
    async getScheduledMessages() {
        const scheduledMessages = await this.messageService.getScheduledMessages();

        this.mae.sendSMS(scheduledMessages);

        if (!isEmpty(scheduledMessages)) {
            // TODO: add messages to the queue to be sent the mobile app

        }
    }
}
