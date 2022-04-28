import { Test, TestingModule } from '@nestjs/testing';
import { InitialMessagesService } from './initial-messages.service';

describe('InitialMessagesService', () => {
  let service: InitialMessagesService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitialMessagesService],
    }).compile();

    service = module.get<InitialMessagesService>(InitialMessagesService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
