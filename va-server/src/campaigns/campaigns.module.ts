import { Module } from '@nestjs/common';
import { CampaignsService } from './campaigns.service';
import { CampaignsResolver } from './campaigns.resolver';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from '../entities/campaign.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Campaign])],
  providers: [CampaignsService, CampaignsResolver]
})
export class CampaignsModule { }
