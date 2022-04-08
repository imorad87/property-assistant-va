import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Campaign } from 'src/entities/campaign.entity';
import { PhoneNumber } from 'src/entities/phone-number.entity';
import { Contact } from '../entities/contact.entity';
import { ContactsStats, IContactCreateObject, IContactUpdateObject } from '../interfaces/types';
import { ContactsService } from './contacts.service';

@Resolver(of => Contact)
export class ContactsResolver {



    constructor(private readonly contactsService: ContactsService) { }

    @Mutation(() => Contact, { name: 'createContact' })
    async create(@Args('input') createContactInput: IContactCreateObject) {
        return await this.contactsService.create(createContactInput);
    }

    @Query(() => [Contact]!, { name: 'getAllContacts' })
    async findAll() {
        return await this.contactsService.findAll();
    }

    @Query(() => Contact, { name: 'findContact' })
    async findOne(@Args('id', { type: () => Int }) id: number) {
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

    @Mutation(() => Contact, { name: 'removeContact' })
    async remove(@Args('id', { type: () => Int }) id: number) {
        return await this.contactsService.remove(id);
    }

    @ResolveField('phone_numbers', returns => [PhoneNumber!]!)
    async getBalance(@Parent() contact: Contact) {
        return await this.contactsService.getPhoneNumbers(contact.id);
    }

    @ResolveField('campaign', returns => Campaign!)
    async getCampaign(@Parent() contact: Contact) {
        return await this.contactsService.getCampaign(contact.id);
    }
}
