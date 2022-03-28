import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { Lead } from "./lead.entity";

@Entity()
export class PhoneNumber {

    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    number: string;

    @Column()
    status: string;

    @ManyToOne(() => Lead, (lead) => lead.phone_numbers)
    @JoinColumn({ name: 'lead_id' })
    lead: Lead

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;
}