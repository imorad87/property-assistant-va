import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { isEmpty } from 'lodash';
import { ContactsService } from 'src/contacts/contacts.service';
import { PropertiesService } from 'src/contacts/properties/propert.service';
import { Repository } from 'typeorm';
import { SMSMessage } from '../entities/sms-message.entity';
import { Constants } from '../enums/constants';
import { ISMSMessageCreateObject, ISMSMessageUpdateObject } from '../interfaces/types';
import { PhoneNumbersService } from '../phone-numbers/phone-numbers.service';
@Injectable()
export class SMSMessagesService {
  async getUnrespondedMessages() {

    const messages = [];

    const properties = await this.propertiesService.findAll();

    for (const property of properties) {

      const contacts = property.contacts;

      for (const contact of contacts) {
        const numbers = contact.phone_numbers;
        for (const number of numbers) {
          const message = await this.messagesRepo
            .createQueryBuilder('message')
            .where('message.phoneNumberId = :id', { id: number.id })
            .orderBy('created_at', 'DESC')
            .getOne();
          if (!isEmpty(message) && message.type === Constants.INCOMING) {
            messages.push(message);
          }
        }
      }

    }
    return messages;
  }


  private logger = new Logger(SMSMessagesService.name);

  constructor(@InjectRepository(SMSMessage) private messagesRepo: Repository<SMSMessage>, private phoneNumbersService: PhoneNumbersService, private contactsService: ContactsService, private propertiesService: PropertiesService) { }

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
      console.log(e);

      this.logger.error({ message: 'Error creating new message', error: e.message });
    }
  }

  async createMany(newMessages: SMSMessage[]) {
    return await this.messagesRepo.insert(newMessages);
  }

  async findAll() {
    return await this.messagesRepo.find();
  }

  async findOne(id: number) {
    return await this.messagesRepo.findOne({ where: { id } });
  }

  async update(updatedMessage: ISMSMessageUpdateObject) {
    const { phone_number, ...rest } = updatedMessage;

    // if (phone_number) {

    //   const number = await this.phoneNumbersService.findOne(phone_number);

    //   return await this.messagesRepo.save({
    //     ...rest,
    //     phone_number: number
    //   });
    // }

    return await this.messagesRepo.save(rest);
  }

  async remove(id: number) {
    const sms = await this.findOne(id);
    if (!sms) {
      throw new Error(`SMS with id ${id} doesn't exist`);
    }
    await this.messagesRepo.delete(id);
    return true;
  }

  async setMessageStatus(id: number, status: string, statusMessage: string) {
    try {
      const message = await this.messagesRepo.findOne({ where: { id } });
      message.status = status;
      message.status_message = statusMessage;
      await this.messagesRepo.save(message);
    } catch (error) {
      console.log(error);
    }
  }

  async getPhoneNumber(id: number) {
    return (await this.messagesRepo.findOne({ where: { id }, relations: ['phone_number'] })).phone_number;
  }

  async getScheduledMessages() {
    return await this.messagesRepo.find({ where: { status: Constants.SCHEDULED, active: true }, relations: ['phone_number'] });
  }


  async getLatestOutgoingMessages(id: number) {
    return await this.messagesRepo
      .createQueryBuilder('message')
      .innerJoinAndSelect('message.phone_number', 'phone_number', 'phoneNumberId = :id', { id })
      .where({ type: Constants.OUTGOING })
      .orderBy('message.created_at', 'DESC')
      .getMany();
  }
}
