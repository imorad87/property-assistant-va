import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPaginationOptions } from 'nestjs-typeorm-paginate';
import { Constants } from '../enums/constants';
import { FilterStatus, IPhoneNumberCreateObject, IPhoneNumberUpdateObject } from '../interfaces/types';
import { Repository } from 'typeorm';
import { PhoneNumber } from '../entities/phone-number.entity';

@Injectable()
export class PhoneNumbersService {


    private logger = new Logger(PhoneNumbersService.name);

    constructor(@InjectRepository(PhoneNumber) private phoneNumbersRepo: Repository<PhoneNumber>) { }

    async create(phoneNumber: IPhoneNumberCreateObject): Promise<PhoneNumber> {
        try {
            const newPhoneNumber = await this.phoneNumbersRepo.save(this.phoneNumbersRepo.create(phoneNumber));
            this.logger.log(`New contact created name: ${newPhoneNumber.number} id: ${newPhoneNumber.id}`);
            return newPhoneNumber;
        } catch (e) {
            this.logger.error({ message: 'Error creating new phone number', error: e.message });
        }
    }

    async update(updatedPhoneNumber: IPhoneNumberUpdateObject) {
        await this.phoneNumbersRepo.save(updatedPhoneNumber)
        return this.phoneNumbersRepo.findOneBy({ id: updatedPhoneNumber.id });
    }

    async delete(id: number) {
        const number = await this.findOne(id);
        if (!number) {
            throw new Error(`The number with id: ${id} does not exist!`);
        }
        await this.phoneNumbersRepo.remove(number);
        return true;
    }

    async removeMany(ids: number[]) {
        await this.phoneNumbersRepo.createQueryBuilder().delete().from(PhoneNumber).whereInIds(ids).execute();
        return true;
    }


    async findOne(id: number) {
        return this.phoneNumbersRepo.findOne({ where: { id } });
    }


    async findMany(ids: number[]) {
        return await this.phoneNumbersRepo
            .createQueryBuilder('number')
            .leftJoinAndSelect('number.contact', 'contact')
            .leftJoinAndSelect('contact.property', 'property')
            .whereInIds(ids)
            .getMany();
    }


    async findAll(options: IPaginationOptions, filters: FilterStatus = null) {

        const query = this.phoneNumbersRepo.createQueryBuilder('number')
            .leftJoinAndSelect('number.messages', 'messages')
            .leftJoinAndSelect('number.contact', 'contact')
            .addSelect('number.messagesCount')


        if (filters) {
            // console.log(filters);

            if (filters.name) {
                query.where("contact.first_name like :firstname", { firstname: `%${filters.name}%` });

                query.orWhere("contact.last_name like :lastname", { lastname: `%${filters.name}%` })
            }


            if (filters.active) {
                query.andWhere("number.active = :active", { active: true })
            }

            if (filters.inactive) {
                if (filters.active) {
                    query.orWhere("number.active = :inactive", { inactive: false })

                } else {
                    query.andWhere("number.active = :inactive", { inactive: false })

                }
            }

            if (filters.phoneNumber) {
                query.andWhere("number.number like :number", { number: filters.phoneNumber })
            }

            if (filters.negativeResponse) {
                query.andWhere("number.deactivation_reason = :negativeResponse", { negativeResponse: Constants.NEGATIVE_RESPONSE })
            }

            if (filters.unknownResponse) {
                if (filters.negativeResponse) {
                    query.orWhere("number.deactivation_reason = :unknownResponse", { unknownResponse: Constants.UNKNOWN_RESPONSE })
                } else {
                    query.andWhere("number.deactivation_reason = :unknownResponse", { unknownResponse: Constants.UNKNOWN_RESPONSE })
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

    async findByNumber(n: string) {
        return this.phoneNumbersRepo
            .createQueryBuilder('phoneNumber')
            .leftJoinAndSelect('phoneNumber.messages', 'messages')
            .leftJoinAndSelect('phoneNumber.contact', 'contact')
            .where("phoneNumber.number like :number", { number: `%${n}%` })
            .getOne()
    }

    async getContact(id: number) {
        return (await this.phoneNumbersRepo.findOne({ where: { id }, relations: ['contact'] })).contact;
    }

    async getMessages(id: number) {
        return (await this.phoneNumbersRepo.findOne({ where: { id }, relations: ['messages'] })).messages;
    }

    async isDuplicate(input: string): Promise<boolean> {

        return await this.phoneNumbersRepo.createQueryBuilder('numbers').where("numbers.number_base10 = :number", { number: `${parseInt(input.trim())}` }).getCount() ? true : false;
    }

    async findByNumberExact(number: string) {
        return await this.phoneNumbersRepo
            .createQueryBuilder('phoneNumber')
            .leftJoinAndSelect('phoneNumber.messages', 'messages')
            .leftJoinAndSelect('phoneNumber.contact', 'contact')
            .where("phoneNumber.number_base10 = :text", { text: `${number}` })
            .getOne();
    }

    async deactivateWithReason(id: number, deactivationReason: string) {
        const number = await this.phoneNumbersRepo.findOneBy({ id });
        number.active = false;
        number.deactivation_reason = deactivationReason;
        await this.phoneNumbersRepo.save(number);
    }

    async deactivateManyNumbers(ids: number[]) {
        for await (const id of ids) {
            const number = await this.phoneNumbersRepo.findOne({
                where: { id },
                relations: ['messages']
            });

            number.active = false;

            const messages = number.messages
            for (const message of messages) {
                message.active = false;
            }

            await this.phoneNumbersRepo.save(number);
        }
        return true;
    }

    async activateManyNumbers(ids: number[]) {
        for await (const id of ids) {
            const number = await this.phoneNumbersRepo.findOne({
                where: { id },
                relations: ['messages']
            });

            if (!number.active) {
                if (number.deactivation_reason !== Constants.NEGATIVE_RESPONSE && number.deactivation_reason !== Constants.POSITIVE_CONVERTED && number.deactivation_reason !== Constants.UNKNOWN_RESPONSE) {
                    number.active = true;

                    const messages = number.messages
                    for (const message of messages) {
                        message.active = true;
                    }
                }
            }

            await this.phoneNumbersRepo.save(number);
        }
        return true;
    }

    async test() {
        return await this.phoneNumbersRepo.createQueryBuilder('number').leftJoinAndSelect('number.messages', 'messages').getMany()
    }
}
