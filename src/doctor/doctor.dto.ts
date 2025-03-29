import { IsEmail, IsNotEmpty, IsString, Min, IsInt } from 'class-validator';

export class DoctorDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

  @IsInt()
  @Min(25) 
  age: number;
}
