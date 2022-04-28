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

    @Field({ nullable: true })
    @Column({ default: null })
    status: string;

    @Field()
    @Column({ default: false })
    active: boolean;

    @Field()
    @Column()
    type: string;

    @Field({ nullable: true })
    @Column({ default: null })
    status_message: string;

    @Field({ nullable: true })
    @Column({ default: null })
    classification: string;

    @ManyToOne(() => PhoneNumber, phoneNumber => phoneNumber.messages, { nullable: false, onDelete: 'CASCADE', onUpdate: "CASCADE" })
    @Field(type => PhoneNumber!)
    phone_number: PhoneNumber

    @Field(type => GraphQLTimestamp)
    @CreateDateColumn()
    created_at: Date;

    @Field(type => GraphQLTimestamp)
    @UpdateDateColumn()
    updated_at: Date;

}