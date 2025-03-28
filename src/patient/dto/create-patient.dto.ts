import { IsString, IsEmail, IsNumber, IsInt, Min, MaxLength, IsPhoneNumber, IsNotEmpty } from 'class-validator';

export class CreatePatientDto {
  @IsString()
  @MaxLength(50)
  @IsNotEmpty()
  Name: string;

  @IsNumber()
  @IsNotEmpty()
  age: number;

  @IsString()
  @IsNotEmpty()
  gender: string;

  @IsString()
  @IsNotEmpty()
  contactNumber: string;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsEmail()
  diagnosis: string;

  @IsString()
  @IsNotEmpty()
  doctorId: string;

  @IsString()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  password: string;

 
}
