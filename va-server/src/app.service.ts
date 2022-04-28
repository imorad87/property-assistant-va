import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CSVProcessorService } from './csv-processor/csv-processor.service';
import { Campaign } from './entities/campaign.entity';
import { ProcessingConstraints } from './interfaces/types';



@Injectable()
export class AppService {

  constructor(@InjectRepository(Campaign) private campaignsRepo: Repository<Campaign>, private csvProcessorService: CSVProcessorService) { }

  async processFile(file: Express.Multer.File, campaign: Campaign, processingConstraints: ProcessingConstraints) {

    this.csvProcessorService.addToQueue({
      file,
      campaign,
      constraints: processingConstraints
    });

  }

}
