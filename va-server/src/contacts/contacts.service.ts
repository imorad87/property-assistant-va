import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { PhoneNumber } from 'src/entities/phone-number.entity';
import { SMSMessage } from 'src/entities/sms-message.entity';
import { Constants } from 'src/enums/constants';
import { InitialMessagesService } from 'src/initial-messages/initial-messages.service';
import { Pagination, PaginationOptionsInterface } from '../paginate';
import { Repository } from 'typeorm';
import { Contact } from '../entities/contact.entity';
import { ContactsStats, FilterStatus, IContactCreateObject, IContactUpdateObject } from '../interfaces/types';

@Injectable()
export class ContactsService {

    private logger = new Logger(ContactsService.name);

    constructor(@InjectRepository(Contact) private contactsRepo: Repository<Contact>, @InjectRepository(SMSMessage) private smsRepo: Repository<SMSMessage>, private initialMessagesService: InitialMessagesService, @InjectRepository(PhoneNumber) private phonesRepo: Repository<PhoneNumber>) { }

    async create(contact: IContactCreateObject): Promise<Contact> {
        const phoneNumbers: PhoneNumber[] = [];

        for await (const n of contact.phone_numbers) {
            let sms = null;

            if (contact.initital_message != null) {
                let exisitng = await this.initialMessagesService.findOneByText(contact.initital_message)

                if (!exisitng) {
                    await this.initialMessagesService.create({
                        message: contact.initital_message
                    });
                }

                sms = this.smsRepo.create({
                    active: contact.active,
                    body: 'Hello ' + contact.first_name + ', ' + contact.initital_message,
                    type: Constants.OUTGOING,
                    status: Constants.SCHEDULED,
                    status_message: Constants.SCHEDULED_TO_SEND
                })
            }

            type record = {
                active: boolean,
                number: string,
                number_base10: string,
                messages?: SMSMessage[]
            }

            const data: record = {
                active: contact.active,
                number: n.trim(),
                number_base10: `${parseInt(n.trim())}`
            }

            if (sms) {
                data.messages = [sms];
            }

            const number = this.phonesRepo.create(data);

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

    async removeMany(ids: number[]) {
        await this.contactsRepo.createQueryBuilder().delete().from(Contact).whereInIds(ids).execute();
        return true;
    }

    async findOne(id: number) {
        return await this.contactsRepo.findOne({ where: { id }, relations: ['property'] });
    }

    async getAllContacts() {
        return await this.contactsRepo
            .createQueryBuilder('contact')
            .leftJoinAndSelect('contact.phone_numbers', 'phone_numbers')
            .leftJoinAndSelect('contact.property', 'property')
            .getMany();
    }

    async paginate(
        options: PaginationOptionsInterface,
    ): Promise<Pagination<Contact>> {
        const [results, total] = await this.contactsRepo.findAndCount({
            take: options.limit,
            skip: options.page, // think this needs to be page * limit

        });

        // TODO add more tests for paginate

        return new Pagination<Contact>({
            results,
            total,
        });
    }

    async findAll(options: IPaginationOptions, filters: FilterStatus = null) {

        const query = this.contactsRepo
            .createQueryBuilder('contact')
            .leftJoinAndSelect('contact.phone_numbers', 'phoneNumber')
            .leftJoinAndSelect("phoneNumber.messages", 'message')

        if (filters) {
            // console.log(filters);

            if (filters.name) {
                query.where("contact.first_name like :firstname", { firstname: `%${filters.name}%` });

                query.orWhere("contact.last_name like :lastname", { lastname: `%${filters.name}%` })
            }

            if (filters.converted) {
                query.andWhere("contact.status = :converted", { converted: Constants.CONVERTED })
            }

            if (filters.leads) {
                if (filters.converted) {
                    query.orWhere("contact.status = :lead", { lead: Constants.LEAD })
                } else {
                    query.andWhere("contact.status = :lead", { lead: Constants.LEAD })
                }
            }

            if (filters.active) {
                query.andWhere("contact.active = :active", { active: true })
            }

            if (filters.inactive) {
                if (filters.active) {
                    query.orWhere("contact.active = :inactive", { inactive: false })

                } else {
                    query.andWhere("contact.active = :inactive", { inactive: false })

                }
            }

            if (filters.phoneNumber) {
                query.andWhere("phoneNumber.number like :number", { number: filters.phoneNumber })
            }

            if (filters.negativeResponse) {
                query.andWhere("phoneNumber.deactivation_reason = :negativeResponse", { negativeResponse: Constants.NEGATIVE_RESPONSE })
            }

            if (filters.unknownResponse) {
                if (filters.negativeResponse) {
                    query.orWhere("phoneNumber.deactivation_reason = :unknownResponse", { unknownResponse: Constants.UNKNOWN_RESPONSE })
                } else {
                    query.andWhere("phoneNumber.deactivation_reason = :unknownResponse", { unknownResponse: Constants.UNKNOWN_RESPONSE })
                }
            }

            if (filters.campaignId) {
                query.andWhere("contact.campaign_id = :id", { id: filters.campaignId })
            }
        }

        const page = options.page as number;
        const skip = (page as number) * (options.limit as number);

        query
            .skip(skip)
            .take(options.limit as number);

        return {
            items: await query.getMany(),
            meta: {
                totalItems: await query.getCount(),
                itemCount: 0,
                itemsPerPage: options.limit as number,
                totalPages: 0,
                currentPage: 0
            }
        };
    }

    async update(contact: IContactUpdateObject) {
        const { phone_numbers, ...updates } = contact;
        await this.contactsRepo.save(updates);
        return await this.contactsRepo.findOne({ where: { id: contact.id } });
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
        const contact = await this.contactsRepo.findOne({ where: { id }, relations: ['phone_numbers', 'phone_numbers.messages'] });
        const numbers = contact.phone_numbers;
        for (const number of numbers) {
            if (number.active) {
                number.active = false;
                const messages = number.messages
                for (const message of messages) {
                    message.active = false;
                }
            }
        }
        await this.contactsRepo.save(contact);
        return true;
    }

    async activateAllNumbers(id: number) {
        const contact = await this.contactsRepo.findOne({ where: { id }, relations: ['phone_numbers', 'phone_numbers.messages'] });
        const numbers = contact.phone_numbers;
        for (const number of numbers) {
            if (!number.active) {
                if (number.deactivation_reason !== Constants.NEGATIVE_RESPONSE && number.deactivation_reason !== Constants.POSITIVE_CONVERTED && number.deactivation_reason !== Constants.UNKNOWN_RESPONSE) {
                    number.active = true;

                    const messages = number.messages
                    for (const message of messages) {
                        message.active = true;
                    }
                }
            }
        }
        await this.contactsRepo.save(contact);
        return true;
    }

    async deactivateManyContacts(ids: number[]) {
        for await (const id of ids) {
            const contact = await this.contactsRepo.findOne({
                where: { id },
                relations: ['phone_numbers', 'phone_numbers.messages']
            });

            contact.active = false;

            const numbers = contact.phone_numbers;

            for (const number of numbers) {
                if (number.active) {
                    number.active = false;
                    const messages = number.messages
                    for (const message of messages) {
                        message.active = false;
                    }
                }
            }
            await this.contactsRepo.save(contact);
        }
        return true;
    }

    async activateManyContacts(ids: number[]) {
        for await (const id of ids) {
            const contact = await this.contactsRepo.findOne({ where: { id }, relations: ['phone_numbers', 'phone_numbers.messages'] });
            contact.active = true;
            const numbers = contact.phone_numbers;
            for (const number of numbers) {
                if (!number.active) {
                    if (number.deactivation_reason !== Constants.NEGATIVE_RESPONSE && number.deactivation_reason !== Constants.POSITIVE_CONVERTED && number.deactivation_reason !== Constants.UNKNOWN_RESPONSE) {
                        number.active = true;

                        const messages = number.messages
                        for (const message of messages) {
                            message.active = true;
                        }
                    }
                }
            }
            await this.contactsRepo.save(contact);
        }
        return true;
    }

    async getPhoneNumbers(id: number) {
        const contact = await this.contactsRepo.findOne({ where: { id }, relations: ['phone_numbers'] })
        return contact.phone_numbers;
    }

    async findMany(ids: number[]) {
        return await this.contactsRepo
            .createQueryBuilder('contact')
            .leftJoinAndSelect('contact.phone_numbers', 'phone_numbers')
            .leftJoinAndSelect('contact.property', 'property')
            .whereInIds(ids)
            .getMany();
    }

    async setAsConverted(id: number) {
        const contact = await this.contactsRepo.findOneBy({ id });
        contact.status = Constants.CONVERTED;
        contact.active = false;
        await this.contactsRepo.save(contact);
    }

    async test() {


        return await this.phonesRepo.createQueryBuilder('phoneNumber')
            .loadRelationCountAndMap('messagesCount', 'phoneNumber.messages')
            .getMany();
    }
}
