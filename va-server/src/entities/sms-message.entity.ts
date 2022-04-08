import { Field, GraphQLTimestamp, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PhoneNumber } from "./phone-number.entity";

@ObjectType()
@Entity()
export class SMSMessage {

    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;
    
    @Field()
    @Column()
    body: string;
    
    @Field()
    @Column()
    status: string;
    
    @Field()
    @Column()
    type: string;
    
    @ManyToOne(() => PhoneNumber, phoneNumber => phoneNumber.messages, { nullable: false })
    @Field(type => PhoneNumber!)
    phone_number: PhoneNumber
    
    @Field(type => GraphQLTimestamp)
    @CreateDateColumn()
    created_at: Date;
    
    @Field(type => GraphQLTimestamp)
    @UpdateDateColumn()
    updated_at: Date;

}