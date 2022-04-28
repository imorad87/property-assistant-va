import { Field, GraphQLTimestamp, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Contact } from "./contact.entity";
import { PhoneNumber } from "./phone-number.entity";

@ObjectType()
@Entity()
export class Property {

    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;

    @Field()
    @Column()
    address: string;

    @Field()
    @Column()
    type: string;

    @Field()
    @Column()
    state: string;

    @Field()
    @Column()
    apn: string;

    @Field()
    @Column()
    zip: string;

    @Field()
    @Column()
    county: string;

    @OneToMany(() => Contact, contact => contact.property, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @Field(type => [Contact]!)
    contacts: Contact[]

    @Field(type => GraphQLTimestamp)
    @CreateDateColumn()
    created_at: Date;

    @Field(type => GraphQLTimestamp)
    @UpdateDateColumn()
    updated_at: Date;
}