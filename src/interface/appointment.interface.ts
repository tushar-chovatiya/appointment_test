
export interface AppointmentInterface {
    id?:number;
    appointmentDate:Date;
    appointmentStartTime:Date;
    appointmentEndTime:Date;
    userId:number;
    createdDate?:Date;
}