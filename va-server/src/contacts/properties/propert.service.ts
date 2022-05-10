import { Injectable, Logger } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { IPropertyCreateObject, IPropertyUpdateObject } from 'src/interfaces/types';
import { Repository } from 'typeorm';
import { Property } from '../../entities/property.entity';

@Injectable()
export class PropertiesService {

    private logger = new Logger(PropertiesService.name);

    constructor(@InjectRepository(Property) private propertiesRepo: Repository<Property>) { }

    async create(property: IPropertyCreateObject) {
        const savedProperty = await this.propertiesRepo.save(this.propertiesRepo.create(property));
        return savedProperty;
    }

    async remove(id: number) {
        const property = await this.findOne(id);
        if (!property) {
            throw new Error(`Property with id ${id} doesn't exist`);
        }
        await this.propertiesRepo.delete(id);
        return true;
    }

    async findOne(id: number) {
        return await this.propertiesRepo.findOne({ where: { id } });
    }

    async findAll() {
        return await this.propertiesRepo.find();
    }

    async update(input: IPropertyUpdateObject): Promise<Property> {
        const updatedProperty = await this.propertiesRepo.save({ ...input }, { reload: true });
        return this.findOne(input.id);
    }

    async getContacts(id: number) {
        return (await this.propertiesRepo.findOne({ where: { id }, relations: ['contacts'] })).contacts;
    }
}