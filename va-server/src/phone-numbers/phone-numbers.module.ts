import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PhoneNumber } from '../entities/phone-number.entity';
import { PhoneNumbersResolver } from './phone-numbers.resolver';
import { PhoneNumbersService } from './phone-numbers.service';

@Module({
  imports: [TypeOrmModule.forFeature([PhoneNumber])],
  providers: [PhoneNumbersResolver, PhoneNumbersService],
  exports: [PhoneNumbersService]
})
export class PhoneNumbersModule { }
