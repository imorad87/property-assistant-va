import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import Bull from "bull";
import { SMSMessage } from "src/entities/sms-message.entity";
import { Constants } from "src/enums/constants";
import { SMSMessagesService } from "src/sms-messages/sms-messages.service";
import { MobileAppEventsGateway } from "./mobile-app-events.gateway";

@Processor('mobile')
export class MessagesQueueHandler {

    private readonly logger = new Logger(MessagesQueueHandler.name);

    constructor(private mobileGateway: MobileAppEventsGateway, private smsService: SMSMessagesService) { }

    @Process('new-message')
    async sendToMobile(job: Bull.Job) {
        const messageToSend: SMSMessage = job.data;

        await this.mobileGateway.sendSMS(messageToSend);

        await this.smsService.setMessageStatus(messageToSend.id, Constants.QUEUED, 'Waiting in queue');
    }

}