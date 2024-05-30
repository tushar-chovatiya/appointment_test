import { IsDate, IsNumber } from 'class-validator';

export class CreateAppointmentDto {

  @IsNumber()
  public userId: number;

  @IsDate()
  public appointmentDate: Date;

  @IsDate()
  public appointmentStartTime: Date;

  @IsDate()
  public appointmentEndTime: Date;
}
