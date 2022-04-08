import { Test, TestingModule } from '@nestjs/testing';
import { MobileAppEventsGateway } from './mobile-app-events.gateway';

describe('MobileAppEventsGateway', () => {
  let gateway: MobileAppEventsGateway;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [MobileAppEventsGateway],
    }).compile();

    gateway = module.get<MobileAppEventsGateway>(MobileAppEventsGateway);
  });

  it('should be defined', () => {
    expect(gateway).toBeDefined();
  });
});
