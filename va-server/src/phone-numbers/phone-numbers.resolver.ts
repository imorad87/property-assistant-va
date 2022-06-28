import { Logger } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Contact } from 'src/entities/contact.entity';
import { SMSMessage } from 'src/entities/sms-message.entity';
import { DeleteResult } from 'typeorm';
import { PhoneNumber } from '../entities/phone-number.entity';
import { FilterStatus, IPhoneNumberCreateObject, IPhoneNumberUpdateObject, NumbersPaginationResult } from '../interfaces/types';
import { PhoneNumbersService } from './phone-numbers.service';

@Resolver(() => PhoneNumber)
export class PhoneNumbersResolver {
    private logger = new Logger(PhoneNumbersResolver.name)

    constructor(private readonly phoneNumbersService: PhoneNumbersService) { }

    @Mutation((returns) => PhoneNumber, { name: 'createPhoneNumber' })
    async create(@Args('createPhoneNumberInput') createInput: IPhoneNumberCreateObject): Promise<PhoneNumber> {
        return await this.phoneNumbersService.create(createInput);
    }

    @Query(() => NumbersPaginationResult!, { name: 'searchNumbers' })
    async findAll(
        @Args({ name: 'page', type: () => Int }) page: number,
        @Args({ name: 'limit', type: () => Int }) limit: number,
        @Args({ name: 'filters', type: () => FilterStatus, nullable: true }) filters: FilterStatus = null,
    ) {
        try {
            return await this.phoneNumbersService.findAll({
                page,
                limit
            },
                filters
            );
        } catch (error) {
            console.log(error);
        }
    }

    @Query((returns) => PhoneNumber, { name: 'getPhoneNumber' })
    async findOne(@Args('id', { type: () => Int }) id: number) {
        return await this.phoneNumbersService.findOne(id);
    }

    @Mutation((returns) => PhoneNumber, { name: 'updatePhoneNumber' })
    async update(@Args('updatePhoneNumberInput') updateInput: IPhoneNumberUpdateObject) {
        return await this.phoneNumbersService.update(updateInput);
    }

    @Mutation((returns) => Boolean, { name: 'removePhoneNumber' })
    async remove(@Args('id', { type: () => Int }) id: number) {
        return await this.phoneNumbersService.delete(id);
    }

    @ResolveField('contact', returns => Contact!, { name: 'getContact' })
    async getContact(@Parent() contact: Contact) {
        return await this.phoneNumbersService.getContact(contact.id);
    }

    @ResolveField('messages', returns => [SMSMessage]!, { name: 'getMessages' })
    async getMessages(@Parent() number: PhoneNumber) {
        return await this.phoneNumbersService.getMessages(number.id);
    }

    @Mutation(() => Boolean, { name: 'activateManyNumbers' })
    async activateManyContacts(@Args({ name: 'ids', type: () => [Int!]! }) ids: number[]) {
        return await this.phoneNumbersService.activateManyNumbers(ids);
    }

    @Mutation(() => Boolean, { name: 'deactivateManyNumbers' })
    async deactivateManyContacts(@Args({ name: 'ids', type: () => [Int!]! }) ids: number[]) {
        return await this.phoneNumbersService.deactivateManyNumbers(ids);
    }

    @Mutation(() => Boolean, { name: 'removeManyNumbers' })
    async removeMany(@Args('ids', { type: () => [Int!]! }) ids: number[]) {
        return await this.phoneNumbersService.removeMany(ids);
    }
}
