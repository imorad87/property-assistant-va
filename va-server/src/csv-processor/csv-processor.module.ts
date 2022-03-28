import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { CSVProcessor } from './csv-processor';
import { CSVProcessorService } from './csv-processor.service';

@Module({
  imports: [
    BullModule.registerQueue({
      name: 'csv',
    }),
  ],
  providers: [CSVProcessor, CSVProcessorService],
  exports: [CSVProcessorService]
})
export class CsvProcessorModule { }
