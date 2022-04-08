import { Module } from '@nestjs/common';
import { MobileAppEventsGateway } from './mobile-app-events.gateway';

@Module({
    providers: [MobileAppEventsGateway],
    exports: [MobileAppEventsGateway]
})
export class MobileAppEventsModule { }
