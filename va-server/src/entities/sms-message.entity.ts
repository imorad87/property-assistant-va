import { Constants } from "../enums/constants";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class SMSMessage {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    body: string;

    @Column()
    status: string;

    @Column()
    type: string;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;

}