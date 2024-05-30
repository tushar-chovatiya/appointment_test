
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn} from "typeorm"

@Entity()
export class Appointment {

    @PrimaryGeneratedColumn()
    id: number

    @Column({type:'date'})
    appointmentDate: Date

    @Column()
    appointmentStartTime: Date

    @Column({type:'date'})
    appointmentEndTime: Date

    @Column()
    userId: number;
    
    @Column()
    @CreateDateColumn()
    createdDate: Date

}
