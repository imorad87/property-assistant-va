import { Constants } from "../enums/constants";
import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Campaign } from "./campaign.entity";
import { PhoneNumber } from "./phone-number.entity";
import { Field, GraphQLTimestamp, Int, ObjectType } from "@nestjs/graphql";

@ObjectType()
@Entity()
export class Contact {

    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;

    @Column()
    @Field()
    name: string;

    @Field()
    @Column({ default: true })
    active: boolean;
    
    @Field()
    @Column({ default: Constants.LEAD })
    status: string;

    @OneToMany(() => PhoneNumber, phoneNumber => phoneNumber.contact, { cascade: true, onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @Field(type => [PhoneNumber]!)
    phone_numbers: PhoneNumber[]

    @ManyToOne(
        () => Campaign,
        campaign => campaign.contacts
    )
    @JoinColumn({ name: 'campaign_id' })
    @Field(type => Campaign!)
    campaign: Campaign;

    @Field(type => GraphQLTimestamp)
    @CreateDateColumn()
    created_at: Date;

    @Field(type => GraphQLTimestamp)
    @UpdateDateColumn()
    updated_at: Date;


    
}