import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { SMSMessage } from '../entities/sms-message.entity';
import { Constants } from '../enums/constants';
import { ISMSMessageCreateObject, ISMSMessageUpdateObject } from '../interfaces/types';
import { PhoneNumbersService } from '../phone-numbers/phone-numbers.service';
import { Repository } from 'typeorm';
import { OnEvent } from '@nestjs/event-emitter';

@Injectable()
export class SMSMessagesService {


  private logger = new Logger(SMSMessagesService.name);

  constructor(@InjectRepository(SMSMessage) private messagesRepo: Repository<SMSMessage>, private phoneNumbersService: PhoneNumbersService) { }

  async create(newMessage: ISMSMessageCreateObject) {
    try {
      const { phone_number, ...rest } = newMessage;
      const number = await this.phoneNumbersService.findOne(phone_number);
      const savedMessage = await this.messagesRepo.save(this.messagesRepo.create({
        ...rest,
        phone_number: number,
      }));
      return savedMessage;
    } catch (e) {
      this.logger.error({ message: 'Error creating new message', error: e.message });
    }
  }

  async findAll() {
    return await this.messagesRepo.find();
  }

  async findOne(id: number) {
    return await this.messagesRepo.findOne(id);
  }

  async update(updatedMessage: ISMSMessageUpdateObject) {
    const { phone_number, ...rest } = updatedMessage;
    if (phone_number) {
      const number = await this.phoneNumbersService.findOne(phone_number);
      return await this.messagesRepo.save({
        ...rest,
        phone_number: number
      });
    }
    return await this.messagesRepo.save(rest);
  }

  async remove(id: number) {
    return await this.messagesRepo.delete(id);
  }

  async getPhoneNumber(id: number) {
    return (await this.messagesRepo.findOne({ where: { id }, relations: ['phone_number'] })).phone_number;
  }

  async getScheduledMessages() {
    return await this.messagesRepo.find({ where: { status: Constants.SCHEDULED } });
  }


  @OnEvent('hello')
  hello(payload: any) {
    console.log(payload);
  }
}
