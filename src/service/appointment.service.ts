import { LessThan, MoreThan } from 'typeorm';
import { UserStatus } from '../const/common.enums';
import { AppDataSource } from '../data-source';
import { Appointment } from '../entity/Appointments';
import { User } from '../entity/User';
import { AppointmentInterface } from '../interface/appointment.interface';

export default class UserService {
  private userRepository = AppDataSource.getRepository(User);
  private appointmentRepository = AppDataSource.getRepository(Appointment);

  async getAllAppointment(page: number, limit: number, search: string, status: string, orderBy: 'ASC' | 'DESC' = 'DESC'){
    const query = this.appointmentRepository
    .createQueryBuilder('appointment')
    .leftJoinAndSelect(User, 'user', 'user.id = appointment.userId')
    .addSelect(['user.fullName', 'user.email', 'user.status'])
    .orderBy('appointment.createdDate', orderBy)
    .skip((page - 1) * limit)
    .take(limit);
    
      if (search) {
        query.andWhere('user.fullName LIKE :search OR user.email LIKE :search', { search: `%${search}%` });
      }
  
      if (status) {
        query.andWhere('user.status = :status', { status });
      }

    const appointmentData = await query.getMany();
    const totalCount = await this.appointmentRepository.count();

    const totalPage = Math.ceil(totalCount / limit);
    
    if (page > totalPage) {
      page = 1;
    }
    return {totalPage, totalCount, currentPage: page, data: appointmentData };
  }

  async createAppointment(AppointmentData:AppointmentInterface) {

    const timeDiffrence = await this.checkTimeDiffrence(AppointmentData.appointmentStartTime, AppointmentData.appointmentEndTime)
    
    if (timeDiffrence > 1) {
      throw new Error("Appointment time should be less then 1 Hour");
    }

    const user = await this.userRepository.findOneBy({ id : AppointmentData.userId});
    if (!user || user.status !== UserStatus.Active) {
      throw new Error("User is not active or does not exist");
    }

    const currentDate = new Date();
    if (new Date(AppointmentData.appointmentDate).getTime() < currentDate.getTime()) {
        throw new Error("Appointment can be booked for future.");
    }

    const isExsist = await this.userAppointmentExsist(AppointmentData.userId,AppointmentData.appointmentDate)
    
    if (isExsist){
      throw new Error (`User have Appoinemnt for the date : ${AppointmentData.appointmentDate} `)
    }

    const isSlotAvailable = await this.isSlotEmpty(AppointmentData.appointmentDate,AppointmentData.appointmentStartTime, AppointmentData.appointmentEndTime)
   
    if (!isSlotAvailable){
      throw new Error (`User have Appoinemnt for the date : ${AppointmentData.appointmentDate} `)
    }

    const appointment = this.appointmentRepository.create(AppointmentData);
    await this.appointmentRepository.save(appointment);
    return appointment;
   
  }

  async userAppointmentExsist(userId:number, appointmentDate: Date){
    const userAppointmentsCount = await this.appointmentRepository.count( {
      where: {
        userId: userId,
        appointmentDate: appointmentDate
      }
    })

    if (userAppointmentsCount === 0) {
      return false;
    }else {
      return true;
    }
  }
  async isSlotEmpty( appointmentDate: Date, appointmentStartTime: Date, appointmentEndTime: Date){

    const avilableSlot = await this.appointmentRepository.count({
      where: {
        appointmentDate: appointmentDate,
        appointmentStartTime: LessThan(appointmentEndTime),
        appointmentEndTime: MoreThan(appointmentStartTime),
      },
    });
    
    return avilableSlot === 0;
  }


  async getOneAppointment(id: number) {
    const appointment = await this.appointmentRepository.findOneBy({ id });
    if (appointment) {
      return appointment;
    } else {
      throw new Error('appointment not found');
    }
  }

  async checkTimeDiffrence(startTime:Date, endTime:Date) {
     
    const StartTime = new Date(startTime).getTime()
    const EndTime =   new Date(endTime).getTime()

    const timeDiffrence = Math.abs(StartTime - EndTime)
    const hourDiffrence = timeDiffrence / (1000 * 60 * 60)
    return hourDiffrence;
  }
}
