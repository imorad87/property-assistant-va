import { Test, TestingModule } from '@nestjs/testing';
import { SmsMessagesResolver } from './sms-messages.resolver';
import { SmsMessagesService } from './sms-messages.service';

describe('SmsMessagesResolver', () => {
  let resolver: SmsMessagesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [SmsMessagesResolver, SmsMessagesService],
    }).compile();

    resolver = module.get<SmsMessagesResolver>(SmsMessagesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
