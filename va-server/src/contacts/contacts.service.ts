import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Contact } from '../entities/contact.entity';
import { PhoneNumbersHelper } from '../helpers/phone-numbers.helper';
import { ContactsStats, IContact, IContactUpdateObject } from '../interfaces/types';
import { Repository } from 'typeorm';
import { Constants } from 'src/enums/constants';

@Injectable()
export class ContactsService {
    

    async getPhoneNumbers(id: number) {
        const contact = await this.contactsRepo.findOne({ where: { id }, relations: ['phone_numbers'] })
        return contact.phone_numbers;
    }

    private logger = new Logger(ContactsService.name);

    constructor(@InjectRepository(Contact) private contactsRepo: Repository<Contact>) { }

    async create(contact: IContact): Promise<Contact> {
        try {
            const savedContact = await this.contactsRepo.save(this.contactsRepo.create({
                name: contact.name,
                phone_numbers: PhoneNumbersHelper.stringArrayToPhoneNumbers(contact.phone_numbers),
            }));
            this.logger.log(`New contact created name: ${savedContact.name} id: ${savedContact.id}`);
            return savedContact;
        } catch (e) {
            this.logger.error({ message: 'Error creating new contact', error: e.message });
        }
    }

    async remove(id: number) {
        return await this.contactsRepo.delete(id);
    }

    async findOne(id: number) {
        return await this.contactsRepo.findOne(id);
    }

    async findAll() {
        return await this.contactsRepo.find();
    }

    async update(contact: IContactUpdateObject) {
        const { phone_numbers, ...updates } = contact;
        return await this.contactsRepo.save(updates);
    }

    async getCampaign(id: number) {
        return (await this.contactsRepo.findOne({where:{id}, relations:['campaign']})).campaign;
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
}
