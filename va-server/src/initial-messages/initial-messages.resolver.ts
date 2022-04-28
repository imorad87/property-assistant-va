import { Logger } from '@nestjs/common';
import { Args, Int, Mutation, Query, Resolver } from '@nestjs/graphql';
import { InitialMessage } from '../entities/initial-message.entity';
import { InitialMessageCreateObject, InitialMessageUpdateObject } from '../interfaces/types';
import { InitialMessagesService } from './initial-messages.service';

@Resolver(of => InitialMessage)
export class InitialMessagesResolver {

    private logger = new Logger(InitialMessagesResolver.name)

    constructor(private initialMessagesService: InitialMessagesService) { }

    @Mutation(returns => [InitialMessage]!)
    async createMany(@Args({ name: 'input', type: () => [InitialMessageCreateObject!]! }) input: InitialMessageCreateObject[]) {
        return await this.initialMessagesService.createMany(input);
    }

    @Mutation(returns => InitialMessage!, { name: 'createInitialMessage' })
    async create(@Args({ name: 'input' }) input: InitialMessageCreateObject) {
        return await this.initialMessagesService.create(input);
    }

    @Query(returns => [InitialMessage], { name: 'getAllInitialMessage' })
    async findAll() {
        return await this.initialMessagesService.findAll();
    }

    @Query(returns => InitialMessage, { name: 'getInitialMessage' })
    async findOne(@Args({ name: 'id', type: () => Int }) id: number) {
        return await this.initialMessagesService.findOne(id);
    }

    @Query(returns => [InitialMessage]!, { name: 'searchInitialMessages' })
    async searchByMessageText(@Args({ name: 'body' }) body: string) {
        return await this.initialMessagesService.searchByText(body);
    }

    @Mutation(returns => InitialMessage, { name: 'updateInitialMessage' })
    async update(@Args({ name: 'input', type: () => InitialMessageUpdateObject! }) updateInput: InitialMessageUpdateObject) {
        return await this.initialMessagesService.update(updateInput);
    }

    @Mutation(returns => Boolean, { name: 'removeInitialMessage' })
    async remove(@Args('id', { type: () => Int! }) id: number) {
        return await this.initialMessagesService.delete(id);
    }
}
