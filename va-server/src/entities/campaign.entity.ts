import { Constants } from "../enums/constants";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Contact } from "./contact.entity";
import { Field, GraphQLTimestamp, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class Campaign {
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;

    @Field()
    @Column({ default: `campaign_${new Date().valueOf()}` })
    title: string;

    @Field(type => Int)
    @Column({ default: 0 })
    total_records: number;

    @Field(type => Int)
    @Column({ default: 0 })
    duplicates_count: number;

    @Field(type => Int)
    @Column({ default: 0 })
    phone_numbers_count: number;

    @Field()
    @Column()
    status: string;

    @Field()
    @Column({ default: Constants.PARSING })
    parsing_status: string;

    @Field()
    @Column()
    file_path: string;

    @Field(type => Int)
    @Column({ default: 0 })
    failed_count: number;

    @Field(type => Int)
    @Column({ default: 0 })
    success_count: number;

    @OneToMany(() => Contact, lead => lead.campaign, { cascade: ['insert', 'update'] })
    @Field(type => [Contact!]!)
    contacts: Contact[]

    @CreateDateColumn()
    @Field(type => GraphQLTimestamp)
    created_at: Date;

    @UpdateDateColumn()
    @Field(type => GraphQLTimestamp)
    updated_at: Date;
}