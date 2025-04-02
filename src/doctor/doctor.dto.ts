import { IsString, IsEmail, IsInt, Min } from 'class-validator';

export class CreateDoctorDto {
  @IsString()
  name: string;

  @IsEmail()
  email: string;

  @IsString()
  password: string;

  @IsInt()
  @Min(25)
  age: number;

  @IsString()
  specialist: string;

  @IsString()
  role: string = 'doctor';
}
