import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Campaign } from '../entities/campaign.entity';
import { PhoneNumber } from '../entities/phone-number.entity';
import { Property } from '../entities/property.entity';
import { Contact } from '../entities/contact.entity';
import { ContactsStats, FilterStatus, IContactCreateObject, IContactUpdateObject, PaginationResult } from '../interfaces/types';
import { ContactsService } from './contacts.service';
import { Pagination } from 'nestjs-typeorm-paginate';

@Resolver(of => Contact)
export class ContactsResolver {

    constructor(private readonly contactsService: ContactsService) { }

    @Mutation(() => Contact, { name: 'createContact' })
    async create(@Args('input') createContactInput: IContactCreateObject) {
        return await this.contactsService.create(createContactInput);
    }

    @Query(() => PaginationResult!, { name: 'getAllContacts' })
    async findAll(
        @Args({ name: 'page', type: () => Int }) page: number,
        @Args({ name: 'limit', type: () => Int }) limit: number,
        @Args({ name: 'filters', type: () => FilterStatus }) filters: FilterStatus = null,
    ) {
        try {
            return await this.contactsService.findAll({
                page,
                limit
            },
                filters
            );
        } catch (error) {
            console.log(error);
        }
    }

    // @Query(() => PaginationResult!, { name: 'searchContacts' })
    // async search(
    //     @Args({ name: 'search' }) search: string,
    // ) {
    //     return await this.contactsService.searchContacts(search);
    // }

    @Query(() => Contact, { name: 'findContact' })
    async findOne(@Args('id', { type: () => Int! }) id: number) {
        return await this.contactsService.findOne(id);
    }



    @Query(() => ContactsStats, { name: 'contactsStats' })
    async getContactsStats() {
        return await this.contactsService.getContactsStats();
    }

    @Mutation(() => Contact, { name: 'updateContact' })
    async update(@Args('input') updateContactInput: IContactUpdateObject) {
        return await this.contactsService.update(updateContactInput);
    }

    @Mutation(() => Boolean, { name: 'activateAllNumbers' })
    async activateAllNumbers(@Args({ name: 'id', type: () => Int! }) id: number) {
        return await this.contactsService.activateAllNumbers(id);
    }

    @Mutation(() => Boolean, { name: 'deactivateAllNumbers' })
    async deactivateAllNumbers(@Args({ name: 'id', type: () => Int! }) id: number) {
        return await this.contactsService.deactivateAllNumbers(id);
    }

    @Mutation(() => Boolean, { name: 'activateManyContacts' })
    async activateManyContacts(@Args({ name: 'ids', type: () => [Int!]! }) ids: number[]) {
        return await this.contactsService.activateManyContacts(ids);
    }

    @Mutation(() => Boolean, { name: 'deactivateManyContacts' })
    async deactivateManyContacts(@Args({ name: 'ids', type: () => [Int!]! }) ids: number[]) {
        return await this.contactsService.deactivateManyContacts(ids);
    }

    @Mutation(() => Boolean, { name: 'removeContact' })
    async remove(@Args('id', { type: () => Int }) id: number) {
        return await this.contactsService.remove(id);
    }

    @Mutation(() => Boolean, { name: 'removeManyContacts' })
    async removeMany(@Args('ids', { type: () => [Int!]! }) ids: number[]) {
        return await this.contactsService.removeMany(ids);
    }

    @ResolveField('phone_numbers', returns => [PhoneNumber!]!)
    async getBalance(@Parent() contact: Contact) {
        return await this.contactsService.getPhoneNumbers(contact.id);
    }

    @ResolveField('campaign', returns => Campaign!)
    async getCampaign(@Parent() contact: Contact) {
        return await this.contactsService.getCampaign(contact.id);
    }

    @ResolveField('property', returns => Property!)
    async getProperty(@Parent() contact: Contact) {
        return await this.contactsService.getProperty(contact.id);
    }

}
