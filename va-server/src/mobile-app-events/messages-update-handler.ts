import { Process, Processor } from "@nestjs/bull";
import { Logger } from "@nestjs/common";
import Bull from "bull";
import { SMSMessagesService } from "src/sms-messages/sms-messages.service";
import { MobileAppEventsGateway } from "./mobile-app-events.gateway";

@Processor('message-update')
export class MessagesUpdateHandler {

    private readonly logger = new Logger(MessagesUpdateHandler.name);

    constructor(private smsService: SMSMessagesService) { }

    @Process('update-message')
    async updateMessage(job: Bull.Job) {

        await this.smsService.setMessageStatus(job.data.messageId, job.data.status, job.data.statusMessage);
    }
}