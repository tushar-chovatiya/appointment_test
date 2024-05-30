import { Router } from "express"; 
import { AppointmentController } from '../controller/appointment.controller'
import validationMiddleware from "../middleware/validation.midlleware";
import { CreateAppointmentDto } from "../dtos/appointment.dto";
const router = Router();

router.get("/appointments", AppointmentController.getAllAppointments);
router.post("/appointments", validationMiddleware(CreateAppointmentDto, 'body'),AppointmentController.createAppointment)
router.get("/appointments/:id", AppointmentController.getOneAppointment);

export default router;