import { Field, GraphQLTimestamp, Int, ObjectType } from "@nestjs/graphql";
import { AfterLoad, Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Contact } from "./contact.entity";
import { SMSMessage } from "./sms-message.entity";

@ObjectType()
@Entity()
export class PhoneNumber {

    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;

    @Field()
    @Column({ unique: true })
    number: string;

    @Field()
    @Column({ unique: true })
    number_base10: string;

    @Field()
    @Column({ default: true })
    active: boolean;

    @Field({ nullable: true })
    @Column({ nullable: true })
    remark: string;

    @Field({ nullable: true })
    @Column({ default: null })
    deactivation_reason: string;

    @ManyToOne(() => Contact, (contact) => contact.phone_numbers, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
    @JoinColumn({ name: 'contact_id' })
    @Field(type => Contact!)
    contact: Contact

    @Field(type => [SMSMessage]!)
    @OneToMany(() => SMSMessage, smsMessage => smsMessage.phone_number, { cascade: true })
    messages: SMSMessage[];

    @Field(type => GraphQLTimestamp)
    @CreateDateColumn()
    created_at: Date;

    @Field(type => GraphQLTimestamp)
    @UpdateDateColumn()
    updated_at: Date;

    @Column({ select: false, default: null })
    @Field(type => Int, { nullable: true })
    messagesCount: number;

    @AfterLoad()
    getMessagesCount() {
        this.messagesCount = this.messages ? this.messages.length > 0 ? this.messages.length : 0 : 0;
    }
}