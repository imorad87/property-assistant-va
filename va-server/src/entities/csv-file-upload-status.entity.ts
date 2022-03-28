import { Constants } from "src/enums/constants";
import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class CSVFileUploadStatus {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ default: 0 })
    leads_count: number;

    @Column({ default: 0 })
    phone_numbers_count: number;

    @Column({ default: Constants.PARSING })
    status: string;
    
    @Column()
    file_path: string;

    @Column({ default: 0 })
    failed_count: number;

    @Column({ default: 0 })
    sucess_count: number;

    @CreateDateColumn()
    created_at: Date;

    @UpdateDateColumn()
    updated_at: Date;


}