import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Constants } from 'src/enums/constants';
import { IPhoneNumberCreateObject, IPhoneNumberUpdateObject } from 'src/interfaces/types';
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
        return this.phoneNumbersRepo.findOneBy({id:updatedPhoneNumber.id});
    }

    async delete(id: number) {
        const number = await this.findOne(id);
        if (!number) {
            throw new Error(`The number with id: ${id} does not exist!`);
        }
        await this.phoneNumbersRepo.remove(number);
        return true;
    }

    async findOne(id: number) {
        return this.phoneNumbersRepo.findOne({ where: { id } });
    }

    async findAll() {
        return this.phoneNumbersRepo.find();
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

    async isDuplicate(number: string) {
        return await this.phoneNumbersRepo.createQueryBuilder('numbers').where("numbers.number = :number", { number }).getCount() ? true : false;
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
}
