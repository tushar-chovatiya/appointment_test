import { IsEmail, IsNotEmpty, IsString } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  public email: string;

  @IsString()
  public password: string;

  @IsString()
  @IsNotEmpty()
  public fullname: string;

  @IsString()
  public status: string;
}
