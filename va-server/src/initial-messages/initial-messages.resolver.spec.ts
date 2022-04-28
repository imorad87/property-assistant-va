import { Test, TestingModule } from '@nestjs/testing';
import { InitialMessagesResolver } from './initial-messages.resolver';

describe('InitialMessagesResolver', () => {
  let resolver: InitialMessagesResolver;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [InitialMessagesResolver],
    }).compile();

    resolver = module.get<InitialMessagesResolver>(InitialMessagesResolver);
  });

  it('should be defined', () => {
    expect(resolver).toBeDefined();
  });
});
