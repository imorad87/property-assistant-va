import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Campaign } from '../entities/campaign.entity';
import { ICampaignCreateObject, ICampaignUpdateObject } from '../interfaces/types';
import { Repository } from 'typeorm';

@Injectable()
export class CampaignsService {

    private logger = new Logger(CampaignsService.name);

    constructor(@InjectRepository(Campaign) private campaignsRepo: Repository<Campaign>) { }

    async create(campaign: ICampaignCreateObject): Promise<Campaign> {
        try {
            const savedCampaign = await this.campaignsRepo.save(this.campaignsRepo.create(campaign));
            this.logger.log(`New contact created name: ${savedCampaign.title} id: ${savedCampaign.id}`);
            return savedCampaign;
        } catch (e) {
            this.logger.error({ message: 'Error creating new campaign', error: e.message });
        }
    }

    async delete(id: number) {
        const campaign = await this.findOne(id);
        if (!campaign) {
            throw new Error(`Campaign with id${id} doesn't exist`);
        }
        await this.campaignsRepo.delete(id);
        return true;
    }

    async findOne(id: number) {
        return await this.campaignsRepo.findOne(id);
    }

    async findAll() {
        return await this.campaignsRepo.find();
    }

    async update(campaign: ICampaignUpdateObject) {
        return await this.campaignsRepo.save(campaign);
    }

    async getContacts(id: number) {
        return (await this.campaignsRepo.findOne({ where: { id }, relations: ['contacts'] })).contacts;
    }
}
