import { Logger } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Contact } from '../../entities/contact.entity';
import { Property } from '../../entities/property.entity';
import { IPropertyCreateObject, IPropertyUpdateObject } from '../../interfaces/types';
import { PropertiesService } from './propert.service';

@Resolver(() => Property)
export class PropertyResolver {

    private logger = new Logger(PropertyResolver.name);

    constructor(private readonly propertiesService: PropertiesService) { }

    @Mutation((returns) => Property!, { name: 'createProperty' })
    async create(@Args('input') createInput: IPropertyCreateObject) {
        return await this.propertiesService.create(createInput);
    }

    @Query((returns) => [Property]!, { name: 'getAllPropertys' })
    async findAll() {
        return await this.propertiesService.findAll();
    }

    @Query((returns) => Property, { name: 'getProperty' })
    async findOne(@Args('id', { type: () => Int }) id: number) {
        return await this.propertiesService.findOne(id);
    }

    @Mutation((returns) => Property!, { name: 'updateProperty' })
    async update(@Args('input') updateInput: IPropertyUpdateObject) : Promise<Property>{
        return await this.propertiesService.update(updateInput);
    }

    @Mutation((returns) => Boolean, { name: 'removeProperty' })
    async remove(@Args('id', { type: () => Int }) id: number) {
        return await this.propertiesService.remove(id);
    }

    @ResolveField('contacts', returns => [Contact!]!)
    async getContacts(@Parent() property: Property) {
        return await this.propertiesService.getContacts(property.id);
    }
}
