import { InjectQueue } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Queue } from 'bull';
import { Server } from 'socket.io';
import { SMSMessage } from 'src/entities/sms-message.entity';
import { ChatbotService } from '../chatbot/chatbot.service';
import { Constants } from '../enums/constants';
import { PhoneNumbersService } from '../phone-numbers/phone-numbers.service';
import { SMSMessagesService } from '../sms-messages/sms-messages.service';


class IncomingEvent {
  numberId?: number;
  number: string;
  messageId?: number;
  message: string;
  status?: string;
  error?: string;
}

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MobileAppEventsGateway {

  @WebSocketServer()
  private server: Server;

  private logger = new Logger(MobileAppEventsGateway.name);

  constructor(
    private chatbotService: ChatbotService,
    private phoneNumbersService: PhoneNumbersService,
    private smsService: SMSMessagesService,
    @InjectQueue('message-update') private readonly messageUpdateQueue: Queue,
  ) { }

  @SubscribeMessage('sms-received-event')
  private async handleReceievedMessage(client: any, payload: IncomingEvent) {
    try {
      this.logger.log(`New Message Recieved: ${JSON.stringify(payload)}`);

      const from: string = payload.number;

      const foundNumber = await this.phoneNumbersService.findByNumber(from.replace('+', ''));

      if (foundNumber) {

        this.logger.log(`Found a matching number ${foundNumber.number}`);

        const response = (await this.chatbotService.getResponse(payload.message)).answer;

        const classification = this.chatbotService.getClassification(payload.message);

        //create a message for the received one
        const recievedMessage = await this.smsService.create({
          body: payload.message,
          status: Constants.RECEIEVED,
          status_message: 'recieved message',
          type: Constants.INCOMING,
          phone_number: foundNumber.id,
          active: foundNumber.active
          // TODO: handle classification
        });

        //create a message for the response
        const responseMessage = await this.smsService.create({
          body: response,
          status: Constants.SCHEDULED,
          status_message: 'To be sent',
          type: Constants.OUTGOING,
          phone_number: foundNumber.id,
          active: foundNumber.active
          // TODO: handle classification
        });

        // if (foundNumber.active) {

        //   this.sendSMS(responseMessage);
        // }
      }

    } catch (error) {
      console.error(error);
    }
  }

  @SubscribeMessage('sms-sent-event')
  private async handleSentMessage(client: any, payload: IncomingEvent) {

    this.logger.log(`Message Sent: ${JSON.stringify(payload)}`);

    const numberId: number = payload.numberId;

    const number: string = payload.number;

    const messageId: number = payload.messageId;

    const message: string = payload.message;

    const status: string = payload.status;

    const error: string = payload.error;

    await this.messageUpdateQueue.add('update-message', {
      messageId,
      status: Constants.SENT,
      statusMessage: error ? error : status
    })
  }

  @SubscribeMessage('sms-delivered-event')
  private async handleDelieveredMessage(client: any, payload: IncomingEvent) {

    this.logger.log(`Message Delievered: ${JSON.stringify(payload)}`);

    const numberId: number = payload.numberId;

    const number: string = payload.number;

    const messageId: number = payload.messageId;

    const message: string = payload.message;

    const status: string = payload.status;

    const error: string = payload.error;

    await this.messageUpdateQueue.add('update-message', {
      messageId,
      status: Constants.DELIVERED,
      statusMessage: error ? error : status
    })
  }

  async sendSMS(messageToSend: SMSMessage) {
    const number = messageToSend.phone_number;

    const message = {
      numberId: number.id,

      number: number.number,

      messageId: messageToSend.id,

      message: messageToSend.body,
    }

    this.logger.log(`Sending Message To Mobile: ${JSON.stringify(message)}`);

    this.server.emit('sms-send-event', message);
  }
}
