import { Request, Response } from "express";
import AppointmentService from "../service/appointment.service";
import { OrderBy, UserStatus } from "../const/common.enums";

const appointmentService = new AppointmentService();

export class AppointmentController {


  static async createAppointment (req: Request, res: Response) {
    try {
        const appointmentData = req.body;
        const AppointmentData = await appointmentService.createAppointment(appointmentData);
        res.status(201).json({ data: AppointmentData, message: 'appointment Created Successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
  };

  static async getAllAppointments(req: Request, res: Response) {
      const { page = 1, limit = 10, search = '', status, orderBy } = req.query;
      try {
        const users = await appointmentService.getAllAppointment(
          Number(page),
          Number(limit),
          search as string,
          status as UserStatus,
          orderBy as OrderBy
        );
        res.status(200).json({message:'Appointment list retrived', data: users});
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    }

    static async getOneAppointment(req: Request, res: Response) {
      const { id } = req.params;
      try {
        const user = await appointmentService.getOneAppointment(Number(id));
        res.status(200).json({message:'Appointment data retrived', data: user});
      } catch (error) {
        res.status(404).json({ message: error.message });
      }
    }


}
