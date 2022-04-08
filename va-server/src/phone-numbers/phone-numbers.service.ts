import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
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
        return await this.phoneNumbersRepo.save(updatedPhoneNumber)
    }

    async delete(id: number) {
        const number = await this.findOne(id);
        if (!number) {
            throw new Error(`The number with id: ${id} does not exist!`);
        }
        await this.phoneNumbersRepo.delete(number);
        return true;
    }

    async findOne(id: number) {
        return this.phoneNumbersRepo.findOne(id);
    }

    async findAll() {
        return this.phoneNumbersRepo.find();
    }

    async getContact(id: number) {
        return (await this.phoneNumbersRepo.findOne({ where: { id }, relations: ['contact'] })).contact;
    }

    async getMessages(id: number) {
        return (await this.phoneNumbersRepo.findOne({ where: { id }, relations: ['messages'] })).messages;
    }
}
