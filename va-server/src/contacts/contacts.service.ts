import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PhoneNumber } from 'src/entities/phone-number.entity';
import { SMSMessage } from 'src/entities/sms-message.entity';
import { Constants } from 'src/enums/constants';
import { InitialMessagesService } from 'src/initial-messages/initial-messages.service';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { PhoneNumbersHelper } from '../helpers/phone-numbers.helper';
import { ContactsStats, IContact, IContactCreateObject, IContactUpdateObject } from '../interfaces/types';

@Injectable()
export class ContactsService {

    private logger = new Logger(ContactsService.name);

    constructor(@InjectRepository(Contact) private contactsRepo: Repository<Contact>, @InjectRepository(SMSMessage) private smsRepo: Repository<SMSMessage>, private initialMessagesService: InitialMessagesService, @InjectRepository(PhoneNumber) private phonesRepo: Repository<PhoneNumber>) { }

    async create(contact: IContactCreateObject): Promise<Contact> {
        console.log("🚀 ~ file: contacts.service.ts ~ line 26 ~ ContactsService ~ create ~ contact", contact)

        const phoneNumbers: PhoneNumber[] = [];

        for await (const n of contact.phone_numbers) {
            let sms = null;
            if (contact.initital_message) {
                let exisitng = await this.initialMessagesService.findOneByText(contact.initital_message)

                if (!exisitng) {
                    await this.initialMessagesService.create({
                        message: contact.initital_message
                    });
                }

                sms = this.smsRepo.create({
                    active: contact.active,
                    body: contact.initital_message,
                    type: Constants.OUTGOING,
                    status: Constants.SCHEDULED,
                    status_message: Constants.SCHEDULED_TO_SEND
                })
            }

            const number = this.phonesRepo.create({
                active: contact.active,
                number: n,
                messages: [sms],
            });

            phoneNumbers.push(number);
        }

        const savedContact = await this.contactsRepo.save(this.contactsRepo.create({
            first_name: contact.first_name,
            last_name: contact.last_name,
            phone_numbers: [...phoneNumbers],
            active: contact.active,
            campaign: {
                id: contact.campaign_id
            },
            property: {
                id: contact.property_id
            },
        }));

        return savedContact;

    }

    async remove(id: number) {
        const contact = await this.findOne(id);
        if (!contact) {
            throw new Error(`Contact with id ${id} doesn't exist`);
        }
        await this.contactsRepo.delete(id);
        return true;
    }

    async findOne(id: number) {
        return await this.contactsRepo.findOne(id);
    }

    async findAll() {
        return await this.contactsRepo.find();
    }

    async update(contact: IContactUpdateObject) {
        console.log("🚀 ~ file: contacts.service.ts ~ line 88 ~ ContactsService ~ update ~ contact", contact)
        const { phone_numbers, ...updates } = contact;
        console.log("🚀 ~ file: contacts.service.ts ~ line 90 ~ ContactsService ~ update ~ updates", updates)
        
        await this.contactsRepo.save(updates);
        return await this.contactsRepo.findOne(contact.id);
    }

    async getCampaign(id: number) {
        return (await this.contactsRepo.findOne({ where: { id }, relations: ['campaign'] })).campaign;
    }

    async getProperty(id: number) {
        return (await this.contactsRepo.findOne({ where: { id }, relations: ['property'] })).property;
    }

    async getContactsStats() {
        const allContactsCount = await this.contactsRepo.count();
        const leadsCount = await this.contactsRepo.count({ where: { status: Constants.LEAD } });
        const convertedCount = await this.contactsRepo.count({ where: { status: Constants.CONVERTED } });
        const pausedCount = await this.contactsRepo.count({ where: { active: false } });
        const activeCount = await this.contactsRepo.count({ where: { active: true } });

        const stats = new ContactsStats();
        stats.allContactsCount = allContactsCount;
        stats.leadsCount = leadsCount;
        stats.convertedCount = convertedCount;
        stats.pausedCount = pausedCount;
        stats.activeCount = activeCount;

        return stats;
    }

    async deactivateAllNumbers(id: number) {
        const contact = await this.contactsRepo.findOne(id, { relations: ['phone_numbers'] });
        const numbers = contact.phone_numbers;
        for (const number of numbers) {
            number.active = false;
        }
        await this.contactsRepo.save(contact);
        return true;
    }

    async activateAllNumbers(id: number) {
        const contact = await this.contactsRepo.findOne(id, { relations: ['phone_numbers'] });
        const numbers = contact.phone_numbers;
        for (const number of numbers) {
            number.active = true;
        }
        await this.contactsRepo.save(contact);
        return true;
    }

    async deactivateAllMessages(id: number) {
        const contact = await this.contactsRepo.findOne(id, {
            relations: ['phone_numbers', 'phone_numbers.messages']
        });
        const numbers = contact.phone_numbers;
        for (const number of numbers) {
            const messages = number.messages
            for (const message of messages) {
                message.active = false;
            }
        }
        await this.contactsRepo.save(contact);
        return true;
    }

    async activateAllMessages(id: number) {
        const contact = await this.contactsRepo.findOne(id, { relations: ['phone_numbers', 'phone_numbers.messages'] });
        const numbers = contact.phone_numbers;
        for (const number of numbers) {
            const messages = number.messages
            for (const message of messages) {
                message.active = true;
            }
        }
        await this.contactsRepo.save(contact);
        return true;
    }

    async getPhoneNumbers(id: number) {
        const contact = await this.contactsRepo.findOne({ where: { id }, relations: ['phone_numbers'] })
        return contact.phone_numbers;
    }
}
