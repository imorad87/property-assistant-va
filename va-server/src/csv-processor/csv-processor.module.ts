import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CampaignsModule } from 'src/campaigns/campaigns.module';
import { ContactsModule } from 'src/contacts/contacts.module';
import { InitialMessagesModule } from 'src/initial-messages/initial-messages.module';
import { PhoneNumbersModule } from 'src/phone-numbers/phone-numbers.module';
import { CSVProcessor } from './csv-processor';
import { CSVProcessorService } from './csv-processor.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'csv',
      defaultJobOptions:{
        attempts:1
      }
    }),
    CampaignsModule,
    ContactsModule,
    PhoneNumbersModule,
    InitialMessagesModule
  ],
  providers: [CSVProcessor, CSVProcessorService],
  exports: [CSVProcessorService]
})
export class CsvProcessorModule { }
