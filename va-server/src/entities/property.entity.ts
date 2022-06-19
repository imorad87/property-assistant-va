import { Field, GraphQLTimestamp, Int, ObjectType } from "@nestjs/graphql";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Contact } from "./contact.entity";

@ObjectType()
@Entity()
export class Property {

    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;

    @Field({ nullable: true })
    @Column({ default: null })
    address: string;

    @Field({ nullable: true })
    @Column({ default: null })
    type: string;

    @Field({ nullable: true })
    @Column({ default: null })
    state: string;

    @Field({ nullable: true })
    @Column({ default: null })
    apn: string;

    @Field({ nullable: true })
    @Column({ default: null })
    zip: string;

    @Field({ nullable: true })
    @Column({ default: null })
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