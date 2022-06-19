import { InjectQueue } from '@nestjs/bull';
import { Logger } from '@nestjs/common';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Queue } from 'bull';
import { Server } from 'socket.io';
import { ContactsService } from 'src/contacts/contacts.service';
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

    @InjectQueue('message-update') private readonly messageUpdateQueue: Queue,
  ) { }

  @SubscribeMessage('sms-received-event')
  private async handleReceievedMessage(client: any, payload: IncomingEvent) {
    await this.messageUpdateQueue.add('message-received', payload);
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
      status,
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
      status,
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

    this.logger.log(`Sending Message To Mobile: ${JSON.stringify(message)} in 10 seconds`);
    await new Promise(resolve => setTimeout(resolve, 10000));

    this.server.emit('sms-send-event', message);
  }
}
