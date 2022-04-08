import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { Contact } from './entities/contact.entity';
import { PhoneNumber } from './entities/phone-number.entity';
import { SMSMessage } from './entities/sms-message.entity';
import { ContactsModule } from './contacts/contacts.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { Campaign } from './entities/campaign.entity';
import { BullModule } from '@nestjs/bull';
import { CsvProcessorModule } from './csv-processor/csv-processor.module';
import { CampaignsModule } from './campaigns/campaigns.module';
import { PhoneNumbersModule } from './phone-numbers/phone-numbers.module';
import { SMSMessagesModule } from './sms-messages/sms-messages.module';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { ScheduleModule } from '@nestjs/schedule';
import { ScheduledTasksModule } from './scheduled-tasks/scheduled-tasks.module';
import { MobileAppEventsModule } from './mobile-app-events/mobile-app-events.module';
import { EventEmitterModule } from '@nestjs/event-emitter';


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
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),

    }),
    TypeOrmModule.forFeature([Campaign]),
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
          Contact,
          PhoneNumber,
          Campaign
        ],
        autoLoadEntities: true,
        synchronize: true,
      })
    }),
    ScheduleModule.forRoot(),
    EventEmitterModule.forRoot(),
    ContactsModule,
    ChatbotModule,
    CsvProcessorModule,
    CampaignsModule,
    PhoneNumbersModule,
    SMSMessagesModule,
    ScheduledTasksModule,
    MobileAppEventsModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
