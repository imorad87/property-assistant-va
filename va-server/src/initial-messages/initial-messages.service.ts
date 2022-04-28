import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { InitialMessage } from '../entities/initial-message.entity';
import { Repository } from 'typeorm';
import { InitialMessageCreateObject, InitialMessageUpdateObject } from '../interfaces/types';

@Injectable()
export class InitialMessagesService {
    async findOneByText(initital_message: string) {
        const foundMessage = await this.initialMessagesRepo.createQueryBuilder("im")
            .where("im.message = :text", { text: `${initital_message}` })
            .getOne();

        return foundMessage;
    }

    private logger = new Logger(InitialMessagesService.name);

    constructor(@InjectRepository(InitialMessage) private initialMessagesRepo: Repository<InitialMessage>) { }

    async createMany(input: InitialMessageCreateObject[]) {
        const msgs = this.initialMessagesRepo.create(input);
        await this.initialMessagesRepo.insert(msgs);
        return msgs;
    }

    async create(input: InitialMessageCreateObject) {
        return await this.initialMessagesRepo.save(this.initialMessagesRepo.create(input));
    }

    async findAll() {
        return await this.initialMessagesRepo.find();
    }

    async getAllIds() {
        const ids = [];
        const keys = (await this.initialMessagesRepo.find()).values();
        for (const key of keys) {
            ids.push(key.id);
        }
        return ids;
    }

    async findOne(id: number): Promise<InitialMessage> {
        return await this.initialMessagesRepo.findOne(id);
    }

    async searchByText(body: string) {
        const foundMessage = await this.initialMessagesRepo.createQueryBuilder("im")
            .where("im.message like :text", { text: `%${body}%` })
            .getMany();

        return foundMessage;
    }

    async update(updateInput: InitialMessageUpdateObject) {
        await this.initialMessagesRepo.save(updateInput);
        return await this.findOne(updateInput.id);
    }

    async delete(id: number) {
        const initialMessage = await this.findOne(id);
        if (!initialMessage) {
            throw new Error(`InitialMessage with id ${id} doesn't exist`);
        }
        await this.initialMessagesRepo.delete(id);
        return true;
    }
}
