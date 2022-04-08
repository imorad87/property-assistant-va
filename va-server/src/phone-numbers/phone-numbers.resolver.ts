import { Logger } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Contact } from 'src/entities/contact.entity';
import { SMSMessage } from 'src/entities/sms-message.entity';
import { DeleteResult } from 'typeorm';
import { PhoneNumber } from '../entities/phone-number.entity';
import { IPhoneNumberCreateObject, IPhoneNumberUpdateObject } from '../interfaces/types';
import { PhoneNumbersService } from './phone-numbers.service';

@Resolver(() => PhoneNumber)
export class PhoneNumbersResolver {
    private logger = new Logger(PhoneNumbersResolver.name)

    constructor(private readonly phoneNumbersService: PhoneNumbersService) { }

    @Mutation((returns) => PhoneNumber)
    async create(@Args('createPhoneNumberInput') createInput: IPhoneNumberCreateObject): Promise<PhoneNumber> {
        return await this.phoneNumbersService.create(createInput);
    }

    @Query((returns) => [PhoneNumber], { name: 'getAllPhoneNumbers' })
    async findAll() {
        return await this.phoneNumbersService.findAll();
    }

    @Query((returns) => PhoneNumber, { name: 'getPhoneNumber' })
    async findOne(@Args('id', { type: () => Int }) id: number) {
        return await this.phoneNumbersService.findOne(id);
    }

    @Mutation((returns) => PhoneNumber, { name: 'updatePhoneNumber' })
    async update(@Args('updatePhoneNumberInput') updateInput: IPhoneNumberUpdateObject) {
        return await this.phoneNumbersService.update(updateInput);
    }

    @Mutation((returns) => Boolean)
    async remove(@Args('id', { type: () => Int }) id: number) {
        return await this.phoneNumbersService.delete(id);
    }

    @ResolveField('contact', returns => Contact!)
    async getContact(@Parent() contact: Contact){
        return await this.phoneNumbersService.getContact(contact.id);
    }
    @ResolveField('messages', returns => [SMSMessage]!)
    async getMessages(@Parent() number: PhoneNumber){
        return await this.phoneNumbersService.getMessages(number.id);
    }
}
