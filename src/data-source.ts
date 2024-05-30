import { DataSource } from "typeorm"
import { User } from "./entity/User"
import { Appointment } from "./entity/Appointments"


export const AppDataSource = new DataSource({
    type: "postgres",
    host: 'localhost',
    port: 5432,
    username: "postgres",
    password: '12345',
    database: 'appointment_test',
    synchronize: true,
    entities: [User, Appointment],
    migrations: [],
    subscribers: [],
})
