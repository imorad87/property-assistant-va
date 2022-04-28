import { Logger } from '@nestjs/common';
import { Args, Int, Mutation, Parent, Query, ResolveField, Resolver } from '@nestjs/graphql';
import { Campaign } from '../entities/campaign.entity';
import { Contact } from '../entities/contact.entity';
import { ICampaignCreateObject, ICampaignUpdateObject } from '../interfaces/types';
import { CampaignsService } from './campaigns.service';

@Resolver(() => Campaign)
export class CampaignsResolver {

    private logger = new Logger(CampaignsResolver.name);

    constructor(private readonly campaignService: CampaignsService) { }

    @Mutation((returns) => Campaign!, { name: 'createCampaign' })
    async create(@Args('input') createInput: ICampaignCreateObject) {
        return await this.campaignService.create(createInput);
    }

    @Query((returns) => [Campaign]!, { name: 'getAllCampaigns' })
    async findAll() {
        return await this.campaignService.findAll();
    }

    @Query((returns) => Campaign, { name: 'getCampaign' })
    async findOne(@Args('id', { type: () => Int }) id: number) {
        return await this.campaignService.findOne(id);
    }

    @Mutation((returns) => Campaign!, { name: 'updateCampaign' })
    async update(@Args('input') updateInput: ICampaignUpdateObject) {
        return await this.campaignService.update(updateInput);
    }

    @Mutation((returns) => Boolean, {name:'removeCampaign'})
    async remove(@Args('id', { type: () => Int }) id: number) {
        return await this.campaignService.delete(id);
    }

    @ResolveField('contacts', returns => [Contact!]!)
    async getContacts(@Parent() campaign: Campaign) {
        return await this.campaignService.getContacts(campaign.id);
    }
}
