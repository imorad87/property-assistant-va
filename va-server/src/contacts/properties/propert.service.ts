import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPropertyCreateObject, IPropertyUpdateObject } from 'src/interfaces/types';
import { Repository } from 'typeorm';
import { Property } from '../../entities/property.entity';
import { SMSMessage } from '../../entities/sms-message.entity';
import { Constants } from '../../enums/constants';
import { ContactsService } from '../contacts.service';

@Injectable()
export class PropertiesService {
    async getPropertiesWithContactsWithUnrespondedMessages() {
        const targetProperties = [];
        const properties = await this.findAll();
        for (const property of properties) {
            const contacts = property.contacts;
            for (const contact of contacts) {
                const numbers = await this.contactsService.getPhoneNumbers(contact.id);
                for (const number of numbers) {
                    const message = await this.messagesRepo
                        .createQueryBuilder('message')
                        .where('message.phoneNumberId = :id', { id: number.id })
                        .andWhere('message.type = :type', { type: Constants.INCOMING })
                        .orderBy('created_at', 'DESC')
                        .getOne();
                    if (message) {
                        targetProperties.push(property);
                    }
                }
            }
        }
        return targetProperties;
    }

    private logger = new Logger(PropertiesService.name);

    constructor(@InjectRepository(Property) private propertiesRepo: Repository<Property>, @InjectRepository(SMSMessage) private messagesRepo: Repository<SMSMessage>, private contactsService: ContactsService) { }

    async create(property: IPropertyCreateObject) {
        const savedProperty = await this.propertiesRepo.save(this.propertiesRepo.create(property));
        return savedProperty;
    }

    async remove(id: number) {
        const property = await this.findOne(id);
        if (!property) {
            throw new Error(`Property with id ${id} doesn't exist`);
        }
        await this.propertiesRepo.delete(id);
        return true;
    }

    async findOne(id: number) {
        return await this.propertiesRepo.findOne({ where: { id } });
    }

    async findAll() {
        return await this.propertiesRepo.createQueryBuilder('property').leftJoinAndSelect('property.contacts', 'contacts').leftJoinAndSelect('contacts.phone_numbers', 'phone_numbers').getMany();
    }

    async update(input: IPropertyUpdateObject): Promise<Property> {
        const updatedProperty = await this.propertiesRepo.save({ ...input }, { reload: true });
        return this.findOne(input.id);
    }

    async getContacts(id: number) {
        return (await this.propertiesRepo.findOne({ where: { id }, relations: ['contacts'] })).contacts;
    }
}