import { Test, TestingModule } from '@nestjs/testing';
import { SmsMessagesService } from './sms-messages.service';

describe('SmsMessagesService', () => {
  let service: SmsMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsMessagesService],
    }).compile();

    service = module.get<SmsMessagesService>(SmsMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
