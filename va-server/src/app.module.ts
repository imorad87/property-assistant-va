import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Lead } from './entities/lead.entity';
import { PhoneNumber } from './entities/phone-number.entity';
import { SMSMessage } from './entities/sms-message.entity';
import { SmsModule } from './sms/sms.module';
import { LeadsModule } from './leads/leads.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { CSVFileUploadStatus } from './entities/csv-file-upload-status.entity';
import { BullModule } from '@nestjs/bull';
import { CsvProcessorModule } from './csv-processor/csv-processor.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRoot({
      redis: {
        host: 'localhost',
        port: 6379,
      }
    }),
    TypeOrmModule.forFeature([CSVFileUploadStatus]),
    TypeOrmModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'mysql',
        host: configService.get('DATABASE_HOST'),
        port: configService.get('DATABASE_PORT'),
        username: configService.get('DATABASE_USER'),
        password: configService.get('DATABASE_PASSWORD'),
        database: configService.get('DATABASE_NAME'),
        entities: [
          SMSMessage,
          Lead,
          PhoneNumber,
          CSVFileUploadStatus
        ],
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    SmsModule,
    LeadsModule,
    ChatbotModule,
    CsvProcessorModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
