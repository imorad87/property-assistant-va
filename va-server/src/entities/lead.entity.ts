import { Constants } from "../enums/constants";
import { Column, CreateDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { PhoneNumber } from "./phone-number.entity";

@Entity()
export class Lead {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    first_name: string;

    @Column()
    last_name: string;

    @Column()
    status: string;

    @OneToMany(() => PhoneNumber, phoneNumber => phoneNumber.lead)
    phone_numbers: PhoneNumber[]

    @CreateDateColumn()
    created_at: Date;
    @UpdateDateColumn()
    updated_at: Date;
}