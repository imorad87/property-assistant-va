import { Resolver, Query, Mutation, Args, Int, ResolveField, Parent } from '@nestjs/graphql';
import { SMSMessagesService } from './sms-messages.service';
import { SMSMessage } from '../entities/sms-message.entity';
import { ISMSMessageCreateObject, ISMSMessageUpdateObject } from 'src/interfaces/types';
import { PhoneNumber } from 'src/entities/phone-number.entity';

@Resolver(() => SMSMessage)
export class SMSMessagesResolver {
  constructor(private readonly smsMessagesService: SMSMessagesService) { }

  @Mutation(() => SMSMessage, { name: 'createMessage' })
  async create(@Args('input') createSmsMessageInput: ISMSMessageCreateObject) {
    return await this.smsMessagesService.create(createSmsMessageInput);
  }

  @Query(() => [SMSMessage]!, { name: 'getAllMessages' })
  async findAll() {
    return await this.smsMessagesService.findAll();
  }

  @Query(() => SMSMessage, { name: 'findMessage' })
  async findOne(@Args('id', { type: () => Int }) id: number) {
    return await this.smsMessagesService.findOne(id);
  }

  @Mutation(() => SMSMessage, { name: 'updateMessage' })
  async update(@Args('input') updateSmsMessageInput: ISMSMessageUpdateObject) {
    return await this.smsMessagesService.update(updateSmsMessageInput);
  }

  @Mutation(() => Boolean, { name: 'removeMessage' })
  async remove(@Args('id', { type: () => Int }) id: number) {
    return await this.smsMessagesService.remove(id);
  }

  @ResolveField('phone_number', returns => PhoneNumber!)
  async getPhoneNumber(@Parent() message: SMSMessage) {
    return await this.smsMessagesService.getPhoneNumber(message.id);
  }
}
