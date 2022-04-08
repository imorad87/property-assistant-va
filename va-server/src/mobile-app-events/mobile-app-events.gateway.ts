import { EventEmitter2 } from '@nestjs/event-emitter';
import { SubscribeMessage, WebSocketGateway, WebSocketServer } from '@nestjs/websockets';
import { Server } from 'socket.io';

@WebSocketGateway({
  cors: {
    origin: '*',
  },
})
export class MobileAppEventsGateway {

  constructor(private eventEmmiter: EventEmitter2) { }

  @WebSocketServer()
  private server: Server;

  @SubscribeMessage('received-sms-event')
  handleReceievedMessage(client: any, payload: any) {
    // console.log('Hello world!');
    this.eventEmmiter.emit('hello', 'worlddldldlddldl');
  }

  @SubscribeMessage('send-sms-confirmation-event')
  handleConfrimationOfSentMessage(client: any, payload: any) {
    console.log('Hello world!');
  }

  sendSMS(data) {
    this.server.emit('send-sms-event', data);
  }

}
