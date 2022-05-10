import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Campaign } from '../entities/campaign.entity';
import { PhoneNumber } from '../entities/phone-number.entity';
import { SMSMessage } from '../entities/sms-message.entity';
import { Contact } from '../entities/contact.entity';
import { ContactsService } from './contacts.service';

describe('ContactsService', () => {
  let service: ContactsService;


  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true
        }),
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
        TypeOrmModule.forFeature([Contact])],
      providers: [ContactsService],
    }).compile();

    service = module.get<ContactsService>(ContactsService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should create a new contact', async () => {
    const contact = await service.createContact({
      name: 'Islam Morad',
      phone_numbers: [
        '011477990399',
        '012731010512'
      ],
    });

    console.log(contact);

  });
  it('should remove contact', async () => {
    const contact = await service.remove(3);
    console.log(contact);

  });
  it('should find contact', async () => {
    const contact = await service.findOne(3);
    console.log(contact);
  });


  it('should throw error trying to find contact', () => {
    const contact = async () => await service.findOne(3);

    expect(contact).toThrowError();
  });

  it('should update contact', async () => {
    const contact = {
      id:2,
      name: 'new name',
      status:'converted',
      active:false
    }
    const c = await service.update(contact);
    console.log(c);
  });

});
