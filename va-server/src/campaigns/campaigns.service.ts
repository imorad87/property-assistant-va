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

        const savedCampaign = await this.campaignsRepo.save(this.campaignsRepo.create(campaign));
        return savedCampaign;

    }

    async delete(id: number) {
        const campaign = await this.findOne(id);

        if (!campaign) {
            throw new Error(`Campaign with id ${id} doesn't exist`);
        }

        await this.campaignsRepo.delete(id);
        return true;
    }

    async findOne(id: number) {
        return await this.campaignsRepo.findOne({ where: { id } });
    }

    async findAll() {
        return await this.campaignsRepo.find();
    }

    async updateParsingStatus(status: string, id: number) {
        return await this.campaignsRepo
            .createQueryBuilder('campaign')
            .update({ parsing_status: status })
            .where("campaign.id = :id", { id })
            .execute()
    }

    async incrementTotalRecords(id: number) {
        return await this.campaignsRepo.increment({
            id
        }, 'total_records', 1);
    }

    async incrementFailedCount(id: number) {
        return await this.campaignsRepo.increment({
            id
        }, 'failed_count', 1);
    }

    async incrementSuccessCount(id: number) {
        return await this.campaignsRepo.increment({
            id
        }, 'success_count', 1);
    }

    async incrementDuplicatesCount(id: number) {
        return await this.campaignsRepo.increment({
            id
        }, 'duplicates_count', 1);
    }

    async update(campaign: ICampaignUpdateObject) {
        const savedCampaign = await this.campaignsRepo.save(campaign);
        return this.campaignsRepo.findOne({ where: { id: campaign.id } });
    }

    async getContacts(id: number) {
        return (await this.campaignsRepo.findOne({ where: { id }, relations: ['contacts'] })).contacts;
    }
}
