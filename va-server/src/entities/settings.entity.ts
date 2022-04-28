import { Field, Int, ObjectType } from "@nestjs/graphql";
import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";



@Entity()
@ObjectType()

export class Settings{
    @PrimaryGeneratedColumn()
    @Field(type => Int)
    id: number;
    
    @Column()
    @Field(type => Int)
    initialMesaagesInterval: number;
    
}