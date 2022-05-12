import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { BullModule } from '@nestjs/bull';
import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { GraphQLModule } from '@nestjs/graphql';
import { ScheduleModule } from '@nestjs/schedule';
import { TypeOrmModule } from '@nestjs/typeorm';
import { join } from 'path';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { CampaignsModule } from './campaigns/campaigns.module';
import { ChatbotModule } from './chatbot/chatbot.module';
import { ContactsModule } from './contacts/contacts.module';
import { CsvProcessorModule } from './csv-processor/csv-processor.module';
import { Campaign } from './entities/campaign.entity';
import { Contact } from './entities/contact.entity';
import { InitialMessage } from './entities/initial-message.entity';
import { PhoneNumber } from './entities/phone-number.entity';
import { Property } from './entities/property.entity';
import { Settings } from './entities/settings.entity';
import { SMSMessage } from './entities/sms-message.entity';
import { InitialMessagesModule } from './initial-messages/initial-messages.module';
import { MobileAppEventsModule } from './mobile-app-events/mobile-app-events.module';
import { PhoneNumbersModule } from './phone-numbers/phone-numbers.module';
import { ScheduledTasksModule } from './scheduled-tasks/scheduled-tasks.module';
import { SMSMessagesModule } from './sms-messages/sms-messages.module';


@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    BullModule.forRootAsync({
      inject:[ConfigService],
      useFactory:(configService:ConfigService)=>({
        redis: {
          host: configService.get('REDIS_HOST'),
          port: 6379,
        }
      })
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
          Campaign,
          Property,
          Settings,
          InitialMessage
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
    MobileAppEventsModule,
    InitialMessagesModule

  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
